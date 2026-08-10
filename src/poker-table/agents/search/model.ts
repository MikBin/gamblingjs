// Opponent modelling — Bayesian range narrowing (Phase 2).
//
// Instead of assuming an opponent's hidden cards are uniform-random over the
// unseen deck, infer a range from their public actions (preflop raise = strong;
// limp/call = weak/capped; no info = uniform) and bias the sampled hole cards
// toward combos whose strength matches that implied range. The bias is a soft
// Gaussian likelihood around a target strength, so it narrows without ever
// ruling a legal combo out entirely.
//
// Scope: meaningful for 2-hole-card HIGH games (Hold'em, Stud-high), where a
// Chen-style starting strength maps cleanly to a preflop action. Low / hi-lo /
// draw / Omaha (4-card) games degrade to the uniform model — the abstraction is
// variant-agnostic, the heuristic is not.
import type { Observation } from '../../engine/state';
import type { EvaluatorKind } from '../../config/types';
import type { RngSource } from '../../engine/rng';
import { chenStrength } from '../smart';

/** What the action log tells us about one opponent's play so far. */
export interface OpponentProfile {
  /** Raised on the first street (a "PFR" — implies a strong range). */
  preflopRaise: boolean;
  /** Voluntarily entered the first street without raising (limp/call — weak/capped). */
  preflopVpip: boolean;
  /** Postflop bet/raise frequency (0..1). */
  aggression: number;
  /** Number of postflop actions observed (confidence in `aggression`). */
  samples: number;
}

/**
 * Strategy for drawing one opponent's hidden private cards from the unseen pool.
 * Implementations MUST remove the drawn cards from `pool` (splice), so the
 * remaining pool stays consistent for the player's own hand and the board.
 */
export interface OpponentModel {
  samplePrivate(pool: number[], nPrivate: number, rng: RngSource): number[];
}

/** Uniform model — pops `n` cards off the end of a (pre-shuffled) pool. */
export const uniformModel: OpponentModel = {
  samplePrivate(pool, n, _rng) {
    if (n <= 0) return [];
    return pool.splice(Math.max(0, pool.length - n), n);
  },
};

/** Infer an opponent's profile from the public action log of the observation. */
export function inferProfile(obs: Observation, seat: number): OpponentProfile {
  let preflopRaise = false;
  let preflopVpip = false;
  let postAgg = 0;
  let postActs = 0;
  for (const a of obs.actionLog) {
    if (a.seat !== seat || a.type === 'discard') continue;
    if (a.streetIndex === 0) {
      if (a.type === 'raise' || a.type === 'allin') preflopRaise = true;
      else if (a.type === 'call' || a.type === 'bet') preflopVpip = true;
    } else {
      postActs++;
      if (a.type === 'bet' || a.type === 'raise' || a.type === 'allin') postAgg++;
    }
  }
  return {
    preflopRaise,
    preflopVpip,
    aggression: postActs > 0 ? postAgg / postActs : 0.5,
    samples: postActs,
  };
}

/**
 * Soft likelihood weight for a 2-card combo belonging to the opponent's range,
 * given their profile. A raise implies a strong range (weight rises with Chen
 * strength); a limp implies a weak/capped range (weight falls with strength).
 * A 0.1 floor keeps it a soft prior — nothing is ever hard-excluded. Returns 1
 * (no narrowing) when there is no preflop read or the combo isn't 2 cards.
 */
export function rangeWeight(hole: number[], profile: OpponentProfile): number {
  if (hole.length !== 2) return 1;
  const s = chenStrength(hole); // 0..1 (AA = 1)
  if (profile.preflopRaise) return 0.1 + 0.9 * s; // strong favoured
  if (profile.preflopVpip) return 0.1 + 0.9 * (1 - s); // weak/capped favoured
  return 1; // no preflop information
}

/** Remove element at index `i` from `pool` and return it. */
function spliceOne(pool: number[], i: number): number {
  const c = pool.splice(i, 1)[0];
  return c ?? -1;
}

/** Draw `n` cards from `pool` biased by `profile` (rejection sampling). */
function biasedDraw(pool: number[], n: number, profile: OpponentProfile, rng: RngSource): number[] {
  if (n <= 0) return [];
  if (pool.length <= n) return pool.splice(0, n);
  if (n !== 2) {
    // Only 2-card ranges are heuristically mapped; others stay uniform.
    const out: number[] = [];
    for (let k = 0; k < n; k++) out.push(spliceOne(pool, rng.nextInt(pool.length)));
    return out;
  }
  for (let attempt = 0; attempt < 24; attempt++) {
    if (pool.length < 2) break;
    const i = rng.nextInt(pool.length);
    let j = rng.nextInt(pool.length);
    if (i === j) j = (j + 1) % pool.length;
    const combo = [pool[i]!, pool[j]!];
    const w = rangeWeight(combo, profile);
    if (w >= 1 || rng.nextInt(1000) / 1000 <= w) {
      const [lo, hi] = i < j ? [i, j] : [j, i];
      const b = spliceOne(pool, hi); // remove higher index first
      const a = spliceOne(pool, lo);
      return [a, b];
    }
  }
  // Fallback: uniform pair.
  const i = rng.nextInt(pool.length);
  let j = rng.nextInt(pool.length);
  if (i === j) j = (j + 1) % pool.length;
  const [lo, hi] = i < j ? [i, j] : [j, i];
  const b = spliceOne(pool, hi);
  const a = spliceOne(pool, lo);
  return [a, b];
}

/**
 * Build an opponent model from the observation. Narrows the range only for the
 * 2-card high case; otherwise uniform (non-cheating in all cases — it never
 * reads the real hole cards, only biases the *sampled* ones).
 */
export function makeOpponentModel(
  obs: Observation,
  seat: number,
  kind: EvaluatorKind,
): OpponentModel {
  if (kind !== 'high') return uniformModel;
  const profile = inferProfile(obs, seat);
  if (!profile.preflopRaise && !profile.preflopVpip) return uniformModel; // no read → uniform
  return { samplePrivate: (pool, n, rng) => biasedDraw(pool, n, profile, rng) };
}
