import { fullCardsDeckHash_5, FLUSH_MASK } from '../constants.js';
import {
  FLUSH_CHECK_FIVE,
  FLUSH_RANK_FIVE,
  HASH_RANK_FIVE,
  HASH_RANK_FIVE_LOW8,
} from '../pokerHashes5.js';
import { hiLowRank } from '../interfaces.js';

/**
 * Optimized Omaha Hi/Lo (8-or-better) evaluator.
 *
 * Pre-computes hole-card hash sums once per hand (6 pairs)
 * and board-card hash sums once per board (10 triples),
 * then inlines the flush/rank lookup for both hi and low
 * with zero function call overhead inside the hot loop.
 *
 * Modeled after OmahaEvaluator but returns {hi, low} results.
 */
export class OmahaHiLoEvaluator {
  private holeHashes: number[] = new Array(4);
  private holePairSums: number[] = new Array(6);

  /**
   * Set the 4 hole cards (card indices 0-51).
   * Call this once before evaluating multiple boards.
   */
  setHoleCards(cards: number[]): void {
    if (cards.length !== 4) {
      throw new Error('Omaha requires exactly 4 hole cards');
    }
    for (let i = 0; i < 4; i++) {
      this.holeHashes[i] = fullCardsDeckHash_5[cards[i]!]!;
    }
    let idx = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        this.holePairSums[idx++] = this.holeHashes[i]! + this.holeHashes[j]!;
      }
    }
  }

  /**
   * Evaluate the best Omaha Hi/Lo hand given 5 community cards.
   * Must call setHoleCards() first.
   * Returns { hi: best high rank, low: best low rank (or -1 if no qualifying low) }.
   */
  evaluate(board: number[]): hiLowRank {
    if (board.length !== 5) {
      throw new Error('Omaha board must contain exactly 5 cards');
    }

    const boardHashes: number[] = new Array(5);
    for (let i = 0; i < 5; i++) {
      boardHashes[i] = fullCardsDeckHash_5[board[i]!]!;
    }

    const boardTripleSums: number[] = new Array(10);
    let idx = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        for (let k = j + 1; k < 5; k++) {
          boardTripleSums[idx++] = boardHashes[i]! + boardHashes[j]! + boardHashes[k]!;
        }
      }
    }

    let bestHi = -Infinity;
    let bestLo = -1;

    for (let h = 0; h < 6; h++) {
      const holeSum = this.holePairSums[h]!;
      for (let b = 0; b < 10; b++) {
        const totalSum = holeSum + boardTripleSums[b]!;
        const rankKey = totalSum >>> 9;
        const flushCheck = FLUSH_CHECK_FIVE[totalSum & FLUSH_MASK] ?? -1;

        // Hi rank (same logic as OmahaEvaluator)
        const hi = flushCheck >= 0 ? FLUSH_RANK_FIVE[rankKey]! : HASH_RANK_FIVE[rankKey]!;
        if (hi > bestHi) bestHi = hi;

        // Low rank (8-or-better qualifier)
        const low = HASH_RANK_FIVE_LOW8[rankKey];
        if (low !== undefined && !isNaN(low) && (bestLo === -1 || low > bestLo)) {
          bestLo = low;
        }
      }
    }
    return { hi: bestHi, low: bestLo };
  }

  /**
   * One-shot evaluation for a single hole + board combination.
   */
  static evaluateOnce(holeCards: number[], board: number[]): hiLowRank {
    const evaluator = new OmahaHiLoEvaluator();
    evaluator.setHoleCards(holeCards);
    return evaluator.evaluate(board);
  }
}
