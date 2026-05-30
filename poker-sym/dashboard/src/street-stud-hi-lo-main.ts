import { fastHashesCreators } from '../../../src/pokerHashes7.js';
import { handOfFiveEvalHiLow8Indexed } from '../../../src/pokerEvaluator5.js';
import { handOfSixEvalHiLow8Indexed } from '../../../src/pokerEvaluator6.js';
import { handOfSevenEvalHiLow8Indexed } from '../../../src/pokerEvaluator7.js';
import { enumerateStudStartingHands } from '../../src/hands/stud.js';
import { SeedableRNG } from '../../src/utils/rng.js';
import { makeDeck } from '../../src/utils/deck.js';

// DOM Elements
const initStatus = document.getElementById('initStatus')!;
const runsInput = document.getElementById('runs') as HTMLInputElement;
const opponentsInput = document.getElementById('opponents') as HTMLInputElement;
const seedInput = document.getElementById('seed') as HTMLInputElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const progressContainer = document.getElementById('progressContainer')!;
const progressFill = document.getElementById('progressFill')!;
const progressText = document.getElementById('progressText')!;
const resultsDiv = document.getElementById('results')!;
const detailOverlay = document.getElementById('detailOverlay')!;
const detailContent = document.getElementById('detailContent')!;
const detailClose = document.getElementById('detailClose')!;

// Types
interface StreetStatsHiLo {
  equity: number;
  highWinPct: number;
  lowWinPct: number;
  scoopPct: number;
  winHighTotal: number;
  lowQualifyPct: number;
}

interface StudHiLoStreetHandResult {
  hand: string;
  s5: StreetStatsHiLo;
  s6: StreetStatsHiLo;
  s7: StreetStatsHiLo;
}

let currentResult: StudHiLoStreetHandResult[] = [];

// Init hashes
async function init() {
  await new Promise((r) => setTimeout(r, 50));
  fastHashesCreators.high();
  fastHashesCreators.low8();
  initStatus.textContent = '✓ Evaluators ready';
  initStatus.classList.add('ready');
  runBtn.disabled = false;
}

function evaluateStreet(
  heroCards: number[],
  opponentsCards: number[][],
  streetCardsCount: number
): { highWinShare: number, lowWinShare: number, scoop: number, lowQualifies: boolean, equity: number } {
  const evalFn = streetCardsCount === 5 ? handOfFiveEvalHiLow8Indexed :
                 streetCardsCount === 6 ? handOfSixEvalHiLow8Indexed :
                 handOfSevenEvalHiLow8Indexed;

  const heroResult = evalFn(
    heroCards[0]!, heroCards[1]!, heroCards[2]!, heroCards[3]!, heroCards[4]!,
    streetCardsCount >= 6 ? heroCards[5]! : 0,
    streetCardsCount >= 7 ? heroCards[6]! : 0
  );

  let bestOppHigh = -1;
  let bestOppLow = -1;
  let highTies = 0;
  let lowTies = 0;

  for (const opp of opponentsCards) {
    const oppResult = evalFn(
      opp[0]!, opp[1]!, opp[2]!, opp[3]!, opp[4]!,
      streetCardsCount >= 6 ? opp[5]! : 0,
      streetCardsCount >= 7 ? opp[6]! : 0
    );

    if (oppResult.hi > bestOppHigh) {
      bestOppHigh = oppResult.hi;
      highTies = 1;
    } else if (oppResult.hi === bestOppHigh && oppResult.hi > -1) {
      highTies++;
    }

    if (oppResult.low > bestOppLow) {
      bestOppLow = oppResult.low;
      lowTies = 1;
    } else if (oppResult.low === bestOppLow && oppResult.low >= 0) {
      lowTies++;
    }
  }

  let highWinShare = 0;
  if (heroResult.hi > bestOppHigh) {
    highWinShare = 1;
  } else if (heroResult.hi === bestOppHigh) {
    highWinShare = 1 / (highTies + 1);
  }

  let lowWinShare = 0;
  const anyLowQualifies = heroResult.low >= 0 || bestOppLow >= 0;
  if (anyLowQualifies) {
    if (heroResult.low > bestOppLow) {
      lowWinShare = 1;
    } else if (heroResult.low === bestOppLow && heroResult.low >= 0) {
      lowWinShare = 1 / (lowTies + 1);
    }
  }

  const scoop = (highWinShare === 1 && (!anyLowQualifies || lowWinShare === 1)) ? 1 : 0;

  let equity = 0;
  if (anyLowQualifies) {
    equity = (highWinShare * 0.5) + (lowWinShare * 0.5);
  } else {
    equity = highWinShare;
  }

  return { highWinShare, lowWinShare, scoop, lowQualifies: heroResult.low >= 0, equity };
}

