/**
 * Abstract base class for all poker hand evaluators.
 * Provides common functionality and defines the interface for hand evaluation.
 */
export abstract class BaseEvaluator {
  /**
   * Evaluates a poker hand and returns a numeric rank.
   * Higher ranks indicate stronger hands.
   *
   * @param hand - Array of card indices (0-51) representing the hand
   * @returns Numeric rank of the hand
   */
  abstract evaluate(hand: number[]): number;

  /**
   * Evaluates a poker hand and returns detailed information about the hand.
   *
   * @param hand - Array of card indices (0-51) representing the hand
   * @returns Detailed hand information including rank, cards, and description
   */
  abstract evaluateVerbose(hand: number[]): import('../interfaces').verboseHandInfo;

  /**
   * Validates that a hand contains the correct number of cards and valid card indices.
   *
   * @param hand - Array of card indices to validate
   * @param expectedLength - Expected number of cards in the hand
   * @returns true if the hand is valid
   * @throws Error if the hand is invalid
   */
  protected validateHand(hand: number[], expectedLength: number): boolean {
    if (!Array.isArray(hand)) {
      throw new Error('Hand must be an array');
    }

    if (hand.length !== expectedLength) {
      throw new Error(`Hand must contain exactly ${expectedLength} cards`);
    }

    for (const card of hand) {
      if (!Number.isInteger(card) || card < 0 || card > 51) {
        throw new Error(`Invalid card index: ${card}. Must be between 0 and 51`);
      }
    }

    // Check for duplicate cards
    const uniqueCards = new Set(hand);
    if (uniqueCards.size !== hand.length) {
      throw new Error('Hand contains duplicate cards');
    }

    return true;
  }

  /**
   * Normalizes a hand by sorting cards in descending order.
   * This is often required for consistent evaluation.
   *
   * @param hand - Array of card indices
   * @returns Sorted array of card indices
   */
  protected normalizeHand(hand: number[]): number[] {
    return [...hand].sort((a, b) => b - a);
  }
}
