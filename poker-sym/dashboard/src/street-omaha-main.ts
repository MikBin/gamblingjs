import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { enumerateOmahaStartingHands } from '../../src/hands/omaha.js';
import { StreetHandResult, StreetAnalysisResult, HAND_CATEGORY_NAMES } from '../../src/simulation/types.js';
import { runWorkerPool } from './worker-pool.js';
import {
  beginAnalysisRun,
  bindPreRunEta,
  finishAnalysisRun,
  updateAnalysisProgress,
} from './analysis-controls.js';
import { HAND_COUNTS } from './eta.js';

const PAGE_KEY = 'omaha-street';

// DOM
const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
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
  paramInputs: [runsInput, seedInput],
};

let activeController: AbortController | null = null;
let runState = { startTime: 0, handCount: HAND_COUNTS.omaha };
let currentResult: StreetAnalysisResult | null = null;

const getParams = () => ({
  runs: parseInt(runsInput.value, 10) || 1000,
  opponents: 0,
});

bindPreRunEta(PAGE_KEY, HAND_COUNTS.omaha, { etaText, paramInputs: analysisEls.paramInputs }, getParams);
stopBtn.addEventListener('click', () => activeController?.abort());

function buildStreetResult(
  results: StreetHandResult[],
  runs: number,
  seed?: number,
): StreetAnalysisResult {
  const sorted = [...results];
  sorted.sort((a, b) => b.river.averageRank - a.river.averageRank);
  return {
    gameType: 'omaha-hi',
    config: { runs, opponents: 0, seed },
    hands: sorted,
    timestamp: new Date().toISOString(),
  };
}

// Find dominant category
const dominantCat = (stats: any): { name: string; pct: number } => {
  let best = 'high card';
  let bestPct = 0;
  for (const cat of HAND_CATEGORY_NAMES) {
    const pct = stats.categories[cat] || 0;
    if (pct > bestPct) {
      bestPct = pct;
      best = cat;
    }
  }
  return { name: best, pct: bestPct };
};

// Sort state
let sortKey = 'river-avg';
let sortDir: 'desc' | 'asc' = 'desc';

/** Extract numeric sort value from a hand result for a given sort key. */
const sortValue = (h: StreetHandResult, key: string): number => {
  switch (key) {
    case 'flop-avg':
      return h.flop.averageRank;
    case 'flop-top':
      return dominantCat(h.flop).pct;
    case 'flop-hit':
      return h.flop.realization.playabilityScore;
    case 'turn-avg':
      return h.turn.averageRank;
    case 'turn-top':
      return dominantCat(h.turn).pct;
    case 'turn-hit':
      return h.turn.realization.playabilityScore;
    case 'river-avg':
      return h.river.averageRank;
    case 'river-top':
      return dominantCat(h.river).pct;
    case 'river-hit':
      return h.river.realization.playabilityScore;
    default:
      return h.river.averageRank;
  }
};

const SORT_ARROW: Record<string, string> = { desc: ' ▼', asc: ' ▲' };

