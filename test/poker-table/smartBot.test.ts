import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  alwaysCallAgent,
  analyzeObservation,
  chenStrength,
  createAggressiveAgent,
  createSmartBot,
  drawBonus,
  fiveCardDraw,
  fixedLimitHoldem,
  madeStrength,
  omahaHi,
  omahaHiLo,
  playHand,
  potLimitOmaha,
  razz,
  requiredStrength,
  sevenStud,
  standardHoldem,
  studBringIn,
  studHiLo,
  tripleDraw27,
} from '../../src/poker-table';
import type {
  Action,
  ActionRecord,
  HandConfig,
  Observation,
  PlayerAgent,
  PublicUpCards,
} from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const HOLDEM_CFG: HandConfig = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }).hand;

type ObsOpts = {
  seat?: number;
  button?: number;
  hole?: number[];
  community?: number[];
  up?: number[];
  ups?: PublicUpCards[];
  handCfg?: HandConfig;
  legal?: Action[];
  toCall?: number;
  pot?: number;
  stack?: number;
  otherStack?: number;
  streetIndex?: number;
  evaluator?: Observation['evaluator'];
  actionLog?: ActionRecord[];
};

function buildObs(o: ObsOpts = {}): Observation {
  const seat = o.seat ?? 0;
  const stack = o.stack ?? 200;
  const otherStack = o.otherStack ?? 200;
  const streetIndex = o.streetIndex ?? 0;
  return {
    seat,
    actingSeat: seat,
    buttonSeat: o.button ?? 0,
    streetIndex,
    streetName: streetIndex === 0 ? 'preflop' : 'flop',
    evaluator: o.evaluator ?? 'high',
    community: o.community ?? [],
    up: o.ups ?? (o.up ? [{ seat, cards: o.up }] : []),
    players: [
      { seat: 0, stack: seat === 0 ? stack : otherStack, bet: 0, wagered: 0, status: 'active' },
      { seat: 1, stack: seat === 1 ? stack : otherStack, bet: 0, wagered: 0, status: 'active' },
    ],
    actionLog: o.actionLog ?? [],
    pot: o.pot ?? 30,
    myHole: o.hole ?? [],
    toCall: o.toCall ?? 0,
    legalActions: o.legal ?? [
      { type: 'check', seat, streetIndex },
      { type: 'bet', seat, streetIndex, min: 10, max: 400, amount: 10 },
    ],
    isTerminal: false,
    handCfg: 'handCfg' in o ? o.handCfg : HOLDEM_CFG,
  };
}

function facingActions(seat: number, toCall = 10): Action[] {
  return [
    { type: 'fold', seat, streetIndex: 0 },
    { type: 'call', seat, streetIndex: 0, amount: toCall },
    { type: 'raise', seat, streetIndex: 0, to: toCall * 2, min: toCall * 2, max: 400 },
  ];
}

function allinAction(seat: number, streetIndex: number, amount: number): Action[] {
  return [
    { type: 'allin', seat, streetIndex, amount },
    { type: 'call', seat, streetIndex, amount },
    { type: 'fold', seat, streetIndex },
  ];
}

