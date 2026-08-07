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
  anyActive,
  applyAction,
  countNonFolded,
  dealStreet,
  initHand,
  needsAction,
  observe,
  refundUncalled,
  resumeHand,
  settle,
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

/** One animation frame: the events that fired plus the public state after them. */
export interface HandReplayStep {
  events: GameEvent[];
  obs: Observation;
}

/**
 * Re-run a recorded hand through the exact engine state machine used by
 * `playHand` (runBettingRound semantics), capturing a public observation after
 * every event. Unlike driving `Table.step` (which uses advanceToNextDecision),
 * this can never diverge from the recorded action order, so it is safe to feed
 * any `HandResult.actions` log. Deterministic: same inputs, same steps.
 */
export function replayHandSteps(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  seed: number,
  actions: Action[],
  seatStacks?: number[],
): HandReplayStep[] {
  const rng = createRng(seed);
  const agent = toReplayAgent(actions);
  const agents: PlayerAgent[] = Array.from({ length: tableCfg.seats.min }, () => agent);
  const steps: HandReplayStep[] = [];
  let pending: GameEvent[] = [];
  const emit = (e: GameEvent): void => {
    pending.push(e);
  };
  const capture = (state: GameState): void => {
    steps.push({ events: [...pending], obs: observe(state, 0) });
    pending = [];
  };

  const settleAndEmit = (state: GameState): GameState => {
    const alive = countNonFolded(state);
    const settled = settle(state);
    if (alive > 1) emit({ type: 'showdown', winners: settled.winners });
    emit({ type: 'hand-ended', winners: settled.winners });
    capture(settled);
    return settled;
  };

  // Betting round with per-action capture (mirrors runBettingRound).
  const runBettingRound = (state: GameState): GameState => {
    let cur = state;
    let cursor = cur.actingSeat;
    let guard = 0;
    while (countNonFolded(cur) > 1) {
      let seatIdx = -1;
      const n = cur.seats.length;
      for (let k = 0; k < n; k++) {
        const idx = (cursor + k) % n;
        if (needsAction(cur, idx)) {
          seatIdx = idx;
          break;
        }
      }
      if (seatIdx === -1) break;
      cur.actingSeat = seatIdx;
      const obs = observe(cur, seatIdx);
      const action = agents[seatIdx]!.decide(obs);
      cur = applyAction(cur, action, handCfg);
      emit({ type: 'action', streetIndex: cur.streetIndex, action });
      capture(cur);
      cursor = (seatIdx + 1) % n;
      if (++guard > 100000) throw new Error('betting round did not converge');
    }
    emit({ type: 'betting-complete', streetIndex: cur.streetIndex });
    capture(cur);
    return refundUncalled(cur);
  };

  // Draw round with per-action capture (mirrors runDrawRound in transitions).
  const runDrawRound = (state: GameState): GameState => {
    let cur = state;
    cur.phase = 'drawing';
    const n = cur.seats.length;
    let cursor = cur.actingSeat;
    const drawn = new Set<number>();
    let guard = 0;
    for (;;) {
      let seatIdx = -1;
      for (let k = 0; k < n; k++) {
        const idx = (cursor + k) % n;
        const seat = cur.seats[idx];
        if (seat && seat.status === 'active' && !drawn.has(idx)) {
          seatIdx = idx;
          break;
        }
      }
      if (seatIdx === -1) break;
      cur.actingSeat = seatIdx;
      const obs = observe(cur, seatIdx);
      const action = agents[seatIdx]!.decide(obs);
      cur = applyAction(cur, action, handCfg);
      emit({ type: 'action', streetIndex: cur.streetIndex, action });
      capture(cur);
      drawn.add(seatIdx);
      cursor = (seatIdx + 1) % n;
      if (++guard > 100000) throw new Error('draw round did not converge');
    }
    cur.phase = 'betting';
    return cur;
  };

  let s = initHand(tableCfg, handCfg, rng, seatStacks);
  capture(s); // street 0 already dealt

  const runCurrentStreet = (): boolean => {
    if (countNonFolded(s) <= 1) return false;
    const street = handCfg.streets[s.streetIndex];
    if (street?.draw && anyActive(s)) {
      s = runDrawRound(s);
      if (countNonFolded(s) <= 1) return false;
    }
    if (anyActive(s)) {
      s = runBettingRound(s);
      if (countNonFolded(s) <= 1) return false;
    }
    return true;
  };

  if (!runCurrentStreet()) {
    settleAndEmit(s);
    return steps;
  }
  for (let si = s.streetIndex + 1; si < handCfg.streets.length; si++) {
    if (countNonFolded(s) <= 1) break;
    s = dealStreet(s, si);
    emit({ type: 'dealt', streetIndex: si });
    capture(s);
    if (!runCurrentStreet()) break;
  }
  settleAndEmit(s);
  return steps;
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
