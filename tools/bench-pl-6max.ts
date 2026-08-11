// 6-max POT-LIMIT Texas Hold'em bot benchmark. Same matrix as bench-bots.ts
// (all bots except always-fold), each config vs a fixed smart-balanced field of
// 5, candidate at seat 0. bb/100 normalized in BIG BLINDS (bb=2) for cross-bench
// comparability with the NL/FL runs.
//
//   npx tsx tools/bench-pl-6max.ts [hands]
import { fastHashesCreators } from '../src/pokerHashes7';
import {
  alwaysCallAgent,
  bigBlindOf,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createSearchAgent,
  createSmartBot,
  createTightAgent,
  playHand,
  potLimitHoldem,
} from '../src/poker-table';
import type { PlayerAgent } from '../src/poker-table';

fastHashesCreators.high();

const HANDS = Number(process.argv[2] ?? 2500);
const SEATS = 6;
const STACK = 200; // 100 big blinds

const PRESET = potLimitHoldem({ sb: 1, bb: 2, stack: STACK });
PRESET.table.seats = { min: SEATS, max: SEATS };
const BB = bigBlindOf(PRESET.hand); // = 2

interface Cfg {
  name: string;
  make: (seed: number) => PlayerAgent;
  slow?: boolean;
}

const cfgs: Cfg[] = [
  { name: 'alwaysCall', make: () => alwaysCallAgent },
  { name: 'random', make: (s) => createRandomAgent(s) },
  { name: 'aggressive', make: (s) => createAggressiveAgent(s) },
  { name: 'maniac', make: (s) => createManiacAgent(s) },
  { name: 'station', make: (s) => createCallingStationAgent(s) },
  { name: 'tight', make: (s) => createTightAgent(s) },
  { name: 'smart-balanced', make: (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 }) },
  { name: 'smart-tight', make: (s) => createSmartBot({ seed: s, aggression: 0.4, tightness: 0.8 }) },
  { name: 'smart-lag', make: (s) => createSmartBot({ seed: s, aggression: 0.85, tightness: 0.25 }) },
  { name: 'pimc-greedy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0, equitySamples: 500 }) },
  { name: 'pimc-soft', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, equitySamples: 500 }) },
  { name: 'pimc-noisy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.6, equitySamples: 400 }) },
  { name: 'pimc-bayesian', make: (s) => createSearchAgent({ seed: s, core: 'pimc', opponentModel: 'bayesian', temperature: 0, equitySamples: 500 }) },
  { name: 'ismcts', make: (s) => createSearchAgent({ seed: s, core: 'ismcts', treeIterations: 120, determinizations: 4, equitySamples: 150, temperature: 0 }), slow: true },
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
console.log(`=== 6-MAX POT-LIMIT Hold'em (${STACK}bb) — each config vs 5 smart-balanced ===`);

const rows: { name: string; bb100: number; ci: number; hands: number }[] = [];
for (const cfg of cfgs) {
  const hands = cfg.slow ? Math.min(HANDS, 300) : HANDS;
  process.stdout.write(`  ${cfg.name.padEnd(15)} (${hands}h)...`);
  const r = run(cfg, hands);
  rows.push({ name: cfg.name, ...r });
  process.stdout.write(` ${fmt(r.bb100).padStart(7)} ±${r.ci.toFixed(1).padStart(6)} bb/100   [${(r.ms / 1000).toFixed(1)}s]\n`);
}

rows.sort((a, b) => b.bb100 - a.bb100);
console.log('\nrank  config           bb/100     ±95%     hands');
rows.forEach((r, i) => {
  console.log(` ${(i + 1 + '.').padEnd(4)} ${r.name.padEnd(15)} ${fmt(r.bb100).padStart(7)}  ±${r.ci.toFixed(1).padStart(6)}   ${r.hands}`);
});
