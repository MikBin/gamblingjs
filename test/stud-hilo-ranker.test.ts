import { describe, it, expect, vi } from 'vitest';
import { rankStudHiLoStartingHands } from '../poker-sym/src/ranking/stud-hilo-ranker.js';

describe('Stud Hi/Lo Ranker', () => {
  it('should simulate all 1755 hands and sort them', () => {
    let callCount = 0;
    const dummyEvaluator = vi.fn().mockImplementation(() => {
      callCount++;
      return { hi: Math.random() * 100, low: Math.random() * 100 };
    });

    const config = { runs: 2, opponents: 0, useCache: false };
    let progressCalls = 0;
    const onProgress = () => {
      progressCalls++;
    };

    const result = rankStudHiLoStartingHands(dummyEvaluator, config, onProgress);

    expect(result.gameType).toBe('stud-hi-lo');
    expect(result.hands.length).toBe(1755);
    expect(callCount).toBe(3510);
    expect(progressCalls).toBe(1755);

    for (let i = 1; i < result.hands.length; i++) {
      expect(result.hands[i - 1]!.averageRank).toBeGreaterThanOrEqual(result.hands[i]!.averageRank);
    }
  });
});
