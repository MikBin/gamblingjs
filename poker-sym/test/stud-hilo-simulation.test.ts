import { describe, it, expect, beforeAll } from 'vitest';
import { simulateStudHiLoHand } from '../src/simulation/stud-hilo-montecarlo';
import { handOfSevenEvalHiLow8Indexed } from '../../src/pokerEvaluator7';
import { cardIndex } from '../src/utils/deck';
import { SimulationConfig } from '../src/simulation/types';
import { fastHashesCreators } from '../../src/pokerHashes7';

describe('Stud Hi/Lo Simulation', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('handOfSevenEvalHiLow8Indexed returns correct hi/lo for a qualifying low hand', () => {
    // A-2-3-4-5-6-K => best low is A-2-3-4-5, best high is straight 5-high... actually the wheel A-2-3-4-5
    const cards = [
      cardIndex(12, 0), // A♠
      cardIndex(0, 0),  // 2♠
      cardIndex(1, 0),  // 3♠
      cardIndex(2, 0),  // 4♠
      cardIndex(3, 0),  // 5♠
      cardIndex(4, 0),  // 6♠
      cardIndex(11, 0), // K♠
    ];
    const result = handOfSevenEvalHiLow8Indexed(
      cards[0]!, cards[1]!, cards[2]!, cards[3]!, cards[4]!, cards[5]!, cards[6]!,
    );
    expect(result.hi).toBeGreaterThan(0);
    expect(result.low).toBeGreaterThan(0);
  });

  it('handOfSevenEvalHiLow8Indexed returns -1 for low when no qualifying low', () => {
    // 9-T-J-Q-K-A-A — no card <= 8 except aces, but need 5 distinct low cards
    const cards = [
      cardIndex(12, 0), // A♠
      cardIndex(7, 0),  // 9♠
      cardIndex(8, 0),  // T♠
      cardIndex(9, 0),  // J♠
      cardIndex(10, 0), // Q♠
      cardIndex(11, 0), // K♠
      cardIndex(12, 1), // A♥
    ];
    const result = handOfSevenEvalHiLow8Indexed(
      cards[0]!, cards[1]!, cards[2]!, cards[3]!, cards[4]!, cards[5]!, cards[6]!,
    );
    expect(result.hi).toBeGreaterThan(0);
    expect(result.low).toBe(-1);
  });

  it('should run a raw strength simulation (0 opponents)', () => {
    const config: SimulationConfig = { runs: 100, opponents: 0, useCache: true };
    const hand = { key: 'AAA', cards: [cardIndex(12, 0), cardIndex(12, 1), cardIndex(12, 2)], description: '' };

    const result = simulateStudHiLoHand(hand, config, handOfSevenEvalHiLow8Indexed);
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

    const result = simulateStudHiLoHand(hand, config, handOfSevenEvalHiLow8Indexed);
    expect(result.key).toBe('AKQ:ms');
    expect(result.runs).toBe(100);
    expect(result.winPct).toBeGreaterThanOrEqual(0);
    expect(result.equity).toBeGreaterThanOrEqual(0);
    expect(result.scoopPct).toBeGreaterThanOrEqual(0);
  });
});