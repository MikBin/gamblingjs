import type { Action, DecisionContext } from '../engine/state';

export interface PlayerAgent {
  decide(ctx: DecisionContext, legalActions: Action[]): Action;
  onEvent?(event: unknown): void;
}
