import type { Action, Observation } from '../engine/state';
import type { PlayerAgent } from './types';
import type { ActionOrderRule, BetType, CompositionSelector, EvaluatorKind } from '../config/types';
import type { ResolvedPools } from '../evaluation/composition';
import { enumerateCompositions } from '../evaluation/composition';
import { resolveHand, resolveHiLo } from '../evaluation/resolver';
import { createRng } from '../engine/rng';
import { discardAction } from './discard';

type Rng = ReturnType<typeof createRng>;

// Dense high-hand rank space shared by every high lookup table (5, 6 and
// 7-card variants all map into it), so a normalized strength is comparable
// across streets and games.
const MAX_RANK_5 = 7462;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const rankOf = (c: number): number => c % 13;
const suitOf = (c: number): number => Math.floor(c / 13);
const findType = (legal: Action[], type: Action['type']): Action | undefined =>
  legal.find((a) => a.type === type);

/**
 * Tunable personality for {@link createSmartBot}. Aggressiveness drives how
 * often the bot bets/raises and how big; tightness drives how much hand
 * strength is required to keep playing. Both are 0..1. `bluffiness` and
 * `sizing` are optional and default to 0.08 and 0.7.
 */
export interface SmartBotParams {
  /** Seed for the bot's own tie-break rolls (bluffing). The engine seeds the
   *  dealing, so a fixed seed reproduces the whole hand. */
  seed: number;
  /** 0..1: how readily it bets/raises instead of checking/calling. */
  aggression: number;
  /** 0..1: how much strength it demands from its hand to continue. */
  tightness: number;
  /** 0..1: how often it bets a weak hand when the action is free. */
  bluffiness?: number;
  /** Preferred bet as a fraction of the pot. */
  sizing?: number;
}

interface NormalizedParams {
  seed: number;
  aggression: number;
  tightness: number;
  bluffiness: number;
  sizing: number;
}

function normalizeParams(p: SmartBotParams): NormalizedParams {
  return {
    seed: p.seed,
    aggression: clamp01(p.aggression),
    tightness: clamp01(p.tightness),
    bluffiness: clamp01(p.bluffiness ?? 0.08),
    sizing: Math.max(0.05, p.sizing ?? 0.7),
  };
}

/** Static facts about the game being played, derived from the hand config
 *  attached to the observation (the engine always provides it). Falls back to
 *  shape inference when no config is present. */
export interface GameType {
  /** Total betting streets in the hand (hold'em 4, stud 5, draw 2-4). */
  streets: number;
  /** Hole cards dealt on the first street (2 hold'em/stud, 4 omaha, 5 draw). */
  holeCards: number;
  hasUpCards: boolean; // stud-style game with public up cards
  actionOrder: ActionOrderRule; // current street's first-to-act rule
  betting: BetType; // current street's betting structure
  isLow: boolean; // lowball objective (A5-low / 2-7-low / low8 / low9)
  isHilo: boolean; // split-pot hi-lo
  lowQualify: 8 | 9 | undefined;
  composition: CompositionSelector | undefined; // exact best-hand composition
}

const LOW_KINDS = new Set<EvaluatorKind>(['A5-low', '2-7-low', 'low8', 'low9']);

function gameTypeOf(obs: Observation): GameType {
  const cfg = obs.handCfg;
  const street = cfg?.streets[obs.streetIndex];
  const kind = obs.evaluator;
  return {
    streets: cfg?.streets.length ?? 0,
    holeCards: cfg?.streets[0]?.deal.holeDown ?? obs.myHole.length,
    hasUpCards: obs.up.length > 0 || !!cfg?.streets.some((s) => s.deal.playerUp > 0),
    actionOrder:
      street?.actionOrder ??
      (obs.up.length > 0 && obs.streetIndex === 0 ? 'low-upcard' : 'left-of-button'),
    betting: street?.betting.type ?? 'no-limit',
    isLow: LOW_KINDS.has(kind),
    isHilo: kind === 'hi-lo',
    lowQualify: cfg?.evaluation.lowQualify,
    composition: cfg?.evaluation.composition,
  };
}

/** Everything the decision policy reads out of one observation. */
export interface BotContext {
  myStack: number;
  toCall: number;
  pot: number;
  potOdds: number; // toCall / (pot + toCall), 0 when the action is free
  spr: number; // myStack / pot (capped at 10) — low = short stack
  chipLead: number; // myStack / biggest other stack
  opponents: number; // active players besides me
  behind: number; // active players who act after me this street
  position: number; // 1 = last to act, 0 = first to act
  pressure: number; // bet/raise weight faced this street from others
  facingBet: boolean;
  free: boolean; // a check is legal
  streetIndex: number;
  activeCount: number;
  game: GameType;
}

