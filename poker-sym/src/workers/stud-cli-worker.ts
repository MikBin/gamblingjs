import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { simulateStudHand, StudEvaluator } from '../simulation/stud-montecarlo.js';
import { HandGroup } from '../hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  config?: SimulationConfig;
  seedOffset?: number;
}

fastHashesCreators.high();
const evaluator = new HighEvaluator();
const evalFn: StudEvaluator = (c1, c2, c3, c4, c5, c6, c7) =>
  evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

let aborted = false;

parentPort?.on('message', (msg: BatchMessage) => {
  if (msg.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, config, seedOffset } = msg;
  if (!hands || !config || seedOffset == null) return;

  aborted = false;
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    if (aborted) break;
    const hand = hands[i]!;
    const handConfig: SimulationConfig = {
      ...config,
      seed: config.seed != null ? config.seed + seedOffset + i : undefined,
    };
    results.push(simulateStudHand(hand, handConfig, evalFn));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
