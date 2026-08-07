import { describe, it, expect } from 'vitest';
import {
  alwaysCallAgent,
  playHand,
  replayHandSteps,
  standardHoldem,
  Table,
} from '../../src/poker-table';
import { initHand } from '../../src/poker-table/engine/transitions';
import { createRng } from '../../src/poker-table/engine/rng';
import type { Action, Observation, PlayerAgent } from '../../src/poker-table';
import type { HandConfig, TableConfig } from '../../src/poker-table/config/types';

// A minimal 2-player 5-card draw config built inline to exercise the engine's
// draw mechanics without depending on presets.
function fiveCardDraw(seats = 2): { table: TableConfig; hand: HandConfig } {
  return {
    table: { gameId: '5cd-test', seats: { min: seats, max: seats }, deck: 'standard52' },
    hand: {
      forcedBets: { blinds: { sb: 1, bb: 2 }, postRule: seats === 2 ? 'heads-up' : 'standard' },
      stacks: { min: 1, max: 1_000_000, buyIn: 200 },
      streets: [
        {
          name: 'predraw',
          deal: { holeDown: 5, playerUp: 0, community: 0 },
          betting: { type: 'no-limit' },
          actionOrder: 'left-of-button',
        },
        {
          name: 'draw',
          deal: { holeDown: 0, playerUp: 0, community: 0 },
          draw: { from: 'hole', max: 5 },
          betting: { type: 'no-limit' },
          actionOrder: 'left-of-button',
        },
      ],
      evaluation: {
        evaluator: 'high',
        ranking: 'high-wins',
        composition: { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] },
      },
    },
  };
}

// Discards fixed indices during the draw phase; otherwise calls/checks. Optionally
// records the predraw (initial) hole per seat for later comparison.
function drawCallAgent(indices: number[], log?: Map<string, number[]>): PlayerAgent {
  return {
    decide(obs: Observation): Action {
      if (obs.streetIndex === 0) log?.set(`s${obs.seat}-predraw`, [...obs.myHole]);
      const d = obs.legalActions.find((a) => a.type === 'discard');
      if (d) {
        return {
          type: 'discard',
          seat: obs.seat,
          streetIndex: obs.streetIndex,
          discardIndices: indices,
        };
      }
      const call = obs.legalActions.find((a) => a.type === 'call');
      if (call) return call;
      const check = obs.legalActions.find((a) => a.type === 'check');
      if (check) return check;
      return obs.legalActions[0]!;
    },
  };
}

// Misbehaving draw agent: discards the given indices regardless of the cap.
function badDrawAgent(indices: number[]): PlayerAgent {
  return {
    decide(obs: Observation): Action {
      const d = obs.legalActions.find((a) => a.type === 'discard');
      if (d) {
        return {
          type: 'discard',
          seat: obs.seat,
          streetIndex: obs.streetIndex,
          discardIndices: indices,
        };
      }
      const call = obs.legalActions.find((a) => a.type === 'call');
      if (call) return call;
      const check = obs.legalActions.find((a) => a.type === 'check');
      if (check) return check;
      return obs.legalActions[0]!;
    },
  };
}

