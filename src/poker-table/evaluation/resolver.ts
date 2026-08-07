import { HighEvaluator } from '../../core/HighEvaluator';
import { LowAto5Evaluator } from '../../core/LowEvaluator';
import { handOfFiveEvalLowBall27Indexed } from '../../pokerEvaluator5';
import { handOfSevenEvalLowBall27Indexed } from '../../pokerEvaluator7';
import { fastHashesCreators } from '../../pokerHashes7';
import type { CompositionSelector, EvaluatorKind, RankingDirection } from '../config/types';
import {
  canUseSevenCardFastPath,
  combinedCards,
  enumerateCompositions,
  type ResolvedPools,
} from './composition';

const highEvaluator = new HighEvaluator();
const a5Evaluator = new LowAto5Evaluator();

const ensured: Record<string, boolean> = { high: false, Ato5: false, '2to7': false };
function ensure(kind: 'high' | 'Ato5' | '2to7'): void {
  if (ensured[kind]) return;
  fastHashesCreators[kind]();
  ensured[kind] = true;
}

export function ensureHighHashes(): void {
  ensure('high');
}

type Better = 'higher' | 'lower';

interface EvalSpec {
  ensure: () => void;
  rank5: (cards: number[]) => number;
  rank7?: (cards: number[]) => number;
  better: Better;
}

function specFor(kind: EvaluatorKind): EvalSpec {
  switch (kind) {
    case 'high':
      return {
        ensure: () => ensure('high'),
        rank5: (c) => highEvaluator.evaluate(c),
        rank7: (c) => highEvaluator.evaluate(c),
        better: 'higher',
      };
    case 'A5-low':
      return {
        ensure: () => ensure('Ato5'),
        rank5: (c) => a5Evaluator.evaluate(c),
        rank7: (c) => a5Evaluator.evaluate(c),
        better: 'higher',
      };
    case '2-7-low':
      return {
        ensure: () => ensure('2to7'),
        rank5: (c) => {
          if (c.length === 5)
            return handOfFiveEvalLowBall27Indexed(c[0]!, c[1]!, c[2]!, c[3]!, c[4]!);
          if (c.length === 7)
            return handOfSevenEvalLowBall27Indexed(c[0]!, c[1]!, c[2]!, c[3]!, c[4]!, c[5]!, c[6]!);
          throw new Error('2-7 lowball requires a 5- or 7-card pool');
        },
        rank7: (c) =>
          handOfSevenEvalLowBall27Indexed(c[0]!, c[1]!, c[2]!, c[3]!, c[4]!, c[5]!, c[6]!),
        // The 2-7 evaluators return HIGHER = better low, so 'higher' (not 'lower').
        better: 'higher',
      };
    case 'low8':
      return { ensure: () => undefined, rank5: (c) => lowRankA5(c, 8), better: 'lower' };
    case 'low9':
      return { ensure: () => undefined, rank5: (c) => lowRankA5(c, 9), better: 'lower' };
    default:
      throw new Error(`Evaluator "${kind}" is hi-lo — use resolveHiLo`);
  }
}

// Normalize a raw rank into a "higher is better" space.
function normalize(rank: number, better: Better): number {
  if (better === 'higher') return rank;
  return rank < 0 ? Number.NEGATIVE_INFINITY : -rank;
}

/**
 * A-5 style low rank for a 5-card combo (ace low; straights/flushes ignored).
 * Returns a value where SMALLER is a better low, or -1 when the combo does not
 * qualify (paired ranks, or any card above the qualifier).
 */
export function lowRankA5(combo: number[], qualifier: 8 | 9): number {
  const vals: number[] = [];
  for (const c of combo) {
    const r = c % 13; // 0='2' ... 12='A'
    vals.push(r === 12 ? 1 : r + 2);
  }
  if (new Set(vals).size !== combo.length) return -1;
  if (vals.some((v) => v > qualifier)) return -1;
  vals.sort((a, b) => a - b);
  let rank = 0;
  for (const v of vals) rank = rank * 16 + v;
  return rank;
}

export interface HandResolution {
  rank: number;
  cards: number[];
}

