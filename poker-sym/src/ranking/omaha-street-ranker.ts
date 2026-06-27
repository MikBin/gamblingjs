import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { enumerateOmahaStartingHands } from '../hands/omaha.js';
import { analyzeOmahaHandStreets, FiveCardEvalFn } from '../simulation/street-analysis.js';
import { StreetAnalysisResult } from '../simulation/types.js';
import { StreetProgressCallback } from './street-ranker.js';

/**
 * Run street analysis for all Omaha Hi starting hands.
 */
export const rankOmahaStreets = (
  eval5: FiveCardEvalFn = handOfFiveEvalIndexed,
  runs: number = 10000,
  seed?: number,
  onProgress?: StreetProgressCallback,
): StreetAnalysisResult => {
  const hands = enumerateOmahaStartingHands();
  const results = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + i : undefined;
    results.push(analyzeOmahaHandStreets(hand, runs, eval5, handSeed));

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  results.sort((a, b) => b.river.averageRank - a.river.averageRank);

  return {
    gameType: 'omaha-hi',
    config: { runs, opponents: 0, seed },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
