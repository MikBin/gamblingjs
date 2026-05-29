import { describe, it, expect, beforeAll } from 'vitest';
import { rankOmahaHiLoStartingHands } from '../src/ranking/omaha-hilo-ranker.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';

describe('Omaha Hi/Lo Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('runs a small simulation across all hands without crashing', () => {
    const result = rankOmahaHiLoStartingHands({ runs: 1, opponents: 1, useCache: false, seed: 42 });

    expect(result.gameType).toBe('omaha-hi-lo');
    expect(result.hands.length).toBe(9854);

    expect(result.hands[0]!.winPct).toBeGreaterThanOrEqual(result.hands[result.hands.length - 1]!.winPct);

    const bestHand = result.hands[0]!;
    expect(bestHand.winHiPct).toBeDefined();
    expect(bestHand.winLoPct).toBeDefined();
    expect(bestHand.scoopPct).toBeDefined();
  });
});
