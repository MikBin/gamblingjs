import { simulateRazzHand } from '../../src/simulation/razz-montecarlo.js';
import { HandGroup } from '../../src/hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../../src/simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  config?: SimulationConfig;
  seedOffset?: number;
}

let aborted = false;

self.onmessage = (event: MessageEvent<BatchMessage>) => {
  const data = event.data;
  if (data.type === 'abort') {
    aborted = true;
    return;
  }

  const { hands, config, seedOffset } = data;
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

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
