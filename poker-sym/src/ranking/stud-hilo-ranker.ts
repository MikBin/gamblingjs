import { SimulationConfig, SimulationResult, HandStrengthResult } from '../simulation/types.js';
import { enumerateStudStartingHands } from '../hands/stud.js';
import { simulateStudHiLoHand, StudHiLoEvaluator } from '../simulation/stud-hilo-montecarlo.js';

export const rankStudHiLoStartingHands = (
  evaluator: StudHiLoEvaluator,
  config: SimulationConfig,
  onProgress?: (completed: number, total: number, hand: string) => void,
): SimulationResult => {
  const hands = enumerateStudStartingHands();
  const results: HandStrengthResult[] = [];
  const total = hands.length;

  for (let i = 0; i < total; i++) {
    const hand = hands[i]!;
    const result = simulateStudHiLoHand(hand, config, evaluator);
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