import type { BettingConfig, HandConfig } from '../config/types';
import type { Action, GameState } from './state';

export function streetMaxWager(state: GameState): number {
  let max = 0;
  for (const s of state.seats) {
    if (s.wageredThisStreet > max) max = s.wageredThisStreet;
  }
  return max;
}

export function toCallFor(state: GameState, seat: number): number {
  const owe = streetMaxWager(state) - state.seats[seat]!.wageredThisStreet;
  return owe > 0 ? owe : 0;
}

export function bigBlindOf(handCfg: HandConfig): number {
  return handCfg.forcedBets.blinds?.bb ?? 1;
}

export function potTotal(state: GameState): number {
  let pot = 0;
  for (const s of state.seats) pot += s.wageredTotal;
  return pot;
}

export function raisesThisStreet(state: GameState): number {
  const si = state.streetIndex;
  let n = 0;
  for (const a of state.actions) {
    if (a.streetIndex === si && a.type === 'raise') n++;
  }
  return n;
}

// Fixed-limit bet unit: small bet on early streets, big bet on the later half
// (e.g. a 4-street game bets small on preflop+flop, big on turn+river).
export function flBetUnit(
  betting: BettingConfig,
  streetIndex: number,
  streetCount: number,
  bb: number,
): number {
  const small = betting.smallBet ?? bb;
  const big = betting.bigBet ?? small;
  const bigFrom = Math.ceil(streetCount / 2);
  return streetIndex >= bigFrom ? big : small;
}

// Pot-limit maximum total wager a seat may raise TO this action.
export function potLimitRaiseTo(state: GameState, currentBet: number, toCall: number): number {
  return currentBet + potTotal(state) + toCall;
}

export function computeLegalActions(state: GameState, handCfg: HandConfig): Action[] {
  const seat = state.seats[state.actingSeat];
  if (!seat || seat.status !== 'active') return [];
  const si = state.streetIndex;
  const betting = handCfg.streets[si]?.betting;
  const type = betting?.type ?? 'no-limit';
  const bb = bigBlindOf(handCfg);
  const tc = toCallFor(state, seat.index);
  const curMax = streetMaxWager(state);
  const acts: Action[] = [];

  const minBetFloor = betting?.minBet ?? bb;
  const minRaiseFloor = betting?.minRaise ?? bb;

  if (tc === 0) {
    acts.push({ type: 'check', seat: seat.index, streetIndex: si });
    if (seat.stack > 0) {
      let minBet = minBetFloor;
      let maxBet = seat.stack;
      if (type === 'fixed-limit') {
        const unit = flBetUnit(betting!, si, handCfg.streets.length, bb);
        minBet = Math.min(unit, seat.stack);
        maxBet = unit;
      } else if (type === 'pot-limit') {
        maxBet = Math.min(seat.stack, potTotal(state));
      }
      const amount = Math.min(minBet, maxBet);
      if (amount > 0) {
        acts.push({
          type: 'bet',
          seat: seat.index,
          streetIndex: si,
          amount,
          min: minBet,
          max: maxBet,
        });
      }
      acts.push({ type: 'allin', seat: seat.index, streetIndex: si, amount: seat.stack });
    }
    return acts;
  }

  acts.push({ type: 'fold', seat: seat.index, streetIndex: si });
  if (seat.stack <= 0) return acts;

  acts.push({
    type: 'call',
    seat: seat.index,
    streetIndex: si,
    amount: Math.min(tc, seat.stack),
  });

  const capped =
    type === 'fixed-limit' && raisesThisStreet(state) >= (betting?.maxRaisesPerStreet ?? 0);
  if (capped) return acts;

  if (type === 'fixed-limit') {
    const unit = flBetUnit(betting!, si, handCfg.streets.length, bb);
    const target = curMax + unit; // raise by exactly one unit
    const maxTo = seat.wageredThisStreet + seat.stack;
    if (target <= maxTo) {
      acts.push({
        type: 'raise',
        seat: seat.index,
        streetIndex: si,
        to: target,
        min: target,
        max: target,
      });
    }
  } else {
    const minRaiseTo = curMax + Math.max(state.lastRaiseSize, minRaiseFloor);
    let maxRaiseTo = seat.wageredThisStreet + seat.stack; // no-limit: bounded by stack
    if (type === 'pot-limit') {
      maxRaiseTo = Math.min(maxRaiseTo, potLimitRaiseTo(state, curMax, tc));
    }
    if (maxRaiseTo > curMax) {
      const effMin = Math.min(minRaiseTo, maxRaiseTo);
      acts.push({
        type: 'raise',
        seat: seat.index,
        streetIndex: si,
        to: effMin,
        min: effMin,
        max: maxRaiseTo,
      });
    }
  }

  if (seat.stack > tc) {
    acts.push({ type: 'allin', seat: seat.index, streetIndex: si, amount: seat.stack });
  }
  return acts;
}
