import { describe, it, expect } from 'vitest';
import { BaseEvaluator } from '../src/core/BaseEvaluator';
import { HighEvaluator } from '../src/core/HighEvaluator';
import { LowAto5Evaluator, Low8Evaluator, Low9Evaluator } from '../src/core/LowEvaluator';
import { fastHashesCreators } from '../src/pokerHashes7';

class TestBase extends BaseEvaluator {
  evaluate(): number { return 0; }
  evaluateVerbose(): any {
    return { handRank: 0, hand: [], faces: '', handGroup: 'unqualified', winningCards: [], flushSuit: 'no flush' };
  }
  // Expose protected methods for testing
  public v(h: any, n: number) { /* @ts-ignore */ return this.validateHand(h, n); }
  public nrm(h: number[]) { /* @ts-ignore */ return this.normalizeHand(h); }
}

describe('BaseEvaluator.validateHand and normalizeHand', () => {
  const tb = new TestBase();

  it('throws on non-array', () => {
    // @ts-ignore
    expect(() => tb.v('not-array', 5)).toThrow('Hand must be an array');
  });

  it('throws on wrong length', () => {
    expect(() => tb.v([0,1,2,3], 5)).toThrow('Hand must contain exactly 5 cards');
  });

  it('throws on invalid card index', () => {
    expect(() => tb.v([0,1,2,3,52], 5)).toThrow('Invalid card index');
  });

  it('throws on duplicate cards', () => {
    expect(() => tb.v([0,1,2,3,3], 5)).toThrow('Hand contains duplicate cards');
  });

  it('returns true on valid hand', () => {
    expect(tb.v([0,1,2,3,4], 5)).toBe(true);
  });

  it('normalizes hand descending', () => {
    expect(tb.nrm([3,1,4,2])).toEqual([4,3,2,1]);
  });
});

describe('HighEvaluator error path', () => {
  const he = new HighEvaluator();
  it('throws for unsupported hand size', () => {
    expect(() => he.evaluate([0,1,2,3,4,5])).toThrow('HighEvaluator only supports 5-card and 7-card hands');
  });
});

describe('LowAto5Evaluator coverage', () => {
  const ev = new LowAto5Evaluator();
  it('evaluates 5-card A-5 low', () => {
    expect(ev.evaluate([12,0,1,2,3])).toBeGreaterThanOrEqual(0);
  });
it('evaluates 7-card A-5 low', () => {
    fastHashesCreators.Ato5();
    expect(ev.evaluate([12,0,1,2,3,23,45])).toBeGreaterThanOrEqual(0);
  });
  it('throws verbose not implemented', () => {
    expect(() => ev.evaluateVerbose([0,1,2,3,4,5,6])).toThrow('Verbose evaluation not implemented for A-5 low');
  });
  it('throws for wrong length', () => {
    // 6 cards
    expect(() => ev.evaluate([0,1,2,3,4,5])).toThrow('LowAto5Evaluator only supports 5-card and 7-card hands');
  });
  it('qualifiesForLow always true and threshold returns 13', () => {
    // @ts-ignore access protected methods
    expect(ev["qualifiesForLow"]([12,0,1,2,3])).toBe(true);
    // @ts-ignore
    expect(ev["getQualificationThreshold"]()).toBe(13);
  });
});

describe('Low8Evaluator coverage', () => {
  const ev = new Low8Evaluator();
  it('evaluates 5-card low8 (returns low rank or -1)', () => {
    const r = ev.evaluate([6,5,4,3,2]);
    expect(typeof r).toBe('number');
  });
  it('evaluates 7-card low8', () => {
    const r = ev.evaluate([7,5,4,3,12,25,38]);
    expect(typeof r).toBe('number');
  });
  it('evaluateVerbose returns info', () => {
    const info = ev.evaluateVerbose([0,1,2,3,4,23,45]);
    expect(typeof info.handRank).toBe('number');
    expect(typeof info.flushSuit).toBe('string');
  });
  it('qualifiesForLow true/false checks', () => {
    // @ts-ignore access protected
    expect(ev["qualifiesForLow"]([0,1,2,3,4])).toBe(true);
    // @ts-ignore
    expect(ev["qualifiesForLow"]([48,1,2,3,4])).toBe(false);
  });
  it('throws for wrong length', () => {
    expect(() => ev.evaluate([0,1,2,3,4,5])).toThrow('Low8Evaluator only supports 5-card and 7-card hands');
  });
  it('qualification threshold is 8', () => {
    // @ts-ignore
    expect(ev["getQualificationThreshold"]()).toBe(8);
  });
});

describe('Low9Evaluator coverage', () => {
  const ev = new Low9Evaluator();
  it('evaluates 5-card low9 (returns low rank or -1)', () => {
    const r = ev.evaluate([7,5,4,3,12]);
    expect(typeof r).toBe('number');
  });
  it('evaluates 7-card low9', () => {
    const r = ev.evaluate([7,5,4,3,12,25,38]);
    expect(typeof r).toBe('number');
  });
  it('evaluateVerbose returns info', () => {
    const info = ev.evaluateVerbose([0,1,2,3,4,23,45]);
    expect(typeof info.handRank).toBe('number');
    expect(typeof info.flushSuit).toBe('string');
  });
  it('qualifiesForLow true/false checks', () => {
    // @ts-ignore access protected
    expect(ev["qualifiesForLow"]([0,1,2,3,4])).toBe(true);
    // @ts-ignore
    expect(ev["qualifiesForLow"]([52-4,1,2,3,4])).toBe(false);
  });
  it('throws for wrong length', () => {
    expect(() => ev.evaluate([0,1,2,3,4,5])).toThrow('Low9Evaluator only supports 5-card and 7-card hands');
  });
  it('qualification threshold is 9', () => {
    // @ts-ignore
    expect(ev["getQualificationThreshold"]()).toBe(9);
  });
});
