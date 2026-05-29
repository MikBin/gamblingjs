import { describe, it, expect, vi } from 'vitest';
import { rankStudStartingHands } from '../poker-sym/src/ranking/stud-ranker.js';

describe('Stud Ranker', () => {
  it('should simulate all 1755 hands and sort them', () => {
    let callCount = 0;
    const dummyEvaluator = vi.fn().mockImplementation(() => {
       callCount++;
       return Math.random() * 100;
    });

    const config = { runs: 2, opponents: 0, useCache: false };
    const result = rankStudStartingHands(dummyEvaluator, config);

    expect(result.gameType).toBe('7card-stud');
    expect(result.hands.length).toBe(1755);
    expect(callCount).toBe(3510);

    for (let i = 1; i < result.hands.length; i++) {
      expect(result.hands[i - 1]!.averageRank).toBeGreaterThanOrEqual(result.hands[i]!.averageRank);
    }
  });
});
