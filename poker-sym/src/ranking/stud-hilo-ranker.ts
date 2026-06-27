import { SimulationConfig, SimulationResult, HandStrengthResult } from '../simulation/types.js';
import { enumerateStudStartingHands } from '../hands/stud.js';
import { simulateStudHiLoHand, StudHiLoEvaluator } from '../simulation/stud-hilo-montecarlo.js';
import { ProgressCallback } from './ranker.js';

/**
 * Run a full ranking simulation for Stud Hi/Lo starting hands.
 *
 * Simulates all canonical starting hands using Monte Carlo method,
 * ranks them by strength, and returns the complete result.
 */
export const rankStudHiLoStartingHands = (
  evaluator: StudHiLoEvaluator,
  config: SimulationConfig,
  onProgress?: ProgressCallback,
): SimulationResult => {
  const hands = enumerateStudStartingHands();
  const results: HandStrengthResult[] = [];
  const total = hands.length;

  for (let i = 0; i < total; i++) {
    const hand = hands[i]!;

    const handConfig = {
      ...config,
      seed: config.seed !== undefined ? config.seed + i : undefined,
    };

    const result = simulateStudHiLoHand(hand, handConfig, evaluator);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, total, hand.key);
    }
  }

  // Sort results. For equity mode, sort by equity. For raw mode, sort by average rank.
  if (config.opponents > 0) {
    results.sort((a, b) => (b.equity ?? 0) - (a.equity ?? 0) || b.averageRank - a.averageRank);
  } else {
    results.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: 'stud-hi-lo',
    config,
    hands: results,
    timestamp: new Date().toISOString(),
  };
};