/** Active seats after me in the button-relative action order. */
function countBehind(obs: Observation): number {
  const n = obs.players.length;
  if (n === 0) return 0;
  const order: number[] = [];
  for (let i = 1; i <= n; i++) order.push((obs.buttonSeat + i) % n);
  const myIdx = order.indexOf(obs.seat);
  let behind = 0;
  for (let i = myIdx + 1; i < order.length; i++) {
    const p = obs.players[order[i]!];
    if (p && p.status === 'active') behind++;
  }
  return behind;
}

// Stud bring-in ordering ('low-upcard' / 'high-hand'): the qualifying seat is
// the one with the lowest (or highest) upcard — ace low for A-5 low games —
// and action then continues clockwise. Mirrors the engine's cardKey ordering.
function countBehindUpcard(obs: Observation, order: ActionOrderRule, aceLow: boolean): number {
  const lowest = order === 'low-upcard';
  let start = -1;
  let bestKey = lowest ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  for (const u of obs.up) {
    const c = u.cards[0];
    if (c === undefined) continue;
    const r = c % 13;
    const rank = aceLow ? (r === 12 ? 0 : r + 1) : r;
    const k = rank * 4 + Math.floor(c / 13);
    if ((lowest && k < bestKey) || (!lowest && k > bestKey)) {
      bestKey = k;
      start = u.seat;
    }
  }
  if (start === -1) return countBehind(obs);
  const n = obs.players.length;
  const myIdx = (obs.seat - start + n) % n;
  let behind = 0;
  for (let k = myIdx + 1; k < n; k++) {
    const p = obs.players[(start + k) % n];
    if (p && p.status === 'active') behind++;
  }
  return behind;
}

export function analyzeObservation(obs: Observation): BotContext {
  const players = obs.players;
  const me = players[obs.seat] ?? players.find((p) => p.seat === obs.seat);
  const myStack = me?.stack ?? 0;
  const others = players.filter((p) => p.seat !== obs.seat && p.status === 'active');
  const maxOther = others.reduce((m, p) => Math.max(m, p.stack), 0);
  const activeCount = players.filter((p) => p.status === 'active').length;
  const game = gameTypeOf(obs);
  const behind =
    game.actionOrder === 'low-upcard' || game.actionOrder === 'high-hand'
      ? countBehindUpcard(obs, game.actionOrder, obs.evaluator === 'A5-low')
      : countBehind(obs);
  const position = activeCount <= 1 ? 1 : 1 - behind / (activeCount - 1);
  const pot = obs.pot;
  const toCall = obs.toCall;
  const potOdds = toCall > 0 ? toCall / (pot + toCall) : 0;
  const spr = pot > 0 ? Math.min(10, myStack / pot) : 10;
  const chipLead = others.length > 0 ? myStack / Math.max(1, maxOther) : 1;
  let pressure = 0;
  for (const a of obs.actionLog) {
    if (a.streetIndex !== obs.streetIndex || a.seat === obs.seat) continue;
    if (a.type === 'bet') pressure += 1;
    else if (a.type === 'raise' || a.type === 'allin') pressure += 2;
  }
  return {
    myStack,
    toCall,
    pot,
    potOdds,
    spr,
    chipLead,
    opponents: Math.max(0, activeCount - 1),
    behind,
    position,
    pressure,
    facingBet: !!findType(obs.legalActions, 'fold'),
    free: !!findType(obs.legalActions, 'check'),
    streetIndex: obs.streetIndex,
    activeCount,
    game,
  };
}

/**
 * Minimum hand strength required to continue, given the context. Higher
 * tightness, worse position, more opponents/pressure and shorter stacks raise
 * the bar; cheap calls (pot odds) lower it. Desperation (pot >> stack) makes a
 * short stack gamble. Chip leaders play looser and bully.
 */
