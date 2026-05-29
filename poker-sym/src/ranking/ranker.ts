import { HandGroup } from '../hands/types.js';
import { HandStrengthResult, SimulationConfig, SimulationResult } from '../simulation/types.js';
import { simulateHand, HoldemEvaluator } from '../simulation/montecarlo.js';
import { enumerateHoldemStartingHands } from '../hands/holdem.js';

/**
 * Progress callback type for simulation updates.
 */
export type ProgressCallback = (completed: number, total: number, currentHand: string) => void;

/**
 * Run a full ranking simulation for Texas Hold'em starting hands.
 *
 * Simulates all 169 canonical starting hands using Monte Carlo method,
 * ranks them by strength, and returns the complete result.
 */
export const rankHoldemStartingHands = (
  evaluator: HoldemEvaluator,
  config: SimulationConfig,
  onProgress?: ProgressCallback,
): SimulationResult => {
  const hands = enumerateHoldemStartingHands();
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const result = simulateHand(hand, config, evaluator);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  // Sort by winPct (descending) if opponents > 0, otherwise by averageRank (descending)
  if (config.opponents > 0) {
    results.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    results.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: 'texas-holdem',
    config,
    hands: results,
    timestamp: new Date().toISOString(),
  };
};