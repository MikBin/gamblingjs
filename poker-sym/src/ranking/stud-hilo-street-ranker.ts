import { enumerateStudStartingHands } from '../hands/stud.js';
import { analyzeStudHiLoHandStreets } from '../simulation/stud-hilo-street-analysis.js';
import { StudHiLoStreetAnalysisResult } from '../simulation/types.js';
import { StreetProgressCallback } from './street-ranker.js';

/**
 * Run street analysis for all Stud Hi/Lo starting hands.
 */
export const rankStudHiLoStreets = (
  runs: number = 10000,
  opponents: number = 1,
  seed?: number,
  onProgress?: StreetProgressCallback,
): StudHiLoStreetAnalysisResult => {
  const hands = enumerateStudStartingHands();
  const results = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + i : undefined;
    results.push(analyzeStudHiLoHandStreets(hand, runs, opponents, handSeed));

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  results.sort((a, b) => b.seventh.equity - a.seventh.equity);

  return {
    gameType: 'stud-hi-lo',
    config: { runs, opponents, seed },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
