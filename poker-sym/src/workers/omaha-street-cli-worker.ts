import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { analyzeOmahaHandStreets } from '../simulation/street-analysis.js';
import { HandGroup } from '../hands/types.js';
import { StreetHandResult } from '../simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  runs?: number;
  seed?: number;
  seedOffset?: number;
}

fastHashesCreators.high();

let aborted = false;

parentPort?.on('message', (msg: BatchMessage) => {
  if (msg.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, seed, seedOffset } = msg;
  if (!hands || runs == null || seedOffset == null) return;

  aborted = false;
  const results: StreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeOmahaHandStreets(hand, runs, handOfFiveEvalIndexed, handSeed));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
