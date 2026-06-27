import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { analyzeStudHiLoHandStreets } from '../../src/simulation/stud-hilo-street-analysis.js';
import { StudHiLoStreetHandResult } from '../../src/simulation/types.js';
import { HandGroup } from '../../src/hands/types.js';

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

self.onmessage = (event: MessageEvent<BatchMessage>) => {
  const data = event.data;
  if (data.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, runs, opponents, seed, seedOffset } = data;
  if (!hands || runs == null || opponents == null || seedOffset == null) return;

  aborted = false;
  const results: StudHiLoStreetHandResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handSeed = seed != null ? seed + seedOffset + i : undefined;
    results.push(analyzeStudHiLoHandStreets(hand, runs, opponents, handSeed));

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
