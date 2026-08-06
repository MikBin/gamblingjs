import type { HandConfig, TableConfig } from '../config/types';
import type {
  Action,
  ActionRecord,
  GameEvent,
  GameState,
  Observation,
  PlayerPublicView,
  PotWinner,
  PublicObservation,
  PublicUpCards,
  SeatState,
} from './state';
import { bigBlindOf, computeLegalActions, streetMaxWager, toCallFor } from './actions';
import { resolveHand } from '../evaluation/resolver';
import type { ResolvedPools } from '../evaluation/composition';
import type { PlayerAgent } from '../agents/types';
import type { RngSource } from './rng';
import { validateHandConfig } from '../config/validate';

export function cloneState(s: GameState): GameState {
  return {
    ...s,
    seats: s.seats.map((seat) => ({
      ...seat,
      hole: [...seat.hole],
      up: [...seat.up],
    })),
    community: [...s.community],
    deck: [...s.deck],
    actions: [...s.actions],
    winners: [...s.winners],
  };
}

function draw(s: GameState): number {
  const c = s.deck.pop();
  if (c === undefined) throw new Error('deck exhausted');
  return c;
}

function shuffleDeck(rng: RngSource): number[] {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  return rng.shuffleInPlace(deck);
}

export function countNonFolded(state: GameState): number {
  let n = 0;
  for (const s of state.seats) {
    if (s.status !== 'folded' && s.status !== 'out') n++;
  }
  return n;
}

function anyActive(state: GameState): boolean {
  return state.seats.some((s) => s.status === 'active');
}

function nextActive(state: GameState, from: number): number {
  const n = state.seats.length;
  for (let k = 0; k < n; k++) {
    const idx = (from + k) % n;
    if (state.seats[idx].status === 'active') return idx;
  }
  return -1;
}

// card index -> (rank=i%13, suit=floor(i/13)); lower key == lower exposed card
function cardKey(c: number): number {
  return (c % 13) * 4 + Math.floor(c / 13);
}

function qualifyingSeat(state: GameState, lowest: boolean): number {
  let best = -1;
  let bestKey = lowest ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  for (const s of state.seats) {
    if (s.status === 'out' || s.up.length === 0) continue;
    const k = cardKey(s.up[0]!);
    if ((lowest && k < bestKey) || (!lowest && k > bestKey)) {
      best = s.index;
      bestKey = k;
    }
  }
  return best === -1 ? state.buttonSeat : best;
}

export function firstToAct(state: GameState, streetIndex: number): number {
  const n = state.seats.length;
  const order = state.handCfg.streets[streetIndex]?.actionOrder;
  if (order === 'low-upcard' || order === 'high-hand') {
    return qualifyingSeat(state, order === 'low-upcard');
  }
  if (streetIndex === 0) {
    if (n === 2) return state.buttonSeat;
    return nextActive(state, (state.buttonSeat + 3) % n);
  }
  return nextActive(state, (state.buttonSeat + 1) % n);
}

function postBet(seat: SeatState, amount: number): void {
  const amt = Math.min(amount, seat.stack);
  seat.stack -= amt;
  seat.wageredThisStreet += amt;
  seat.wageredTotal += amt;
  if (seat.stack === 0) seat.status = 'allin';
}

function postBlinds(state: GameState): GameState {
  const s = state;
  const cfg = s.handCfg.forcedBets;
  const sb = cfg.blinds?.sb ?? 1;
  const bb = cfg.blinds?.bb ?? 2;
  const n = s.seats.length;
  if (n === 2) {
    postBet(s.seats[s.buttonSeat]!, sb);
    postBet(s.seats[(s.buttonSeat + 1) % n]!, bb);
  } else {
    postBet(s.seats[(s.buttonSeat + 1) % n]!, sb);
    postBet(s.seats[(s.buttonSeat + 2) % n]!, bb);
  }
  s.lastRaiseSize = bb;
  return s;
}

function postAntes(state: GameState): void {
  const ante = state.handCfg.forcedBets.ante;
  if (!ante || ante <= 0) return;
  for (const seat of state.seats) {
    if (seat.status === 'out') continue;
    const amt = Math.min(ante, seat.stack);
    seat.stack -= amt;
    seat.wageredTotal += amt;
    if (seat.stack === 0) seat.status = 'allin';
  }
}

function postBringIn(state: GameState): void {
  const bringIn = state.handCfg.forcedBets.bringIn;
  if (!bringIn || bringIn <= 0) return;
  const rule = state.handCfg.streets[0]?.actionOrder;
  const seatIdx = qualifyingSeat(state, rule !== 'high-hand');
  const seat = state.seats[seatIdx];
  if (!seat) return;
  const amt = Math.min(bringIn, seat.stack);
  seat.stack -= amt;
  seat.wageredThisStreet += amt;
  seat.wageredTotal += amt;
  if (seat.stack === 0) seat.status = 'allin';
  if (amt > state.lastRaiseSize) state.lastRaiseSize = amt;
}

