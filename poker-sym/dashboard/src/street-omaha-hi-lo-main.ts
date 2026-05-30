import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { enumerateOmahaStartingHands } from '../../src/hands/omaha.js';
import { analyzeOmahaHiLoHandStreets } from '../../src/simulation/street-analysis-omaha-hilo.js';
import { StreetHandResultHiLo, StreetAnalysisResultHiLo } from '../../src/simulation/types.js';

// DOM
const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const opponentsInput = document.getElementById('opponents') as HTMLInputElement;
const seedInput = document.getElementById('seed') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const resultsDiv = document.getElementById('results')!;

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

// Run simulation in chunks
function runStreetSimulation(runs: number, opponents: number, seed?: number): Promise<StreetAnalysisResultHiLo> {
  return new Promise((resolve) => {
    const hands = enumerateOmahaStartingHands();
    const results: StreetHandResultHiLo[] = [];
    let i = 0;
    const chunkSize = 3; // Keep small to not freeze the UI too long

    function processChunk() {
      const end = Math.min(i + chunkSize, hands.length);
      for (; i < end; i++) {
        const hand = hands[i]!;
        const handSeed = seed != null ? seed + i : undefined;
        const result = analyzeOmahaHiLoHandStreets(hand, runs, opponents, handSeed);
        results.push(result);
      }

      const pct = (i / hands.length) * 100;
      progressFill.style.width = pct + '%';
      progressText.textContent = i + '/' + hands.length + ' hands (' + pct.toFixed(0) + '%)';

      if (i < hands.length) {
        setTimeout(processChunk, 0);
      } else {
        results.sort((a, b) => b.flop.scoopPct - a.flop.scoopPct); // Default sort
        resolve({
          gameType: 'omaha-hi-lo',
          config: { runs, opponents, seed },
          hands: results,
          timestamp: new Date().toISOString(),
        });
      }
    }

    processChunk();
  });
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
  const runs = parseInt(runsInput.value, 10) || 1000;
  const opponents = parseInt(opponentsInput.value, 10) || 1;
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;

  runBtn.disabled = true;
  runBtn.textContent = 'Running...';
  progressContainer.classList.add('active');
  progressFill.style.width = '0%';
  progressText.textContent = 'Starting...';
  resultsDiv.innerHTML = '';

  const startTime = performance.now();
  const result = await runStreetSimulation(
    Math.max(10, Math.min(100000, runs)),
    Math.max(1, Math.min(9, opponents)),
    seedVal
  );
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  progressFill.style.width = '100%';
  progressText.textContent = '✓ Completed in ' + elapsed + 's';

  renderSummaryTable(result);

  runBtn.disabled = false;
  runBtn.textContent = 'Run Street Analysis';
});

init();
