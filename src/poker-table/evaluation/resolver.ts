import { HighEvaluator } from '../../core/HighEvaluator';
import { fastHashesCreators, FAST_HASH_DEFINED } from '../../pokerHashes7';
import type { EvaluatorKind } from '../config/types';

const highEvaluator = new HighEvaluator();
let ensuredHigh = false;

export function ensureHighHashes(): void {
  if (!ensuredHigh) {
    if (!FAST_HASH_DEFINED.high) fastHashesCreators.high();
    ensuredHigh = true;
  }
}

export function resolveHand(hole: number[], community: number[], kind: EvaluatorKind): number {
  if (kind !== 'high') {
    throw new Error(`Evaluator "${kind}" not supported in slice 01 (high only)`);
  }
  ensureHighHashes();
  return highEvaluator.evaluate([...hole, ...community]);
}