function simulateStreetRun(
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  numOpponents: number
) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  const totalNeeded = 4 + (numOpponents * 7);
  const dealt = d.slice(0, totalNeeded);
  const heroRemaining = dealt.slice(0, 4);
  const heroFull = [...holeCards, ...heroRemaining];

  const opponentsCards: number[][] = [];
  let offset = 4;
  for (let i = 0; i < numOpponents; i++) {
    opponentsCards.push(d.slice(offset, offset + 7));
    offset += 7;
  }

  const s5 = evaluateStreet(heroFull.slice(0, 5), opponentsCards.map(o => o.slice(0, 5)), 5);
  const s6 = evaluateStreet(heroFull.slice(0, 6), opponentsCards.map(o => o.slice(0, 6)), 6);
  const s7 = evaluateStreet(heroFull, opponentsCards, 7);

  return { s5, s6, s7 };
}

function runStreetSimulation(runs: number, numOpponents: number, seed?: number): Promise<StudHiLoStreetHandResult[]> {
  return new Promise((resolve) => {
    const hands = enumerateStudStartingHands();
    const results: StudHiLoStreetHandResult[] = [];
    let i = 0;
    const chunkSize = 5;

    function processChunk() {
      const end = Math.min(i + chunkSize, hands.length);
      for (; i < end; i++) {
        const hand = hands[i]!;
        const rng = new SeedableRNG(seed != null ? seed + i : Date.now());
        const deck = makeDeck(hand.cards);

        let s5HighWin = 0, s5LowWin = 0, s5Scoop = 0, s5LowQual = 0;
        let s5Equity = 0;
        let s6HighWin = 0, s6LowWin = 0, s6Scoop = 0, s6LowQual = 0;
        let s6Equity = 0;
        let s7HighWin = 0, s7LowWin = 0, s7Scoop = 0, s7LowQual = 0;
        let s7Equity = 0;

        let validRuns = 0;

        for (let r = 0; r < runs; r++) {
          const res = simulateStreetRun(hand.cards, deck, rng, numOpponents);

          s5Equity += res.s5.equity;
          s5HighWin += res.s5.highWinShare;
          s5LowWin += res.s5.lowWinShare;
          s5Scoop += res.s5.scoop;
          if (res.s5.lowQualifies) s5LowQual++;

          s6Equity += res.s6.equity;
          s6HighWin += res.s6.highWinShare;
          s6LowWin += res.s6.lowWinShare;
          s6Scoop += res.s6.scoop;
          if (res.s6.lowQualifies) s6LowQual++;

          s7Equity += res.s7.equity;
          s7HighWin += res.s7.highWinShare;
          s7LowWin += res.s7.lowWinShare;
          s7Scoop += res.s7.scoop;
          if (res.s7.lowQualifies) s7LowQual++;

          validRuns++;
        }

        results.push({
          hand: hand.key,
          s5: {
            equity: (s5Equity / validRuns) * 100,
            highWinPct: (s5HighWin / validRuns) * 100,
            lowWinPct: (s5LowWin / validRuns) * 100,
            scoopPct: (s5Scoop / validRuns) * 100,
            winHighTotal: s5HighWin,
            lowQualifyPct: (s5LowQual / validRuns) * 100
          },
          s6: {
            equity: (s6Equity / validRuns) * 100,
            highWinPct: (s6HighWin / validRuns) * 100,
            lowWinPct: (s6LowWin / validRuns) * 100,
            scoopPct: (s6Scoop / validRuns) * 100,
            winHighTotal: s6HighWin,
            lowQualifyPct: (s6LowQual / validRuns) * 100
          },
          s7: {
            equity: (s7Equity / validRuns) * 100,
            highWinPct: (s7HighWin / validRuns) * 100,
            lowWinPct: (s7LowWin / validRuns) * 100,
            scoopPct: (s7Scoop / validRuns) * 100,
            winHighTotal: s7HighWin,
            lowQualifyPct: (s7LowQual / validRuns) * 100
          }
        });
      }

      const pct = (i / hands.length) * 100;
      progressFill.style.width = pct + '%';
      progressText.textContent = i + '/' + hands.length + ' hands (' + pct.toFixed(0) + '%)';

      if (i < hands.length) {
        setTimeout(processChunk, 0);
      } else {
        // Default sort by 7th street equity
        results.sort((a, b) => b.s7.equity - a.s7.equity);
        resolve(results);
      }
    }

    processChunk();
  });
}

