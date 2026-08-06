import type { HandConfig, TableConfig } from '../config/types';
import type { Action, DecisionContext, GameEvent, GameState, PotWinner, SeatState } from './state';
import { bigBlindOf, computeLegalActions, streetMaxWager, toCallFor } from './actions';
import { resolveHand } from '../evaluation/resolver';
import type { PlayerAgent } from '../agents/types';
import type { RngSource } from './rng';

export function cloneState(s: GameState): GameState {
  return {
    ...s,
    seats: s.seats.map((seat) => ({
      ...seat,
      hole: [...seat.hole],
      up: [...seat.up],
    })),
    community: [...s.community],
    deck: [...s.deck],
    actions: [...s.actions],
    winners: [...s.winners],
  };
}

function draw(s: GameState): number {
  const c = s.deck.pop();
  if (c === undefined) throw new Error('deck exhausted');
  return c;
}

function shuffleDeck(rng: RngSource): number[] {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  return rng.shuffleInPlace(deck);
}

export function countNonFolded(state: GameState): number {
  let n = 0;
  for (const s of state.seats) {
    if (s.status !== 'folded' && s.status !== 'out') n++;
  }
  return n;
}

function anyActive(state: GameState): boolean {
  return state.seats.some((s) => s.status === 'active');
}

function nextActive(state: GameState, from: number): number {
  const n = state.seats.length;
  for (let k = 0; k < n; k++) {
    const idx = (from + k) % n;
    if (state.seats[idx].status === 'active') return idx;
  }
  return -1;
}

export function firstToAct(state: GameState, streetIndex: number): number {
  const n = state.seats.length;
  if (streetIndex === 0) {
    if (n === 2) return state.buttonSeat;
    return nextActive(state, (state.buttonSeat + 3) % n);
  }
  return nextActive(state, (state.buttonSeat + 1) % n);
}

function postBet(seat: SeatState, amount: number): void {
  const amt = Math.min(amount, seat.stack);
  seat.stack -= amt;
  seat.wageredThisStreet += amt;
  seat.wageredTotal += amt;
  if (seat.stack === 0) seat.status = 'allin';
}

function postBlinds(state: GameState): GameState {
  const s = cloneState(state);
  const cfg = s.handCfg.forcedBets;
  const sb = cfg.blinds?.sb ?? 1;
  const bb = cfg.blinds?.bb ?? 2;
  const n = s.seats.length;
  if (n === 2) {
    postBet(s.seats[s.buttonSeat]!, sb);
    postBet(s.seats[(s.buttonSeat + 1) % n]!, bb);
  } else {
    postBet(s.seats[(s.buttonSeat + 1) % n]!, sb);
    postBet(s.seats[(s.buttonSeat + 2) % n]!, bb);
  }
  s.lastRaiseSize = bb;
  return s;
}

export function initHand(
  tableCfg: TableConfig,
  handCfg: HandConfig,
  rng: RngSource,
  seatStacks?: number[],
): GameState {
  const n = tableCfg.seats.min;
  const deck = shuffleDeck(rng);
  const seats: SeatState[] = Array.from({ length: n }, (_, i) => ({
    index: i,
    stack: seatStacks?.[i] ?? handCfg.stacks.buyIn,
    hole: [],
    up: [],
    status: 'active',
    hasActedThisStreet: false,
    wageredThisStreet: 0,
    wageredTotal: 0,
  }));
  const base: GameState = {
    tableCfg,
    handCfg,
    buttonSeat: 0,
    seats,
    community: [],
    streetIndex: 0,
    phase: 'betting',
    actingSeat: 0,
    lastAggressor: null,
    lastRaiseSize: bigBlindOf(handCfg),
    actions: [],
    deck,
    winners: [],
    isTerminal: false,
  };
  const preflop = handCfg.streets[0]?.deal;
  if (preflop) {
    for (const seat of base.seats) {
      for (let k = 0; k < preflop.holeDown; k++) seat.hole.push(draw(base));
      for (let k = 0; k < preflop.playerUp; k++) seat.up.push(draw(base));
    }
    for (let k = 0; k < preflop.community; k++) base.community.push(draw(base));
  }
  let state = postBlinds(base);
  state.actingSeat = firstToAct(state, 0);
  return state;
}

