import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import type {
  HandCategoryName,
  BoardTexture,
  StreetCategoryDistribution,
  EquityDistribution,
  TextureEquity,
  EquityRealization,
  StreetStats,
  StreetHandResult,
  StreetAnalysisResult,
} from './types.js';
import { HAND_CATEGORY_NAMES } from './types.js';
import { primaryTexture } from './board-texture.js';
import { HandGroup } from '../hands/types.js';

/**
 * Category ranking thresholds from the 5-card evaluator.
 * Rank <= threshold[i] means the hand belongs to category i.
 */
const CATEGORY_THRESHOLDS = [1276, 4136, 4994, 5852, 5862, 7139, 7295, 7451, 7461];

/** Map a numeric hand rank to a category name. */
export const categoryByRank = (rank: number): HandCategoryName => {
  let i = 0;
  while (i < CATEGORY_THRESHOLDS.length - 1 && rank > CATEGORY_THRESHOLDS[i]!) {
    i++;
  }
  return HAND_CATEGORY_NAMES[i]!;
};

/** Category index for a rank (0 = high card, ..., 8 = straight flush). */
export const categoryIndex = (rank: number): number => {
  let i = 0;
  while (i < CATEGORY_THRESHOLDS.length - 1 && rank > CATEGORY_THRESHOLDS[i]!) {
    i++;
  }
  return i;
};

/** Create an empty category distribution. */
const emptyCategories = (): StreetCategoryDistribution => ({
  'high card': 0,
  'one pair': 0,
  'two pair': 0,
  'three of a kind': 0,
  straight: 0,
  flush: 0,
  'full house': 0,
  'four of a kind': 0,
  'straight flush': 0,
});

/**
 * 5-card hand evaluator function type.
 */
export type FiveCardEvalFn = (c1: number, c2: number, c3: number, c4: number, c5: number) => number;

/**
 * 7-card hand evaluator function type.
 */
export type SevenCardEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
) => number;

/**
 * Evaluate best 5-card hand from 6 cards.
 * Tests all C(6,5) = 6 combinations, returns the best rank.
 */
export const bestOfSix = (cards: number[], eval5: FiveCardEvalFn): number => {
  let best = -1;
  // Skip index i to get a 5-card hand from 6 cards
  for (let i = 0; i < 6; i++) {
    const hand: number[] = [];
    for (let j = 0; j < 6; j++) {
      if (j !== i) hand.push(cards[j]!);
    }
    const rank = eval5(hand[0]!, hand[1]!, hand[2]!, hand[3]!, hand[4]!);
    if (rank > best) best = rank;
  }
  return best;
};

/** Data collected per simulation run for a single hand. */
interface RunData {
  flopRank: number;
  turnRank: number;
  riverRank: number;
  flopTexture: BoardTexture;
  turnTexture: BoardTexture;
  flopCategoryIdx: number;
  turnCategoryIdx: number;
  riverCategoryIdx: number;
}

/**
 * Run a single Monte Carlo simulation for street analysis.
 * Deals 5 board cards and evaluates at each street.
 */
const simulateSingleStreetRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
): RunData => {
  // Shuffle remaining deck (Fisher-Yates)
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Deal 5 community cards
  const board = d.slice(0, 5);

  // --- Flop: 2 hole + 3 board ---
  const flopRank = eval5(holeCards[0]!, holeCards[1]!, board[0]!, board[1]!, board[2]!);
  const flopTexture = primaryTexture(board.slice(0, 3));
  const flopCatIdx = categoryIndex(flopRank);

  // --- Turn: 2 hole + 4 board → best 5 of 6 ---
  const sixCardsTurn = [holeCards[0]!, holeCards[1]!, board[0]!, board[1]!, board[2]!, board[3]!];
  const turnRank = bestOfSix(sixCardsTurn, eval5);
  const turnTexture = primaryTexture(board.slice(0, 4));
  const turnCatIdx = categoryIndex(turnRank);

  // --- River: 2 hole + 5 board → best 5 of 7 ---
  const riverRank = eval7(
    holeCards[0]!,
    holeCards[1]!,
    board[0]!,
    board[1]!,
    board[2]!,
    board[3]!,
    board[4]!,
  );
  const riverCatIdx = categoryIndex(riverRank);

  return {
    flopRank,
    turnRank,
    riverRank,
    flopTexture,
    turnTexture,
    flopCategoryIdx: flopCatIdx,
    turnCategoryIdx: turnCatIdx,
    riverCategoryIdx: riverCatIdx,
  };
};

/** Compute percentile from sorted array. */
const percentile = (sorted: number[], p: number): number => {
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (idx - lo);
};

/** Build an EquityDistribution from an array of rank values. */
const buildDistribution = (ranks: number[]): EquityDistribution => {
  const n = ranks.length;
  const sorted = [...ranks].sort((a, b) => a - b);
  const mean = sorted.reduce((s, r) => s + r, 0) / n;
  const variance = sorted.reduce((s, r) => s + (r - mean) ** 2, 0) / n;

  return {
    mean,
    variance,
    stdDev: Math.sqrt(variance),
    percentiles: {
      p5: percentile(sorted, 5),
      p10: percentile(sorted, 10),
      p25: percentile(sorted, 25),
      p50: percentile(sorted, 50),
      p75: percentile(sorted, 75),
      p90: percentile(sorted, 90),
      p95: percentile(sorted, 95),
    },
    min: sorted[0]!,
    max: sorted[n - 1]!,
  };
};

