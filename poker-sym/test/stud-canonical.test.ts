import { describe, it, expect } from 'vitest';
import { studKey, getSortedRanks } from '../src/hands/stud-canonical';
import { cardIndex } from '../src/utils/deck';
import { enumerateStudStartingHands } from '../src/hands/stud';

describe('Stud Canonical Grouping', () => {
  it('should correctly format trips', () => {
    // 3 aces
    const cards = [cardIndex(12, 0), cardIndex(12, 1), cardIndex(12, 2)];
    expect(studKey(cards)).toBe('AAA');
  });

  it('should correctly format pair rainbow', () => {
    // 2 aces, 1 king, all different suits
    const cards = [cardIndex(12, 0), cardIndex(12, 1), cardIndex(11, 2)];
    expect(studKey(cards)).toBe('AAK:rb');
  });

  it('should correctly format pair suited kicker', () => {
    // 2 aces, 1 king. One of the aces matches the suit of the king
    const cards = [cardIndex(12, 0), cardIndex(12, 1), cardIndex(11, 0)];
    expect(studKey(cards)).toBe('AAK:s1');
  });

  it('should format high hands', () => {
    // A, K, Q
    const ms = [cardIndex(12, 0), cardIndex(11, 0), cardIndex(10, 0)];
    expect(studKey(ms)).toBe('AKQ:ms');

    const rb = [cardIndex(12, 0), cardIndex(11, 1), cardIndex(10, 2)];
    expect(studKey(rb)).toBe('AKQ:rb');

    const s12 = [cardIndex(12, 0), cardIndex(11, 0), cardIndex(10, 1)];
    expect(studKey(s12)).toBe('AKQ:s12');

    const s13 = [cardIndex(12, 0), cardIndex(11, 1), cardIndex(10, 0)];
    expect(studKey(s13)).toBe('AKQ:s13');

    const s23 = [cardIndex(12, 1), cardIndex(11, 0), cardIndex(10, 0)];
    expect(studKey(s23)).toBe('AKQ:s23');
  });

  it('should generate expected number of combinations', () => {
    const hands = enumerateStudStartingHands();
    expect(hands.length).toBeGreaterThan(0);
    // Total = 13 + 312 + 1430 = 1755
    expect(hands.length).toBe(1755);
  });
});
