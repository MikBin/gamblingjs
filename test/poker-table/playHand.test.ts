import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import {
  playHand,
  standardHoldem,
  alwaysCallAgent,
  alwaysFoldAgent,
  createRng,
  computeLegalActions,
  toCallFor,
  initHand,
  dealStreet,
  firstToAct,
  settle,
  resolveHand,
  applyAction,
} from '../../src/poker-table';
import type { PlayerAgent, GameState, Action } from '../../src/poker-table';

const high = new HighEvaluator();

beforeAll(() => {
  fastHashesCreators.high();
});

const hu = standardHoldem({ sb: 1, bb: 2, stack: 200 });

describe('createRng', () => {
  it('is deterministic for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seq = (r: ReturnType<typeof createRng>) =>
      Array.from({ length: 5 }, () => r.nextInt(100));
    expect(seq(a)).toEqual(seq(b));
  });

  it('shuffleInPlace preserves the multiset', () => {
    const r = createRng(7);
    const out = r.shuffleInPlace([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect([...out].sort((x, y) => x - y)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe('resolveHand', () => {
  const sel = {
    total: 5,
    pools: [
      { pool: 'hole' as const, min: 0, max: 5 },
      { pool: 'community' as const, min: 0, max: 5 },
    ],
  };

  it('returns a numeric rank for high', () => {
    const r = resolveHand(
      { hole: [0, 13], door: [], community: [1, 2, 3, 4, 5] },
      sel,
      'high',
      'high-wins',
    );
    expect(typeof r.rank).toBe('number');
  });

  it('throws for hi-lo from resolveHand (use resolveHiLo instead)', () => {
    expect(() =>
      resolveHand(
        { hole: [0, 13], door: [], community: [1, 2, 3, 4, 5] },
        sel,
        'hi-lo',
        'high-wins',
      ),
    ).toThrow();
  });
});

describe('firstToAct / dealStreet ordering', () => {
  it('heads-up: button (SB) acts first preflop, non-button first postflop', () => {
    const rng = createRng(123);
    const state = initHand(hu.table, hu.hand, rng);
    expect(firstToAct(state, 0)).toBe(0);
    expect(state.actingSeat).toBe(0);
    const flop = dealStreet(state, 1);
    expect(firstToAct(flop, 1)).toBe(1);
    expect(flop.actingSeat).toBe(1);
  });

  it('3-handed: left of BB (button) acts first preflop', () => {
    const three = standardHoldem({ seats: 3, sb: 1, bb: 2, stack: 200 });
    const state = initHand(three.table, three.hand, createRng(5));
    expect(firstToAct(state, 0)).toBe(0);
  });
});

describe('computeLegalActions (heads-up NL after blinds)', () => {
  it('SB faces a call of bb-sb with fold/call/raise available', () => {
    const state = initHand(hu.table, hu.hand, createRng(99));
    state.actingSeat = 0;
    expect(toCallFor(state, 0)).toBe(1);
    const legal = computeLegalActions(state, hu.hand);
    expect(legal.map((a) => a.type).sort()).toEqual(['allin', 'call', 'fold', 'raise']);
  });

  it('BB can check once bets are equalized', () => {
    const state = initHand(hu.table, hu.hand, createRng(99));
    state.actingSeat = 0;
    const called = applyAction(state, { type: 'call', seat: 0, streetIndex: 0 }, hu.hand);
    called.actingSeat = 1;
    expect(toCallFor(called, 1)).toBe(0);
    const legal = computeLegalActions(called, hu.hand);
    expect(legal.map((a) => a.type).sort()).toEqual(['allin', 'bet', 'check']);
  });

  it('check is illegal when facing a bet', () => {
    const state = initHand(hu.table, hu.hand, createRng(99));
    state.actingSeat = 0;
    expect(() => applyAction(state, { type: 'check', seat: 0, streetIndex: 0 }, hu.hand)).toThrow();
  });
});

const raiseToAgent = (to: number): PlayerAgent => ({
  decide: (obs) => {
    const raise = obs.legalActions.find((a) => a.type === 'raise');
    if (raise) return { type: 'raise', seat: obs.seat, streetIndex: obs.streetIndex, to };
    const call = obs.legalActions.find((a) => a.type === 'call');
    if (call) return call;
    const check = obs.legalActions.find((a) => a.type === 'check');
    if (check) return check;
    return { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  },
});

describe('playHand — heads-up NL skeleton', () => {
  it('is zero-sum across many random hands and fully distributes the pot', () => {
    for (let i = 0; i < 2000; i++) {
      const stacks = [50 + ((i * 37) % 450), 50 + ((i * 53) % 450)];
      const res = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 1000 + i, stacks);
      const initial = stacks[0] + stacks[1];
      const final = res.finalStacks.reduce((s, x) => s + x, 0);
      expect(final).toBe(initial);
      expect(res.winners.length).toBeGreaterThanOrEqual(1);
      expect(res.isTerminal).toBe(true);
    }
  });

  it('showdown winner matches HighEvaluator on the dealt cards', () => {
    const res = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 4242);
    expect(res.dealt.community.length).toBe(5);
    const ranks = res.dealt.hole.map((h) => high.evaluate([...h, ...res.dealt.community]));
    const best = Math.max(...ranks);
    const expected = ranks
      .map((r, seat) => (r === best ? seat : -1))
      .filter((s) => s >= 0)
      .sort((a, b) => a - b);
    expect(res.winners.map((w) => w.seat).sort((a, b) => a - b)).toEqual(expected);
  });

  it('is deterministic: same seed reproduces the transcript', () => {
    const a = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 777);
    const b = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 777);
    expect(JSON.stringify(a.actions)).toEqual(JSON.stringify(b.actions));
    expect(a.finalStacks).toEqual(b.finalStacks);
  });

  it('fold-to-win: SB folds, BB wins the blinds (uncalled bet returned, zero-sum)', () => {
    const res = playHand(hu.table, hu.hand, [alwaysFoldAgent, alwaysCallAgent], 3);
    expect(res.winners.map((w) => w.seat)).toEqual([1]);
    expect(res.finalStacks).toEqual([199, 201]);
  });

  it('enforces the minimum raise (1bb increment)', () => {
    expect(() => playHand(hu.table, hu.hand, [raiseToAgent(3), alwaysCallAgent], 10)).toThrow();
  });

  it('accepts a legal raise and stays zero-sum', () => {
    const res = playHand(hu.table, hu.hand, [raiseToAgent(4), alwaysCallAgent], 11);
    const final = res.finalStacks.reduce((s, x) => s + x, 0);
    expect(final).toBe(400);
    expect(res.isTerminal).toBe(true);
  });

  it('handles a preflop all-in that is called (runs it out, zero-sum)', () => {
    const allInAgent: PlayerAgent = {
      decide: (obs) => {
        const allin = obs.legalActions.find((a) => a.type === 'allin');
        if (allin) return allin;
        const call = obs.legalActions.find((a) => a.type === 'call');
        if (call) return call;
        const check = obs.legalActions.find((a) => a.type === 'check');
        if (check) return check;
        return { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
      },
    };
    const res = playHand(hu.table, hu.hand, [allInAgent, alwaysCallAgent], 88);
    const final = res.finalStacks.reduce((s, x) => s + x, 0);
    expect(final).toBe(400);
    expect(res.dealt.community.length).toBe(5);
    expect(res.isTerminal).toBe(true);
  });
});

describe('settle — split pot on a tie', () => {
  it('splits the pot evenly when both best hands tie (board straight flush)', () => {
    const base = initHand(hu.table, hu.hand, createRng(1));
    const state: GameState = {
      ...base,
      community: [0, 1, 2, 3, 4],
      seats: [
        { ...base.seats[0]!, hole: [12, 13], stack: 100, wageredTotal: 100, status: 'active' },
        { ...base.seats[1]!, hole: [25, 38], stack: 100, wageredTotal: 100, status: 'active' },
      ],
    };
    const out = settle(state);
    expect(out.winners.length).toBe(2);
    expect(out.winners[0]!.amount).toBe(100);
    expect(out.winners[1]!.amount).toBe(100);
    expect(out.seats[0]!.stack + out.seats[1]!.stack).toBe(400);
  });
});