/** Build texture-grouped equity data. */
const buildTextureEquity = (
  ranks: number[],
  textures: BoardTexture[],
  catIndices: number[],
): TextureEquity[] => {
  const groups = new Map<BoardTexture, { ranks: number[]; catIndices: number[] }>();

  for (let i = 0; i < ranks.length; i++) {
    const tex = textures[i]!;
    if (!groups.has(tex)) {
      groups.set(tex, { ranks: [], catIndices: [] });
    }
    const g = groups.get(tex)!;
    g.ranks.push(ranks[i]!);
    g.catIndices.push(catIndices[i]!);
  }

  const result: TextureEquity[] = [];
  for (const [texture, data] of groups) {
    const avg = data.ranks.reduce((s, r) => s + r, 0) / data.ranks.length;
    const cats = emptyCategories();
    for (const idx of data.catIndices) {
      cats[HAND_CATEGORY_NAMES[idx]!]!++;
    }
    // Normalize to percentages
    const total = data.ranks.length;
    for (const key of Object.keys(cats) as HandCategoryName[]) {
      (cats[key] as number) = ((cats[key] as number) / total) * 100;
    }

    result.push({
      texture,
      count: total,
      averageRank: avg,
      categoryDistribution: cats,
    });
  }

  // Sort by count descending
  result.sort((a, b) => b.count - a.count);
  return result;
};

/** Build street stats from per-run data. */
export const buildStreetStats = (
  ranks: number[],
  catIndices: number[],
  textures: BoardTexture[],
  prevCatIndices: number[] | null,
  riverCatIndices: number[] | null,
  isFlopOrTurn: boolean,
): StreetStats => {
  const n = ranks.length;

  // Category distribution (percentages)
  const cats = emptyCategories();
  for (const idx of catIndices) {
    cats[HAND_CATEGORY_NAMES[idx]!]!++;
  }
  for (const key of Object.keys(cats) as HandCategoryName[]) {
    (cats[key] as number) = ((cats[key] as number) / n) * 100;
  }

  // Average rank
  const averageRank = ranks.reduce((s, r) => s + r, 0) / n;

  // Equity distribution
  const distribution = buildDistribution(ranks);

  // Texture equity
  const textureEquity = buildTextureEquity(ranks, textures, catIndices);

  // Equity realization
  const median = distribution.percentiles.p50;

  let improvementRate = 0;
  if (prevCatIndices) {
    let improved = 0;
    for (let i = 0; i < n; i++) {
      if (catIndices[i]! > prevCatIndices[i]!) improved++;
    }
    improvementRate = (improved / n) * 100;
  }

  let nutCount = 0;
  for (const idx of catIndices) {
    // Full house = index 6, four of a kind = 7, straight flush = 8
    if (idx >= 6) nutCount++;
  }
  const nutPercentage = (nutCount / n) * 100;

  // Playability: % of runs where hand achieves one pair or better
  let playableCount = 0;
  for (const idx of catIndices) {
    if (idx >= 1) playableCount++; // one pair or better
  }
  const playabilityScore = (playableCount / n) * 100;

  // Draw conversion: at this street, how many "draw" hands (straight draw or flush draw category)
  // converted to a made hand by the river?
  let drawConversionRate = 0;
  if (isFlopOrTurn && riverCatIndices) {
    let drawCount = 0;
    let conversions = 0;
    for (let i = 0; i < n; i++) {
      const currentCat = catIndices[i]!;
      // A "draw" at flop/turn: hand is high card (0) or one pair (1) — speculative
      // Could also include straight draws by checking if turn/river improves significantly
      if (currentCat <= 1) {
        drawCount++;
        // "Converted" if river category is at least two pair (2) or better
        if (riverCatIndices[i]! >= 2) {
          conversions++;
        }
      }
    }
    if (drawCount > 0) {
      drawConversionRate = (conversions / drawCount) * 100;
    }
  }

  return {
    averageRank,
    categories: cats,
    distribution,
    textureEquity,
    realization: {
      improvementRate,
      nutPercentage,
      playabilityScore,
      drawConversionRate,
    },
  };
};

/**
 * Run street analysis for a single starting hand.
 *
 * Performs Monte Carlo simulation, evaluating hand strength at
 * each street (flop/turn/river), with board texture classification,
 * equity distribution, and realization metrics.
 *
 * @param hand - The canonical hand group to evaluate
 * @param runs - Number of Monte Carlo runs
 * @param eval5 - 5-card evaluator function
 * @param eval7 - 7-card evaluator function
 * @param seed - Optional random seed
 * @returns Street analysis result for this hand
 */