export function dealStreet(state: GameState, streetIndex: number): GameState {
  const s = cloneState(state);
  const deal = s.handCfg.streets[streetIndex]?.deal;
  if (deal) {
    for (const seat of s.seats) {
      if (seat.status === 'out') continue;
      for (let k = 0; k < deal.holeDown; k++) seat.hole.push(draw(s));
      for (let k = 0; k < deal.playerUp; k++) seat.up.push(draw(s));
    }
    for (let k = 0; k < deal.community; k++) s.community.push(draw(s));
  }
  for (const seat of s.seats) {
    seat.wageredThisStreet = 0;
    seat.hasActedThisStreet = false;
  }
  s.lastRaiseSize = bigBlindOf(s.handCfg);
  s.lastAggressor = null;
  s.streetIndex = streetIndex;
  s.actingSeat = firstToAct(s, streetIndex);
  return s;
}

function reopen(s: GameState, aggressor: number): void {
  for (const seat of s.seats) {
    if (seat.index !== aggressor && seat.status === 'active') {
      seat.hasActedThisStreet = false;
    }
  }
}

export function applyAction(state: GameState, action: Action, handCfg: HandConfig): GameState {
  const s = cloneState(state);
  const seat = s.seats[action.seat];
  if (!seat || seat.status !== 'active' || s.actingSeat !== action.seat) {
    throw new Error(`seat ${action.seat} cannot act now`);
  }
  const legal = computeLegalActions(s, handCfg);
  const match = legal.find((a) => a.type === action.type);
  if (!match) {
    throw new Error(`illegal action ${action.type} for seat ${action.seat}`);
  }
  const bb = bigBlindOf(handCfg);
  const curMax = streetMaxWager(s);
  seat.hasActedThisStreet = true;

  switch (action.type) {
    case 'fold':
      seat.status = 'folded';
      break;
    case 'check':
      break;
    case 'call': {
      const amt = Math.min(toCallFor(s, seat.index), seat.stack);
      seat.stack -= amt;
      seat.wageredThisStreet += amt;
      seat.wageredTotal += amt;
      if (seat.stack === 0) seat.status = 'allin';
      break;
    }
    case 'bet': {
      const min = match.min ?? bb;
      const max = match.max ?? seat.stack;
      const requested = action.amount ?? match.amount ?? min;
      if (requested < min) throw new Error('bet below minimum');
      const amt = Math.min(requested, max);
      seat.stack -= amt;
      seat.wageredThisStreet += amt;
      seat.wageredTotal += amt;
      s.lastRaiseSize = Math.max(s.lastRaiseSize, amt);
      s.lastAggressor = seat.index;
      if (seat.stack === 0) seat.status = 'allin';
      reopen(s, seat.index);
      break;
    }
    case 'raise': {
      const min = match.min ?? curMax + Math.max(s.lastRaiseSize, bb);
      const max = match.max ?? seat.wageredThisStreet + seat.stack;
      const requestedTo = action.to ?? match.to ?? min;
      if (requestedTo < min) throw new Error('raise below minimum');
      const to = Math.min(requestedTo, max);
      const amt = to - seat.wageredThisStreet;
      seat.stack -= amt;
      seat.wageredThisStreet = to;
      seat.wageredTotal += amt;
      s.lastRaiseSize = to - curMax;
      s.lastAggressor = seat.index;
      if (seat.stack === 0) seat.status = 'allin';
      reopen(s, seat.index);
      break;
    }
    case 'allin': {
      const amt = seat.stack;
      const newWager = seat.wageredThisStreet + amt;
      seat.stack = 0;
      seat.wageredThisStreet = newWager;
      seat.wageredTotal += amt;
      seat.status = 'allin';
      if (newWager > curMax) {
        const inc = newWager - curMax;
        if (inc >= Math.max(s.lastRaiseSize, bb)) s.lastRaiseSize = inc;
        s.lastAggressor = seat.index;
        reopen(s, seat.index);
      }
      break;
    }
    default:
      throw new Error(`unknown action type`);
  }

  s.actions.push({ ...action });
  return s;
}

function needsAction(state: GameState, idx: number): boolean {
  const seat = state.seats[idx];
  if (!seat || seat.status !== 'active') return false;
  if (!seat.hasActedThisStreet) return true;
  return seat.wageredThisStreet < streetMaxWager(state);
}

function buildContext(state: GameState): DecisionContext {
  const seat = state.seats[state.actingSeat]!;
  let pot = 0;
  for (const s of state.seats) pot += s.wageredTotal;
  return {
    seat: seat.index,
    streetIndex: state.streetIndex,
    streetName: state.handCfg.streets[state.streetIndex]?.name ?? `street-${state.streetIndex}`,
    myHole: [...seat.hole],
    community: [...state.community],
    myStack: seat.stack,
    pot,
    toCall: toCallFor(state, seat.index),
    legalActions: computeLegalActions(state, state.handCfg),
  };
}

