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
  // fixed-limit: street index at which the big bet kicks in (default: ceil(streetCount/2))
  bigBetFromStreet?: number;
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

/**
 * A draw phase config attached to a street. When present, the engine runs a
 * discard-and-replace round (each active player discards cards, then draws the
 * same number from the deck) BEFORE that street's betting round. The initial
 * deal street never carries a draw.
 */
export interface DrawConfig {
  /** Which private pool players may discard from. */
  from: 'hole';
  /** Max cards a player may discard in this draw phase. Stand pat (discard 0) is always allowed. */
  max: number;
}

export interface StreetConfig {
  name: string;
  deal: DealConfig;
  /** Optional draw phase; see DrawConfig. */
  draw?: DrawConfig;
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
