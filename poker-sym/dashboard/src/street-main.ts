import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { enumerateHoldemStartingHands } from '../../src/hands/holdem.js';
import { analyzeHandStreets, FiveCardEvalFn, SevenCardEvalFn } from '../../src/simulation/street-analysis.js';
import { StreetHandResult, StreetAnalysisResult, HAND_CATEGORY_NAMES } from '../../src/simulation/types.js';

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

let currentResult: StreetAnalysisResult | null = null;

// Init
async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

// Run simulation in chunks
function runStreetSimulation(runs: number, seed?: number): Promise<StreetAnalysisResult> {
  return new Promise((resolve) => {
    const evaluator = new HighEvaluator();
    const evalFn7: SevenCardEvalFn = (c1, c2, c3, c4, c5, c6, c7) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);
    const evalFn5: FiveCardEvalFn = handOfFiveEvalIndexed;

    const hands = enumerateHoldemStartingHands();
    const results: StreetHandResult[] = [];
    let i = 0;
    const chunkSize = 3;

    function processChunk() {
      const end = Math.min(i + chunkSize, hands.length);
      for (; i < end; i++) {
        const hand = hands[i]!;
        const handSeed = seed != null ? seed + i : undefined;
        const result = analyzeHandStreets(hand, runs, evalFn5, evalFn7, handSeed);
        results.push(result);
      }

      const pct = (i / hands.length) * 100;
      progressFill.style.width = pct + '%';
      progressText.textContent = i + '/' + hands.length + ' hands (' + pct.toFixed(0) + '%)';

      if (i < hands.length) {
        setTimeout(processChunk, 0);
      } else {
        results.sort((a, b) => b.river.averageRank - a.river.averageRank);
        resolve({
          gameType: 'texas-holdem',
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
const dominantCat = (stats: { categories: Record<string, number> }): { name: string; pct: number } => {
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

const SORT_KEYS = ['flop-avg', 'turn-avg', 'river-avg'];
const SORT_LABELS: Record<string, string> = {
  'flop-avg': 'Flop Avg',
  'turn-avg': 'Turn Avg',
  'river-avg': 'River Avg',
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
    { key: 'flop-top', label: 'Flop Top', sortable: false },
    { key: 'flop-hit', label: 'Flop Hit%', sortable: false },
    { key: 'turn-avg', label: 'Turn Avg', sortable: true },
    { key: 'turn-top', label: 'Turn Top', sortable: false },
    { key: 'turn-hit', label: 'Turn Hit%', sortable: false },
    { key: 'river-avg', label: 'River Avg', sortable: true },
    { key: 'river-top', label: 'River Top', sortable: false },
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
    const flopDom = dominantCat(h.flop);
    const turnDom = dominantCat(h.turn);
    const riverDom = dominantCat(h.river);

    html += `<tr data-idx="${i}">`;
    html += `<td class="num">${rank + 1}</td>`;
    html += `<td class="hand-cell">${h.hand}</td>`;
    html += `<td class="num">${h.flop.averageRank.toFixed(0)}</td>`;
    html += `<td>${flopDom.name} ${flopDom.pct.toFixed(0)}%</td>`;
    html += `<td class="num">${h.flop.realization.playabilityScore.toFixed(0)}%</td>`;
    html += `<td class="num">${h.turn.averageRank.toFixed(0)}</td>`;
    html += `<td>${turnDom.name} ${turnDom.pct.toFixed(0)}%</td>`;
    html += `<td class="num">${h.turn.realization.playabilityScore.toFixed(0)}%</td>`;
    html += `<td class="num">${h.river.averageRank.toFixed(0)}</td>`;
    html += `<td>${riverDom.name} ${riverDom.pct.toFixed(0)}%</td>`;
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

function renderCategoryBars(stats: { categories: Record<string, number> }): string {
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