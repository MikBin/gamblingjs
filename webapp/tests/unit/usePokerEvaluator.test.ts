import { describe, it, expect, beforeEach } from 'vitest';
import { usePokerEvaluator } from '../../src/composables/usePokerEvaluator';

describe('usePokerEvaluator', () => {
  let evaluator: ReturnType<typeof usePokerEvaluator>;

  beforeEach(() => {
    evaluator = usePokerEvaluator();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(evaluator.isEvaluating.value).toBe(false);
      expect(evaluator.lastEvaluation.value).toBe(null);
      expect(evaluator.error.value).toBe(null);
    });
  });

  describe('evaluateHand', () => {
    it('should reject invalid hand size', async () => {
      const result = await evaluator.evaluateHand([0, 1, 2, 3]); // 4 cards
      expect(result).toBe(null);
      expect(evaluator.error.value).toBe('Invalid hand size: 4 cards. Must be 5-7 cards.');
    });

    it('should evaluate a valid 5-card hand', async () => {
      const result = await evaluator.evaluateHand([0, 1, 2, 3, 4]);
      expect(result).not.toBe(null);
      expect(typeof result?.handRank).toBe('number');
      expect(evaluator.error.value).toBe(null);
    });

    it('should evaluate a valid 7-card hand', async () => {
      const result = await evaluator.evaluateHand([0, 1, 2, 3, 4, 5, 6]);
      expect(result).not.toBe(null);
      expect(typeof result?.handRank).toBe('number');
      expect(evaluator.error.value).toBe(null);
    });
  });

  describe('clearEvaluation', () => {
    it('should clear evaluation results', async () => {
      await evaluator.evaluateHand([0, 1, 2, 3, 4]);
      expect(evaluator.lastEvaluation.value).not.toBe(null);

      evaluator.clearEvaluation();
      expect(evaluator.lastEvaluation.value).toBe(null);
      expect(evaluator.error.value).toBe(null);
    });
  });
});
