import { BaseEvaluator } from '../core/BaseEvaluator';
import { HighEvaluator } from '../core/HighEvaluator';
import { Low8Evaluator, Low9Evaluator } from '../core/LowEvaluator';
import { bestFiveOnXHiLowIndexed } from '../pokerEvaluator5';
import { verboseHandInfo, hiLowRank } from '../interfaces';

/**
 * Enumeration of supported Texas Hold'em game types.
 */
export enum TexasHoldemGameType {
  HIGH_ONLY = 'high-only',
  HIGH_LOW_8 = 'high-low-8',
  HIGH_LOW_9 = 'high-low-9'
}

/**
 * Texas Hold'em poker variant evaluator.
 * Handles evaluation of hands in the context of Texas Hold'em poker,
 * where players have 2 hole cards and share 5 community cards.
 */
export class TexasHoldemEvaluator extends BaseEvaluator {
  private highEvaluator: HighEvaluator;
  private low8Evaluator: Low8Evaluator;
  private low9Evaluator: Low9Evaluator;

  constructor() {
    super();
    this.highEvaluator = new HighEvaluator();
    this.low8Evaluator = new Low8Evaluator();
    this.low9Evaluator = new Low9Evaluator();
  }

  /**
   * Evaluates a Texas Hold'em hand given hole cards and community cards.
   *
   * @param holeCards - Array of 2 card indices representing the player's hole cards
   * @param communityCards - Array of 3-5 card indices representing the community cards
   * @param gameType - The type of game being played (high-only, high-low-8, or high-low-9)
   * @returns Evaluation result containing high and/or low rankings
   */
  evaluateHand(
    holeCards: number[],
    communityCards: number[],
    gameType: TexasHoldemGameType = TexasHoldemGameType.HIGH_ONLY
  ): hiLowRank {
    this.validateTexasHoldemHand(holeCards, communityCards);

    const allCards = [...holeCards, ...communityCards];

    switch (gameType) {
      case TexasHoldemGameType.HIGH_ONLY:
        const highRank = this.highEvaluator.evaluate(allCards);
        return { hi: highRank, low: -1 };

      case TexasHoldemGameType.HIGH_LOW_8:
        return this.evaluateHighLow(allCards, this.low8Evaluator);

      case TexasHoldemGameType.HIGH_LOW_9:
        return this.evaluateHighLow(allCards, this.low9Evaluator);

      default:
        throw new Error(`Unsupported game type: ${gameType}`);
    }
  }

  /**
   * Evaluates the best 5-card hand from 7 available cards.
   * This is the standard evaluation for Texas Hold'em showdown.
   *
   * @param cards - Array of 7 card indices (2 hole + 5 community)
   * @returns Numeric rank of the best 5-card high hand
   */
  evaluate(cards: number[]): number {
    this.validateHand(cards, 7);
    return this.highEvaluator.evaluate(cards);
  }

  /**
   * Evaluates a 7-card hand and returns detailed information about the best 5-card hand.
   *
   * @param cards - Array of 7 card indices
   * @returns Detailed hand information
   */
  evaluateVerbose(cards: number[]): verboseHandInfo {
    this.validateHand(cards, 7);
    return this.highEvaluator.evaluateVerbose(cards);
  }

  /**
   * Validates Texas Hold'em hand structure.
   *
   * @param holeCards - Player's hole cards (should be exactly 2)
   * @param communityCards - Community cards (should be 3-5)
   * @throws Error if the hand structure is invalid
   */
  private validateTexasHoldemHand(holeCards: number[], communityCards: number[]): void {
    if (!Array.isArray(holeCards) || holeCards.length !== 2) {
      throw new Error('Texas Hold\'em requires exactly 2 hole cards');
    }

    if (!Array.isArray(communityCards) || communityCards.length < 3 || communityCards.length > 5) {
      throw new Error('Texas Hold\'em requires 3-5 community cards');
    }

    // Validate all cards
    this.validateHand(holeCards, 2);
    this.validateHand(communityCards, communityCards.length);

    // Check for duplicate cards between hole and community
    const allCards = [...holeCards, ...communityCards];
    const uniqueCards = new Set(allCards);
    if (uniqueCards.size !== allCards.length) {
      throw new Error('Duplicate cards found between hole cards and community cards');
    }
  }

  /**
   * Evaluates both high and low components of a split-pot game.
   *
   * @param cards - Array of 7 card indices
   * @param lowEvaluator - The low evaluator to use (8-or-better or 9-or-better)
   * @returns High-low ranking result
   */
  private evaluateHighLow(cards: number[], lowEvaluator: Low8Evaluator | Low9Evaluator): hiLowRank {
    // Use the existing brute force function for high-low evaluation
    return bestFiveOnXHiLowIndexed(
      (hand: number[]) => lowEvaluator.evaluate(hand),
      cards
    );
  }
}
