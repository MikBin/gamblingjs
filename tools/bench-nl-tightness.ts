// NL Texas Hold'em 6-max — tightness sweep. Runs the matrix with every tunable
// bot (smart + PIMC + Bayesian + IS-MCTS) set to a single tightness value, vs a
// fixed smart-balanced field. Stubs (no tightness knob) and the field are held
// constant so the effect of tightness is isolated.
//
//   npx tsx tools/bench-nl-tightness.ts <tightness> [hands]
import { fastHashesCreators } from '../src/pokerHashes7';
import {
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createSearchAgent,
  createSmartBot,
  createTightAgent,
  playHand,
  standardHoldem,
} from '../src/poker-table';
import type { PlayerAgent } from '../src/poker-table';

fastHashesCreators.high();

const T = Number(process.argv[2] ?? 0.5);
const HANDS = Number(process.argv[3] ?? 2500);
const SEATS = 6;
const STACK = 100;
const BB = 2;

const PRESET = standardHoldem({ seats: SEATS, sb: 1, bb: BB, stack: STACK });

interface Cfg {
  name: string;
  make: (seed: number) => PlayerAgent;
  slow?: boolean;
}

const t = (n: string, make: (s: number) => PlayerAgent, slow?: boolean): Cfg => ({ name: n, make, slow });

const cfgs: Cfg[] = [
  // --- stubs (tightness-independent) ---
  t('alwaysCall', () => alwaysCallAgent),
  t('random', (s) => createRandomAgent(s)),
  t('aggressive', (s) => createAggressiveAgent(s)),
  t('maniac', (s) => createManiacAgent(s)),
  t('station', (s) => createCallingStationAgent(s)),
  t('tight', (s) => createTightAgent(s)),
  // --- tunable bots, all at tightness T ---
  t(`smart(T=${T})`, (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: T })),
  t(`pimc-greedy(T=${T})`, (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0, equitySamples: 500, tightness: T })),
  t(`pimc-soft(T=${T})`, (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, equitySamples: 500, tightness: T })),
  t(`pimc-bayes(T=${T})`, (s) => createSearchAgent({ seed: s, core: 'pimc', opponentModel: 'bayesian', temperature: 0, equitySamples: 500, tightness: T })),
  t(`ismcts(T=${T})`, (s) => createSearchAgent({ seed: s, core: 'ismcts', treeIterations: 120, determinizations: 4, equitySamples: 150, tightness: T, temperature: 0 }), true),
];

const field = (seed: number): PlayerAgent => createSmartBot({ seed, aggression: 0.5, tightness: 0.5 });

function run(cfg: Cfg, hands: number): { bb100: number; ci: number; hands: number; ms: number } {
  const agents: PlayerAgent[] = [cfg.make(101), ...Array.from({ length: SEATS - 1 }, (_, i) => field(1000 + i))];
  let sum = 0;
  let sumSq = 0;
  const t0 = Date.now();
  for (let h = 0; h < hands; h++) {
    const res = playHand(PRESET.table, PRESET.hand, agents, h + 1);
    const bb = ((res.finalStacks[0] ?? STACK) - STACK) / BB;
    sum += bb;
    sumSq += bb * bb;
  }
  const ms = Date.now() - t0;
  const mean = sum / hands;
  const variance = Math.max(0, sumSq / hands - mean * mean);
  const ci = (1.96 * Math.sqrt(variance)) / Math.sqrt(hands) * 100;
  return { bb100: mean * 100, ci, hands, ms };
}

const fmt = (n: number): string => (n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
const label = T >= 0.6 ? 'TIGHT' : T <= 0.3 ? 'LOOSE' : 'NEUTRAL';
console.log(`=== 6-MAX NL Hold'em — ${label} run (tightness T=${T}) — each config vs 5 smart-balanced ===`);

const rows: { name: string; bb100: number; ci: number; hands: number }[] = [];
for (const cfg of cfgs) {
  const hands = cfg.slow ? Math.min(HANDS, 300) : HANDS;
  process.stdout.write(`  ${cfg.name.padEnd(20)} (${hands}h)...`);
  const r = run(cfg, hands);
  rows.push({ name: cfg.name, ...r });
  process.stdout.write(` ${fmt(r.bb100).padStart(7)} ±${r.ci.toFixed(1).padStart(6)} bb/100   [${(r.ms / 1000).toFixed(1)}s]\n`);
}

rows.sort((a, b) => b.bb100 - a.bb100);
console.log('\nrank  config                 bb/100     ±95%     hands');
rows.forEach((r, i) => {
  console.log(` ${(i + 1 + '.').padEnd(4)} ${r.name.padEnd(20)} ${fmt(r.bb100).padStart(7)}  ±${r.ci.toFixed(1).padStart(6)}   ${r.hands}`);
});
