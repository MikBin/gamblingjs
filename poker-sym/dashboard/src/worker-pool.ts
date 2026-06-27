import { HandGroup } from '../../src/hands/types.js';

export interface WorkerProgressMsg {
  type: 'progress';
  completed: number;
  total: number;
}

export interface WorkerDoneMsg<T> {
  type: 'done';
  results: T[];
}

export type WorkerOutMsg<T> = WorkerProgressMsg | WorkerDoneMsg<T>;

export interface WorkerPoolResult<T> {
  results: T[];
  cancelled: boolean;
  completed: number;
  total: number;
}

export interface RunWorkerPoolOptions<T> {
  workerUrl: URL;
  hands: HandGroup[];
  postBatch: (worker: Worker, batch: HandGroup[], workerIndex: number, seedOffset: number) => void;
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
}

export const getWorkerCount = (): number =>
  Math.max(1, Math.min(4, Math.floor((navigator.hardwareConcurrency || 4) / 2)));

export const runWorkerPool = <T>(options: RunWorkerPoolOptions<T>): Promise<WorkerPoolResult<T>> => {
  const { workerUrl, hands, postBatch, signal, onProgress } = options;
  const totalHands = hands.length;

  if (totalHands === 0) {
    return Promise.resolve({ results: [], cancelled: false, completed: 0, total: 0 });
  }

  return new Promise((resolve, reject) => {
    const numWorkers = getWorkerCount();
    const allResults: T[] = [];
    let completedHands = 0;
    let cancelled = false;
    const workerLastProgress: number[] = new Array(numWorkers).fill(0);
    const workers: Worker[] = [];
    let settled = false;

    const finish = (wasCancelled: boolean) => {
      if (settled) return;
      settled = true;
      workers.forEach((w) => w.terminate());
      resolve({
        results: allResults,
        cancelled: wasCancelled,
        completed: completedHands,
        total: totalHands,
      });
    };

    const onAbort = () => {
      cancelled = true;
      for (const worker of workers) {
        worker.postMessage({ type: 'abort' });
      }
    };

    if (signal?.aborted) {
      finish(true);
      return;
    }
    signal?.addEventListener('abort', onAbort, { once: true });

    let workersDone = 0;

    for (let w = 0; w < numWorkers; w++) {
      const start = Math.floor((w / numWorkers) * hands.length);
      const end = Math.floor(((w + 1) / numWorkers) * hands.length);
      const batch = hands.slice(start, end);
      if (batch.length === 0) continue;

      let worker: Worker;
      try {
        worker = new Worker(workerUrl, { type: 'module' });
      } catch (err) {
        workers.forEach((x) => x.terminate());
        reject(err);
        return;
      }
      workers.push(worker);

      worker.onmessage = (event: MessageEvent<WorkerOutMsg<T>>) => {
        const msg = event.data;
        if (msg.type === 'progress') {
          const delta = msg.completed - workerLastProgress[w]!;
          workerLastProgress[w] = msg.completed;
          completedHands += delta;
          onProgress?.(Math.min(completedHands, totalHands), totalHands);
        } else if (msg.type === 'done') {
          allResults.push(...msg.results);
          workersDone++;
          if (workersDone === workers.length) {
            finish(cancelled);
          }
        }
      };

      worker.onerror = (err) => {
        if (!settled) {
          settled = true;
          workers.forEach((x) => x.terminate());
          reject(err);
        }
      };

      postBatch(worker, batch, w, w * 1_000_000);
    }

    if (workers.length === 0) {
      finish(false);
    }
  });
};
