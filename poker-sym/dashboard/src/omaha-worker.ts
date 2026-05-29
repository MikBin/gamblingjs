import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { OmahaEvaluator } from '../../../src/core/OmahaEvaluator.js';
import { simulateOmahaHand } from '../../src/simulation/omaha-montecarlo.js';
import { HandGroup } from '../../src/hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../../src/simulation/types.js';

interface WorkerMessage {
  hands: HandGroup[];
  config: SimulationConfig;
  seedOffset: number;
}

// Initialize hash tables once per worker
fastHashesCreators.high();
const evaluator = new OmahaEvaluator();

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { hands, config, seedOffset } = event.data;
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handConfig: SimulationConfig = {
      ...config,
      seed: config.seed != null ? config.seed + seedOffset + i : undefined,
    };
    const result = simulateOmahaHand(hand, handConfig, evaluator);
    results.push(result);

    // Progress update every 5 hands or on completion
    if ((i + 1) % 5 === 0 || i === hands.length - 1) {
      self.postMessage({
        type: 'progress',
        completed: i + 1,
        total: hands.length,
      });
    }
  }

  self.postMessage({
    type: 'done',
    results,
  });
};
