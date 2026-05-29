import { describe, it, expect } from 'vitest';
import { enumerateOmahaStartingHands } from '../src/hands/omaha.js';

describe('enumerateOmahaStartingHands', () => {
  it('returns a non-empty array', () => {
    const hands = enumerateOmahaStartingHands();
    expect(hands.length).toBeGreaterThan(0);
  });

  it('each hand has 4 cards', () => {
    const hands = enumerateOmahaStartingHands();
    for (const hand of hands) {
      expect(hand.cards).toHaveLength(4);
    }
  });

  it('each hand has a unique key', () => {
    const hands = enumerateOmahaStartingHands();
    const keys = new Set(hands.map(h => h.key));
    expect(keys.size).toBe(hands.length);
  });

  it('produces canonical representative cards (valid indices 0-51)', () => {
    const hands = enumerateOmahaStartingHands();
    for (const hand of hands) {
      for (const card of hand.cards) {
        expect(card).toBeGreaterThanOrEqual(0);
        expect(card).toBeLessThan(52);
      }
    }
  });

  it('has expected approximate count of canonical groups', () => {
    const hands = enumerateOmahaStartingHands();
    // Should be somewhere in the range of 3,000-6,000+ groups
    expect(hands.length).toBeGreaterThan(1000);
    expect(hands.length).toBeLessThan(10000);
  });
});
