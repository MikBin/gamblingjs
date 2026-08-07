import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  advanceToNextDecision,
  alwaysCallAgent,
  applyAction,
  computeLegalActions,
  createAggressiveAgent,
  createManiacAgent,
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
import type { PlayerAgent } from '../../src/poker-table';

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

// Regression: a fixed-limit `bet` whose unit exceeds a short stack must be capped
// at the stack. Previously `maxBet = unit` let a sized bet over-deduct, producing
// a negative stack and breaking chip conservation (surfaced by the SNG driver).
// Regression: fixed-limit all-in is only legal for short stacks that cannot
// complete the bet/call. A full stack must bet/raise in fixed units — a
// voluntary shove is a no-limit concept and was leaking into FL (seen in the
// HORSE SNG browser test: a full-stack Omaha Hi/Lo shove).
describe('fixed-limit all-in restriction (short stacks only)', () => {
  const g = fixedLimitHoldem({ smallBet: 100, bigBet: 200, maxRaises: 4, sb: 50, bb: 100 });

  it('full stack facing no bet: no all-in, bet capped at the fixed unit', () => {
    const s = dealStreet(initHand(g.table, g.hand, createRng(1), [1000, 1000]), 1);
    s.actingSeat = 0;
    const legal = computeLegalActions(s, g.hand);
    expect(legal.find((a) => a.type === 'allin')).toBeUndefined();
    const bet = legal.find((a) => a.type === 'bet')!;
    expect(bet.amount).toBe(100);
    expect(bet.max).toBe(100);
  });

  it('short stack facing no bet: all-in offered for the whole stack', () => {
    // 80 stack posts the 50 SB, leaving 30 — alive but below the 100 unit.
    const s = dealStreet(initHand(g.table, g.hand, createRng(2), [80, 1000]), 1);
    s.actingSeat = 0;
    const legal = computeLegalActions(s, g.hand);
    const ai = legal.find((a) => a.type === 'allin')!;
    expect(ai.amount).toBe(30);
  });

  it('full stack facing a bet: no all-in, raise available in units', () => {
    const s = initHand(g.table, g.hand, createRng(3), [1000, 1000]); // HU preflop: seat 0 (SB) faces 50
    const legal = computeLegalActions(s, g.hand);
    expect(legal.find((a) => a.type === 'call')!.amount).toBe(50);
    expect(legal.find((a) => a.type === 'allin')).toBeUndefined();
    const raise = legal.find((a) => a.type === 'raise')!;
    expect(raise.to).toBe(200); // curMax 100 + one unit 100
    expect(raise.min).toBe(raise.max); // fixed target
  });

  it('short stack facing a bet: all-in offered (cannot complete the call)', () => {
    // 80 stack posts the 50 SB, leaving 30 — facing a 50 call it cannot make.
    const s = initHand(g.table, g.hand, createRng(4), [80, 1000]);
    const legal = computeLegalActions(s, g.hand);
    const ai = legal.find((a) => a.type === 'allin')!;
    expect(ai.amount).toBe(30);
    expect(legal.find((a) => a.type === 'call')!.amount).toBe(30);
  });

  it('no-limit keeps the open shove legal for full stacks', () => {
    const gnl = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const s = dealStreet(initHand(gnl.table, gnl.hand, createRng(5), [200, 200]), 1);
    s.actingSeat = 0;
    const legal = computeLegalActions(s, gnl.hand);
    const ai = legal.find((a) => a.type === 'allin')!;
    expect(ai.amount).toBe(199); // full remaining stack (post-SB) — shove stays legal in NL
  });
});

// Regression: 8-handed stud with everyone calling through to 7th street needs
// 56 cards but the deck has 52 — the standard stud "common card" rule kicks in:
// the final down card is one shared card dealt to all remaining players.
describe('stud common-card rule (short deck)', () => {
  it('8-handed razz with never-folding bots completes the river', () => {
    const g = studBringIn({ ante: 1, bringIn: 1, stack: 200 });
    g.table.seats = { min: 8, max: 8 };
    for (let seed = 1; seed <= 10; seed++) {
      const agents: PlayerAgent[] = Array.from({ length: 8 }, () => alwaysCallAgent);
      const r = playHand(g.table, g.hand, agents, seed);
      expect(r.isTerminal).toBe(true);
      // every seat got 7 cards (3 down + 4 up in stud)
      for (const hole of r.dealt.hole) expect(hole.length).toBe(3);
      for (const up of r.dealt.up) expect(up.length).toBe(4);
      // chips conserved
      expect(r.finalStacks.reduce((a, b) => a + b, 0)).toBe(8 * 200);
    }
  });
});

describe('fixed-limit short-stack bet never over-deducts', () => {
  it('keeps fixed-limit hands zero-sum and non-negative with short stacks', () => {
    // Unit (100) dwarfs the stacks so bots are forced into the bet-over-unit path.
    const g = fixedLimitHoldem({ smallBet: 100, bigBet: 200, maxRaises: 4, sb: 50, bb: 100 });
    for (let seed = 1; seed <= 50; seed++) {
      const r = playHand(
        g.table,
        g.hand,
        [createAggressiveAgent(seed), createManiacAgent(seed + 1)],
        seed,
        [40, 40],
      );
      for (const s of r.finalStacks) expect(s).toBeGreaterThanOrEqual(0);
      expect(zeroSum(r.finalStacks)).toBe(80);
    }
  });
});
