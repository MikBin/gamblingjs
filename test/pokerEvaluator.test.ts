import { describe, it, expect } from 'vitest';
import { PokerEvaluator, GameVariant, TexasHoldemGameType } from '../src/PokerEvaluator';
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

    it('evaluateVerbose supports low8 and low9 and errors for A-5; errors on non-7 length and unsupported variant', () => {
      const low8 = evaluator.evaluateVerbose([0, 1, 2, 3, 4, 23, 45], GameVariant.LOW_8_OR_BETTER);
      expect(typeof low8.handRank).toBe('number');

      const low9 = evaluator.evaluateVerbose([0, 1, 2, 3, 4, 23, 45], GameVariant.LOW_9_OR_BETTER);
      expect(typeof low9.handRank).toBe('number');

      expect(() =>
        evaluator.evaluateVerbose([12, 0, 1, 2, 3, 23, 45], GameVariant.LOW_A_TO_5),
      ).toThrow('Verbose evaluation not implemented for A-5 low');

      // non-7 length verbose
      expect(() => evaluator.evaluateVerbose([0, 1, 2, 3, 4], GameVariant.HIGH)).toThrow(
        'Verbose evaluation currently only supports 7-card hands',
      );

      // unsupported variant for evaluate and evaluateVerbose
      expect(() => (evaluator as any).evaluate([0, 1, 2, 3, 4], 'foo')).toThrow();
      expect(() => (evaluator as any).evaluateVerbose([0, 1, 2, 3, 4, 5, 6], 'foo')).toThrow(
        'Verbose evaluation not supported',
      );
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
describe('TexasHoldemEvaluator via PokerEvaluator', () => {
  it("evaluates texas hold'em high-only", () => {
    const res = PokerEvaluator.evaluateTexasHoldem(
      [0, 12],
      [1, 2, 3, 4, 5],
      TexasHoldemGameType.HIGH_ONLY,
    );
    expect(res.low).toBe(-1);
    expect(typeof res.hi).toBe('number');
  });

  it('errors on invalid hole/community cards and duplicates', () => {
    expect(() =>
      PokerEvaluator.evaluateTexasHoldem([0], [1, 2, 3, 4, 5], TexasHoldemGameType.HIGH_ONLY),
    ).toThrow('requires exactly 2 hole cards');
    expect(() =>
      PokerEvaluator.evaluateTexasHoldem([0, 1], [2, 3], TexasHoldemGameType.HIGH_ONLY),
    ).toThrow('requires 3-5 community cards');
    expect(() =>
      PokerEvaluator.evaluateTexasHoldem([0, 1], [0, 2, 3, 4, 5], TexasHoldemGameType.HIGH_ONLY),
    ).toThrow('Duplicate cards');
  });

  it("currently throws for texas hold'em high-low 8 and 9 due to low eval signature", () => {
    expect(() =>
      PokerEvaluator.evaluateTexasHoldem([0, 12], [1, 2, 3, 4, 5], TexasHoldemGameType.HIGH_LOW_8),
    ).toThrow();
    expect(() =>
      PokerEvaluator.evaluateTexasHoldem([0, 12], [1, 2, 3, 4, 5], TexasHoldemGameType.HIGH_LOW_9),
    ).toThrow();
  });
});

describe('PokerEvaluator extended coverage', () => {
  it('evaluates 5-card low 8 and low 9', () => {
    expect(
      PokerEvaluator.evaluate5Cards([6, 5, 4, 3, 2], GameVariant.LOW_8_OR_BETTER),
    ).toBeGreaterThanOrEqual(0);
    expect(
      PokerEvaluator.evaluate5Cards([7, 5, 4, 3, 2], GameVariant.LOW_9_OR_BETTER),
    ).toBeGreaterThanOrEqual(0);
  });

  it('throws on evaluate7Cards with invalid length', () => {
    expect(() => PokerEvaluator.evaluate7Cards([0, 1, 2, 3, 4, 5], GameVariant.HIGH)).toThrow(
      'evaluate7Cards requires exactly 7 cards',
    );
  });
});
