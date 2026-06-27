import { describe, it, expect, beforeAll } from 'vitest';
import { rankOmahaStreets } from '../../src/ranking/omaha-street-ranker.js';
import { rankOmahaHiLoStreets } from '../../src/ranking/omaha-hilo-street-ranker.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';

describe('Omaha Street Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
  });

  it('ranks all omaha hands by river average rank', () => {
    const result = rankOmahaStreets(handOfFiveEvalIndexed, 1, 42);
    expect(result.gameType).toBe('omaha-hi');
    expect(result.hands.length).toBe(9854);
    expect(result.hands[0]!.river.averageRank).toBeGreaterThanOrEqual(
      result.hands[result.hands.length - 1]!.river.averageRank,
    );
  });
});

describe('Omaha Hi/Lo Street Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('ranks all omaha hi/lo hands with scoop metrics', () => {
    const result = rankOmahaHiLoStreets(1, 1, 42);
    expect(result.gameType).toBe('omaha-hi-lo');
    expect(result.hands.length).toBe(9854);
    expect(result.hands[0]!.river.scoopPct).toBeGreaterThanOrEqual(
      result.hands[result.hands.length - 1]!.river.scoopPct,
    );
    expect(result.hands[0]!.river.winHiPct).toBeDefined();
    expect(result.hands[0]!.river.winLoPct).toBeDefined();
  });
});
