import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { categoryIndex, buildStreetStats, bestOfSix, FiveCardEvalFn, SevenCardEvalFn } from './street-analysis.js';
import { HandGroup } from '../hands/types.js';
import { primaryTexture } from './board-texture.js';
import { StreetStats, BoardTexture } from './types.js';

export interface RazzStreetHandResult {
  hand: string;
  third: StreetStats;
  fourth: StreetStats;
  fifth: StreetStats;
  sixth: StreetStats;
  seventh: StreetStats;
}

export interface RazzStreetAnalysisResult {
  gameType: 'razz';
  config: {
    runs: number;
    opponents: number;
    seed?: number;
  };
  hands: RazzStreetHandResult[];
  timestamp: string;
}

/**
 * Razz low-hand category names (inverted: higher index = better hand).
 * These map to the same indices used in the UI display.
 * Index 0 = worst (K-low), Index 8 = best (Wheel).
 */
export const RAZZ_CATEGORY_NAMES = [
  'K-low',
  'Q-low',
  'J-low',
  'T-low',
  '9-low',
  '8-low',
  '7-low',
  '6-low',
  '5-low (Wheel)',
] as const;

export type RazzCategoryName = (typeof RAZZ_CATEGORY_NAMES)[number];

/**
 * Get the A-5 low value of a card.
 * A=0 (best), 2=1, 3=2, ..., K=11
 */
const lowRankValue = (card: number): number => {
  const r = card % 13; // 0=2, 1=3, ..., 12=A
  return r === 12 ? 0 : r + 1;
};

/**
 * Determine the Razz low category from a set of cards.
 * Finds the best 5-card low (5 distinct ranks with lowest values)
 * and returns the category index (higher = better hand).
 *
 * Index 8 = Wheel (5-low), Index 0 = K-low
 */
const razzLowCategory = (cards: number[]): number => {
  // Get unique rank values
  const seen = new Set<number>();
  const lowValues: number[] = [];
  for (const c of cards) {
    const lv = lowRankValue(c);
    if (!seen.has(lv)) {
      seen.add(lv);
      lowValues.push(lv);
    }
  }
  lowValues.sort((a, b) => a - b);

  if (lowValues.length < 5) {
    return 0; // Can't make 5-card low → worst category
  }

  // Take 5 lowest distinct ranks
  const maxLowValue = lowValues[4]!;

  // Map to inverted category index (higher = better)
  // maxLowValue 0-4 → Wheel (5-low) → index 8
  // maxLowValue 5 → 6-low → index 7
  // ...
  // maxLowValue 12 → K-low → index 0
  if (maxLowValue <= 4) return 8; // Wheel
  return 12 - maxLowValue;
};

// Pad with low cards that don't improve the hand for early streets
const padToFive = (cards: number[]): number[] => {
  const result = [...cards];
  const padding = [0, 14, 28, 42, 1, 15, 29];
  let i = 0;
  while (result.length < 5) {
    if (!result.includes(padding[i]!)) {
      result.push(padding[i]!);
    }
    i++;
  }
  return result;
};

interface RazzRunData {
  thirdRank: number;
  fourthRank: number;
  fifthRank: number;
  sixthRank: number;
  seventhRank: number;
  thirdCatIdx: number;
  fourthCatIdx: number;
  fifthCatIdx: number;
  sixthCatIdx: number;
  seventhCatIdx: number;
  thirdTexture: BoardTexture;
  fourthTexture: BoardTexture;
  fifthTexture: BoardTexture;
  sixthTexture: BoardTexture;
  seventhTexture: BoardTexture;
}

const simulateSingleRazzStreetRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
): RazzRunData => {
  // Shuffle remaining deck (Fisher-Yates)
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards for hero
  const board = d.slice(0, 4);

  // Third street (3 cards) — pad to 5 for rank evaluation
  const thirdCards = [...holeCards];
  const thirdPad = padToFive(thirdCards);
  const thirdRank = eval5(thirdPad[0]!, thirdPad[1]!, thirdPad[2]!, thirdPad[3]!, thirdPad[4]!);
  const thirdTexture = primaryTexture(thirdCards);
  const thirdCatIdx = razzLowCategory(thirdCards);
  // For padded evaluation, use rank-based category index as fallback
  const thirdEvalCatIdx = categoryIndex(thirdRank);
  // Use the card-based category for 3rd street since padding gives misleading ranks
  const finalThirdCatIdx = thirdCards.length >= 5 ? thirdEvalCatIdx : thirdCatIdx;

  // Fourth street (4 cards) — pad to 5
  const fourthCards = [...holeCards, board[0]!];
  const fourthPad = padToFive(fourthCards);
  const fourthRank = eval5(fourthPad[0]!, fourthPad[1]!, fourthPad[2]!, fourthPad[3]!, fourthPad[4]!);
  const fourthTexture = primaryTexture(fourthCards);
  const fourthCatIdx = razzLowCategory(fourthCards);
  const fourthEvalCatIdx = categoryIndex(fourthRank);
  const finalFourthCatIdx = fourthCards.length >= 5 ? fourthEvalCatIdx : fourthCatIdx;

  // Fifth street (5 cards) — full 5-card evaluation
  const fifthCards = [...holeCards, board[0]!, board[1]!];
  const fifthRank = eval5(fifthCards[0]!, fifthCards[1]!, fifthCards[2]!, fifthCards[3]!, fifthCards[4]!);
  const fifthTexture = primaryTexture(fifthCards);
  const fifthCatIdx = razzLowCategory(fifthCards);

  // Sixth street (6 cards) — best 5 of 6
  const sixthCards = [...holeCards, board[0]!, board[1]!, board[2]!];
  const sixthRank = bestOfSix(sixthCards, eval5);
  const sixthTexture = primaryTexture(sixthCards);
  const sixthCatIdx = razzLowCategory(sixthCards);

  // Seventh street (7 cards) — best 5 of 7
  const seventhRank = eval7(
    holeCards[0]!, holeCards[1]!, holeCards[2]!,
    board[0]!, board[1]!, board[2]!, board[3]!,
  );
  const seventhTexture = primaryTexture([...holeCards, ...board]);
  const seventhCatIdx = razzLowCategory([...holeCards, ...board]);

  return {
    thirdRank, fourthRank, fifthRank, sixthRank, seventhRank,
    thirdCatIdx: finalThirdCatIdx,
    fourthCatIdx: finalFourthCatIdx,
    fifthCatIdx, sixthCatIdx, seventhCatIdx,
    thirdTexture, fourthTexture, fifthTexture, sixthTexture, seventhTexture,
  };
};

export const analyzeRazzHandStreets = (
  hand: HandGroup,
  runs: number,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  seed?: number,
): RazzStreetHandResult => {
  const rng = new SeedableRNG(seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  const thirdRanks: number[] = [];
  const fourthRanks: number[] = [];
  const fifthRanks: number[] = [];
  const sixthRanks: number[] = [];
  const seventhRanks: number[] = [];

  const thirdCatIndices: number[] = [];
  const fourthCatIndices: number[] = [];
  const fifthCatIndices: number[] = [];
  const sixthCatIndices: number[] = [];
  const seventhCatIndices: number[] = [];

  const thirdTextures: BoardTexture[] = [];
  const fourthTextures: BoardTexture[] = [];
  const fifthTextures: BoardTexture[] = [];
  const sixthTextures: BoardTexture[] = [];
  const seventhTextures: BoardTexture[] = [];

  for (let i = 0; i < runs; i++) {
    const run = simulateSingleRazzStreetRun(hand.cards, deck, rng, eval5, eval7);
    thirdRanks.push(run.thirdRank);
    fourthRanks.push(run.fourthRank);
    fifthRanks.push(run.fifthRank);
    sixthRanks.push(run.sixthRank);
    seventhRanks.push(run.seventhRank);

    thirdCatIndices.push(run.thirdCatIdx);
    fourthCatIndices.push(run.fourthCatIdx);
    fifthCatIndices.push(run.fifthCatIdx);
    sixthCatIndices.push(run.sixthCatIdx);
    seventhCatIndices.push(run.seventhCatIdx);

    thirdTextures.push(run.thirdTexture);
    fourthTextures.push(run.fourthTexture);
    fifthTextures.push(run.fifthTexture);
    sixthTextures.push(run.sixthTexture);
    seventhTextures.push(run.seventhTexture);
  }

  return {
    hand: hand.key,
    third: buildStreetStats(thirdRanks, thirdCatIndices, thirdTextures, null, seventhCatIndices, true),
    fourth: buildStreetStats(fourthRanks, fourthCatIndices, fourthTextures, thirdCatIndices, seventhCatIndices, true),
    fifth: buildStreetStats(fifthRanks, fifthCatIndices, fifthTextures, fourthCatIndices, seventhCatIndices, true),
    sixth: buildStreetStats(sixthRanks, sixthCatIndices, sixthTextures, fifthCatIndices, seventhCatIndices, true),
    seventh: buildStreetStats(seventhRanks, seventhCatIndices, seventhTextures, sixthCatIndices, null, false),
  };
};