describe('draw engine — 5-card draw mechanics', () => {
  it('completes a hand and conserves chips (zero-sum)', () => {
    const g = fiveCardDraw(2);
    // alwaysCallAgent falls through to legalActions[0] in the draw phase, which is
    // a discard with no indices => stand pat. So it plays a valid draw hand.
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 7);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(400);
    expect(res.isTerminal).toBe(true);
  });

  it('is deterministic for a given seed', () => {
    const g = fiveCardDraw(2);
    const run = () => playHand(g.table, g.hand, [drawCallAgent([0]), drawCallAgent([1, 2])], 123);
    const a = run();
    const b = run();
    expect(a.finalStacks).toEqual(b.finalStacks);
    expect(a.winners.map((w) => w.seat)).toEqual(b.winners.map((w) => w.seat));
  });

  it('honors discard indices: kept cards shift, replacement is fresh', () => {
    const g = fiveCardDraw(2);
    const log = new Map<string, number[]>();
    const res = playHand(g.table, g.hand, [drawCallAgent([0], log), drawCallAgent([], log)], 55);
    const initial0 = log.get('s0-predraw')!;
    const final0 = res.dealt.hole[0]!;
    // discarding index 0 removes hole[0]; the four kept cards remain, a fresh
    // replacement (drawn from the deck, never seen before) is appended.
    expect(final0.slice(0, 4)).toEqual(initial0.slice(1, 5));
    expect(initial0).not.toContain(final0[4]);
    expect(final0).toHaveLength(5);
  });

  it('stand pat leaves the hand intact', () => {
    const g = fiveCardDraw(2);
    const log = new Map<string, number[]>();
    const res = playHand(g.table, g.hand, [drawCallAgent([], log), drawCallAgent([], log)], 9);
    expect(res.dealt.hole[0]).toEqual(log.get('s0-predraw'));
  });

  it('draws run in firstToAct (left-of-button) order', () => {
    const g = fiveCardDraw(2);
    const res = playHand(g.table, g.hand, [drawCallAgent([0]), drawCallAgent([0])], 31);
    // Heads-up postflop: seat 1 (BB) acts before seat 0 (button/SB).
    const drawSeats = res.actions.filter((a) => a.type === 'discard').map((a) => a.seat);
    expect(drawSeats).toEqual([1, 0]);
  });

  it('rejects discarding more than max', () => {
    const g = fiveCardDraw(2); // draw.max = 5
    expect(() =>
      playHand(g.table, g.hand, [badDrawAgent([0, 1, 2, 3, 4, 5]), drawCallAgent([])], 3),
    ).toThrow();
  });

  it('rejects an out-of-range discard index', () => {
    const g = fiveCardDraw(2);
    expect(() => playHand(g.table, g.hand, [badDrawAgent([99]), drawCallAgent([])], 3)).toThrow();
  });

  it('rejects duplicate discard indices', () => {
    const g = fiveCardDraw(2);
    expect(() => playHand(g.table, g.hand, [badDrawAgent([0, 0]), drawCallAgent([])], 3)).toThrow();
  });

  it('replayHandSteps reproduces the settled stacks of a draw hand', () => {
    const g = fiveCardDraw(2);
    const res = playHand(g.table, g.hand, [drawCallAgent([0, 2]), drawCallAgent([1])], 77);
    const steps = replayHandSteps(g.table, g.hand, 77, res.actions);
    const lastStacks = steps.at(-1)!.obs.players.map((p) => p.stack);
    expect(lastStacks).toEqual(res.finalStacks);
  });

  it('the imperative Table.step API drives a draw hand to completion', () => {
    const g = fiveCardDraw(2);
    const t = new Table(g.table, g.hand, 11);
    const agent = drawCallAgent([0]);
    let guard = 0;
    while (!t.done) {
      const obs = t.observe(t.currentSeat);
      t.step(agent.decide(obs));
      if (++guard > 2000) throw new Error('step loop did not terminate');
    }
    expect(t.stacks().reduce((a, b) => a + b, 0)).toBe(400);
  });
});

describe('edge: all-in from posting (no empty-action prompt)', () => {
  it('heads-up: an all-in button/SB is skipped, not prompted', () => {
    // Seat 0 (button/SB heads-up) has stack 1, less than the SB (5): it posts
    // all-in. firstToAct must not return the all-in seat (would yield no legal
    // actions and stall the hand).
    const g = standardHoldem({ seats: 2, sb: 5, bb: 10, stack: 1000 });
    const s = initHand(g.table, g.hand, createRng(42), [1, 1000]);
    expect(s.seats[0]!.stack).toBe(0);
    expect(s.seats[0]!.status).toBe('allin');
    expect(s.actingSeat).not.toBe(0);
  });

  it('heads-up all-in-from-blind hand plays to completion (no stall)', () => {
    const g = standardHoldem({ seats: 2, sb: 5, bb: 10, stack: 1000 });
    // seat 0 all-in on the SB; both bots so the engine drives it to showdown.
    const res = playHand(g.table, g.hand, [alwaysCallAgent, alwaysCallAgent], 7, [1, 1000]);
    expect(res.isTerminal).toBe(true);
    expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(1001);
  });
});
