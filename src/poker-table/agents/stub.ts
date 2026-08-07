import type { Action, Observation } from '../engine/state';
import type { PlayerAgent } from './types';
import { createRng } from '../engine/rng';
import { discardAction } from './discard';

type Rng = ReturnType<typeof createRng>;

const fallback = (obs: Observation): Action => ({
  type: 'fold',
  seat: obs.seat,
  streetIndex: obs.streetIndex,
});

function randUnit(rng: Rng): number {
  return rng.nextInt(1000) / 1000;
}

// Deterministic standard-normal sample (Box-Muller) driven by the seeded RNG,
// so bot behaviour stays reproducible per seed. Extreme samples are rare by
// construction — this is what keeps all-in-sized bets uncommon.
function gaussianUnit(rng: Rng): number {
  const u1 = Math.max(randUnit(rng), 1e-9);
  const u2 = randUnit(rng);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Gaussian fraction of the [min,max] range, clamped to [0,1]: sizes cluster
// around `mean`, with tails toward the extremes getting exponentially rarer.
function gaussFrac(rng: Rng, mean: number, sigma: number): number {
  return Math.max(0, Math.min(1, mean + sigma * gaussianUnit(rng)));
}

// Pick a bet/raise size within [min,max] as a gaussian sub-fraction of the range.
function withSizing(a: Action, rng: Rng, mean: number, sigma: number): Action {
  const frac = gaussFrac(rng, mean, sigma);
  if (a.type === 'bet') {
    const min = a.min ?? a.amount ?? 1;
    const max = a.max ?? min;
    const amount = Math.max(min, Math.min(max, Math.round(min + (max - min) * frac)));
    return { ...a, amount };
  }
  if (a.type === 'raise') {
    const min = a.min ?? a.to ?? 1;
    const max = a.max ?? min;
    const to = Math.max(min, Math.min(max, Math.round(min + (max - min) * frac)));
    return { ...a, to };
  }
  return { ...a };
}

// All-in is rare: only a short stack facing a big pot (desperation) shoves with
// meaningful frequency; otherwise a tiny base probability applies.
function maybeShove(legal: Action[], obs: Observation, rng: Rng): Action | null {
  const ai = findType(legal, 'allin');
  if (!ai) return null;
  const stack = obs.players[obs.seat]?.stack ?? 0;
  const pot = obs.pot;
  const chance = pot > 0 && stack <= pot * 0.25 ? 0.35 : 0.02;
  return randUnit(rng) < chance ? ai : null;
}

const findType = (legal: Action[], type: Action['type']): Action | undefined =>
  legal.find((a) => a.type === type);

export const alwaysCallAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const disc = discardAction(obs);
    if (disc) return disc;
    const call = findType(obs.legalActions, 'call');
    if (call) return call;
    const check = findType(obs.legalActions, 'check');
    if (check) return check;
    return obs.legalActions[0] ?? fallback(obs);
  },
};

export const alwaysFoldAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const disc = discardAction(obs);
    if (disc) return disc;
    const fold = findType(obs.legalActions, 'fold');
    if (fold) return fold;
    const check = findType(obs.legalActions, 'check');
    if (check) return check;
    return obs.legalActions[0] ?? fallback(obs);
  },
};

// Uniformly random legal action (excluding deliberate all-ins) with gaussian
// sizing — mid-range bets are common, max-size bets are rare.
export function createRandomAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      if (legal.length === 0) return fallback(obs);
      const shove = maybeShove(legal, obs, rng);
      if (shove) return shove;
      const pool = legal.filter((a) => a.type !== 'allin');
      const a = (pool.length > 0 ? pool : legal)[
        rng.nextInt(pool.length > 0 ? pool.length : legal.length)
      ]!;
      return withSizing(a, rng, 0.35, 0.2);
    },
  };
}

// Loose-aggressive: raises/bets often, calls sometimes, rarely folds.
export function createAggressiveAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      const shove = maybeShove(legal, obs, rng);
      if (shove) return shove;
      const facingBet = !!findType(legal, 'fold');
      const roll = rng.nextInt(100);
      if (facingBet) {
        if (roll < 60) {
          const r = findType(legal, 'raise');
          if (r) return withSizing(r, rng, 0.6, 0.18);
        }
        if (roll < 90) {
          const c = findType(legal, 'call');
          if (c) return c;
        }
        const f = findType(legal, 'fold');
        if (f) return f;
      } else {
        if (roll < 60) {
          const b = findType(legal, 'bet');
          if (b) return withSizing(b, rng, 0.6, 0.18);
        }
        const ck = findType(legal, 'check');
        if (ck) return ck;
      }
      return legal[0] ?? fallback(obs);
    },
  };
}

// Maniac: always raises/bets, never folds or merely calls. Its shoves are the
// one exception that keeps the table dangerous.
export function createManiacAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      const r = findType(legal, 'raise');
      if (r) return withSizing(r, rng, 0.7, 0.15);
      const b = findType(legal, 'bet');
      if (b) return withSizing(b, rng, 0.7, 0.15);
      const ai = findType(legal, 'allin');
      if (ai) return ai;
      const c = findType(legal, 'call');
      if (c) return c;
      const ck = findType(legal, 'check');
      if (ck) return ck;
      return legal[0] ?? fallback(obs);
    },
  };
}

// Calling station: calls anything, rarely folds, occasionally donks a small bet.
export function createCallingStationAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      const shove = maybeShove(legal, obs, rng);
      if (shove) return shove;
      const call = findType(legal, 'call');
      if (call && rng.nextInt(100) < 92) return call;
      if (call) {
        const f = findType(legal, 'fold');
        if (f) return f;
        return call;
      }
      // no bet to call
      if (rng.nextInt(100) < 20) {
        const b = findType(legal, 'bet');
        if (b) return withSizing(b, rng, 0.2, 0.1);
      }
      const ck = findType(legal, 'check');
      if (ck) return ck;
      return legal[0] ?? fallback(obs);
    },
  };
}

// Nit / tight: folds to pressure, checks when free, rarely invests.
export function createTightAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const disc = discardAction(obs);
      if (disc) return disc;
      const legal = obs.legalActions;
      const shove = maybeShove(legal, obs, rng);
      if (shove) return shove;
      const facingBet = !!findType(legal, 'fold');
      if (facingBet) {
        if (rng.nextInt(100) < 70) {
          const f = findType(legal, 'fold');
          if (f) return f;
        }
        const c = findType(legal, 'call');
        if (c) return c;
      } else {
        if (rng.nextInt(100) < 12) {
          const b = findType(legal, 'bet');
          if (b) return withSizing(b, rng, 0.4, 0.15);
        }
        const ck = findType(legal, 'check');
        if (ck) return ck;
      }
      return legal[0] ?? fallback(obs);
    },
  };
}