// Sort state
let sortKey = 's7-eq';
let sortDir: 'desc' | 'asc' = 'desc';

const sortValue = (h: StudHiLoStreetHandResult, key: string): number => {
  switch (key) {
    case 's5-eq': return h.s5.equity;
    case 's5-hi': return h.s5.highWinPct;
    case 's5-lo': return h.s5.lowWinPct;
    case 's5-sc': return h.s5.scoopPct;
    case 's6-eq': return h.s6.equity;
    case 's6-hi': return h.s6.highWinPct;
    case 's6-lo': return h.s6.lowWinPct;
    case 's6-sc': return h.s6.scoopPct;
    case 's7-eq': return h.s7.equity;
    case 's7-hi': return h.s7.highWinPct;
    case 's7-lo': return h.s7.lowWinPct;
    case 's7-sc': return h.s7.scoopPct;
    default: return h.s7.equity;
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
    { key: 's7-sc', label: '7th Sc%' }
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

    html += `<td class="num">${h.s5.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s5.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s5.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s5.scoopPct.toFixed(1)}%</td>`;

    html += `<td class="num">${h.s6.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s6.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s6.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s6.scoopPct.toFixed(1)}%</td>`;

    html += `<td class="num">${h.s7.equity.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s7.highWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s7.lowWinPct.toFixed(1)}%</td>`;
    html += `<td class="num">${h.s7.scoopPct.toFixed(1)}%</td>`;

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

function renderCategoryBars(stats: StreetStatsHiLo): string {
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

  for (const [street, cssClass, title] of [
    ['s5', 's5-title', '5TH STREET'],
    ['s6', 's6-title', '6TH STREET'],
    ['s7', 's7-title', '7TH STREET'],
  ] as const) {
    const stats = h[street];

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
  const runs = parseInt(runsInput.value, 10) || 1000;
  const opps = parseInt(opponentsInput.value, 10) || 1;
  const seedVal = seedInput.value ? parseInt(seedInput.value, 10) : undefined;

  runBtn.disabled = true;
  runBtn.textContent = 'Running...';
  progressContainer.classList.add('active');
  progressFill.style.width = '0%';
  progressText.textContent = 'Starting...';
  resultsDiv.innerHTML = '';

  const startTime = performance.now();
  const results = await runStreetSimulation(
    Math.max(100, Math.min(100000, runs)),
    Math.max(1, Math.min(6, opps)),
    seedVal
  );
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  progressFill.style.width = '100%';
  progressText.textContent = '✓ Completed in ' + elapsed + 's — Click any hand for details';

  currentResult = results;
  renderSummaryTable(results);

  runBtn.disabled = false;
  runBtn.textContent = 'Run Street Analysis';
});

init();