export function requiredStrength(ctx: BotContext, tightness: number): number {
  const t = clamp01(tightness);
  let r = 0.3 + 0.28 * t;
  r += (1 - ctx.position) * 0.16;
  if (ctx.streetIndex === 0) r += ctx.behind * 0.03;
  else r += Math.max(0, ctx.opponents) * 0.035;
  r += ctx.pressure * 0.06;
  r -= ctx.potOdds * 0.55;
  const spr = ctx.spr;
  if (spr <= 0.25) r -= 0.2;
  else if (spr < 1.5) r += 0.05;
  else if (spr >= 8) r += 0.03;
  if (ctx.chipLead >= 1.4) r -= 0.05;
  else if (ctx.chipLead <= 0.35) r += 0.04;
  // game-type calibration: 4-card (Omaha) hands run stronger so demand more;
  // low games materialise slowly, so tighten until the low has a chance to land.
  if (ctx.game.holeCards === 4) r += 0.08;
  if (ctx.game.isLow) r += 0.03;
  return clamp01(r);
}

function chenPoint(r: number): number {
  if (r === 12) return 10; // A
  if (r >= 9) return r - 3; // J=6, Q=7, K=8
  return (r + 2) / 2; // 2=1 ... T=5
}

/**
 * Chen-formula starting-hand value scaled to 0..1 (AA = 1.0). Used preflop as
 * the "hand strength" for deciding which range of starting hands to play.
 */
export function chenStrength(hole: number[]): number {
  if (hole.length < 2) return 0;
  const r0 = hole[0]! % 13;
  const r1 = hole[1]! % 13;
  const hi = Math.max(r0, r1);
  const lo = Math.min(r0, r1);
  let v: number;
  if (hi === lo) {
    v = Math.max(5, 2 * chenPoint(hi));
  } else {
    v = chenPoint(hi);
    if (suitOf(hole[0]!) === suitOf(hole[1]!)) v += 2;
    const gap = hi - lo;
    if (gap === 1) v += 1;
    else if (gap === 2) v -= 1;
    else if (gap === 3) v -= 2;
    else if (gap >= 4) v -= 5;
  }
  return clamp01(Math.max(1, v) / 20);
}

function upCardsOf(obs: Observation): number[] {
  return obs.up.find((u) => u.seat === obs.seat)?.cards ?? [];
}

// First-street hand selection, game-type aware: low games judge the low
// potential of the visible cards, hi-lo games play whichever half is strongest,
// high games use Chen-style values scaled to the hole-card count.
function startingStrength(obs: Observation): number {
  const g = gameTypeOf(obs);
  if (g.isLow) return lowStartingStrength(obs);
  if (g.isHilo) return hiloStartingStrength(obs);
  return highStartingStrength(obs);
}

// High games: hold'em (2 cards) uses Chen; omaha (4) uses the best two-card
// combo discounted because everyone holds four; stud adds the up-card; draw
// games evaluate the dealt 5-card hand directly.
function highStartingStrength(obs: Observation): number {
  const hole = obs.myHole;
  if (hole.length >= 5) return madeStrength(obs);
  if (hole.length === 4) {
    let best = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) best = Math.max(best, chenStrength([hole[i]!, hole[j]!]));
    }
    let s = best * 0.9; // 4-card hands are stronger: discount the two-card peak
    let suitedPairs = 0;
    const pairRanks = new Set<number>();
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        if (suitOf(hole[i]!) === suitOf(hole[j]!)) suitedPairs++;
        if (rankOf(hole[i]!) === rankOf(hole[j]!)) pairRanks.add(rankOf(hole[i]!));
      }
    }
    if (suitedPairs >= 2) s += 0.05; // double-suited
    if (pairRanks.size >= 2) s += 0.04; // two pairs
    return clamp01(s + 0.04);
  }
  let base = chenStrength(hole.slice(0, 2));
  const up = upCardsOf(obs);
  if (up.length > 0) {
    const upRank = up[0]! % 13;
    const holeRanks = new Set(hole.map(rankOf));
    if (holeRanks.has(upRank))
      base += 0.12; // made pair
    else if (up.some((c) => hole.some((h) => suitOf(c) === suitOf(h)))) base += 0.03;
    else if (up.some((c) => hole.some((h) => Math.abs((c % 13) - (h % 13)) <= 1))) base += 0.03;
  }
  return clamp01(base);
}