// Single-winner resolution (high, A-5 low, 2-7 low, low8, low9).
// Returns a normalized rank where HIGHER is always better.
export function resolveHand(
  pools: ResolvedPools,
  selector: CompositionSelector,
  kind: EvaluatorKind,
  _ranking?: RankingDirection,
): HandResolution {
  const spec = specFor(kind);
  spec.ensure();

  if (spec.rank7 && canUseSevenCardFastPath(selector, pools)) {
    const cards = combinedCards(selector, pools);
    return { rank: normalize(spec.rank7(cards), spec.better), cards };
  }

  const combos = enumerateCompositions(selector, pools);
  if (combos.length === 0) {
    return { rank: Number.NEGATIVE_INFINITY, cards: [] };
  }
  let bestRank = normalize(spec.rank5(combos[0]!), spec.better);
  let bestCards = combos[0]!;
  for (let i = 1; i < combos.length; i++) {
    const r = normalize(spec.rank5(combos[i]!), spec.better);
    if (r > bestRank) {
      bestRank = r;
      bestCards = combos[i]!;
    }
  }
  return { rank: bestRank, cards: bestCards };
}

export interface HiLoResolution {
  high: number; // higher is better
  low: number; // lower is better; -1 if no qualifying low
}

// Hi-lo resolution: best high and best qualifying low are computed independently
// (a player may use different cards for each half).
export function resolveHiLo(
  pools: ResolvedPools,
  selector: CompositionSelector,
  qualifier: 8 | 9,
): HiLoResolution {
  ensure('high');
  let bestHigh = Number.NEGATIVE_INFINITY;
  let bestLow = -1;
  for (const combo of enumerateCompositions(selector, pools)) {
    const hi = highEvaluator.evaluate(combo);
    if (hi > bestHigh) bestHigh = hi;
    const lo = lowRankA5(combo, qualifier);
    if (lo !== -1 && (bestLow === -1 || lo < bestLow)) bestLow = lo;
  }
  return { high: bestHigh, low: bestLow };
}

export interface HiLoSplit {
  highWinners: number[];
  lowWinners: number[]; // empty when no qualifier exists
  hasLow: boolean;
  awards: Map<number, number>; // seat -> total chips won from this split
  highAwards: Map<number, number>; // seat -> chips won from the high half only
  lowAwards: Map<number, number>; // seat -> chips won from the low half only
}

/**
 * Split a single pot tier into high and low halves (pot-layer concern).
 * With no qualifying low, the high winners scoop the entire tier.
 */
export function splitHiLo(
  elig: number[],
  evals: Map<number, HiLoResolution>,
  amount: number,
): HiLoSplit {
  const highHalf = Math.ceil(amount / 2);
  const lowHalf = amount - highHalf;
  const highAwards = new Map<number, number>();
  const lowAwards = new Map<number, number>();
  const awardTo = (map: Map<number, number>, seats: number[], amt: number) => {
    const share = Math.floor(amt / seats.length);
    const rem = amt - share * seats.length;
    seats.forEach((si, i) => map.set(si, (map.get(si) ?? 0) + share + (i === 0 ? rem : 0)));
  };

  let bestHi = -Infinity;
  for (const si of elig) bestHi = Math.max(bestHi, evals.get(si)!.high);
  const highWinners = elig.filter((si) => evals.get(si)!.high === bestHi).sort((a, b) => a - b);
  awardTo(highAwards, highWinners, highHalf);

  const quals = elig.filter((si) => evals.get(si)!.low !== -1);
  let lowWinners: number[] = [];
  if (quals.length > 0) {
    let bestLo = Infinity;
    for (const si of quals) bestLo = Math.min(bestLo, evals.get(si)!.low);
    lowWinners = quals.filter((si) => evals.get(si)!.low === bestLo).sort((a, b) => a - b);
    awardTo(lowAwards, lowWinners, lowHalf);
  } else {
    awardTo(highAwards, highWinners, lowHalf); // no low: high scoops
  }

  const awards = new Map<number, number>();
  const merge = (src: Map<number, number>) =>
    src.forEach((a, seat) => awards.set(seat, (awards.get(seat) ?? 0) + a));
  merge(highAwards);
  merge(lowAwards);
  return { highWinners, lowWinners, hasLow: quals.length > 0, awards, highAwards, lowAwards };
}
