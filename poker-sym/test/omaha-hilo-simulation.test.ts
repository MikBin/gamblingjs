import { describe, it, expect, beforeAll } from 'vitest';
import { simulateOmahaHiLoHand } from '../src/simulation/omaha-hilo-montecarlo.js';
import { HandGroup } from '../src/hands/types.js';
import { DEFAULT_CONFIG } from '../src/simulation/types.js';
import { cardIndex } from '../src/utils/deck.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';

describe('Omaha Hi/Lo Simulation', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  const makeHand = (cards: number[], key = 'test'): HandGroup => ({
    key,
    cards,
    description: '',
  });

  const getCard = (rank: number, suit: number) => cardIndex(rank, suit);

  it('calculates raw strength without opponents', () => {
    // Wheel draw hand: A,2,3,4
    const hand = makeHand([getCard(12, 0), getCard(0, 1), getCard(1, 2), getCard(2, 3)], 'A234');

    const result = simulateOmahaHiLoHand(hand, { ...DEFAULT_CONFIG, runs: 10, opponents: 0 });

    expect(result.runs).toBe(10);
    expect(result.winHiPct).toBe(0);
    expect(result.winLoPct).toBe(0);
    expect(result.scoopPct).toBe(0);
    expect(result.tiePct).toBe(0);
    expect(result.averageRank).toBeGreaterThan(0);
  });

  it('simulates against opponents correctly', () => {
    // Strong Hi/Lo starting hand: A,A,2,3 ds
    const hand = makeHand([getCard(12, 0), getCard(12, 1), getCard(0, 0), getCard(1, 1)], 'AA23ds');

    const result = simulateOmahaHiLoHand(hand, { ...DEFAULT_CONFIG, runs: 100, opponents: 1, seed: 123 });

    expect(result.runs).toBe(100);
    expect(result.winHiPct).toBeGreaterThanOrEqual(0);
    expect(result.winHiPct).toBeLessThanOrEqual(100);
    expect(result.winLoPct).toBeGreaterThanOrEqual(0);
    expect(result.winLoPct).toBeLessThanOrEqual(100);
    expect(result.scoopPct).toBeGreaterThanOrEqual(0);
    expect(result.scoopPct).toBeLessThanOrEqual(100);
    expect(result.tiePct).toBeGreaterThanOrEqual(0);
  });
});
