import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { LowAto5Evaluator } from '../../../src/core/LowEvaluator.js';
import { handOfFiveEvalLow_Ato5Indexed } from '../../../src/pokerEvaluator5.js';
import { analyzeRazzHandStreets, RazzStreetHandResult } from '../simulation/razz-street-analysis.js';
import { FiveCardEvalFn, SevenCardEvalFn } from '../simulation/street-analysis.js';
import { HandGroup } from '../hands/types.js';

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

parentPort?.on('message', (msg: BatchMessage) => {
  if (msg.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, seed, seedOffset } = msg;
  if (!hands || runs == null || seedOffset == null) return;

  aborted = false;
  const results: RazzStreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeRazzHandStreets(hand, runs, evalFn5, evalFn7, handSeed));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
