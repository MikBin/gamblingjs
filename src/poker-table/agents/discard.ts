import type { EvaluatorKind } from '../config/types';
import type { Action, Observation } from '../engine/state';

// Card encoding: rank = c % 13 (0='2' ... 12='A'), suit = floor(c / 13).
const rankOf = (c: number): number => c % 13;
const suitOf = (c: number): number => Math.floor(c / 13);

function isLowObjective(e: EvaluatorKind): boolean {
  return e === 'A5-low' || e === '2-7-low' || e === 'low8' || e === 'low9';
}

// In A-5 / qualifier lows the ace is the BEST low card; in 2-7 it is the worst.
function isAceLow(e: EvaluatorKind): boolean {
  return e === 'A5-low' || e === 'low8' || e === 'low9';
}

// lower value = better card to retain when drawing for low.
function lowRankValue(rank: number, aceLow: boolean): number {
  if (aceLow) return rank === 12 ? -1 : rank;
  return rank === 12 ? 13 : rank;
}

// Five distinct ranks that are consecutive, or the wheel A-2-3-4-5.
function formsStraight(ranks: number[]): boolean {
  const u = Array.from(new Set(ranks)).sort((a, b) => a - b);
  if (u.length !== 5) return false;
  let consec = true;
  for (let i = 1; i < 5; i++) {
    if (u[i]! !== u[i - 1]! + 1) {
      consec = false;
      break;
    }
  }
  if (consec) return true;
  return u[0] === 0 && u[1] === 1 && u[2] === 2 && u[3] === 3 && u[4] === 12; // wheel
}

function formsFlush(cards: number[]): boolean {
  return cards.every((c) => suitOf(c) === suitOf(cards[0]!));
}

function complement(hole: number[], keep: Set<number>, max: number): number[] {
  const discard = hole.map((_, i) => i).filter((i) => !keep.has(i));
  return discard.slice(0, Math.min(discard.length, max));
}

/**
 * High-hand discard (5-Card Draw, Hold'em-style draw): stand pat on any made
 * straight or flush; otherwise keep every card in a pair-or-better; with nothing,
 * keep the three highest cards and redraw the rest. Conservative (keeps >= 3) so
 * large fields don't drain the deck.
 */
function highDiscard(hole: number[], max: number): number[] {
  if (formsStraight(hole.map(rankOf)) || formsFlush(hole)) return [];
  const counts = new Map<number, number>();
  for (const c of hole) counts.set(rankOf(c), (counts.get(rankOf(c)) ?? 0) + 1);
  const keep = new Set<number>();
  hole.forEach((c, i) => {
    if ((counts.get(rankOf(c)) ?? 0) >= 2) keep.add(i);
  });
  if (keep.size === 0) {
    const order = hole.map((_, i) => i).sort((a, b) => rankOf(hole[b]!) - rankOf(hole[a]!));
    keep.add(order[0]!);
    keep.add(order[1] ?? order[0]!);
    keep.add(order[2] ?? order[1] ?? order[0]!);
  }
  return complement(hole, keep, max);
}

/**
 * Low-hand discard (2-7 Triple Draw, A-5 Triple Draw): keep the lowest cards,
 * breaking pairs (retain one card per rank), keeping at least three; redraw the
 * rest. In 2-7, never stand pat on a made straight or flush — drop the highest.
 */
function lowDiscard(e: EvaluatorKind, hole: number[], max: number): number[] {
  const aceLow = isAceLow(e);
  const byRank = new Map<number, number>();
  hole.forEach((c, i) => {
    const r = rankOf(c);
    if (!byRank.has(r)) byRank.set(r, i);
  });
  const candidates = [...byRank.values()].sort(
    (a, b) => lowRankValue(rankOf(hole[a]!), aceLow) - lowRankValue(rankOf(hole[b]!), aceLow),
  );
  const good = candidates.filter((i) => lowRankValue(rankOf(hole[i]!), aceLow) <= 5);
  const keep = new Set<number>(
    good.length >= 3 ? good : candidates.slice(0, Math.min(3, candidates.length)),
  );
  if (keep.size === 5 && e === '2-7-low' && (formsStraight(hole.map(rankOf)) || formsFlush(hole))) {
    const sortedKeep = [...keep].sort(
      (a, b) => lowRankValue(rankOf(hole[b]!), aceLow) - lowRankValue(rankOf(hole[a]!), aceLow),
    );
    keep.delete(sortedKeep[0]!);
  }
  return complement(hole, keep, max);
}

/** Indices to discard for the given hand/objective, capped at `max`. Pure + deterministic. */
export function chooseDiscard(evaluator: EvaluatorKind, hole: number[], max: number): number[] {
  if (hole.length === 0 || max <= 0) return [];
  return isLowObjective(evaluator) ? lowDiscard(evaluator, hole, max) : highDiscard(hole, max);
}

/**
 * If the acting seat is in a draw phase, return the heuristic discard action;
 * otherwise null (the caller falls back to its betting logic). Used by every bot.
 */
export function discardAction(obs: Observation): Action | null {
  const d = obs.legalActions.find((a) => a.type === 'discard');
  if (!d) return null;
  const max = d.max ?? obs.myHole.length;
  return {
    type: 'discard',
    seat: obs.seat,
    streetIndex: obs.streetIndex,
    discardIndices: chooseDiscard(obs.evaluator, obs.myHole, max),
  };
}
