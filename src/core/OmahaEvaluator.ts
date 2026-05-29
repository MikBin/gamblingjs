import { fullCardsDeckHash_5, FLUSH_MASK } from '../constants.js';
import { FLUSH_CHECK_FIVE, FLUSH_RANK_FIVE, HASH_RANK_FIVE } from '../pokerHashes5.js';

/**
 * Optimized Omaha Hi evaluator.
 *
 * Pre-computes hole-card hash sums once per hand (6 pairs)
 * and board-card hash sums once per board (10 triples),
 * then inlines the flush/rank lookup with zero function calls.
 */
export class OmahaEvaluator {
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
   * Evaluate the best Omaha hand given 5 community cards.
   * Must call setHoleCards() first.
   */
  evaluate(board: number[]): number {
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

    let best = -Infinity;
    for (let h = 0; h < 6; h++) {
      const holeSum = this.holePairSums[h]!;
      for (let b = 0; b < 10; b++) {
        const totalSum = holeSum + boardTripleSums[b]!;
        const rankKey = totalSum >>> 9;
        const flushCheck = FLUSH_CHECK_FIVE[totalSum & FLUSH_MASK] ?? -1;
        const score = flushCheck >= 0 ? FLUSH_RANK_FIVE[rankKey]! : HASH_RANK_FIVE[rankKey]!;
        if (score > best) best = score;
      }
    }
    return best;
  }

  /**
   * One-shot evaluation for a single hole + board combination.
   */
  static evaluateOnce(holeCards: number[], board: number[]): number {
    const evaluator = new OmahaEvaluator();
    evaluator.setHoleCards(holeCards);
    return evaluator.evaluate(board);
  }
}
