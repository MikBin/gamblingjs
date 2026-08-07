// Minimal re-export shim so the webapp can consume the real library symbols
// without going through the stale/broken root `src/index.ts` barrel.
export { PokerEvaluator } from '../../../src/PokerEvaluator';
export { getPartialHandStatsIndexed_7 } from '../../../src/pokerMontecarloSym';
export type { verboseHandInfo } from '../../../src/interfaces';
