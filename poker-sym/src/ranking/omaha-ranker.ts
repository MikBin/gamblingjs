import { HandStrengthResult, SimulationConfig, SimulationResult } from '../simulation/types.js';
import { simulateOmahaHand, OmahaEvaluator } from '../simulation/omaha-montecarlo.js';
import { enumerateOmahaStartingHands } from '../hands/omaha.js';
import { ProgressCallback } from './ranker.js';

/**
 * Run a full ranking simulation for Omaha Hi starting hands.
 *
 * Simulates all canonical starting hands using Monte Carlo method,
 * ranks them by strength, and returns the complete result.
 */
export const rankOmahaStartingHands = (
  evaluator: OmahaEvaluator,
  config: SimulationConfig,
  onProgress?: ProgressCallback,
): SimulationResult => {
  const hands = enumerateOmahaStartingHands();
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const result = simulateOmahaHand(hand, config, evaluator);
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
    gameType: 'omaha-hi',
    config,
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
