import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  alwaysCallAgent,
  createRandomAgent,
  createSearchAgent,
  monteCarloEquity,
  omahaHi,
  playHand,
  razz,
  resolveSearchBotConfig,
  standardHoldem,
  Table,
} from '../../src/poker-table';
import type {
  Action,
  EquityArgs,
  HandConfig,
  Observation,
  PlayerAgent,
  PublicUpCards,
} from '../../src/poker-table';
import { createRng } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
});

const HOLDEM_SELECTOR = {
  total: 5,
  pools: [
    { pool: 'hole' as const, min: 0, max: 5 },
    { pool: 'community' as const, min: 0, max: 5 },
  ],
};

function holdemEquity(
  myPrivate: number[],
  community: number[],
  nOpponents: number,
  seed: number,
  nSamples = 4000,
) {
  const args: EquityArgs = {
    myPrivate,
    community,
    opponentUp: Array.from({ length: nOpponents }, () => []),
    selector: HOLDEM_SELECTOR,
    kind: 'high',
    privateTotal: 2,
    communityTotal: 5,
    nSamples,
    rng: createRng(seed),
  };
  return monteCarloEquity(args).equity;
}

describe('monteCarloEquity — correctness', () => {
  it('is a certain win (equity 1) when there are no opponents to beat', () => {
    const args: EquityArgs = {
      myPrivate: [12, 25],
      community: [],
      opponentUp: [],
      selector: HOLDEM_SELECTOR,
      kind: 'high',
      privateTotal: 2,
      communityTotal: 5,
      nSamples: 100,
      rng: createRng(1),
    };
    expect(monteCarloEquity(args).equity).toBe(1);
  });

  it('rates pocket aces vs one random hand preflop near the known ~0.85', () => {
    // A♠ (12) and A♥ (25 = 12 + 13).
    const e = holdemEquity([12, 25], [], 1, 42);
    expect(e).toBeGreaterThan(0.8);
    expect(e).toBeLessThan(0.9);
  });

  it('is in [0, 1] and drops as the field grows (aces vs many opponents)', () => {
    const hu = holdemEquity([12, 25], [], 1, 7);
    const three = holdemEquity([12, 25], [], 3, 7);
    expect(hu).toBeGreaterThanOrEqual(0);
    expect(hu).toBeLessThanOrEqual(1);
    expect(three).toBeLessThan(hu);
  });

  it('rates a made monster on the river as a near-certain win', () => {
    // A♠ A♥ in hand (12, 25); board A♦ A♣ 2♠ 3♠ 4♠ (38, 51, 0, 1, 2) → quad aces, the nuts.
    const e = holdemEquity([12, 25], [38, 51, 0, 1, 2], 1, 99, 3000);
    expect(e).toBeGreaterThan(0.95);
  });

  it('variance shrinks as the sample count rises', () => {
    const lows: number[] = [];
    const highs: number[] = [];
    for (let s = 0; s < 8; s++) {
      lows.push(holdemEquity([12, 25], [], 1, s, 200));
      highs.push(holdemEquity([12, 25], [], 1, s, 6000));
    }
    const spread = (xs: number[]): number => Math.max(...xs) - Math.min(...xs);
    expect(spread(highs)).toBeLessThan(spread(lows));
  });
});

describe('createSearchAgent — legality, zero-sum, universality', () => {
  const variants = [
    { name: 'holdem', preset: standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }) },
    { name: 'omaha', preset: omahaHi() },
    { name: 'razz', preset: razz() },
  ];

  it('plays every variant without an illegal action and preserves chips', () => {
    for (const v of variants) {
      for (let seed = 1; seed <= 8; seed++) {
        const agents: PlayerAgent[] = [
          createSearchAgent({ seed: seed * 7, equitySamples: 250 }),
          createSearchAgent({ seed: seed * 11 + 1, equitySamples: 250 }),
        ];
        const res = playHand(v.preset.table, v.preset.hand, agents, seed);
        const buyIn = v.preset.hand.stacks.buyIn;
        const total = res.finalStacks.reduce((a, b) => a + b, 0);
        expect(total).toBe(buyIn * v.preset.table.seats.min);
      }
    }
  });

  it('always returns an action present in legalActions', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    for (let seed = 1; seed <= 12; seed++) {
      // Drive manually via Table.step to inspect every decision's legality.
      const table = new Table(g.table, g.hand, seed);
      const bot = createSearchAgent({ seed, equitySamples: 200 });
      let guard = 0;
      while (!table.done && guard++ < 1000) {
        const seat = table.currentSeat;
        const obs = table.observe(seat);
        if (obs.isTerminal) break;
        const a = bot.decide(obs);
        expect(obs.legalActions.some((x) => x.type === a.type)).toBe(true);
        table.step(a);
      }
    }
  });
});

