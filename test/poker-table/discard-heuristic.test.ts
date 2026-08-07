import { describe, it, expect } from 'vitest';
import { chooseDiscard, discardAction } from '../../src/poker-table';
import type { Observation } from '../../src/poker-table';

// rank = c % 13 (0='2' ... 12='A'), suit = floor(c / 13).
// Helper to build a fake observation for discardAction.
function obsFor(evaluator: Observation['evaluator'], hole: number[], max = 5): Observation {
  return {
    streetIndex: 1,
    streetName: 'draw',
    evaluator,
    community: [],
    up: [],
    players: [],
    actionLog: [],
    pot: 0,
    seat: 0,
    actingSeat: 0,
    buttonSeat: 0,
    myHole: hole,
    toCall: 0,
    legalActions: [{ type: 'discard', seat: 0, streetIndex: 1, max }],
    isTerminal: false,
  } as unknown as Observation;
}

describe('discard heuristic — high (5-card draw)', () => {
  it('keeps a pair and redraws the three unpaired cards', () => {
    // 2,3,4,5,2 -> pair of deuces at indices 0 and 4.
    expect(chooseDiscard('high', [0, 1, 2, 3, 13], 5)).toEqual([1, 2, 3]);
  });

  it('keeps two pair and redraws the kicker', () => {
    // 2,2,3,3,4
    expect(chooseDiscard('high', [0, 13, 1, 14, 2], 5)).toEqual([4]);
  });

  it('keeps trips and redraws two', () => {
    // 2,2,2,3,4
    expect(chooseDiscard('high', [0, 13, 26, 1, 2], 5)).toEqual([3, 4]);
  });

  it('stands pat on a made straight', () => {
    // 2,3,4,5,6
    expect(chooseDiscard('high', [0, 1, 2, 3, 4], 5)).toEqual([]);
  });

  it('stands pat on a made flush', () => {
    // 2,3,4,5,7 all suit 0
    expect(chooseDiscard('high', [0, 1, 2, 3, 5], 5)).toEqual([]);
  });

  it('with no pair/straight/flush, keeps the three highest and redraws two', () => {
    // 2,3,4,5,8 rainbow -> keep 8,5,4 (indices 4,3,2), discard 2,3 (0,1)
    expect(chooseDiscard('high', [0, 14, 28, 42, 6], 5)).toEqual([0, 1]);
  });
});

describe('discard heuristic — 2-7 lowball', () => {
  it('discards high cards and keeps the lows', () => {
    // 2,3,4,5,K -> drop the King (index 4)
    expect(chooseDiscard('2-7-low', [0, 1, 2, 3, 11], 5)).toEqual([4]);
  });

  it('stands pat on a clean low (no straight/flush)', () => {
    // 2,3,4,5,7 rainbow (not a straight: gap at 6)
    expect(chooseDiscard('2-7-low', [0, 14, 28, 42, 5], 5)).toEqual([]);
  });

  it('breaks a pair (keeps one card of the paired rank)', () => {
    // 2,2,3,4,5 -> drop the duplicate deuce (index 1)
    expect(chooseDiscard('2-7-low', [0, 13, 1, 2, 3], 5)).toEqual([1]);
  });

  it('breaks a made straight by dropping its highest card', () => {
    // 2,3,4,5,6 straight -> drop the 6 (index 4)
    expect(chooseDiscard('2-7-low', [0, 1, 2, 3, 4], 5)).toEqual([4]);
  });

  it('breaks a made flush by dropping its highest card', () => {
    // 2,3,4,5,7 all suit 0 (flush) -> drop the 7 (index 4)
    expect(chooseDiscard('2-7-low', [0, 1, 2, 3, 5], 5)).toEqual([4]);
  });
});

describe('discard heuristic — A-5 lowball (ace is low/good)', () => {
  it('keeps the ace and lows, discards the high card', () => {
    // A,2,3,4,T -> keep A,2,3,4 (indices 0,1,2,3), drop the Ten (index 4)
    expect(chooseDiscard('A5-low', [12, 0, 1, 2, 9], 5)).toEqual([4]);
  });
});

describe('discard heuristic — misc', () => {
  it('caps discards at max', () => {
    // pair of deuces would discard [1,2,3], but max=1 -> [1]
    expect(chooseDiscard('high', [0, 1, 2, 3, 13], 1)).toEqual([1]);
  });

  it('returns no discard when the hand is empty', () => {
    expect(chooseDiscard('high', [], 5)).toEqual([]);
  });

  it('discardAction returns null when there is no discard action', () => {
    const o = {
      legalActions: [{ type: 'check', seat: 0, streetIndex: 0 }],
      evaluator: 'high',
      myHole: [0, 1, 2, 3, 4],
      seat: 0,
      streetIndex: 0,
    } as unknown as Observation;
    expect(discardAction(o)).toBeNull();
  });

  it('discardAction fills indices from the heuristic', () => {
    const a = discardAction(obsFor('high', [0, 1, 2, 3, 13], 5))!;
    expect(a.type).toBe('discard');
    expect(a.discardIndices).toEqual([1, 2, 3]);
  });
});
