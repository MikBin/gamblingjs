import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import {
  advanceToNextDecision,
  alwaysCallAgent,
  applyAction,
  computeLegalActions,
  createAggressiveAgent,
  createManiacAgent,
  createRandomAgent,
  createRng,
  fixedLimitStud,
  flBetUnit,
  initHand,
  playHand,
  replayHand,
} from '../../src/poker-table';
import type { PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const high = new HighEvaluator();
const zeroSum = (s: number[]): number => s.reduce((a, b) => a + b, 0);
const cardKey = (c: number): number => (c % 13) * 4 + Math.floor(c / 13); // lower = lower card

function mix(seat: number, seed: number): PlayerAgent {
  const s = seed * 131 + seat;
  return [
    createRandomAgent(s),
    createAggressiveAgent(s),
    createManiacAgent(s),
    createRandomAgent(s),
  ][seat % 4]!;
}

const stud6 = (stack = 200) => {
  const g = fixedLimitStud({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, maxRaises: 4, stack });
  g.table.seats = { min: 6, max: 6 };
  return g;
};

describe('FL Stud Hi — fixed-limit bet sizing', () => {
  const betting = { type: 'fixed-limit' as const, smallBet: 2, bigBet: 4, bigBetFromStreet: 2 };
  it('small on third/fourth, big from fifth street onward', () => {
    expect(flBetUnit(betting, 0, 5, 1)).toBe(2); // third
    expect(flBetUnit(betting, 1, 5, 1)).toBe(2); // fourth
    expect(flBetUnit(betting, 2, 5, 1)).toBe(4); // fifth (big)
    expect(flBetUnit(betting, 3, 5, 1)).toBe(4); // sixth
    expect(flBetUnit(betting, 4, 5, 1)).toBe(4); // seventh
  });
});

describe('FL Stud Hi — bring-in & antes', () => {
  it('posts the bring-in from the lowest upcard seat, counted toward the bet', () => {
    const g = stud6();
    const s = initHand(g.table, g.hand, createRng(3));

    // lowest upcard among all seats
    let lo = -1;
    let loKey = Infinity;
    for (const seat of s.seats) {
      if (seat.up.length && cardKey(seat.up[0]!) < loKey) {
        loKey = cardKey(seat.up[0]!);
        lo = seat.index;
      }
    }
    expect(s.actingSeat).toBe(lo); // lowest upcard acts first (posted bring-in)
    expect(s.seats[lo]!.wageredThisStreet).toBe(1); // bring-in amount
    expect(s.seats.every((x) => x.wageredTotal >= 1)).toBe(true); // ante from everyone

    // bring-in is counted toward the bet: the next seat faces toCall === bringIn
    let st = advanceToNextDecision(
      applyAction(s, { type: 'check', seat: lo, streetIndex: 0 }, g.hand),
    );
    const call = computeLegalActions(st, g.hand).find((a) => a.type === 'call');
    expect(call?.amount).toBe(1);
  });
});

describe('FL Stud Hi — winner is best high 5-of-7 on own cards', () => {
  it('matches HighEvaluator over each seat own 7 (6-handed, always-call)', () => {
    const g = stud6();
    const res = playHand(
      g.table,
      g.hand,
      Array.from({ length: 6 }, () => alwaysCallAgent),
      11,
    );
    const ranks = res.dealt.hole.map((down, seat) =>
      high.evaluate([...down, ...res.dealt.up[seat]!]),
    );
    const best = Math.max(...ranks);
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((x) => x >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
    expect(zeroSum(res.finalStacks)).toBe(6 * 200);
  });
});

describe('FL Stud Hi — convergence & zero-sum (raise cap enforced)', () => {
  it('maniac lineup converges with no illegal action (cap prevents raise loops)', () => {
    const g = stud6(1000);
    for (let seed = 1; seed <= 12; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => createManiacAgent(seed * 97 + i));
      expect(() => playHand(g.table, g.hand, agents, seed)).not.toThrow();
    }
  });

  it('random/aggressive mix stays zero-sum across many hands (even stacks)', () => {
    const g = stud6();
    for (let seed = 1; seed <= 30; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => mix(i, seed));
      const res = playHand(g.table, g.hand, agents, seed);
      expect(zeroSum(res.finalStacks)).toBe(6 * 200);
    }
  });

  it('uneven stacks stay zero-sum across side pots', () => {
    const g = stud6();
    const stacks = [200, 150, 100, 60, 30, 200];
    for (let seed = 1; seed <= 25; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => mix(i, seed));
      const res = playHand(g.table, g.hand, agents, seed, stacks);
      expect(zeroSum(res.finalStacks)).toBe(stacks.reduce((a, b) => a + b, 0));
    }
  });

  it('fold-down (some seats fold) still resolves zero-sum', () => {
    const g = stud6();
    const folders = Array.from({ length: 6 }, () => ({
      decide: (obs: { legalActions: { type: string }[] }) =>
        obs.legalActions.find((a) => a.type === 'fold') ?? obs.legalActions[0]!,
    })) as PlayerAgent[];
    for (let seed = 1; seed <= 15; seed++) {
      const res = playHand(g.table, g.hand, folders, seed);
      expect(zeroSum(res.finalStacks)).toBe(6 * 200);
    }
  });
});

describe('FL Stud Hi — determinism', () => {
  it('reproduces byte-identically from (seed, transcript)', () => {
    const g = stud6();
    const agents = Array.from({ length: 6 }, (_, i) => mix(i, 5));
    const orig = playHand(g.table, g.hand, agents, 5);
    const replayed = replayHand(g.table, g.hand, 5, orig.actions);
    expect(replayed.actions).toEqual(orig.actions);
    expect(replayed.finalStacks).toEqual(orig.finalStacks);
    expect(replayed.winners).toEqual(orig.winners);
  });
});

describe('FL Stud Hi — deck-exhaustion edge', () => {
  it('8-handed stud (56 cards > 52) completes via the common-card rule', () => {
    const g = fixedLimitStud({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, stack: 200 });
    g.table.seats = { min: 8, max: 8 };
    const res = playHand(
      g.table,
      g.hand,
      Array.from({ length: 8 }, () => alwaysCallAgent),
      1,
    );
    expect(res.isTerminal).toBe(true);
    expect(zeroSum(res.finalStacks)).toBe(8 * 200);
    for (const hole of res.dealt.hole) expect(hole.length).toBe(3);
    for (const up of res.dealt.up) expect(up.length).toBe(4);
  });

  it('7-handed stud (49 cards) completes fine', () => {
    const g = fixedLimitStud({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, stack: 200 });
    g.table.seats = { min: 7, max: 7 };
    const res = playHand(
      g.table,
      g.hand,
      Array.from({ length: 7 }, () => alwaysCallAgent),
      1,
    );
    expect(zeroSum(res.finalStacks)).toBe(7 * 200);
  });
});