describe('createSearchAgent — difficulty dial', () => {
  const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });

  function avgStack(bot: PlayerAgent, opp: PlayerAgent, hands: number, baseSeed: number): number {
    let sum = 0;
    for (let s = 0; s < hands; s++) {
      const res = playHand(g.table, g.hand, [bot, opp], baseSeed + s);
      sum += res.finalStacks[0]!;
    }
    return sum / hands;
  }

  it('a greedy bot beats the random and calling-station baselines', () => {
    const greedy = createSearchAgent({ seed: 1, temperature: 0, equitySamples: 300 });
    expect(avgStack(greedy, createRandomAgent(5), 120, 100)).toBeGreaterThan(200 * 1.08);
    expect(avgStack(greedy, alwaysCallAgent, 120, 300)).toBeGreaterThan(200 * 1.03);
  });

  it('is stronger when greedy (low temperature) than when noisy (high temperature)', () => {
    const greedy = createSearchAgent({ seed: 2, temperature: 0, equitySamples: 300 });
    const noisy = createSearchAgent({ seed: 2, temperature: 3, equitySamples: 300 });
    const opp = createRandomAgent(9);
    expect(avgStack(greedy, opp, 120, 500)).toBeGreaterThan(avgStack(noisy, opp, 120, 500));
  });
});

describe('createSearchAgent — determinism', () => {
  it('reproduces the exact action log for the same seed and config', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const run = (): ReturnType<typeof playHand> =>
      playHand(
        g.table,
        g.hand,
        [createSearchAgent({ seed: 13, equitySamples: 200 }), alwaysCallAgent],
        21,
      );
    expect(run().actions).toEqual(run().actions);
  });

  it('diverges when the seed changes', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const a = playHand(
      g.table,
      g.hand,
      [createSearchAgent({ seed: 13, equitySamples: 200 }), alwaysCallAgent],
      21,
    );
    const b = playHand(
      g.table,
      g.hand,
      [createSearchAgent({ seed: 99, equitySamples: 200 }), alwaysCallAgent],
      21,
    );
    expect(a.actions).not.toEqual(b.actions);
  });
});

// --- coverage: hi-lo equity branch, config validation, policy branches ---

const HOLDEM_HAND: HandConfig = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }).hand;

interface ObsOpts {
  seat?: number;
  hole?: number[];
  community?: number[];
  ups?: PublicUpCards[];
  streetIndex?: number;
  toCall?: number;
  pot?: number;
  stack?: number;
  legal?: Action[];
  handCfg?: HandConfig;
}

function buildObs(o: ObsOpts = {}): Observation {
  const seat = o.seat ?? 0;
  const streetIndex = o.streetIndex ?? 0;
  return {
    seat,
    actingSeat: seat,
    buttonSeat: 0,
    streetIndex,
    streetName: streetIndex === 0 ? 'preflop' : 'river',
    evaluator: 'high',
    community: o.community ?? [],
    up: o.ups ?? [],
    players: [
      { seat: 0, stack: o.stack ?? 200, bet: 0, wagered: 0, status: 'active' },
      { seat: 1, stack: 200, bet: 0, wagered: 0, status: 'active' },
    ],
    actionLog: [],
    pot: o.pot ?? 30,
    myHole: o.hole ?? [],
    toCall: o.toCall ?? 0,
    legalActions: o.legal ?? [
      { type: 'check', seat, streetIndex },
      { type: 'bet', seat, streetIndex, min: 10, max: 200, amount: 10 },
    ],
    isTerminal: false,
    handCfg: 'handCfg' in o ? o.handCfg : HOLDEM_HAND,
  };
}

describe('monteCarloEquity — hi-lo branch', () => {
  it('returns an equity and a low-half fraction in range for a split game', () => {
    const args: EquityArgs = {
      myPrivate: [12, 0, 1, 2, 3, 24, 23], // A-2-3-4-5 wheel + KQ, stud-style 7 cards
      community: [],
      opponentUp: [[]],
      selector: { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] },
      kind: 'hi-lo',
      lowQualify: 8,
      privateTotal: 7,
      communityTotal: 0,
      nSamples: 1500,
      rng: createRng(3),
    };
    const r = monteCarloEquity(args);
    expect(r.equity).toBeGreaterThanOrEqual(0);
    expect(r.equity).toBeLessThanOrEqual(1);
    expect(r.low!).toBeGreaterThanOrEqual(0);
    expect(r.low!).toBeLessThanOrEqual(1);
  });
});

describe('resolveSearchBotConfig — validation', () => {
  it('applies defaults', () => {
    const p = resolveSearchBotConfig({ seed: 5 });
    expect(p.temperature).toBeCloseTo(0.25);
    expect(p.aggression).toBeCloseTo(0.5);
    expect(p.tightness).toBeCloseTo(0.4);
    expect(p.bluffFrequency).toBeCloseTo(0.05);
    expect(p.opponentModel).toBe('uniform');
    expect(p.equitySamples).toBe(600);
  });

  it('rejects unimplemented opponent models', () => {
    expect(() => resolveSearchBotConfig({ seed: 1, opponentModel: 'bayesian' })).not.toThrow();
    expect(() =>
      resolveSearchBotConfig({ seed: 1, opponentModel: 'telepathy' as never }),
    ).toThrow();
  });

  it('rejects out-of-range knobs', () => {
    expect(() => resolveSearchBotConfig({ seed: 1, bluffFrequency: 1.5 })).toThrow();
    expect(() => resolveSearchBotConfig({ seed: 1, equitySamples: -1 })).toThrow();
  });
});

