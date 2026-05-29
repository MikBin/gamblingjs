import { describe, it, expect } from 'vitest';
import { enumerateStudStartingHands } from '../poker-sym/src/hands/stud.js';

describe('Stud Hand Enumeration', () => {
  it('should generate exactly 1755 canonical starting hands', () => {
    const hands = enumerateStudStartingHands();
    expect(hands.length).toBe(1755);
  });

  it('should have unique keys for all hands', () => {
    const hands = enumerateStudStartingHands();
    const keys = new Set(hands.map(h => h.key));
    expect(keys.size).toBe(1755);
  });

  it('should correctly format trips', () => {
    const hands = enumerateStudStartingHands();
    const aces = hands.find(h => h.key === 'AAA');
    expect(aces).toBeDefined();
    expect(aces!.cards.length).toBe(3);
    expect(aces!.description).toBe('Rolled up As');
  });

  it('should correctly format pairs', () => {
    const hands = enumerateStudStartingHands();

    const pairHighRainbow = hands.find(h => h.key === 'AAK rainbow');
    expect(pairHighRainbow).toBeDefined();
    expect(pairHighRainbow!.description).toBe('Pair of As with K kicker (rainbow)');

    const pairLow2Suited = hands.find(h => h.key === 'K22 2-suited');
    expect(pairLow2Suited).toBeDefined();
    expect(pairLow2Suited!.description).toBe('Pair of 2s with K kicker (2-suited)');
  });

  it('should correctly format 3 different ranks', () => {
    const hands = enumerateStudStartingHands();

    const suited = hands.find(h => h.key === 'AKQ suited');
    expect(suited).toBeDefined();

    const rainbow = hands.find(h => h.key === '753 rainbow');
    expect(rainbow).toBeDefined();

    const highSuited = hands.find(h => h.key === 'JT9 2-suited (high)');
    expect(highSuited).toBeDefined();

    const gapSuited = hands.find(h => h.key === 'JT9 2-suited (gap)');
    expect(gapSuited).toBeDefined();

    const lowSuited = hands.find(h => h.key === 'JT9 2-suited (low)');
    expect(lowSuited).toBeDefined();
  });
});
