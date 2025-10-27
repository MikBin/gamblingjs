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

function makeRotationConfig(): TableConfig {
  return {
    maxSeats: 6,
    structure: { kind: 'cash', blinds: { smallBlind: 1, bigBlind: 2 } },
    rotation: {
      sequence: [
        { game: GameId.TEXAS_HOLDEM, limit: LimitType.NO_LIMIT, hands: 1 },
        { game: GameId.OMAHA, limit: LimitType.POT_LIMIT, hands: 1 },
      ],
      loop: true,
    },
    dealerButtonSeat: 0,
  };
}

describe('PokerTable - rotation and tournament levels', () => {
  let dealer: TestDealer;
  let table: PokerTable;

  beforeEach(() => {
    dealer = new TestDealer();
    table = new PokerTable(makeRotationConfig(), dealer, { passiveDealing: true });
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });
    dealer.setDeck(Array.from({length: 52}, (_, i) => i));
  });

  it('rotates games per hands configuration', () => {
    table.startHand();
    expect(table.getSnapshot().game.game).toBe(GameId.TEXAS_HOLDEM);
    table.startHand();
    expect(table.getSnapshot().game.game).toBe(GameId.OMAHA);
    table.startHand();
    expect(table.getSnapshot().game.game).toBe(GameId.TEXAS_HOLDEM);
  });

  it('advances tournament blind levels by hands', () => {
    const tourConfig: TableConfig = {
      maxSeats: 6,
      structure: {
        kind: 'tournament',
        levels: [
          { id: 'L1', smallBlind: 1, bigBlind: 2, ante: 0 },
          { id: 'L2', smallBlind: 2, bigBlind: 4, ante: 1 },
        ],
        advanceBy: 'hands',
        advanceEvery: 2,
        startingLevelId: 'L1',
      },
      rotation: { sequence: [{ game: GameId.TEXAS_HOLDEM, limit: LimitType.NO_LIMIT, hands: 999 }], loop: true },
      dealerButtonSeat: 0,
    };

    table = new PokerTable(tourConfig, dealer, { passiveDealing: true });
    table.addPlayer({ id: 'p0', chips: 100, seat: 0 });
    table.addPlayer({ id: 'p1', chips: 100, seat: 1 });

    // Hand 1 -> level 1 blinds collected
    dealer.setDeck(Array.from({length: 52}, (_, i) => i));
    table.startHand();
    let snap = table.getSnapshot();
    const p0h1 = snap.players.find(p=>p.seat===0)!;
    const p1h1 = snap.players.find(p=>p.seat===1)!;
    // SB seat 1 pays 1, BB seat 0 pays 2 (only two players; sb = next after button=0 -> seat1, bb=seat0)
    expect(p1h1.chips).toBe(99);
    expect(p0h1.chips).toBe(98);

    // Hand 2 -> still level 1
    dealer.setDeck(Array.from({length: 52}, (_, i) => i));
    table.startHand();
    snap = table.getSnapshot();
    // Total pot should have increased by 3 again from blinds
    expect(snap.pot).toBeGreaterThanOrEqual(3);

    // Hand 3 -> level 2 (2/4 + ante 1 each)
    dealer.setDeck(Array.from({length: 52}, (_, i) => i));
    table.startHand();
    snap = table.getSnapshot();
    // Two players, ante 1 each -> 2 chips antes plus blinds 2 and 4
    // Since we don't reset chips between hands in this snapshot, just assert pot >= 8 on start
    expect(snap.pot).toBeGreaterThanOrEqual(8);
  });
});