export function initHand(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  rng: RngSource,
  seatStacks?: number[],
): GameState {
  validateHandConfig(handCfg);
  const n = tableCfg.seats.min;
  const deck = shuffleDeck(rng);
  const seats: SeatState[] = Array.from({ length: n }, (_, i) => ({
    index: i,
    stack: seatStacks?.[i] ?? handCfg.stacks.buyIn,
    hole: [],
    up: [],
    status: 'active',
    hasActedThisStreet: false,
    wageredThisStreet: 0,
    wageredTotal: 0,
  }));
  const base: GameState = {
    tableCfg,
    handCfg,
    buttonSeat: 0,
    seats,
    community: [],
    streetIndex: 0,
    phase: 'betting',
    actingSeat: 0,
    lastAggressor: null,
    lastRaiseSize: bigBlindOf(handCfg),
    actions: [],
    deck,
    winners: [],
    isTerminal: false,
  };
  const preflop = handCfg.streets[0]?.deal;
  if (preflop) {
    for (const seat of base.seats) {
      for (let k = 0; k < preflop.holeDown; k++) seat.hole.push(draw(base));
      for (let k = 0; k < preflop.playerUp; k++) seat.up.push(draw(base));
    }
    for (let k = 0; k < preflop.community; k++) base.community.push(draw(base));
  }
  postAntes(base);
  const hasBringIn = (base.handCfg.forcedBets.bringIn ?? 0) > 0;
  if (hasBringIn) {
    postBringIn(base);
  } else {
    postBlinds(base);
  }
  let state = base;
  state.actingSeat = firstToAct(state, 0);
  return state;
}

export function dealStreet(state: GameState, streetIndex: number): GameState {
  const s = cloneState(state);
  const deal = s.handCfg.streets[streetIndex]?.deal;
  if (deal) {
    for (const seat of s.seats) {
      if (seat.status === 'out') continue;
      for (let k = 0; k < deal.holeDown; k++) seat.hole.push(draw(s));
      for (let k = 0; k < deal.playerUp; k++) seat.up.push(draw(s));
    }
    for (let k = 0; k < deal.community; k++) s.community.push(draw(s));
  }
  for (const seat of s.seats) {
    seat.wageredThisStreet = 0;
    seat.hasActedThisStreet = false;
  }
  s.lastRaiseSize = bigBlindOf(s.handCfg);
  s.lastAggressor = null;
  s.streetIndex = streetIndex;
  s.actingSeat = firstToAct(s, streetIndex);
  return s;
}

function reopen(s: GameState, aggressor: number): void {
  for (const seat of s.seats) {
    if (seat.index !== aggressor && seat.status === 'active') {
      seat.hasActedThisStreet = false;
    }
  }
}

export function applyAction(state: GameState, action: Action, handCfg: HandConfig): GameState {
  const s = cloneState(state);
  const seat = s.seats[action.seat];
  if (!seat || seat.status !== 'active' || s.actingSeat !== action.seat) {
    throw new Error(`seat ${action.seat} cannot act now`);
  }
  const legal = computeLegalActions(s, handCfg);
  const match = legal.find((a) => a.type === action.type);
  if (!match) {
    throw new Error(`illegal action ${action.type} for seat ${action.seat}`);
  }
  const bb = bigBlindOf(handCfg);
  const curMax = streetMaxWager(s);
  seat.hasActedThisStreet = true;

  switch (action.type) {
    case 'fold':
      seat.status = 'folded';
      break;
    case 'check':
      break;
    case 'call': {
      const amt = Math.min(toCallFor(s, seat.index), seat.stack);
      seat.stack -= amt;
      seat.wageredThisStreet += amt;
      seat.wageredTotal += amt;
      if (seat.stack === 0) seat.status = 'allin';
      break;
    }
    case 'bet': {
      const min = match.min ?? bb;
      const max = match.max ?? seat.stack;
      const requested = action.amount ?? match.amount ?? min;
      if (requested < min) throw new Error('bet below minimum');
      const amt = Math.min(requested, max);
      seat.stack -= amt;
      seat.wageredThisStreet += amt;
      seat.wageredTotal += amt;
      s.lastRaiseSize = Math.max(s.lastRaiseSize, amt);
      s.lastAggressor = seat.index;
      if (seat.stack === 0) seat.status = 'allin';
      reopen(s, seat.index);
      break;
    }
    case 'raise': {
      const min = match.min ?? curMax + Math.max(s.lastRaiseSize, bb);
      const max = match.max ?? seat.wageredThisStreet + seat.stack;
      const requestedTo = action.to ?? match.to ?? min;
      if (requestedTo < min) throw new Error('raise below minimum');
      const to = Math.min(requestedTo, max);
      const amt = to - seat.wageredThisStreet;
      seat.stack -= amt;
      seat.wageredThisStreet = to;
      seat.wageredTotal += amt;
      s.lastRaiseSize = to - curMax;
      s.lastAggressor = seat.index;
      if (seat.stack === 0) seat.status = 'allin';
      reopen(s, seat.index);
      break;
    }
    case 'allin': {
      const amt = seat.stack;
      const newWager = seat.wageredThisStreet + amt;
      seat.stack = 0;
      seat.wageredThisStreet = newWager;
      seat.wageredTotal += amt;
      seat.status = 'allin';
      if (newWager > curMax) {
        const inc = newWager - curMax;
        if (inc >= Math.max(s.lastRaiseSize, bb)) s.lastRaiseSize = inc;
        s.lastAggressor = seat.index;
        reopen(s, seat.index);
      }
      break;
    }
    default:
      throw new Error(`unknown action type`);
  }

  s.actions.push({ ...action });
  return s;
}

