import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { categoryIndex, buildStreetStats, bestOfSix, FiveCardEvalFn, SevenCardEvalFn } from './street-analysis.js';
import { HandGroup } from '../hands/types.js';
import { primaryTexture } from './board-texture.js';
import { StreetStats, BoardTexture } from './types.js';

export interface StudStreetHandResult {
  hand: string;
  third: StreetStats;
  fourth: StreetStats;
  fifth: StreetStats;
  sixth: StreetStats;
  seventh: StreetStats;
}

export interface StudStreetAnalysisResult {
  gameType: '7card-stud';
  config: {
    runs: number;
    opponents: number;
    seed?: number;
  };
  hands: StudStreetHandResult[];
  timestamp: string;
}

interface RunData {
  thirdRank: number;
  fourthRank: number;
  fifthRank: number;
  sixthRank: number;
  seventhRank: number;
  thirdCategoryIdx: number;
  fourthCategoryIdx: number;
  fifthCategoryIdx: number;
  sixthCategoryIdx: number;
  seventhCategoryIdx: number;
  thirdTexture: BoardTexture;
  fourthTexture: BoardTexture;
  fifthTexture: BoardTexture;
  sixthTexture: BoardTexture;
  seventhTexture: BoardTexture;
}

/**
 * Get the best 5-card rank from a subset of cards.
 * If less than 5 cards, it pads with bad cards just to get a valid rank category.
 * Actually, hold on. We only need "best 5 cards from 5 cards" for 5th street,
 * "best 5 cards from 6 cards" for 6th street,
 * "best 5 cards from 7 cards" for 7th street.
 * What about 3rd and 4th street?
 * Let's evaluate using dummy cards to make 5, but ensure they don't pair or make flushes.
 * E.g., pad with indices 52, 53, etc., but the evaluator might throw if out of bounds.
 * Actually, evaluating less than 5 cards doesn't fit standard evaluators.
 * How do we handle 3rd and 4th street ranks? We can pad them with the worst cards that don't help.
 */

// Let's pad with 2c, 3d, 4h, 5s (indices 0, 14, 28, 42) if they aren't in the hand.
const padToFive = (cards: number[]): number[] => {
  const result = [...cards];
  const padding = [0, 14, 28, 42, 1, 15, 29]; // 2c, 3d, 4h, 5s, 3c, 4d, 5h
  let i = 0;
  while (result.length < 5) {
    if (!result.includes(padding[i]!)) {
      result.push(padding[i]!);
    }
    i++;
  }
  return result;
};

const simulateSingleStudStreetRun = (
  holeCards: number[], // 3 cards
  deck: number[],
  rng: SeedableRNG,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn
): RunData => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards
  const board = d.slice(0, 4);

  // Third street (3 cards)
  const thirdCards = [...holeCards];
  const thirdPad = padToFive(thirdCards);
  const thirdRank = eval5(thirdPad[0]!, thirdPad[1]!, thirdPad[2]!, thirdPad[3]!, thirdPad[4]!);
  const thirdTexture = primaryTexture(thirdCards);
  const thirdCatIdx = categoryIndex(thirdRank);

  // Fourth street (4 cards)
  const fourthCards = [...holeCards, board[0]!];
  const fourthPad = padToFive(fourthCards);
  const fourthRank = eval5(fourthPad[0]!, fourthPad[1]!, fourthPad[2]!, fourthPad[3]!, fourthPad[4]!);
  const fourthTexture = primaryTexture(fourthCards);
  const fourthCatIdx = categoryIndex(fourthRank);

  // Fifth street (5 cards)
  const fifthCards = [...holeCards, board[0]!, board[1]!];
  const fifthRank = eval5(fifthCards[0]!, fifthCards[1]!, fifthCards[2]!, fifthCards[3]!, fifthCards[4]!);
  const fifthTexture = primaryTexture(fifthCards);
  const fifthCatIdx = categoryIndex(fifthRank);

  // Sixth street (6 cards)
  const sixthCards = [...holeCards, board[0]!, board[1]!, board[2]!];
  const sixthRank = bestOfSix(sixthCards, eval5);
  const sixthTexture = primaryTexture(sixthCards);
  const sixthCatIdx = categoryIndex(sixthRank);

  // Seventh street (7 cards)
  const seventhRank = eval7(
    holeCards[0]!, holeCards[1]!, holeCards[2]!,
    board[0]!, board[1]!, board[2]!, board[3]!
  );
  const seventhTexture = primaryTexture([...holeCards, ...board]);
  const seventhCatIdx = categoryIndex(seventhRank);

  return {
    thirdRank, fourthRank, fifthRank, sixthRank, seventhRank,
    thirdCategoryIdx: thirdCatIdx, fourthCategoryIdx: fourthCatIdx, fifthCategoryIdx: fifthCatIdx, sixthCategoryIdx: sixthCatIdx, seventhCategoryIdx: seventhCatIdx,
    thirdTexture, fourthTexture, fifthTexture, sixthTexture, seventhTexture
  };
};

export const analyzeStudHandStreets = (
  hand: HandGroup,
  runs: number,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  seed?: number
): StudStreetHandResult => {
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
    const run = simulateSingleStudStreetRun(hand.cards, deck, rng, eval5, eval7);
    thirdRanks.push(run.thirdRank);
    fourthRanks.push(run.fourthRank);
    fifthRanks.push(run.fifthRank);
    sixthRanks.push(run.sixthRank);
    seventhRanks.push(run.seventhRank);

    thirdCatIndices.push(run.thirdCategoryIdx);
    fourthCatIndices.push(run.fourthCategoryIdx);
    fifthCatIndices.push(run.fifthCategoryIdx);
    sixthCatIndices.push(run.sixthCategoryIdx);
    seventhCatIndices.push(run.seventhCategoryIdx);

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
