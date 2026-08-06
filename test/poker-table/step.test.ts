import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  Table,
  playHand,
  standardHoldem,
  alwaysCallAgent,
  alwaysFoldAgent,
} from '../../src/poker-table';
import type { Observation } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const hu = standardHoldem({ sb: 1, bb: 2, stack: 200 });

function driveWith(
  table: Table,
  agent: (obs: Observation) => Observation['legalActions'][number],
): void {
  while (!table.done) {
    const seat = table.currentSeat;
    const obs = table.observe(seat);
    table.step(agent(obs));
  }
}

describe('observe() field correctness (preflop, after blinds)', () => {
  it('exposes the expected public + private state for the acting seat', () => {
    const t = new Table(hu.table, hu.hand, 1);
    const obs = t.observe(0);
    expect(obs.streetIndex).toBe(0);
    expect(obs.streetName).toBe('preflop');
    expect(obs.buttonSeat).toBe(0);
    expect(obs.actingSeat).toBe(0);
    expect(obs.isTerminal).toBe(false);
    expect(obs.revealedHole).toBeUndefined();
    expect(obs.myHole.length).toBe(2);
    expect(obs.pot).toBe(3);
    expect(obs.toCall).toBe(1);
    expect(obs.players.length).toBe(2);
    expect(obs.players[0]!.bet).toBe(1);
    expect(obs.players[0]!.wagered).toBe(1);
    expect(obs.players[1]!.bet).toBe(2);
    expect(obs.legalActions.length).toBeGreaterThan(0);
  });

  it('returns empty legalActions for a non-acting seat', () => {
    const t = new Table(hu.table, hu.hand, 1);
    expect(t.observe(1).legalActions).toEqual([]);
  });
});

describe('hidden-information barrier', () => {
  it('never leaks an opponent hole card in a non-terminal observation', () => {
    for (let seed = 0; seed < 300; seed++) {
      const full = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], seed);
      const t = new Table(hu.table, hu.hand, seed);
      while (!t.done) {
        const seat = t.currentSeat;
        const obs = t.observe(seat);
        expect(obs.isTerminal).toBe(false);
        expect(obs.revealedHole).toBeUndefined();
        expect(obs.myHole).toEqual(full.dealt.hole[seat]);
        const other = 1 - seat;
        const otherHole = full.dealt.hole[other]!;
        const leaked = otherHole.some(
          (c) =>
            obs.myHole.includes(c) ||
            obs.community.includes(c) ||
            obs.up.some((u) => u.cards.includes(c)),
        );
        expect(leaked).toBe(false);
        t.step(alwaysCallAgent.decide(obs));
      }
      expect(t.stacks()).toEqual(full.finalStacks);
    }
  });
});

describe('step parity with playHand', () => {
  it('reaches identical stacks when driven by the same actions', () => {
    const full = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 4242);
    const t = new Table(hu.table, hu.hand, 4242);
    for (const a of full.actions) {
      expect(t.currentSeat).toBe(a.seat);
      t.step(a);
    }
    expect(t.done).toBe(true);
    expect(t.stacks()).toEqual(full.finalStacks);
  });
});

describe('terminal reveal (contested hands)', () => {
  it('reveals only the non-folded hand on a fold-out', () => {
    const t = new Table(hu.table, hu.hand, 5);
    const obs0 = t.observe(0);
    t.step(alwaysFoldAgent.decide(obs0));
    expect(t.done).toBe(true);
    const terminal = t.observe(1);
    expect(terminal.isTerminal).toBe(true);
    expect(terminal.revealedHole?.map((r) => r.seat)).toEqual([1]);
  });

  it('reveals both hands on a showdown', () => {
    const t = new Table(hu.table, hu.hand, 9);
    driveWith(t, (obs) => alwaysCallAgent.decide(obs));
    expect(t.done).toBe(true);
    const terminal = t.observe(0);
    expect(terminal.revealedHole?.map((r) => r.seat).sort((a, b) => a - b)).toEqual([0, 1]);
  });
});

describe('Table.step guards', () => {
  it('rejects an action for the wrong seat', () => {
    const t = new Table(hu.table, hu.hand, 1);
    expect(() => t.step({ type: 'call', seat: 1, streetIndex: 0, amount: 1 })).toThrow();
  });

  it('rejects actions after the hand is terminal', () => {
    const t = new Table(hu.table, hu.hand, 5);
    t.step(alwaysFoldAgent.decide(t.observe(0)));
    expect(() => t.step({ type: 'check', seat: 1, streetIndex: 0 })).toThrow();
  });
});
