import type { CompositionSelector, EvaluatorKind } from '../../config/types';
import type { ResolvedPools } from '../../evaluation/composition';
import { resolveHand, resolveHiLo } from '../../evaluation/resolver';
import type { RngSource } from '../../engine/rng';

/**
 * Expected pot share for the acting player in [0, 1] (1 = certain win, 0.5 =
 * even chop). For hi-lo games `equity` is the sum of the high- and low-half
 * shares; `low` is the standalone fraction of samples in which the player wins
 * the low half (undefined for non-split games).
 */
export interface EquityResult {
  equity: number;
  high?: number;
  low?: number;
}

export interface EquityArgs {
  /** This player's known private cards (hole + own visible up cards). */
  myPrivate: number[];
  /** Community cards dealt so far. */
  community: number[];
  /** One entry per live opponent: that opponent's visible up cards (stud). */
  opponentUp: number[][];
  /** Best-hand composition rule for the game (from the hand config). */
  selector: CompositionSelector;
  kind: EvaluatorKind;
  lowQualify: 8 | 9 | undefined;
  /** Private-pool size each player holds by showdown (Hold'em 2, Omaha 4, Stud 7, Draw 5). */
  privateTotal: number;
  /** Board size by showdown (5 for community games, 0 for Stud/Draw). */
  communityTotal: number;
  nSamples: number;
  rng: RngSource;
}

const FULL_DECK: number[] = Array.from({ length: 52 }, (_, i) => i);

const FINITE = Number.isFinite;

/**
 * Monte-Carlo equity: for each of `nSamples` iterations, sample every unseen
 * card (opponents' hidden private cards, future community, and — for Stud — my
 * own not-yet-dealt cards) from a freshly seeded shuffle, complete every hand to
 * its showdown pool, and rank it through the engine's variant resolver
 * (`resolveHand` / `resolveHiLo`). Tally the acting player's expected pot share.
 *
 * Pure and deterministic given the injected `RngSource`: the same `(args, rng)`
 * always yields the same result. Variant-agnostic — no per-game branching.
 */
export function monteCarloEquity(a: EquityArgs): EquityResult {
  const {
    myPrivate,
    community,
    opponentUp,
    selector,
    kind,
    lowQualify,
    privateTotal,
    communityTotal,
    nSamples,
    rng,
  } = a;

  if (nSamples <= 0) return { equity: 0 };
  // No opponents to beat: the pot is already ours.
  if (opponentUp.length === 0) return { equity: 1 };

  const isHilo = kind === 'hi-lo';

  const known = new Set<number>([...myPrivate, ...community]);
  for (const up of opponentUp) for (const c of up) known.add(c);
  const pool = FULL_DECK.filter((c) => !known.has(c));

  const myHidden = Math.max(0, privateTotal - myPrivate.length);
  const oppHidden = opponentUp.map((up) => Math.max(0, privateTotal - up.length));
  const boardHidden = Math.max(0, communityTotal - community.length);

  let shareSum = 0;
  let lowWinSum = 0;

  for (let s = 0; s < nSamples; s++) {
    rng.shuffleInPlace(pool);
    let cursor = 0;
    const draw = (n: number): number[] => {
      if (n <= 0) return [];
      const out = pool.slice(cursor, cursor + n);
      cursor += n;
      return out;
    };

    const meFull = myPrivate.concat(draw(myHidden));
    const oppFull = opponentUp.map((up, i) => up.concat(draw(oppHidden[i]!)));
    const boardFull = community.concat(draw(boardHidden));

    const toPools = (priv: number[]): ResolvedPools => ({
      hole: priv,
      door: [],
      community: boardFull,
    });

    if (isHilo) {
      const q = lowQualify ?? 8;
      const me = resolveHiLo(toPools(meFull), selector, q);
      const opps = oppFull.map((priv) => resolveHiLo(toPools(priv), selector, q));
      const highs = [me.high, ...opps.map((o) => o.high)];
      const highBest = Math.max(...highs);
      const highWinners = highs.filter((h) => h === highBest && FINITE(h)).length;
      const lows = [me.low, ...opps.map((o) => o.low)];
      const qualifiers = lows.filter((l) => l !== -1);
      const hasLow = qualifiers.length > 0;
      const lowBest = hasLow ? Math.min(...qualifiers) : 0;
      const lowWinners = hasLow ? lows.filter((l) => l !== -1 && l === lowBest).length : 0;
      const highHalf = hasLow ? 0.5 : 1;
      const lowHalf = hasLow ? 0.5 : 0;
      let share = 0;
      if (FINITE(highBest) && me.high === highBest && highWinners > 0)
        share += highHalf / highWinners;
      if (hasLow && me.low !== -1 && me.low === lowBest) {
        share += lowHalf / lowWinners;
        lowWinSum += 1;
      }
      shareSum += share;
    } else {
      const meRank = resolveHand(toPools(meFull), selector, kind).rank;
      const oppRanks = oppFull.map((priv) => resolveHand(toPools(priv), selector, kind).rank);
      const ranks = [meRank, ...oppRanks];
      const best = Math.max(...ranks);
      const winners = ranks.filter((r) => r === best).length;
      if (FINITE(best) && meRank === best && winners > 0) shareSum += 1 / winners;
    }
  }

  const equity = shareSum / nSamples;
  return isHilo ? { equity, low: lowWinSum / nSamples } : { equity };
}
