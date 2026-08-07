/**
 * Tunable personality + difficulty for {@link createSearchAgent}. The decision
 * core is Monte-Carlo equity (no training); these knobs dial randomness,
 * aggression and search effort. Every field is optional with sane defaults.
 *
 * Forward-compatible: Phase-2 (opponent modelling) and Phase-3 (IS-MCTS) knobs
 * are declared now and validated, but unused by the Phase-1 rollout.
 */
export interface SearchBotConfig {
  /** Seed for the agent's sole `RngSource`. A fixed seed reproduces the hand. */
  seed: number;
  /** Monte-Carlo samples per equity estimate. Higher = sharper, slower. */
  equitySamples?: number;
  /**
   * Softmax temperature over action utilities. 0 = greedy (strongest play);
   * higher = noisier (weaker, more random). The primary difficulty dial.
   */
  temperature?: number;
  /** 0..1 willingness to bet/raise instead of check/call. */
  aggression?: number;
  /** 0..1 how far above the break-even pot-odds point to demand before continuing. */
  tightness?: number;
  /** 0..1 chance of betting/raising a weak hand when the action is free. */
  bluffFrequency?: number;
  /** 0..1 slack on the pot-odds break-even test (0 = exact break-even). */
  potOddsTolerance?: number;
  /** Gaussian bet sizing as a fraction of [min, max] (mean in 0..1, sigma spread). */
  sizing?: { mean: number; sigma: number };
  /** Phase 1 supports 'uniform' only; 'bayesian' is reserved for Phase 2. */
  opponentModel?: 'uniform';
  // --- reserved (Phase 2/3): validated, not consumed by the rollout ---
  /** UCB1 exploration constant for IS-MCTS (Phase 3). */
  explorationC?: number;
  /** IS-MCTS iterations per decision (Phase 3). */
  treeIterations?: number;
  /** IS-MCTS lookahead cap in streets (Phase 3). */
  maxDepthStreets?: number;
}

export interface ResolvedSearchBotConfig {
  seed: number;
  equitySamples: number;
  temperature: number;
  aggression: number;
  tightness: number;
  bluffFrequency: number;
  potOddsTolerance: number;
  sizing: { mean: number; sigma: number };
  opponentModel: 'uniform';
  explorationC: number;
  treeIterations: number;
  maxDepthStreets: number;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export function resolveSearchBotConfig(c: SearchBotConfig): ResolvedSearchBotConfig {
  if (c.opponentModel !== undefined && c.opponentModel !== 'uniform') {
    throw new Error(
      `opponentModel "${c.opponentModel}" is not implemented (Phase 1: 'uniform' only)`,
    );
  }
  const es = c.equitySamples ?? 600;
  if (!Number.isFinite(es) || es < 0) throw new Error('equitySamples must be >= 0');
  if ((c.bluffFrequency ?? 0) < 0 || (c.bluffFrequency ?? 0) > 1) {
    throw new Error('bluffFrequency must be in [0, 1]');
  }
  return {
    seed: c.seed >>> 0,
    equitySamples: Math.floor(es),
    temperature: Math.max(0, c.temperature ?? 0.25),
    aggression: clamp01(c.aggression ?? 0.5),
    tightness: clamp01(c.tightness ?? 0.4),
    bluffFrequency: clamp01(c.bluffFrequency ?? 0.05),
    potOddsTolerance: clamp01(c.potOddsTolerance ?? 0.05),
    sizing: c.sizing ?? { mean: 0.6, sigma: 0.2 },
    opponentModel: 'uniform',
    explorationC: c.explorationC ?? 0.7,
    treeIterations: c.treeIterations ?? 10000,
    maxDepthStreets: c.maxDepthStreets ?? 1,
  };
}