export function refundUncalled(state: GameState): GameState {
  const s = cloneState(state);
  let max = 0;
  for (const seat of s.seats) if (seat.wageredThisStreet > max) max = seat.wageredThisStreet;
  if (max <= 0) return s;
  const leaders = s.seats.filter((seat) => seat.wageredThisStreet === max);
  if (leaders.length !== 1) return s;
  const leader = leaders[0]!;
  let second = 0;
  for (const seat of s.seats) {
    if (seat !== leader && seat.wageredThisStreet > second) second = seat.wageredThisStreet;
  }
  if (max > second) {
    const refund = max - second;
    leader.stack += refund;
    leader.wageredThisStreet -= refund;
    leader.wageredTotal -= refund;
  }
  return s;
}

export function runBettingRound(
  state: GameState,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  emit?: (e: GameEvent) => void,
): GameState {
  let s = state;
  let cursor = s.actingSeat;
  let guard = 0;
  while (countNonFolded(s) > 1) {
    let seatIdx = -1;
    const n = s.seats.length;
    for (let k = 0; k < n; k++) {
      const idx = (cursor + k) % n;
      if (needsAction(s, idx)) {
        seatIdx = idx;
        break;
      }
    }
    if (seatIdx === -1) break;
    s.actingSeat = seatIdx;
    const ctx = buildContext(s);
    const action = agents[seatIdx]!.decide(ctx, ctx.legalActions);
    s = applyAction(s, action, handCfg);
    emit?.({ type: 'action', streetIndex: s.streetIndex, action });
    cursor = (seatIdx + 1) % n;
    if (++guard > 100000) throw new Error('betting round did not converge');
  }
  emit?.({ type: 'betting-complete', streetIndex: s.streetIndex });
  return refundUncalled(s);
}

function settleAndEmit(
  state: GameState,
  handCfg: HandConfig,
  emit?: (e: GameEvent) => void,
): GameState {
  void handCfg;
  const alive = countNonFolded(state);
  const s = settle(state);
  if (alive > 1) emit?.({ type: 'showdown', winners: s.winners });
  emit?.({ type: 'hand-ended', winners: s.winners });
  return s;
}

export function resumeHand(
  state: GameState,
  handCfg: HandConfig,
  agents: PlayerAgent[],
  emit?: (e: GameEvent) => void,
): GameState {
  let s = state;
  if (s.isTerminal) return s;

  const runCurrentStreet = (): boolean => {
    if (countNonFolded(s) <= 1) return false;
    if (anyActive(s)) {
      s = runBettingRound(s, handCfg, agents, emit);
      if (countNonFolded(s) <= 1) return false;
    }
    return true;
  };

  if (!runCurrentStreet()) return settleAndEmit(s, handCfg, emit);

  for (let si = s.streetIndex + 1; si < handCfg.streets.length; si++) {
    if (countNonFolded(s) <= 1) break;
    s = dealStreet(s, si);
    emit?.({ type: 'dealt', streetIndex: si });
    if (!runCurrentStreet()) break;
  }
  return settleAndEmit(s, handCfg, emit);
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

export function hydrateState(json: string): GameState {
  return JSON.parse(json) as GameState;
}

export function settle(state: GameState): GameState {
  const s = cloneState(state);
  let pot = 0;
  for (const seat of s.seats) pot += seat.wageredTotal;
  const alive = s.seats.filter((seat) => seat.status !== 'folded' && seat.status !== 'out');
  const winners: PotWinner[] = [];

  if (alive.length === 1) {
    const w = alive[0]!;
    w.stack += pot;
    winners.push({ seat: w.index, amount: pot, rank: -1 });
  } else {
    const kind = s.handCfg.evaluation.evaluator;
    const evaluated = alive.map((seat) => ({
      seat,
      rank: resolveHand(seat.hole, s.community, kind),
    }));
    let best = evaluated[0]!.rank;
    for (const e of evaluated) if (e.rank > best) best = e.rank;
    const tops = evaluated.filter((e) => e.rank === best);
    tops.sort((a, b) => a.seat.index - b.seat.index);
    const share = Math.floor(pot / tops.length);
    const remainder = pot - share * tops.length;
    tops.forEach((e, i) => {
      const amount = share + (i === 0 ? remainder : 0);
      e.seat.stack += amount;
      winners.push({ seat: e.seat.index, amount, rank: e.rank });
    });
  }

  s.winners = winners;
  s.phase = 'terminal';
  s.isTerminal = true;
  return s;
}
