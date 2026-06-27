/** Base ms per hand at 1000 runs, 0 opponents — tuned from dashboard benchmarks. */
export const CLI_BASE_MS_PER_HAND: Record<string, number> = {
  'holdem-preflop': 8,
  'omaha-preflop': 0.45,
  'omaha-hilo-preflop': 0.55,
  'stud-preflop': 12,
  'stud-hilo-preflop': 18,
  'razz-preflop': 10,
  'holdem-street': 35,
  'omaha-street': 0.7,
  'omaha-hilo-street': 1.2,
  'stud-street': 45,
  'stud-hilo-street': 55,
  'razz-street': 40,
};

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

export const estimateCliTotalMs = (
  pageKey: string,
  handCount: number,
  runs: number,
  opponents: number,
): number => {
  const base = CLI_BASE_MS_PER_HAND[pageKey] ?? 10;
  const runScale = runs / 1000;
  const oppScale = opponents > 0 ? 1 + opponents * 0.12 : 1;
  return handCount * base * runScale * oppScale;
};

export const rollingEtaMs = (elapsedMs: number, completed: number, total: number): number | null => {
  if (completed < 10 || completed >= total) return null;
  return (elapsedMs / completed) * (total - completed);
};