describe('createSearchAgent — policy branches', () => {
  it('bluffs a weak hand when bluffFrequency is 1 and the action is free', () => {
    const bot = createSearchAgent({
      seed: 4,
      temperature: 0,
      bluffFrequency: 1,
      equitySamples: 400,
    });
    const obs = buildObs({
      streetIndex: 3,
      hole: [0, 1], // 2-3 suited, very weak on a high board
      community: [51, 50, 49, 48, 47], // A K Q J T — we have nothing
      legal: [
        { type: 'check', seat: 0, streetIndex: 3 },
        { type: 'bet', seat: 0, streetIndex: 3, min: 10, max: 100, amount: 10 },
      ],
    });
    const a = bot.decide(obs);
    expect(a.type).toBe('bet');
    expect(a.amount!).toBeGreaterThanOrEqual(10);
    expect(a.amount!).toBeLessThanOrEqual(100);
  });

  it('shoves the nuts when an all-in is legal', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 300 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 25], // AA
      community: [38, 51, 0, 1, 2], // quad aces
      pot: 200,
      legal: [
        { type: 'allin', seat: 0, streetIndex: 3, amount: 200 },
        { type: 'call', seat: 0, streetIndex: 3, amount: 50 },
      ],
      toCall: 50,
    });
    expect(bot.decide(obs).type).toBe('allin');
  });

  it('falls back to the only legal action when every option is an all-in', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 200 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [0, 18], // weak
      community: [51, 50, 49, 48, 47],
      pot: 30,
      legal: [{ type: 'allin', seat: 0, streetIndex: 3, amount: 200 }],
    });
    expect(bot.decide(obs).type).toBe('allin');
  });

  it('clamps a raise into the legal [min, max] range', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, aggression: 1, equitySamples: 300 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 25],
      community: [38, 51, 0, 1, 2], // quad aces → strong, will raise
      pot: 100,
      toCall: 20,
      legal: [
        { type: 'fold', seat: 0, streetIndex: 3 },
        { type: 'call', seat: 0, streetIndex: 3, amount: 20 },
        { type: 'raise', seat: 0, streetIndex: 3, to: 40, min: 40, max: 300 },
      ],
    });
    const a = bot.decide(obs);
    expect(a.type).toBe('raise');
    expect(a.to!).toBeGreaterThanOrEqual(40);
    expect(a.to!).toBeLessThanOrEqual(300);
  });

  it('shoves when short-stacked and desperate (stack <= 25% of pot)', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 300 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 25],
      community: [0, 1, 2, 3, 4],
      stack: 20,
      pot: 200,
      legal: [
        { type: 'allin', seat: 0, streetIndex: 3, amount: 20 },
        { type: 'fold', seat: 0, streetIndex: 3 },
        { type: 'call', seat: 0, streetIndex: 3, amount: 20 },
      ],
      toCall: 20,
    });
    expect(bot.decide(obs).type).toBe('allin');
  });

  it('shoves when pot-committed facing a near-stack-sized bet', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 300 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 25],
      community: [38, 51, 0, 1, 2],
      stack: 100,
      pot: 50,
      toCall: 70,
      legal: [
        { type: 'fold', seat: 0, streetIndex: 3 },
        { type: 'call', seat: 0, streetIndex: 3, amount: 70 },
        { type: 'allin', seat: 0, streetIndex: 3, amount: 100 },
      ],
    });
    expect(bot.decide(obs).type).toBe('allin');
  });

  it('bluff-raises a weak hand facing a bet when bluffFrequency is 1', () => {
    const bot = createSearchAgent({
      seed: 4,
      temperature: 0,
      bluffFrequency: 1,
      equitySamples: 300,
    });
    const obs = buildObs({
      streetIndex: 3,
      hole: [0, 1],
      community: [51, 50, 49, 48, 47],
      pot: 100,
      toCall: 20,
      legal: [
        { type: 'fold', seat: 0, streetIndex: 3 },
        { type: 'call', seat: 0, streetIndex: 3, amount: 20 },
        { type: 'raise', seat: 0, streetIndex: 3, to: 60, min: 60, max: 300 },
      ],
    });
    expect(bot.decide(obs).type).toBe('raise');
  });

  it('decides from a synthetic observation with no hand config (fallback path)', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 300 });
    const obs = buildObs({
      streetIndex: 3,
      hole: [12, 25],
      community: [0, 1, 2],
      handCfg: undefined,
    });
    const a = bot.decide(obs);
    expect(['check', 'bet']).toContain(a.type);
  });

  it('folds on an empty legal-action list', () => {
    const bot = createSearchAgent({ seed: 4, temperature: 0, equitySamples: 100 });
    expect(bot.decide(buildObs({ legal: [] })).type).toBe('fold');
  });
});
