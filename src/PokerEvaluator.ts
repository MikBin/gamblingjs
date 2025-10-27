import { HighEvaluator } from './core/HighEvaluator';
import { LowAto5Evaluator, Low8Evaluator, Low9Evaluator } from './core/LowEvaluator';
import { TexasHoldemEvaluator, TexasHoldemGameType } from './variants/TexasHoldem';
import { verboseHandInfo, hiLowRank } from './interfaces';
import { fastHashesCreators } from './pokerHashes7';

/**
 * Enumeration of supported poker game variants.
 */
export enum GameVariant {
  HIGH = 'high',
  LOW_A_TO_5 = 'low-a-to-5',
  LOW_8_OR_BETTER = 'low-8-or-better',
  LOW_9_OR_BETTER = 'low-9-or-better',
  TEXAS_HOLDEM = 'texas-holdem'
}

/**
 * Main poker evaluator class providing a unified interface for all poker hand evaluation.
 * This is the primary API for evaluating poker hands across different game variants.
 */
export class PokerEvaluator {
  private highEvaluator: HighEvaluator;
  private lowAto5Evaluator: LowAto5Evaluator;
  private low8Evaluator: Low8Evaluator;
  private low9Evaluator: Low9Evaluator;
  private texasHoldemEvaluator: TexasHoldemEvaluator;

  constructor() {
    // Load hash tables for 7-card evaluations
    fastHashesCreators.high();
    fastHashesCreators.Ato5();
    fastHashesCreators.Ato6();
    fastHashesCreators.low8();
    fastHashesCreators.low9();
    fastHashesCreators['2to7']();

    this.highEvaluator = new HighEvaluator();
    this.lowAto5Evaluator = new LowAto5Evaluator();
    this.low8Evaluator = new Low8Evaluator();
    this.low9Evaluator = new Low9Evaluator();
    this.texasHoldemEvaluator = new TexasHoldemEvaluator();
  }

  /**
   * Evaluates a 5-card poker hand.
   *
   * @param hand - Array of 5 card indices (0-51)
   * @param variant - The game variant to evaluate for
   * @returns Numeric rank (higher is better for high, lower is better for low)
   */
  static evaluate5Cards(hand: number[], variant: GameVariant = GameVariant.HIGH): number {
    const evaluator = new PokerEvaluator();
    return evaluator.evaluate(hand, variant);
  }

  /**
   * Evaluates a 7-card poker hand.
   *
   * @param hand - Array of 7 card indices (0-51)
   * @param variant - The game variant to evaluate for
   * @returns Numeric rank (higher is better for high, lower is better for low)
   */
  static evaluate7Cards(hand: number[], variant: GameVariant = GameVariant.HIGH): number {
    if (hand.length !== 7) {
      throw new Error('evaluate7Cards requires exactly 7 cards');
    }
    const evaluator = new PokerEvaluator();
    return evaluator.evaluate(hand, variant);
  }

  /**
   * Evaluates a 7-card poker hand and returns detailed information.
   *
   * @param hand - Array of 7 card indices (0-51)
   * @param variant - The game variant to evaluate for
   * @returns Detailed hand information including rank, winning cards, and description
   */
  static evaluate7CardsVerbose(hand: number[], variant: GameVariant = GameVariant.HIGH): verboseHandInfo {
    const evaluator = new PokerEvaluator();
    return evaluator.evaluateVerbose(hand, variant);
  }

  /**
   * Evaluates a Texas Hold'em hand with hole cards and community cards.
   *
   * @param holeCards - Array of 2 card indices for hole cards
   * @param communityCards - Array of 3-5 card indices for community cards
   * @param gameType - The type of Texas Hold'em game
   * @returns High-low ranking result
   */
  static evaluateTexasHoldem(
    holeCards: number[],
    communityCards: number[],
    gameType: TexasHoldemGameType = TexasHoldemGameType.HIGH_ONLY
  ): hiLowRank {
    const evaluator = new PokerEvaluator();
    return evaluator.texasHoldemEvaluator.evaluateHand(holeCards, communityCards, gameType);
  }

  /**
   * Evaluates a poker hand using the specified variant.
   *
   * @param hand - Array of card indices (5 or 7 cards)
   * @param variant - The game variant to evaluate for
   * @returns Numeric rank
   */
  evaluate(hand: number[], variant: GameVariant = GameVariant.HIGH): number {
    switch (variant) {
      case GameVariant.HIGH:
        return this.highEvaluator.evaluate(hand);

      case GameVariant.LOW_A_TO_5:
        return this.lowAto5Evaluator.evaluate(hand);

      case GameVariant.LOW_8_OR_BETTER:
        return this.low8Evaluator.evaluate(hand);

      case GameVariant.LOW_9_OR_BETTER:
        return this.low9Evaluator.evaluate(hand);

      default:
        throw new Error(`Unsupported game variant: ${variant}`);
    }
  }

  /**
   * Evaluates a poker hand and returns detailed information.
   * Currently only supports 7-card high hands for verbose evaluation.
   *
   * @param hand - Array of card indices (must be 7 cards for verbose evaluation)
   * @param variant - The game variant to evaluate for
   * @returns Detailed hand information
   */
  evaluateVerbose(hand: number[], variant: GameVariant = GameVariant.HIGH): verboseHandInfo {
    if (hand.length !== 7) {
      throw new Error('Verbose evaluation currently only supports 7-card hands');
    }

    switch (variant) {
      case GameVariant.HIGH:
        return this.highEvaluator.evaluateVerbose(hand);

      case GameVariant.LOW_8_OR_BETTER:
        return this.low8Evaluator.evaluateVerbose(hand);

      case GameVariant.LOW_9_OR_BETTER:
        return this.low9Evaluator.evaluateVerbose(hand);

      case GameVariant.LOW_A_TO_5:
        throw new Error('Verbose evaluation not implemented for A-5 low');

      default:
        throw new Error(`Verbose evaluation not supported for variant: ${variant}`);
    }
  }
}

// Export the enum for external use
export { TexasHoldemGameType };
