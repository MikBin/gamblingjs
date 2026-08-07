import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  advanceToNextDecision,
  alwaysCallAgent,
  applyAction,
  computeLegalActions,
  createAggressiveAgent,
  createManiacAgent,
  createRandomAgent,
  createRng,
  initHand,
  playHand,
  replayHand,
  resolveHiLo,
  studHiLo,
} from '../../src/poker-table';
import type { PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

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
  const g = studHiLo({ ante: 1, bringIn: 1, stack });
  g.table.seats = { min: 6, max: 6 };
  return g;
};

describe('NL Stud Hi/Lo — bring-in & antes', () => {
  it('posts the bring-in from the lowest upcard seat, counted toward the bet', () => {
    const g = stud6();
    const s = initHand(g.table, g.hand, createRng(3));
    let lo = -1;
    let loKey = Infinity;
    for (const seat of s.seats) {
      if (seat.up.length && cardKey(seat.up[0]!) < loKey) {
        loKey = cardKey(seat.up[0]!);
        lo = seat.index;
      }
    }
    expect(s.actingSeat).toBe(lo);
    expect(s.seats[lo]!.wageredThisStreet).toBe(1);
    expect(s.seats.every((x) => x.wageredTotal >= 1)).toBe(true);
    const st = advanceToNextDecision(
      applyAction(s, { type: 'check', seat: lo, streetIndex: 0 }, g.hand),
    );
    expect(computeLegalActions(st, g.hand).find((a) => a.type === 'call')?.amount).toBe(1);
  });
});

describe('NL Stud Hi/Lo — hi-lo split (8-qualify)', () => {
  it('high and low halves match an independent resolveHiLo computation', () => {
    const g = stud6();
    const sel = g.hand.evaluation.composition;
    for (let seed = 1; seed <= 12; seed++) {
      const res = playHand(
        g.table,
        g.hand,
        Array.from({ length: 6 }, () => alwaysCallAgent),
        seed,
      );
      const evals = res.dealt.hole.map((down, seat) =>
        resolveHiLo({ hole: down, door: res.dealt.up[seat] ?? [], community: [] }, sel, 8),
      );
      const alive = res.dealt.hole.map((_, seat) => seat); // always-call -> all reach showdown
      const bestHi = Math.max(...alive.map((s) => evals[s]!.high));
      const highWinners = alive.filter((s) => evals[s]!.high === bestHi).sort((a, b) => a - b);
      const quals = alive.filter((s) => evals[s]!.low !== -1);
      let lowWinners: number[] = [];
      if (quals.length > 0) {
        const bestLo = Math.min(...quals.map((s) => evals[s]!.low));
        lowWinners = quals.filter((s) => evals[s]!.low === bestLo).sort((a, b) => a - b);
      }
      const engHigh = res.winners
        .filter((w) => w.half === 'high')
        .map((w) => w.seat)
        .sort((a, b) => a - b);
      const engLow = res.winners
        .filter((w) => w.half === 'low')
        .map((w) => w.seat)
        .sort((a, b) => a - b);
      expect(engHigh).toEqual(highWinners);
      expect(engLow).toEqual(lowWinners);
      expect(zeroSum(res.finalStacks)).toBe(6 * 200);
    }
  });
});

describe('NL Stud Hi/Lo — stress fuzz (split & side pots, zero-sum)', () => {
  const stacks = [200, 150, 100, 60, 30, 200];

  it('80 hands: all zero-sum, exercising splits, scoops, multi-tier side pots', () => {
    const g = stud6();
    const start = stacks.reduce((a, b) => a + b, 0);
    let splits = 0;
    let scoops = 0;
    let sidePotHands = 0;
    let splitAcrossSidePot = 0;
    for (let seed = 1; seed <= 80; seed++) {
      const agents = Array.from({ length: 6 }, (_, i) => mix(i, seed));
      const res = playHand(g.table, g.hand, agents, seed, stacks);
      expect(zeroSum(res.finalStacks)).toBe(start);
      const hasLow = res.winners.some((w) => w.half === 'low');
      if (hasLow) splits++;
      else scoops++;
      if (res.pots.length > 1) sidePotHands++;
      if (hasLow && res.pots.length > 1) splitAcrossSidePot++;
    }
    // eslint-disable-next-line no-console
    console.log(
      `NL Stud Hi/Lo 6-max x80: splits=${splits} scoops=${scoops} sidePotHands=${sidePotHands} split+sidePot=${splitAcrossSidePot} maxTiers=${0}`,
    );
    expect(sidePotHands).toBeGreaterThan(0);
    expect(splitAcrossSidePot).toBeGreaterThan(0);
  });
});

describe('NL Stud Hi/Lo — determinism & deck edge', () => {
  it('reproduces byte-identically from (seed, transcript)', () => {
    const g = stud6();
    const agents = Array.from({ length: 6 }, (_, i) => mix(i, 5));
    const orig = playHand(g.table, g.hand, agents, 5);
    const replayed = replayHand(g.table, g.hand, 5, orig.actions);
    expect(replayed.actions).toEqual(orig.actions);
    expect(replayed.finalStacks).toEqual(orig.finalStacks);
    expect(replayed.winners).toEqual(orig.winners);
  });

  it('8-handed throws deck-exhausted; 7-handed completes zero-sum', () => {
    const g8 = studHiLo({ ante: 1, bringIn: 1, stack: 200 });
    g8.table.seats = { min: 8, max: 8 };
    expect(() =>
      playHand(
        g8.table,
        g8.hand,
        Array.from({ length: 8 }, () => alwaysCallAgent),
        1,
      ),
    ).toThrow('deck exhausted');
    const g7 = studHiLo({ ante: 1, bringIn: 1, stack: 200 });
    g7.table.seats = { min: 7, max: 7 };
    const res = playHand(
      g7.table,
      g7.hand,
      Array.from({ length: 7 }, () => alwaysCallAgent),
      1,
    );
    expect(zeroSum(res.finalStacks)).toBe(7 * 200);
  });
});
