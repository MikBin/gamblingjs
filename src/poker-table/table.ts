import type { HandConfig, TableConfig } from './config/types';
import { createRng } from './engine/rng';
import type { GameState, HandResult } from './engine/state';
import {
  applyAction,
  countNonFolded,
  dealStreet,
  initHand,
  runBettingRound,
  settle,
} from './engine/transitions';
import { computeLegalActions } from './engine/actions';
import type { PlayerAgent } from './agents/types';

export { applyAction, computeLegalActions };

function anyActiveCanAct(state: GameState): boolean {
  return state.seats.some((s) => s.status === 'active');
}

export function playHand(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  seed: number,
  seatStacks?: number[],
): HandResult {
  const rng = createRng(seed);
  let state = initHand(tableCfg, handCfg, rng, seatStacks);
  const streets = handCfg.streets;

  for (let si = 0; si < streets.length; si++) {
    if (si > 0) {
      state = dealStreet(state, si);
    }
    if (countNonFolded(state) <= 1) break;
    if (anyActiveCanAct(state)) {
      state = runBettingRound(state, handCfg, agents);
      if (countNonFolded(state) <= 1) break;
    }
  }

  state = settle(state);

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
