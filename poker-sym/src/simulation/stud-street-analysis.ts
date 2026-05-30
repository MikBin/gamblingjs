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
 * Pad a partial hand to 5 cards for evaluation on early streets (3rd/4th).
 *
 * Strategy: use the worst possible filler cards that won't artificially improve
 * the hand. We use low-ranked cards from ranks NOT present in the hand, and
 * spread them across suits to avoid flush/straight contributions.
 *
 * Card encoding: index = suit * 13 + rank
 *   suit: 0=spades, 1=diamonds, 2=hearts, 3=clubs
 *   rank: 0=2, 1=3, ..., 8=T, 9=J, 10=Q, 11=K, 12=A
 */
export const padToFive = (cards: number[]): number[] => {
  const result = [...cards];
  const presentRanks = new Set(cards.map((c) => c % 13));

  // Candidate ranks to use for padding: iterate from rank 0 (deuce) upward.
  // These are the worst ranks — they produce the lowest high-hand values.
  // Pick one card per rank, cycling through suits.
  let i = 0;
  while (result.length < 5) {
    const rank = i % 13;
    const suit = Math.floor(i / 13) % 4;
    const candidate = suit * 13 + rank;

    // Skip if this card is already in the hand or if the rank is already
    // present (to prevent pairing). Also skip if already added as padding.
    if (
      !cards.includes(candidate) &&
      !presentRanks.has(rank) &&
      !result.includes(candidate)
    ) {
      result.push(candidate);
      // Don't add rank to presentRanks — the padding rank itself shouldn't
      // block further padding with a different suit of the same rank.
      // But we do need to avoid duplicates:
      presentRanks.add(rank);
    }
    i++;
    if (i >= 52) break; // safety: no infinite loop
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
