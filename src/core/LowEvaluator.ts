import { BaseEvaluator } from './BaseEvaluator';
import { handOfFiveEvalLow_Ato5Indexed, handOfFiveEvalHiLow8Indexed, handOfFiveEvalHiLow9Indexed } from '../pokerEvaluator5';
import { handOfSevenEvalLow_Ato5Indexed, handOfSevenEvalLow8Indexed_Verbose, handOfSevenEvalLow9Indexed_Verbose, _handOfSevenEvalHiLow8Indexed, _handOfSevenEvalHiLow9Indexed } from '../pokerEvaluator7';
import { verboseHandInfo } from '../interfaces';

/**
 * Abstract base class for low poker hand evaluators.
 * Low evaluators determine if a hand qualifies for low and rank it accordingly.
 */
export abstract class LowEvaluator extends BaseEvaluator {
  /**
   * Determines if a hand qualifies for the specific low ranking system.
   * Each low variant (A-5, 8-or-better, 9-or-better) has different qualification rules.
   *
   * @param hand - Array of card indices representing the hand
   * @returns true if the hand qualifies for low
   */
  protected abstract qualifiesForLow(hand: number[]): boolean;

  /**
   * Gets the low ranking threshold for this evaluator.
   * For example, 8 for 8-or-better, 9 for 9-or-better.
   *
   * @returns The rank threshold for qualification
   */
  protected abstract getQualificationThreshold(): number;
}

/**
 * Evaluator for A-5 lowball poker hands.
 * In A-5 lowball, aces are low and straights/flushes don't count against low hands.
 */
export class LowAto5Evaluator extends LowEvaluator {
  evaluate(hand: number[]): number {
    if (hand.length === 5) {
      this.validateHand(hand, 5);
      return handOfFiveEvalLow_Ato5Indexed(hand[0], hand[1], hand[2], hand[3], hand[4]);
    } else if (hand.length === 7) {
      this.validateHand(hand, 7);
      return handOfSevenEvalLow_Ato5Indexed(hand[0], hand[1], hand[2], hand[3], hand[4], hand[5], hand[6]);
    } else {
      throw new Error('LowAto5Evaluator only supports 5-card and 7-card hands');
    }
  }

  evaluateVerbose(hand: number[]): verboseHandInfo {
    // A-5 low doesn't have a verbose evaluator in the current implementation
    throw new Error('Verbose evaluation not implemented for A-5 low');
  }

  protected qualifiesForLow(_hand: number[]): boolean {
    // A-5 low always qualifies (straights and flushes don't count)
    return true;
  }

  protected getQualificationThreshold(): number {
    return 13; // Aces are low, so threshold is effectively all hands
  }
}

/**
 * Evaluator for 8-or-better low poker hands.
 * Only hands with no card higher than 8 qualify for low.
 */
export class Low8Evaluator extends LowEvaluator {
  evaluate(hand: number[]): number {
    if (hand.length === 5) {
      this.validateHand(hand, 5);
      const result = handOfFiveEvalHiLow8Indexed(hand[0], hand[1], hand[2], hand[3], hand[4]);
      return result.low;
    } else if (hand.length === 7) {
      this.validateHand(hand, 7);
      const result = _handOfSevenEvalHiLow8Indexed(...hand);
      return result.low;
    } else {
      throw new Error('Low8Evaluator only supports 5-card and 7-card hands');
    }
  }

  evaluateVerbose(hand: number[]): verboseHandInfo {
    this.validateHand(hand, 7);
    return handOfSevenEvalLow8Indexed_Verbose(hand[0], hand[1], hand[2], hand[3], hand[4], hand[5], hand[6]);
  }

  protected qualifiesForLow(hand: number[]): boolean {
    // Check if any card has rank higher than 8 (ranks 9-A are 0-8 in 0-based indexing)
    return hand.every(card => (card >> 2) <= 7); // Cards 0-31 are ranks 2-8
  }

  protected getQualificationThreshold(): number {
    return 8;
  }
}

/**
 * Evaluator for 9-or-better low poker hands.
 * Only hands with no card higher than 9 qualify for low.
 */
export class Low9Evaluator extends LowEvaluator {
  evaluate(hand: number[]): number {
    if (hand.length === 5) {
      this.validateHand(hand, 5);
      const result = handOfFiveEvalHiLow9Indexed(hand[0], hand[1], hand[2], hand[3], hand[4]);
      return result.low;
    } else if (hand.length === 7) {
      this.validateHand(hand, 7);
      const result = _handOfSevenEvalHiLow9Indexed(...hand);
      return result.low;
    } else {
      throw new Error('Low9Evaluator only supports 5-card and 7-card hands');
    }
  }

  evaluateVerbose(hand: number[]): verboseHandInfo {
    this.validateHand(hand, 7);
    return handOfSevenEvalLow9Indexed_Verbose(hand[0], hand[1], hand[2], hand[3], hand[4], hand[5], hand[6]);
  }

  protected qualifiesForLow(hand: number[]): boolean {
    // Check if any card has rank higher than 9 (ranks 10-A are 0-8 in 0-based indexing)
    return hand.every(card => (card >> 2) <= 8); // Cards 0-35 are ranks 2-9
  }

  protected getQualificationThreshold(): number {
    return 9;
  }
}
