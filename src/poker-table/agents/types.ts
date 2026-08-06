import type { Action, GameEvent, Observation } from '../engine/state';

export interface PlayerAgent {
  decide(observation: Observation): Action;
  onEvent?(event: GameEvent): void;
}
