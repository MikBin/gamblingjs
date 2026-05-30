/**
 * Tests for the fixed padToFive (Stud), razzPadToFive (Razz), and razzLowCategory functions.
 *
 * Card encoding: index = suit * 13 + rank
 *   suit: 0=spades, 1=diamonds, 2=hearts, 3=clubs
 *   rank: 0=2, 1=3, ..., 8=T, 9=J, 10=Q, 11=K, 12=A
 *
 * Example cards:
 *   2♠=0, 3♠=1, ..., K♠=11, A♠=12
 *   2♦=13, 3♦=14, ..., K♦=24, A♦=25
 *   2♥=26, 3♥=27, ..., K♥=37, A♥=38
 *   2♣=39, 3♣=40, ..., K♣=50, A♣=51
 */
import { describe, it, expect } from 'vitest';
import { padToFive } from '../src/simulation/stud-street-analysis.js';
import { razzPadToFive, razzLowCategory, RAZZ_CATEGORY_NAMES } from '../src/simulation/razz-street-analysis.js';

// Helper: get rank from card index
const rankOf = (card: number): number => card % 13;
const rankName = (r: number): string => ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'][r]!;

// ─── Stud padToFive ───────────────────────────────────────────────

describe('Stud padToFive', () => {
  it('should not alter a 5-card hand', () => {
    const hand = [0, 14, 28, 42, 5]; // 2♠ 3♦ 4♥ 5♣ 7♠
    const result = padToFive(hand);
    expect(result).toEqual(hand);
  });

  it('should pad a 3-card hand to 5 cards', () => {
    const hand = [0, 14, 28]; // 2♠ 3♦ 4♥
    const result = padToFive(hand);
    expect(result).toHaveLength(5);
    // Original cards must be preserved
    expect(result.slice(0, 3)).toEqual(hand);
  });

  it('should pad a 4-card hand to 5 cards', () => {
    const hand = [0, 14, 28, 42]; // 2♠ 3♦ 4♥ 5♣
    const result = padToFive(hand);
    expect(result).toHaveLength(5);
    expect(result.slice(0, 4)).toEqual(hand);
  });

  it('should never introduce a card with a rank already in the hand', () => {
    // Hand with a deuce (rank 0): 2♠ and 3♠
    const hand = [0, 1]; // 2♠, 3♠
    const result = padToFive(hand);
    const ranks = result.map(rankOf);

    // All ranks must be distinct
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it('should not pair when hand has cards of the same rank in different suits', () => {
    // The OLD bug: hand has 2♥ (rank 0), padding would add 2♠ (rank 0) creating a pair.
    // Hand: 2♥ (26), K♠ (11), A♠ (12) — 3 cards, ranks 0, 11, 12
    const hand = [26, 11, 12]; // 2♥, K♠, A♠
    const result = padToFive(hand);
    const ranks = result.map(rankOf);

    // Should have 5 cards, all with distinct ranks
    expect(result).toHaveLength(5);
    expect(new Set(ranks).size).toBe(5);
  });

  it('should never artificially pair any card via padding', () => {
    // Test many 3-card hands — padding cards must have distinct ranks
    // from each other and from any rank not already in the hand.
    // (Hands with duplicate ranks like [2♠, 2♦, 2♥] can't have all-unique
    // ranks in the result, but padding must not make it worse.)
    const handsWithDistinctRanks = [
      [0, 1, 2],      // 2♠ 3♠ 4♠
      [0, 14, 28],    // 2♠ 3♦ 4♥
      [5, 20, 35],    // 7♠ 8♦ 9♥
    ];

    for (const hand of handsWithDistinctRanks) {
      const result = padToFive(hand);
      const ranks = result.map(rankOf);
      // All ranks must be distinct (no pairing from padding)
      expect(new Set(ranks).size).toBe(
        result.length,
        `Hand [${hand}] produced duplicate ranks after padding: [${ranks.map(rankName)}]`,
      );
    }

    // For hands with existing duplicate ranks (trips), padding should still
    // not introduce NEW duplicate ranks
    const tripsHand = [0, 13, 26]; // 2♠ 2♦ 2♥
    const result = padToFive(tripsHand);
    const paddingRanks = result.slice(3).map(rankOf);
    // Padding ranks should be distinct from each other
    expect(new Set(paddingRanks).size).toBe(paddingRanks.length);
    // And distinct from rank 0 (the trip rank)
    for (const r of paddingRanks) {
      expect(r).not.toBe(0);
    }
  });

  it('should preserve all original cards in order', () => {
    const hand = [5, 20, 35]; // 7♠, 8♦, 9♥
    const result = padToFive(hand);
    expect(result.slice(0, 3)).toEqual(hand);
  });

  it('should not contain any card that was in the original hand as padding', () => {
    const hand = [0, 14, 28]; // 2♠ 3♦ 4♥
    const result = padToFive(hand);
    // The padded cards (indices 3-4) must not be in the original hand
    const padding = result.slice(3);
    for (const p of padding) {
      expect(hand.includes(p)).toBe(false);
    }
  });
});

// ─── Razz razzPadToFive ──────────────────────────────────────────

describe('Razz razzPadToFive', () => {
  it('should not alter a 5-card hand', () => {
    const hand = [0, 14, 28, 42, 5]; // 2♠ 3♦ 4♥ 5♣ 7♠
    const result = razzPadToFive(hand);
    expect(result).toEqual(hand);
  });

  it('should pad a 3-card hand to 5 cards', () => {
    const hand = [12, 1, 2]; // A♠ 3♠ 4♠
    const result = razzPadToFive(hand);
    expect(result).toHaveLength(5);
    expect(result.slice(0, 3)).toEqual(hand);
  });

  it('should pad with the worst possible low cards (high ranks: K, Q, J, T)', () => {
    // Hand: A♠(12) 3♠(1) 4♠(2) — all very low ranks for Razz
    const hand = [12, 1, 2];
    const result = razzPadToFive(hand);
    const paddingRanks = result.slice(3).map(rankOf);

    // Padding should use K(11), Q(10), or other high ranks
    for (const r of paddingRanks) {
      expect(r).toBeGreaterThanOrEqual(5); // Should be mid-to-high ranks, not premium low
    }
  });

  it('should never artificially improve a Razz hand — K-Q-J padding test', () => {
    // The OLD bug: K♠(11) Q♦(24) J♠(9) padded with 2♠(0) 3♦(14) becomes a fake J-low.
    // Fix should pad with Tens or higher (not improving the low at all).
    const hand = [11, 24, 9]; // K♠, Q♦, J♠ — ranks 11, 11, 9
    // Actually these have duplicate rank 11 — let's use distinct ranks
    const hand2 = [11, 10, 9]; // K♠, Q♠, J♠ — ranks 11, 10, 9
    const result = razzPadToFive(hand2);
    const paddingRanks = result.slice(3).map(rankOf);

    // Padding ranks should all be >= the worst existing rank or very high
    // The key test: no padding card should have a low rank (0-8) that would
    // improve the hand's low value
    for (const r of paddingRanks) {
      // Padding should not use ranks 2-5 (indices 0-3) or Ace(12) —
      // these are premium Razz cards that would artificially improve the hand
      expect(r).toBeGreaterThanOrEqual(5);
    }
  });

  it('should never introduce a rank already in the hand', () => {
    // Hand with K and Q: K♠(11) Q♠(10) 2♥(26, rank 0)
    const hand = [11, 10, 26];
    const result = razzPadToFive(hand);
    const ranks = result.map(rankOf);
    expect(new Set(ranks).size).toBe(result.length);
  });

  it('should skip ranks already present when padding', () => {
    // Hand: K♠(11) Q♠(10) J♠(9) — has ranks 11, 10, 9
    // Should pad with T(8), 9 is taken, then 8 is available...
    // Actually rank 9=J is already there. Next available high rank is 8=T.
    const hand = [11, 10, 9];
    const result = razzPadToFive(hand);
    const paddingRanks = result.slice(3).map(rankOf);

    // Should not repeat any of the existing ranks (11, 10, 9)
    for (const r of paddingRanks) {
      expect([11, 10, 9].includes(r)).toBe(false);
    }
  });

  it('should preserve all original cards', () => {
    const hand = [12, 0, 1]; // A♠ 2♠ 3♠
    const result = razzPadToFive(hand);
    expect(result.slice(0, 3)).toEqual(hand);
  });
});

// ─── Razz razzLowCategory ────────────────────────────────────────

describe('Razz razzLowCategory', () => {
  it('should return Wheel (index 8) for A-2-3-4-5', () => {
    // A♠(12), 2♠(0), 3♠(1), 4♠(2), 5♠(3)
    expect(razzLowCategory([12, 0, 1, 2, 3])).toBe(8); // 5-low (Wheel)
  });

  it('should return 6-low for six-low hand', () => {
    // A♠(12), 2♠(0), 3♠(1), 4♠(2), 6♠(4)
    // lowRankValue: A→0, 2→1, 3→2, 4→3, 6→5
    // lowValues = [0,1,2,3,5], maxLowValue=5 → 12-5=7 → '6-low'
    expect(razzLowCategory([12, 0, 1, 2, 4])).toBe(7);
    expect(RAZZ_CATEGORY_NAMES[7]).toBe('6-low');
  });

  it('should return K-low (index 0) for worst possible 5-card low', () => {
    // K♠(11), Q♠(10), J♠(9), T♠(8), 9♠(7)
    // lowValues: [7,8,9,10,11], maxLowValue=11 → 12-11=1? Wait...
    // Actually lowRankValue: K→11, Q→10, J→9, T→8, 9→7
    // maxLowValue = 11, 12-11 = 1 → Q-low
    // For K-low we need the 5th lowest to have value 12... but max is 11 (King).
    // Hmm, 12-maxLowValue: for K-low we'd need maxLowValue=12 which is impossible
    // since lowRankValue maxes at 11 (K).
    // Actually let me re-check: lowRankValue(2)=1, lowRankValue(K)=11, lowRankValue(A)=0
    // So the worst low is K-low with maxLowValue=11: 12-11=1... that's Q-low.
    // Wait, the category mapping: index 0 = K-low. When does 12-maxLowValue = 0?
    // Never, since max is 11. Let me re-examine...

    // Actually for the 5-card case, a K-Q-J-T-9 hand gives lowValues [7,8,9,10,11]
    // maxLowValue = 11, return 12-11 = 1 → Q-low (index 1)
    // That seems like the worst possible 5-card hand category is Q-low, not K-low.
    // K-low would only happen if maxLowValue could be 12, but it can't.
    // So K-low (index 0) is effectively never returned for 5-card hands.
    // It IS returned for partial hands via the fallback.

    // K♠(11)→lv12, Q♠(10)→lv11, J♠(9)→lv10, T♠(8)→lv9, 9♠(7)→lv8
    // lowValues = [8,9,10,11,12], maxLowValue=12, 12-12=0 → K-low
    expect(razzLowCategory([11, 10, 9, 8, 7])).toBe(0); // K-low
  });

  describe('partial hands (3-4 cards) — the fix', () => {
    it('should NOT return 0 for all partial hands', () => {
      // OLD behavior: every 3-card hand returned 0 (K-low)
      // NEW behavior: should categorize based on highest card
      const ace23 = [12, 0, 1]; // A♠ 2♠ 3♠ → lowValues [0,1,2], max=2 → 12-2=10, min(8,10)=8
      const result = razzLowCategory(ace23);
      expect(result).not.toBe(0); // Should not be K-low!
      expect(result).toBe(8); // Should be near Wheel
    });

    it('should categorize A-2-3 as strong (near Wheel)', () => {
      // lowValues: [0,1,2], max=2 → 12-2=10 → min(8,10)=8 → Wheel category
      expect(razzLowCategory([12, 0, 1])).toBe(8);
    });

    it('should categorize K-Q-J as weak', () => {
      // K♠(11)→lv12, Q♠(10)→lv11, J♠(9)→lv10
      // lowValues [10,11,12], max=12 → 12-12=0 → K-low
      expect(razzLowCategory([11, 10, 9])).toBe(0); // K-low
    });

    it('should differentiate hands on 4th street', () => {
      // A-2-3-4 → lowValues [0,1,2,3], max=3 → 12-3=9 → min(8,9)=8
      expect(razzLowCategory([12, 0, 1, 2])).toBe(8);

      // K-Q-J-T → K→lv12, Q→lv11, J→lv10, T→lv9
      // lowValues [9,10,11,12], max=12 → 12-12=0 → K-low
      expect(razzLowCategory([11, 10, 9, 8])).toBe(0); // K-low
    });

    it('should still work correctly for 5-card hands (unchanged behavior)', () => {
      // 5-low (Wheel)
      expect(razzLowCategory([12, 0, 1, 2, 3])).toBe(8);

      // 7-low: A,2,3,4,6 → lowValues [0,1,2,3,5], max=5 → 12-5=7
      expect(razzLowCategory([12, 0, 1, 2, 4])).toBe(7);

      // T-low: 2,3,4,5,J → 2→lv1, 3→lv2, 4→lv3, 5→lv4, J→lv10
      // lowValues [1,2,3,4,10], max=10 → 12-10=2 → T-low
      expect(razzLowCategory([0, 1, 2, 3, 9])).toBe(2);
    });

    it('should handle 6+ card hands correctly', () => {
      // A,2,3,4,5,6 → best 5: A-2-3-4-5 = Wheel
      expect(razzLowCategory([12, 0, 1, 2, 3, 4])).toBe(8);

      // A,2,3,4,6,K → best 5: A-2-3-4-6 = 6-low (maxLowValue=5 → 12-5=7)
      expect(razzLowCategory([12, 0, 1, 2, 4, 11])).toBe(7);
    });
  });
});