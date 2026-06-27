import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { OmahaEvaluator } from '../../../src/core/OmahaEvaluator.js';
import { simulateOmahaHand } from '../../src/simulation/omaha-montecarlo.js';
import { HandGroup } from '../../src/hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../../src/simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  config?: SimulationConfig;
  seedOffset?: number;
}

fastHashesCreators.high();
const evaluator = new OmahaEvaluator();

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
    results.push(simulateOmahaHand(hand, handConfig, evaluator));

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
