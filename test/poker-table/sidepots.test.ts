import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import { alwaysCallAgent, buildPots, playHand, standardHoldem } from '../../src/poker-table';
import type { PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const high = new HighEvaluator();

// shoves whenever legal, else calls (so deep stacks cover the all-in players)
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

const foldAgent: PlayerAgent = {
  decide(obs) {
    const fold = obs.legalActions.find((a) => a.type === 'fold');
    if (fold) return fold;
    const check = obs.legalActions.find((a) => a.type === 'check');
    if (check) return check;
    return obs.legalActions[0] ?? { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  },
};

const zeroSum = (s: number[]): number => s.reduce((a, b) => a + b, 0);

describe('buildPots (tier construction)', () => {
  it('splits even contributions into a single main pot', () => {
    const { tiers, refund } = buildPots([50, 50, 50], [true, true, true]);
    expect(refund).toBeNull();
    expect(tiers).toEqual([{ amount: 150, eligible: [0, 1, 2] }]);
  });

  it('builds main + side tiers from uneven all-in contributions', () => {
    // stacks 100/60/30 all matched -> contributions [60,60,30]
    const { tiers, refund } = buildPots([60, 60, 30], [true, true, true]);
    expect(refund).toBeNull();
    expect(tiers).toEqual([
      { amount: 90, eligible: [0, 1, 2] }, // level 30: 30 x 3
      { amount: 60, eligible: [0, 1] }, // level 60: (60-30) x 2
    ]);
  });

  it('refunds an uncalled total overbet to the over-bettor', () => {
    // seat 0 shoved 200 but only 60 callable -> refund 140
    const { tiers, refund } = buildPots([200, 60, 30], [true, true, true]);
    expect(refund).toEqual({ seat: 0, amount: 140 });
    expect(tiers).toEqual([
      { amount: 90, eligible: [0, 1, 2] },
      { amount: 60, eligible: [0, 1] },
    ]);
  });

  it('keeps a folded seat ineligible while its money stays in the tiers', () => {
    const { tiers } = buildPots([60, 60, 30], [false, true, true]); // seat 0 folded
    expect(tiers).toEqual([
      { amount: 90, eligible: [1, 2] },
      { amount: 60, eligible: [1] },
    ]);
  });

  it('a short all-in is ineligible for the side pot', () => {
    const { tiers } = buildPots([60, 60, 30], [true, true, true]);
    expect(tiers[1]!.eligible).not.toContain(2); // seat 2 (wagered 30) can't win the side
  });

  it('rolls an all-folded dead-money tier into the main pot', () => {
    // seats 0 & 1 folded after over-betting; only seat 2 eligible
    const { tiers, refund } = buildPots([100, 60, 30], [false, false, true]);
    expect(refund).toEqual({ seat: 0, amount: 40 }); // 100 -> 60 (second-highest)
    expect(tiers).toEqual([{ amount: 150, eligible: [2] }]); // side tier merged into main
  });
});

describe('3-way all-in (stacks 100/60/30)', () => {
  it('produces an exact, zero-sum main + side distribution', () => {
    const g = standardHoldem({ seats: 3, sb: 1, bb: 2 });
    const stacks = [100, 60, 30];
    const res = playHand(g.table, g.hand, [shoveAgent, shoveAgent, shoveAgent], 42, stacks);

    expect(zeroSum(res.finalStacks)).toBe(190); // AC: zero-sum including side pots
    expect(res.pots).toHaveLength(2);
    expect(res.pots[0]!.amount).toBe(90); // main
    expect(res.pots[1]!.amount).toBe(60); // side
    expect(res.pots[1]!.eligible).toEqual([0, 1]); // seat 2 (short) excluded from side

    // reference: contributions [60,60,30]; award tiers by best 5-of-7 rank
    const ranks = res.dealt.hole.map((h, seat) => high.evaluate([...h, ...res.dealt.community]));
    const expected = [100, 60, 30];
    const wagered = [60, 60, 30];

    const award = (amount: number, elig: number[]) => {
      let best = -Infinity;
      for (const s of elig) best = Math.max(best, ranks[s]!);
      const tops = elig.filter((s) => ranks[s] === best).sort((a, b) => a - b);
      const share = Math.floor(amount / tops.length);
      const rem = amount - share * tops.length;
      tops.forEach((s, i) => {
        expected[s]! += share + (i === 0 ? rem : 0);
      });
      return tops;
    };

    const mainWinners = award(90, [0, 1, 2]);
    const sideWinners = award(60, [0, 1]);
    for (let i = 0; i < 3; i++) expected[i]! -= wagered[i]!;

    expect(res.finalStacks).toEqual(expected);
    expect(res.pots[0]!.winners.sort((a, b) => a - b)).toEqual(mainWinners);
    expect(res.pots[1]!.winners.sort((a, b) => a - b)).toEqual(sideWinners);
    // AC: all-in for less (seat 2) never wins the side pot
    expect(sideWinners).not.toContain(2);
  });

  it('returns an uncalled overbet so the deep stack can only lose the callable amount', () => {
    const g = standardHoldem({ seats: 3, sb: 1, bb: 2 });
    const res = playHand(g.table, g.hand, [shoveAgent, shoveAgent, shoveAgent], 7, [200, 60, 30]);
    expect(zeroSum(res.finalStacks)).toBe(290);
    // seat 0 risked at most 60 (callable), so it keeps at least 140
    expect(res.finalStacks[0]).toBeGreaterThanOrEqual(140);
  });

  it('a folded seat never wins any pot tier', () => {
    const g = standardHoldem({ seats: 3, sb: 1, bb: 2 });
    const res = playHand(g.table, g.hand, [foldAgent, shoveAgent, shoveAgent], 19, [100, 60, 30]);
    expect(zeroSum(res.finalStacks)).toBe(190);
    for (const pot of res.pots) expect(pot.winners).not.toContain(0);
    expect(res.winners.map((w) => w.seat)).not.toContain(0);
  });

  it('runs cleanly to showdown with equal stacks (single tier)', () => {
    const g = standardHoldem({ seats: 3, sb: 1, bb: 2 });
    const res = playHand(
      g.table,
      g.hand,
      [alwaysCallAgent, alwaysCallAgent, alwaysCallAgent],
      5,
      [200, 200, 200],
    );
    expect(zeroSum(res.finalStacks)).toBe(600);
    expect(res.pots).toHaveLength(1);
  });
});
