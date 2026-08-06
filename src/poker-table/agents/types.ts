import type { Action, DecisionContext, GameEvent } from '../engine/state';

export interface PlayerAgent {
  decide(ctx: DecisionContext, legalActions: Action[]): Action;
  onEvent?(event: GameEvent): void;
}
