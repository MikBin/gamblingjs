import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { analyzeOmahaHandStreets } from '../../src/simulation/street-analysis.js';
import { HandGroup } from '../../src/hands/types.js';
import { StreetHandResult } from '../../src/simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  runs?: number;
  seed?: number;
  seedOffset?: number;
}

fastHashesCreators.high();

let aborted = false;

self.onmessage = (event: MessageEvent<BatchMessage>) => {
  const data = event.data;
  if (data.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, seed, seedOffset } = data;
  if (!hands || runs == null || seedOffset == null) return;

  aborted = false;
  const results: StreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeOmahaHandStreets(hand, runs, handOfFiveEvalIndexed, handSeed));

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
