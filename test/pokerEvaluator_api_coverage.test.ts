import { describe, it, expect } from 'vitest';
import { PokerEvaluator, GameVariant, TexasHoldemGameType } from '../src/PokerEvaluator';

describe('PokerEvaluator extended coverage', () => {
  it('evaluates 5-card low 8 and low 9', () => {
    expect(PokerEvaluator.evaluate5Cards([6,5,4,3,2], GameVariant.LOW_8_OR_BETTER)).toBeGreaterThanOrEqual(0);
    expect(PokerEvaluator.evaluate5Cards([7,5,4,3,2], GameVariant.LOW_9_OR_BETTER)).toBeGreaterThanOrEqual(0);
  });

  it('throws on evaluate7Cards with invalid length', () => {
    expect(() => PokerEvaluator.evaluate7Cards([0,1,2,3,4,5], GameVariant.HIGH)).toThrow('evaluate7Cards requires exactly 7 cards');
  });

  it('evaluate7CardsVerbose supports low8 and low9 and errors for A-5; errors on non-7 length and unsupported variant', () => {
    const low8 = PokerEvaluator.evaluate7CardsVerbose([0,1,2,3,4,23,45], GameVariant.LOW_8_OR_BETTER);
    expect(typeof low8.handRank).toBe('number');

    const low9 = PokerEvaluator.evaluate7CardsVerbose([0,1,2,3,4,23,45], GameVariant.LOW_9_OR_BETTER);
    expect(typeof low9.handRank).toBe('number');

    expect(() => PokerEvaluator.evaluate7CardsVerbose([12,0,1,2,3,23,45], GameVariant.LOW_A_TO_5)).toThrow('Verbose evaluation not implemented for A-5 low');

    // non-7 length verbose
    expect(() => PokerEvaluator.evaluate7CardsVerbose([0,1,2,3,4], GameVariant.HIGH)).toThrow('Verbose evaluation currently only supports 7-card hands');

    // unsupported variant for evaluate and evaluateVerbose
    expect(() => (PokerEvaluator as any).evaluate5Cards([0,1,2,3,4], 'foo')).toThrow();
    expect(() => (PokerEvaluator as any).evaluate7CardsVerbose([0,1,2,3,4,5,6], 'foo')).toThrow('Verbose evaluation not supported');
  }, 60000);
});

describe('TexasHoldemEvaluator via PokerEvaluator', () => {
  it('evaluates texas hold\'em high-only', () => {
    const res = PokerEvaluator.evaluateTexasHoldem([0, 12], [1,2,3,4,5], TexasHoldemGameType.HIGH_ONLY);
    expect(res.low).toBe(-1);
    expect(typeof res.hi).toBe('number');
  });

  it('errors on invalid hole/community cards and duplicates', () => {
    expect(() => PokerEvaluator.evaluateTexasHoldem([0], [1,2,3,4,5], TexasHoldemGameType.HIGH_ONLY)).toThrow('requires exactly 2 hole cards');
    expect(() => PokerEvaluator.evaluateTexasHoldem([0,1], [2,3], TexasHoldemGameType.HIGH_ONLY)).toThrow('requires 3-5 community cards');
    expect(() => PokerEvaluator.evaluateTexasHoldem([0,1], [0,2,3,4,5], TexasHoldemGameType.HIGH_ONLY)).toThrow('Duplicate cards');
  });

  it('currently throws for texas hold\'em high-low 8 and 9 due to low eval signature', () => {
    expect(() => PokerEvaluator.evaluateTexasHoldem([0,12], [1,2,3,4,5], TexasHoldemGameType.HIGH_LOW_8)).toThrow();
    expect(() => PokerEvaluator.evaluateTexasHoldem([0,12], [1,2,3,4,5], TexasHoldemGameType.HIGH_LOW_9)).toThrow();
  });
});
