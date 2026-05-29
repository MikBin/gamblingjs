import { parentPort } from 'worker_threads';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { simulateOmahaHiLoHand } from '../simulation/omaha-hilo-montecarlo.js';
import { HandGroup } from '../hands/types.js';
import { SimulationConfig, HandStrengthResult } from '../simulation/types.js';

interface WorkerMessage {
  hands: HandGroup[];
  config: SimulationConfig;
  seedOffset: number;
}

// Initialize hash tables once per worker
fastHashesCreators.high();
fastHashesCreators.low8();

parentPort?.on('message', (msg: WorkerMessage) => {
  const { hands, config, seedOffset } = msg;
  const results: HandStrengthResult[] = [];

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i]!;
    const handConfig: SimulationConfig = {
      ...config,
      seed: config.seed != null ? config.seed + seedOffset + i : undefined,
    };
    const result = simulateOmahaHiLoHand(hand, handConfig);
    results.push(result);

    // Progress update every 10 hands or on completion
    if ((i + 1) % 10 === 0 || i === hands.length - 1) {
      parentPort?.postMessage({
        type: 'progress',
        completed: i + 1,
        total: hands.length,
      });
    }
  }

  parentPort?.postMessage({
    type: 'done',
    results,
  });
});
