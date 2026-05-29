import { cardIndex, cardRank, cardSuit } from '../utils/deck.js';
import { OmahaRankPattern, OmahaSuitPattern } from './types.js';
import { rankSym } from './canonical.js';

/**
 * Extracts ranks and sorts them in descending order.
 */
export const getSortedRanks = (cards: number[]): number[] => {
  return cards.map(cardRank).sort((a, b) => b - a);
};

/**
 * Compute the rank pattern for a 4-card Omaha hand.
 */
export const omahaRankPattern = (cards: number[]): OmahaRankPattern => {
  const ranks = getSortedRanks(cards);
  const counts: Record<number, number> = {};
  for (const r of ranks) {
    counts[r] = (counts[r] || 0) + 1;
  }
  const vals = Object.values(counts).sort((a, b) => b - a);

  if (vals[0] === 4) return OmahaRankPattern.QUADS;
  if (vals[0] === 3) return OmahaRankPattern.TRIPS;
  if (vals[0] === 2 && vals[1] === 2) return OmahaRankPattern.TWO_PAIR;
  if (vals[0] === 2) return OmahaRankPattern.ONE_PAIR;
  return OmahaRankPattern.HIGH;
};

/**
 * Compute the suit pattern for a 4-card Omaha hand.
 */
export const omahaSuitPattern = (cards: number[]): OmahaSuitPattern => {
  const suits = cards.map(cardSuit);
  const counts: Record<number, number> = {};
  for (const s of suits) {
    counts[s] = (counts[s] || 0) + 1;
  }
  const vals = Object.values(counts).sort((a, b) => b - a);

  if (vals[0] === 4) return OmahaSuitPattern.MONOSUIT;
  if (vals[0] === 3) return OmahaSuitPattern.THREE_ONE;
  if (vals[0] === 2 && vals[1] === 2) return OmahaSuitPattern.DOUBLE_SUITED;
  if (vals[0] === 2 && vals[1] === 1) return OmahaSuitPattern.TWO_ONE_ONE;
  return OmahaSuitPattern.RAINBOW;
};

/**
 * Generates an Omaha hand key based on ranks and suit distribution.
 * Sorts ranks to enforce a descending canonical representation.
 */
