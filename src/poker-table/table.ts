import type { HandConfig, TableConfig } from './config/types';
import { createRng } from './engine/rng';
import type { Action, GameEvent, GameState, HandResult } from './engine/state';
import { initHand, resumeHand } from './engine/transitions';
import { computeLegalActions } from './engine/actions';
import { applyAction } from './engine/transitions';
import type { PlayerAgent } from './agents/types';

export { applyAction, computeLegalActions };

function toResult(state: GameState): HandResult {
  return {
    winners: state.winners,
    actions: state.actions,
    finalStacks: state.seats.map((s) => s.stack),
    dealt: {
      hole: state.seats.map((s) => [...s.hole]),
      community: [...state.community],
    },
    isTerminal: state.isTerminal,
  };
}

function fanOut(agents: PlayerAgent[]): (e: GameEvent) => void {
  return (e: GameEvent) => {
    for (const a of agents) a.onEvent?.(e);
  };
}

export function playHand(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  seed: number,
  seatStacks?: number[],
): HandResult {
  const rng = createRng(seed);
  const state = initHand(tableCfg, handCfg, rng, seatStacks);
  const emit = fanOut(agents);
  emit({ type: 'hand-started' });
  const settled = resumeHand(state, handCfg, agents, emit);
  return toResult(settled);
}

export function toReplayAgent(actions: Action[]): PlayerAgent {
  let i = 0;
  return {
    decide: (): Action => {
      const a = actions[i];
      if (!a) throw new Error('replay action log exhausted');
      i++;
      return a;
    },
  };
}

export function replayHand(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  seed: number,
  actions: Action[],
  seatStacks?: number[],
): HandResult {
  const replay = toReplayAgent(actions);
  const agents: PlayerAgent[] = Array.from({ length: tableCfg.seats.min }, () => replay);
  return playHand(tableCfg, handCfg, agents, seed, seatStacks);
}
