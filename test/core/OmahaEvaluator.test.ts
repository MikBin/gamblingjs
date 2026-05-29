import { describe, it, expect } from 'vitest';
import { OmahaEvaluator } from '../../src/core/OmahaEvaluator.js';
import { handOfFiveEvalIndexed } from '../../src/pokerEvaluator5.js';

/** Old brute-force bestOmahaHand logic for regression testing. */
function bestOmahaHandOld(holeCards: number[], board: number[]): number {
  let best = -Infinity;
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (let a = 0; a < 5; a++) {
        for (let b = a + 1; b < 5; b++) {
          for (let c = b + 1; c < 5; c++) {
            const score = handOfFiveEvalIndexed(
              holeCards[i]!,
              holeCards[j]!,
              board[a]!,
              board[b]!,
              board[c]!,
            );
            if (score > best) best = score;
          }
        }
      }
    }
  }
  return best;
}

function generateRandomBoard(size: number): number[] {
  const cards = new Set<number>();
  while (cards.size < size) {
    cards.add(Math.floor(Math.random() * 52));
  }
  return Array.from(cards);
}

describe('OmahaEvaluator', () => {
  it('produces identical results to the old brute-force path on random boards', () => {
    const evaluator = new OmahaEvaluator();
    const holeCards = [0, 13, 25, 38]; // 2s, 2d, 3h, 4c

    evaluator.setHoleCards(holeCards);

    for (let i = 0; i < 100; i++) {
      const board = generateRandomBoard(5);
      const fast = evaluator.evaluate(board);
      const slow = bestOmahaHandOld(holeCards, board);
      expect(fast).toBe(slow);
    }
  });

  it('handles double-suited premium hands correctly', () => {
    const evaluator = new OmahaEvaluator();
    // AAKK double suited
    const holeCards = [12, 25, 11, 24]; // As, Ah, Ks, Kh
    evaluator.setHoleCards(holeCards);

    // A monotone flop
    const board = [0, 1, 2, 3, 4]; // 2s, 3s, 4s, 5s, 6s
    const fast = evaluator.evaluate(board);
    const slow = bestOmahaHandOld(holeCards, board);
    expect(fast).toBe(slow);
  });

  it('evaluateOnce static helper works', () => {
    const holeCards = [0, 13, 25, 38];
    const board = [1, 2, 3, 4, 5];
    const result = OmahaEvaluator.evaluateOnce(holeCards, board);
    expect(typeof result).toBe('number');
    expect(result).toBe(bestOmahaHandOld(holeCards, board));
  });

  it('throws on wrong hole card count', () => {
    const evaluator = new OmahaEvaluator();
    expect(() => evaluator.setHoleCards([0, 1])).toThrow('Omaha requires exactly 4 hole cards');
  });

  it('throws on wrong board size', () => {
    const evaluator = new OmahaEvaluator();
    evaluator.setHoleCards([0, 13, 25, 38]);
    expect(() => evaluator.evaluate([0, 1, 2])).toThrow('Omaha board must contain exactly 5 cards');
  });
});