// Low games (Razz / stud low third street, lowball draw predraw): how good is
// the visible low, penalised for pairs and dead cards above the qualifier.
function lowStartingStrength(obs: Observation): number {
  const kind = obs.evaluator;
  const aceLow = kind !== '2-7-low';
  const cards = [...obs.myHole, ...upCardsOf(obs)];
  if (cards.length === 0) return 0;
  const distinct = new Set<number>();
  for (const c of cards) distinct.add(lowVal(c % 13, aceLow));
  const vals = [...distinct].sort((a, b) => a - b).slice(0, 5);
  const pairPenalty = distinct.size < cards.length ? 0.15 : 0;
  const scale = Math.min(vals.length, cards.length) / Math.max(1, cards.length);
  const q = kind === 'A5-low' || kind === '2-7-low' ? 14 : kind === 'low9' ? 9 : 8;
  const take = vals.filter((v) => v <= q);
  const deadPenalty = vals.length > take.length ? 0.1 : 0;
  return clamp01(scale * lowQuality(kind, take) - pairPenalty - deadPenalty);
}

// Split-pot games: the hand is worth as much as its strongest half (scoop
// potential), with a slight edge given to the high side.
function hiloStartingStrength(obs: Observation): number {
  const high = highStartingStrength(obs);
  const low = lowStartingStrength(obs);
  return clamp01(Math.max(high, low * 0.95));
}

// Card value for low games: 2 = 2 ... A = 14 (high, hurts) in 2-7; in A-5 the
// ace is the best low card (1) and straights/flushes are ignored.
const lowVal = (r: number, aceLow: boolean): number =>
  aceLow ? (r === 12 ? 1 : r + 2) : r === 12 ? 14 : r + 2;

// 0..1 quality of a sorted list of distinct low card values (2..14 scale, ace
// low for A-5 kinds) — 1 is the best possible set for the objective.
function lowQuality(kind: EvaluatorKind, vals: number[]): number {
  const k = vals.length;
  if (k === 0) return 0;
  const sum = vals.reduce((a, b) => a + b, 0);
  if (kind !== '2-7-low') {
    const best = (k * (k + 1)) / 2; // A,2,3,...
    const q = kind === 'A5-low' ? 14 : kind === 'low9' ? 9 : 8;
    const worst = (k * (2 * q - k + 1)) / 2; // q-k+1..q
    return clamp01(1 - (sum - best) / Math.max(1, worst - best));
  }
  // 2-7 low: a 5-card low is never a straight, so 2-3-4-5-7 (sum 21) is the
  // best possible and T-J-Q-K-A (sum 60) the worst.
  const best = k === 5 ? 21 : (k * (k + 3)) / 2;
  const worst = (k * (29 - k)) / 2;
  return clamp01(1 - (sum - best) / Math.max(1, worst - best));
}

// 0..1 "how good is this 5-card low" — 1 is the best possible low for the kind.
// Pairs and cards above the qualifier disqualify the combo.
function lowStrength(kind: EvaluatorKind, five: number[]): number {
  const aceLow = kind !== '2-7-low';
  const vals = five.map((c) => lowVal(c % 13, aceLow)).sort((a, b) => a - b);
  if (new Set(vals).size !== 5) return 0; // paired 5-card combo: no low
  if (aceLow && kind !== 'A5-low') {
    const qualifier = kind === 'low9' ? 9 : 8;
    if (vals.some((v) => v > qualifier)) return 0;
  }
  return lowQuality(kind, vals);
}

// Low objective with fewer than five distinct low cards (early stud streets):
// score the best partial low, scaled by how many cards are still available.
function partialLowStrength(kind: EvaluatorKind, pools: ResolvedPools): number {
  const aceLow = kind !== '2-7-low';
  const distinct = new Set<number>();
  for (const c of [...pools.hole, ...pools.door, ...pools.community]) {
    distinct.add(lowVal(c % 13, aceLow));
  }
  const vals = [...distinct].sort((a, b) => a - b).slice(0, 5);
  if (vals.length === 0) return 0;
  const q = kind === 'A5-low' || kind === '2-7-low' ? 14 : kind === 'low9' ? 9 : 8;
  const take = vals.filter((v) => v <= q);
  return (Math.min(vals.length, 5) / 5) * lowQuality(kind, take);
}

// No full 5-card hand available yet (early stud streets): estimate from the
// visible cards — a pair is worth a lot more than a bare high card.
function partialStrength(pools: ResolvedPools): number {
  const cards = [...pools.hole, ...pools.door];
  if (cards.length === 0) return 0.1;
  const ranks = cards.map(rankOf);
  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  let pairRank = -1;
  for (const [r, n] of counts) if (n >= 2 && r > pairRank) pairRank = r;
  const top = Math.max(...ranks);
  return pairRank >= 0 ? 0.45 + (pairRank / 12) * 0.25 : 0.15 + (top / 12) * 0.25;
}

