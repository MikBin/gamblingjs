import { enumerateStudStartingHands } from '../hands/stud.js';
import {
  analyzeRazzHandStreets,
  RazzStreetAnalysisResult,
} from '../simulation/razz-street-analysis.js';
import { FiveCardEvalFn, SevenCardEvalFn } from '../simulation/street-analysis.js';
import { StreetProgressCallback } from './street-ranker.js';

/**
 * Run street analysis for all Razz starting hands.
 */
export const rankRazzStreets = (
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  runs: number = 10000,
  seed?: number,
  onProgress?: StreetProgressCallback,
): RazzStreetAnalysisResult => {
  const hands = enumerateStudStartingHands();
  const results = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + i : undefined;
    results.push(analyzeRazzHandStreets(hand, runs, eval5, eval7, handSeed));

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  results.sort((a, b) => b.seventh.averageRank - a.seventh.averageRank);

  return {
    gameType: 'razz',
    config: { runs, opponents: 0, seed },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
