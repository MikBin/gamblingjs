export interface Benchmark {
  msPerHand: number;
  runs: number;
  opponents: number;
}

export const HAND_COUNTS = {
  holdem: 169,
  omaha: 9854,
  stud: 1755,
} as const;

export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min < 60) return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin > 0 ? `${hr}h ${remMin}m` : `${hr}h`;
};

export const estimateTotalMs = (
  handCount: number,
  runs: number,
  opponents: number,
  bench: Benchmark | null,
): number | null => {
  if (!bench || bench.msPerHand <= 0) return null;
  const runScale = runs / Math.max(1, bench.runs);
  const oppScale = opponents > 0 && bench.opponents > 0
    ? opponents / bench.opponents
    : opponents > 0
      ? 1 + opponents * 0.15
      : 1;
  return handCount * bench.msPerHand * runScale * oppScale;
};

export const rollingEtaMs = (elapsedMs: number, completed: number, total: number): number | null => {
  if (completed < 10 || completed >= total) return null;
  const remaining = total - completed;
  return (elapsedMs / completed) * remaining;
};

const storageKey = (pageKey: string): string => `poker-sym-bench:${pageKey}`;

export const loadBenchmark = (pageKey: string): Benchmark | null => {
  try {
    const raw = localStorage.getItem(storageKey(pageKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Benchmark;
    if (typeof parsed.msPerHand !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveBenchmark = (
  pageKey: string,
  msPerHand: number,
  runs: number,
  opponents: number,
): void => {
  try {
    localStorage.setItem(
      storageKey(pageKey),
      JSON.stringify({ msPerHand, runs, opponents } satisfies Benchmark),
    );
  } catch {
    // ignore quota errors
  }
};

export const formatPreRunEta = (
  handCount: number,
  runs: number,
  opponents: number,
  bench: Benchmark | null,
): string => {
  const ms = estimateTotalMs(handCount, runs, opponents, bench);
  if (ms == null) return 'Estimated: unknown (run once to calibrate)';
  return `Estimated: ~${formatDuration(ms)}`;
};
