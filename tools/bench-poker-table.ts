import { performance } from 'node:perf_hooks';
import { playHand, standardHoldem, alwaysCallAgent } from '../src/poker-table';
import { fastHashesCreators } from '../src/pokerHashes7';

fastHashesCreators.high();

const hu = standardHoldem({ sb: 1, bb: 2, stack: 200 });
const N = 100000;
const t0 = performance.now();
for (let i = 0; i < N; i++) {
  playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], i);
}
const dt = performance.now() - t0;
console.log(`${N} hands in ${dt.toFixed(0)} ms -> ${Math.round((N / dt) * 1000)} hands/sec`);
