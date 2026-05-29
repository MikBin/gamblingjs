import { describe, it, expect } from 'vitest';
import { enumerateStudStartingHands } from '../../src/hands/stud.js';

describe('Stud/Razz Starting Hands', () => {
  it('generates canonical 3-card hands with suit distinctions', () => {
    const hands = enumerateStudStartingHands();
    // 13 trips + 312 pairs (13*12*2 suit variants) + 1430 unpaired (C(13,3)*5 suit variants) = 1755
    expect(hands.length).toBe(1755);
  });

  it('generates unique canonical keys', () => {
    const hands = enumerateStudStartingHands();
    const keys = new Set(hands.map(h => h.key));
    expect(keys.size).toBe(hands.length);
  });

  it('includes specific expected hands', () => {
    const hands = enumerateStudStartingHands();

    // A32 suited (best razz hand variant)
    const a23 = hands.find(h => h.key === 'A32 suited');
    expect(a23).toBeDefined();
    expect(a23?.cards).toHaveLength(3);

    // AAA (rolled up aces)
    const aaa = hands.find(h => h.key === 'AAA');
    expect(aaa).toBeDefined();
    expect(aaa?.cards).toHaveLength(3);

    // KKK (rolled up kings)
    const kkk = hands.find(h => h.key === 'KKK');
    expect(kkk).toBeDefined();
    expect(kkk?.cards).toHaveLength(3);
  });
});