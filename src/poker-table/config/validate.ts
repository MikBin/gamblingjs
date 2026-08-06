import type { HandConfig } from './types';

const validated = new WeakMap<HandConfig, true>();

export function dealtCounts(handCfg: HandConfig): {
  hole: number;
  door: number;
  community: number;
} {
  let hole = 0;
  let door = 0;
  let community = 0;
  for (const s of handCfg.streets) {
    hole += s.deal.holeDown;
    door += s.deal.playerUp;
    community += s.deal.community;
  }
  return { hole, door, community };
}

export function validateHandConfig(handCfg: HandConfig): void {
  if (validated.has(handCfg)) return;
  if (!handCfg.streets.length) {
    throw new Error('handConfig must define at least one street');
  }
  if (handCfg.stacks.buyIn <= 0) {
    throw new Error('stacks.buyIn must be positive');
  }
  const counts = dealtCounts(handCfg);
  const available: Record<string, number> = {
    hole: counts.hole,
    door: counts.door,
    community: counts.community,
    hand: counts.hole + counts.door,
  };

  const selector = handCfg.evaluation.composition;
  const seen = new Set<string>();
  let minTotal = 0;
  let maxTotal = 0;
  for (const p of selector.pools) {
    if (seen.has(p.pool)) {
      throw new Error(`composition pool "${p.pool}" referenced more than once`);
    }
    seen.add(p.pool);
    const a = available[p.pool] ?? 0;
    if (p.exactly !== undefined) {
      if (p.exactly < 0 || p.exactly > a) {
        throw new Error(`pool "${p.pool}" exactly ${p.exactly} not satisfiable (available ${a})`);
      }
      minTotal += p.exactly;
      maxTotal += p.exactly;
    } else {
      const lo = p.min ?? 0;
      const hi = Math.min(p.max ?? a, a);
      if (lo < 0 || lo > hi) {
        throw new Error(`pool "${p.pool}" range [${lo},${p.max ?? a}] invalid (available ${a})`);
      }
      minTotal += lo;
      maxTotal += hi;
    }
    if (typeof p.pattern === 'string') {
      const selectable = p.exactly ?? p.max ?? a;
      const required =
        p.pattern === 'pair' ? 2 : p.pattern === 'trips' ? 3 : p.pattern === 'straight' ? 5 : 0;
      if (required > 0 && selectable < required) {
        throw new Error(
          `pool "${p.pool}" pattern "${p.pattern}" needs >= ${required} selectable cards (got ${selectable})`,
        );
      }
    }
  }
  if (selector.total < minTotal || selector.total > maxTotal) {
    throw new Error(
      `composition total ${selector.total} unreachable (feasible [${minTotal},${maxTotal}])`,
    );
  }
  validated.set(handCfg, true);
}
