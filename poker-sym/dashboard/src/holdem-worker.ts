import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { simulateHand } from '../../src/simulation/montecarlo.js';
import { HandGroup } from '../../src/hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../../src/simulation/types.js';

interface BatchMessage {
  type?: 'abort';
  hands?: HandGroup[];
  config?: SimulationConfig;
  seedOffset?: number;
}

fastHashesCreators.high();
const evaluator = new HighEvaluator();
const evalFn = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
  evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

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
    results.push(simulateHand(hand, handConfig, evalFn));

    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({ type: 'progress', completed: i + 1, total: hands.length });
    }
  }

  self.postMessage({ type: 'done', results });
};
