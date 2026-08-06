import type { HandConfig } from '../config/types';
import type { Action, GameState } from './state';

export function streetMaxWager(state: GameState): number {
  let max = 0;
  for (const s of state.seats) {
    if (s.wageredThisStreet > max) max = s.wageredThisStreet;
  }
  return max;
}

export function toCallFor(state: GameState, seat: number): number {
  const owe = streetMaxWager(state) - state.seats[seat].wageredThisStreet;
  return owe > 0 ? owe : 0;
}

export function bigBlindOf(handCfg: HandConfig): number {
  return handCfg.forcedBets.blinds?.bb ?? 1;
}

export function computeLegalActions(state: GameState, handCfg: HandConfig): Action[] {
  const seat = state.seats[state.actingSeat];
  if (!seat || seat.status !== 'active') return [];
  const si = state.streetIndex;
  const bb = bigBlindOf(handCfg);
  const tc = toCallFor(state, seat.index);
  const acts: Action[] = [];

  if (tc === 0) {
    acts.push({ type: 'check', seat: seat.index, streetIndex: si });
    if (seat.stack > 0) {
      const minBet = handCfg.streets[si]?.betting.minBet ?? bb;
      acts.push({
        type: 'bet',
        seat: seat.index,
        streetIndex: si,
        amount: Math.min(minBet, seat.stack),
        min: minBet,
        max: seat.stack,
      });
      acts.push({ type: 'allin', seat: seat.index, streetIndex: si, amount: seat.stack });
    }
  } else {
    acts.push({ type: 'fold', seat: seat.index, streetIndex: si });
    if (seat.stack > 0) {
      const callAmt = Math.min(tc, seat.stack);
      acts.push({ type: 'call', seat: seat.index, streetIndex: si, amount: callAmt });
      const curMax = streetMaxWager(state);
      const minInc = Math.max(state.lastRaiseSize, bb);
      const minRaiseTo = curMax + minInc;
      const maxTo = seat.wageredThisStreet + seat.stack;
      if (maxTo > curMax) {
        const effMin = Math.min(minRaiseTo, maxTo);
        acts.push({
          type: 'raise',
          seat: seat.index,
          streetIndex: si,
          to: effMin,
          min: effMin,
          max: maxTo,
        });
        if (seat.stack > tc) {
          acts.push({ type: 'allin', seat: seat.index, streetIndex: si, amount: seat.stack });
        }
      }
    }
  }
  return acts;
}
