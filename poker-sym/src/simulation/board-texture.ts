import { cardRank, cardSuit } from '../utils/deck.js';
import type { BoardTexture } from './types.js';

/**
 * Board texture classifier for Texas Hold'em.
 *
 * Classifies 3-card (flop) or 4-card (turn) boards into texture categories
 * based on connectedness, suit distribution, and rank characteristics.
 */

/** Get unique suits from a set of board cards. */
const uniqueSuits = (board: number[]): Set<number> => {
  const suits = new Set<number>();
  for (const card of board) {
    suits.add(cardSuit(card));
  }
  return suits;
};

/** Check if board contains a pair (two cards of same rank). */
const isPaired = (board: number[]): boolean => {
  const ranks = board.map(cardRank);
  return new Set(ranks).size < board.length;
};

/** Check if all board cards are high (rank >= 8, i.e., T+). */
const isHigh = (board: number[]): boolean => {
  return board.every((c) => cardRank(c) >= 8);
};

/** Check if all board cards are low (rank <= 6, i.e., 8-). */
const isLow = (board: number[]): boolean => {
  return board.every((c) => cardRank(c) <= 6);
};

/**
 * Check if board has straight draw potential.
 * A board has straight draw if the rank span (max - min) <= 4
 * and there are at least 3 distinct ranks within that span.
 */
const hasStraightDraw = (board: number[]): boolean => {
  const ranks = [...new Set(board.map(cardRank))].sort((a, b) => a - b);
  if (ranks.length < 3) return false;

  // Check for wheel draw (A-2-3 etc) — Ace wraps
  const hasAce = ranks.includes(12);
  if (hasAce && ranks.length >= 2) {
    const lowRanks = ranks.filter((r) => r !== 12);
    // A-2-3, A-2-3-4, etc.
    if (lowRanks[0] === 0 && lowRanks[lowRanks.length - 1]! <= 3) {
      return true;
    }
  }

  // Check consecutive span: max - min <= 4 with at least 3 ranks
  const span = ranks[ranks.length - 1]! - ranks[0]!;
  return span <= 4;
};

/**
 * Check if board is semi-connected.
 * Board has semi-connected ranks if the max span is 5-7 with at least 3 distinct ranks.
 */
const isSemiConnected = (board: number[]): boolean => {
  const ranks = [...new Set(board.map(cardRank))].sort((a, b) => a - b);
  if (ranks.length < 3) return false;
  const span = ranks[ranks.length - 1]! - ranks[0]!;
  return span >= 5 && span <= 7;
};

/**
 * Classify a board (3 or 4 cards) into texture categories.
 *
 * A board can have multiple textures (e.g., "wet" and "paired"),
 * so this returns an array. Primary classification logic:
 *
 * 1. monotone — all same suit
 * 2. wet — flush draw possible (2+ same suit) + straight draw possible
 * 3. flush-draw — 2+ cards of same suit (but no straight draw)
 * 4. straight-draw — connected ranks spanning ≤4 (but no flush draw)
 * 5. semi-connected — ranks spanning 5-7
 * 6. dry — none of the above
 *
 * Additionally:
 * - paired — board has a pair
 * - high — all cards T+
 * - low — all cards 8-
 */
export const classifyBoardTexture = (board: number[]): BoardTexture[] => {
  const textures: BoardTexture[] = [];

  if (board.length < 3) return textures;

  const suits = uniqueSuits(board);
  const suitCount = suits.size;
  const totalCards = board.length;

  // Same-suit counts
  const suitCounts = new Map<number, number>();
  for (const card of board) {
    const s = cardSuit(card);
    suitCounts.set(s, (suitCounts.get(s) ?? 0) + 1);
  }
  const maxSameSuit = Math.max(...suitCounts.values());

  const hasFlushDraw = maxSameSuit >= 2 && totalCards <= 4; // 2+ of same suit on 3-4 card board
  const isMonotone = suitCount === 1;
  const hasStraight = hasStraightDraw(board);
  const paired = isPaired(board);
  const high = isHigh(board);
  const low = isLow(board);

  // Primary texture classification
  if (isMonotone) {
    textures.push('monotone');
  } else if (hasFlushDraw && hasStraight) {
    textures.push('wet');
  } else if (hasFlushDraw) {
    textures.push('flush-draw');
  } else if (hasStraight) {
    textures.push('straight-draw');
  } else if (isSemiConnected(board)) {
    textures.push('semi-connected');
  } else {
    textures.push('dry');
  }

  // Secondary classifications
  if (paired) textures.push('paired');
  if (high) textures.push('high');
  if (low) textures.push('low');

  return textures;
};

/**
 * Get the primary (first) texture for a board.
 */
export const primaryTexture = (board: number[]): BoardTexture => {
  const textures = classifyBoardTexture(board);
  return textures[0] ?? 'dry';
};