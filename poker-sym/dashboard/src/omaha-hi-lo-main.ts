import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { enumerateOmahaStartingHands } from '@poker-sym/hands/omaha.js';
import { SimulationConfig, SimulationResult, HandStrengthResult } from '@poker-sym/simulation/types.js';
import { TIERS, assignTiers } from '@poker-sym/ranking/tiers.js';
import { makeSortable } from './sortable-table.js';
import { runWorkerPool } from './worker-pool.js';
import {
  beginAnalysisRun,
  bindPreRunEta,
  finishAnalysisRun,
  updateAnalysisProgress,
} from './analysis-controls.js';
import { HAND_COUNTS } from './eta.js';

const PAGE_KEY = 'omaha-hilo-preflop';

const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const opponentsInput = document.getElementById('opponents') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const stopBtn = document.getElementById('stop') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const etaText = document.getElementById('etaText')!;
const resultsDiv = document.getElementById('results')!;

const analysisEls = {
  runBtn, stopBtn, progressContainer, progressFill, progressText, etaText,
  paramInputs: [runsInput, opponentsInput],
};

let activeController: AbortController | null = null;
let runState = { startTime: 0, handCount: HAND_COUNTS.omaha };

const getParams = () => ({
  runs: parseInt(runsInput.value, 10) || 1000,
  opponents: parseInt(opponentsInput.value, 10) || 0,
});

async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

bindPreRunEta(PAGE_KEY, HAND_COUNTS.omaha, { etaText, paramInputs: analysisEls.paramInputs }, getParams);
stopBtn.addEventListener('click', () => activeController?.abort());

function sortResults(hands: HandStrengthResult[], config: SimulationConfig): HandStrengthResult[] {
  const sorted = [...hands];
  if (config.opponents > 0) {
    sorted.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    sorted.sort((a, b) => b.averageRank - a.averageRank);
  }
  return sorted;
}

function renderResults(result: SimulationResult) {
  const { hands, config } = result;
  const hasOpponents = config.opponents > 0;
  const tiered = assignTiers(hands);

  let html = '<table><thead><tr>';
  html += '<th class="sortable">#<span class="sort-indicator"> ↕</span></th>';
  html += '<th>Hand</th><th>Tier</th>';
  if (hasOpponents) {
    html += '<th class="sortable">Win Hi%<span class="sort-indicator"> ↕</span></th>';
    html += '<th class="sortable">Win Lo%<span class="sort-indicator"> ↕</span></th>';
    html += '<th class="sortable">Scoop%<span class="sort-indicator"> ↕</span></th>';
  }
  html += '<th class="sortable">Hi Avg Rank<span class="sort-indicator"> ↕</span></th>';
  html += '<th class="sortable">Lo Avg Rank<span class="sort-indicator"> ↕</span></th>';
  html += '</tr></thead><tbody>';

  for (const h of tiered) {
    const tierNum = h.tier + 1;
    const tierName = TIERS[h.tier]!.name;
    const winHi = h.winHiPct ?? h.winPct;
    const winLo = h.winLoPct ?? 0;
    const scoop = h.scoopPct ?? 0;
    const loAvgRank = h.averageLowRank;

    html += '<tr class="tier-' + tierNum + '">';
    html += '<td data-value="' + h.rank + '">' + h.rank + '</td>';
    html += '<td class="hand-cell">' + h.key + '</td>';
    html += '<td><span class="tier-badge tier-badge-' + tierNum + '">' + tierName + '</span></td>';
    if (hasOpponents) {
      html += '<td data-value="' + winHi + '">' + winHi.toFixed(2) + '%</td>';
      html += '<td data-value="' + winLo + '">' + winLo.toFixed(2) + '%</td>';
      html += '<td data-value="' + scoop + '">' + scoop.toFixed(2) + '%</td>';
    }
    html += '<td data-value="' + h.averageRank + '">' + h.averageRank.toFixed(1) + '</td>';
    html += '<td' + (loAvgRank != null ? ' data-value="' + loAvgRank + '"' : '') + '>' + (loAvgRank != null ? loAvgRank.toFixed(1) : '—') + '</td>';
    html += '</tr>';
  }

  html += '</tbody></table>';
  resultsDiv.innerHTML = html;
  const table = resultsDiv.querySelector('table');
  if (table) makeSortable(table);
}

runBtn.addEventListener('click', async () => {
  const params = getParams();
  const config: SimulationConfig = {
    runs: Math.max(100, Math.min(100000, params.runs)),
    opponents: Math.max(0, Math.min(9, params.opponents)),
    useCache: true,
  };

  resultsDiv.innerHTML = '';
  activeController = beginAnalysisRun(analysisEls, 'Run Simulation');
  runState = { startTime: performance.now(), handCount: HAND_COUNTS.omaha };

  let cancelled = false;
  let completed = 0;
  try {
    const pool = await runWorkerPool<HandStrengthResult>({
      workerUrl: new URL('./omaha-hi-lo-worker.ts', import.meta.url),
      hands: enumerateOmahaStartingHands(),
      postBatch: (worker, batch, _w, seedOffset) => {
        worker.postMessage({ hands: batch, config, seedOffset });
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
      renderResults({
        gameType: 'omaha-hi-lo',
        config,
        hands: sortResults(pool.results, config),
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    cancelled = true;
  }

  finishAnalysisRun(PAGE_KEY, analysisEls, runState, completed, config, cancelled);
  activeController = null;
});

init();
