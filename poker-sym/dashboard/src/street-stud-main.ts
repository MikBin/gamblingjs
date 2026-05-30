import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { enumerateStudStartingHands } from '../../src/hands/stud.js';
import { analyzeStudHandStreets, StudStreetHandResult, StudStreetAnalysisResult } from '../../src/simulation/stud-street-analysis.js';
import { FiveCardEvalFn, SevenCardEvalFn } from '../../src/simulation/street-analysis.js';
import { HAND_CATEGORY_NAMES } from '../../src/simulation/types.js';

// DOM
const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const seedInput = document.getElementById('seed') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const resultsDiv = document.getElementById('results')!;
const detailOverlay = document.getElementById('detailOverlay')!;
const detailContent = document.getElementById('detailContent')!;
const detailClose = document.getElementById('detailClose')!;

let currentResult: StudStreetAnalysisResult | null = null;

// Init
async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

// Run simulation in chunks
function runStreetSimulation(runs: number, seed?: number): Promise<StudStreetAnalysisResult> {
  return new Promise((resolve) => {
    const evaluator = new HighEvaluator();
    const evalFn7: SevenCardEvalFn = (c1, c2, c3, c4, c5, c6, c7) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);
    const evalFn5: FiveCardEvalFn = handOfFiveEvalIndexed;

    const hands = enumerateStudStartingHands();
    const results: StudStreetHandResult[] = [];
    let i = 0;
    const chunkSize = 3;

    function processChunk() {
      const end = Math.min(i + chunkSize, hands.length);
      for (; i < end; i++) {
        const hand = hands[i]!;
        const handSeed = seed != null ? seed + i : undefined;
        const result = analyzeStudHandStreets(hand, runs, evalFn5, evalFn7, handSeed);
        results.push(result);
      }

      const pct = (i / hands.length) * 100;
      progressFill.style.width = pct + '%';
      progressText.textContent = i + '/' + hands.length + ' hands (' + pct.toFixed(0) + '%)';

      if (i < hands.length) {
        setTimeout(processChunk, 0);
      } else {
        results.sort((a, b) => b.seventh.averageRank - a.seventh.averageRank);
        resolve({
          gameType: '7card-stud',
          config: { runs, opponents: 0, seed },
          hands: results,
          timestamp: new Date().toISOString(),
        });
      }
    }

    processChunk();
  });
}

// Find dominant category
const dominantCat = (stats: { categories: any }): { name: string; pct: number } => {
  let best = 'high card';
  let bestPct = 0;
  for (const cat of HAND_CATEGORY_NAMES) {
    const pct = stats.categories[cat];
    if (pct > bestPct) {
      bestPct = pct;
      best = cat;
    }
  }
  return { name: best, pct: bestPct };
};

// Sort state
let sortKey = 'seventh-avg';
let sortDir: 'desc' | 'asc' = 'desc';

/** Extract numeric sort value from a hand result for a given sort key. */
const sortValue = (h: StudStreetHandResult, key: string): number => {
  switch (key) {
    case 'third-avg': return h.third.averageRank;
    case 'third-hit': return h.third.realization.playabilityScore;
    case 'fourth-avg': return h.fourth.averageRank;
    case 'fourth-hit': return h.fourth.realization.playabilityScore;
    case 'fifth-avg': return h.fifth.averageRank;
    case 'fifth-hit': return h.fifth.realization.playabilityScore;
    case 'sixth-avg': return h.sixth.averageRank;
    case 'sixth-hit': return h.sixth.realization.playabilityScore;
    case 'seventh-avg': return h.seventh.averageRank;
    case 'seventh-hit': return h.seventh.realization.playabilityScore;
    default: return h.seventh.averageRank;
  }
};

const SORT_ARROW: Record<string, string> = { desc: ' ▼', asc: ' ▲' };

// Render summary table
function renderSummaryTable(result: StudStreetAnalysisResult) {
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
    { key: 'third-avg', label: '3rd Avg', sortable: true },
    { key: 'fourth-avg', label: '4th Avg', sortable: true },
    { key: 'fifth-avg', label: '5th Avg', sortable: true },
    { key: 'sixth-avg', label: '6th Avg', sortable: true },
    { key: 'seventh-avg', label: '7th Avg', sortable: true },
    { key: 'seventh-hit', label: '7th Hit%', sortable: false },
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
    html += `<td class="num">${h.third.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.fourth.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.fifth.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.sixth.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.seventh.averageRank.toFixed(0)}</td>`;
    html += `<td class="num">${h.seventh.realization.playabilityScore.toFixed(0)}%</td>`;
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

function renderCategoryBars(stats: { categories: any }): string {
  let html = '<div class="cat-bars">';
  for (const cat of HAND_CATEGORY_NAMES) {
    const pct = stats.categories[cat];
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

  for (const [street, title, cssClass] of [
    ['third', 'Third Street', 'flop-title'],
    ['fourth', 'Fourth Street', 'flop-title'],
    ['fifth', 'Fifth Street', 'turn-title'],
    ['sixth', 'Sixth Street', 'turn-title'],
    ['seventh', 'Seventh Street', 'river-title'],
  ] as const) {
    const stats = h[street];
    const dom = dominantCat(stats);

    html += `<div class="street-section">`;
    html += `<div class="street-title ${cssClass}">${title.toUpperCase()}</div>`;

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
  const runs = parseInt(runsInput.value, 10) || 5000;
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;

  runBtn.disabled = true;
  runBtn.textContent = 'Running...';
  progressContainer.classList.add('active');
  progressFill.style.width = '0%';
  progressText.textContent = 'Starting...';
  resultsDiv.innerHTML = '';

  const startTime = performance.now();
  const result = await runStreetSimulation(
    Math.max(100, Math.min(100000, runs)),
    seedVal,
  );
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  progressFill.style.width = '100%';
  progressText.textContent = '✓ Completed in ' + elapsed + 's — Click any hand for details';

  currentResult = result;
  renderSummaryTable(result);

  runBtn.disabled = false;
  runBtn.textContent = 'Run Street Analysis';
});

init();
