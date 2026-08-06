export type DeckType = 'standard52';
export type BetType = 'no-limit' | 'pot-limit' | 'fixed-limit' | 'spread-limit';
export type ActionOrderRule = 'left-of-button' | 'low-upcard' | 'high-hand';
export type PoolName = 'hole' | 'door' | 'community' | 'hand';
export type HandPattern =
  | 'any'
  | 'pair'
  | 'trips'
  | 'flush'
  | 'straight'
  | ((cards: number[]) => boolean);

export type EvaluatorKind = 'high' | 'A5-low' | '2-7-low' | 'low8' | 'low9' | 'hi-lo';
export type RankingDirection = 'high-wins' | 'low-wins';

export interface TableConfig {
  gameId: string;
  seats: { min: number; max: number };
  deck: DeckType;
}

export interface BettingConfig {
  type: BetType;
  smallBet?: number;
  bigBet?: number;
  maxRaisesPerStreet?: number;
  minBet?: number;
  minRaise?: number;
}

export interface ForcedBetConfig {
  blinds?: { sb: number; bb: number };
  ante?: number;
  bringIn?: number;
  postRule: 'standard' | 'heads-up' | 'stud';
}

export interface DealConfig {
  holeDown: number;
  playerUp: number;
  community: number;
}

export interface StreetConfig {
  name: string;
  deal: DealConfig;
  betting: BettingConfig;
  actionOrder: ActionOrderRule;
}

export interface CompositionPool {
  pool: PoolName;
  exactly?: number;
  min?: number;
  max?: number;
  pattern?: HandPattern;
}

export interface CompositionSelector {
  total: number;
  pools: CompositionPool[];
}

export interface EvaluationConfig {
  evaluator: EvaluatorKind;
  ranking: RankingDirection;
  lowQualify?: 8 | 9;
  composition: CompositionSelector;
}

export interface HandConfig {
  forcedBets: ForcedBetConfig;
  stacks: { min: number; max: number; buyIn: number };
  streets: StreetConfig[];
  evaluation: EvaluationConfig;
}
