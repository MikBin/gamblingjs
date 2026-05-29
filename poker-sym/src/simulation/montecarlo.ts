import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { HandStrengthResult, SimulationConfig } from './types.js';

/**
 * Texas Hold'em hand evaluator function type.
 * Takes 7 card indices (0-51) and returns a hand rank number.
 */
export type HoldemEvaluator = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;

/**
 * Simulate a single hand using Monte Carlo method.
 *
 * Given a 2-card starting hand, randomly deals 5 community cards from the
 * remaining deck and evaluates the 7-card hand using the provided evaluator.
 *
 * Returns the hand rank for that single run.
 */
const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: HoldemEvaluator,
): number => {
  // Shuffle remaining deck
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Deal 5 community cards
  const board = d.slice(0, 5);

  // Evaluate the 7-card hand (2 hole + 5 community)
  return evaluator(
    holeCards[0]!,
    holeCards[1]!,
    board[0]!,
    board[1]!,
    board[2]!,
    board[3]!,
    board[4]!,
  );
};

/**
 * Simulate a hand with opponents.
 *
 * Deals opponent hands and community cards, evaluates all hands,
 * and determines if our hand wins.
 *
 * Returns { win: 1 if win, 0.5 if tie, 0 if loss; rank: our hand rank }.
 */
const simulateWithOpponents = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: HoldemEvaluator,
  numOpponents: number,
): { win: number; rank: number } => {
  // Shuffle remaining deck
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Deal opponent hands (2 cards each) then 5 community cards
  const totalNeeded = numOpponents * 2 + 5;
  const dealt = d.slice(0, totalNeeded);

  // Extract opponent hands
  const opponentHands: number[][] = [];
  for (let i = 0; i < numOpponents; i++) {
    opponentHands.push([dealt[i * 2]!, dealt[i * 2 + 1]!]);
  }

  // Community cards start after opponent hands
  const board = dealt.slice(numOpponents * 2, numOpponents * 2 + 5);

  // Evaluate our hand
  const ourRank = evaluator(
    holeCards[0]!,
    holeCards[1]!,
    board[0]!,
    board[1]!,
    board[2]!,
    board[3]!,
    board[4]!,
  );

  // Evaluate opponent hands
  let bestOpponentRank = -1;
  for (const opp of opponentHands) {
    const oppRank = evaluator(
      opp[0]!,
      opp[1]!,
      board[0]!,
      board[1]!,
      board[2]!,
      board[3]!,
      board[4]!,
    );
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
 * Run Monte Carlo simulation for a single starting hand.
 *
 * @param hand - The canonical hand group to evaluate
 * @param config - Simulation configuration
 * @param evaluator - The 7-card hand evaluator function
 * @returns The strength result for this hand
 */
export const simulateHand = (
  hand: HandGroup,
  config: SimulationConfig,
  evaluator: HoldemEvaluator,
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