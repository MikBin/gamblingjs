import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandStrengthResult, SimulationConfig } from './types.js';
import { HandGroup } from '../hands/types.js';
import { handOfFiveEvalHiLow8Indexed } from '../../../src/pokerEvaluator5.js';
import { hiLowRank } from '../../../src/interfaces.js';

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

/** Best Omaha Hi/Lo hand. */
function bestOmahaHiLoHand(holeCards: number[], board: number[]): hiLowRank {
  let bestHi = -Infinity;
  let bestLo = -1;

  const holeCombos = combinations2of4(holeCards);
  const boardCombos = combinations3of5(board);

  for (const hc of holeCombos) {
    for (const bc of boardCombos) {
      const score = handOfFiveEvalHiLow8Indexed(hc[0]!, hc[1]!, bc[0]!, bc[1]!, bc[2]!);
      if (score.hi > bestHi) bestHi = score.hi;
      if (score.low !== -1) {
        // For Low evaluators in gamblingjs, higher value = stronger low hand
        if (bestLo === -1 || score.low > bestLo) {
          bestLo = score.low;
        }
      }
    }
  }
  return { hi: bestHi, low: bestLo };
}

/**
 * Simulate a single raw strength run (no opponents).
 * Deals 5 community cards and finds the best 5-card combination.
 */
const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
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
  const score = bestOmahaHiLoHand(holeCards, board);

  // For raw strength, we can just use High equity or an average. Let's return High rank.
  return score.hi;
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
  numOpponents: number,
): { winHi: number; winLo: number; scoop: boolean; rank: number; lowRank: number } => {
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
  const ourScore = bestOmahaHiLoHand(holeCards, board);

  // Evaluate opponent hands
  let bestOpponentHi = -1;
  let bestOpponentLo = -1;
  let opponentLoPossible = false;

  for (const opp of opponentHands) {
    const oppScore = bestOmahaHiLoHand(opp, board);
    if (oppScore.hi > bestOpponentHi) bestOpponentHi = oppScore.hi;
    if (oppScore.low !== -1) {
      opponentLoPossible = true;
      if (oppScore.low > bestOpponentLo) bestOpponentLo = oppScore.low;
    }
  }

  let winHi = 0;
  let winLo = 0;
  const isLoPossibleForAnyone = ourScore.low !== -1 || opponentLoPossible;

  if (ourScore.hi > bestOpponentHi) winHi = 1;
  else if (ourScore.hi === bestOpponentHi) winHi = 0.5;

  if (isLoPossibleForAnyone) {
    if (ourScore.low !== -1) {
      if (ourScore.low > bestOpponentLo) winLo = 1;
      else if (ourScore.low === bestOpponentLo) winLo = 0.5;
    }
  }

  // Scoop condition: Win full pot
  // Case 1: No Low possible -> Win High
  // Case 2: Low possible -> Win High AND Win Low
  // Case 3: Win High and Tie Low (partial scoop, technically just win 3/4)
  // Let's define scoop as taking more than half the pot, or exactly full pot.
  // We'll define scoop as taking the ENTIRE pot (1.0 equity overall).
  const equityHi = winHi * (isLoPossibleForAnyone ? 0.5 : 1.0);
  const equityLo = isLoPossibleForAnyone ? (winLo * 0.5) : 0;
  const totalEquity = equityHi + equityLo;

  // We could just return the detailed wins
  return {
    winHi,
    winLo,
    scoop: totalEquity === 1.0,
    rank: ourScore.hi,
    lowRank: ourScore.low,
  };
};

/**
 * Simulate a single Omaha Hi/Lo hand.
 */
export const simulateOmahaHiLoHand = (
  hand: HandGroup,
  config: SimulationConfig,
): HandStrengthResult => {
  const rng = new SeedableRNG(config.seed ?? Date.now());
  const deck = makeDeck(hand.cards);
  const numOpponents = config.opponents;

  if (numOpponents <= 0) {
    // Raw strength: average the hand ranks (hi and lo separately)
    let totalRank = 0;
    let totalLowRank = 0;
    let validLowRuns = 0;
    for (let i = 0; i < config.runs; i++) {
      const d = [...deck];
      for (let j = d.length - 1; j > 0; j--) {
        const k = rng.nextInt(j + 1);
        [d[j], d[k]] = [d[k]!, d[j]!];
      }
      const board = d.slice(0, 5);
      const score = bestOmahaHiLoHand(hand.cards, board);
      totalRank += score.hi;
      if (score.low !== -1) {
        totalLowRank += score.low;
        validLowRuns++;
      }
    }
    return {
      key: hand.key,
      averageRank: totalRank / config.runs,
      averageLowRank: validLowRuns > 0 ? totalLowRank / validLowRuns : undefined,
      winPct: 0,
      tiePct: 0,
      winHiPct: 0,
      winLoPct: 0,
      scoopPct: 0,
      runs: config.runs,
    };
  }

  // Equity simulation with opponents
  let totalHiWins = 0;
  let totalLoWins = 0;
  let totalScoops = 0;
  let totalRank = 0;
  let totalLowRank = 0;
  let validLowRuns = 0;
  let overallWins = 0;
  let overallTies = 0;

  for (let i = 0; i < config.runs; i++) {
    const result = simulateWithOpponents(hand.cards, deck, rng, numOpponents);
    totalRank += result.rank;

    if (result.lowRank !== -1) {
      totalLowRank += result.lowRank;
      validLowRuns++;
    }

    totalHiWins += result.winHi;
    totalLoWins += result.winLo;
    if (result.scoop) totalScoops++;

    if (result.scoop) overallWins++;
    else if (result.winHi > 0 || result.winLo > 0) overallTies++;
  }

  return {
    key: hand.key,
    averageRank: totalRank / config.runs,
    averageLowRank: validLowRuns > 0 ? totalLowRank / validLowRuns : undefined,
    winPct: (overallWins / config.runs) * 100, // WinPct = Scoop pct for compatibility
    tiePct: (overallTies / config.runs) * 100, // TiePct = Partial win/tie
    winHiPct: (totalHiWins / config.runs) * 100,
    winLoPct: (totalLoWins / config.runs) * 100,
    scoopPct: (totalScoops / config.runs) * 100,
    runs: config.runs,
  };
};
