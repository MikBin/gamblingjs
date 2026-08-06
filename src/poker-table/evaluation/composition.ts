import type { CompositionPool, CompositionSelector } from '../config/types';

export interface ResolvedPools {
  hole: number[];
  door: number[];
  community: number[];
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
      for (const c of combos) rec(i + 1, [...chosen, ...c]);
    }
  };
  rec(0, []);
  return results;
}
