import { cardIndex } from '../utils/deck.js';
import { HandGroup, HoldemHandType } from './types.js';

/**
 * Canonical hand grouping utilities.
 *
 * In poker, suits are irrelevant for preflop hand strength (except for flush potential).
 * KsJs is equivalent to KdJd for suited hands, and KsJd is equivalent to KdJs for offsuit.
 *
 * For Texas Hold'em, there are exactly 169 canonical starting hands:
 * - 13 pairs (AA, KK, ..., 22)
 * - 78 suited combos (AKs, AQs, ..., 32s)
 * - 78 offsuit combos (AKo, AQo, ..., 32o)
 */

/** Rank index to face symbol: 0='2', 1='3', ..., 12='A'. */
const RANK_SYMBOLS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;

/** Map rank index (0-12) to face symbol. */
export const rankSym = (r: number): string => RANK_SYMBOLS[r]!;

/**
 * Build a canonical key for a 2-card hold'em hand.
 * Format: "AA" for pairs, "AKs" for suited, "AKo" for offsuit.
 * Always uses high-rank-first notation.
 */
export const holdemKey = (rank1: number, rank2: number, suited: boolean): string => {
  const [hi, lo] = rank1 >= rank2 ? [rank1, rank2] : [rank2, rank1];
  if (hi === lo) return `${rankSym(hi)}${rankSym(lo)}`;
  return `${rankSym(hi)}${rankSym(lo)}${suited ? 's' : 'o'}`;
};

/**
 * Determine the hand type of a 2-card hold'em hand.
 */
export const holdemHandType = (rank1: number, rank2: number, suited: boolean): HoldemHandType => {
  if (rank1 === rank2) return HoldemHandType.PAIR;
  return suited ? HoldemHandType.SUITED : HoldemHandType.OFFSUIT;
};

/**
 * Build a human-readable description for a canonical hand.
 */
export const holdemDescription = (key: string): string => {
  const isPair = key.length === 2;
  if (isPair) return `Pocket ${key[0]}s`;
  const suited = key[2] === 's';
  const qualifier = suited ? 'suited' : 'offsuit';
  return `${key[0]}${key[1]} ${qualifier}`;
};