function needsAction(state: GameState, idx: number): boolean {
  const seat = state.seats[idx];
  if (!seat || seat.status !== 'active') return false;
  if (!seat.hasActedThisStreet) return true;
  return seat.wageredThisStreet < streetMaxWager(state);
}

export function observePublic(state: GameState): PublicObservation {
  let pot = 0;
  const players: PlayerPublicView[] = state.seats.map((s) => {
    pot += s.wageredTotal;
    return {
      seat: s.index,
      stack: s.stack,
      bet: s.wageredThisStreet,
      wagered: s.wageredTotal,
      status: s.status,
    };
  });
  const up: PublicUpCards[] = state.seats
    .filter((s) => s.up.length > 0)
    .map((s) => ({ seat: s.index, cards: [...s.up] }));
  const actionLog: ActionRecord[] = state.actions.map((a) => {
    const r: ActionRecord = { seat: a.seat, streetIndex: a.streetIndex, type: a.type };
    if (a.amount !== undefined) r.amount = a.amount;
    if (a.to !== undefined) r.to = a.to;
    return r;
  });
  return {
    streetIndex: state.streetIndex,
    streetName: state.handCfg.streets[state.streetIndex]?.name ?? `street-${state.streetIndex}`,
    community: [...state.community],
    up,
    players,
    actionLog,
    pot,
  };
}

export function observe(state: GameState, seat: number): Observation {
  const mySeat = state.seats[seat];
  if (!mySeat) throw new Error(`invalid seat ${seat}`);
  const obs: Observation = {
    ...observePublic(state),
    seat,
    actingSeat: state.actingSeat,
    buttonSeat: state.buttonSeat,
    myHole: [...mySeat.hole],
    toCall: toCallFor(state, seat),
    legalActions:
      seat === state.actingSeat && !state.isTerminal
        ? computeLegalActions(state, state.handCfg)
        : [],
    isTerminal: state.isTerminal,
  };
  if (state.isTerminal) {
    obs.revealedHole = state.seats
      .filter((s) => s.status !== 'folded' && s.status !== 'out')
      .map((s) => ({ seat: s.index, cards: [...s.hole] }));
  }
  return obs;
}

function nextSeatNeedingAction(state: GameState, afterSeat: number): number {
  const n = state.seats.length;
  for (let k = 1; k <= n; k++) {
    const idx = (afterSeat + k) % n;
    if (needsAction(state, idx)) return idx;
  }
  return -1;
}

export function advanceToNextDecision(input: GameState, emit?: (e: GameEvent) => void): GameState {
  let st = input;
  const handCfg = st.handCfg;
  let justActed = st.actingSeat;
  for (;;) {
    if (countNonFolded(st) <= 1) return settleAndEmit(st, handCfg, emit);
    const next = nextSeatNeedingAction(st, justActed);
    if (next !== -1) {
      st.actingSeat = next;
      return st;
    }
    emit?.({ type: 'betting-complete', streetIndex: st.streetIndex });
    st = refundUncalled(st);
    const nextSi = st.streetIndex + 1;
    if (nextSi >= handCfg.streets.length) return settleAndEmit(st, handCfg, emit);
    st = dealStreet(st, nextSi);
    emit?.({ type: 'dealt', streetIndex: nextSi });
    justActed = (st.actingSeat + st.seats.length - 1) % st.seats.length;
  }
}

