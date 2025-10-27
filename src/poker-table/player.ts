// Player agents and profiles that decide actions given a HandContext

import type { ActionDecision, AllowedAction, HandContext } from './types';

export interface PlayerProfileConfig {
  // 0..1 looseness: propensity to play more hands / avoid folding
  looseness: number;
  // 0..1 aggressiveness: propensity to bet/raise vs check/call
  aggressiveness: number;
  // Optional knobs
  bluffFactor?: number;     // baseline chance to take aggressive action with weak context (default 0.05)
  raiseSizeFactor?: number; // fraction of pot or toCall used for raise sizing (default 0.6)
}

export interface PlayerAgent {
  onHandStart(ctx: Omit<HandContext, 'allowedActions' | 'toCall' | 'minRaise' | 'maxBet'>): void;
  onStreetChange(ctx: Omit<HandContext, 'allowedActions' | 'toCall' | 'minRaise' | 'maxBet'>): void;
  decideAction(ctx: HandContext): ActionDecision;
}

export type PlayerPreset =
  | 'NIT'
  | 'ROCK'
  | 'TIGHT_PASSIVE'
  | 'TAG'
  | 'ABC'
  | 'LAG'
  | 'BULLY'
  | 'LOOSE_PASSIVE'
  | 'CALLING_STATION'
  | 'FISH'
  | 'WHALE'
  | 'GAMBLER'
  | 'MANIAC';

export const PLAYER_PRESETS: Record<PlayerPreset, Required<PlayerProfileConfig>> = {
  // Very tight, folds most hands, low aggression
  NIT: { looseness: 0.08, aggressiveness: 0.35, bluffFactor: 0.01, raiseSizeFactor: 0.55 },
  ROCK: { looseness: 0.06, aggressiveness: 0.25, bluffFactor: 0.01, raiseSizeFactor: 0.50 },
  // Tight-passive and ABC straightforward styles
  TIGHT_PASSIVE: { looseness: 0.18, aggressiveness: 0.22, bluffFactor: 0.02, raiseSizeFactor: 0.50 },
  ABC: { looseness: 0.18, aggressiveness: 0.50, bluffFactor: 0.03, raiseSizeFactor: 0.55 },
  // Solid aggressive styles
  TAG: { looseness: 0.22, aggressiveness: 0.60, bluffFactor: 0.04, raiseSizeFactor: 0.60 },
  LAG: { looseness: 0.38, aggressiveness: 0.65, bluffFactor: 0.08, raiseSizeFactor: 0.65 },
  BULLY: { looseness: 0.35, aggressiveness: 0.85, bluffFactor: 0.10, raiseSizeFactor: 0.90 },
  // Loose-passive and calling station styles
  LOOSE_PASSIVE: { looseness: 0.45, aggressiveness: 0.25, bluffFactor: 0.04, raiseSizeFactor: 0.55 },
  CALLING_STATION: { looseness: 0.48, aggressiveness: 0.12, bluffFactor: 0.01, raiseSizeFactor: 0.50 },
  // Recreational/weak
  FISH: { looseness: 0.50, aggressiveness: 0.20, bluffFactor: 0.02, raiseSizeFactor: 0.55 },
  WHALE: { looseness: 0.60, aggressiveness: 0.25, bluffFactor: 0.03, raiseSizeFactor: 0.60 },
  // High variance gamblers / maniacs
  GAMBLER: { looseness: 0.55, aggressiveness: 0.75, bluffFactor: 0.15, raiseSizeFactor: 0.80 },
  MANIAC: { looseness: 0.58, aggressiveness: 0.88, bluffFactor: 0.12, raiseSizeFactor: 0.75 },
};

export function createPlayer(id: string, presetOrProfile: PlayerPreset | PlayerProfileConfig, rng: () => number = Math.random): BasePlayer {
  const profile: Required<PlayerProfileConfig> = (typeof presetOrProfile === 'string')
    ? PLAYER_PRESETS[presetOrProfile]
    : ({ bluffFactor: 0.05, raiseSizeFactor: 0.6, ...presetOrProfile } as Required<PlayerProfileConfig>);
  return new BasePlayer(id, profile, rng);
}

export class BasePlayer implements PlayerAgent {
  readonly id: string;
  protected profile: Required<PlayerProfileConfig>;
  protected rng: () => number;

  constructor(id: string, profile: PlayerProfileConfig, rng: () => number = Math.random) {
    this.id = id;
    this.rng = rng;
    this.profile = {
      bluffFactor: 0.05,
      raiseSizeFactor: 0.6,
      ...profile,
    } as Required<PlayerProfileConfig>;
  }

  onHandStart(_ctx: Omit<HandContext, 'allowedActions' | 'toCall' | 'minRaise' | 'maxBet'>): void {}
  onStreetChange(_ctx: Omit<HandContext, 'allowedActions' | 'toCall' | 'minRaise' | 'maxBet'>): void {}

  decideAction(ctx: HandContext): ActionDecision {
    const { allowedActions, toCall, pot } = ctx;
    const can = (a: AllowedAction) => allowedActions.includes(a);

    // Simple heuristics using looseness/aggressiveness only
    const L = clamp01(this.profile.looseness);
    const A = clamp01(this.profile.aggressiveness);

    // Fold threshold: if facing a bet and very tight, fold more often
    if (toCall > 0 && can('fold')) {
      const foldProb = (1 - L) * sigmoid(toCall / Math.max(1, pot + toCall));
      if (this.rng() < foldProb && !can('call')) return { action: 'fold' };
      if (this.rng() < foldProb * 0.8) return { action: 'fold' };
    }

    // If no call required
    if (toCall === 0) {
      // Consider betting/raising based on aggressiveness
      if (can('bet') || can('raise')) {
        const aggroProb = A + this.profile.bluffFactor * (1 - L);
        if (this.rng() < aggroProb) {
          const base = Math.max(toCall, Math.floor((pot || 2) * this.profile.raiseSizeFactor));
          const amt = Math.max(1, base);
          if (can('bet')) return { action: 'bet', amount: amt };
          return { action: 'raise', amount: amt };
        }
      }
      if (can('check')) return { action: 'check' };
    }

    // Facing a call
    if (toCall > 0) {
      const raiseProb = A * (0.6 + 0.4 * L);
      if ((can('raise') || can('bet')) && this.rng() < raiseProb) {
        const base = Math.max(toCall + 1, Math.floor((pot + toCall) * this.profile.raiseSizeFactor));
        return { action: can('raise') ? 'raise' : 'bet', amount: base };
      }
      if (can('call')) return { action: 'call' };
      if (can('fold')) return { action: 'fold' };
    }

    // Fallback
    if (can('check')) return { action: 'check' };
    return { action: 'fold' };
  }
}

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-6 * (x - 0.5))); }
