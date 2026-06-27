import { parentPort } from 'worker_threads';
import { simulateRazzHand } from '../simulation/razz-montecarlo.js';
import { HandGroup } from '../hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  config?: SimulationConfig;
  seedOffset?: number;
}

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
    results.push(simulateRazzHand(hand.key, hand.cards, handConfig));

    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  parentPort?.postMessage({ type: 'done', results });
});
