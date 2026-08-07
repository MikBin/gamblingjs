import type { CompositionPool, CompositionSelector, HandPattern } from '../config/types';

export interface ResolvedPools {
  hole: number[];
  door: number[];
  community: number[];
}

function rankCounts(cards: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const c of cards) {
    const r = c % 13;
    counts.set(r, (counts.get(r) ?? 0) + 1);
  }
  return counts;
}

function isStraight(cards: number[]): boolean {
  if (cards.length !== 5) return false;
  const ranks = Array.from(new Set(cards.map((c) => c % 13))).sort((a, b) => a - b);
  if (ranks.length !== 5) return false;
  let consecutive = true;
  for (let i = 1; i < 5; i++) {
    if (ranks[i] !== ranks[i - 1]! + 1) {
      consecutive = false;
      break;
    }
  }
  if (consecutive) return true;
  // wheel: A(12),2,3,4,5 -> sorted [0,1,2,3,12]
  return ranks[0] === 0 && ranks[1] === 1 && ranks[2] === 2 && ranks[3] === 3 && ranks[4] === 12;
}

/** A per-pool pattern predicate: named ({any,pair,trips,flush,straight}) or custom. */
export function patternOk(cards: number[], pattern: HandPattern): boolean {
  if (typeof pattern === 'function') return pattern(cards);
  switch (pattern) {
    case 'any':
      return true;
    case 'pair':
      for (const v of rankCounts(cards).values()) if (v >= 2) return true;
      return false;
    case 'trips':
      for (const v of rankCounts(cards).values()) if (v >= 3) return true;
      return false;
    case 'flush':
      return cards.every((c) => Math.floor(c / 13) === Math.floor(cards[0]! / 13));
    case 'straight':
      return isStraight(cards);
    default:
      return true;
  }
}

export function poolCards(pools: ResolvedPools, name: CompositionPool['pool']): number[] {
  switch (name) {
    case 'hole':
      return pools.hole;
    case 'door':
      return pools.door;
    case 'community':
      return pools.community;
    case 'hand':
      return [...pools.hole, ...pools.door];
    default:
      return [];
  }
}

export function combinedCards(selector: CompositionSelector, pools: ResolvedPools): number[] {
  const out: number[] = [];
  for (const p of selector.pools) out.push(...poolCards(pools, p.pool));
  return out;
}

export function canUseSevenCardFastPath(
  selector: CompositionSelector,
  pools: ResolvedPools,
): boolean {
  if (selector.total !== 5) return false;
  if (selector.pools.some((p) => p.exactly !== undefined)) return false;
  if (selector.pools.some((p) => p.pattern !== undefined)) return false; // patterns need enumeration
  return combinedCards(selector, pools).length === 7;
}

function combine(arr: number[], k: number): number[][] {
  const result: number[][] = [];
  if (k <= 0) {
    result.push([]);
    return result;
  }
  if (k > arr.length) return result;
  const rec = (start: number, chosen: number[]) => {
    if (chosen.length === k) {
      result.push([...chosen]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      chosen.push(arr[i]!);
      rec(i + 1, chosen);
      chosen.pop();
    }
  };
  rec(0, []);
  return result;
}

function countOptions(pool: CompositionPool, available: number): number[] {
  const min = pool.exactly ?? pool.min ?? 0;
  const max = pool.exactly ?? pool.max ?? available;
  const upper = Math.min(max, available);
  const opts: number[] = [];
  for (let k = min; k <= upper; k++) opts.push(k);
  return opts;
}

export function enumerateCompositions(
  selector: CompositionSelector,
  pools: ResolvedPools,
): number[][] {
  const results: number[][] = [];
  const total = selector.total;
  const poolData = selector.pools.map((p) => ({ p, cards: poolCards(pools, p.pool) }));

  const rec = (i: number, chosen: number[]) => {
    if (i === poolData.length) {
      if (chosen.length === total) results.push([...chosen]);
      return;
    }
    const opts = countOptions(poolData[i]!.p, poolData[i]!.cards.length);
    for (const k of opts) {
      if (chosen.length + k > total) continue;
      const combos = combine(poolData[i]!.cards, k);
      for (const c of combos) {
        // a per-pool pattern constrains the cards chosen FROM this pool only
        if (poolData[i]!.p.pattern !== undefined && !patternOk(c, poolData[i]!.p.pattern)) continue;
        rec(i + 1, [...chosen, ...c]);
      }
    }
  };
  rec(0, []);
  return results;
}
