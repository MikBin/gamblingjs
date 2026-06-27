import { enumerateHoldemStartingHands } from './hands/holdem.js';
import { enumerateOmahaStartingHands } from './hands/omaha.js';
import { enumerateStudStartingHands } from './hands/stud.js';
import { SimulationConfig, SimulationResult, HandStrengthResult } from './simulation/types.js';
import { runCliWorkerPool, formatCliProgressLine, getCliWorkerCount } from './workers/cli-worker-pool.js';
import { estimateCliTotalMs, formatDuration } from './workers/cli-eta.js';

const sortPreflopResults = (hands: HandStrengthResult[], config: SimulationConfig): HandStrengthResult[] => {
  const sorted = [...hands];
  if (config.opponents > 0) {
    sorted.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    sorted.sort((a, b) => b.averageRank - a.averageRank);
  }
  return sorted;
};

export const logPreflopStart = (
  label: string,
  handCount: number,
  config: SimulationConfig,
  pageKey: string,
): void => {
  const etaMs = estimateCliTotalMs(pageKey, handCount, config.runs, config.opponents);
  console.error(
    `Running ${label} preflop simulation...\n` +
      `  Hands: ${handCount.toLocaleString()} | Runs/hand: ${config.runs} | Opponents: ${config.opponents}\n` +
      `  Using ${getCliWorkerCount()} worker threads | Estimated: ~${formatDuration(etaMs)}`,
  );
};

export const runPreflopWorkerPool = async (
  pageKey: string,
  gameType: SimulationResult['gameType'],
  hands: ReturnType<typeof enumerateHoldemStartingHands>,
  workerPath: string,
  config: SimulationConfig,
  fallback: () => SimulationResult,
): Promise<SimulationResult> => {
  try {
    const pool = await runCliWorkerPool<HandStrengthResult>({
      workerPath,
      hands,
      postBatch: (worker, batch, _w, seedOffset) => {
        worker.postMessage({ hands: batch, config, seedOffset });
      },
      onProgress: (completed, total, hand, etaMs) => {
        if (completed % 10 === 0 || completed === total) {
          process.stderr.write(formatCliProgressLine(completed, total, hand, etaMs));
        }
      },
    });

    return {
      gameType,
      config,
      hands: sortPreflopResults(pool.results, config),
      timestamp: new Date().toISOString(),
    };
  } catch {
    console.error('\n  Worker pool failed, falling back to single-threaded...');
    return fallback();
  }
};

export { enumerateHoldemStartingHands, enumerateOmahaStartingHands, enumerateStudStartingHands };
