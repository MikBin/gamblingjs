import type { HandConfig, TableConfig } from '../config/types';

export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allin';

export interface Action {
  type: ActionType;
  seat: number;
  streetIndex: number;
  amount?: number;
  to?: number;
  min?: number;
  max?: number;
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

export type GamePhase = 'dealing' | 'betting' | 'showdown' | 'payout' | 'terminal';

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
  winners: PotWinner[];
  isTerminal: boolean;
}

export interface PotWinner {
  seat: number;
  amount: number;
  rank: number;
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

export interface DecisionContext {
  seat: number;
  streetIndex: number;
  streetName: string;
  myHole: number[];
  community: number[];
  myStack: number;
  pot: number;
  toCall: number;
  legalActions: Action[];
}

export interface HandResult {
  winners: PotWinner[];
  actions: Action[];
  finalStacks: number[];
  dealt: { hole: number[][]; community: number[] };
  isTerminal: boolean;
}
