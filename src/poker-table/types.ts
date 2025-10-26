// Poker Table type definitions for highly configurable mixed games

export enum LimitType {
  NO_LIMIT = 'no-limit',
  POT_LIMIT = 'pot-limit',
  FIXED_LIMIT = 'fixed-limit',
}

export enum GameId {
  TEXAS_HOLDEM = 'texas-holdem',
  OMAHA = 'omaha',
  OMAHA_HI_LO = 'omaha-hi-lo',
  RAZZ = 'razz',
  SEVEN_CARD_STUD = 'seven-card-stud',
  SEVEN_CARD_STUD_HI_LO = 'seven-card-stud-hi-lo',
  FIVE_CARD_DRAW = 'five-card-draw',
  DEUCE_TO_SEVEN_TRIPLE_DRAW = '2-7-triple-draw',
}

export type CashOrTournament = 'cash' | 'tournament';

export interface BlindLevel {
  id: string;
  smallBlind: number;
  bigBlind: number;
  ante?: number;
  bringIn?: number; // for Stud variants
}

export interface TournamentStructure {
  kind: 'tournament';
  levels: BlindLevel[];
  // How rotation/level advances in tournaments
  advanceBy: 'time' | 'hands' | 'manual';
  advanceEvery?: number; // minutes when advanceBy === 'time', or hands when 'hands'
  startingLevelId?: string;
}

export interface CashStructure {
  kind: 'cash';
  blinds: {
    smallBlind: number;
    bigBlind: number;
    ante?: number;
    bringIn?: number;
  };
}

export type BlindsStructure = TournamentStructure | CashStructure;

export interface GameInRotation {
  game: GameId | string; // string permits custom games
  limit: LimitType;
  // Number of consecutive hands for this game before rotating to next
  hands?: number; // if undefined, rotation change controlled externally
  // Optional per-game overrides (e.g., O8 uses different antes)
  blindsOverride?: Partial<CashStructure['blinds']> | Partial<BlindLevel>;
}

export interface GameRotation {
  sequence: GameInRotation[]; // e.g., HORSE, 8-Game, or any custom mix
  loop: boolean; // if true, cycles after last entry
}

export interface TableConfig {
  name?: string;
  maxSeats: number;
  structure: BlindsStructure;
  rotation: GameRotation;
  // Button/bring-in positioning
  dealerButtonSeat?: number; // 0-based seat index; defaults to 0
}

export interface Player {
  id: string;
  name?: string;
  seat: number; // 0-based seat index
  chips: number;
  sittingOut?: boolean;
  folded?: boolean;
  allIn?: boolean;
  holeCards: number[];
}

export type StreetName =
  | 'deal'
  | 'preflop'
  | 'flop'
  | 'turn'
  | 'river'
  | 'third-street'
  | 'fourth-street'
  | 'fifth-street'
  | 'sixth-street'
  | 'seventh-street'
  | 'draw-1'
  | 'draw-2'
  | 'draw-3'
  | 'showdown';

export interface GameDefinition {
  id: GameId | string;
  displayName: string;
  minPlayers: number;
  maxPlayers: number;
  usesBlinds: boolean; // otherwise bring-in/antes-only
  // Dealing model
  holeCardsPerPlayer: number;
  communityCardStages?: { street: StreetName; count: number }[]; // for flop games
  drawRounds?: { street: StreetName; maxDraw: number }[]; // for draw games
  studStreets?: StreetName[]; // for stud games progression
}

export interface HandStateSnapshot {
  handNumber: number;
  game: GameInRotation;
  street: StreetName | null;
  buttonSeat: number;
  communityCards: number[];
  players: Pick<Player, 'id' | 'seat' | 'chips' | 'folded' | 'allIn' | 'holeCards'>[];
  pot: number;
}
