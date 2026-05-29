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
/** Classification of a 4-card Omaha hand's suit pattern. */
export enum OmahaSuitPattern {
  MONOSUIT = 'monosuit',       // all 4 cards same suit
  DOUBLE_SUITED = 'ds',        // two cards of each of 2 suits
  THREE_ONE = 'three-one',     // 3 cards of one suit, 1 of another
  TWO_ONE_ONE = 'two-one-one', // 2 cards of one suit, 1 each of 2 others
  RAINBOW = 'rainbow',         // all 4 different suits
}

/** Classification of a 4-card Omaha hand's rank pattern. */
export enum OmahaRankPattern {
  QUADS = 'quads',       // AAAA
  TRIPS = 'trips',       // AAAB
  TWO_PAIR = 'two-pair', // AABB
  ONE_PAIR = 'one-pair', // AABC
  HIGH = 'high',         // ABCD (all different)
}
