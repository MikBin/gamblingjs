import { describe, it, expect, vi } from 'vitest';
import { simulateStudHand } from '../poker-sym/src/simulation/stud-montecarlo.js';
import { HandGroup } from '../poker-sym/src/hands/types.js';

describe('Stud Monte Carlo Simulation Engine', () => {
  const dummyEvaluator = vi.fn().mockReturnValue(100);

  const dummyHand: HandGroup = {
    key: 'AAA',
    cards: [0, 1, 2],
    description: 'Rolled up As',
  };

  it('should calculate raw strength when opponents = 0', () => {
    const config = { runs: 10, opponents: 0, useCache: false, seed: 123 };
    const result = simulateStudHand(dummyHand, config, dummyEvaluator);

    expect(dummyEvaluator).toHaveBeenCalledTimes(10);
    expect(result.averageRank).toBe(100);
    expect(result.winPct).toBe(0);
    expect(result.tiePct).toBe(0);
  });

  it('should run equity simulation when opponents > 0', () => {
    const config = { runs: 5, opponents: 2, useCache: false, seed: 123 };

    let callCount = 0;
    const customEval = vi.fn().mockImplementation(() => {
      callCount++;
      const sequence = [
        10, 5, 2,   // R1: Win (1)
        10, 10, 5,  // R2: Tie (1)
        5, 10, 2,   // R3: Loss (1)
        10, 2, 2,   // R4: Win (2)
        10, 10, 10, // R5: Tie (2)
      ];
      return sequence[callCount - 1];
    });

    const result = simulateStudHand(dummyHand, config, customEval);

    expect(customEval).toHaveBeenCalledTimes(15);
    expect(result.averageRank).toBe(9);
    expect(result.winPct).toBe(40);
    expect(result.tiePct).toBe(40);
  });

  it('should throw error when opponents > 6', () => {
    const config = { runs: 10, opponents: 7, useCache: false, seed: 123 };
    expect(() => simulateStudHand(dummyHand, config, dummyEvaluator)).toThrow('Maximum of 6 opponents allowed');
  });
});
