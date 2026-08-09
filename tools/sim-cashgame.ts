// 6-max NLHE bot benchmark: smoke test + model comparison with confidence intervals.
//
//   npx tsx tools/sim-cashgame.ts [hands] [equitySamples] [mode]
//
// modes:
//   mix            6 different models, free-for-all                 (default)
//   search-vs-smart 1 search bot vs 5 baseline smart bots
//   sweep          smart-bot tightness sweep {0.2..0.5} vs a fixed field
//   roundrobin     each candidate model vs the SAME fixed field (level field)
//   long           1 search vs 5 webapp-tuned smart, big sample + CI
//
// Stacks reload to 100bb each hand (cash rebuy) so the table stays full and
// every hand isolates per-hand skill. bb/100 = mean per-hand (delta/BB)*100;
// the ± column is the 95% confidence half-width on bb/100.
import { fastHashesCreators } from '../src/pokerHashes7';
import {
  playHand,
  standardHoldem,
  createSearchAgent,
  createSmartBot,
  createAggressiveAgent,
  createTightAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
} from '../src/poker-table';
import type { PlayerAgent } from '../src/poker-table';

fastHashesCreators.high();

const HANDS = Number(process.argv[2] ?? 2000);
const EQ = Number(process.argv[3] ?? 200);
const MODE = (process.argv[4] ?? 'mix') as 'mix' | 'search-vs-smart' | 'sweep' | 'roundrobin' | 'long';
const STACK = 100;
const BB = 2;
const { table, hand } = standardHoldem({ seats: 6, sb: 1, bb: BB, stack: STACK });

interface Spec {
  name: string;
  make: (seed: number) => PlayerAgent;
}
const search = (seed: number): PlayerAgent => createSearchAgent({ seed, temperature: 0.15, equitySamples: EQ });
const smart = (aggr: number, tight: number) => (seed: number): PlayerAgent =>
  createSmartBot({ seed, aggression: aggr, tightness: tight });
const SMART_BASE = smart(0.5, 0.5); // neutral field opponent
const SMART_TUNED = smart(0.6, 0.4); // webapp default tuning

interface Acc {
  name: string;
  n: number; // seat-hands played
  sumBb: number;
  sumBbSq: number;
  won: number;
  vpip: number;
  agg: number;
  allin: number;
  gross: number;
}
const newAcc = (name: string): Acc => ({ name, n: 0, sumBb: 0, sumBbSq: 0, won: 0, vpip: 0, agg: 0, allin: 0, gross: 0 });

function runMatch(seats: Spec[], hands: number, seedBase: number): Map<string, Acc> {
  const perSeat = seats.map((s, i) => ({ spec: s, acc: newAcc(s.name), agent: s.make(seedBase + i * 1000 + 7) }));
  const reload = new Array(seats.length).fill(STACK);
  for (let h = 0; h < hands; h++) {
    const res = playHand(table, hand, perSeat.map((p) => p.agent), seedBase + h + 1, reload);
    const entered = new Set<number>();
    for (let i = 0; i < perSeat.length; i++) {
      const delta = (res.finalStacks[i] ?? STACK) - STACK;
      const bb = delta / BB;
      const a = perSeat[i]!.acc;
      a.n++;
      a.sumBb += bb;
      a.sumBbSq += bb * bb;
      if (delta > 0) a.won++;
    }
    for (const w of res.winners) if (w.seat >= 0 && w.seat < perSeat.length) perSeat[w.seat]!.acc.gross += w.amount;
    for (const a of res.actions) {
      if (a.seat < 0 || a.seat >= perSeat.length) continue;
      const ac = perSeat[a.seat]!.acc;
      if (a.streetIndex === 0 && (a.type === 'call' || a.type === 'bet' || a.type === 'raise')) entered.add(a.seat);
      if (a.type === 'bet' || a.type === 'raise') ac.agg++;
      if (a.type === 'allin') ac.allin++;
    }
    for (const s of entered) perSeat[s]!.acc.vpip++;
  }
  const byName = new Map<string, Acc>();
  for (const p of perSeat) {
    const cur = byName.get(p.acc.name) ?? newAcc(p.acc.name);
    cur.n += p.acc.n;
    cur.sumBb += p.acc.sumBb;
    cur.sumBbSq += p.acc.sumBbSq;
    cur.won += p.acc.won;
    cur.vpip += p.acc.vpip;
    cur.agg += p.acc.agg;
    cur.allin += p.acc.allin;
    cur.gross += p.acc.gross;
    byName.set(p.acc.name, cur);
  }
  return byName;
}

function ci95(acc: Acc): { bb100: number; ci: number } {
  const mean = acc.sumBb / acc.n;
  const varr = Math.max(0, acc.sumBbSq / acc.n - mean * mean);
  const stderr = Math.sqrt(varr) / Math.sqrt(acc.n);
  return { bb100: mean * 100, ci: 1.96 * stderr * 100 };
}

