import { describe, it, expect, beforeAll } from 'vitest';
import { simulateRazzHand } from '../../src/simulation/razz-montecarlo.js';
import { cardIndex } from '../../src/utils/deck.js';
import { DEFAULT_CONFIG } from '../../src/simulation/types.js';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';

describe('Razz Monte Carlo Simulation', () => {
  beforeAll(() => {
    // We need the low hashes for LowAto5Evaluator
    fastHashesCreators.Ato5();
  });

  it('correctly simulates A23 (best hand) and finds high win rate', () => {
    const config = { ...DEFAULT_CONFIG, runs: 100, opponents: 1, seed: 42 };

    // A23 -> indices: 12, 0, 1 (using suit 0)
    const cards = [cardIndex(12, 0), cardIndex(0, 0), cardIndex(1, 0)];

    const result = simulateRazzHand('A32', cards, config);

    expect(result.key).toBe('A32');
    expect(result.runs).toBe(100);
    expect(result.winPct).toBeGreaterThan(50); // A23 is very strong
  });

  it('correctly simulates KKK (worst hand) and finds low win rate', () => {
    const config = { ...DEFAULT_CONFIG, runs: 100, opponents: 1, seed: 42 };

    // KKK -> indices: 11 (suits 0, 1, 2)
    const cards = [cardIndex(11, 0), cardIndex(11, 1), cardIndex(11, 2)];

    const result = simulateRazzHand('KKK', cards, config);

    expect(result.key).toBe('KKK');
    expect(result.runs).toBe(100);
    expect(result.winPct).toBeLessThan(50); // KKK is terrible
  });
});
