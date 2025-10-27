import { describe, it, expect } from 'vitest';
import { PokerEvaluator, GameVariant } from '../src/PokerEvaluator';
import { cardIndexToString } from '../src/utils/CardUtils';

describe('PokerEvaluator', () => {
  describe('static methods', () => {
    it('should evaluate 5-card high hand', () => {
      // Royal flush: A K Q J T suited (spades)
      const royalFlush = [12, 11, 10, 9, 8]; // A♠ K♠ Q♠ J♠ T♠
      const result = PokerEvaluator.evaluate5Cards(royalFlush, GameVariant.HIGH);
      expect(result).toBe(7461); // Royal flush should be highest rank
    });

    it('should evaluate 7-card high hand', () => {
      // Royal flush with extra cards
      const royalFlush7 = [12, 11, 10, 9, 8, 7, 6]; // A♠ K♠ Q♠ J♠ T♠ 9♠ 8♠
      const result = PokerEvaluator.evaluate7Cards(royalFlush7, GameVariant.HIGH);
      expect(result).toBe(7461); // Royal flush should be highest rank
    });

    it('should evaluate 7-card verbose', () => {
      const royalFlush7 = [12, 11, 10, 9, 8, 7, 6];
      const result = PokerEvaluator.evaluate7CardsVerbose(royalFlush7, GameVariant.HIGH);
      expect(result.handRank).toBe(7461);
      expect(result.handGroup).toBe('straight flush');
      expect(result.flushSuit).toBe('spades');
    });
  });

  describe('instance methods', () => {
    const evaluator = new PokerEvaluator();

    it('should evaluate high hand', () => {
      const royalFlush = [12, 11, 10, 9, 8];
      const result = evaluator.evaluate(royalFlush, GameVariant.HIGH);
      expect(result).toBe(7461);
    });

    it('should evaluate A-5 low hand', () => {
      // A-2-3-4-5 wheel (best A-5 low)
      const wheel = [12, 0, 1, 2, 3]; // A♠ 2♠ 3♠ 4♠ 5♠
      const result = evaluator.evaluate(wheel, GameVariant.LOW_A_TO_5);
      expect(result).toBe(6174); // Best A-5 low hand
    });
  });
});

describe('CardUtils', () => {
  describe('cardIndexToString', () => {
    it('should convert card indices to strings', () => {
      expect(cardIndexToString(0)).toBe('2s'); // 2 of spades
      expect(cardIndexToString(12)).toBe('As'); // Ace of spades
      expect(cardIndexToString(25)).toBe('Ad'); // Ace of diamonds (13 + 12)
    });
  });
});
