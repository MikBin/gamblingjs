import { enumerateOmahaStartingHands } from '../hands/omaha.js';
import { analyzeOmahaHiLoHandStreets } from '../simulation/street-analysis-omaha-hilo.js';
import { StreetAnalysisResultHiLo } from '../simulation/types.js';
import { StreetProgressCallback } from './street-ranker.js';

/**
 * Run street analysis for all Omaha Hi/Lo starting hands.
 */
export const rankOmahaHiLoStreets = (
  runs: number = 10000,
  opponents: number = 1,
  seed?: number,
  onProgress?: StreetProgressCallback,
): StreetAnalysisResultHiLo => {
  const hands = enumerateOmahaStartingHands();
  const results = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + i : undefined;
    results.push(analyzeOmahaHiLoHandStreets(hand, runs, opponents, handSeed));

    if (onProgress) {
      onProgress(i + 1, hands.length, hand.key);
    }
  }

  results.sort((a, b) => b.river.scoopPct - a.river.scoopPct || b.river.winHiPct - a.river.winHiPct);

  return {
    gameType: 'omaha-hi-lo',
    config: { runs, opponents, seed },
    hands: results,
    timestamp: new Date().toISOString(),
  };
};
