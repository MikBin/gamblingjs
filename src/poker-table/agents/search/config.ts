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
  /** Opponent range model: 'uniform' (any unseen card equally likely) or
   *  'bayesian' (narrow the sampled range from the opponent's actions). */
  opponentModel?: 'uniform' | 'bayesian';
  /** Decision core: 'pimc' (1-ply Monte-Carlo equity, default) or 'ismcts' (tree search with UCB1). */
  core?: 'pimc' | 'ismcts';
  /** Number of determinizations sampled per IS-MCTS decision (hidden-info resamples). */
  determinizations?: number;
  // --- reserved (Phase 3): validated, consumed only when core === 'ismcts' ---
  /** UCB1 exploration constant for IS-MCTS. */
  explorationC?: number;
  /** IS-MCTS iterations per decision. */
  treeIterations?: number;
  /** IS-MCTS lookahead cap in streets. */
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
  opponentModel: 'uniform' | 'bayesian';
  core: 'pimc' | 'ismcts';
  determinizations: number;
  explorationC: number;
  treeIterations: number;
  maxDepthStreets: number;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export function resolveSearchBotConfig(c: SearchBotConfig): ResolvedSearchBotConfig {
  const om = c.opponentModel ?? 'uniform';
  if (om !== 'uniform' && om !== 'bayesian') {
    throw new Error(`opponentModel "${om}" is not supported (use 'uniform' or 'bayesian')`);
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
    opponentModel: om,
    core: c.core === 'ismcts' ? 'ismcts' : 'pimc',
    determinizations: Math.max(1, Math.floor(c.determinizations ?? 6)),
    explorationC: c.explorationC ?? 0.7,
    treeIterations: Math.max(1, Math.floor(c.treeIterations ?? 400)),
    maxDepthStreets: c.maxDepthStreets ?? 1,
  };
}
