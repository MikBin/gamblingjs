// Counter-strategy tuner (generalized across games + formats). For a target
// opponent archetype, sweeps the search-bot's temperature × tightness vs a field
// of (SEATS-1) of that archetype (candidate seat rotated for position-fairness),
// finds the best counter, and validates it on other table compositions vs a
// generalist default — exposing the specialization/robustness trade-off.
//
//   npx tsx tools/bench-counter.ts <nlhe|plo|flomaha> <6max|hu> <target> [sweepHands] [valHands]
import { fastHashesCreators } from '../src/pokerHashes7';
import {
  bigBlindOf,
  createCallingStationAgent,
  createManiacAgent,
  createSearchAgent,
  createSmartBot,
  createTightAgent,
  omahaHi,
  omahaHiLo,
  playHand,
  standardHoldem,
} from '../src/poker-table';
import type { BettingConfig, GamePreset } from '../src/poker-table';
import type { PlayerAgent } from '../src/poker-table';

fastHashesCreators.high();

const VARIANT = (process.argv[2] ?? 'plo') as 'nlhe' | 'plo' | 'flomaha' | 'plohl' | 'flohl';
const FORMAT = process.argv[3] === 'hu' ? 'hu' : '6max';
const TARGET = (process.argv[4] ?? 'station') as keyof typeof ARCH;
const SEATS = FORMAT === 'hu' ? 2 : 6;
const FIELD = SEATS - 1;
const IS_OMAHA = VARIANT !== 'nlhe';
const HI_LO = VARIANT === 'plohl' || VARIANT === 'flohl';
const EQ = IS_OMAHA ? 200 : 300;
const SWEEP_H = Number(process.argv[5] ?? (FORMAT === 'hu' ? (HI_LO ? 1500 : 2500) : HI_LO ? 800 : 1500));
const VAL_H = Number(process.argv[6] ?? (FORMAT === 'hu' ? (HI_LO ? 1500 : 2500) : HI_LO ? 1000 : 1800));
const STACK = VARIANT === 'flomaha' || VARIANT === 'flohl' ? 200 : 100;

// --- preset per variant ---
const potLimit: BettingConfig = { type: 'pot-limit' };
function fixedLimit(smallBet: number, bigBet: number): BettingConfig {
  return { type: 'fixed-limit', smallBet, bigBet, maxRaisesPerStreet: 4 };
}
function buildPreset(): GamePreset {
  if (VARIANT === 'nlhe') return standardHoldem({ seats: SEATS, sb: 1, bb: 2, stack: STACK });
  const g = HI_LO ? omahaHiLo({ sb: 1, bb: 2, stack: STACK }) : omahaHi({ sb: 1, bb: 2, stack: STACK });
  g.table.seats = { min: SEATS, max: SEATS };
  const bet = VARIANT === 'plo' || VARIANT === 'plohl' ? potLimit : fixedLimit(2, 4);
  g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: bet }));
  g.table.gameId = VARIANT;
  return g;
}
const PRESET = buildPreset();
const BB = bigBlindOf(PRESET.hand);
const VARIANT_LABEL =
  VARIANT === 'plo' ? 'Pot-Limit Omaha Hi'
    : VARIANT === 'flomaha' ? 'Fixed-Limit Omaha Hi'
      : VARIANT === 'plohl' ? 'Pot-Limit Omaha Hi/Lo'
        : VARIANT === 'flohl' ? 'Fixed-Limit Omaha Hi/Lo'
          : 'No-Limit Hold-em';

type Maker = (seed: number) => PlayerAgent;
const ARCH: Record<string, Maker> = {
  maniac: (s) => createManiacAgent(s),
  station: (s) => createCallingStationAgent(s),
  tag: (s) => createSmartBot({ seed: s, aggression: 0.45, tightness: 0.85 }),
  lag: (s) => createSmartBot({ seed: s, aggression: 0.85, tightness: 0.3 }),
  nit: (s) => createTightAgent(s),
  smart: (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 }),
};
const MANIAC: Maker = (s) => createManiacAgent(s);
const STATION: Maker = (s) => createCallingStationAgent(s);
const TAG: Maker = (s) => createSmartBot({ seed: s, aggression: 0.45, tightness: 0.85 });
const LAG: Maker = (s) => createSmartBot({ seed: s, aggression: 0.85, tightness: 0.3 });
const NIT: Maker = (s) => createTightAgent(s);
const SMART: Maker = (s) => createSmartBot({ seed: s, aggression: 0.5, tightness: 0.5 });

const fill = (ms: Maker[]): Maker[] => {
  const out: Maker[] = [];
  for (let i = 0; i < FIELD; i++) out.push(ms[i % ms.length]!);
  return out;
};
// Validation table compositions (sized to FIELD). Trimmed to 2 non-target
// fields so slow Omaha/Hi-Lo runs complete cleanly.
const VALIDATION: Record<string, Maker[]> = FORMAT === 'hu'
  ? {
      maniac: [MANIAC], nit: [NIT],
    }
  : {
      'mixed-diverse': fill([MANIAC, STATION, TAG, LAG, NIT]),
      'mixed-station-heavy': fill([STATION, STATION, TAG, NIT, LAG]),
    };