// Best-5 selector inferred from the number of private/public cards dealt.
function selectorFor(obs: Observation): CompositionSelector {
  const nHole = obs.myHole.length;
  const nUp = upCardsOf(obs).length;
  if (nHole === 4) {
    return {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 2 },
        { pool: 'community', min: 0, max: 3 },
      ],
    };
  }
  if (nHole === 5) {
    return { total: 5, pools: [{ pool: 'hole', exactly: 5 }] };
  }
  if (nUp > 0) {
    return { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] };
  }
  return {
    total: 5,
    pools: [
      { pool: 'hole', min: 0, max: 2 },
      { pool: 'community', min: 0, max: 5 },
    ],
  };
}

/**
 * Normalized strength (0..1) of the current best made hand, re-computed on
 * every street from the hole cards plus whatever is on the board. High games
 * use the library evaluator on the dense 7462-scale; low and hi-lo games use
 * an A-5 / 2-7 low heuristic.
 */
export function madeStrength(obs: Observation): number {
  const pools: ResolvedPools = { hole: obs.myHole, door: upCardsOf(obs), community: obs.community };
  const kind = obs.evaluator;
  const g = gameTypeOf(obs);
  const selector = g.composition ?? selectorFor(obs);
  if (kind === 'A5-low' || kind === '2-7-low' || kind === 'low8' || kind === 'low9') {
    // Enumerate the game's legal compositions (e.g. omaha uses exactly two hole
    // cards) and score the best qualifying low among them. A partial low only
    // counts when no full 5-card hand exists yet (early stud streets).
    let best = -1;
    let sawCombo = false;
    for (const combo of enumerateCompositions(selector, pools)) {
      if (combo.length === 5) {
        sawCombo = true;
        best = Math.max(best, lowStrength(kind, combo));
      }
    }
    if (!sawCombo) {
      // The configured composition cannot form a hand yet — retry with the
      // shape-inferred selector (also covers synthetic observations).
      for (const combo of enumerateCompositions(selectorFor(obs), pools)) {
        if (combo.length === 5) {
          sawCombo = true;
          best = Math.max(best, lowStrength(kind, combo));
        }
      }
    }
    if (best >= 0) return best;
    return partialLowStrength(kind, pools);
  }
  if (kind === 'hi-lo') {
    const qualifier = g.lowQualify ?? 8;
    const r = resolveHiLo(pools, selector, qualifier);
    let s = Number.isFinite(r.high) ? r.high / MAX_RANK_5 : partialStrength(pools);
    const lowKind: EvaluatorKind = qualifier === 9 ? 'low9' : 'low8';
    let lowBest = -1;
    let sawCombo = false;
    for (const combo of enumerateCompositions(selector, pools)) {
      if (combo.length === 5) {
        sawCombo = true;
        lowBest = Math.max(lowBest, lowStrength(lowKind, combo));
      }
    }
    if (sawCombo) {
      if (lowBest >= 0) s = Math.max(s, lowBest * 0.95);
    } else {
      s = Math.max(s, partialLowStrength(lowKind, pools) * 0.95);
    }
    return clamp01(s);
  }
  const r = resolveHand(pools, selector, 'high');
  if (!Number.isFinite(r.rank)) return partialStrength(pools);
  return clamp01(r.rank / MAX_RANK_5);
}

function fourToStraight(ranks: Set<number>): boolean {
  for (let start = 0; start <= 8; start++) {
    let n = 0;
    for (let i = 0; i < 5; i++) if (ranks.has(start + i)) n++;
    if (n >= 4) return true;
  }
  let wheel = 0;
  for (const r of [0, 1, 2, 3, 12]) if (ranks.has(r)) wheel++;
  return wheel >= 4;
}

// Small strength bonus for flush/straight draws, decaying toward the final
// street (the bot knows the street count from the game config).
export function drawBonus(obs: Observation): number {
  const g = gameTypeOf(obs);
  if (g.isLow) return 0;
  const cards = [...obs.myHole, ...upCardsOf(obs), ...obs.community];
  if (obs.streetIndex <= 0 || cards.length < 5) return 0;
  let bonus = 0;
  const suits = new Map<number, number>();
  for (const c of cards) suits.set(suitOf(c), (suits.get(suitOf(c)) ?? 0) + 1);
  for (const n of suits.values()) if (n >= 4) bonus += 0.07;
  if (fourToStraight(new Set(cards.map(rankOf)))) bonus += 0.06;
  const decay =
    g.streets > 1
      ? Math.max(0, 1 - obs.streetIndex / (g.streets - 1))
      : Math.max(0, 1 - obs.streetIndex * 0.25);
  return bonus * decay;
}

