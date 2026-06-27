import os from 'os';
import { Worker } from 'worker_threads';
import { HandGroup } from '../hands/types.js';
import { formatDuration, rollingEtaMs } from './cli-eta.js';

export interface CliWorkerProgressMsg {
  type: 'progress';
  completed: number;
  total: number;
}

export interface CliWorkerDoneMsg<T> {
  type: 'done';
  results: T[];
}

export type CliWorkerOutMsg<T> = CliWorkerProgressMsg | CliWorkerDoneMsg<T>;

export interface CliWorkerPoolResult<T> {
  results: T[];
  cancelled: boolean;
  completed: number;
  total: number;
}

export type CliProgressCallback = (
  completed: number,
  total: number,
  hand: string,
  etaMs: number | null,
) => void;

export interface RunCliWorkerPoolOptions<T> {
  workerPath: string;
  hands: HandGroup[];
  postBatch: (worker: Worker, batch: HandGroup[], workerIndex: number, seedOffset: number) => void;
  onProgress: CliProgressCallback;
  getHandLabel?: (batch: HandGroup[], completedInBatch: number) => string;
}

let sigintInstalled = false;
const activeWorkers = new Set<Worker>();
let cancelRequested = false;

const installSigintHandler = (): void => {
  if (sigintInstalled) return;
  sigintInstalled = true;
  const onSignal = () => {
    cancelRequested = true;
    for (const w of activeWorkers) {
      w.postMessage({ type: 'abort' });
      w.terminate();
    }
    process.stderr.write('\n  Cancelled by user\n');
    process.exit(130);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
};

export const getCliWorkerCount = (): number =>
  Math.max(1, Math.floor(os.cpus().length / 2));

export const runCliWorkerPool = async <T>(
  options: RunCliWorkerPoolOptions<T>,
): Promise<CliWorkerPoolResult<T>> => {
  installSigintHandler();
  cancelRequested = false;

  const { workerPath, hands, postBatch, onProgress, getHandLabel } = options;
  const totalHands = hands.length;
  if (totalHands === 0) {
    return { results: [], cancelled: false, completed: 0, total: 0 };
  }

  const numWorkers = getCliWorkerCount();
  const allResults: T[] = [];
  let completedHands = 0;
  const workerLastProgress: number[] = new Array(numWorkers).fill(0);
  const workers: Worker[] = [];
  const batches: HandGroup[][] = [];
  const startTime = Date.now();

  const promises: Promise<void>[] = [];

  for (let w = 0; w < numWorkers; w++) {
    const start = Math.floor((w / numWorkers) * hands.length);
    const end = Math.floor(((w + 1) / numWorkers) * hands.length);
    const batch = hands.slice(start, end);
    if (batch.length === 0) continue;
    batches.push(batch);

    const worker = new Worker(workerPath);
    workers.push(worker);
    activeWorkers.add(worker);

    const workerIndex = workers.length - 1;

    const promise = new Promise<void>((resolve, reject) => {
      worker.on('message', (msg: CliWorkerOutMsg<T>) => {
        if (msg.type === 'progress') {
          const delta = msg.completed - workerLastProgress[workerIndex]!;
          workerLastProgress[workerIndex] = msg.completed;
          completedHands += delta;
          const hand =
            getHandLabel?.(batch, msg.completed) ??
            batch[(msg.completed ?? 1) - 1]?.key ??
            '';
          const eta = rollingEtaMs(Date.now() - startTime, completedHands, totalHands);
          onProgress(Math.min(completedHands, totalHands), totalHands, hand, eta);
        } else if (msg.type === 'done') {
          allResults.push(...msg.results);
          resolve();
        }
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        activeWorkers.delete(worker);
        if (code !== 0 && !cancelRequested) {
          reject(new Error(`Worker exited with code ${code}`));
        }
      });
    });

    promises.push(promise);
    postBatch(worker, batch, workerIndex, workerIndex * 1_000_000);
  }

  try {
    await Promise.all(promises);
  } finally {
    workers.forEach((w) => {
      activeWorkers.delete(w);
      w.terminate();
    });
  }

  return {
    results: allResults,
    cancelled: cancelRequested,
    completed: completedHands,
    total: totalHands,
  };
};

export const formatCliProgressLine = (
  completed: number,
  total: number,
  hand: string,
  etaMs: number | null,
): string => {
  const pct = ((completed / total) * 100).toFixed(0);
  const eta = etaMs != null ? ` · ETA ${formatDuration(etaMs)}` : '';
  return `\r  Progress: ${completed}/${total} (${pct}%) — ${hand}${eta}    `;
};
