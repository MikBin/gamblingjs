// Main entry point for the enhanced gamblingjs library

// Export the new unified API
export { PokerEvaluator, GameVariant, TexasHoldemGameType } from './PokerEvaluator';

// Export evaluators for advanced usage
export { HighEvaluator } from './core/HighEvaluator';
export { LowAto5Evaluator, Low8Evaluator, Low9Evaluator } from './core/LowEvaluator';
export { TexasHoldemEvaluator } from './variants/TexasHoldem';

// Export utilities
export * from './utils/CardUtils';
export * from './utils/ValidationUtils';

// Export types and interfaces
export type {
  verboseHandInfo,
  hiLowRank,
  HiLowVerboseHandInfo,
  handInfo,
  handCategoryDistribution
} from './interfaces';

// Legacy API exports for backward compatibility
export {
  handOfFiveEvalIndexed,
  getHandInfo,
  handOfSixEvalIndexed,
  getPartialHandStatsIndexed_7
} from './gamblingjs';

// Re-export the legacy FIVE_CARD_POKER_EVAL for backward compatibility
export { FIVE_CARD_POKER_EVAL } from './gamblingjs';
