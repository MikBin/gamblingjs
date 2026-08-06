import type { PotTier } from './state';

export interface PotRefund {
  seat: number;
  amount: number;
}

export type BuiltTier = Omit<PotTier, 'winners'>;

export interface PotBuildResult {
  tiers: BuiltTier[];
  refund: PotRefund | null;
}

/**
 * Construct main + side pot tiers from total per-seat contributions.
 *
 * @param wagered     total staked this hand per seat (antes + bring-in + all streets)
 * @param eligibleFor whether each seat may win (not folded / not out)
 *
 * Folded seats keep their money in the tiers but are excluded from eligibility.
 * The uncalled total overbet (a unique maximum beyond the second-highest
 * contribution) is refunded to the over-bettor.
 */
export function buildPots(wagered: number[], eligibleFor: boolean[]): PotBuildResult {
  const n = wagered.length;
  const w = wagered.slice();

  let refund: PotRefund | null = null;
  let max1 = -1;
  let max2 = -1;
  let maxIdx = -1;
  let maxCount = 0;
  for (let i = 0; i < n; i++) {
    const v = w[i]!;
    if (v > max1) {
      max2 = max1;
      max1 = v;
      maxIdx = i;
      maxCount = 1;
    } else if (v === max1) {
      maxCount++;
    } else if (v > max2) {
      max2 = v;
    }
  }
  if (maxCount === 1 && max2 >= 0 && max1 > max2) {
    const r = max1 - max2;
    w[maxIdx] = max2;
    refund = { seat: maxIdx, amount: r };
  }

  const levels = Array.from(new Set(w.filter((x) => x > 0))).sort((a, b) => a - b);
  const tiers: BuiltTier[] = [];
  let prev = 0;
  for (const cur of levels) {
    let count = 0;
    const eligible: number[] = [];
    for (let i = 0; i < n; i++) {
      if (w[i]! >= cur) {
        count++;
        if (eligibleFor[i]) eligible.push(i);
      }
    }
    tiers.push({ amount: (cur - prev) * count, eligible });
    prev = cur;
  }

  // An uncontested tier (every contributor folded) is dead money: roll its
  // amount into the lowest tier that still has an eligible winner.
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (tiers[i]!.eligible.length === 0 && tiers[i]!.amount > 0) {
      const target = tiers.findIndex((t) => t.eligible.length > 0);
      if (target !== -1) {
        tiers[target]!.amount += tiers[i]!.amount;
        tiers.splice(i, 1);
      }
    }
  }
  return { tiers, refund };
}