function strengthOf(obs: Observation): number {
  if (obs.streetIndex === 0 && obs.myHole.length < 5) return startingStrength(obs);
  return madeStrength(obs);
}

function betSize(ctx: BotContext, p: NormalizedParams): number {
  const factor = 0.8 + 0.6 * p.aggression;
  const lead = ctx.chipLead >= 1.4 ? 1.25 : ctx.chipLead <= 0.35 ? 0.8 : 1;
  return p.sizing * factor * lead * ctx.pot;
}

function raiseTo(ctx: BotContext, p: NormalizedParams): number {
  return ctx.toCall + betSize(ctx, p);
}

function sized(a: Action, target: number): Action {
  if (a.type === 'bet') {
    const min = a.min ?? a.amount ?? 1;
    const max = a.max ?? min;
    return { ...a, amount: Math.round(Math.max(min, Math.min(max, target))) };
  }
  if (a.type === 'raise') {
    const min = a.min ?? a.to ?? 1;
    const max = a.max ?? min;
    return { ...a, to: Math.round(Math.max(min, Math.min(max, target))) };
  }
  return { ...a };
}

/**
 * A position- and strength-aware bot whose personality is fully described by
 * {@link SmartBotParams}. It is game-type aware: it reads the hand config on
 * every observation and adapts hand selection and context evaluation to the
 * game — hold'em, Omaha (4-card handicap, exactly-two composition), stud
 * (up-card position and third-street low selection), lowball (Razz / triple
 * draw judge the low), hi-lo (plays whichever half is strongest) and draw
 * games. Each decision re-derives a required-strength bar from the context
 * (position, players behind, bets/raises faced, pot odds, stack depth, chip
 * lead) and compares its current strength — Chen value preflop, made hand +
 * draw bonus postflop — to fold, call, raise, bet, check or (rarely) shove.
 */
export function createSmartBot(params: SmartBotParams): PlayerAgent {
  const p = normalizeParams(params);
  const rng = createRng(p.seed);
  const nextUnit = (): number => rng.nextInt(1000) / 1000;
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      if (legal.length === 0) {
        return { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
      }
      const ctx = analyzeObservation(obs);
      const strength = clamp01(strengthOf(obs) + drawBonus(obs));
      const required = requiredStrength(ctx, p.tightness);
      const allin = findType(legal, 'allin');
      if (allin) {
        const desperate = ctx.myStack <= ctx.pot * 0.25 && strength >= required - 0.08;
        const committed = ctx.facingBet && ctx.toCall >= 0.6 * ctx.myStack && strength >= required;
        const nuts = ctx.streetIndex > 0 && strength >= 0.93;
        if (desperate || committed || nuts) return allin;
      }
      if (strength < required) {
        if (
          ctx.facingBet &&
          ctx.potOdds >= 0.25 &&
          strength >= 0.25 &&
          strength + ctx.potOdds * 0.6 >= required
        ) {
          const call = findType(legal, 'call');
          if (call) return call;
        }
        if (ctx.free) {
          const window = strength >= required - 0.14 - 0.1 * p.aggression && strength >= 0.15;
          if (window && nextUnit() < p.bluffiness) {
            const b = findType(legal, 'bet');
            if (b) return sized(b, betSize(ctx, p));
          }
          const ck = findType(legal, 'check');
          if (ck) return ck;
        }
        const fold = findType(legal, 'fold');
        if (fold) return fold;
        return legal[0]!;
      }
      if (ctx.facingBet) {
        const raiseBar = required + 0.16 - 0.24 * p.aggression;
        if (strength >= raiseBar) {
          const r = findType(legal, 'raise');
          if (r) return sized(r, raiseTo(ctx, p));
        }
        const call = findType(legal, 'call');
        if (call) return call;
        const fold = findType(legal, 'fold');
        if (fold) return fold;
        return legal[0]!;
      }
      const betBar = required + 0.08 - 0.2 * p.aggression;
      if (strength >= betBar) {
        const b = findType(legal, 'bet');
        if (b) return sized(b, betSize(ctx, p));
        const r = findType(legal, 'raise');
        if (r) return sized(r, raiseTo(ctx, p));
      }
      const ck = findType(legal, 'check');
      if (ck) return ck;
      return legal[0]!;
    },
  };
}
