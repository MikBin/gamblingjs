import { describe, it, expect, beforeAll } from 'vitest';
import { simulateStudHiLoHand, bestStudLow } from '../src/simulation/stud-hilo-montecarlo';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import { Low8Evaluator } from '../../src/core/LowEvaluator';
import { cardIndex } from '../src/utils/deck';
import { SimulationConfig } from '../src/simulation/types';
import { fastHashesCreators } from '../../src/pokerHashes7';

describe('Stud Hi/Lo Simulation', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  const highEvaluator = new HighEvaluator();
  const lowEvaluator = new Low8Evaluator();

  it('bestStudLow calculates the best 5-card low from 7 cards', () => {
    const cards = [
      cardIndex(12, 0), // A
      cardIndex(0, 0),  // 2
      cardIndex(1, 0),  // 3
      cardIndex(2, 0),  // 4
      cardIndex(3, 0),  // 5
      cardIndex(4, 0),  // 6
      cardIndex(11, 0), // K
    ];
    const score = bestStudLow(cards, lowEvaluator);
    expect(score).toBeGreaterThan(0);

    const noLowCards = [
      cardIndex(12, 0), // A
      cardIndex(7, 0),  // 9
      cardIndex(8, 0),  // T
      cardIndex(9, 0),  // J
      cardIndex(10, 0), // Q
      cardIndex(11, 0), // K
      cardIndex(12, 1), // A
    ];
    const scoreNoLow = bestStudLow(noLowCards, lowEvaluator);
    expect(scoreNoLow).toBe(-1);
  });

  it('should run a raw strength simulation (0 opponents)', () => {
    const config: SimulationConfig = { runs: 100, opponents: 0, useCache: true };
    const hand = { key: 'AAA', cards: [cardIndex(12, 0), cardIndex(12, 1), cardIndex(12, 2)], description: '' };

    const result = simulateStudHiLoHand(hand, config, highEvaluator, lowEvaluator);
    expect(result.key).toBe('AAA');
    expect(result.runs).toBe(100);
    expect(result.averageRank).toBeGreaterThan(0);
    expect(result.winPct).toBe(0);
    expect(result.highWinPct).toBe(0);
    expect(result.lowWinPct).toBe(0);
  });

  it('should run an equity simulation with opponents', () => {
    const config: SimulationConfig = { runs: 100, opponents: 2, useCache: true };
    const hand = { key: 'AKQ:ms', cards: [cardIndex(12, 0), cardIndex(11, 0), cardIndex(10, 0)], description: '' };

    const result = simulateStudHiLoHand(hand, config, highEvaluator, lowEvaluator);
    expect(result.key).toBe('AKQ:ms');
    expect(result.runs).toBe(100);
    expect(result.winPct).toBeGreaterThanOrEqual(0);
    expect(result.equity).toBeGreaterThanOrEqual(0);
    expect(result.scoopPct).toBeGreaterThanOrEqual(0);
  });
});
