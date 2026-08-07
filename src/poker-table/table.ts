import type { HandConfig, TableConfig } from './config/types';
import { createRng } from './engine/rng';
import type {
  Action,
  GameEvent,
  GameState,
  HandResult,
  Observation,
  PotWinner,
} from './engine/state';
import {
  advanceToNextDecision,
  applyAction,
  initHand,
  observe,
  resumeHand,
} from './engine/transitions';
import { computeLegalActions } from './engine/actions';
import type { PlayerAgent } from './agents/types';

export { applyAction, computeLegalActions, observe };

function toResult(state: GameState): HandResult {
  return {
    winners: state.winners,
    actions: state.actions,
    finalStacks: state.seats.map((s) => s.stack),
    pots: state.pots.map((p) => ({
      amount: p.amount,
      eligible: [...p.eligible],
      winners: [...p.winners],
    })),
    dealt: {
      hole: state.seats.map((s) => [...s.hole]),
      up: state.seats.map((s) => [...s.up]),
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

export class Table {
  private state: GameState;
  private readonly emit: (e: GameEvent) => void;

  constructor(
    tableCfg: TableConfig,
    handCfg: HandConfig,
    seed: number,
    onEvent?: (e: GameEvent) => void,
    seatStacks?: number[],
  ) {
    this.state = initHand(tableCfg, handCfg, createRng(seed), seatStacks);
    this.emit = onEvent ?? (() => undefined);
    this.emit({ type: 'hand-started' });
  }

  get currentSeat(): number {
    return this.state.actingSeat;
  }

  get done(): boolean {
    return this.state.isTerminal;
  }

  get winners(): PotWinner[] {
    return this.state.winners;
  }

  get pots() {
    return this.state.pots;
  }

  observe(seat: number): Observation {
    return observe(this.state, seat);
  }

  stacks(): number[] {
    return this.state.seats.map((s) => s.stack);
  }

  step(action: Action): void {
    if (this.state.isTerminal) throw new Error('hand is already terminal');
    if (action.seat !== this.state.actingSeat) {
      throw new Error(`action for seat ${action.seat}, expected ${this.state.actingSeat}`);
    }
    this.state = applyAction(this.state, action, this.state.handCfg);
    this.emit({ type: 'action', streetIndex: this.state.streetIndex, action });
    this.state = advanceToNextDecision(this.state, this.emit);
  }
}
