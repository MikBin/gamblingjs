import { describe, it, expect } from 'vitest';
import { enumerateStudStartingHands } from '../../src/hands/stud.js';

describe('Stud/Razz Starting Hands', () => {
  it('generates exactly 455 canonical 3-card hands', () => {
    const hands = enumerateStudStartingHands();
    expect(hands.length).toBe(455);
  });

  it('generates unique canonical keys', () => {
    const hands = enumerateStudStartingHands();
    const keys = new Set(hands.map(h => h.key));
    expect(keys.size).toBe(455);
  });

  it('includes specific expected hands', () => {
    const hands = enumerateStudStartingHands();

    // A23 (best razz hand)
    const a23 = hands.find(h => h.key === 'A32');
    expect(a23).toBeDefined();
    expect(a23?.cards).toHaveLength(3);

    // KKK (worst razz hand, sort of)
    const kkk = hands.find(h => h.key === 'KKK');
    expect(kkk).toBeDefined();
    expect(kkk?.cards).toHaveLength(3);
  });
});
