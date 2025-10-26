import { BaseEvaluator } from './BaseEvaluator';
import { handOfFiveEvalIndexed } from '../pokerEvaluator5';
import { handOfSevenEvalIndexed, handOfSevenEvalIndexed_Verbose } from '../pokerEvaluator7';
import { verboseHandInfo } from '../interfaces';

/**
 * Evaluator for high poker hands.
 * Handles evaluation of 5-card and 7-card high poker hands.
 */
export class HighEvaluator extends BaseEvaluator {
  /**
   * Evaluates a 5-card or 7-card high poker hand.
   *
   * @param hand - Array of 5 or 7 card indices (0-51)
   * @returns Numeric rank where higher values indicate stronger hands
   */
  evaluate(hand: number[]): number {
    if (hand.length === 5) {
      this.validateHand(hand, 5);
      return handOfFiveEvalIndexed(hand[0]!, hand[1]!, hand[2]!, hand[3]!, hand[4]!);
    } else if (hand.length === 7) {
      this.validateHand(hand, 7);
      return handOfSevenEvalIndexed(hand[0]!, hand[1]!, hand[2]!, hand[3]!, hand[4]!, hand[5]!, hand[6]!);
    } else {
      throw new Error('HighEvaluator only supports 5-card and 7-card hands');
    }
  }

  /**
   * Evaluates a 7-card high poker hand and returns detailed information.
   *
   * @param hand - Array of 7 card indices (0-51)
   * @returns Detailed hand information including rank, winning cards, and flush suit
   */
  evaluateVerbose(hand: number[]): verboseHandInfo {
    this.validateHand(hand, 7);
    return handOfSevenEvalIndexed_Verbose(hand[0]!, hand[1]!, hand[2]!, hand[3]!, hand[4]!, hand[5]!, hand[6]!);
  }
}
