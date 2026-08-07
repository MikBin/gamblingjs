import { describe, it, expect } from 'vitest';
import {
  aFiveTripleDraw,
  alwaysCallAgent,
  fiveCardDraw,
  playHand,
  potLimitOmaha,
  tripleDraw27,
  validateHandConfig,
} from '../../src/poker-table';

describe('draw + omaha presets', () => {
  it('tripleDraw27 builds, validates, and plays a full 3-draw hand', () => {
    const g = tripleDraw27({ sb: 1, bb: 2, smallBet: 2, bigBet: 4, maxRaises: 4 });
    expect(() => validateHandConfig(g.hand)).not.toThrow();
    expect(g.table.gameId).toBe('2-7-triple-draw');
    // Three draw streets after the initial deal.
    const drawStreets = g.hand.streets.filter((s) => s.draw);
    expect(drawStreets).toHaveLength(3);
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
    expect(res.isTerminal).toBe(true);
  });

  it('aFiveTripleDraw builds and plays (A-5 low evaluator path)', () => {
    const g = aFiveTripleDraw({ sb: 1, bb: 2 });
    expect(() => validateHandConfig(g.hand)).not.toThrow();
    expect(g.table.gameId).toBe('a-5-triple-draw');
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
  });

  it('fiveCardDraw builds, validates, and plays a 1-draw hand', () => {
    const g = fiveCardDraw({ sb: 1, bb: 2 });
    expect(() => validateHandConfig(g.hand)).not.toThrow();
    expect(g.table.gameId).toBe('five-card-draw');
    expect(g.hand.streets.filter((s) => s.draw)).toHaveLength(1);
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
  });

  it('potLimitOmaha builds, validates, and plays a hand', () => {
    const g = potLimitOmaha({ sb: 1, bb: 2 });
    expect(() => validateHandConfig(g.hand)).not.toThrow();
    expect(g.table.gameId).toBe('omaha-pl');
    expect(g.hand.streets.every((s) => s.betting.type === 'pot-limit')).toBe(true);
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 21);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
  });

  it('rejects an invalid draw config (max exceeds hole cards)', () => {
    const g = fiveCardDraw({ sb: 1, bb: 2 });
    // Tamper: ask to discard 6 from a 5-card hand.
    g.hand.streets[1]!.draw = { from: 'hole', max: 6 };
    expect(() => validateHandConfig(g.hand)).toThrow();
  });

  it('accepts the full set of optional preset knobs', () => {
    // Exercises the ante/maxRaises (draw games) and minBet/minRaise (PLO) branches.
    const td = tripleDraw27({ sb: 1, bb: 2, smallBet: 2, bigBet: 4, maxRaises: 4, ante: 1 });
    expect(td.hand.forcedBets.ante).toBe(1);
    expect(td.hand.streets[0]!.betting.maxRaisesPerStreet).toBe(4);
    expect(() => validateHandConfig(td.hand)).not.toThrow();

    const a5 = aFiveTripleDraw({ sb: 1, bb: 2, maxRaises: 4, ante: 1 });
    expect(a5.hand.forcedBets.ante).toBe(1);
    expect(() => validateHandConfig(a5.hand)).not.toThrow();

    const fcd = fiveCardDraw({ sb: 1, bb: 2, ante: 1 });
    expect(fcd.hand.forcedBets.ante).toBe(1);
    expect(() => validateHandConfig(fcd.hand)).not.toThrow();

    const plo = potLimitOmaha({ sb: 1, bb: 2, minBet: 2, minRaise: 2 });
    expect(plo.hand.streets[0]!.betting.minBet).toBe(2);
    expect(plo.hand.streets[0]!.betting.minRaise).toBe(2);
    expect(() => validateHandConfig(plo.hand)).not.toThrow();
  });
});
