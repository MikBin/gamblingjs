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
import type { ActionType, PlayerAgent } from '../../src/poker-table';

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
