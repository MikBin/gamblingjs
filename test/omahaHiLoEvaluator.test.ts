import { describe, it, expect, beforeAll } from 'vitest';
import { OmahaHiLoEvaluator } from '../src/core/OmahaHiLoEvaluator';
import { handOfFiveEvalHiLow8Indexed } from '../src/pokerEvaluator5';
import { fastHashesCreators } from '../src/pokerHashes7';

describe('OmahaHiLoEvaluator', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  describe('setHoleCards', () => {
    it('should throw if not given exactly 4 cards', () => {
      const evaluator = new OmahaHiLoEvaluator();
      expect(() => evaluator.setHoleCards([0, 1, 2])).toThrow(
        'Omaha requires exactly 4 hole cards',
      );
      expect(() => evaluator.setHoleCards([0, 1, 2, 3, 4])).toThrow(
        'Omaha requires exactly 4 hole cards',
      );
    });
  });

  describe('evaluate', () => {
    it('should throw if board does not have exactly 5 cards', () => {
      const evaluator = new OmahaHiLoEvaluator();
      evaluator.setHoleCards([0, 1, 2, 3]);
      expect(() => evaluator.evaluate([0, 1, 2, 3])).toThrow(
        'Omaha board must contain exactly 5 cards',
      );
    });

    it('should match legacy handOfFiveEvalHiLow8Indexed for all 60 combos', () => {
      // A♠ A♥ K♠ K♥  —  hole cards
      const hole = [0, 13, 1, 14]; // As, Ah, Ks, Kh
      // 2♠ 3♠ 4♠ 5♠ 6♠  —  board
      const board = [2, 3, 4, 5, 6];

      // Brute-force with legacy function
      let expectedBestHi = -Infinity;
      let expectedBestLo = -1;
      for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
          for (let k = 0; k < 5; k++) {
            for (let l = k + 1; l < 5; l++) {
              for (let m = l + 1; m < 5; m++) {
                const score = handOfFiveEvalHiLow8Indexed(
                  hole[i]!,
                  hole[j]!,
                  board[k]!,
                  board[l]!,
                  board[m]!,
                );
                if (score.hi > expectedBestHi) expectedBestHi = score.hi;
                if (score.low !== -1) {
                  if (expectedBestLo === -1 || score.low > expectedBestLo) {
                    expectedBestLo = score.low;
                  }
                }
              }
            }
          }
        }
      }

      const evaluator = new OmahaHiLoEvaluator();
      evaluator.setHoleCards(hole);
      const result = evaluator.evaluate(board);

      expect(result.hi).toBe(expectedBestHi);
      expect(result.low).toBe(expectedBestLo);
    });

    it('should return low=-1 when no qualifying low exists', () => {
      // K♠ K♥ A♠ A♥  —  premium high hand, limited low
      const hole = [0, 13, 1, 14];
      // K♣ K♦ Q♠ J♥ T♠  —  high board, no low possible
      const board = [26, 39, 10, 22, 8];

      const evaluator = new OmahaHiLoEvaluator();
      evaluator.setHoleCards(hole);
      const result = evaluator.evaluate(board);

      expect(result.hi).toBeGreaterThan(0);
      // All 5-card combos use at least K or Q or J or T — no 8-or-better low
      expect(result.low).toBe(-1);
    });

    it('should produce consistent results across multiple evaluate calls with same hole cards', () => {
      const hole = [0, 14, 28, 42]; // One card per suit ace
      const evaluator = new OmahaHiLoEvaluator();
      evaluator.setHoleCards(hole);

      const board1 = [3, 4, 5, 6, 7];
      const board2 = [10, 20, 30, 40, 50];

      const result1 = evaluator.evaluate(board1);
      const result2 = evaluator.evaluate(board2);

      // Both should return valid results
      expect(result1.hi).toBeGreaterThan(0);
      expect(result2.hi).toBeGreaterThan(0);

      // Verify re-evaluating same board gives same result
      const result1again = evaluator.evaluate(board1);
      expect(result1again.hi).toBe(result1.hi);
      expect(result1again.low).toBe(result1.low);
    });
  });

  describe('evaluateOnce (static)', () => {
    it('should produce same result as instance-based evaluation', () => {
      const hole = [0, 1, 2, 3];
      const board = [10, 20, 30, 40, 50];

      const evaluator = new OmahaHiLoEvaluator();
      evaluator.setHoleCards(hole);
      const instanceResult = evaluator.evaluate(board);

      const staticResult = OmahaHiLoEvaluator.evaluateOnce(hole, board);

      expect(staticResult.hi).toBe(instanceResult.hi);
      expect(staticResult.low).toBe(instanceResult.low);
    });
  });

  describe('correctness vs legacy', () => {
    it('should match legacy across many random hands', () => {
      // Generate deterministic "random" hands
      const testCases: { hole: number[]; board: number[] }[] = [
        { hole: [0, 14, 28, 42], board: [3, 16, 31, 44, 8] },
        { hole: [4, 18, 32, 46], board: [0, 13, 26, 39, 7] },
        { hole: [8, 22, 36, 50], board: [1, 14, 27, 40, 9] },
        { hole: [12, 25, 38, 51], board: [2, 15, 28, 41, 6] },
        { hole: [1, 2, 3, 4], board: [5, 6, 7, 8, 9] },
      ];

      const evaluator = new OmahaHiLoEvaluator();

      for (const { hole, board } of testCases) {
        // Legacy brute-force
        let expectedHi = -Infinity;
        let expectedLo = -1;
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j < 4; j++) {
            for (let k = 0; k < 5; k++) {
              for (let l = k + 1; l < 5; l++) {
                for (let m = l + 1; m < 5; m++) {
                  const score = handOfFiveEvalHiLow8Indexed(
                    hole[i]!,
                    hole[j]!,
                    board[k]!,
                    board[l]!,
                    board[m]!,
                  );
                  if (score.hi > expectedHi) expectedHi = score.hi;
                  if (score.low !== -1) {
                    if (expectedLo === -1 || score.low > expectedLo) {
                      expectedLo = score.low;
                    }
                  }
                }
              }
            }
          }
        }

        evaluator.setHoleCards(hole);
        const result = evaluator.evaluate(board);

        expect(result.hi).toBe(expectedHi);
        expect(result.low).toBe(expectedLo);
      }
    });
  });
});
