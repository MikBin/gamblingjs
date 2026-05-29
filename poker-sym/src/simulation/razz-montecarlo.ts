import { makeDeck, drawCopy } from '../utils/deck.js';
import { SeedableRNG } from '../utils/rng.js';
import { SimulationConfig, HandStrengthResult } from './types.js';
import { LowAto5Evaluator } from '../../../src/core/LowEvaluator.js';

// Pre-instantiate evaluator
const evaluator = new LowAto5Evaluator();

/**
 * Run a Monte Carlo simulation for a specific Razz starting hand.
 *
 * @param key Canonical hand key (e.g. 'A32')
 * @param heroCards The 3 representative cards for this hand
 * @param config Simulation configuration
 * @returns Simulation results including win/tie percentages
 */
export const simulateRazzHand = (
  key: string,
  heroCards: number[],
  config: SimulationConfig,
): HandStrengthResult => {
  const rng = config.seed !== undefined ? new SeedableRNG(config.seed) : Math.random;
  const deck = makeDeck(heroCards);
  const runs = config.runs;
  const opponents = config.opponents;
  const rawMode = opponents === 0;

  let totalRank = 0;
  let wins = 0;
  let ties = 0;

  for (let r = 0; r < runs; r++) {
    // Razz: Hero has 3 cards, gets 4 more.
    // Opponents get 7 random cards.
    // Total cards drawn = 4 + (7 * opponents)
    const cardsToDraw = 4 + 7 * opponents;
    const board = drawCopy(deck, cardsToDraw, rng);

    // Hero's full 7 cards
    const heroFull = [...heroCards, ...board.slice(0, 4)];

    // Evaluate hero (higher return value means better A-5 low hand)
    const heroScore = evaluator.evaluate(heroFull);
    totalRank += heroScore;

    if (!rawMode) {
      let bestOpponentScore = -1;

      // Evaluate opponents
      for (let o = 0; o < opponents; o++) {
        const oppStartIdx = 4 + o * 7;
        const oppCards = board.slice(oppStartIdx, oppStartIdx + 7);
        const oppScore = evaluator.evaluate(oppCards);

        if (oppScore > bestOpponentScore) {
          bestOpponentScore = oppScore;
        }
      }

      if (heroScore > bestOpponentScore) {
        wins++;
      } else if (heroScore === bestOpponentScore) {
        ties++;
      }
    }
  }

  return {
    key,
    averageRank: totalRank / runs,
    winPct: rawMode ? 0 : (wins / runs) * 100,
    tiePct: rawMode ? 0 : (ties / runs) * 100,
    runs,
  };
};
