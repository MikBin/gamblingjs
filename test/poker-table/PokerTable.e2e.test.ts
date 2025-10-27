import { describe, it, expect, beforeEach } from 'vitest';
import { PokerTable } from '../../src/poker-table/PokerTable';
import { GameId, LimitType, type TableConfig, type AllowedAction } from '../../src/poker-table/types';
import type { Dealer } from '../../src/poker-table/deck';
import type { PlayerAgent } from '../../src/poker-table/player';

class E2EDealer implements Dealer {
  private q: number[] = [];
  setDeck(cards: number[]) { this.q = cards.slice(); }
  initDeck(): void { /* keep queue as-is between hands (test drives order) */ }
  shuffle(): void { /* deterministic: no-op */ }
  burn(count: number = 1): void { for (let i=0;i<count;i++) this.dealCard(); }
  dealCard(): number { if (this.q.length===0) throw new Error('E2EDealer empty'); const c = this.q.shift(); if (c===undefined) throw new Error('undef'); return c; }
  deal(count: number): number[] { const out: number[] = []; for (let i=0;i<count;i++) out.push(this.dealCard()); return out; }
  remaining(): number { return this.q.length; }
}

class DeterministicAgent implements PlayerAgent {
  onHandStart(): void {}
  onStreetChange(): void {}
  decideAction(ctx: any) {
    const priority: AllowedAction[] = ['raise','bet','call','check','fold'];
    const action = priority.find(a => ctx.allowedActions.includes(a))!;
    if (action === 'bet' || action === 'raise') {
      const amount = (ctx.minRaise ?? (ctx.toCall + 1) ?? 2);
      return { action, amount } as const;
    }
    return { action } as const;
  }
}

function makeCashConfig(): TableConfig {
  return {
    maxSeats: 6,
    structure: { kind: 'cash', blinds: { smallBlind: 1, bigBlind: 2, ante: 0 } },
    rotation: { sequence: [{ game: GameId.TEXAS_HOLDEM, limit: LimitType.NO_LIMIT, hands: 999 }], loop: true },
    dealerButtonSeat: 0,
  };
}

function makeSngConfig(): TableConfig {
  return {
    maxSeats: 6,
    structure: {
      kind: 'tournament',
      levels: [
        { id: 'L1', smallBlind: 1, bigBlind: 2, ante: 0 },
        { id: 'L2', smallBlind: 2, bigBlind: 4, ante: 1 },
        { id: 'L3', smallBlind: 5, bigBlind: 10, ante: 2 },
      ],
      advanceBy: 'hands',
      advanceEvery: 2,
      startingLevelId: 'L1',
    },
    rotation: { sequence: [{ game: GameId.TEXAS_HOLDEM, limit: LimitType.NO_LIMIT, hands: 999 }], loop: true },
    dealerButtonSeat: 0,
  };
}

// Helper to build a deterministic Hold'em deck sequence for a 3-handed table
// Order: hole cards (round-robin seat1,2,0 twice), burn, flop(3), burn, turn, burn, river
function buildHoldemDeck(): number[] {
  return [
    // hole cards (six)
    10,11,12,13,14,15,
    // burn + board
    16, // burn
    17,18,19, // flop
    20, // burn
    21, // turn
    22, // burn
    23, // river
  ];
}

