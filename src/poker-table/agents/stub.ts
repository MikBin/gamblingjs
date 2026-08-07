import type { Action, Observation } from '../engine/state';
import type { PlayerAgent } from './types';
import { createRng } from '../engine/rng';

type Rng = ReturnType<typeof createRng>;

const fallback = (obs: Observation): Action => ({
  type: 'fold',
  seat: obs.seat,
  streetIndex: obs.streetIndex,
});

function randUnit(rng: Rng): number {
  return rng.nextInt(1000) / 1000;
}

// Pick a bet/raise size within [min,max] as a sub-fraction of the range.
function withSizing(a: Action, rng: Rng, fracLo: number, fracHi: number): Action {
  if (a.type === 'bet') {
    const min = a.min ?? a.amount ?? 1;
    const max = a.max ?? min;
    const amount = Math.max(
      min,
      Math.min(max, Math.round(min + (max - min) * (fracLo + randUnit(rng) * (fracHi - fracLo)))),
    );
    return { ...a, amount };
  }
  if (a.type === 'raise') {
    const min = a.min ?? a.to ?? 1;
    const max = a.max ?? min;
    const to = Math.max(
      min,
      Math.min(max, Math.round(min + (max - min) * (fracLo + randUnit(rng) * (fracHi - fracLo)))),
    );
    return { ...a, to };
  }
  return { ...a };
}

const findType = (legal: Action[], type: Action['type']): Action | undefined =>
  legal.find((a) => a.type === type);

export const alwaysCallAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const call = findType(obs.legalActions, 'call');
    if (call) return call;
    const check = findType(obs.legalActions, 'check');
    if (check) return check;
    return obs.legalActions[0] ?? fallback(obs);
  },
};

export const alwaysFoldAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const fold = findType(obs.legalActions, 'fold');
    if (fold) return fold;
    const check = findType(obs.legalActions, 'check');
    if (check) return check;
    return obs.legalActions[0] ?? fallback(obs);
  },
};

// Uniformly random legal action with random sizing — fuzzes every branch.
export function createRandomAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const legal = obs.legalActions;
      if (legal.length === 0) return fallback(obs);
      const a = legal[rng.nextInt(legal.length)]!;
      return withSizing(a, rng, 0, 1);
    },
  };
}

// Loose-aggressive: raises/bets often, calls sometimes, rarely folds.
export function createAggressiveAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const legal = obs.legalActions;
      const facingBet = !!findType(legal, 'fold');
      const roll = rng.nextInt(100);
      if (facingBet) {
        if (roll < 60) {
          const r = findType(legal, 'raise');
          if (r) return withSizing(r, rng, 0.5, 1);
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
          if (b) return withSizing(b, rng, 0.4, 1);
        }
        const ck = findType(legal, 'check');
        if (ck) return ck;
      }
      return legal[0] ?? fallback(obs);
    },
  };
}

// Maniac: always raises/bets, never folds or merely calls.
export function createManiacAgent(seed: number): PlayerAgent {
  const rng = createRng(seed);
  return {
    decide(obs: Observation): Action {
      const legal = obs.legalActions;
      const r = findType(legal, 'raise');
      if (r) return withSizing(r, rng, 0.6, 1);
      const b = findType(legal, 'bet');
      if (b) return withSizing(b, rng, 0.6, 1);
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
      const legal = obs.legalActions;
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
        if (b) return withSizing(b, rng, 0.2, 0.5);
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
      const legal = obs.legalActions;
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
          if (b) return withSizing(b, rng, 0.5, 0.8);
        }
        const ck = findType(legal, 'check');
        if (ck) return ck;
      }
      return legal[0] ?? fallback(obs);
    },
  };
}
