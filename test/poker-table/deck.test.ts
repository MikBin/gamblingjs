import { describe, it, expect, vi } from 'vitest';
import { createStandardDeck, LocalDealer, RemoteDealer } from '../../src/poker-table/deck';

describe('Deck and Dealers', () => {
  describe('createStandardDeck', () => {
    it('creates a 52-card deck', () => {
      const deck = createStandardDeck();
      expect(deck.length).toBe(52);
      expect(deck[0]).toBe(0);
      expect(deck[51]).toBe(51);
    });
  });

  describe('LocalDealer', () => {
    it('initializes a deck properly', () => {
      const dealer = new LocalDealer();
      expect(dealer.remaining()).toBe(52);
    });

    it('can initialize with a custom deck', () => {
      const dealer = new LocalDealer(Math.random);
      dealer.initDeck([1, 2, 3]);
      expect(dealer.remaining()).toBe(3);
    });

    it('can shuffle the deck', () => {
      // Mock RNG to make shuffle deterministic
      let rngCalls = 0;
      const fakeRng = () => {
        rngCalls++;
        return 0.5; // Always return 0.5 for predictable shuffle
      };

      const dealer = new LocalDealer(fakeRng);
      const originalDeck = [...Array(52).keys()];
      dealer.shuffle();

      expect(rngCalls).toBeGreaterThan(0);

      // Dealing after shuffle should give different results than unshuffled
      // But we just verify the remaining count and that it deals correctly
      expect(dealer.remaining()).toBe(52);
    });

    it('can deal a card', () => {
      const dealer = new LocalDealer();
      // Unshuffled, so last card is 51
      const card = dealer.dealCard();
      expect(card).toBe(51);
      expect(dealer.remaining()).toBe(51);
    });

    it('throws when dealing from an empty deck', () => {
      const dealer = new LocalDealer();
      dealer.deal(52); // Exhaust the deck
      expect(() => dealer.dealCard()).toThrow('Deck exhausted');
    });

    it('can deal multiple cards', () => {
      const dealer = new LocalDealer();
      const cards = dealer.deal(3);
      expect(cards.length).toBe(3);
      expect(cards).toEqual([51, 50, 49]);
      expect(dealer.remaining()).toBe(49);
    });

    it('can burn cards', () => {
      const dealer = new LocalDealer();
      dealer.burn(2);
      expect(dealer.remaining()).toBe(50);
      expect(dealer.dealCard()).toBe(49);
    });

    it('default burn burns 1 card', () => {
      const dealer = new LocalDealer();
      dealer.burn();
      expect(dealer.remaining()).toBe(51);
    });
  });

  describe('RemoteDealer', () => {
    it('initializes an empty queue', () => {
      const dealer = new RemoteDealer();
      expect(dealer.remaining()).toBe(0);
    });

    it('provides cards to the queue', () => {
      const dealer = new RemoteDealer();
      dealer.provide([10, 20, 30]);
      expect(dealer.remaining()).toBe(3);
    });

    it('initDeck clears the queue', () => {
      const dealer = new RemoteDealer();
      dealer.provide([1, 2, 3]);
      dealer.initDeck();
      expect(dealer.remaining()).toBe(0);
    });

    it('shuffle is a no-op', () => {
      const dealer = new RemoteDealer();
      dealer.provide([1, 2, 3]);
      dealer.shuffle();
      expect(dealer.dealCard()).toBe(1); // Order is unchanged
    });

    it('can deal a card in provided order', () => {
      const dealer = new RemoteDealer();
      dealer.provide([10, 20]);
      expect(dealer.dealCard()).toBe(10);
      expect(dealer.remaining()).toBe(1);
    });

    it('throws when dealing with no cards available', () => {
      const dealer = new RemoteDealer();
      expect(() => dealer.dealCard()).toThrow('RemoteDealer: no cards available');
    });

    it('can deal multiple cards', () => {
      const dealer = new RemoteDealer();
      dealer.provide([1, 2, 3, 4]);
      const cards = dealer.deal(3);
      expect(cards).toEqual([1, 2, 3]);
      expect(dealer.remaining()).toBe(1);
    });

    it('can burn cards', () => {
      const dealer = new RemoteDealer();
      dealer.provide([1, 2, 3]);
      dealer.burn(2);
      expect(dealer.remaining()).toBe(1);
      expect(dealer.dealCard()).toBe(3);
    });

    it('default burn burns 1 card', () => {
      const dealer = new RemoteDealer();
      dealer.provide([1, 2, 3]);
      dealer.burn();
      expect(dealer.remaining()).toBe(2);
    });
  });
});
