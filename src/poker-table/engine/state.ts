import type { EvaluatorKind, HandConfig, TableConfig } from '../config/types';

export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allin' | 'discard';

export interface Action {
  type: ActionType;
  seat: number;
  streetIndex: number;
  amount?: number;
  to?: number;
  min?: number;
  max?: number;
  /** For 'discard' actions: positions within the player's hole cards to drop (empty = stand pat). */
  discardIndices?: number[];
}

export type SeatStatus = 'active' | 'folded' | 'allin' | 'out';

export interface SeatState {
  index: number;
  stack: number;
  hole: number[];
  up: number[];
  status: SeatStatus;
  hasActedThisStreet: boolean;
  wageredThisStreet: number;
  wageredTotal: number;
}

export type GamePhase = 'dealing' | 'betting' | 'drawing' | 'showdown' | 'payout' | 'terminal';

export interface GameState {
  tableCfg: TableConfig;
  handCfg: HandConfig;
  buttonSeat: number;
  seats: SeatState[];
  community: number[];
  streetIndex: number;
  phase: GamePhase;
  actingSeat: number;
  lastAggressor: number | null;
  lastRaiseSize: number;
  actions: Action[];
  deck: number[];
  /** Cards discarded during the current draw round; refilled into the deck if it runs out. */
  drawMuck: number[];
  /** Seats that have discarded during the current draw phase (imperative step API). */
  drawnThisStreet: boolean[];
  winners: PotWinner[];
  pots: PotTier[];
  isTerminal: boolean;
}

export interface PotTier {
  amount: number;
  eligible: number[];
  winners: number[];
}

export interface PotWinner {
  seat: number;
  amount: number;
  rank: number;
  potIndex?: number;
  half?: 'high' | 'low';
}

export type GameEventType =
  | 'hand-started'
  | 'dealt'
  | 'action'
  | 'betting-complete'
  | 'showdown'
  | 'hand-ended';

export interface GameEvent {
  type: GameEventType;
  streetIndex?: number;
  action?: Action;
  winners?: PotWinner[];
}

export interface PlayerPublicView {
  seat: number;
  stack: number;
  bet: number;
  wagered: number;
  status: SeatStatus;
}

export interface PublicUpCards {
  seat: number;
  cards: number[];
}

export interface ActionRecord {
  seat: number;
  streetIndex: number;
  type: ActionType;
  amount?: number;
  to?: number;
  /** Public count of cards discarded on a 'discard' action (the only public tell of a draw). */
  discardCount?: number;
}

export interface PublicObservation {
  streetIndex: number;
  streetName: string;
  /** Ranking objective of the current hand — lets agents play high vs low games correctly. */
  evaluator: EvaluatorKind;
  community: number[];
  up: PublicUpCards[];
  players: PlayerPublicView[];
  actionLog: ActionRecord[];
  pot: number;
  /** The hand configuration (streets, composition, betting, action order) so
   *  agents can be game-type aware. Always set by the engine. */
  handCfg?: HandConfig;
}

export interface Observation extends PublicObservation {
  seat: number;
  actingSeat: number;
  buttonSeat: number;
  myHole: number[];
  toCall: number;
  legalActions: Action[];
  isTerminal: boolean;
  revealedHole?: PublicUpCards[];
}

export interface HandResult {
  winners: PotWinner[];
  actions: Action[];
  finalStacks: number[];
  pots: PotTier[];
  dealt: { hole: number[][]; up: number[][]; community: number[] };
  isTerminal: boolean;
}
