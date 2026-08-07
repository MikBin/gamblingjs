import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createTightAgent,
  playHand,
  standardHoldem,
} from '../../src/poker-table';
import type { Action, ActionType, Observation, PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

type Profile = 'random' | 'aggressive' | 'maniac' | 'station' | 'tight' | 'call';

function buildLineup(seed: number, profiles: Profile[]): PlayerAgent[] {
  return profiles.map((p, i) => {
    const s = seed * 97 + i * 31;
    switch (p) {
      case 'random':
        return createRandomAgent(s);
      case 'aggressive':
        return createAggressiveAgent(s);
      case 'maniac':
        return createManiacAgent(s);
      case 'station':
        return createCallingStationAgent(s);
      case 'tight':
        return createTightAgent(s);
      case 'call':
        return alwaysCallAgent;
    }
  });
}

// A minimal observation for driving a bot's decide() in isolation.
function fakeObs(legal: Action[], stack = 20000, pot = 200): Observation {
  return {
    seat: 0,
    actingSeat: 0,
    buttonSeat: 0,
    streetIndex: 1,
    streetName: 'flop',
    community: [],
    up: [],
    players: [
      { seat: 0, stack, bet: 0, wagered: 0, status: 'active' },
      { seat: 1, stack, bet: 0, wagered: 0, status: 'active' },
    ],
    actionLog: [],
    pot,
    myHole: [],
    toCall: 0,
    legalActions: legal,
    isTerminal: false,
  };
}

describe('bot agents produce legal actions', () => {
  const profiles: Profile[] = ['random', 'aggressive', 'maniac', 'station', 'tight', 'call'];

  it.each(profiles)('%s bot never issues an illegal action across 20 hands', (profile) => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    for (let seed = 1; seed <= 20; seed++) {
      const agents = buildLineup(seed, [profile, profile]);
      expect(() => playHand(g.table, g.hand, agents, seed)).not.toThrow();
    }
  });
});

describe('6-handed tables (mixed lineup)', () => {
  const mix: Profile[] = ['random', 'aggressive', 'maniac', 'station', 'tight', 'call'];

  it('runs zero-sum with no illegal action across many hands (even stacks)', () => {
    const g = standardHoldem({ seats: 6, sb: 1, bb: 2, stack: 200 });
    for (let seed = 1; seed <= 40; seed++) {
      const agents = buildLineup(seed, mix);
      const res = playHand(g.table, g.hand, agents, seed);
      const total = res.finalStacks.reduce((a, b) => a + b, 0);
      expect(total).toBe(200 * 6); // zero-sum
    }
  });

  it('runs zero-sum across uneven stacks (exercises side pots)', () => {
    const g = standardHoldem({ seats: 6, sb: 1, bb: 2, stack: 200 });
    const stacks = [200, 150, 100, 60, 30, 200];
    for (let seed = 1; seed <= 30; seed++) {
      const agents = buildLineup(seed, mix);
      const res = playHand(g.table, g.hand, agents, seed, stacks);
      expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(stacks.reduce((a, b) => a + b, 0));
    }
  });

  it('exercises every action type across the hand batch', () => {
    const g = standardHoldem({ seats: 6, sb: 1, bb: 2, stack: 200 });
    const seen = new Set<ActionType>();
    for (let seed = 1; seed <= 40; seed++) {
      const agents = buildLineup(seed, mix);
      const res = playHand(g.table, g.hand, agents, seed);
      for (const a of res.actions) seen.add(a.type);
    }
    for (const t of ['fold', 'check', 'call', 'bet', 'raise', 'allin'] as ActionType[]) {
      expect(seen.has(t)).toBe(true);
    }
  });

  it('pure maniac lineup still converges and stays zero-sum', () => {
    const g = standardHoldem({ seats: 6, sb: 1, bb: 2, stack: 200 });
    for (let seed = 1; seed <= 15; seed++) {
      const agents = buildLineup(seed, [
        'maniac',
        'maniac',
        'maniac',
        'maniac',
        'maniac',
        'maniac',
      ]);
      const res = playHand(g.table, g.hand, agents, seed);
      expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(200 * 6);
    }
  });
});

describe('gaussian bet sizing (extreme bets are rare)', () => {
  it('is deterministic per seed', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const r1 = playHand(g.table, g.hand, [createRandomAgent(7), alwaysCallAgent], 3);
    const r2 = playHand(g.table, g.hand, [createRandomAgent(7), alwaysCallAgent], 3);
    expect(r1.actions).toEqual(r2.actions);
  });

  it('clusters sizes mid-range and makes max-size bets rare', () => {
    const bet: Action = { type: 'bet', seat: 0, streetIndex: 1, min: 100, max: 10000, amount: 100 };
    const fracs: number[] = [];
    for (let seed = 0; seed < 2000; seed++) {
      const a = createRandomAgent(seed).decide(fakeObs([bet]));
      if (a.type === 'bet' && a.amount !== undefined) {
        fracs.push((a.amount - 100) / (10000 - 100));
      }
    }
    expect(fracs.length).toBe(2000);
    const extreme = fracs.filter((f) => f >= 0.9).length / fracs.length;
    const mid = fracs.filter((f) => f >= 0.15 && f <= 0.75).length / fracs.length;
    expect(extreme).toBeLessThan(0.05); // near-max sizes are rare
    expect(mid).toBeGreaterThan(0.6); // sizes cluster mid-range
  });

  it('all-in is rare but reachable for the random bot', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    let allins = 0;
    let total = 0;
    for (let seed = 1; seed <= 300; seed++) {
      const res = playHand(g.table, g.hand, [createRandomAgent(seed), alwaysCallAgent], seed);
      for (const a of res.actions) {
        total++;
        if (a.type === 'allin') allins++;
      }
    }
    expect(total).toBeGreaterThan(500);
    expect(allins).toBeGreaterThan(0); // still reachable
    expect(allins / total).toBeLessThan(0.1); // but rare
  });

  it('a desperate short stack shoves much more often', () => {
    // 3x pot by design in the fake observation → the desperation gate (0.35)
    // dominates the base 2% shove probability.
    const allin: Action = { type: 'allin', seat: 0, streetIndex: 1, amount: 400 };
    const check: Action = { type: 'check', seat: 0, streetIndex: 1 };
    let shoves = 0;
    const n = 200;
    for (let seed = 0; seed < n; seed++) {
      const a = createRandomAgent(seed).decide(fakeObs([allin, check], 400, 4000));
      if (a.type === 'allin') shoves++;
    }
    expect(shoves / n).toBeGreaterThan(0.2); // well above the 2% base rate
  });
});
