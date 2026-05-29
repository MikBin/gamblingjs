import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { enumerateHoldemStartingHands } from '../../src/hands/holdem.js';
import { simulateHand } from '../../src/simulation/montecarlo.js';
import { SimulationConfig, SimulationResult } from '../../src/simulation/types.js';
import { TIERS, assignTiers } from '../../src/ranking/tiers.js';

// DOM elements
const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const opponentsInput = document.getElementById('opponents') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const resultsDiv = document.getElementById('results')!;

// Initialize hash tables
async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  initStatus.textContent = '✓ Evaluator ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

// Run simulation in chunks to keep UI responsive
function runSimulation(config: SimulationConfig): Promise<SimulationResult> {
  return new Promise((resolve) => {
    const evaluator = new HighEvaluator();
    const evalFn = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

    const hands = enumerateHoldemStartingHands();
    const results: SimulationResult['hands'] = [];
    let i = 0;
    const chunkSize = 5;

    function processChunk() {
      const end = Math.min(i + chunkSize, hands.length);
      for (; i < end; i++) {
        const hand = hands[i]!;
        const result = simulateHand(hand, config, evalFn);
        results.push(result);
      }

      const pct = (i / hands.length) * 100;
      progressFill.style.width = pct + '%';
      progressText.textContent = i + '/' + hands.length + ' hands (' + pct.toFixed(0) + '%)';

      if (i < hands.length) {
        setTimeout(processChunk, 0);
      } else {
        if (config.opponents > 0) {
          results.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
        } else {
          results.sort((a, b) => b.averageRank - a.averageRank);
        }
        resolve({
          gameType: 'texas-holdem',
          config,
          hands: results,
          timestamp: new Date().toISOString(),
        });
      }
    }

    processChunk();
  });
}

// Render results table
function renderResults(result: SimulationResult) {
  const { hands, config } = result;
  const hasOpponents = config.opponents > 0;
  const tiered = assignTiers(hands);

  let html = '<table><thead><tr>';
  html += '<th>#</th><th>Hand</th><th>Tier</th>';
  if (hasOpponents) {
    html += '<th>Win%</th><th>Tie%</th>';
  }
  html += '<th>Avg Rank</th></tr></thead><tbody>';

  for (const h of tiered) {
    const tierNum = h.tier + 1;
    const tierName = TIERS[h.tier]!.name;

    html += '<tr class="tier-' + tierNum + '">';
    html += '<td>' + h.rank + '</td>';
    html += '<td class="hand-cell">' + h.key + '</td>';
    html += '<td><span class="tier-badge tier-badge-' + tierNum + '">' + tierName + '</span></td>';
    if (hasOpponents) {
      html += '<td>' + h.winPct.toFixed(2) + '%</td>';
      html += '<td>' + h.tiePct.toFixed(2) + '%</td>';
    }
    html += '<td>' + h.averageRank.toFixed(1) + '</td>';
    html += '</tr>';
  }

  html += '</tbody></table>';
  resultsDiv.innerHTML = html;
}

// Event handler
runBtn.addEventListener('click', async () => {
  const runs = parseInt(runsInput.value, 10) || 10000;
  const opponents = parseInt(opponentsInput.value, 10) || 0;

  const config: SimulationConfig = {
    runs: Math.max(100, Math.min(100000, runs)),
    opponents: Math.max(0, Math.min(9, opponents)),
    useCache: true,
  };

  runBtn.disabled = true;
  runBtn.textContent = 'Running...';
  progressContainer.classList.add('active');
  progressFill.style.width = '0%';
  progressText.textContent = 'Starting...';
  resultsDiv.innerHTML = '';

  const startTime = performance.now();
  const result = await runSimulation(config);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  progressFill.style.width = '100%';
  progressText.textContent = '✓ Completed in ' + elapsed + 's';

  renderResults(result);

  runBtn.disabled = false;
  runBtn.textContent = 'Run Simulation';
});

init();