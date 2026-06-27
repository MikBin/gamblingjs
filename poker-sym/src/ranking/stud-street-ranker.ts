import { enumerateStudStartingHands } from '../hands/stud.js';
import {
  analyzeStudHandStreets,
  StudStreetAnalysisResult,
} from '../simulation/stud-street-analysis.js';
import { FiveCardEvalFn, SevenCardEvalFn } from '../simulation/street-analysis.js';
import { StreetProgressCallback } from './street-ranker.js';

/**
 * Run street analysis for all 7-Card Stud starting hands.
 */
export const rankStudStreets = (
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  runs: number = 10000,
  seed?: number,
  onProgress?: StreetProgressCallback,
): StudStreetAnalysisResult => {
  const hands = enumerateStudStartingHands();
  const results = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + i : undefined;
    results.push(analyzeStudHandStreets(hand, runs, eval5, eval7, handSeed));

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  results.sort((a, b) => b.seventh.averageRank - a.seventh.averageRank);

  return {
    gameType: '7card-stud',
    config: { runs, opponents: 0, seed },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
