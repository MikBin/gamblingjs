import { describe, it, expect, beforeAll } from 'vitest';
import { rankRazzStartingHands } from '../../src/ranking/razz-ranker.js';
import { DEFAULT_CONFIG } from '../../src/simulation/types.js';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';

describe('Razz Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.Ato5();
  });

  it('ranks Razz starting hands correctly', () => {
    // Small run count for testing
    const config = { ...DEFAULT_CONFIG, runs: 10, opponents: 1, seed: 123 };

    // We'll pass a dummy callback for progress
    const onProgress = () => {};

    const result = rankRazzStartingHands(config, onProgress);

    expect(result.gameType).toBe('razz');
    expect(result.config).toEqual(config);
    expect(result.hands.length).toBe(455);

    // Check that results are sorted by winPct descending
    for (let i = 0; i < result.hands.length - 1; i++) {
      const current = result.hands[i];
      const next = result.hands[i+1];
      if (current && next) {
        expect(current.winPct).toBeGreaterThanOrEqual(next.winPct);
      }
    }
  });
});
