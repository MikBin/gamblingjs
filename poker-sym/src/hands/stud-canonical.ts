import { cardIndex, cardRank, cardSuit } from '../utils/deck.js';
import { rankSym } from './canonical.js';

export enum StudRankPattern {
  TRIPS = 'trips',
  PAIR = 'pair',
  HIGH = 'high',
}

export enum StudSuitPattern {
  MONOSUIT = 'monosuit',
  TWO_ONE = 'two-one',
  RAINBOW = 'rainbow',
}

/** Extracts ranks and sorts them descending */
export const getSortedRanks = (cards: number[]): number[] => {
  return cards.map(cardRank).sort((a, b) => b - a);
};

export const studRankPattern = (cards: number[]): StudRankPattern => {
  const ranks = getSortedRanks(cards);
  if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) return StudRankPattern.TRIPS;
  if (ranks[0] === ranks[1] || ranks[1] === ranks[2]) return StudRankPattern.PAIR;
  return StudRankPattern.HIGH;
};

export const studSuitPattern = (cards: number[]): StudSuitPattern => {
  const suits = cards.map(cardSuit);
  if (suits[0] === suits[1] && suits[1] === suits[2]) return StudSuitPattern.MONOSUIT;
  if (suits[0] === suits[1] || suits[0] === suits[2] || suits[1] === suits[2]) return StudSuitPattern.TWO_ONE;
  return StudSuitPattern.RAINBOW;
};

export const studKey = (cards: number[]): string => {
  const ranks = getSortedRanks(cards);
  const rPattern = studRankPattern(cards);
  const sPattern = studSuitPattern(cards);

  // Arrange ranks properly for presentation
  let orderedRanks = ranks;
  if (rPattern === StudRankPattern.PAIR) {
    if (ranks[1] === ranks[2]) {
      orderedRanks = [ranks[1], ranks[2], ranks[0]];
    }
  }

  const rankStr = orderedRanks.map((r) => rankSym(r)).join('');
  let suitSuffix = '';

  if (rPattern === StudRankPattern.TRIPS) {
    // Trips are always 3 distinct suits, so no suffix needed
    suitSuffix = '';
  } else if (rPattern === StudRankPattern.PAIR) {
    if (sPattern === StudSuitPattern.TWO_ONE) {
      // Find which cards are suited.
      // Ordered ranks are: [PairRank, PairRank, KickerRank]
      // Because a pair cannot share the same suit, the suited cards MUST be one pair card and the kicker.
      suitSuffix = ':s1';
    } else {
      suitSuffix = ':rb';
    }
  } else {
    // High card
    if (sPattern === StudSuitPattern.MONOSUIT) suitSuffix = ':ms';
    else if (sPattern === StudSuitPattern.RAINBOW) suitSuffix = ':rb';
    else {
      // TWO_ONE (two cards suited, one offsuit)
      // Determine which cards are suited.
      const suits = cards.map(cardSuit);
      const suitCounts: Record<number, number> = {};
      for (const s of suits) suitCounts[s] = (suitCounts[s] || 0) + 1;
      const dupSuit = Object.keys(suitCounts).find((s) => suitCounts[Number(s)] === 2);

      const r = cards.map(c => ({ rank: cardRank(c), suit: cardSuit(c) })).sort((a, b) => b.rank - a.rank);
      const isS0 = r[0].suit == dupSuit;
      const isS1 = r[1].suit == dupSuit;
      const isS2 = r[2].suit == dupSuit;

      if (isS0 && isS1) suitSuffix = ':s12';
      else if (isS0 && isS2) suitSuffix = ':s13';
      else if (isS1 && isS2) suitSuffix = ':s23';
    }
  }

  return rankStr + suitSuffix;
};

export const studDescription = (key: string): string => {
  return "Stud Hand: " + key;
};
