import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { analyzeOmahaHiLoHandStreets } from '../simulation/street-analysis-omaha-hilo.js';
import { HandGroup } from '../hands/types.js';
import { StreetHandResultHiLo } from '../simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  runs?: number;
  opponents?: number;
  seed?: number;
  seedOffset?: number;
}

fastHashesCreators.high();
fastHashesCreators.low8();

let aborted = false;

parentPort?.on('message', (msg: BatchMessage) => {
  if (msg.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, opponents, seed, seedOffset } = msg;
  if (!hands || runs == null || opponents == null || seedOffset == null) return;

  aborted = false;
  const results: StreetHandResultHiLo[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeOmahaHiLoHandStreets(hand, runs, opponents, handSeed));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
