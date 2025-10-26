import { describe, it, expect, beforeEach } from 'vitest';
import { PokerTable } from '../../src/poker-table/PokerTable';
import { GameId, LimitType, type TableConfig, type Player } from '../../src/poker-table/types';
import type { Dealer } from '../../src/poker-table/deck';

class TestDealer implements Dealer {
  private q: number[] = [];
  setDeck(cards: number[]) { this.q = cards.slice(); }
  initDeck(): void { /* keep queue */ }
  shuffle(): void { /* no-op */ }
  burn(count: number = 1): void { for (let i=0;i<count;i++) this.dealCard(); }
  dealCard(): number { if (this.q.length===0) throw new Error('empty'); const c = this.q.shift(); if (c===undefined) throw new Error('undef'); return c; }
  deal(count: number): number[] { const out: number[] = []; for (let i=0;i<count;i++) out.push(this.dealCard()); return out; }
  remaining(): number { return this.q.length; }
}

function makeHoldemCashConfig(): TableConfig {
  return {
    maxSeats: 6,
    structure: { kind: 'cash', blinds: { smallBlind: 1, bigBlind: 2 } },
    rotation: {
      sequence: [{ game: GameId.TEXAS_HOLDEM, limit: LimitType.NO_LIMIT, hands: 999 }],
      loop: true,
    },
    dealerButtonSeat: 0,
  };
}

describe('PokerTable - Texas Hold\'em flow', () => {
  let dealer: TestDealer;
  let table: PokerTable;

  beforeEach(() => {
    dealer = new TestDealer();
    table = new PokerTable(makeHoldemCashConfig(), dealer, { passiveDealing: true });
    // seat 0,1,2
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });
    table.addPlayer({ id: 'p2', chips: 100, seat: 2 });
  });

  it('collects blinds and deals hole cards round-robin from UTG', () => {
    // Deck order: hole cards (six), burn, flop(3), burn, turn, burn, river
    dealer.setDeck([10,11,12,13,14,15, 16, 17,18,19, 20, 21, 22, 23]);
    table.startHand();

    const snap = table.getSnapshot();
    // SB seat 1 pays 1, BB seat 2 pays 2
    const p1 = snap.players.find(p=>p.seat===1)!;
    const p2 = snap.players.find(p=>p.seat===2)!;
    const p0 = snap.players.find(p=>p.seat===0)!;
    expect(p1.chips).toBe(99);
    expect(p2.chips).toBe(98);
    expect(snap.pot).toBe(3);

    // Dealing order: seat1, seat2, seat0, then again
    expect(p1.holeCards).toEqual([10,13]);
    expect(p2.holeCards).toEqual([11,14]);
    expect(p0.holeCards).toEqual([12,15]);
    expect(snap.street).toBe('preflop');

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

    table.nextStreet();
    expect(table.getSnapshot().street).toBe('showdown');
  });

  it('moveButton advances to next occupied seat', () => {
    const s0 = table.getSnapshot();
    expect(s0.buttonSeat).toBe(0);
    table.moveButton();
    expect(table.getSnapshot().buttonSeat).toBe(1);
  });
});
