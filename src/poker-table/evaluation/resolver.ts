import { HighEvaluator } from '../../core/HighEvaluator';
import { fastHashesCreators, FAST_HASH_DEFINED } from '../../pokerHashes7';
import type { CompositionSelector, EvaluatorKind, RankingDirection } from '../config/types';
import {
  canUseSevenCardFastPath,
  combinedCards,
  enumerateCompositions,
  type ResolvedPools,
} from './composition';

const highEvaluator = new HighEvaluator();
let ensuredHigh = false;

export function ensureHighHashes(): void {
  if (!ensuredHigh) {
    if (!FAST_HASH_DEFINED.high) fastHashesCreators.high();
    ensuredHigh = true;
  }
}

function getEvaluator(kind: EvaluatorKind): (cards: number[]) => number {
  if (kind !== 'high') {
    throw new Error(`Evaluator "${kind}" not supported yet (slice 04 wires high only)`);
  }
  ensureHighHashes();
  return (cards: number[]) => highEvaluator.evaluate(cards);
}

export interface HandResolution {
  rank: number;
  cards: number[];
}

export function resolveHand(
  pools: ResolvedPools,
  selector: CompositionSelector,
  kind: EvaluatorKind,
  ranking: RankingDirection,
): HandResolution {
  const evalFn = getEvaluator(kind);
  const preferLower = ranking === 'low-wins';

  if (canUseSevenCardFastPath(selector, pools)) {
    const cards = combinedCards(selector, pools);
    return { rank: evalFn(cards), cards };
  }

  const combos = enumerateCompositions(selector, pools);
  if (combos.length === 0) {
    return { rank: preferLower ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY, cards: [] };
  }
  let bestRank = evalFn(combos[0]!);
  let bestCards = combos[0]!;
  for (let i = 1; i < combos.length; i++) {
    const r = evalFn(combos[i]!);
    if ((preferLower && r < bestRank) || (!preferLower && r > bestRank)) {
      bestRank = r;
      bestCards = combos[i]!;
    }
  }
  return { rank: bestRank, cards: bestCards };
}
