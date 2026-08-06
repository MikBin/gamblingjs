import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { LowAto5Evaluator } from '../../src/core/LowEvaluator';
import { handOfSevenEvalLowBall27Indexed } from '../../src/pokerEvaluator7';
import {
  alwaysCallAgent,
  deuceSeven,
  lowRankA5,
  omahaHiLo,
  playHand,
  razz,
  resolveHand,
  resolveHiLo,
  splitHiLo,
} from '../../src/poker-table';
import type { CompositionSelector, PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
  fastHashesCreators['2to7']();
});

const a5 = new LowAto5Evaluator();

const shoveAgent: PlayerAgent = {
  decide(obs) {
    const allin = obs.legalActions.find((a) => a.type === 'allin');
    if (allin) return allin;
    const call = obs.legalActions.find((a) => a.type === 'call');
    if (call) return call;
    const check = obs.legalActions.find((a) => a.type === 'check');
    if (check) return check;
    return obs.legalActions[0] ?? { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  },
};

const zeroSum = (s: number[]): number => s.reduce((a, b) => a + b, 0);

describe('lowRankA5 (qualify boundary)', () => {
  const wheel = [48, 0, 4, 8, 12]; // A,2,3,4,5
  const nineHigh = [48, 16, 20, 24, 28]; // A,6,7,8,9

  it('qualifies the wheel under both 8 and 9', () => {
    expect(lowRankA5(wheel, 8)).not.toBe(-1);
    expect(lowRankA5(wheel, 9)).not.toBe(-1);
  });

  it('rejects a 9-high low under qualifier 8 but accepts it under 9', () => {
    expect(lowRankA5(nineHigh, 8)).toBe(-1);
    expect(lowRankA5(nineHigh, 9)).not.toBe(-1);
  });

  it('ranks a wheel better than a worse 8-qualifying low (smaller = better)', () => {
    const worse8 = [48, 16, 20, 24, 12]; // A,5,6,7,8
    expect(lowRankA5(wheel, 8)).toBeLessThan(lowRankA5(worse8, 8));
  });
});

describe('resolveHiLo', () => {
  it('computes independent high and low halves from a 5-card pool', () => {
    const sel: CompositionSelector = { total: 5, pools: [{ pool: 'hole', exactly: 5 }] };
    const r = resolveHiLo({ hole: [48, 0, 4, 8, 12], door: [], community: [] }, sel, 8);
    expect(r.low).not.toBe(-1); // wheel qualifies
  });
});

describe('resolveHand (low8 / low9 single-winner)', () => {
  const sel: CompositionSelector = { total: 5, pools: [{ pool: 'hole', exactly: 5 }] };

  it('low8 ranks a wheel and rejects a 9-high (no qualifying combo)', () => {
    const wheel = resolveHand({ hole: [48, 0, 4, 8, 12], door: [], community: [] }, sel, 'low8');
    const none = resolveHand({ hole: [48, 16, 20, 24, 28], door: [], community: [] }, sel, 'low8');
    expect(wheel.rank).toBeGreaterThan(Number.NEGATIVE_INFINITY);
    expect(none.rank).toBe(Number.NEGATIVE_INFINITY);
  });

  it('low9 accepts a 9-high low', () => {
    const r = resolveHand({ hole: [48, 16, 20, 24, 28], door: [], community: [] }, sel, 'low9');
    expect(r.rank).toBeGreaterThan(Number.NEGATIVE_INFINITY);
  });
});

describe('splitHiLo (pot-layer split)', () => {
  it('splits a tier between the high and low winners', () => {
    const evals = new Map([
      [0, { high: 100, low: 5 }],
      [1, { high: 90, low: 3 }],
    ]);
    const s = splitHiLo([0, 1], evals, 100);
    expect(s.highWinners).toEqual([0]);
    expect(s.lowWinners).toEqual([1]);
    expect(s.hasLow).toBe(true);
    expect(s.awards.get(0)).toBe(50);
    expect(s.awards.get(1)).toBe(50);
  });

  it('scoops the whole tier to high when no low qualifies', () => {
    const evals = new Map([
      [0, { high: 100, low: -1 }],
      [1, { high: 90, low: -1 }],
    ]);
    const s = splitHiLo([0, 1], evals, 100);
    expect(s.hasLow).toBe(false);
    expect(s.lowWinners).toEqual([]);
    expect(s.awards.get(0)).toBe(100);
    expect(s.awards.get(1) ?? 0).toBe(0);
  });

  it('splits a tie with the odd chip to the lowest seat', () => {
    const evals = new Map([
      [0, { high: 100, low: -1 }],
      [1, { high: 100, low: -1 }],
    ]);
    const s = splitHiLo([0, 1], evals, 101);
    expect(s.highWinners).toEqual([0, 1]);
    expect(s.awards.get(0)).toBe(51);
    expect(s.awards.get(1)).toBe(50);
  });
});

describe('razz (A-5 lowball, low-wins)', () => {
  it('awards the pot to the best A-5 low', () => {
    const g = razz({ ante: 1, bringIn: 1, stack: 200 });
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 42);
    const ranks = res.dealt.hole.map((h, seat) => a5.evaluate([...h, ...res.dealt.up[seat]!]));
    const best = Math.max(...ranks); // A-5: higher value = better low
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
    expect(zeroSum(res.finalStacks)).toBe(400);
  });
});

describe('2-7 lowball (low-wins)', () => {
  it('awards the pot to the best deuce-to-seven low', () => {
    const g = deuceSeven({ ante: 1, bringIn: 1, stack: 200 });
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 42);
    const ranks = res.dealt.hole.map((h, seat) =>
      handOfSevenEvalLowBall27Indexed(...[...h, ...res.dealt.up[seat]!]),
    );
    const best = Math.min(...ranks); // 2-7: lower value = better low
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
    expect(zeroSum(res.finalStacks)).toBe(400);
  });
});

describe('Omaha Hi/Lo (8-qualify split)', () => {
  const omahaSel: CompositionSelector = {
    total: 5,
    pools: [
      { pool: 'hole', exactly: 2 },
      { pool: 'community', exactly: 3 },
    ],
  };

  it('splits the pot per the high/low halves (or scoops), zero-sum', () => {
    const g = omahaHiLo({ sb: 1, bb: 2, stack: 200 });
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 42);
    const evals = new Map(
      res.dealt.hole.map((h, seat) => [
        seat,
        resolveHiLo({ hole: h, door: [], community: res.dealt.community }, omahaSel, 8),
      ]),
    );
    const split = splitHiLo([0, 1], evals, 4); // pot = sb+bb+complete = 4
    const wagered = [2, 2];
    const expected = [0, 1].map((i) => 200 - wagered[i]! + (split.awards.get(i) ?? 0));
    expect(res.finalStacks).toEqual(expected);
    expect(zeroSum(res.finalStacks)).toBe(400);
    expect(res.pots).toHaveLength(1);
  });

  it('stays zero-sum across side pots (3-way all-in)', () => {
    const g = omahaHiLo({ sb: 1, bb: 2 });
    g.table.seats = { min: 3, max: 3 };
    const res = playHand(g.table, g.hand, [shoveAgent, shoveAgent, shoveAgent], 7, [200, 60, 30]);
    expect(zeroSum(res.finalStacks)).toBe(290);
  });
});
