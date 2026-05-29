import { HandStrengthResult } from '../simulation/types.js';

/**
 * Tier definitions for hand classification.
 * Based on traditional poker hand groupings (Sklansky-Chubukov inspired).
 */
export interface TierDefinition {
  name: string;
  color: string;
  description: string;
}

export const TIERS: TierDefinition[] = [
  { name: 'Tier 1', color: '#22c55e', description: 'Premium hands (top 5%)' },
  { name: 'Tier 2', color: '#84cc16', description: 'Strong hands (5-15%)' },
  { name: 'Tier 3', color: '#eab308', description: 'Playable hands (15-30%)' },
  { name: 'Tier 4', color: '#f97316', description: 'Marginal hands (30-50%)' },
  { name: 'Tier 5', color: '#ef4444', description: 'Weak hands (50-75%)' },
  { name: 'Tier 6', color: '#991b1b', description: 'Trash hands (75-100%)' },
];

export interface TieredHand extends HandStrengthResult {
  tier: number;
  tierName: string;
  rank: number;
}

/**
 * Assign tiers to simulation results based on their ranking position.
 */
export const assignTiers = (hands: HandStrengthResult[]): TieredHand[] => {
  return hands.map((hand, index) => {
    const pct = index / hands.length;
    let tier: number;
    if (pct < 0.05) tier = 0;
    else if (pct < 0.15) tier = 1;
    else if (pct < 0.30) tier = 2;
    else if (pct < 0.50) tier = 3;
    else if (pct < 0.75) tier = 4;
    else tier = 5;

    return {
      ...hand,
      tier,
      tierName: TIERS[tier]!.name,
      rank: index + 1,
    };
  });
};