import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { LowAto5Evaluator } from '../../src/core/LowEvaluator';
import {
  advanceToNextDecision,
  alwaysCallAgent,
  applyAction,
  computeLegalActions,
  createAggressiveAgent,
  createManiacAgent,
  createRandomAgent,
  createRng,
  fixedLimitRazz,
  flBetUnit,
  initHand,
  playHand,
  replayHand,
} from '../../src/poker-table';
import type { PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
});

const a5 = new LowAto5Evaluator();
const zeroSum = (s: number[]): number => s.reduce((a, b) => a + b, 0);
// ace-low ordering: ace ranks below deuce (Razz bring-in)
const cardKeyAceLow = (c: number): number => {
  const r = c % 13;
  return (r === 12 ? 0 : r + 1) * 4 + Math.floor(c / 13);
};

function mix(seat: number, seed: number): PlayerAgent {
  const s = seed * 131 + seat;
  return [
    createRandomAgent(s),
    createAggressiveAgent(s),
    createManiacAgent(s),
    createRandomAgent(s),
  ][seat % 4]!;
}

const razz6 = (stack = 200) => {
  const g = fixedLimitRazz({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, maxRaises: 4, stack });
  g.table.seats = { min: 6, max: 6 };
  return g;
};

describe('FL Razz — fixed-limit bet sizing', () => {
  const betting = { type: 'fixed-limit' as const, smallBet: 2, bigBet: 4, bigBetFromStreet: 2 };
  it('small on third/fourth, big from fifth street onward', () => {
    expect(flBetUnit(betting, 0, 5, 1)).toBe(2);
    expect(flBetUnit(betting, 1, 5, 1)).toBe(2);
    expect(flBetUnit(betting, 2, 5, 1)).toBe(4);
    expect(flBetUnit(betting, 4, 5, 1)).toBe(4);
  });
});

describe('FL Razz — bring-in (lowest upcard, ACE LOW)', () => {
  it('posts the bring-in from the ace-low lowest upcard across many deals', () => {
    const g = razz6();
    let aceBringIns = 0;
    for (let seed = 1; seed <= 25; seed++) {
      const s = initHand(g.table, g.hand, createRng(seed));
      let lo = -1;
      let loKey = Infinity;
      for (const seat of s.seats) {
        if (seat.up.length && cardKeyAceLow(seat.up[0]!) < loKey) {
          loKey = cardKeyAceLow(seat.up[0]!);
          lo = seat.index;
        }
      }
      expect(s.actingSeat).toBe(lo);
      expect(s.seats[lo]!.wageredThisStreet).toBe(1);
      expect(s.seats.every((x) => x.wageredTotal >= 1)).toBe(true);
      if (s.seats[lo]!.up[0]! % 13 === 12) aceBringIns++; // an ace brought in (ace-low ordering)
    }
    // eslint-disable-next-line no-console
    console.log(
      `FL Razz bring-in: ${aceBringIns}/25 deals had an ACE upcard bringing in (ace-low exercised)`,
    );
  });

  it('bring-in is counted toward the bet (next seat to-calls = bringIn)', () => {
    const g = razz6();
    const s = initHand(g.table, g.hand, createRng(3));
    const lo = s.actingSeat;
    const st = advanceToNextDecision(
      applyAction(s, { type: 'check', seat: lo, streetIndex: 0 }, g.hand),
    );
    expect(computeLegalActions(st, g.hand).find((a) => a.type === 'call')?.amount).toBe(1);
  });
});

describe('FL Razz — winner is the LOWEST A-5 hand', () => {
  it('matches LowAto5Evaluator over each seat own 7 (higher value = better low)', () => {
    const g = razz6();
    const res = playHand(
      g.table,
      g.hand,
      Array.from({ length: 6 }, () => alwaysCallAgent),
      11,
    );
    const ranks = res.dealt.hole.map((down, seat) =>
      a5.evaluate([...down, ...res.dealt.up[seat]!]),
    );
    const best = Math.max(...ranks); // A-5: higher value = better (lower) low
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((x) => x >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
    expect(zeroSum(res.finalStacks)).toBe(6 * 200);
  });
});

describe('FL Razz — convergence & zero-sum (raise cap)', () => {
  it('maniac lineup converges (cap prevents raise loops)', () => {
    const g = razz6(1000);
    for (let seed = 1; seed <= 12; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => createManiacAgent(seed * 97 + i));
      expect(() => playHand(g.table, g.hand, agents, seed)).not.toThrow();
    }
  });

  it('mixed lineup stays zero-sum across many hands (even stacks)', () => {
    const g = razz6();
    for (let seed = 1; seed <= 30; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => mix(i, seed));
      expect(zeroSum(playHand(g.table, g.hand, agents, seed).finalStacks)).toBe(6 * 200);
    }
  });

  it('uneven stacks stay zero-sum across side pots', () => {
    const g = razz6();
    const stacks = [200, 150, 100, 60, 30, 200];
    for (let seed = 1; seed <= 25; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => mix(i, seed));
      expect(zeroSum(playHand(g.table, g.hand, agents, seed, stacks).finalStacks)).toBe(
        stacks.reduce((a, b) => a + b, 0),
      );
    }
  });

  it('fold-down resolves zero-sum', () => {
    const g = razz6();
    const folders = Array.from({ length: 6 }, () => ({
      decide: (obs: { legalActions: { type: string }[] }) =>
        obs.legalActions.find((a) => a.type === 'fold') ?? obs.legalActions[0]!,
    })) as PlayerAgent[];
    for (let seed = 1; seed <= 15; seed++) {
      expect(zeroSum(playHand(g.table, g.hand, folders, seed).finalStacks)).toBe(6 * 200);
    }
  });
});

describe('FL Razz — determinism & deck edge', () => {
  it('reproduces byte-identically from (seed, transcript)', () => {
    const g = razz6();
    const agents = Array.from({ length: 6 }, (_, i) => mix(i, 5));
    const orig = playHand(g.table, g.hand, agents, 5);
    const replayed = replayHand(g.table, g.hand, 5, orig.actions);
    expect(replayed.actions).toEqual(orig.actions);
    expect(replayed.finalStacks).toEqual(orig.finalStacks);
    expect(replayed.winners).toEqual(orig.winners);
  });

  it('8-handed throws deck-exhausted; 7-handed completes zero-sum', () => {
    const g8 = fixedLimitRazz({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, stack: 200 });
    g8.table.seats = { min: 8, max: 8 };
    expect(() =>
      playHand(
        g8.table,
        g8.hand,
        Array.from({ length: 8 }, () => alwaysCallAgent),
        1,
      ),
    ).toThrow('deck exhausted');
    const g7 = fixedLimitRazz({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, stack: 200 });
    g7.table.seats = { min: 7, max: 7 };
    expect(
      zeroSum(
        playHand(
          g7.table,
          g7.hand,
          Array.from({ length: 7 }, () => alwaysCallAgent),
          1,
        ).finalStacks,
      ),
    ).toBe(7 * 200);
  });
});
