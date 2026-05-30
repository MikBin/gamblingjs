/**
 * Types for the simulation engine.
 */

export interface SimulationConfig {
  /** Number of Monte Carlo iterations per hand */
  runs: number;
  /** Number of opponents for equity simulation (0 = raw strength only) */
  opponents: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Whether to use caching */
  useCache: boolean;
}

export interface HandStrengthResult {
  /** Canonical hand key (e.g., "AKs") */
  key: string;
  /** Average hand rank score across all runs */
  averageRank: number;
  /** Win percentage against opponents (0-100) */
  winPct: number;
  /** Tie percentage against opponents (0-100) */
  tiePct: number;
  /** Number of simulation runs */
  runs: number;

  // ─── Split-Pot / Hi-Lo Metrics ───────────────────────────────────

  /** Average low hand rank across runs where a low qualified (skip runs with no low) */
  averageLowRank?: number;
  /** Combined equity percentage (0-100) */
  equity?: number;
  /** High hand win percentage (0-100) */
  highWinPct?: number;
  /** Low hand win percentage (0-100) */
  lowWinPct?: number;
  /** Scoop percentage (wins both High and Low, or High when no Low) (0-100) */
  scoopPct?: number;

  // ─── Omaha Hi/Lo Aliases ───────────────────────────────────

  /** High hand win percentage (alias for highWinPct) */
  winHiPct?: number;
  /** Low hand win percentage (alias for lowWinPct) */
  winLoPct?: number;
}

export interface SimulationResult {
  /** Game type that was simulated */
  gameType: string;
  /** Configuration used */
  config: SimulationConfig;
  /** Results for each hand, sorted by strength */
  hands: HandStrengthResult[];
  /** Timestamp of simulation */
  timestamp: string;
}

export const DEFAULT_CONFIG: SimulationConfig = {
  runs: 10000,
  opponents: 0,
  useCache: true,
};

// ─── Street Analysis Types ───────────────────────────────────────────

/** Distribution of hand categories at a given street. */
export interface StreetCategoryDistribution {
  'high card': number;
  'one pair': number;
  'two pair': number;
  'three of a kind': number;
  straight: number;
  flush: number;
  'full house': number;
  'four of a kind': number;
  'straight flush': number;
}

/** Statistical distribution of equity at a given street. */
export interface EquityDistribution {
  mean: number;
  variance: number;
  stdDev: number;
  percentiles: {
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
  min: number;
  max: number;
}

/** Board texture classification. */
export type BoardTexture =
  | 'dry'
  | 'semi-connected'
  | 'flush-draw'
  | 'straight-draw'
  | 'wet'
  | 'monotone'
  | 'paired'
  | 'high'
  | 'low';

/** Equity stats grouped by board texture. */
export interface TextureEquity {
  texture: BoardTexture;
  count: number;
  averageRank: number;
  categoryDistribution: StreetCategoryDistribution;
}

/** Equity realization metrics. */
export interface EquityRealization {
  /** % of runs where hand category improved from previous street */
  improvementRate: number;
  /** % of runs reaching full house or better */
  nutPercentage: number;
  /** % of boards where rank exceeded median for that street */
  playabilityScore: number;
  /** % of draws at this street that converted by river (flop/turn only; 0 for river) */
  drawConversionRate: number;
}

/** Complete statistics for a single street (flop/turn/river). */
export interface StreetStats {
  averageRank: number;
  categories: StreetCategoryDistribution;
  distribution: EquityDistribution;
  textureEquity: TextureEquity[];
  realization: EquityRealization;
}

/** Per-hand result across all three streets. */
export interface StreetHandResult {
  hand: string;
  flop: StreetStats;
  turn: StreetStats;
  river: StreetStats;
}

/** Full street analysis result for all 169 hands. */
export interface StreetAnalysisResult {
  gameType: string;
  config: {
    runs: number;
    opponents: number;
    seed?: number;
  };
  hands: StreetHandResult[];
  timestamp: string;
}

/** Category names in order matching handsRankingDelimiter_5cards thresholds. */
export const HAND_CATEGORY_NAMES = [
  'high card',
  'one pair',
  'two pair',
  'three of a kind',
  'straight',
  'flush',
  'full house',
  'four of a kind',
  'straight flush',
] as const;

export type HandCategoryName = (typeof HAND_CATEGORY_NAMES)[number];
