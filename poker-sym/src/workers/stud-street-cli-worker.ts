import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { analyzeStudHandStreets, StudStreetHandResult } from '../simulation/stud-street-analysis.js';
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
const evaluator = new HighEvaluator();
const evalFn7: SevenCardEvalFn = (c1, c2, c3, c4, c5, c6, c7) =>
  evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);
const evalFn5: FiveCardEvalFn = handOfFiveEvalIndexed;

let aborted = false;

parentPort?.on('message', (msg: BatchMessage) => {
  if (msg.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, seed, seedOffset } = msg;
  if (!hands || runs == null || seedOffset == null) return;

  aborted = false;
  const results: StudStreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeStudHandStreets(hand, runs, evalFn5, evalFn7, handSeed));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
