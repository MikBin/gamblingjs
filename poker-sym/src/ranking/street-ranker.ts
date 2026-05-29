import { StreetHandResult, StreetAnalysisResult } from '../simulation/types.js';
import { analyzeHandStreets, FiveCardEvalFn, SevenCardEvalFn } from '../simulation/street-analysis.js';
import { enumerateHoldemStartingHands } from '../hands/holdem.js';

/**
 * Progress callback type for street analysis updates.
 */
export type StreetProgressCallback = (
  completed: number,
  total: number,
  currentHand: string,
) => void;

/**
 * Run street analysis for all 169 Texas Hold'em starting hands.
 *
 * For each hand, runs Monte Carlo simulation evaluating at each
 * street (flop/turn/river), collecting category distributions,
 * equity curves, board texture breakdowns, and realization metrics.
 *
 * @param eval5 - 5-card evaluator function
 * @param eval7 - 7-card evaluator function
 * @param runs - Number of Monte Carlo runs per hand
 * @param seed - Optional random seed for reproducibility
 * @param onProgress - Optional progress callback
 * @returns Complete street analysis result for all 169 hands
 */
export const rankStreets = (
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  runs: number = 10000,
  seed?: number,
  onProgress?: StreetProgressCallback,
): StreetAnalysisResult => {
  const hands = enumerateHoldemStartingHands();
  const results: StreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    // Use a derived seed per hand for reproducibility while maintaining independence
    const handSeed = seed != null ? seed + i : undefined;
    const result = analyzeHandStreets(hand, runs, eval5, eval7, handSeed);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  // Sort by river average rank descending (strongest first)
  results.sort((a, b) => b.river.averageRank - a.river.averageRank);

  return {
    gameType: 'texas-holdem',
    config: {
      runs,
      opponents: 0,
      seed,
    },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};