import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { HandStrengthResult, SimulationConfig } from './types.js';

export type StudEvaluator = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;

const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: StudEvaluator,
): number => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards to make a 7-card hand
  const board = d.slice(0, 4);

  return evaluator(
    holeCards[0]!,
    holeCards[1]!,
    holeCards[2]!,
    board[0]!,
    board[1]!,
    board[2]!,
    board[3]!,
  );
};

const simulateWithOpponents = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: StudEvaluator,
  numOpponents: number,
): { win: number; rank: number } => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards for the hero
  const heroBoard = d.slice(0, 4);
  const ourRank = evaluator(
    holeCards[0]!,
    holeCards[1]!,
    holeCards[2]!,
    heroBoard[0]!,
    heroBoard[1]!,
    heroBoard[2]!,
    heroBoard[3]!,
  );

  let bestOpponentRank = -1;
  let offset = 4;

  // Draw 7 cards for each opponent
  for (let i = 0; i < numOpponents; i++) {
    const oppRank = evaluator(
      d[offset]!,
      d[offset + 1]!,
      d[offset + 2]!,
      d[offset + 3]!,
      d[offset + 4]!,
      d[offset + 5]!,
      d[offset + 6]!,
    );
    if (oppRank > bestOpponentRank) {
      bestOpponentRank = oppRank;
    }
    offset += 7;
  }

  if (ourRank > bestOpponentRank) return { win: 1, rank: ourRank };
  if (ourRank === bestOpponentRank) return { win: 0.5, rank: ourRank };
  return { win: 0, rank: ourRank };
};

export const simulateStudHand = (
  hand: HandGroup,
  config: SimulationConfig,
  evaluator: StudEvaluator,
): HandStrengthResult => {
  const rng = new SeedableRNG(config.seed ?? Date.now());
  const deck = makeDeck(hand.cards);
  const numOpponents = config.opponents;
  if (numOpponents > 6) throw new Error('Maximum of 6 opponents allowed for 7-Card Stud');

  if (numOpponents <= 0) {
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