export const omahaKey = (cards: number[]): string => {
  // Sort cards primarily by rank (desc), then by a canonical suit order to ensure isomorphic groupings get identical keys.
  // Actually, we need to identify the exact suit configuration relative to the ranks.

  // Group cards by rank, ordered highest rank to lowest
  const cardsByRank: Record<number, number[]> = {};
  for (const c of cards) {
    const r = cardRank(c);
    if (!cardsByRank[r]) cardsByRank[r] = [];
    cardsByRank[r].push(c);
  }

  // We want to sort the rank keys descending
  const sortedRankKeys = Object.keys(cardsByRank).map(Number).sort((a, b) => b - a);

  // Construct the rank part (e.g. AAAA, AAKK, AKQJ)
  let rankStr = '';
  // Ordered flat list of cards matching the rankStr
  const orderedCards: number[] = [];

  // For rank patterns where multiplicities are different (e.g. Trips AAAB vs ABBB),
  // we want the trips to come first in the rank string, but wait, poker standard
  // is usually just highest to lowest, except maybe for full houses/etc.
  // Actually, for canonical keys, sorting the rank groups by descending frequency,
  // then descending rank is the most standard way (e.g. AAAB, not BAAA even if B is A and A is K).

  // Custom sort for rank groups: frequency desc, then rank desc
  const rankGroups = sortedRankKeys.map(r => ({ rank: r, cards: cardsByRank[r]! }));
  rankGroups.sort((a, b) => {
    if (a.cards.length !== b.cards.length) return b.cards.length - a.cards.length;
    return b.rank - a.rank;
  });

  for (const group of rankGroups) {
    for (const c of group.cards) {
      rankStr += rankSym(group.rank);
      orderedCards.push(c);
    }
  }

  // Now determine the suit suffix.
  const rPattern = omahaRankPattern(cards);
  const sPattern = omahaSuitPattern(cards);

  let suitSuffix = '';

  // Helper to get suit of ordered card i
  const s = (i: number) => cardSuit(orderedCards[i]!);

  switch (rPattern) {
    case OmahaRankPattern.QUADS:
      // AAAA - suit pattern doesn't matter (always rainbow)
      break;

    case OmahaRankPattern.TRIPS:
      // AAAB (orderedCards 0,1,2 are the trips, 3 is the kicker)
      // Trips use 3 of the 4 suits.
      // Suffix: 's' if kicker is suited to one of the trips, 'o' if it's the remaining 4th suit.
      // Since orderedCards 0,1,2 contain 3 distinct suits, kicker is suited if its suit is in {s(0),s(1),s(2)}
      if (s(3) === s(0) || s(3) === s(1) || s(3) === s(2)) {
        suitSuffix = ':s'; // Kicker suited
      } else {
        suitSuffix = ':o'; // Kicker offsuit
      }
      break;

    case OmahaRankPattern.TWO_PAIR:
      // AABB
      if (sPattern === OmahaSuitPattern.DOUBLE_SUITED) {
        // AABB where suits match exactly (e.g., AsKs, AhKh).
        if ((s(0) === s(2) && s(1) === s(3)) || (s(0) === s(3) && s(1) === s(2))) {
           suitSuffix = ':ss'; // Share both suits
        } else {
           suitSuffix = ':ns'; // Share no suits (should be impossible to be ds but share no suits for AABB?
           // Wait. If AABB is ds, that means 2 of suit X, 2 of suit Y.
           // They MUST either be (X,X)+(Y,Y) or (X,Y)+(X,Y).
           // (X,X) + (Y,Y) means pairs don't share suits, so A1=X,A2=X; B1=Y,B2=Y. This is impossible since A1,A2 must have DIFFERENT suits.
           // Thus, AABB ds is ALWAYS (X,Y)+(X,Y). So AABB:ds means they share BOTH suits.
           suitSuffix = ':ss';
        }
      } else if (sPattern === OmahaSuitPattern.RAINBOW) {
         // All 4 different suits
         suitSuffix = ':ns'; // Share no suits
      } else {
         // sPattern is TWO_ONE_ONE (since AABB cannot be Mono or Three-One)
         // Meaning 2 of suit X, 1 of Y, 1 of Z.
         // This means they share EXACTLY ONE suit.
         suitSuffix = ':s1';
      }
      break;

    case OmahaRankPattern.ONE_PAIR:
      // AABC
      // Pair is at 0, 1. Kickers at 2, 3.
      if (sPattern === OmahaSuitPattern.MONOSUIT) {
         suitSuffix = ':ms'; // Impossible, pair has different suits
      } else if (sPattern === OmahaSuitPattern.THREE_ONE) {
         // Three of suit X, one of Y.
         // Suit X must be shared by one of the pair cards and BOTH kickers.
         suitSuffix = ':31';
      } else if (sPattern === OmahaSuitPattern.DOUBLE_SUITED) {
         // X, X, Y, Y
         // Pair has suits {X,Y}. Kickers must have suits {X,Y}.
         // Which means kickers are suited to DIFFERENT pair suits.
         suitSuffix = ':ds';
      } else if (sPattern === OmahaSuitPattern.RAINBOW) {
         suitSuffix = ':rb'; // Both kickers offsuit to everything
      } else {
         // TWO_ONE_ONE: X, X, Y, Z
         // Several possibilities:
         // 1. Kickers match each other (Z, Z). Since pair is X,Y, kickers don't match pair. (e.g. AsAh KcQc) -> ':ks' (kickers suited)
         // 2. One kicker matches pair, other is new suit. (e.g. AsAh KsQd) -> ':s1' (one kicker suited to pair)
         if (s(2) === s(3)) {
            suitSuffix = ':ks';
         } else {
            suitSuffix = ':s1';
         }
      }
      break;

    case OmahaRankPattern.HIGH:
      // ABCD
      if (sPattern === OmahaSuitPattern.MONOSUIT) suitSuffix = ':ms';
      else if (sPattern === OmahaSuitPattern.RAINBOW) suitSuffix = ':rb';
      else if (sPattern === OmahaSuitPattern.THREE_ONE) suitSuffix = ':31';
      else if (sPattern === OmahaSuitPattern.TWO_ONE_ONE) suitSuffix = ':211';
      else {
         // DOUBLE_SUITED (X, X, Y, Y)
         // Need to identify which ranks pair up!
         // ABCD. Pairs could be: (0,1)+(2,3) [adj], (0,2)+(1,3) [alt], (0,3)+(1,2) [cross]
         if (s(0) === s(1) && s(2) === s(3)) suitSuffix = ':ds12';
         else if (s(0) === s(2) && s(1) === s(3)) suitSuffix = ':ds13';
         else if (s(0) === s(3) && s(1) === s(2)) suitSuffix = ':ds14';
      }
      break;
  }

  return rankStr + suitSuffix;
};

/**
 * Generates a readable description for the hand.
 */
export const omahaDescription = (key: string): string => {
  return "Omaha Hand: " + key;
};
