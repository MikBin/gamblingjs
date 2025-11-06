// Local type definitions for now - will integrate with gamblingjs later
export enum GameVariant {
  // HIGH = 'high',
  // LOW_A_TO_5 = 'low-a-to-5',
  // LOW_8_OR_BETTER = 'low-8-or-better',
  // LOW_9_OR_BETTER = 'low-9-or-better',
  // TEXAS_HOLDEM = 'texas-holdem'
}

export interface verboseHandInfo {
  hand: number[];
  faces: string;
  handGroup: string;
  winningCards: (number | string)[];
  flushSuit: string | number;
  handRank: number;
}

export interface handCategoryDistribution {
  'high card': number;
  'one pair': number;
  'two pair': number;
  'three of a kind': number;
  straight: number;
  flush: number;
  'full house': number;
  'four of a kind': number;
  'straight flush': number;
  average: number;
}

export interface Card {
  index: number;
  rank: string;
  suit: string;
  color: 'red' | 'black';
}

export interface HandEvaluation {
  handRank: number;
  handName: string;
  handStrength: number;
  winningCards: number[];
  description: string;
}

export interface SimulationSettings {
  numRuns: number;
  numOpponents: number;
  opponentRange: 'random' | 'tight' | 'loose' | 'custom';
  calculateEquity: boolean;
  calculateOuts: boolean;
}

export interface SimulationResult {
  winProbability: number;
  tieProbability: number;
  loseProbability: number;
  equity: number;
  handStrength: number;
  outs: OutsResult[];
  handDistribution: handCategoryDistribution;
}

export interface OutsResult {
  handType: string;
  count: number;
  probability: number;
}

export interface EvaluationRecord {
  id: string;
  timestamp: Date;
  gameVariant: GameVariant;
  pocketCards: number[];
  communityCards: number[];
  result: verboseHandInfo;
  notes?: string;
}

export interface GameStage {
  stage: 'preflop' | 'flop' | 'turn' | 'river';
  communityCardsRequired: number;
}

export interface PokerGameState {
  gameVariant: GameVariant;
  pocketCards: number[];
  communityCards: number[];
  gameStage: GameStage['stage'];
  currentHandRank: number;
  handStrength: number;
  evaluationResult: verboseHandInfo | null;
  evaluationHistory: EvaluationRecord[];
}

export interface UIState {
  isDarkMode: boolean;
  theme: 'light' | 'dark' | 'poker';
  sidebarOpen: boolean;
  activeView: string;
  animationsEnabled: boolean;
  showCardImages: boolean;
  simulationSpeed: number;
}