function printTable(title: string, accs: Map<string, Acc>): void {
  const rows = [...accs.values()].sort((a, b) => ci95(b).bb100 - ci95(a).bb100);
  const fmt = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);
  console.log(`\n${title}`);
  console.log('model        bb/100     ±95%     win%   VPIP%   agg/hand  allin%');
  for (const a of rows) {
    const { bb100, ci } = ci95(a);
    const winPct = ((a.won / a.n) * 100).toFixed(1);
    const vpip = ((a.vpip / a.n) * 100).toFixed(1);
    const aggH = (a.agg / a.n).toFixed(2);
    const ai = ((a.allin / a.n) * 100).toFixed(2);
    console.log(
      `${a.name.padEnd(11)} ${fmt(bb100.toFixed(1)).padStart(7)}  ±${ci.toFixed(1).padStart(5)}   ${winPct.padStart(5)}   ${vpip.padStart(5)}   ${aggH.padStart(7)}   ${ai.padStart(5)}`,
    );
  }
}

function smoke(hands: number, elapsed: number, accs: Map<string, Acc>): void {
  const totalNet = [...accs.values()].reduce((s, a) => s + a.sumBb * BB, 0);
  console.log('\n=== smoke verdict ===');
  console.log(`hands:        ${hands} | ${elapsed.toFixed(1)}s | ${(hands / elapsed).toFixed(0)} h/s`);
  console.log(`zero-sum:     ${totalNet === 0 ? 'PASS' : `net=${totalNet} CHECK`}`);
}

// ---- mode drivers ----
const FIELD: Spec[] = Array.from({ length: 5 }, (_, i) => ({ name: 'field', make: SMART_BASE }));

function drive(): void {
  const t0 = Date.now();
  if (MODE === 'mix') {
    const accs = runMatch(
      [
        { name: 'search', make: search },
        { name: 'smart', make: SMART_TUNED },
        { name: 'aggro', make: (s) => createAggressiveAgent(s) },
        { name: 'tight', make: (s) => createTightAgent(s) },
        { name: 'station', make: (s) => createCallingStationAgent(s) },
        { name: 'random', make: (s) => createRandomAgent(s) },
      ],
      HANDS,
      1,
    );
    printTable(`=== 6-max NLHE — mixed free-for-all (${HANDS} hands) ===`, accs);
    smoke(HANDS, (Date.now() - t0) / 1000, accs);
    return;
  }
  if (MODE === 'search-vs-smart') {
    const accs = runMatch([{ name: 'search', make: search }, ...FIELD.map((f) => ({ name: 'smart', make: f.make }))], HANDS, 1);
    printTable(`=== 6-max NLHE — 1 search vs 5 smart (${HANDS} hands) ===`, accs);
    smoke(HANDS, (Date.now() - t0) / 1000, accs);
    return;
  }
  if (MODE === 'long') {
    const accs = runMatch(
      [{ name: 'search', make: search }, ...Array.from({ length: 5 }, () => ({ name: 'smart', make: SMART_TUNED }))],
      HANDS,
      1,
    );
    printTable(`=== 6-max NLHE — search vs 5 tuned smart, long run (${HANDS} hands) ===`, accs);
    smoke(HANDS, (Date.now() - t0) / 1000, accs);
    return;
  }
  if (MODE === 'sweep') {
    console.log(`=== smart-bot tightness sweep (aggression 0.6, vs fixed field, ${HANDS} hands/point) ===`);
    console.log('tightness   bb/100     ±95%     VPIP%   allin%');
    let best = -Infinity;
    let bestT = 0;
    for (const tight of [0.2, 0.3, 0.4, 0.5]) {
      const accs = runMatch([{ name: 'smart', make: smart(0.6, tight) }, ...FIELD.map((f) => ({ name: 'field', make: f.make }))], HANDS, 1000 + tight * 10);
      const a = accs.get('smart')!;
      const { bb100, ci } = ci95(a);
      const vpip = ((a.vpip / a.n) * 100).toFixed(1);
      const ai = ((a.allin / a.n) * 100).toFixed(2);
      console.log(`  ${tight}      ${bb100.toFixed(1).padStart(6)}  ±${ci.toFixed(1).padStart(5)}   ${vpip.padStart(5)}   ${ai.padStart(5)}`);
      if (bb100 > best) {
        best = bb100;
        bestT = tight;
      }
    }
    console.log(`\nbest tightness ≈ ${bestT} (bb/100 ${best.toFixed(1)})`);
    return;
  }
  if (MODE === 'roundrobin') {
    const candidates: Spec[] = [
      { name: 'search', make: search },
      { name: 'smart', make: SMART_TUNED },
      { name: 'aggro', make: (s) => createAggressiveAgent(s) },
      { name: 'tight', make: (s) => createTightAgent(s) },
      { name: 'station', make: (s) => createCallingStationAgent(s) },
      { name: 'random', make: (s) => createRandomAgent(s) },
    ];
    const results = new Map<string, Acc>();
    for (let c = 0; c < candidates.length; c++) {
      const cand = candidates[c]!;
      const accs = runMatch([cand, ...FIELD.map((f) => ({ name: 'field', make: f.make }))], HANDS, 5000 + c * 100);
      results.set(cand.name, accs.get(cand.name)!);
      process.stdout.write(`  done ${c + 1}/${candidates.length}: ${cand.name}\n`);
    }
    printTable(`=== 6-max NLHE — round-robin: each model vs the SAME fixed field (${HANDS} hands each) ===`, results);
  }
}

drive();
