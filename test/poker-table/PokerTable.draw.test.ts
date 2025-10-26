import { describe, it, expect, beforeEach } from 'vitest';
import { PokerTable } from '../../src/poker-table/PokerTable';
import { GameId, LimitType, type TableConfig } from '../../src/poker-table/types';
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

function makeDrawCashConfig(): TableConfig {
  return {
    maxSeats: 6,
    structure: { kind: 'cash', blinds: { smallBlind: 1, bigBlind: 2 } },
    rotation: {
      sequence: [{ game: GameId.FIVE_CARD_DRAW, limit: LimitType.FIXED_LIMIT, hands: 999 }],
      loop: true,
    },
    dealerButtonSeat: 0,
  };
}

describe('PokerTable - 5-Card Draw flow', () => {
  let dealer: TestDealer;
  let table: PokerTable;

  beforeEach(() => {
    dealer = new TestDealer();
    table = new PokerTable(makeDrawCashConfig(), dealer, { passiveDealing: true });
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });
    table.addPlayer({ id: 'p2', chips: 100, seat: 2 });
  });

  it('deals 5 cards to each player and advances through draw and showdown', () => {
    // 15 cards for players
    dealer.setDeck([0,1,2,3,4, 5,6,7,8,9, 10,11,12,13,14]);
    table.startHand();

    const snap = table.getSnapshot();
    const p0 = snap.players.find(p=>p.seat===0)!;
    const p1 = snap.players.find(p=>p.seat===1)!;
    const p2 = snap.players.find(p=>p.seat===2)!;

    expect(p1.holeCards.length).toBe(5);
    expect(p2.holeCards.length).toBe(5);
    expect(p0.holeCards.length).toBe(5);
    expect(snap.street).toBe('deal');

    table.nextStreet();
    expect(table.getSnapshot().street).toBe('draw-1');

    table.nextStreet();
    expect(table.getSnapshot().street).toBe('showdown');
  });
});