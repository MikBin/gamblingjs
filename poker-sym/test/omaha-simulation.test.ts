import { describe, it, expect } from 'vitest';
import { simulateOmahaHand } from '../src/simulation/omaha-montecarlo.js';
import { HandGroup } from '../src/hands/types.js';
import { cardIndex } from '../src/utils/deck.js';

// Mock eval5 for unit testing without the full evaluator
// Use a realistic evaluator logic based purely on rank:
import { cardRank } from '../src/utils/deck.js';
const mockEval5 = (c1: number, c2: number, c3: number, c4: number, c5: number) => {
  return cardRank(c1) + cardRank(c2) + cardRank(c3) + cardRank(c4) + cardRank(c5);
};

describe('simulateOmahaHand', () => {
  it('returns a HandStrengthResult with correct fields', () => {
    const hand: HandGroup = {
      key: 'AAKQ:ds',
      cards: [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(10,1)],
      description: 'Pair of Aces with KQ double-suited',
    };

    const result = simulateOmahaHand(
      hand,
      { runs: 100, opponents: 1, seed: 42, useCache: false },
      { eval5: mockEval5 },
    );

    expect(result).toHaveProperty('key', 'AAKQ:ds');
    expect(result.averageRank).toBeGreaterThan(0);
    expect(result.runs).toBe(100);
    expect(result.winPct).toBeGreaterThanOrEqual(0);
    expect(result.winPct).toBeLessThanOrEqual(100);
  });

  it('AAxx double-suited wins more than 22xx rainbow against 1 opponent (mock test)', () => {
    const strongHand: HandGroup = {
      key: 'AAKK:ds',
      cards: [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(11,1)],
      description: 'Double-suited AAKK',
    };
    const weakHand: HandGroup = {
      key: '2234:rb',
      cards: [cardIndex(0,0), cardIndex(0,1), cardIndex(1,2), cardIndex(2,3)],
      description: 'Rainbow 2234',
    };

    const config = { runs: 100, opponents: 1, seed: 12345, useCache: false };
    const eval5 = { eval5: mockEval5 };

    const strongResult = simulateOmahaHand(strongHand, config, eval5);
    const weakResult = simulateOmahaHand(weakHand, config, eval5);

    expect(strongResult.winPct).toBeGreaterThan(weakResult.winPct);
  });
});