export function refundUncalled(state: GameState): GameState {
  const s = cloneState(state);
  let max = 0;
  for (const seat of s.seats) if (seat.wageredThisStreet > max) max = seat.wageredThisStreet;
  if (max <= 0) return s;
  const leaders = s.seats.filter((seat) => seat.wageredThisStreet === max);
  if (leaders.length !== 1) return s;
  const leader = leaders[0]!;
  let second = 0;
  for (const seat of s.seats) {
    if (seat !== leader && seat.wageredThisStreet > second) second = seat.wageredThisStreet;
  }
  if (max > second) {
    const refund = max - second;
    leader.stack += refund;
    leader.wageredThisStreet -= refund;
    leader.wageredTotal -= refund;
  }
  return s;
}

export function runBettingRound(
  state: GameState,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  emit?: (e: GameEvent) => void,
): GameState {
  let s = state;
  let cursor = s.actingSeat;
  let guard = 0;
  while (countNonFolded(s) > 1) {
    let seatIdx = -1;
    const n = s.seats.length;
    for (let k = 0; k < n; k++) {
      const idx = (cursor + k) % n;
      if (needsAction(s, idx)) {
        seatIdx = idx;
        break;
      }
    }
    if (seatIdx === -1) break;
    s.actingSeat = seatIdx;
    const obs = observe(s, seatIdx);
    const action = agents[seatIdx]!.decide(obs);
    s = applyAction(s, action, handCfg);
    emit?.({ type: 'action', streetIndex: s.streetIndex, action });
    cursor = (seatIdx + 1) % n;
    if (++guard > 100000) throw new Error('betting round did not converge');
  }
  emit?.({ type: 'betting-complete', streetIndex: s.streetIndex });
  return refundUncalled(s);
}

function settleAndEmit(
  state: GameState,
  handCfg: HandConfig,
  emit?: (e: GameEvent) => void,
): GameState {
  void handCfg;
  const alive = countNonFolded(state);
  const s = settle(state);
  if (alive > 1) emit?.({ type: 'showdown', winners: s.winners });
  emit?.({ type: 'hand-ended', winners: s.winners });
  return s;
}

export function resumeHand(
  state: GameState,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  emit?: (e: GameEvent) => void,
): GameState {
  let s = state;
  if (s.isTerminal) return s;

  const runCurrentStreet = (): boolean => {
    if (countNonFolded(s) <= 1) return false;
    if (anyActive(s)) {
      s = runBettingRound(s, handCfg, agents, emit);
      if (countNonFolded(s) <= 1) return false;
    }
    return true;
  };

  if (!runCurrentStreet()) return settleAndEmit(s, handCfg, emit);

  for (let si = s.streetIndex + 1; si < handCfg.streets.length; si++) {
    if (countNonFolded(s) <= 1) break;
    s = dealStreet(s, si);
    emit?.({ type: 'dealt', streetIndex: si });
    if (!runCurrentStreet()) break;
  }
  return settleAndEmit(s, handCfg, emit);
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

export function hydrateState(json: string): GameState {
  return JSON.parse(json) as GameState;
}

export function settle(state: GameState): GameState {
  const s = cloneState(state);
  let pot = 0;
  for (const seat of s.seats) pot += seat.wageredTotal;
  const alive = s.seats.filter((seat) => seat.status !== 'folded' && seat.status !== 'out');
  const winners: PotWinner[] = [];

  if (alive.length === 1) {
    const w = alive[0]!;
    w.stack += pot;
    winners.push({ seat: w.index, amount: pot, rank: -1 });
  } else {
    const { evaluator: kind, ranking, composition } = s.handCfg.evaluation;
    const preferLower = ranking === 'low-wins';
    const evaluated = alive.map((seat) => {
      const pools: ResolvedPools = { hole: seat.hole, door: seat.up, community: s.community };
      const { rank } = resolveHand(pools, composition, kind, ranking);
      return { seat, rank };
    });
    let best = evaluated[0]!.rank;
    for (const e of evaluated) {
      if ((preferLower && e.rank < best) || (!preferLower && e.rank > best)) best = e.rank;
    }
    const tops = evaluated.filter((e) => e.rank === best);
    tops.sort((a, b) => a.seat.index - b.seat.index);
    const share = Math.floor(pot / tops.length);
    const remainder = pot - share * tops.length;
    tops.forEach((e, i) => {
      const amount = share + (i === 0 ? remainder : 0);
      e.seat.stack += amount;
      winners.push({ seat: e.seat.index, amount, rank: e.rank });
    });
  }

  s.winners = winners;
  s.phase = 'terminal';
  s.isTerminal = true;
  return s;
}
