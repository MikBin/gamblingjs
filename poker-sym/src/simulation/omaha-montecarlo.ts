import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandStrengthResult, SimulationConfig } from './types.js';
import { HandGroup } from '../hands/types.js';

export type OmahaEvaluator = {
  eval5: (c1: number, c2: number, c3: number, c4: number, c5: number) => number;
};

// Choose 2 from 4 hole cards
function combinations2of4(cards: number[]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      result.push([cards[i]!, cards[j]!]);
    }
  }
  return result; // 6 combinations
}

// Choose 3 from 5 board cards
function combinations3of5(cards: number[]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 5; j++) {
      for (let k = j + 1; k < 5; k++) {
        result.push([cards[i]!, cards[j]!, cards[k]!]);
      }
    }
  }
  return result; // 10 combinations
}

// Best Omaha hand = max over all 60 combinations of eval5(hole2 + board3)
function bestOmahaHand(holeCards: number[], board: number[], eval5: OmahaEvaluator['eval5']): number {
  let best = -Infinity;
  const holeCombos = combinations2of4(holeCards);
  const boardCombos = combinations3of5(board);

  for (const hc of holeCombos) {
    for (const bc of boardCombos) {
      const score = eval5(hc[0]!, hc[1]!, bc[0]!, bc[1]!, bc[2]!);
      if (score > best) best = score;
    }
  }
  return best;
}

/**
 * Simulate a single raw strength run (no opponents).
 * Deals 5 community cards and finds the best 5-card combination.
 */
const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: OmahaEvaluator,
): number => {
  // Shuffle remaining deck
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Deal 5 community cards
  const board = d.slice(0, 5);

  // Evaluate the best Omaha hand
  return bestOmahaHand(holeCards, board, evaluator.eval5);
};

/**
 * Simulate a hand with opponents.
 * Deals opponent hands (4 cards each) and community cards (5 cards),
 * evaluates all hands, and determines if our hand wins.
 */
const simulateWithOpponents = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: OmahaEvaluator,
  numOpponents: number,
): { win: number; rank: number } => {
  // Shuffle remaining deck
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Deal opponent hands (4 cards each) then 5 community cards
  const totalNeeded = numOpponents * 4 + 5;
  const dealt = d.slice(0, totalNeeded);

  // Extract opponent hands
  const opponentHands: number[][] = [];
  for (let i = 0; i < numOpponents; i++) {
    opponentHands.push([dealt[i * 4]!, dealt[i * 4 + 1]!, dealt[i * 4 + 2]!, dealt[i * 4 + 3]!]);
  }

  // Community cards start after opponent hands
  const board = dealt.slice(numOpponents * 4, numOpponents * 4 + 5);

  // Evaluate our hand
  const ourRank = bestOmahaHand(holeCards, board, evaluator.eval5);

  // Evaluate opponent hands
  let bestOpponentRank = -1;
  for (const opp of opponentHands) {
    const oppRank = bestOmahaHand(opp, board, evaluator.eval5);
    if (oppRank > bestOpponentRank) {
      bestOpponentRank = oppRank;
    }
  }

  // Higher rank = better hand in this library
  if (ourRank > bestOpponentRank) return { win: 1, rank: ourRank };
  if (ourRank === bestOpponentRank) return { win: 0.5, rank: ourRank };
  return { win: 0, rank: ourRank };
};

/**
 * Simulate a single Omaha hand.
 */
export const simulateOmahaHand = (
  hand: HandGroup,
  config: SimulationConfig,
  evaluator: OmahaEvaluator,
): HandStrengthResult => {
  const rng = new SeedableRNG(config.seed ?? Date.now());
  const deck = makeDeck(hand.cards);
  const numOpponents = config.opponents;

  if (numOpponents <= 0) {
    // Raw strength: just average the hand ranks
    let totalRank = 0;
    for (let i = 0; i < config.runs; i++) {
      totalRank += simulateSingleRun(hand.cards, deck, rng, evaluator);
    }
    return {
      key: hand.key,
      averageRank: totalRank / config.runs,
      winPct: 0,
      tiePct: 0,
      runs: config.runs,
    };
  }

  // Equity simulation with opponents
  let wins = 0;
  let ties = 0;
  let totalRank = 0;

  for (let i = 0; i < config.runs; i++) {
    const result = simulateWithOpponents(hand.cards, deck, rng, evaluator, numOpponents);
    totalRank += result.rank;
    if (result.win === 1) wins++;
    else if (result.win === 0.5) ties++;
  }

  return {
    key: hand.key,
    averageRank: totalRank / config.runs,
    winPct: (wins / config.runs) * 100,
    tiePct: (ties / config.runs) * 100,
    runs: config.runs,
  };
};
