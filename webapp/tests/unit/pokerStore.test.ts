import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePokerStore } from '../../src/stores/poker';

describe('Poker Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default values', () => {
    const store = usePokerStore();
    expect(store.gameVariant).toBe('texas-holdem');
    expect(store.pocketCards).toEqual([]);
    expect(store.communityCards).toEqual([]);
    expect(store.gameStage).toBe('preflop');
  });

  it('adds pocket cards correctly', () => {
    const store = usePokerStore();
    store.addPocketCard(0);
    expect(store.pocketCards).toEqual([0]);
    store.addPocketCard(1);
    expect(store.pocketCards).toEqual([0, 1]);

    // Cannot add more than 2
    store.addPocketCard(2);
    expect(store.pocketCards).toEqual([0, 1]);
  });

  it('adds community cards correctly', () => {
    const store = usePokerStore();
    store.addCommunityCard(5);
    store.addCommunityCard(6);
    store.addCommunityCard(7);
    expect(store.communityCards).toEqual([5, 6, 7]);
    expect(store.gameStage).toBe('flop');

    store.addCommunityCard(8);
    expect(store.gameStage).toBe('turn');

    store.addCommunityCard(9);
    expect(store.gameStage).toBe('river');

    // Cannot add more than 5
    store.addCommunityCard(10);
    expect(store.communityCards).toEqual([5, 6, 7, 8, 9]);
  });

  it('removes cards correctly', () => {
    const store = usePokerStore();
    store.addPocketCard(0);
    store.addPocketCard(1);
    store.removePocketCard(0);
    expect(store.pocketCards).toEqual([1]);

    store.addCommunityCard(5);
    store.addCommunityCard(6);
    store.addCommunityCard(7);
    store.removeCommunityCard(2);
    expect(store.communityCards).toEqual([5, 6]);
  });

  it('resets hand correctly', () => {
    const store = usePokerStore();
    store.addPocketCard(0);
    store.addCommunityCard(5);
    store.resetHand();
    expect(store.pocketCards).toEqual([]);
    expect(store.communityCards).toEqual([]);
    expect(store.gameStage).toBe('preflop');
  });
});