// Render summary table
function renderSummaryTable(result: StreetAnalysisResult) {
  // Build sorted index array
  const indices = result.hands.map((_h, i) => i);
  indices.sort((a, b) => {
    const va = sortValue(result.hands[a]!, sortKey);
    const vb = sortValue(result.hands[b]!, sortKey);
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  let html = '<table><thead><tr>';
  html += '<th>#</th><th>Hand</th>';
  for (const col of [
    { key: 'flop-avg', label: 'Flop Avg', sortable: true },
    { key: 'flop-hit', label: 'Flop Hit%', sortable: false },
    { key: 'turn-avg', label: 'Turn Avg', sortable: true },
    { key: 'turn-hit', label: 'Turn Hit%', sortable: false },
    { key: 'river-avg', label: 'River Avg', sortable: true },
    { key: 'river-hit', label: 'River Hit%', sortable: false },
  ]) {
    if (col.sortable) {
      const arrow = sortKey === col.key ? SORT_ARROW[sortDir] : '';
      html += `<th class="sortable" data-sort="${col.key}">${col.label}${arrow}</th>`;
    } else {
      html += `<th>${col.label}</th>`;
    }
  }
  html += '</tr></thead><tbody>';

  for (let rank = 0; rank < indices.length; rank++) {
    const i = indices[rank]!;
    const h = result.hands[i]!;

    html += `<tr data-idx="${i}">`;
    html += `<td class="num">${rank + 1}</td>`;
    html += `<td class="hand-cell">${h.hand}</td>`;
    html += `<td class="num">${h.flop.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.flop.realization.playabilityScore.toFixed(0)}%</td>`;
    html += `<td class="num">${h.turn.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.turn.realization.playabilityScore.toFixed(0)}%</td>`;
    html += `<td class="num">${h.river.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.river.realization.playabilityScore.toFixed(0)}%</td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  resultsDiv.innerHTML = html;

  // Add sort handlers on headers
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

  // Add click handlers for detail view
  resultsDiv.querySelectorAll('tr[data-idx]').forEach((tr) => {
    tr.addEventListener('click', () => {
      const idx = parseInt((tr as HTMLElement).dataset.idx!, 10);
      showDetail(idx);
    });
  });
}

// Render category bars for a street
const catBarClass = (cat: string): string => `cat-fill-${cat.replace(/ /g, '-')}`;

function renderCategoryBars(stats: any): string {
  let html = '<div class="cat-bars">';
  for (const cat of HAND_CATEGORY_NAMES) {
    const pct = stats.categories[cat] || 0;
    if (pct > 0.1) {
      html += `<div class="cat-row">`;
      html += `<span class="cat-name">${cat}</span>`;
      html += `<div class="cat-bar-bg"><div class="cat-bar-fill ${catBarClass(cat)}" style="width:${Math.max(pct, 0.5)}%"></div></div>`;
      html += `<span class="cat-pct">${pct.toFixed(1)}%</span>`;
      html += '</div>';
    }
  }
  html += '</div>';
  return html;
}

// Show detail panel for a specific hand
function showDetail(idx: number) {
  if (!currentResult) return;
  const h = currentResult.hands[idx]!;

  let html = `<div class="detail-hand">${idx + 1}. ${h.hand}</div>`;

  for (const [street, cssClass] of [
    ['flop', 'flop-title'],
    ['turn', 'turn-title'],
    ['river', 'river-title'],
  ] as const) {
    const stats = h[street];
    const dom = dominantCat(stats);

    html += `<div class="street-section">`;
    html += `<div class="street-title ${cssClass}">${street.toUpperCase()}</div>`;

    html += `<div class="stat-row">`;
    html += `<span><span class="stat-label">Avg Rank:</span> <span class="stat-value">${stats.averageRank.toFixed(1)}</span></span>`;
    html += `<span><span class="stat-label">σ:</span> <span class="stat-value">${stats.distribution.stdDev.toFixed(1)}</span></span>`;
    html += `<span><span class="stat-label">P50:</span> <span class="stat-value">${stats.distribution.percentiles.p50.toFixed(0)}</span></span>`;
    html += `<span><span class="stat-label">Top:</span> <span class="stat-value">${dom.name} ${dom.pct.toFixed(1)}%</span></span>`;
    html += `</div>`;

    // Category bars
    html += renderCategoryBars(stats);

    // Realization chips
    html += `<div class="realization-row">`;
    html += `<div class="realization-chip"><span class="label">Improve:</span><span class="value">${stats.realization.improvementRate.toFixed(1)}%</span></div>`;
    html += `<div class="realization-chip"><span class="label">Nuts:</span><span class="value">${stats.realization.nutPercentage.toFixed(1)}%</span></div>`;
    html += `<div class="realization-chip"><span class="label">Hit%:</span><span class="value">${stats.realization.playabilityScore.toFixed(1)}%</span></div>`;
    if (stats.realization.drawConversionRate > 0) {
      html += `<div class="realization-chip"><span class="label">Draw→:</span><span class="value">${stats.realization.drawConversionRate.toFixed(1)}%</span></div>`;
    }
    html += `</div>`;

    // Texture breakdown
    if (stats.textureEquity.length > 0) {
      html += `<div class="texture-grid">`;
      for (const tex of stats.textureEquity) {
        html += `<div class="texture-card"><span class="texture-name">${tex.texture}</span> <span class="texture-stat">×${tex.count} avg=${tex.averageRank.toFixed(0)}</span></div>`;
      }
      html += `</div>`;
    }

    html += '</div>';
  }

  detailContent.innerHTML = html;
  detailOverlay.classList.add('active');
}

// Close detail
detailClose.addEventListener('click', () => {
  detailOverlay.classList.remove('active');
});
detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) {
    detailOverlay.classList.remove('active');
  }
});

// Run button
runBtn.addEventListener('click', async () => {
  const runs = Math.max(100, Math.min(100000, parseInt(runsInput.value, 10) || 1000));
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;
  const params = { runs, opponents: 0 };

  resultsDiv.innerHTML = '';
  activeController = beginAnalysisRun(analysisEls, 'Run Street Analysis');
  runState = { startTime: performance.now(), handCount: HAND_COUNTS.omaha };

  let cancelled = false;
  let completed = 0;
  let result: StreetAnalysisResult | null = null;
  try {
    const pool = await runWorkerPool<StreetHandResult>({
      workerUrl: new URL('./street-omaha-worker.ts', import.meta.url),
      hands: enumerateOmahaStartingHands(),
      postBatch: (worker, batch, _w, seedOffset) => {
        worker.postMessage({ hands: batch, runs, seed: seedVal, seedOffset });
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
      result = buildStreetResult(pool.results, runs, seedVal);
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
  if (result) {
    currentResult = result;
    renderSummaryTable(result);
  }
  activeController = null;
});

async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

init();
