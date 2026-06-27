import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { enumerateOmahaStartingHands } from '../../src/hands/omaha.js';
import { StreetHandResultHiLo, StreetAnalysisResultHiLo } from '../../src/simulation/types.js';
import { runWorkerPool } from './worker-pool.js';
import {
  beginAnalysisRun,
  bindPreRunEta,
  finishAnalysisRun,
  updateAnalysisProgress,
} from './analysis-controls.js';
import { HAND_COUNTS } from './eta.js';

const PAGE_KEY = 'omaha-hilo-street';

const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const opponentsInput = document.getElementById('opponents') as HTMLInputElement;
const seedInput = document.getElementById('seed') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const stopBtn = document.getElementById('stop') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const etaText = document.getElementById('etaText')!;
const resultsDiv = document.getElementById('results')!;

const analysisEls = {
  runBtn, stopBtn, progressContainer, progressFill, progressText, etaText,
  paramInputs: [runsInput, opponentsInput, seedInput],
};

let activeController: AbortController | null = null;
let runState = { startTime: 0, handCount: HAND_COUNTS.omaha };

const getParams = () => ({
  runs: parseInt(runsInput.value, 10) || 1000,
  opponents: parseInt(opponentsInput.value, 10) || 1,
});

bindPreRunEta(PAGE_KEY, HAND_COUNTS.omaha, { etaText, paramInputs: analysisEls.paramInputs }, getParams);
stopBtn.addEventListener('click', () => activeController?.abort());

// Sort state
let sortKey = 'flop-scoop';
let sortDir: 'desc' | 'asc' = 'desc';

// Init
async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  fastHashesCreators.low8();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

function buildStreetResult(
  results: StreetHandResultHiLo[],
  runs: number,
  opponents: number,
  seed?: number,
): StreetAnalysisResultHiLo {
  const sorted = [...results];
  sorted.sort((a, b) => b.flop.scoopPct - a.flop.scoopPct);
  return {
    gameType: 'omaha-hi-lo',
    config: { runs, opponents, seed },
    hands: sorted,
    timestamp: new Date().toISOString(),
  };
}

const sortValue = (h: StreetHandResultHiLo, key: string): number => {
  switch (key) {
    case 'flop-hi': return h.flop.winHiPct;
    case 'flop-lo': return h.flop.winLoPct;
    case 'flop-scoop': return h.flop.scoopPct;
    case 'turn-hi': return h.turn.winHiPct;
    case 'turn-lo': return h.turn.winLoPct;
    case 'turn-scoop': return h.turn.scoopPct;
    case 'river-hi': return h.river.winHiPct;
    case 'river-lo': return h.river.winLoPct;
    case 'river-scoop': return h.river.scoopPct;
    default: return h.flop.scoopPct;
  }
};

const SORT_ARROW: Record<string, string> = { desc: ' ▼', asc: ' ▲' };

function renderSummaryTable(result: StreetAnalysisResultHiLo) {
  const indices = result.hands.map((_h, i) => i);
  indices.sort((a, b) => {
    const va = sortValue(result.hands[a]!, sortKey);
    const vb = sortValue(result.hands[b]!, sortKey);
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  let html = '<table><thead><tr>';
  html += '<th>#</th><th>Hand</th>';
  for (const col of [
    { key: 'flop-hi', label: 'Flop Hi%' },
    { key: 'flop-lo', label: 'Flop Lo%' },
    { key: 'flop-scoop', label: 'Flop Scoop%' },
    { key: 'turn-hi', label: 'Turn Hi%' },
    { key: 'turn-lo', label: 'Turn Lo%' },
    { key: 'turn-scoop', label: 'Turn Scoop%' },
    { key: 'river-hi', label: 'River Hi%' },
    { key: 'river-lo', label: 'River Lo%' },
    { key: 'river-scoop', label: 'River Scoop%' },
  ]) {
    const arrow = sortKey === col.key ? SORT_ARROW[sortDir] : '';
    html += `<th class="sortable" data-sort="${col.key}">${col.label}${arrow}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let rank = 0; rank < indices.length; rank++) {
    const i = indices[rank]!;
    const h = result.hands[i]!;

    html += `<tr data-idx="${i}">`;
    html += `<td class="num">${rank + 1}</td>`;
    html += `<td class="hand-cell">${h.hand}</td>`;
    html += `<td class="num">${h.flop.winHiPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.flop.winLoPct.toFixed(1)}%</td>`;
    html += `<td class="num" style="color: #a855f7; font-weight: 600;">${h.flop.scoopPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.turn.winHiPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.turn.winLoPct.toFixed(1)}%</td>`;
    html += `<td class="num" style="color: #a855f7; font-weight: 600;">${h.turn.scoopPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.river.winHiPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.river.winLoPct.toFixed(1)}%</td>`;
    html += `<td class="num" style="color: #a855f7; font-weight: 600;">${h.river.scoopPct.toFixed(1)}%</td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  resultsDiv.innerHTML = html;

  resultsDiv.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = (th as HTMLElement).dataset.sort!;
      if (sortKey === key) {
        sortDir = sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        sortKey = key;
        sortDir = 'desc';
      }
      renderSummaryTable(result);
    });
  });
}

runBtn.addEventListener('click', async () => {
  const runs = Math.max(10, Math.min(100000, parseInt(runsInput.value, 10) || 1000));
  const opponents = Math.max(1, Math.min(9, parseInt(opponentsInput.value, 10) || 1));
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;
  const params = { runs, opponents };

  resultsDiv.innerHTML = '';
  activeController = beginAnalysisRun(analysisEls, 'Run Street Analysis');
  runState = { startTime: performance.now(), handCount: HAND_COUNTS.omaha };

  let cancelled = false;
  let completed = 0;
  let result: StreetAnalysisResultHiLo | null = null;
  try {
    const pool = await runWorkerPool<StreetHandResultHiLo>({
      workerUrl: new URL('./street-omaha-hi-lo-worker.ts', import.meta.url),
      hands: enumerateOmahaStartingHands(),
      postBatch: (worker, batch, _w, seedOffset) => {
        worker.postMessage({ hands: batch, runs, opponents, seed: seedVal, seedOffset });
      },
      signal: activeController.signal,
      onProgress: (c, total) => {
        completed = c;
        updateAnalysisProgress(analysisEls, runState, c, total);
      },
    });
    cancelled = pool.cancelled;
    completed = pool.completed;
    if (pool.results.length > 0) {
      result = buildStreetResult(pool.results, runs, opponents, seedVal);
    }
  } catch {
    cancelled = true;
  }

  finishAnalysisRun(PAGE_KEY, analysisEls, runState, completed, params, cancelled);
  if (result) renderSummaryTable(result);
  activeController = null;
});

init();
