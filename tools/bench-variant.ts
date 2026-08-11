// Per-variant bot-config optimization. Sweeps smart + PIMC configs (temperature ×
// tightness + opponent model) plus stub baselines, each vs a fixed diverse `mixed`
// field, with 95% CIs. A diverse field is less exploitable than pure-smart, and
// every candidate occupies seat 0 so the relative comparison is fair.
//
//   npx tsx tools/bench-variant.ts <nl|plo|fl> [hands] [field=mixed] [eq=400]
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
  fixedLimitHoldem,
  playHand,
  potLimitOmaha,
  standardHoldem,
} from '../src/poker-table';
import type { PlayerAgent } from '../src/poker-table';

fastHashesCreators.high();
fastHashesCreators.Ato5(); // (harmless for high games; needed if any low fixture ever runs)

const VARIANT = (process.argv[2] ?? 'nl') as 'nl' | 'plo' | 'fl';
const HANDS = Number(process.argv[3] ?? 8000);
const FIELD = (process.argv[4] ?? 'mixed') as 'mixed' | 'smart' | 'callers';
const EQ = Number(process.argv[5] ?? 400);
const SEATS = 6;
const STACK = VARIANT === 'fl' ? 200 : 100;

const PRESET =
  VARIANT === 'plo'
    ? (() => {
        const g = potLimitOmaha({ sb: 1, bb: 2, stack: STACK });
        g.table.seats = { min: SEATS, max: SEATS };
        return g;
      })()
    : VARIANT === 'fl'
      ? (() => {
          const g = fixedLimitHoldem({ sb: 1, bb: 2, smallBet: 2, bigBet: 4, maxRaises: 4, stack: STACK });
          g.table.seats = { min: SEATS, max: SEATS };
          return g;
        })()
      : standardHoldem({ seats: SEATS, sb: 1, bb: 2, stack: STACK });
const BB = bigBlindOf(PRESET.hand);
const VARIANT_NAME = VARIANT === 'plo' ? 'Pot-Limit Omaha' : VARIANT === 'fl' ? 'Fixed-Limit Hold-em' : 'No-Limit Hold-em';

interface Cfg {
  name: string;
  make: (seed: number) => PlayerAgent;
  tag: string;
}

const cfgs: Cfg[] = [
  { name: 'maniac', make: (s) => createManiacAgent(s), tag: 'stub' },
  { name: 'tight', make: (s) => createTightAgent(s), tag: 'stub' },
  { name: 'smart-balanced', make: (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 }), tag: 'smart' },
  { name: 'smart-tight', make: (s) => createSmartBot({ seed: s, aggression: 0.4, tightness: 0.8 }), tag: 'smart' },
  { name: 'smart-lag', make: (s) => createSmartBot({ seed: s, aggression: 0.85, tightness: 0.25 }), tag: 'smart' },
  { name: 'pimc-greedy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0, tightness: 0.5, equitySamples: EQ }), tag: 'pimc' },
  { name: 'pimc-soft', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, tightness: 0.5, equitySamples: EQ }), tag: 'pimc' },
  { name: 'pimc-noisy', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.5, tightness: 0.5, equitySamples: EQ }), tag: 'pimc' },
  { name: 'pimc-tight', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0, tightness: 0.85, equitySamples: EQ }), tag: 'pimc' },
  { name: 'pimc-loose', make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, tightness: 0.2, equitySamples: EQ }), tag: 'pimc' },
  { name: 'pimc-bayes', make: (s) => createSearchAgent({ seed: s, core: 'pimc', opponentModel: 'bayesian', temperature: 0, tightness: 0.5, equitySamples: EQ }), tag: 'pimc' },
];

const SMART = (s: number): PlayerAgent => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 });
const FIELD_POOL: Record<string, ((s: number) => PlayerAgent)[]> = {
  smart: [SMART, SMART, SMART, SMART, SMART],
  mixed: [SMART, (s) => createCallingStationAgent(s), (s) => createAggressiveAgent(s), (s) => createTightAgent(s), (s) => createManiacAgent(s)],
  callers: [(s) => createCallingStationAgent(s), () => alwaysCallAgent, (s) => createCallingStationAgent(s), SMART, () => alwaysCallAgent],
};

function run(cfg: Cfg, hands: number): { name: string; tag: string; bb100: number; ci: number; hands: number; ms: number } {
  const pool = FIELD_POOL[FIELD] ?? FIELD_POOL.mixed!;
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
  const ms = Date.now() - t0;
  const mean = sum / hands;
  const variance = Math.max(0, sumSq / hands - mean * mean);
  const ci = (1.96 * Math.sqrt(variance)) / Math.sqrt(hands) * 100;
  return { name: cfg.name, tag: cfg.tag, bb100: mean * 100, ci, hands, ms };
}

const fmt = (n: number): string => (n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
console.log(`=== 6-MAX ${VARIANT_NAME} — field: ${FIELD} | ${HANDS} hands/config | equitySamples=${EQ} ===`);

const rows: ReturnType<typeof run>[] = [];
for (const cfg of cfgs) {
  process.stdout.write(`  ${cfg.name.padEnd(15)} (${HANDS}h)...`);
  const r = run(cfg, HANDS);
  rows.push(r);
  process.stdout.write(` ${fmt(r.bb100).padStart(8)} ±${r.ci.toFixed(1).padStart(6)} bb/100   [${(r.ms / 1000).toFixed(1)}s]\n`);
}

rows.sort((a, b) => b.bb100 - a.bb100);
console.log('\nrank  config           type   bb/100     ±95%');
rows.forEach((r, i) => {
  console.log(` ${(i + 1 + '.').padEnd(4)} ${r.name.padEnd(15)} ${r.tag.padEnd(5)}  ${fmt(r.bb100).padStart(8)}  ±${r.ci.toFixed(1).padStart(6)}`);
});
// Machine-readable line for report assembly.
console.log(`\n@BEST ${rows[0]!.name} ${rows[0]!.bb100.toFixed(1)} ${rows[0]!.ci.toFixed(1)}`);
