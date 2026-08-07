import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { LowAto5Evaluator } from '../../src/core/LowEvaluator';
import { handOfSevenEvalLowBall27Indexed } from '../../src/pokerEvaluator7';
import {
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createTightAgent,
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

// encoding B: card = suit*13 + rank (rank = c%13, 0='2' … 12='A')
const C = (rank: number, suit = 0) => suit * 13 + rank;
const wheel = [C(12, 0), C(0, 1), C(1, 2), C(2, 3), C(3, 0)]; // A,2,3,4,5
const nineHigh = [C(12, 0), C(4, 1), C(5, 2), C(6, 3), C(7, 0)]; // A,6,7,8,9
const worse8 = [C(12, 0), C(3, 1), C(4, 2), C(5, 3), C(6, 0)]; // A,5,6,7,8

describe('lowRankA5 (qualify boundary)', () => {
  it('qualifies the wheel under both 8 and 9', () => {
    expect(lowRankA5(wheel, 8)).not.toBe(-1);
    expect(lowRankA5(wheel, 9)).not.toBe(-1);
  });

  it('rejects a 9-high low under qualifier 8 but accepts it under 9', () => {
    expect(lowRankA5(nineHigh, 8)).toBe(-1);
    expect(lowRankA5(nineHigh, 9)).not.toBe(-1);
  });

  it('ranks a wheel better than a worse 8-qualifying low (smaller = better)', () => {
    expect(lowRankA5(wheel, 8)).toBeLessThan(lowRankA5(worse8, 8));
  });
});

describe('resolveHiLo', () => {
  it('computes independent high and low halves from a 5-card pool', () => {
    const sel: CompositionSelector = { total: 5, pools: [{ pool: 'hole', exactly: 5 }] };
    const r = resolveHiLo({ hole: wheel, door: [], community: [] }, sel, 8);
    expect(r.low).not.toBe(-1); // wheel qualifies
  });
});

describe('resolveHand (low8 / low9 single-winner)', () => {
  const sel: CompositionSelector = { total: 5, pools: [{ pool: 'hole', exactly: 5 }] };

  it('low8 ranks a wheel and rejects a 9-high (no qualifying combo)', () => {
    const good = resolveHand({ hole: wheel, door: [], community: [] }, sel, 'low8');
    const none = resolveHand({ hole: nineHigh, door: [], community: [] }, sel, 'low8');
    expect(good.rank).toBeGreaterThan(Number.NEGATIVE_INFINITY);
    expect(none.rank).toBe(Number.NEGATIVE_INFINITY);
  });

  it('low9 accepts a 9-high low', () => {
    const r = resolveHand({ hole: nineHigh, door: [], community: [] }, sel, 'low9');
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
    expect(s.highAwards.get(0)).toBe(50);
    expect(s.lowAwards.get(1)).toBe(50);
    expect(s.lowAwards.get(0) ?? 0).toBe(0);
  });

  it('records correct per-half amounts when one seat wins both halves', () => {
    const evals = new Map([
      [0, { high: 100, low: 5 }],
      [1, { high: 90, low: -1 }],
    ]);
    const s = splitHiLo([0, 1], evals, 30);
    expect(s.highWinners).toEqual([0]);
    expect(s.lowWinners).toEqual([0]);
    expect(s.highAwards.get(0)).toBe(15);
    expect(s.lowAwards.get(0)).toBe(15);
    expect(s.awards.get(0)).toBe(30); // total, not doubled
    expect(s.awards.get(1) ?? 0).toBe(0);
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

describe('PL Omaha Hi/Lo (6-handed, mixed bots) — split & side pots', () => {
  const mix: ((seed: number) => PlayerAgent)[] = [
    (s) => createRandomAgent(s),
    (s) => createAggressiveAgent(s),
    (s) => createManiacAgent(s),
    (s) => createCallingStationAgent(s),
    (s) => createTightAgent(s),
    (s) => createRandomAgent(s),
  ];
  const stacks = [200, 150, 100, 60, 30, 200];

  function plOmahaHiLo6(): GamePresetLike {
    const g = omahaHiLo({ sb: 1, bb: 2, stack: 200 });
    g.table.seats = { min: 6, max: 6 };
    g.table.gameId = 'omaha-hilo-pl';
    g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: { type: 'pot-limit' as const } }));
    return g as GamePresetLike;
  }

  it('runs 80 hands zero-sum and exercises hi-lo splits AND multi-tier side pots', () => {
    const g = plOmahaHiLo6();
    const start = stacks.reduce((a, b) => a + b, 0);
    let splits = 0; // a low half was awarded
    let scoops = 0; // no qualifying low -> high scoops
    let sidePotHands = 0; // >= 2 pot tiers
    let maxTiers = 0;
    let splitAcrossSidePot = 0; // a hand with both a split AND >=2 tiers

    for (let seed = 1; seed <= 80; seed++) {
      const agents = mix.map((mk, i) => mk(seed * 97 + i * 31));
      const res = playHand(g.table, g.hand, agents, seed, stacks);
      expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(start); // zero-sum

      const hasLow = res.winners.some((w) => w.half === 'low');
      if (hasLow) splits++;
      else scoops++;
      if (res.pots.length > 1) sidePotHands++;
      maxTiers = Math.max(maxTiers, res.pots.length);
      if (hasLow && res.pots.length > 1) splitAcrossSidePot++;
    }

    // eslint-disable-next-line no-console
    console.log(
      `PL Omaha Hi/Lo 6-max x80: splits=${splits} scoops=${scoops} sidePotHands=${sidePotHands} split+sidePot=${splitAcrossSidePot} maxTiers=${maxTiers}`,
    );
    expect(splits).toBeGreaterThan(0); // hi-lo split occurred
    expect(scoops).toBeGreaterThan(0); // no-low scoop occurred
    expect(sidePotHands).toBeGreaterThan(0); // side pots occurred
    expect(splitAcrossSidePot).toBeGreaterThan(0); // split resolved across multiple tiers
  });
});

type GamePresetLike = ReturnType<typeof omahaHiLo>;
