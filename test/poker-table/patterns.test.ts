import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  alwaysCallAgent,
  enumerateCompositions,
  pairTripsGame,
  patternOk,
  playHand,
  resolveHand,
  validateHandConfig,
} from '../../src/poker-table';
import type { CompositionSelector, HandPattern } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

// card = suit*13 + rank (encoding B: rank = c%13, 0='2' … 12='A'; suit = floor(c/13))
const C = (rank: number, suit = 0) => suit * 13 + rank;
const ACE = 12;
const KING = 11;
const pair = (r: number): [number, number] => [C(r, 0), C(r, 1)];
const trips = (r: number): number[] => [C(r, 0), C(r, 1), C(r, 2)];

describe('patternOk (named patterns)', () => {
  it('pair / trips detect matching ranks', () => {
    expect(patternOk(pair(ACE), 'pair')).toBe(true);
    expect(patternOk([C(ACE, 0), C(0, 1)], 'pair')).toBe(false);
    expect(patternOk(trips(KING), 'trips')).toBe(true);
    expect(patternOk([C(KING, 0), C(KING, 1), C(0, 2)], 'trips')).toBe(false);
  });

  it('flush requires a single suit', () => {
    expect(patternOk([C(0, 0), C(1, 0), C(2, 0)], 'flush')).toBe(true);
    expect(patternOk([C(0, 0), C(1, 1), C(2, 0)], 'flush')).toBe(false);
  });

  it('straight matches consecutive ranks incl. wheel and broadway', () => {
    expect(patternOk([C(0), C(1), C(2), C(3), C(4)], 'straight')).toBe(true); // 2-6
    expect(patternOk([C(0), C(1), C(2), C(3), C(ACE)], 'straight')).toBe(true); // wheel A-5
    expect(patternOk([C(8), C(9), C(10), C(11), C(ACE)], 'straight')).toBe(true); // broadway
    expect(patternOk([C(0), C(1), C(2), C(3), C(5)], 'straight')).toBe(false); // gap
    expect(patternOk([C(0), C(0), C(2), C(3), C(4)], 'straight')).toBe(false); // pair
  });

  it("'any' accepts anything", () => {
    expect(patternOk([C(0), C(1)], 'any')).toBe(true);
  });
});

describe('patternOk (custom predicate)', () => {
  const isPair: HandPattern = (cards) => cards.length === 2 && cards[0]! % 13 === cards[1]! % 13;

  it('is honored identically to a named pattern', () => {
    expect(patternOk(pair(ACE), isPair)).toBe(true);
    expect(patternOk([C(ACE, 0), C(0, 1)], isPair)).toBe(false);
  });
});

describe('enumerateCompositions (pattern filtering)', () => {
  const sel: CompositionSelector = {
    total: 5,
    pools: [
      { pool: 'hole', exactly: 2, pattern: 'pair' },
      { pool: 'community', exactly: 3, pattern: 'trips' },
    ],
  };

  it('keeps only combos whose per-pool cards satisfy the pattern', () => {
    const pools = {
      hole: pair(ACE), // a pair
      door: [],
      community: [...trips(KING), C(0, 3), C(1, 3)], // trips available + fillers
    };
    const combos = enumerateCompositions(sel, pools);
    expect(combos).toHaveLength(1); // AA from hole + KKK from community
    const combo = combos[0]!;
    expect(combo.filter((c) => c % 13 === ACE)).toHaveLength(2);
    expect(combo.filter((c) => c % 13 === KING)).toHaveLength(3);
  });

  it('yields nothing when no per-pool subset satisfies the pattern', () => {
    const pools = {
      hole: [C(ACE, 0), C(0, 1)], // not a pair
      door: [],
      community: [...trips(KING), C(0, 3), C(1, 3)],
    };
    expect(enumerateCompositions(sel, pools)).toHaveLength(0);
  });
});

describe('resolveHand with per-pool patterns (invented game)', () => {
  const sel: CompositionSelector = {
    total: 5,
    pools: [
      { pool: 'hole', exactly: 2, pattern: 'pair' },
      { pool: 'community', exactly: 3, pattern: 'trips' },
    ],
  };
  const board = (): number[] => [...trips(KING), C(0, 3), C(1, 3)];

  it('evaluates the AA + KKK full house when the patterns match', () => {
    const r = resolveHand(
      { hole: pair(ACE), door: [], community: board() },
      sel,
      'high',
      'high-wins',
    );
    expect(r.cards).toHaveLength(5);
    expect(r.rank).toBeGreaterThan(0); // a real ranked hand (full house), not worst
  });

  it('ranks as worst possible (no crash) when no legal composition exists', () => {
    const r = resolveHand(
      { hole: [C(ACE, 0), C(0, 1)], door: [], community: board() },
      sel,
      'high',
      'high-wins',
    );
    expect(r.rank).toBe(Number.NEGATIVE_INFINITY);
    expect(r.cards).toEqual([]);
  });

  it('treats a custom predicate identically to the named pattern', () => {
    const customSel: CompositionSelector = {
      total: 5,
      pools: [
        {
          pool: 'hole',
          exactly: 2,
          pattern: (cards) => cards.length === 2 && cards[0]! % 13 === cards[1]! % 13,
        },
        { pool: 'community', exactly: 3, pattern: 'trips' },
      ],
    };
    const r = resolveHand(
      { hole: pair(ACE), door: [], community: board() },
      customSel,
      'high',
      'high-wins',
    );
    expect(r.cards).toHaveLength(5);
  });
});

describe('validation', () => {
  it('rejects a trips pattern on a pool that cannot select 3 cards', () => {
    const g = pairTripsGame();
    g.hand.evaluation.composition.pools[1]!.exactly = 2; // cannot form trips
    expect(() => validateHandConfig(g.hand)).toThrow();
  });
});

describe('invented game end-to-end', () => {
  it('runs to a zero-sum showdown with no engine branching', () => {
    const g = pairTripsGame({ sb: 1, bb: 2, stack: 200 });
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 4242);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
    expect(res.isTerminal).toBe(true);
  });
});