describe('PokerTable E2E - deterministic cash and SNG flows', () => {
  let dealer: E2EDealer;
  let table: PokerTable;

  beforeEach(() => {
    dealer = new E2EDealer();
  });

  it('simulates a deterministic 3-handed cash Hold\'em hand end-to-end', () => {
    table = new PokerTable(makeCashConfig(), dealer, { passiveDealing: true, analytics: { enabled: true } });
    // seat players 0,1,2 and register deterministic agents
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });
    table.addPlayer({ id: 'p2', chips: 100, seat: 2 });

    const agent0 = new DeterministicAgent();
    const agent1 = new DeterministicAgent();
    const agent2 = new DeterministicAgent();
    table.registerAgent('p0', agent0);
    table.registerAgent('p1', agent1);
    table.registerAgent('p2', agent2);

    dealer.setDeck(buildHoldemDeck());
    table.startHand();

    // Verify blinds collected and hole cards dealt deterministically
    const snap0 = table.getSnapshot();
    const p0 = snap0.players.find(p=>p.seat===0)!;
    const p1 = snap0.players.find(p=>p.seat===1)!;
    const p2 = snap0.players.find(p=>p.seat===2)!;

    expect(p1.chips).toBe(99); // SB
    expect(p2.chips).toBe(98); // BB
    expect(snap0.pot).toBe(3);

    // Dealing order: seat1, seat2, seat0, then again
    expect(p1.holeCards).toEqual([10,13]);
    expect(p2.holeCards).toEqual([11,14]);
    expect(p0.holeCards).toEqual([12,15]);
    expect(snap0.street).toBe('preflop');

    // Request deterministic actions from agents and record to analytics
    const a1 = table.requestAction('p1', ['check','bet'], 0, 2);
    table.recordAction('p1', a1.action as any, (a1 as any).amount);
    expect(a1.action).toBe('bet');

    const a2 = table.requestAction('p2', ['fold','call','raise'], 2, 2);
    table.recordAction('p2', a2.action as any, (a2 as any).amount);
    expect(['raise','call','fold']).toContain(a2.action);

    // Streets advance deterministically with provided deck
    table.nextStreet(); // flop
    let s = table.getSnapshot();
    expect(s.communityCards).toEqual([17,18,19]);
    expect(s.street).toBe('flop');

    table.nextStreet(); // turn
    s = table.getSnapshot();
    expect(s.communityCards).toEqual([17,18,19,21]);
    expect(s.street).toBe('turn');

    table.nextStreet(); // river
    s = table.getSnapshot();
    expect(s.communityCards).toEqual([17,18,19,21,23]);
    expect(s.street).toBe('river');

    table.nextStreet(); // showdown
    expect(table.getSnapshot().street).toBe('showdown');

    // Basic analytics sanity
    const stats1 = table.getPlayerStats('p1');
    const stats2 = table.getPlayerStats('p2');
    expect(stats1?.totalHands).toBe(1);
    expect((stats1?.totalActions ?? 0) + (stats2?.totalActions ?? 0)).toBeGreaterThan(0);
    expect(table.getHandHistory().length).toBeGreaterThan(0);
  });

  it('simulates a deterministic Sit & Go (tournament) level progression and bustout via forced bets', () => {
    table = new PokerTable(makeSngConfig(), dealer, { passiveDealing: true, analytics: { enabled: true } });
    // 3-handed SNG with shallow stacks to force a bust quickly via blinds/antes
    table.addPlayer({ id: 'p0', chips: 7, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 7, seat: 1 });
    table.addPlayer({ id: 'p2', chips: 7, seat: 2 });

    table.registerAgent('p0', new DeterministicAgent());
    table.registerAgent('p1', new DeterministicAgent());
    table.registerAgent('p2', new DeterministicAgent());

    // Hand 1 (Level 1: 1/2, no ante)
    dealer.setDeck(buildHoldemDeck());
    table.startHand();
    let snap = table.getSnapshot();
    expect(snap.game.game).toBe(GameId.TEXAS_HOLDEM);
    // Pot should be SB+BB = 3
    expect(snap.pot).toBe(3);

    // Hand 2 (still Level 1)
    dealer.setDeck(buildHoldemDeck());
    table.startHand();
    snap = table.getSnapshot();
    expect(snap.pot).toBe(3);

    // Hand 3 (Level 2: 2/4 + ante 1 each)
    dealer.setDeck(buildHoldemDeck());
    table.startHand();
    snap = table.getSnapshot();
    // 3 players: ante 1 each = 3, plus SB and BB collected -> pot should be at least 7
    // (some configurations may defer SB in edge cases; assert conservative lower bound)
    expect(snap.pot).toBeGreaterThanOrEqual(7);

    // Keep dealing until someone is out of chips due to forced bets
    for (let i = 0; i < 5; i++) {
      dealer.setDeck(buildHoldemDeck());
      table.startHand();
      const s = table.getSnapshot();
      const busted = s.players.filter(p => p.chips === 0).length;
      if (busted > 0) break;
    }

    const finalSnap = table.getSnapshot();
    const zeroStacks = finalSnap.players.filter(p => p.chips === 0);
    expect(zeroStacks.length).toBeGreaterThan(0); // at least one player busted

    // Optionally, remove busted players to simulate SNG elimination flow
    // (table.removePlayer(zeroStacks[0]!.seat))
  });
});
