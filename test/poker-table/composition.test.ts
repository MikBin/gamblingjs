import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import { OmahaEvaluator } from '../../src/core/OmahaEvaluator';
import {
  alwaysCallAgent,
  enumerateCompositions,
  omahaHi,
  playHand,
  resolveHand,
  sevenStud,
  standardHoldem,
  validateHandConfig,
} from '../../src/poker-table';
import type { CompositionSelector } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const high = new HighEvaluator();
const omaha = new OmahaEvaluator();

describe('enumerateCompositions', () => {
  it('holdem: 21 best-5-of-7 combos from hole+community', () => {
    const sel: CompositionSelector = {
      total: 5,
      pools: [
        { pool: 'hole', min: 0, max: 5 },
        { pool: 'community', min: 0, max: 5 },
      ],
    };
    const combos = enumerateCompositions(sel, {
      hole: [0, 1],
      door: [],
      community: [2, 3, 4, 5, 6],
    });
    expect(combos.length).toBe(21);
    expect(new Set(combos.map((c) => c.join(','))).size).toBe(21);
  });

  it('omaha: 60 combos, each exactly 2 hole + 3 community', () => {
    const sel: CompositionSelector = {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 2 },
        { pool: 'community', exactly: 3 },
      ],
    };
    const hole = [0, 1, 2, 3];
    const community = [4, 5, 6, 7, 8];
    const combos = enumerateCompositions(sel, { hole, door: [], community });
    expect(combos.length).toBe(60);
    for (const c of combos) {
      const fromHole = c.filter((card) => hole.includes(card)).length;
      const fromComm = c.filter((card) => community.includes(card)).length;
      expect(fromHole).toBe(2);
      expect(fromComm).toBe(3);
    }
  });

  it('stud: 21 best-5-of-7 from the hand pool', () => {
    const sel: CompositionSelector = { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] };
    const hand = [0, 1, 2, 3, 4, 5, 6];
    const combos = enumerateCompositions(sel, { hole: hand, door: [], community: [] });
    expect(combos.length).toBe(21);
  });
});

describe('config validation', () => {
  it('accepts the standard presets', () => {
    expect(() => validateHandConfig(standardHoldem().hand)).not.toThrow();
    expect(() => validateHandConfig(omahaHi().hand)).not.toThrow();
    expect(() => validateHandConfig(sevenStud().hand)).not.toThrow();
  });

  it('rejects an unsatisfiable exactly constraint', () => {
    const bad = standardHoldem();
    bad.hand.evaluation.composition = {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 3 },
        { pool: 'community', min: 0, max: 5 },
      ],
    };
    expect(() => validateHandConfig(bad.hand)).toThrow();
  });

  it('rejects an unreachable total', () => {
    const bad = standardHoldem();
    bad.hand.evaluation.composition = {
      total: 8,
      pools: [
        { pool: 'hole', min: 0, max: 5 },
        { pool: 'community', min: 0, max: 5 },
      ],
    };
    expect(() => validateHandConfig(bad.hand)).toThrow();
  });

  it('rejects a pool referenced twice', () => {
    const bad = omahaHi();
    bad.hand.evaluation.composition = {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 2 },
        { pool: 'hole', exactly: 1 },
        { pool: 'community', exactly: 2 },
      ],
    };
    expect(() => validateHandConfig(bad.hand)).toThrow();
  });
});

describe('showdown cross-checks across variants', () => {
  it('known hand: a straight outranks a pair under the canonical card encoding', () => {
    // encoding B: card = suit*13 + rank (rank = c%13, 0='2' … 12='A')
    const C = (r: number, s = 0) => s * 13 + r;
    const board = [C(6), C(7), C(8), C(9), C(2)]; // 8 9 T J 4
    const sel = standardHoldem().hand.evaluation.composition;
    const straight = resolveHand(
      { hole: [C(10), C(11)], door: [], community: board },
      sel,
      'high',
      'high-wins',
    );
    const pair = resolveHand(
      { hole: [C(7, 1), C(0)], door: [], community: board },
      sel,
      'high',
      'high-wins',
    );
    expect(straight.rank).toBeGreaterThan(pair.rank);
  });

  it('holdem winner == HighEvaluator best-5-of-7', () => {
    const res = playHand(
      standardHoldem().table,
      standardHoldem().hand,
      [alwaysCallAgent, alwaysCallAgent],
      7,
    );
    const ranks = res.dealt.hole.map((h) => high.evaluate([...h, ...res.dealt.community]));
    const best = Math.max(...ranks);
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
  });

  it('omaha winner == OmahaEvaluator (exactly-2/exactly-3 enforced)', () => {
    const preset = omahaHi();
    const res = playHand(preset.table, preset.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(res.dealt.community.length).toBe(5);
    const ranks = res.dealt.hole.map((h) => {
      omaha.setHoleCards(h);
      return omaha.evaluate(res.dealt.community);
    });
    const best = Math.max(...ranks);
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
  });

  it('omaha enforces exactly-2 hole (matches the reference OmahaEvaluator)', () => {
    const community = [0, 1, 2, 3, 4]; // 2s 3s 4s 5s 6s — straight flush on board
    const hole = [12, 25, 38, 51]; // four aces
    const constrained = resolveHand(
      { hole, door: [], community },
      {
        total: 5,
        pools: [
          { pool: 'hole', exactly: 2 },
          { pool: 'community', exactly: 3 },
        ],
      },
      'high',
      'high-wins',
    );
    omaha.setHoleCards(hole);
    expect(constrained.rank).toBe(omaha.evaluate(community));
    // board straight flush is unreachable under exactly-2-hole; constrained lands on aces-up at best
    expect(constrained.rank).toBeLessThan(high.evaluate([0, 1, 2, 3, 4]));
  });

  it('stud winner == HighEvaluator best-5-of-7 on own 7', () => {
    const preset = sevenStud();
    const res = playHand(preset.table, preset.hand, [alwaysCallAgent, alwaysCallAgent], 33);
    const ranks = res.dealt.hole.map((down, seat) => {
      const own7 = [...down, ...res.dealt.up[seat]!];
      expect(own7.length).toBe(7);
      return high.evaluate(own7);
    });
    const best = Math.max(...ranks);
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
  });
});
