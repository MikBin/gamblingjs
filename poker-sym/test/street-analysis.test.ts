import { describe, it, expect } from 'vitest';
import { categoryByRank, analyzeHandStreets } from '../src/simulation/street-analysis.js';
import type { FiveCardEvalFn, SevenCardEvalFn } from '../src/simulation/street-analysis.js';
import { HAND_CATEGORY_NAMES } from '../src/simulation/types.js';
import { cardIndex } from '../src/utils/deck.js';
import type { HandGroup } from '../src/hands/types.js';

describe('categoryByRank', () => {
  it('should map rank 0 to "high card"', () => {
    expect(categoryByRank(0)).toBe('high card');
  });

  it('should map rank 1276 to "high card" (boundary)', () => {
    expect(categoryByRank(1276)).toBe('high card');
  });

  it('should map rank 1277 to "one pair"', () => {
    expect(categoryByRank(1277)).toBe('one pair');
  });

  it('should map rank 4136 to "one pair" (boundary)', () => {
    expect(categoryByRank(4136)).toBe('one pair');
  });

  it('should map rank 4137 to "two pair"', () => {
    expect(categoryByRank(4137)).toBe('two pair');
  });

  it('should map rank 5853 to "straight"', () => {
    expect(categoryByRank(5853)).toBe('straight');
  });

  it('should map rank 5863 to "flush"', () => {
    expect(categoryByRank(5863)).toBe('flush');
  });

  it('should map rank 7140 to "full house"', () => {
    expect(categoryByRank(7140)).toBe('full house');
  });

  it('should map rank 7296 to "four of a kind"', () => {
    expect(categoryByRank(7296)).toBe('four of a kind');
  });

  it('should map rank 7452 to "straight flush"', () => {
    expect(categoryByRank(7452)).toBe('straight flush');
  });

  it('should map rank 7461 to "straight flush"', () => {
    expect(categoryByRank(7461)).toBe('straight flush');
  });

  it('should cover all category names', () => {
    // Each category should be reachable by at least one rank
    const categories = new Set<string>();
    for (let r = 0; r <= 7461; r += 100) {
      categories.add(categoryByRank(r));
    }
    // Also check boundaries
    for (const threshold of [1276, 4136, 4994, 5852, 5862, 7139, 7295, 7451, 7461]) {
      categories.add(categoryByRank(threshold));
    }

    for (const name of HAND_CATEGORY_NAMES) {
      expect(categories.has(name)).toBe(true);
    }
  });
});