export const analyzeHandStreets = (
  hand: HandGroup,
  runs: number,
  eval5: FiveCardEvalFn,
  eval7: SevenCardEvalFn,
  seed?: number,
): StreetHandResult => {
  const rng = new SeedableRNG(seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  const flopRanks: number[] = [];
  const turnRanks: number[] = [];
  const riverRanks: number[] = [];
  const flopTextures: BoardTexture[] = [];
  const turnTextures: BoardTexture[] = [];
  const flopCatIndices: number[] = [];
  const turnCatIndices: number[] = [];
  const riverCatIndices: number[] = [];

  for (let i = 0; i < runs; i++) {
    const run = simulateSingleStreetRun(hand.cards, deck, rng, eval5, eval7);

    flopRanks.push(run.flopRank);
    turnRanks.push(run.turnRank);
    riverRanks.push(run.riverRank);
    flopTextures.push(run.flopTexture);
    turnTextures.push(run.turnTexture);
    flopCatIndices.push(run.flopCategoryIdx);
    turnCatIndices.push(run.turnCategoryIdx);
    riverCatIndices.push(run.riverCategoryIdx);
  }

  return {
    hand: hand.key,
    flop: buildStreetStats(flopRanks, flopCatIndices, flopTextures, null, riverCatIndices, true),
    turn: buildStreetStats(turnRanks, turnCatIndices, turnTextures, flopCatIndices, riverCatIndices, true),
    river: buildStreetStats(riverRanks, riverCatIndices, turnTextures, turnCatIndices, null, false),
  };
};

/**
 * Evaluate best Omaha hand from 4 hole cards + 3, 4, or 5 board cards.
 * Must use exactly 2 from hole cards and 3 from board.
 */
const bestOmahaOfN = (holeCards: number[], boardCards: number[], eval5: FiveCardEvalFn): number => {
  let best = -1;
  // Combinations of 2 from 4 hole cards
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const h1 = holeCards[i]!;
      const h2 = holeCards[j]!;

      // Combinations of 3 from N board cards
      for (let b1 = 0; b1 < boardCards.length; b1++) {
        for (let b2 = b1 + 1; b2 < boardCards.length; b2++) {
          for (let b3 = b2 + 1; b3 < boardCards.length; b3++) {
            const rank = eval5(h1, h2, boardCards[b1]!, boardCards[b2]!, boardCards[b3]!);
            if (rank > best) best = rank;
          }
        }
      }
    }
  }
  return best;
};

/**
 * Run a single Monte Carlo simulation for Omaha street analysis.
 */
const simulateSingleOmahaStreetRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  eval5: FiveCardEvalFn,
): RunData => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  const board = d.slice(0, 5);

  // --- Flop: 4 hole + 3 board ---
  const flopBoard = board.slice(0, 3);
  const flopRank = bestOmahaOfN(holeCards, flopBoard, eval5);
  const flopTexture = primaryTexture(flopBoard);
  const flopCatIdx = categoryIndex(flopRank);

  // --- Turn: 4 hole + 4 board ---
  const turnBoard = board.slice(0, 4);
  const turnRank = bestOmahaOfN(holeCards, turnBoard, eval5);
  const turnTexture = primaryTexture(turnBoard);
  const turnCatIdx = categoryIndex(turnRank);

  // --- River: 4 hole + 5 board ---
  const riverRank = bestOmahaOfN(holeCards, board, eval5);
  const riverCatIdx = categoryIndex(riverRank);

  return {
    flopRank,
    turnRank,
    riverRank,
    flopTexture,
    turnTexture,
    flopCategoryIdx: flopCatIdx,
    turnCategoryIdx: turnCatIdx,
    riverCategoryIdx: riverCatIdx,
  };
};

/**
 * Run multi-street analysis for a single Omaha starting hand.
 */
export const analyzeOmahaHandStreets = (
  hand: HandGroup,
  runs: number,
  eval5: FiveCardEvalFn,
  seed?: number,
): StreetHandResult => {
  const rng = new SeedableRNG(seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  const flopRanks: number[] = [];
  const turnRanks: number[] = [];
  const riverRanks: number[] = [];
  const flopTextures: BoardTexture[] = [];
  const turnTextures: BoardTexture[] = [];
  const flopCatIndices: number[] = [];
  const turnCatIndices: number[] = [];
  const riverCatIndices: number[] = [];

  for (let i = 0; i < runs; i++) {
    const run = simulateSingleOmahaStreetRun(hand.cards, deck, rng, eval5);

    flopRanks.push(run.flopRank);
    turnRanks.push(run.turnRank);
    riverRanks.push(run.riverRank);
    flopTextures.push(run.flopTexture);
    turnTextures.push(run.turnTexture);
    flopCatIndices.push(run.flopCategoryIdx);
    turnCatIndices.push(run.turnCategoryIdx);
    riverCatIndices.push(run.riverCategoryIdx);
  }

  return {
    hand: hand.key,
    flop: buildStreetStats(flopRanks, flopCatIndices, flopTextures, null, riverCatIndices, true),
    turn: buildStreetStats(turnRanks, turnCatIndices, turnTextures, flopCatIndices, riverCatIndices, true),
    river: buildStreetStats(riverRanks, riverCatIndices, turnTextures, turnCatIndices, null, false),
  };
};
