import { describe, it, expect, beforeAll } from 'vitest';
import { rankStudHiLoStartingHands } from '../../src/ranking/stud-hilo-ranker.js';
import { DEFAULT_CONFIG } from '../../src/simulation/types.js';
import { handOfSevenEvalHiLow8Indexed } from '../../../src/pokerEvaluator7.js';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';

describe('Stud Hi/Lo Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('ranks all hands by equity when opponents are present', () => {
    const config = { ...DEFAULT_CONFIG, runs: 1, opponents: 1, seed: 42, useCache: false };
    const result = rankStudHiLoStartingHands(handOfSevenEvalHiLow8Indexed, config);

    expect(result.gameType).toBe('stud-hi-lo');
    expect(result.config).toEqual(config);
    expect(result.hands.length).toBe(1755);

    for (let i = 0; i < result.hands.length - 1; i++) {
      const current = result.hands[i]!;
      const next = result.hands[i + 1]!;
      expect(current.equity ?? 0).toBeGreaterThanOrEqual(next.equity ?? 0);
    }

    const bestHand = result.hands[0]!;
    expect(bestHand.highWinPct).toBeDefined();
    expect(bestHand.lowWinPct).toBeDefined();
    expect(bestHand.scoopPct).toBeDefined();
    expect(bestHand.equity).toBeDefined();
  });

  it('ranks all hands by average rank in raw strength mode', () => {
    const config = { ...DEFAULT_CONFIG, runs: 1, opponents: 0, seed: 42, useCache: false };
    const result = rankStudHiLoStartingHands(handOfSevenEvalHiLow8Indexed, config);

    expect(result.gameType).toBe('stud-hi-lo');
    expect(result.hands.length).toBe(1755);

    for (const hand of result.hands) {
      expect(hand.winPct).toBe(0);
    }

    for (let i = 1; i < result.hands.length; i++) {
      expect(result.hands[i - 1]!.averageRank).toBeGreaterThanOrEqual(result.hands[i]!.averageRank);
    }
  });
});
