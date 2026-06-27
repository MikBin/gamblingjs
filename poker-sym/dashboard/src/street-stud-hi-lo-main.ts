import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { enumerateStudStartingHands } from '../../src/hands/stud.js';
import { StudHiLoStreetHandResult, StudHiLoStreetStats } from '../../src/simulation/types.js';
import { runWorkerPool } from './worker-pool.js';
import {
  beginAnalysisRun,
  bindPreRunEta,
  finishAnalysisRun,
  updateAnalysisProgress,
} from './analysis-controls.js';
import { HAND_COUNTS } from './eta.js';

const PAGE_KEY = 'stud-hilo-street';

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
const detailOverlay = document.getElementById('detailOverlay')!;
const detailContent = document.getElementById('detailContent')!;
const detailClose = document.getElementById('detailClose')!;

const analysisEls = {
  runBtn, stopBtn, progressContainer, progressFill, progressText, etaText,
  paramInputs: [runsInput, opponentsInput, seedInput],
};

let activeController: AbortController | null = null;
let runState = { startTime: 0, handCount: HAND_COUNTS.stud };
let currentResult: StudHiLoStreetHandResult[] = [];

const getParams = () => ({
  runs: parseInt(runsInput.value, 10) || 1000,
  opponents: parseInt(opponentsInput.value, 10) || 1,
});

bindPreRunEta(PAGE_KEY, HAND_COUNTS.stud, { etaText, paramInputs: analysisEls.paramInputs }, getParams);
stopBtn.addEventListener('click', () => activeController?.abort());

async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  fastHashesCreators.low8();
  initStatus.textContent = '✓ Evaluators ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

function sortResults(results: StudHiLoStreetHandResult[]): StudHiLoStreetHandResult[] {
  const sorted = [...results];
  sorted.sort((a, b) => b.seventh.equity - a.seventh.equity);
  return sorted;
}

let sortKey = 's7-eq';
let sortDir: 'desc' | 'asc' = 'desc';

const sortValue = (h: StudHiLoStreetHandResult, key: string): number => {
  switch (key) {
    case 's5-eq': return h.fifth.equity;
    case 's5-hi': return h.fifth.highWinPct;
    case 's5-lo': return h.fifth.lowWinPct;
    case 's5-sc': return h.fifth.scoopPct;
    case 's6-eq': return h.sixth.equity;
    case 's6-hi': return h.sixth.highWinPct;
    case 's6-lo': return h.sixth.lowWinPct;
    case 's6-sc': return h.sixth.scoopPct;
    case 's7-eq': return h.seventh.equity;
    case 's7-hi': return h.seventh.highWinPct;
    case 's7-lo': return h.seventh.lowWinPct;
    case 's7-sc': return h.seventh.scoopPct;
    default: return h.seventh.equity;
  }
};

const SORT_ARROW: Record<string, string> = { desc: ' ▼', asc: ' ▲' };

