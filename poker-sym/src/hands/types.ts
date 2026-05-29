/**
 * Types for canonical hand grouping across poker variants.
 */

/** Represents a single canonical hand group (e.g., "AKs", "TT"). */
export interface HandGroup {
  /** Canonical key (e.g., "AKs", "AKo", "TT") */
  key: string;
  /** Concrete card indices representing this group */
  cards: number[];
  /** Human-readable description */
  description: string;
}

/** Supported poker game types for hand enumeration. */
export type GameType = 'texas-holdem' | 'omaha' | 'stud';

/**
 * Classification of a 2-card hold'em hand type.
 */
export enum HoldemHandType {
  PAIR = 'pair',
  SUITED = 'suited',
  OFFSUIT = 'offsuit',
}