import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  advanceToNextDecision,
  alwaysCallAgent,
  applyAction,
  computeLegalActions,
  createRng,
  dealStreet,
  fixedLimitHoldem,
  initHand,
  omahaHi,
  playHand,
  potLimitHoldem,
  standardHoldem,
  studBringIn,
} from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

// canonical encoding: rank = c % 13 (0='2' … 12='A'), suit = floor(c/13); lower key == lower card
const cardKey = (c: number): number => (c % 13) * 4 + Math.floor(c / 13);
const zeroSum = (final: number[]): number => final.reduce((a, b) => a + b, 0);

describe('antes (forced bets)', () => {
  it('collects an ante from every active seat into the pot pre-deal', () => {
    const g = standardHoldem({ sb: 1, bb: 2, stack: 200, ante: 1 });
    const s = initHand(g.table, g.hand, createRng(1));
    expect(s.seats[0]!.wageredTotal).toBe(2); // ante + sb
    expect(s.seats[1]!.wageredTotal).toBe(3); // ante + bb
    expect(s.seats[0]!.stack).toBe(198);
    expect(s.seats[1]!.stack).toBe(197);
    const pot = s.seats.reduce((a, x) => a + x.wageredTotal, 0);
    expect(pot).toBe(5);
  });
});

describe('pot-limit betting', () => {
  it('caps a raise at the pot-derived maximum and rejects under-raises', () => {
    const g = potLimitHoldem({ sb: 1, bb: 2, stack: 200 });
    const s = initHand(g.table, g.hand, createRng(2));
    // heads-up: button=seat0 (sb) acts first; toCall=1, currentBet=2, pot=3
    const raise = computeLegalActions(s, g.hand).find((a) => a.type === 'raise')!;
    expect(raise.min).toBe(4); // curMax(2) + max(lastRaiseSize=2, bb=2)
    expect(raise.max).toBe(6); // curMax(2) + pot(3) + toCall(1)
    // over-max is clamped down to the pot cap (never exceeds it)
    const over = applyAction(s, { type: 'raise', seat: 0, streetIndex: 0, to: 7 }, g.hand);
    expect(over.seats[0]!.wageredThisStreet).toBe(6);
    // under-minimum raise is rejected
    expect(() =>
      applyAction(s, { type: 'raise', seat: 0, streetIndex: 0, to: 3 }, g.hand),
    ).toThrow();
  });

  it('a pot-limit open bet cannot exceed the current pot', () => {
    const g = potLimitHoldem({ sb: 1, bb: 2, stack: 500 });
    let s = initHand(g.table, g.hand, createRng(7));
    // raise pot to 6, opponent calls -> pot 12, then flop
    s = advanceToNextDecision(
      applyAction(s, { type: 'raise', seat: 0, streetIndex: 0, to: 6 }, g.hand),
    );
    s = advanceToNextDecision(applyAction(s, { type: 'call', seat: 1, streetIndex: 0 }, g.hand));
    expect(s.streetIndex).toBe(1); // reached the flop
    const bet = computeLegalActions(s, g.hand).find((a) => a.type === 'bet')!;
    expect(bet.max).toBe(12); // pot before any flop action
  });
});

describe('fixed-limit betting', () => {
  it('uses the small bet on early streets and the big bet on later streets', () => {
    const g = fixedLimitHoldem({ smallBet: 2, bigBet: 4, maxRaises: 4, sb: 1, bb: 2, stack: 200 });
    let s = initHand(g.table, g.hand, createRng(3));
    // limp preflop (sb completes, bb checks option) -> flop
    s = advanceToNextDecision(applyAction(s, { type: 'call', seat: 0, streetIndex: 0 }, g.hand));
    s = advanceToNextDecision(applyAction(s, { type: 'check', seat: 1, streetIndex: 0 }, g.hand));
    expect(s.streetIndex).toBe(1);

    const flopBet = computeLegalActions(s, g.hand).find((a) => a.type === 'bet')!;
    expect(flopBet.amount).toBe(2);
    expect(flopBet.min).toBe(2);
    expect(flopBet.max).toBe(2);

    s = dealStreet(s, 2); // jump to the turn (big-bet street)
    const turnBet = computeLegalActions(s, g.hand).find((a) => a.type === 'bet')!;
    expect(turnBet.amount).toBe(4);
    expect(turnBet.min).toBe(4);
    expect(turnBet.max).toBe(4);
  });

  it('caps raises at maxRaisesPerStreet', () => {
    const g = fixedLimitHoldem({ smallBet: 2, bigBet: 4, maxRaises: 2, sb: 1, bb: 2, stack: 1000 });
    let s = initHand(g.table, g.hand, createRng(4));
    // limp to the flop
    s = advanceToNextDecision(applyAction(s, { type: 'call', seat: 0, streetIndex: 0 }, g.hand));
    s = advanceToNextDecision(applyAction(s, { type: 'check', seat: 1, streetIndex: 0 }, g.hand));

    // flop: bb leads (bet), then two raises -> cap reached
    s = advanceToNextDecision(
      applyAction(s, { type: 'bet', seat: 1, streetIndex: 1, amount: 2 }, g.hand),
    );
    s = advanceToNextDecision(
      applyAction(s, { type: 'raise', seat: 0, streetIndex: 1, to: 4 }, g.hand),
    ); // raise #1
    s = advanceToNextDecision(
      applyAction(s, { type: 'raise', seat: 1, streetIndex: 1, to: 6 }, g.hand),
    ); // raise #2

    const legal = computeLegalActions(s, g.hand);
    expect(legal.find((a) => a.type === 'raise')).toBeUndefined();
    expect(legal.find((a) => a.type === 'call')).toBeDefined();
  });
});

