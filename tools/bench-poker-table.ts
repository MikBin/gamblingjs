import { performance } from 'node:perf_hooks';
import {
  alwaysCallAgent,
  omahaHi,
  playHand,
  sevenStud,
  standardHoldem,
} from '../src/poker-table';
import { fastHashesCreators } from '../src/pokerHashes7';

fastHashesCreators.high();

const variants = [
  { name: 'holdem', preset: standardHoldem() },
  { name: 'omaha', preset: omahaHi() },
  { name: 'stud', preset: sevenStud() },
];
const N = 50000;

for (const v of variants) {
  const t0 = performance.now();
  for (let i = 0; i < N; i++) {
    playHand(v.preset.table, v.preset.hand, [alwaysCallAgent, alwaysCallAgent], i);
  }
  const dt = performance.now() - t0;
  console.log(`${v.name.padEnd(7)} ${N} hands in ${dt.toFixed(0)} ms -> ${Math.round((N / dt) * 1000)} hands/sec`);
}