describe('analyzeHandStreets', () => {
  // Create a simple mock evaluator for testing the aggregation logic.
  // Returns a deterministic rank based on the sum of card ranks.
  const mockEval5: FiveCardEvalFn = (c1, c2, c3, c4, c5) => {
    // Simple hash: sum of ranks * 100, capped to valid range [0, 7461]
    const sum = (c1 % 13) + (c2 % 13) + (c3 % 13) + (c4 % 13) + (c5 % 13);
    return Math.min(sum * 115, 7461);
  };

  const mockEval7: SevenCardEvalFn = (c1, c2, c3, c4, c5, c6, c7) => {
    const sum = (c1 % 13) + (c2 % 13) + (c3 % 13) + (c4 % 13) + (c5 % 13) + (c6 % 13) + (c7 % 13);
    // Pick best 5 of 7 approximation
    return Math.min(sum * 85, 7461);
  };

  const makeHand = (key: string, cards: number[]): HandGroup => ({ key, cards, description: key });

  it('should return a valid StreetHandResult', () => {
    const hand = makeHand('AKs', [cardIndex(12, 0), cardIndex(11, 0)]);
    const result = analyzeHandStreets(hand, 100, mockEval5, mockEval7, 42);

    expect(result.hand).toBe('AKs');
    expect(result.flop).toBeDefined();
    expect(result.turn).toBeDefined();
    expect(result.river).toBeDefined();
  });

  it('should have correct structure for each street', () => {
    const hand = makeHand('AA', [cardIndex(12, 0), cardIndex(12, 1)]);
    const result = analyzeHandStreets(hand, 100, mockEval5, mockEval7, 42);

    for (const street of [result.flop, result.turn, result.river]) {
      expect(typeof street.averageRank).toBe('number');
      expect(street.averageRank).toBeGreaterThanOrEqual(0);

      // Categories should sum to ~100%
      const catSum = Object.values(street.categories).reduce((s, v) => s + v, 0);
      expect(catSum).toBeCloseTo(100, 0);

      // Distribution should have valid stats
      expect(street.distribution.stdDev).toBeGreaterThanOrEqual(0);
      expect(street.distribution.min).toBeLessThanOrEqual(street.distribution.max);
      expect(street.distribution.percentiles.p25).toBeLessThanOrEqual(street.distribution.percentiles.p50);
      expect(street.distribution.percentiles.p50).toBeLessThanOrEqual(street.distribution.percentiles.p75);

      // Realization metrics should be percentages
      expect(street.realization.improvementRate).toBeGreaterThanOrEqual(0);
      expect(street.realization.improvementRate).toBeLessThanOrEqual(100);
      expect(street.realization.nutPercentage).toBeGreaterThanOrEqual(0);
      expect(street.realization.nutPercentage).toBeLessThanOrEqual(100);
      expect(street.realization.playabilityScore).toBeGreaterThanOrEqual(0);
      expect(street.realization.playabilityScore).toBeLessThanOrEqual(100);
    }
  });

  it('should have zero improvementRate on the flop (no previous street)', () => {
    const hand = makeHand('KK', [cardIndex(11, 0), cardIndex(11, 1)]);
    const result = analyzeHandStreets(hand, 100, mockEval5, mockEval7, 42);
    expect(result.flop.realization.improvementRate).toBe(0);
  });

  it('should have zero drawConversionRate on the river', () => {
    const hand = makeHand('QQ', [cardIndex(10, 0), cardIndex(10, 1)]);
    const result = analyzeHandStreets(hand, 100, mockEval5, mockEval7, 42);
    expect(result.river.realization.drawConversionRate).toBe(0);
  });

  it('should produce deterministic results with same seed', () => {
    const hand = makeHand('AKs', [cardIndex(12, 0), cardIndex(11, 0)]);
    const result1 = analyzeHandStreets(hand, 200, mockEval5, mockEval7, 12345);
    const result2 = analyzeHandStreets(hand, 200, mockEval5, mockEval7, 12345);

    expect(result1.flop.averageRank).toBeCloseTo(result2.flop.averageRank, 10);
    expect(result1.turn.averageRank).toBeCloseTo(result2.turn.averageRank, 10);
    expect(result1.river.averageRank).toBeCloseTo(result2.river.averageRank, 10);
  });

  it('should produce different results with different seeds', () => {
    const hand = makeHand('72o', [cardIndex(5, 0), cardIndex(0, 1)]);
    const result1 = analyzeHandStreets(hand, 200, mockEval5, mockEval7, 11111);
    const result2 = analyzeHandStreets(hand, 200, mockEval5, mockEval7, 99999);

    // Very unlikely to be exactly the same with different seeds
    const same =
      result1.flop.averageRank === result2.flop.averageRank &&
      result1.turn.averageRank === result2.turn.averageRank &&
      result1.river.averageRank === result2.river.averageRank;
    expect(same).toBe(false);
  });

  it('should have texture equity with at least one texture', () => {
    const hand = makeHand('JTs', [cardIndex(9, 0), cardIndex(8, 0)]);
    const result = analyzeHandStreets(hand, 100, mockEval5, mockEval7, 42);

    expect(result.flop.textureEquity.length).toBeGreaterThan(0);
    expect(result.turn.textureEquity.length).toBeGreaterThan(0);

    for (const tex of result.flop.textureEquity) {
      expect(tex.count).toBeGreaterThan(0);
      expect(typeof tex.texture).toBe('string');
      expect(typeof tex.averageRank).toBe('number');
    }
  });
});