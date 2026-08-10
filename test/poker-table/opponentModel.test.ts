import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  createRng,
  inferProfile,
  makeOpponentModel,
  monteCarloEquity,
  omahaHi,
  playHand,
  razz,
  rangeWeight,
  createSearchAgent,
  standardHoldem,
  uniformModel,
} from '../../src/poker-table';
import type { ActionRecord, EquityArgs, Observation } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
});

const HOLDEM_HAND = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }).hand;
const HOLDEM_SELECTOR = {
  total: 5,
  pools: [
    { pool: 'hole' as const, min: 0, max: 5 },
    { pool: 'community' as const, min: 0, max: 5 },
  ],
};

function obsWith(actionLog: ActionRecord[]): Observation {
  return {
    seat: 0,
    actingSeat: 0,
    buttonSeat: 0,
    streetIndex: 0,
    streetName: 'preflop',
    evaluator: 'high',
    community: [],
    up: [],
    players: [
      { seat: 0, stack: 200, bet: 0, wagered: 0, status: 'active' },
      { seat: 1, stack: 200, bet: 0, wagered: 0, status: 'active' },
    ],
    actionLog,
    pot: 3,
    myHole: [12, 11],
    toCall: 0,
    legalActions: [],
    isTerminal: false,
    handCfg: HOLDEM_HAND,
  };
}

const RAISE_LOG: ActionRecord[] = [{ seat: 1, streetIndex: 0, type: 'raise' }];
const LIMP_LOG: ActionRecord[] = [{ seat: 1, streetIndex: 0, type: 'call' }];

function equity(
  myPrivate: number[],
  modelKind: 'raised' | 'limped' | 'uniform',
  seed: number,
): number {
  const obs = obsWith(modelKind === 'raised' ? RAISE_LOG : modelKind === 'limped' ? LIMP_LOG : []);
  const model = modelKind === 'uniform' ? uniformModel : makeOpponentModel(obs, 1, 'high');
  const args: EquityArgs = {
    myPrivate,
    community: [],
    opponentUp: [[]],
    opponentModels: [model],
    selector: HOLDEM_SELECTOR,
    kind: 'high',
    lowQualify: undefined,
    privateTotal: 2,
    communityTotal: 5,
    nSamples: 4000,
    rng: createRng(seed),
  };
  return monteCarloEquity(args).equity;
}

describe('inferProfile — action-log parsing', () => {
  it('flags a preflop raise', () => {
    expect(inferProfile(obsWith(RAISE_LOG), 1).preflopRaise).toBe(true);
    expect(inferProfile(obsWith(RAISE_LOG), 1).preflopVpip).toBe(false);
  });
  it('flags a preflop limp (call) without a raise', () => {
    expect(inferProfile(obsWith(LIMP_LOG), 1).preflopVpip).toBe(true);
    expect(inferProfile(obsWith(LIMP_LOG), 1).preflopRaise).toBe(false);
  });
  it('records postflop aggression', () => {
    const log: ActionRecord[] = [
      { seat: 1, streetIndex: 0, type: 'call' },
      { seat: 1, streetIndex: 1, type: 'bet' },
      { seat: 1, streetIndex: 1, type: 'check' },
    ];
    const p = inferProfile(obsWith(log), 1);
    expect(p.aggression).toBeCloseTo(0.5);
    expect(p.samples).toBe(2);
  });
});

describe('rangeWeight — directional', () => {
  const raised = { preflopRaise: true, preflopVpip: false, aggression: 0.5, samples: 0 };
  const limped = { preflopRaise: false, preflopVpip: true, aggression: 0.5, samples: 0 };
  const unknown = { preflopRaise: false, preflopVpip: false, aggression: 0.5, samples: 0 };

  it('rates a premium as a strong "raised" range but not a "limped" one', () => {
    const aa = rangeWeight([12, 25], raised); // AA
    const aaLimp = rangeWeight([12, 25], limped);
    expect(aa).toBeGreaterThan(0.8);
    expect(aaLimp).toBeLessThan(0.4); // AA would have raised, not limped
  });
  it('rates trash as a weak "limped" range but not a "raised" one', () => {
    const trash72 = rangeWeight([0, 18], raised); // 72o
    expect(trash72).toBeLessThan(0.3);
    expect(rangeWeight([0, 18], limped)).toBeGreaterThan(rangeWeight([0, 18], raised));
  });
  it('is uniform (1) when there is no preflop read', () => {
    expect(rangeWeight([12, 25], unknown)).toBe(1);
    expect(rangeWeight([0, 18], unknown)).toBe(1);
  });
});

describe('monteCarloEquity — Bayesian range moves equity in the correct direction', () => {
  it('a mediocre hand has LOWER equity vs a raised (strong) range than vs uniform', () => {
    const kq = [11, 10]; // K♠ Q♠ — dominated by a premium-heavy range
    expect(equity(kq, 'raised', 1)).toBeLessThan(equity(kq, 'uniform', 1));
  });
  it('a premium has HIGHER equity vs a limped (weak) range than vs uniform', () => {
    const ak = [12, 11]; // A♠ K♠ — crushes a weak/limped range
    expect(equity(ak, 'limped', 2)).toBeGreaterThan(equity(ak, 'uniform', 2));
  });
});

describe('createSearchAgent(opponentModel: bayesian) — integration', () => {
  const BOT = (seed: number) =>
    createSearchAgent({ seed, opponentModel: 'bayesian', equitySamples: 200, temperature: 0 });

  const variants = [
    { name: 'holdem', preset: standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }) },
    { name: 'omaha', preset: omahaHi() },
    { name: 'razz', preset: razz() },
  ];

  it('plays every variant zero-sum with no illegal action', () => {
    for (const v of variants) {
      for (let seed = 1; seed <= 4; seed++) {
        const res = playHand(v.preset.table, v.preset.hand, [BOT(seed), BOT(seed + 50)], seed);
        const buyIn = v.preset.hand.stacks.buyIn;
        expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(buyIn * v.preset.table.seats.min);
      }
    }
  });

  it('is deterministic per seed', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const r1 = playHand(g.table, g.hand, [BOT(7), BOT(8)], 21);
    const r2 = playHand(g.table, g.hand, [BOT(7), BOT(8)], 21);
    expect(r1.actions).toEqual(r2.actions);
  });

  it('rejects an invalid opponentModel value', () => {
    expect(() => createSearchAgent({ seed: 1, opponentModel: 'telepathy' as never })).toThrow();
  });
});
