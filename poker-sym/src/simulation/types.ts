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