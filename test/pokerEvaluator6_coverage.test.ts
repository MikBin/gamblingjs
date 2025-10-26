import { describe, it, expect } from 'vitest';
import {
  handOfSixEval,
  handOfSixEvalIndexed,
  handOfSixEvalLowBall27,
  handOfSixEvalLowBall27Indexed,
  handOfSixEvalAto6,
  handOfSixEvalAto6Indexed,
  handOfSixEvalLow_Ato5,
  handOfSixEvalAto5Indexed,
  handOfSixEvalHiLow8,
  handOfSixEvalHiLow8Indexed,
  handOfSixEvalHiLow9,
  handOfSixEvalHiLow9Indexed,
  _handOfSixEvalIndexed_Verbose,
  _handOfSixEvalLowBall27Indexed_Verbose,
  _handOfSixEvalAto5Indexed_Verbose,
  _handOfSixEvalAto6Indexed_Verbose,
  _handOfSixEvalLow8_Verbose,
  _handOfSixEvalLow9_Verbose,
  _handOfSixEvalIndexed,
} from '../src/pokerEvaluator6';
import { fullCardsDeckHash_7 } from '../src/constants';

// Helper to map indexes to hash cards for 6-card APIs
const H = (...idx: number[]) => idx.map(i => fullCardsDeckHash_7[i]!);

describe('pokerEvaluator6 fast (non-indexed) vs indexed parity', () => {
  it('handOfSixEval matches indexed for non-flush hand', () => {
    const idx = [0, 1, 2, 3, 18, 19];
    const fast = handOfSixEval(...H(...idx));
    const idxRank = handOfSixEvalIndexed(...idx);
    expect(fast).toBe(idxRank);
  });

  it('handOfSixEval matches indexed for 6-card flush', () => {
    const idx = [12, 11, 10, 9, 8, 7]; // all spades
    const fast = handOfSixEval(...H(...idx));
    const idxRank = handOfSixEvalIndexed(...idx);
    expect(fast).toBe(idxRank);
  });

  it('handOfSixEvalLowBall27 parity (non-flush and flush cases)', () => {
    const nonflush = [13, 1, 2, 3, 4, 5];
    expect(handOfSixEvalLowBall27(...H(...nonflush))).toBe(
      handOfSixEvalLowBall27Indexed(...nonflush)
    );

    const flush6 = [12, 11, 10, 9, 8, 7];
    expect(handOfSixEvalLowBall27(...H(...flush6))).toBe(
      handOfSixEvalLowBall27Indexed(...flush6)
    );
  });

  it('handOfSixEvalAto6 parity', () => {
    const idx = [12, 1, 2, 3, 4, 5];
    expect(handOfSixEvalAto6(...H(...idx))).toBe(handOfSixEvalAto6Indexed(...idx));
  });

  it('handOfSixEvalLow_Ato5 parity (via alias Ato5Indexed)', () => {
    const idx = [12, 0, 1, 2, 3, 4];
    expect(handOfSixEvalLow_Ato5(...H(...idx))).toBe(handOfSixEvalAto5Indexed(...idx));
  });

  it('handOfSixEvalHiLow8 parity', () => {
    const idx = [12, 1, 2, 3, 4, 5];
    expect(handOfSixEvalHiLow8(...H(...idx))).toEqual(handOfSixEvalHiLow8Indexed(...idx));
  });

  it('handOfSixEvalHiLow9 parity', () => {
    const idx = [9, 1, 2, 3, 4, 7];
    expect(handOfSixEvalHiLow9(...H(...idx))).toEqual(handOfSixEvalHiLow9Indexed(...idx));
  });
});

describe('pokerEvaluator6 additional branch coverage', () => {
  it('handOfSixEvalAto6 flush branch', () => {
    const idx = [11, 10, 9, 8, 7, 6]; // spades straight flush-like, 6 cards
    expect(handOfSixEvalAto6(...H(...idx))).toBe(handOfSixEvalAto6Indexed(...idx));
  });

  it('handOfSixEvalHiLow8 flush path and low qualified', () => {
    const idx = [0, 1, 2, 3, 4, 5]; // 2..7 spades (flush and qualifies low8)
    const non = handOfSixEvalHiLow8(...H(...idx));
    const idxRes = handOfSixEvalHiLow8Indexed(...idx);
    expect(non).toEqual(idxRes);
    expect(non.low).toBeGreaterThanOrEqual(0);
  });

  it('handOfSixEvalHiLow9 flush path and low qualified', () => {
    const idx = [0, 1, 2, 3, 4, 7]; // 2..5 and 9 spades (flush and qualifies low9)
    const non = handOfSixEvalHiLow9(...H(...idx));
    const idxRes = handOfSixEvalHiLow9Indexed(...idx);
    expect(non).toEqual(idxRes);
    expect(non.low).toBeGreaterThanOrEqual(0);
  });

  it('fast vs brute-force equality for a sample hand (high)', () => {
    const idx = [3, 23, 4, 45, 27, 7];
    const fast = handOfSixEvalIndexed(...idx);
    const slow = _handOfSixEvalIndexed(...idx);
    expect(fast).toBe(slow);
  });
});

describe('pokerEvaluator6 verbose (slow helpers) smoke tests', () => {
  it('returns verbose info for high', () => {
    const info = _handOfSixEvalIndexed_Verbose([4, 6, 11, 5, 0, 19]);
    expect(typeof info.handRank).toBe('number');
    expect(Array.isArray(info.hand)).toBe(true);
    expect(typeof info.flushSuit).toBe('string');
  });

  it('returns verbose info for 2-7', () => {
    const info = _handOfSixEvalLowBall27Indexed_Verbose([0, 1, 2, 3, 4, 23]);
    expect(typeof info.handRank).toBe('number');
  });

  it('returns verbose info for Ato5', () => {
    const info = _handOfSixEvalAto5Indexed_Verbose([12, 0, 1, 2, 3, 4]);
    expect(typeof info.handRank).toBe('number');
  });

  it('returns verbose info for Ato6', () => {
    const info = _handOfSixEvalAto6Indexed_Verbose([11, 24, 10, 23, 36, 37]);
    expect(typeof info.handRank).toBe('number');
  });

  it('returns verbose info for low8', () => {
    const info = _handOfSixEvalLow8_Verbose([0, 1, 2, 3, 4, 23]);
    expect(typeof info.handRank).toBe('number');
  });

  it('returns verbose info for low9', () => {
    const info = _handOfSixEvalLow9_Verbose([0, 1, 2, 3, 5, 23]);
    expect(typeof info.handRank).toBe('number');
  });
});