function renderSummaryTable(results: StudHiLoStreetHandResult[]) {
  const indices = results.map((_, i) => i);
  indices.sort((a, b) => {
    const va = sortValue(results[a]!, sortKey);
    const vb = sortValue(results[b]!, sortKey);
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  let html = '<table><thead><tr>';
  html += '<th>#</th><th>Hand</th>';
  for (const col of [
    { key: 's5-eq', label: '5th Eq%' },
    { key: 's5-hi', label: '5th Hi%' },
    { key: 's5-lo', label: '5th Lo%' },
    { key: 's5-sc', label: '5th Sc%' },
    { key: 's6-eq', label: '6th Eq%' },
    { key: 's6-hi', label: '6th Hi%' },
    { key: 's6-lo', label: '6th Lo%' },
    { key: 's6-sc', label: '6th Sc%' },
    { key: 's7-eq', label: '7th Eq%' },
    { key: 's7-hi', label: '7th Hi%' },
    { key: 's7-lo', label: '7th Lo%' },
    { key: 's7-sc', label: '7th Sc%' },
  ]) {
    const arrow = sortKey === col.key ? SORT_ARROW[sortDir] : '';
    html += `<th class="sortable" data-sort="${col.key}">${col.label}${arrow}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let rank = 0; rank < indices.length; rank++) {
    const i = indices[rank]!;
    const h = results[i]!;

    html += `<tr data-idx="${i}">`;
    html += `<td class="num">${rank + 1}</td>`;
    html += `<td class="hand-cell">${h.hand}</td>`;
    html += `<td class="num">${h.fifth.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.fifth.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.fifth.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.fifth.scoopPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.sixth.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.sixth.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.sixth.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.sixth.scoopPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.seventh.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.seventh.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.seventh.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.seventh.scoopPct.toFixed(1)}%</td>`;
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
      renderSummaryTable(results);
    });
  });

  resultsDiv.querySelectorAll('tr[data-idx]').forEach((tr) => {
    tr.addEventListener('click', () => {
      const idx = parseInt((tr as HTMLElement).dataset.idx!, 10);
      showDetail(idx);
    });
  });
}

function renderCategoryBars(stats: StudHiLoStreetStats): string {
  let html = '<div class="cat-bars">';
  const metrics = [
    { name: 'Equity', pct: stats.equity, cls: 'cat-fill-equity' },
    { name: 'High Win', pct: stats.highWinPct, cls: 'cat-fill-high' },
    { name: 'Low Win', pct: stats.lowWinPct, cls: 'cat-fill-low' },
    { name: 'Scoop', pct: stats.scoopPct, cls: 'cat-fill-scoop' },
  ];

  for (const m of metrics) {
    if (m.pct > 0.1) {
      html += `<div class="cat-row">`;
      html += `<span class="cat-name">${m.name}</span>`;
      html += `<div class="cat-bar-bg"><div class="cat-bar-fill ${m.cls}" style="width:${Math.max(m.pct, 0.5)}%"></div></div>`;
      html += `<span class="cat-pct">${m.pct.toFixed(1)}%</span>`;
      html += '</div>';
    }
  }

  html += '</div>';
  return html;
}

function showDetail(idx: number) {
  if (!currentResult.length) return;
  const h = currentResult[idx]!;

  let html = `<div class="detail-hand">${idx + 1}. ${h.hand}</div>`;

  for (const [cssClass, title, stats] of [
    ['s5-title', '5TH STREET', h.fifth],
    ['s6-title', '6TH STREET', h.sixth],
    ['s7-title', '7TH STREET', h.seventh],
  ] as const) {
    html += `<div class="street-section">`;
    html += `<div class="street-title ${cssClass}">${title}</div>`;
    html += `<div class="stat-row">`;
    html += `<span><span class="stat-label">Low Qual:</span> <span class="stat-value">${stats.lowQualifyPct.toFixed(1)}%</span></span>`;
    html += `</div>`;
    html += renderCategoryBars(stats);
    html += '</div>';
  }

  detailContent.innerHTML = html;
  detailOverlay.classList.add('active');
}

detailClose.addEventListener('click', () => {
  detailOverlay.classList.remove('active');
});
detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) {
    detailOverlay.classList.remove('active');
  }
});

runBtn.addEventListener('click', async () => {
  const runs = Math.max(100, Math.min(100000, parseInt(runsInput.value, 10) || 1000));
  const opps = Math.max(1, Math.min(6, parseInt(opponentsInput.value, 10) || 1));
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;
  const params = { runs, opponents: opps };

  resultsDiv.innerHTML = '';
  activeController = beginAnalysisRun(analysisEls, 'Run Street Analysis');
  runState = { startTime: performance.now(), handCount: HAND_COUNTS.stud };

  let cancelled = false;
  let completed = 0;
  try {
    const pool = await runWorkerPool<StudHiLoStreetHandResult>({
      workerUrl: new URL('./street-stud-hi-lo-worker.ts', import.meta.url),
      hands: enumerateStudStartingHands(),
      postBatch: (worker, batch, _w, seedOffset) => {
        worker.postMessage({ hands: batch, runs, opponents: opps, seed: seedVal, seedOffset });
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
      currentResult = sortResults(pool.results);
      renderSummaryTable(currentResult);
    }
  } catch {
    cancelled = true;
  }

  finishAnalysisRun(
    PAGE_KEY,
    analysisEls,
    runState,
    completed,
    params,
    cancelled,
    'Click any hand for details',
  );
  activeController = null;
});

init();
