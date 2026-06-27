import {
  formatDuration,
  formatPreRunEta,
  loadBenchmark,
  rollingEtaMs,
  saveBenchmark,
} from './eta.js';

export interface AnalysisElements {
  runBtn: HTMLButtonElement;
  stopBtn: HTMLButtonElement;
  progressContainer: HTMLElement;
  progressFill: HTMLElement;
  progressText: HTMLElement;
  etaText: HTMLElement;
  paramInputs: HTMLInputElement[];
}

export interface AnalysisParams {
  runs: number;
  opponents: number;
}

export interface ProgressState {
  startTime: number;
  handCount: number;
}

export const bindPreRunEta = (
  pageKey: string,
  handCount: number,
  elements: Pick<AnalysisElements, 'etaText' | 'paramInputs'>,
  getParams: () => AnalysisParams,
): void => {
  const update = () => {
    const { runs, opponents } = getParams();
    const bench = loadBenchmark(pageKey);
    elements.etaText.textContent = formatPreRunEta(handCount, runs, opponents, bench);
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = () => {
    clearTimeout(timer);
    timer = setTimeout(update, 300);
  };

  for (const input of elements.paramInputs) {
    input.addEventListener('input', debounced);
    input.addEventListener('change', debounced);
  }
  update();
};

export const beginAnalysisRun = (
  elements: AnalysisElements,
  runLabel: string,
): AbortController => {
  const controller = new AbortController();
  elements.runBtn.disabled = true;
  elements.runBtn.textContent = 'Running...';
  elements.stopBtn.disabled = false;
  elements.progressContainer.classList.add('active');
  elements.progressFill.style.width = '0%';
  elements.progressText.textContent = 'Starting...';
  elements.runBtn.dataset.defaultLabel = runLabel;
  return controller;
};

export const updateAnalysisProgress = (
  elements: Pick<AnalysisElements, 'progressFill' | 'progressText'>,
  state: ProgressState,
  completed: number,
  total: number,
): void => {
  const pct = (completed / total) * 100;
  elements.progressFill.style.width = pct + '%';
  let text = `${completed}/${total} hands (${pct.toFixed(0)}%)`;
  const eta = rollingEtaMs(performance.now() - state.startTime, completed, total);
  if (eta != null) text += ` · ETA ${formatDuration(eta)}`;
  elements.progressText.textContent = text;
};

export const finishAnalysisRun = (
  pageKey: string,
  elements: AnalysisElements,
  state: ProgressState,
  completed: number,
  params: AnalysisParams,
  cancelled: boolean,
  successSuffix?: string,
): void => {
  elements.runBtn.disabled = false;
  elements.runBtn.textContent = elements.runBtn.dataset.defaultLabel ?? 'Run';
  elements.stopBtn.disabled = true;

  const elapsed = performance.now() - state.startTime;
  if (!cancelled && completed > 0) {
    saveBenchmark(pageKey, elapsed / completed, params.runs, params.opponents);
    const bench = loadBenchmark(pageKey);
    elements.etaText.textContent = formatPreRunEta(state.handCount, params.runs, params.opponents, bench);
  }

  if (cancelled) {
    elements.progressFill.style.width = `${(completed / state.handCount) * 100}%`;
    elements.progressText.textContent =
      `Cancelled at ${completed}/${state.handCount}` +
      (completed > 0 ? ' — partial results shown' : '');
    return;
  }

  elements.progressFill.style.width = '100%';
  const elapsedSec = (elapsed / 1000).toFixed(1);
  elements.progressText.textContent =
    `✓ Completed in ${elapsedSec}s` + (successSuffix ? ` — ${successSuffix}` : '');
};
