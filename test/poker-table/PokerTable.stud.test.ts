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

function makeStudConfig(): TableConfig {
  return {
    maxSeats: 8,
    structure: { kind: 'cash', blinds: { smallBlind: 0, bigBlind: 0, bringIn: 1, ante: 0 } },
    rotation: {
      sequence: [{ game: GameId.RAZZ, limit: LimitType.FIXED_LIMIT, hands: 999 }],
      loop: true,
    },
    dealerButtonSeat: 0,
  };
}

describe('PokerTable - Stud/Razz flow', () => {
  let dealer: TestDealer;
  let table: PokerTable;

  beforeEach(() => {
    dealer = new TestDealer();
    table = new PokerTable(makeStudConfig(), dealer, { passiveDealing: true });
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });
    table.addPlayer({ id: 'p2', chips: 100, seat: 2 });
  });

  it('collects bring-in and deals stud streets', () => {
    // initial 3 cards per player (round robin 2 down + 1 up), then one card each per street
    const seq: number[] = [];
    // First pass (down): seats 1,2,0
    seq.push(0,1,2);
    // Second pass (down): seats 1,2,0
    seq.push(3,4,5);
    // Third pass (up): seats 1,2,0
    seq.push(6,7,8);
    // fourth street one up to each active
    seq.push(9,10,11);
    // fifth
    seq.push(12,13,14);
    // sixth
    seq.push(15,16,17);
    // seventh
    seq.push(18,19,20);
    dealer.setDeck(seq);

    table.startHand();
    let snap = table.getSnapshot();
    // bring-in from seat 1 (first to act after button)
    const p1 = snap.players.find(p=>p.seat===1)!;
    expect(p1.chips).toBe(99);
    expect(snap.pot).toBe(1);
    // each has 3 cards
    for (const seat of [0,1,2]) {
      const p = snap.players.find(pp=>pp.seat===seat)!;
      expect(p.holeCards.length).toBe(3);
    }
    expect(snap.street).toBe('third-street');

    table.nextStreet(); // fourth street
    snap = table.getSnapshot();
    for (const seat of [0,1,2]) {
      const p = snap.players.find(pp=>pp.seat===seat)!;
      expect(p.holeCards.length).toBe(4);
    }

    table.nextStreet(); // fifth
    table.nextStreet(); // sixth
    table.nextStreet(); // seventh
    expect(table.getSnapshot().street).toBe('seventh-street');

    table.nextStreet(); // showdown
    expect(table.getSnapshot().street).toBe('showdown');
  });
});