describe('bring-in (stud forced bet)', () => {
  it('posts bring-in from the lowest upcard seat, counted toward the bet', () => {
    const g = studBringIn({ ante: 1, bringIn: 1, stack: 200 });
    const s = initHand(g.table, g.hand, createRng(5));
    // both seats posted an ante
    expect(s.seats.every((x) => x.wageredTotal >= 1)).toBe(true);
    // lowest upcard acts first and posted the bring-in
    const expectedSeat = cardKey(s.seats[0]!.up[0]!) <= cardKey(s.seats[1]!.up[0]!) ? 0 : 1;
    expect(s.actingSeat).toBe(expectedSeat);
    expect(s.seats[expectedSeat]!.wageredThisStreet).toBe(1);
    const pot = s.seats.reduce((a, x) => a + x.wageredTotal, 0);
    expect(pot).toBe(3); // ante + ante + bring-in

    // bring-in is counted toward the bet: the other seat faces toCall === bring-in
    const bringInSeat = expectedSeat;
    const st = advanceToNextDecision(
      applyAction(s, { type: 'check', seat: bringInSeat, streetIndex: 0 }, g.hand),
    );
    const call = computeLegalActions(st, g.hand).find((a) => a.type === 'call')!;
    expect(call.amount).toBe(1);
  });
});

describe('no-limit regression (unchanged)', () => {
  it('NL raise is bounded only by the stack, not by the pot', () => {
    const g = standardHoldem({ sb: 1, bb: 2, stack: 200 });
    const s = initHand(g.table, g.hand, createRng(6));
    const raise = computeLegalActions(s, g.hand).find((a) => a.type === 'raise')!;
    expect(raise.max).toBe(s.seats[0]!.wageredThisStreet + s.seats[0]!.stack);
  });
});

describe('integration: full hands are zero-sum', () => {
  it('pot-limit holdem', () => {
    const g = potLimitHoldem({ sb: 1, bb: 2, stack: 200 });
    const r = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 11);
    expect(zeroSum(r.finalStacks)).toBe(400);
  });

  it('fixed-limit holdem', () => {
    const g = fixedLimitHoldem({ smallBet: 2, bigBet: 4, maxRaises: 4, sb: 1, bb: 2, stack: 200 });
    const r = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 12);
    expect(zeroSum(r.finalStacks)).toBe(400);
  });

  it('stud with ante + bring-in', () => {
    const g = studBringIn({ ante: 1, bringIn: 1, stack: 200 });
    const r = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 13);
    expect(zeroSum(r.finalStacks)).toBe(400);
  });

  it('pot-limit omaha (dogfood)', () => {
    const g = omahaHi({ sb: 1, bb: 2, stack: 200 });
    g.table.gameId = 'omaha-pl';
    g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: { type: 'pot-limit' } }));
    const r = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(zeroSum(r.finalStacks)).toBe(400);
  });

  it('fixed-limit stud (dogfood)', () => {
    const g = studBringIn({ ante: 1, bringIn: 1, stack: 200 });
    g.hand.streets = g.hand.streets.map((s) => ({
      ...s,
      betting: { type: 'fixed-limit', smallBet: 2, bigBet: 4, maxRaisesPerStreet: 3 },
    }));
    const r = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 33);
    expect(zeroSum(r.finalStacks)).toBe(400);
  });
});
