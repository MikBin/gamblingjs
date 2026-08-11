// NL Texas Hold'em bot benchmark with a CHOOSABLE reference field, so rankings
// can be made less exploitation-dependent. Candidate(s) play seat 0 in the
// fixed-field modes; in `selfplay` every candidate rotates through all seats
// against the other candidates (position-balanced, no fixed field to exploit).
//
//   npx tsx tools/bench-bots.ts <hu|6max> [hands] [field]
//   field: smart (default) | mixed | callers | selfplay
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

const FORMAT = process.argv[2] === 'hu' ? 'hu' : '6max';
const SEATS = FORMAT === 'hu' ? 2 : 6;
const HANDS = Number(process.argv[3] ?? (FORMAT === 'hu' ? 4000 : 2500));
const FIELD = (process.argv[4] ?? 'smart') as 'smart' | 'mixed' | 'callers' | 'selfplay';
const STACK = 100;
const BB = 2;

const PRESET = standardHoldem({ seats: SEATS, sb: 1, bb: BB, stack: STACK });

interface Cfg {
  name: string;
  make: (seed: number) => PlayerAgent;
  slow?: boolean;
}

const cfgs: Cfg[] = [
  // stub baselines (calling-station & always-call are field-only now)
  { name: 'random', make: (s) => createRandomAgent(s) },
  { name: 'aggressive', make: (s) => createAggressiveAgent(s) },
  { name: 'maniac', make: (s) => createManiacAgent(s) },
  { name: 'tight', make: (s) => createTightAgent(s) },
  // smart (heuristic) variants
  { name: 'smart-balanced', make: (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 }) },
  { name: 'smart-tight', make: (s) => createSmartBot({ seed: s, aggression: 0.4, tightness: 0.8 }) },
  { name: 'smart-lag', make: (s) => createSmartBot({ seed: s, aggression: 0.85, tightness: 0.25 }) },
  // search / PIMC variants
  { name: 'pimc-greedy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0, equitySamples: 500 }) },
  { name: 'pimc-soft', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, equitySamples: 500 }) },
  { name: 'pimc-noisy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.6, equitySamples: 400 }) },
  { name: 'pimc-bayesian', make: (s) => createSearchAgent({ seed: s, core: 'pimc', opponentModel: 'bayesian', temperature: 0, equitySamples: 500 }) },
  { name: 'ismcts', make: (s) => createSearchAgent({ seed: s, core: 'ismcts', treeIterations: 120, determinizations: 4, equitySamples: 150, temperature: 0 }), slow: true },
];

const SMART = (s: number): PlayerAgent => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 });
// Fixed reference fields (cycled to fill SEATS-1 opponent seats).
const FIELD_POOL: Record<string, ((s: number) => PlayerAgent)[]> = {
  smart: [SMART, SMART, SMART, SMART, SMART],
  mixed: [SMART, (s) => createCallingStationAgent(s), (s) => createAggressiveAgent(s), (s) => createTightAgent(s), (s) => createManiacAgent(s)],
  callers: [(s) => createCallingStationAgent(s), () => alwaysCallAgent, (s) => createCallingStationAgent(s), SMART, () => alwaysCallAgent],
};

interface Row {
  name: string;
  bb100: number;
  ci: number;
  hands: number;
  ms: number;
}

const ci95 = (mean: number, sumSq: number, n: number): number => {
  const v = Math.max(0, sumSq / n - mean * mean);
  return (1.96 * Math.sqrt(v)) / Math.sqrt(n) * 100;
};
const fmt = (n: number): string => (n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1));

// Fixed field: candidate at seat 0 vs a constant set of opponents.
function runFixed(cfg: Cfg, hands: number): Row {
  const pool = FIELD_POOL[FIELD] ?? FIELD_POOL.smart!;
  const agents: PlayerAgent[] = [cfg.make(101), ...Array.from({ length: SEATS - 1 }, (_, i) => pool[i % pool.length]!(1000 + i))];
  let sum = 0;
  let sumSq = 0;
  const t0 = Date.now();
  for (let h = 0; h < hands; h++) {
    const res = playHand(PRESET.table, PRESET.hand, agents, h + 1);
    const bb = ((res.finalStacks[0] ?? STACK) - STACK) / BB;
    sum += bb;
    sumSq += bb * bb;
  }
  const mean = sum / hands;
  return { name: cfg.name, bb100: mean * 100, ci: ci95(mean, sumSq, hands), hands, ms: Date.now() - t0 };
}

// Self-play round-robin: candidates rotate through every seat vs the other
// candidates. Each candidate plays an equal number of hands in a position-
// balanced mix, so no fixed field can be exploited and the button bias cancels.
function runSelfplay(hands: number): Row[] {
  const inst = new Map<string, PlayerAgent>();
  cfgs.forEach((c, i) => inst.set(c.name, c.make(101 + i)));
  const acc = new Map<string, { sum: number; sumSq: number; n: number }>();
  cfgs.forEach((c) => acc.set(c.name, { sum: 0, sumSq: 0, n: 0 }));
  const t0 = Date.now();
  for (let h = 0; h < hands; h++) {
    const seated: Cfg[] = [];
    for (let j = 0; j < SEATS; j++) seated.push(cfgs[(h + j) % cfgs.length]!);
    const agents = seated.map((c) => inst.get(c.name)!);
    const res = playHand(PRESET.table, PRESET.hand, agents, h + 1);
    for (let s = 0; s < SEATS; s++) {
      const bb = ((res.finalStacks[s] ?? STACK) - STACK) / BB;
      const a = acc.get(seated[s]!.name)!;
      a.sum += bb;
      a.sumSq += bb * bb;
      a.n++;
    }
  }
  const ms = Date.now() - t0;
  return cfgs.map((c) => {
    const a = acc.get(c.name)!;
    const mean = a.sum / a.n;
    return { name: c.name, bb100: mean * 100, ci: ci95(mean, a.sumSq, a.n), hands: a.n, ms };
  });
}

const title = `=== ${FORMAT === 'hu' ? 'HEADS-UP' : '6-MAX'} NLHE — field: ${FIELD} ===`;
console.log(title);

let rows: Row[];
if (FIELD === 'selfplay') {
  const sh = Math.min(HANDS, FORMAT === 'hu' ? 2400 : 1500); // round-robin is heavier (esp. ismcts)
  process.stdout.write(`  self-play round-robin (${sh} hands × ${SEATS} seats, ${cfgs.length} candidates)...\n`);
  rows = runSelfplay(sh);
} else {
  rows = [];
  for (const cfg of cfgs) {
    const hands = cfg.slow ? Math.min(HANDS, FORMAT === 'hu' ? 500 : 300) : HANDS;
    process.stdout.write(`  ${cfg.name.padEnd(15)} (${hands}h)...`);
    const r = runFixed(cfg, hands);
    rows.push(r);
    process.stdout.write(` ${fmt(r.bb100).padStart(7)} ±${r.ci.toFixed(1).padStart(6)} bb/100\n`);
  }
}

rows.sort((a, b) => b.bb100 - a.bb100);
console.log('\nrank  config           bb/100     ±95%     hands');
rows.forEach((r, i) => {
  console.log(` ${(i + 1 + '.').padEnd(4)} ${r.name.padEnd(15)} ${fmt(r.bb100).padStart(7)}  ±${r.ci.toFixed(1).padStart(6)}   ${r.hands}`);
});
