import { describe, it, expect } from 'vitest';
import { rankOmahaStartingHands } from '../src/ranking/omaha-ranker.js';

import { cardRank } from '../src/utils/deck.js';
const mockEval5 = (c1: number, c2: number, c3: number, c4: number, c5: number) => {
  return cardRank(c1) + cardRank(c2) + cardRank(c3) + cardRank(c4) + cardRank(c5);
};

describe('rankOmahaStartingHands', () => {
  it('returns a SimulationResult with gameType omaha-hi', () => {
    // Only run on a very small subset so test is fast
    // Let's use a config with small runs and no opponents
    const result = rankOmahaStartingHands(
      { eval5: mockEval5 },
      { runs: 5, opponents: 0, seed: 42, useCache: false },
    );

    expect(result.gameType).toBe('omaha-hi');
    expect(result.hands.length).toBeGreaterThan(0);
    expect(result.timestamp).toBeTruthy();
  });

  it('sorts hands by winPct descending', () => {
    const result = rankOmahaStartingHands(
      { eval5: mockEval5 },
      { runs: 5, opponents: 1, seed: 42, useCache: false },
    );

    for (let i = 1; i < result.hands.length; i++) {
      expect(result.hands[i-1]!.winPct).toBeGreaterThanOrEqual(result.hands[i]!.winPct);
    }
  });
});
