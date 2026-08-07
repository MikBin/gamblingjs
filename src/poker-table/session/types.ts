import type { GamePreset } from '../config/presets';

/**
 * One blind/ante step of a Sit-and-Go. A single level carries every forced-bet
 * knob because a HORSE rotation mixes flop games (which post small/big blinds)
 * with stud games (which post an ante + bring-in). The SNG driver selects the
 * relevant fields per game, so one level feeds all five HORSE games.
 */
export interface SitAndGoLevel {
  /** Small blind — posted by flop games (Hold'em, Omaha Hi/Lo). */
  sb: number;
  /** Big blind — posted by flop games; also the fixed-limit small-bet unit. */
  bb: number;
  /** Ante — posted by every game (flop games add it at higher levels, studs always). */
  ante: number;
  /** Bring-in — posted by stud games (lowest upcard). */
  bringIn: number;
}

/** Builds the GamePreset for one rotation game at a given level and seat count. */
export type GameBuilder = (level: SitAndGoLevel, seats: number) => GamePreset;

/** A game in the rotation, with a stable id + human label for display. */
export interface RotationGame {
  gameId: string;
  label: string;
  build: GameBuilder;
}

/**
 * When the rotation advances to the next game.
 * - `hand`: rotate every hand (fastest — every game is exercised immediately).
 * - `level`: rotate when the blind level increases.
 * - `orbit`: rotate once the button makes a full lap (authentic HORSE cadence).
 */
export type RotationCadence = 'hand' | 'level' | 'orbit';

/**
 * Full Sit-and-Go definition. This is the "extra config" the table engine never
 * had: it tells the driver WHEN to change game (`rotationCadence`), WHEN to
 * increase the blinds (`handsPerLevel` + the ordered `levels`), and HOW the
 * blinds/antes grow (the `levels` values themselves).
 */
export interface SitAndGoConfig {
  seats: number;
  startingStack: number;
  levels: SitAndGoLevel[];
  /** Hands played before advancing to the next level. 1 = blinds grow every hand. */
  handsPerLevel: number;
  rotation: RotationGame[];
  rotationCadence: RotationCadence;
  /** Payout fractions by finishing place, 1st first, summing to 1 (e.g. [0.5,0.3,0.2]). */
  payouts: number[];
  /** Deterministic base seed. */
  seed: number;
  /** Safety cap on total hands; defaults to a large number. */
  maxHands?: number;
}

export interface SngPlayerInput {
  id: number;
  name: string;
  agent: import('../agents/types').PlayerAgent;
}

export interface StandingsRow {
  id: number;
  name: string;
  stack: number;
  alive: boolean;
  place: number | null;
}

export interface HandWinnerSummary {
  id: number;
  amount: number;
  half?: 'high' | 'low';
}

/** Everything needed to re-run one settled hand deterministically in a UI. */
export interface HandReplayData {
  table: import('../config/types').TableConfig;
  hand: import('../config/types').HandConfig;
  seed: number;
  /** Alive players' stacks in table seat order (button at seat 0). */
  seatStacks: number[];
  /** The exact action log of the played hand, in order. */
  actions: import('../engine/state').Action[];
}

/** Reactive snapshot of one settled hand, used by the driver and the UI playback. */
export interface HandSummary {
  handNumber: number;
  gameId: string;
  gameLabel: string;
  levelIndex: number;
  level: SitAndGoLevel;
  buttonId: number;
  /** Original player ids in table seat order, button always at index 0. */
  seatOrder: number[];
  winners: HandWinnerSummary[];
  /** Player ids eliminated (busted) by this hand. */
  eliminated: number[];
  /** Standings immediately after this hand settled. */
  standings: StandingsRow[];
  /** Set when the hand could not be completed and was voided (stacks carried over). */
  voided?: boolean;
  /** Replay inputs for animating this hand card-by-card (absent when voided). */
  replay?: HandReplayData;
}

export interface PayoutResult {
  id: number;
  place: number;
  amount: number;
}

export interface SitAndGoResult {
  finished: boolean;
  handsPlayed: number;
  winner: StandingsRow | null;
  finalStandings: StandingsRow[];
  payouts: PayoutResult[];
  history: HandSummary[];
}
