import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { LowAto5Evaluator } from '../../../src/core/LowEvaluator.js';
import { handOfFiveEvalLow_Ato5Indexed } from '../../../src/pokerEvaluator5.js';
import { analyzeRazzHandStreets, RazzStreetHandResult } from '../../src/simulation/razz-street-analysis.js';
import { FiveCardEvalFn, SevenCardEvalFn } from '../../src/simulation/street-analysis.js';
import { HandGroup } from '../../src/hands/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  runs?: number;
  seed?: number;
  seedOffset?: number;
}

fastHashesCreators.high();
const evaluator = new LowAto5Evaluator();
const evalFn7: SevenCardEvalFn = (c1, c2, c3, c4, c5, c6, c7) =>
  evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);
const evalFn5: FiveCardEvalFn = handOfFiveEvalLow_Ato5Indexed;

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
  const results: RazzStreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeRazzHandStreets(hand, runs, evalFn5, evalFn7, handSeed));

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
