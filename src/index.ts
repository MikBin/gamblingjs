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

// Export Poker Table module
export { PokerTable } from './poker-table/PokerTable';
export { LocalDealer, RemoteDealer, createStandardDeck } from './poker-table/deck';
export { TableAnalytics } from './poker-table/analytics';
export { BasePlayer, PLAYER_PRESETS, createPlayer } from './poker-table/player';
export type { PlayerAgent, PlayerProfileConfig, PlayerPreset } from './poker-table/player';
export type {
  TableConfig,
  GameRotation,
  GameInRotation,
  BlindsStructure,
  TournamentStructure,
  CashStructure,
  BlindLevel,
  Player,
  AnalyticsOptions,
  ActionType,
  HistoryEvent,
  PlayerStats,
  PlayerCategory,
  PositionLabel,
  AllowedAction,
  ActionDecision,
  HandContext,
} from './poker-table/types';
export { GameId, LimitType } from './poker-table/types';

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