describe('chenStrength (starting-hand heuristic)', () => {
  it('ranks the classic hands correctly', () => {
    expect(chenStrength([12, 25])).toBe(1.0); // AA
    expect(chenStrength([11, 24])).toBeCloseTo(0.8); // KK
    expect(chenStrength([12, 11])).toBeCloseTo(0.65); // AKs
    expect(chenStrength([12, 24])).toBeCloseTo(0.55); // AKo
    expect(chenStrength([12, 10])).toBeCloseTo(0.55); // AQs
    expect(chenStrength([11, 9])).toBeCloseTo(0.45); // KJs
    expect(chenStrength([7, 19])).toBeCloseTo(0.275); // 98o
    expect(chenStrength([6, 19])).toBeCloseTo(0.4); // 88
    expect(chenStrength([0, 18])).toBeCloseTo(0.05); // 72o
  });

  it('rewards suitedness and pairs above garbage', () => {
    expect(chenStrength([12, 11])).toBeGreaterThan(chenStrength([12, 24])); // AKs > AKo
    expect(chenStrength([11, 9])).toBeGreaterThan(chenStrength([9, 19])); // KJs > J8o
    expect(chenStrength([12, 25])).toBeGreaterThan(chenStrength([12, 11])); // AA > AKs
    expect(chenStrength([])).toBe(0);
    expect(chenStrength([12])).toBe(0);
  });

  it('stays inside [0, 1]', () => {
    for (let a = 0; a < 52; a += 7) {
      for (let b = 1; b < 52; b += 11) {
        if (a === b) continue;
        const s = chenStrength([a, b]);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('analyzeObservation (context extraction)', () => {
  it('computes heads-up position from the button', () => {
    const btn = buildObs({ seat: 0, button: 0 });
    expect(analyzeObservation(btn).position).toBe(1); // button acts last
    expect(analyzeObservation(btn).behind).toBe(0);
    const bb = buildObs({ seat: 1, button: 0 });
    expect(analyzeObservation(bb).position).toBe(0); // BB acts first
    expect(analyzeObservation(bb).behind).toBe(1);
  });

  it('computes pot odds, spr and chip lead', () => {
    const ctx = analyzeObservation(buildObs({ toCall: 10, pot: 20, stack: 200 }));
    expect(ctx.potOdds).toBeCloseTo(10 / 30);
    expect(ctx.spr).toBeCloseTo(200 / 20);
    expect(ctx.chipLead).toBe(1);
    const short = analyzeObservation(buildObs({ stack: 60, otherStack: 240, pot: 200 }));
    expect(short.chipLead).toBeCloseTo(0.25);
  });

  it('measures aggression pressure from the action log (same street, others only)', () => {
    const log: ActionRecord[] = [
      { seat: 1, streetIndex: 0, type: 'raise' },
      { seat: 0, streetIndex: 0, type: 'call' },
      { seat: 1, streetIndex: 1, type: 'bet' },
    ];
    const ctx = analyzeObservation(buildObs({ seat: 0, actionLog: log }));
    expect(ctx.pressure).toBe(2); // own call and later-street bet ignored
  });
});

describe('requiredStrength (context threshold)', () => {
  const base: ReturnType<typeof analyzeObservation> = {
    myStack: 200,
    toCall: 0,
    pot: 30,
    potOdds: 0,
    spr: 6.67,
    chipLead: 1,
    opponents: 1,
    behind: 0,
    position: 1,
    pressure: 0,
    facingBet: false,
    free: true,
    streetIndex: 0,
    activeCount: 2,
    game: {
      streets: 4,
      holeCards: 2,
      hasUpCards: false,
      actionOrder: 'left-of-button',
      betting: 'no-limit',
      isLow: false,
      isHilo: false,
      lowQualify: undefined,
      composition: undefined,
    },
  };

  it('scales with tightness and clamps the input to [0, 1]', () => {
    expect(requiredStrength(base, 0)).toBeCloseTo(0.3);
    expect(requiredStrength(base, 1)).toBeCloseTo(0.58);
    expect(requiredStrength(base, 5)).toBeCloseTo(0.58); // clamped like tightness 1
    expect(requiredStrength(base, -1)).toBeCloseTo(0.3); // clamped like tightness 0
  });

  it('is cheaper in position and when priced in', () => {
    const oop = { ...base, position: 0, behind: 1 };
    expect(requiredStrength(oop, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
    const priced = { ...base, potOdds: 0.5 };
    expect(requiredStrength(priced, 0.5)).toBeLessThan(requiredStrength(base, 0.5));
    const pressured = { ...base, pressure: 2 };
    expect(requiredStrength(pressured, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
  });

  it('reacts to stack depth and chip lead', () => {
    const desperate = { ...base, spr: 0.2 };
    expect(requiredStrength(desperate, 0.5)).toBeLessThan(requiredStrength(base, 0.5));
    const short = { ...base, spr: 1 };
    expect(requiredStrength(short, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
    const deep = { ...base, spr: 10 };
    expect(requiredStrength(deep, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
    const leader = { ...base, chipLead: 2 };
    expect(requiredStrength(leader, 0.5)).toBeLessThan(requiredStrength(base, 0.5));
    const dog = { ...base, chipLead: 0.2 };
    expect(requiredStrength(dog, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
  });

  it('demands more in Omaha and in low games', () => {
    const omaha = { ...base, game: { ...base.game, holeCards: 4 } };
    expect(requiredStrength(omaha, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
    const low = { ...base, game: { ...base.game, isLow: true } };
    expect(requiredStrength(low, 0.5)).toBeGreaterThan(requiredStrength(base, 0.5));
  });
});

describe('madeStrength (postflop evaluation)', () => {
  it('recognises the nuts as ~1.0', () => {
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 11], // A♠ K♠
      community: [10, 9, 8, 0, 1], // Q♠ J♠ T♠ 2♠ 3♠
    });
    expect(madeStrength(obs)).toBeCloseTo(1.0, 3); // 7-card table tops out at 7461/7462
  });

  it('ranks a pair above a bare ace-high', () => {
    const pair = buildObs({ hole: [0, 13], community: [27, 28, 29, 31] }); // 2♠2♥ + 3♦4♦5♦7♦
    const aceHigh = buildObs({
      hole: [12, 11], // A♠ K♠
      community: [14, 16, 18, 20], // 3♥5♥7♥9♥
    });
    expect(madeStrength(aceHigh)).toBeLessThan(madeStrength(pair));
    expect(madeStrength(pair)).toBeLessThan(0.5);
  });

  it('scores low-ball hands for the A5/8-qualify objective', () => {
    const wheel = buildObs({ evaluator: 'low8', hole: [0, 1, 2, 3, 12] });
    expect(madeStrength(wheel)).toBe(1.0); // A-2-3-4-5
    const bricks = buildObs({ evaluator: 'low8', hole: [5, 6, 7, 8, 10] });
    expect(madeStrength(bricks)).toBe(0); // 7-8-9-T-Q: no qualifying low
  });

  it('scores a 2-7 lowball hand with ace high', () => {
    const good = buildObs({ evaluator: '2-7-low', hole: [0, 1, 2, 3, 5] }); // 2-3-4-5-7
    const bad = buildObs({ evaluator: '2-7-low', hole: [0, 1, 2, 3, 12] }); // ace in the middle
    expect(madeStrength(good)).toBe(1.0);
    expect(madeStrength(bad)).toBeLessThan(madeStrength(good));
  });

  it('estimates strength from partial stud streets and evaluates once five cards show', () => {
    const paired = buildObs({ streetIndex: 1, hole: [0, 13], up: [14] }); // 2♠2♥ + 3♥
    const aceHigh = buildObs({ streetIndex: 1, hole: [12, 11], up: [14] }); // A♠K♠ + 3♥
    const five = buildObs({ streetIndex: 2, hole: [12, 11], up: [14, 16, 18] }); // A♠K♠ 3♥5♥7♥
    expect(madeStrength(paired)).toBeCloseTo(0.45); // pair of deuces, no made 5-card hand
    expect(madeStrength(aceHigh)).toBeCloseTo(0.4); // bare ace high
    expect(madeStrength(paired)).toBeGreaterThan(madeStrength(aceHigh));
    expect(madeStrength(five)).toBeGreaterThan(0);
    expect(madeStrength(five)).toBeLessThan(0.5);
  });
});

describe('drawBonus decays by street count', () => {
  // A♠K♠ + T♠J♠ = 4-flush with an inside straight draw on the flop.
  const flop = buildObs({ streetIndex: 1, hole: [12, 11], community: [8, 9, 14] });
  const river = buildObs({ streetIndex: 3, hole: [12, 11], community: [8, 9, 14, 15, 16] });
  const studFifth = buildObs({
    streetIndex: 2,
    hole: [12, 11],
    up: [8, 9, 14],
    handCfg: sevenStud().hand,
  });

  it('is worth most on early streets and zero on the final street', () => {
    expect(drawBonus(flop)).toBeCloseTo(0.13 * (2 / 3)); // 4-street game, flop
    expect(drawBonus(river)).toBe(0); // river: draws are dead
    expect(drawBonus(studFifth)).toBeCloseTo(0.13 * 0.5); // 5-street stud, fifth street
  });

  it('never applies preflop or in low games', () => {
    expect(drawBonus(buildObs({ streetIndex: 0, hole: [12, 11], community: [8, 9, 14] }))).toBe(0);
    expect(
      drawBonus(
        buildObs({ evaluator: 'low8', streetIndex: 1, hole: [12, 11], community: [8, 9, 14] }),
      ),
    ).toBe(0);
  });
});

describe('game-type awareness', () => {
  it('judges Razz third-street lows: plays a strong low, folds a dead one', () => {
    const razzCfg = razz().hand;
    const good = buildObs({
      evaluator: 'A5-low',
      handCfg: razzCfg,
      seat: 0,
      ups: [
        { seat: 0, cards: [14] }, // 3♥ up — acts after the bring-in
        { seat: 1, cards: [0] }, // 2♠ up — bring-in, acts first
      ],
      hole: [12, 0], // A♠2♠ + 3♥ up → A-2-3
    });
    const dead = buildObs({
      evaluator: 'A5-low',
      handCfg: razzCfg,
      seat: 0,
      ups: [
        { seat: 0, cards: [13] }, // 2♥ up — pairs the deuce
        { seat: 1, cards: [0] }, // 2♠ up — bring-in, acts first
      ],
      hole: [12, 0],
      toCall: 5,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'raise' }],
      legal: facingActions(0, 5),
    });
    const bot = createSmartBot({ seed: 21, aggression: 0.5, tightness: 0.9 });
    expect(bot.decide(good).type).toBe('bet');
    expect(bot.decide(dead).type).toBe('fold');
  });

  it('ranks Omaha hi-lo lows only via exactly-two hole-card compositions', () => {
    const hiloCfg = omahaHiLo().hand;
    // A♠2♥3♦4♣ + 5♠6♠7♠8♠9♠: the naive 5-lowest-distinct would pick A-2-3-4-5
    // (four hole cards — illegal in Omaha). The legal best low uses exactly two
    // hole cards: A-2-5-6-7.
    const obs = buildObs({
      evaluator: 'hi-lo',
      handCfg: hiloCfg,
      streetIndex: 3,
      hole: [12, 13, 26, 39],
      community: [3, 4, 5, 6, 7],
    });
    expect(madeStrength(obs)).toBeGreaterThan(0.5);
    expect(madeStrength(obs)).toBeLessThan(0.95);
  });

  it('derives stud third-street position from the up-cards, not the button', () => {
    const studCfg = studBringIn().hand; // street 0 action order: 'low-upcard'
    const ups: PublicUpCards[] = [
      { seat: 0, cards: [12] }, // A♠ — acts last
      { seat: 1, cards: [0] }, // 2♠ — bring-in, acts first
    ];
    const mine = buildObs({ seat: 0, handCfg: studCfg, ups, streetIndex: 0 });
    const theirs = buildObs({ seat: 1, handCfg: studCfg, ups, streetIndex: 0 });
    expect(analyzeObservation(mine).position).toBe(1);
    expect(analyzeObservation(theirs).position).toBe(0);
    expect(analyzeObservation(theirs).behind).toBe(1);
  });
});

describe('game-type inference without a hand config', () => {
  it('still evaluates omaha, draw and stud shapes correctly', () => {
    const omaha = buildObs({
      handCfg: undefined,
      hole: [0, 1, 12, 13],
      community: [2, 3, 4, 5, 6],
    });
    const draw = buildObs({ handCfg: undefined, hole: [12, 11, 10, 9, 8] }); // A♠K♠Q♠J♠T♠
    const stud = buildObs({ handCfg: undefined, hole: [12, 11], up: [8, 9] });
    const holdem = buildObs({ handCfg: undefined, hole: [12, 11], community: [8, 9, 14, 15, 16] });
    expect(madeStrength(omaha)).toBeGreaterThan(0);
    expect(madeStrength(draw)).toBeCloseTo(1.0, 3);
    expect(madeStrength(stud)).toBeGreaterThan(0);
    expect(madeStrength(holdem)).toBeGreaterThan(0);
  });

  it('retries the low score with the inferred selector when the config cannot form a hand', () => {
    // Omaha hi-lo config needs exactly 2 hole + 3 community, but there is no
    // community — the shape inference must take over and score the dealt hand.
    // A paired 5-card low then scores 0 (no low), not a partial low of ~0.8.
    const retry = buildObs({
      evaluator: 'low8',
      handCfg: omahaHiLo().hand,
      hole: [0, 1, 13, 2, 3], // 2♠2♥3♠4♠5♠
    });
    expect(madeStrength(retry)).toBe(0);
  });

  it('falls back to a fixed street decay for draw bonuses', () => {
    const flop = buildObs({
      handCfg: undefined,
      streetIndex: 1,
      hole: [12, 11],
      community: [8, 9, 14],
    });
    expect(drawBonus(flop)).toBeCloseTo(0.13 * 0.75);
  });
});

describe('smart bot decision policy', () => {
  it('folds to a raise out of position but bets the same hand in position', () => {
    const bot = createSmartBot({ seed: 1, aggression: 0.5, tightness: 0.5 });
    const inPos = buildObs({ hole: [11, 9] }); // KJs on the button, action free
    const outPos = buildObs({
      seat: 1,
      hole: [11, 9],
      toCall: 10,
      pot: 30,
      actionLog: [{ seat: 0, streetIndex: 0, type: 'raise' }],
      legal: facingActions(1),
    });
    expect(bot.decide(inPos).type).toBe('bet');
    expect(bot.decide(outPos).type).toBe('fold');
  });

  it('raises more often with high aggression, calls with low aggression', () => {
    const facing = buildObs({
      seat: 1,
      hole: [12, 11], // AKs
      toCall: 10,
      pot: 30,
      actionLog: [{ seat: 0, streetIndex: 0, type: 'raise' }],
      legal: facingActions(1),
    });
    const lag = createSmartBot({ seed: 2, aggression: 0.9, tightness: 0.5 });
    const nit = createSmartBot({ seed: 2, aggression: 0.1, tightness: 0.5 });
    expect(lag.decide(facing).type).toBe('raise');
    expect(nit.decide(facing).type).toBe('call');
  });

  it('folds a medium hand when tight, bets it when loose', () => {
    const free = buildObs({ hole: [6, 19] }); // 88
    const tight = createSmartBot({ seed: 3, aggression: 0.5, tightness: 0.9, bluffiness: 0 });
    const loose = createSmartBot({ seed: 3, aggression: 0.5, tightness: 0.1, bluffiness: 0 });
    expect(tight.decide(free).type).toBe('check');
    expect(loose.decide(free).type).toBe('bet');
  });

  it('calls on huge pot odds even below the threshold, folds cheap draws', () => {
    const pricedIn = buildObs({
      hole: [12, 0], // A2s
      toCall: 200,
      pot: 600,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'bet' }],
      legal: facingActions(0, 200),
    });
    const noPrice = buildObs({
      hole: [12, 0],
      toCall: 2,
      pot: 200,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'bet' }],
      legal: facingActions(0, 2),
    });
    const garbage = buildObs({
      hole: [0, 18], // 72o
      toCall: 200,
      pot: 600,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'bet' }],
      legal: facingActions(0, 200),
    });
    const bot = createSmartBot({ seed: 4, aggression: 0.5, tightness: 0.3 });
    expect(bot.decide(pricedIn).type).toBe('call');
    expect(bot.decide(noPrice).type).toBe('fold');
    expect(bot.decide(garbage).type).toBe('fold');
  });

  it('bluffs a near-threshold hand only when configured to', () => {
    const free = buildObs({ hole: [12, 2] }); // A4s below the button bar
    let blufferBets = 0;
    let nonBlufferBets = 0;
    for (let seed = 10; seed < 50; seed++) {
      const bluffer = createSmartBot({ seed, aggression: 0.9, tightness: 0.5, bluffiness: 0.95 });
      const nonBluffer = createSmartBot({ seed, aggression: 0.9, tightness: 0.5, bluffiness: 0 });
      if (bluffer.decide(free).type === 'bet') blufferBets++;
      if (nonBluffer.decide(free).type === 'bet') nonBlufferBets++;
    }
    expect(blufferBets).toBeGreaterThan(30);
    expect(nonBlufferBets).toBe(0);
  });

  it('shoves when desperate, when committed, or with a made nuts hand', () => {
    const desperate = buildObs({
      hole: [12, 25], // AA
      stack: 50,
      pot: 200,
      toCall: 40,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'raise' }],
      legal: allinAction(0, 0, 50),
    });
    const committed = buildObs({
      hole: [12, 25],
      stack: 100,
      pot: 50,
      toCall: 60,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'raise' }],
      legal: allinAction(0, 0, 100),
    });
    const nuts = buildObs({
      streetIndex: 2,
      hole: [12, 11],
      community: [10, 9, 8, 0, 1],
      stack: 500,
      pot: 200,
      legal: allinAction(0, 2, 500),
    });
    const deep = buildObs({
      hole: [12, 25],
      stack: 500,
      pot: 200,
      toCall: 40,
      actionLog: [{ seat: 1, streetIndex: 0, type: 'raise' }],
      legal: [
        { type: 'fold', seat: 0, streetIndex: 0 },
        { type: 'call', seat: 0, streetIndex: 0, amount: 40 },
        { type: 'raise', seat: 0, streetIndex: 0, to: 60, min: 60, max: 500 },
      ],
    });
    const bot = createSmartBot({ seed: 5, aggression: 0.5, tightness: 0.5 });
    expect(bot.decide(desperate).type).toBe('allin');
    expect(bot.decide(committed).type).toBe('allin');
    expect(bot.decide(nuts).type).toBe('allin');
    expect(bot.decide(deep).type).toBe('raise');
  });

  it('clamps bet sizing to the legal [min, max] range', () => {
    const tiny = buildObs({
      hole: [12, 25],
      legal: [{ type: 'bet', seat: 0, streetIndex: 0, min: 10, max: 200, amount: 10 }],
    });
    const huge = buildObs({
      hole: [12, 25],
      legal: [{ type: 'bet', seat: 0, streetIndex: 0, min: 10, max: 200, amount: 10 }],
    });
    const botTiny = createSmartBot({ seed: 6, aggression: 0.5, tightness: 0.5, sizing: 0.01 });
    const botHuge = createSmartBot({ seed: 6, aggression: 0.5, tightness: 0.5, sizing: 8 });
    expect(botTiny.decide(tiny).amount).toBe(10);
    expect(botHuge.decide(huge).amount).toBe(200);
  });

  it('falls back to the first legal action when no preferred action exists', () => {
    const weakOnlyCall = buildObs({
      hole: [0, 18],
      legal: [{ type: 'call', seat: 0, streetIndex: 0, amount: 5 }],
    });
    const mediumOnlyCall = buildObs({
      hole: [6, 19],
      legal: [{ type: 'call', seat: 0, streetIndex: 0, amount: 5 }],
    });
    const facingFoldOnly = buildObs({
      hole: [12, 25],
      legal: [{ type: 'fold', seat: 0, streetIndex: 0 }],
    });
    const freeRaiseOnly = buildObs({
      hole: [12, 25],
      legal: [
        { type: 'raise', seat: 0, streetIndex: 0, to: 20, min: 20, max: 400 },
        { type: 'check', seat: 0, streetIndex: 0 },
      ],
    });
    const loose = createSmartBot({ seed: 8, aggression: 0.3, tightness: 0.3 });
    const passive = createSmartBot({ seed: 8, aggression: 0.1, tightness: 0.3 });
    const bot = createSmartBot({ seed: 8, aggression: 0.5, tightness: 0.5 });
    expect(loose.decide(weakOnlyCall).type).toBe('call'); // S < R, nothing else legal
    expect(passive.decide(mediumOnlyCall).type).toBe('call'); // S >= R but below the bet bar
    expect(bot.decide(facingFoldOnly).type).toBe('fold'); // strong but only fold is legal
    expect(bot.decide(freeRaiseOnly).type).toBe('raise'); // free, no bet action, raise offered
  });

  it('folds on an empty action list', () => {
    const bot = createSmartBot({ seed: 7, aggression: 0.5, tightness: 0.5 });
    const obs = buildObs({ legal: [] });
    expect(bot.decide(obs).type).toBe('fold');
  });
});

describe('smart bot vs. stub lineups (long-run behaviour)', () => {
  it('stays deterministic per seed', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const r1 = playHand(
      g.table,
      g.hand,
      [createSmartBot({ seed: 9, aggression: 0.7, tightness: 0.4 }), alwaysCallAgent],
      11,
    );
    const r2 = playHand(
      g.table,
      g.hand,
      [createSmartBot({ seed: 9, aggression: 0.7, tightness: 0.4 }), alwaysCallAgent],
      11,
    );
    expect(r1.actions).toEqual(r2.actions);
  });

  it('a tight bot folds preflop more than a loose one against an aggressive opponent', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    let tightFolds = 0;
    let looseFolds = 0;
    for (let seed = 1; seed <= 80; seed++) {
      const tight = playHand(
        g.table,
        g.hand,
        [
          createSmartBot({ seed: seed * 3, aggression: 0.4, tightness: 0.9 }),
          createAggressiveAgent(seed * 3 + 1),
        ],
        seed,
      );
      const loose = playHand(
        g.table,
        g.hand,
        [
          createSmartBot({ seed: seed * 3, aggression: 0.4, tightness: 0.1 }),
          createAggressiveAgent(seed * 3 + 1),
        ],
        seed,
      );
      tightFolds += tight.actions.filter(
        (a) => a.type === 'fold' && a.seat === 0 && a.streetIndex === 0,
      ).length;
      looseFolds += loose.actions.filter(
        (a) => a.type === 'fold' && a.seat === 0 && a.streetIndex === 0,
      ).length;
    }
    expect(tightFolds).toBeGreaterThan(looseFolds + 10);
  });

  it('an aggressive bot bets more than a passive one', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    let aggroBets = 0;
    let passiveBets = 0;
    for (let seed = 1; seed <= 80; seed++) {
      const aggro = playHand(
        g.table,
        g.hand,
        [createSmartBot({ seed: seed * 5, aggression: 0.9, tightness: 0.25 }), alwaysCallAgent],
        seed,
      );
      const passive = playHand(
        g.table,
        g.hand,
        [createSmartBot({ seed: seed * 5, aggression: 0.1, tightness: 0.25 }), alwaysCallAgent],
        seed,
      );
      aggroBets += aggro.actions.filter(
        (a) => a.seat === 0 && (a.type === 'bet' || a.type === 'raise'),
      ).length;
      passiveBets += passive.actions.filter(
        (a) => a.seat === 0 && (a.type === 'bet' || a.type === 'raise'),
      ).length;
    }
    expect(aggroBets).toBeGreaterThan(passiveBets + 8);
  });

  it('runs every variant without an illegal action and stays zero-sum', () => {
    const variants = [
      standardHoldem({ seats: 6, sb: 1, bb: 2, stack: 200 }),
      omahaHi(),
      omahaHiLo(),
      sevenStud(),
      razz(),
      tripleDraw27(),
      fiveCardDraw(),
      fixedLimitHoldem(),
      studHiLo(),
      potLimitOmaha(),
      studBringIn(),
    ];
    const profiles: Array<() => PlayerAgent> = [
      () => createSmartBot({ seed: 1, aggression: 0.8, tightness: 0.2 }),
      () => createSmartBot({ seed: 2, aggression: 0.3, tightness: 0.7 }),
      () =>
        createSmartBot({ seed: 3, aggression: 0.5, tightness: 0.5, bluffiness: 0.2, sizing: 1 }),
      () => createSmartBot({ seed: 4, aggression: 0.9, tightness: 0.1 }),
      () => createSmartBot({ seed: 5, aggression: 0.2, tightness: 0.8 }),
      () => createAggressiveAgent(7),
    ];
    for (const g of variants) {
      for (let seed = 1; seed <= 12; seed++) {
        const agents = profiles.map((p) => p());
        const res = playHand(g.table, g.hand, agents, seed);
        expect(() => res).not.toThrow();
        const buyIn = g.hand.stacks.buyIn;
        const total = res.finalStacks.reduce((a, b) => a + b, 0);
        expect(total).toBe(buyIn * g.table.seats.min);
      }
    }
  });
});