interface SweepCfg {
  name: string;
  temp: number;
  tight: number;
  make: Maker;
}
const grid: SweepCfg[] = [];
for (const temp of [0, 0.2]) {
  for (const tight of [0.2, 0.5, 0.85]) {
    grid.push({
      name: `temp${temp}/tight${tight}`,
      temp,
      tight,
      make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: temp, tightness: tight, opponentModel: 'uniform', aggression: 0.55, bluffFrequency: 0.04, equitySamples: EQ }),
    });
  }
}
const DEFAULT_CFG: SweepCfg = {
  name: 'default(temp0.2/tight0.5)',
  temp: 0.2,
  tight: 0.5,
  make: (s) => createSearchAgent({ seed: s, core: 'pimc', temperature: 0.2, tightness: 0.5, opponentModel: 'uniform', aggression: 0.55, bluffFrequency: 0.04, equitySamples: EQ }),
};

function run(candidate: PlayerAgent, fieldMakers: Maker[], hands: number): { bb100: number; ci: number } {
  const fieldAgents = fieldMakers.map((m, i) => m(200 + i));
  let sum = 0;
  let sumSq = 0;
  for (let h = 0; h < hands; h++) {
    const cSeat = h % SEATS;
    const agents: (PlayerAgent | undefined)[] = new Array(SEATS);
    agents[cSeat] = candidate;
    let fi = 0;
    for (let s = 0; s < SEATS; s++) if (s !== cSeat) agents[s] = fieldAgents[fi++ % fieldAgents.length]!;
    const res = playHand(PRESET.table, PRESET.hand, agents as PlayerAgent[], h + 1);
    const bb = ((res.finalStacks[cSeat] ?? STACK) - STACK) / BB;
    sum += bb;
    sumSq += bb * bb;
  }
  const mean = sum / hands;
  const variance = Math.max(0, sumSq / hands - mean * mean);
  return { bb100: mean * 100, ci: (1.96 * Math.sqrt(variance)) / Math.sqrt(hands) * 100 };
}

const fmt = (n: number): string => (n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
const targetField = fill(Array.from({ length: 5 }, () => ARCH[TARGET] ?? ARCH.station));

console.log(`\n########## ${VARIANT_LABEL} · ${FORMAT.toUpperCase()} · TARGET: ${FIELD}× ${TARGET.toUpperCase()} ##########`);

console.log(`\n-- sweep (6 configs vs ${FIELD}×${TARGET}, seat-rotated, ${SWEEP_H}h, eq=${EQ}) --`);
const swept = grid.map((c) => ({ ...c, ...run(c.make(101), targetField, SWEEP_H) })).sort((a, b) => b.bb100 - a.bb100);
swept.forEach((c, i) => {
  console.log(`  ${(i + 1 + '.').padEnd(4)} ${c.name.padEnd(20)} ${fmt(c.bb100).padStart(8)} ±${c.ci.toFixed(1).padStart(6)}`);
});
const winner = swept[0]!;
console.log(`\n  WINNER: ${winner.name}  →  ${fmt(winner.bb100)} ±${winner.ci.toFixed(1)} bb/100`);

const EXPECT: Record<string, string> = {
  maniac: 'tight value-trap (high tightness)',
  station: 'loose, value-bet wide (low tightness, low bluff)',
  tag: 'loosen / steal (low tightness, high aggression)',
  lag: 'call down / trap (mid tightness)',
  nit: 'loose steals (low tightness)',
  smart: 'balanced (≈ default)',
};
console.log(`  THEORY expect: ${EXPECT[TARGET] ?? '?'}`);
console.log(`  winner params: temperature=${winner.temp}, tightness=${winner.tight}`);

console.log(`\n-- validation (${VAL_H}h/field, seat-rotated): winner vs default --`);
const valFields: Record<string, Maker[]> = { [`target(${FIELD}×${TARGET})`]: targetField, ...VALIDATION };
console.log(`  ${'field'.padEnd(22)} ${'winner'.padEnd(16)} ${'default'.padEnd(16)}  delta`);
const summary: string[] = [];
for (const [fname, fm] of Object.entries(valFields)) {
  const w = run(winner.make(303 + fname.length), fm, VAL_H);
  const d = run(DEFAULT_CFG.make(404 + fname.length), fm, VAL_H);
  const delta = w.bb100 - d.bb100;
  console.log(`  ${fname.padEnd(22)} ${(fmt(w.bb100) + '±' + w.ci.toFixed(0)).padEnd(16)} ${(fmt(d.bb100) + '±' + d.ci.toFixed(0)).padEnd(16)}  ${fmt(delta)}`);
  summary.push(`${VARIANT}/${FORMAT}/${TARGET}/${fname}=${w.bb100.toFixed(1)},${d.bb100.toFixed(1)}`);
}
console.log(`\n@SUMMARY ${summary.join('|')}`);
