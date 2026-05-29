import { HandStrengthResult, SimulationConfig, SimulationResult } from '../simulation/types.js';
import { simulateStudHand, StudEvaluator } from '../simulation/stud-montecarlo.js';
import { enumerateStudStartingHands } from '../hands/stud.js';
import { ProgressCallback } from './ranker.js';

export const rankStudStartingHands = (
  evaluator: StudEvaluator,
  config: SimulationConfig,
  onProgress?: ProgressCallback,
): SimulationResult => {
  const hands = enumerateStudStartingHands();
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const result = simulateStudHand(hand, config, evaluator);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  if (config.opponents > 0) {
    results.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    results.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: '7card-stud',
    config,
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
