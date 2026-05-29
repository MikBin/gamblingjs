import { SimulationConfig, SimulationResult, HandStrengthResult } from '../simulation/types.js';
import { enumerateStudStartingHands } from '../hands/stud.js';
import { simulateRazzHand } from '../simulation/razz-montecarlo.js';

/**
 * Ranks all 455 Razz starting hands.
 *
 * @param config Simulation configuration
 * @param onProgress Callback for reporting progress to CLI
 * @returns Ranked simulation results
 */
export const rankRazzStartingHands = (
  config: SimulationConfig,
  onProgress?: (completed: number, total: number, hand: string) => void,
): SimulationResult => {
  const hands = enumerateStudStartingHands();
  const total = hands.length;
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < total; i++) {
    const handGroup = hands[i]!;

    // In sequential execution, vary the seed slightly per hand so they don't share identical rng state
    const handConfig = {
      ...config,
      seed: config.seed !== undefined ? config.seed + i : undefined,
    };

    const result = simulateRazzHand(handGroup.key, handGroup.cards, handConfig);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, total, handGroup.key);
    }
  }

  // Sort primarily by win percentage, then by average rank
  if (config.opponents > 0) {
    results.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    results.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: 'razz',
    config,
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
