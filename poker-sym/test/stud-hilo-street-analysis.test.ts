import { describe, it, expect, beforeAll } from 'vitest';
import { analyzeStudHiLoHandStreets } from '../src/simulation/stud-hilo-street-analysis.js';
import { cardIndex } from '../src/utils/deck.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';

describe('Stud Hi/Lo Street Analysis', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('analyzes a single hand across 5th/6th/7th streets', () => {
    const hand = {
      key: 'AAA',
      cards: [cardIndex(12, 0), cardIndex(12, 1), cardIndex(12, 2)],
      description: 'Rolled up As',
    };

    const result = analyzeStudHiLoHandStreets(hand, 10, 1, 42);

    expect(result.hand).toBe('AAA');
    expect(result.fifth.equity).toBeGreaterThanOrEqual(0);
    expect(result.sixth.highWinPct).toBeGreaterThanOrEqual(0);
    expect(result.seventh.scoopPct).toBeGreaterThanOrEqual(0);
    expect(result.seventh.lowQualifyPct).toBeGreaterThanOrEqual(0);
  });
});
