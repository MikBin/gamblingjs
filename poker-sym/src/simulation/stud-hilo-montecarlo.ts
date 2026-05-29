import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { HandStrengthResult, SimulationConfig } from './types.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { Low8Evaluator } from '../../../src/core/LowEvaluator.js';

export const bestStudLow = (cards: number[], evaluator: Low8Evaluator): number => {
  if (cards.length < 5) return -1;
  try {
    const res = evaluator.evaluate(cards);
    return res > 0 ? res : -1;
  } catch {
    return -1; // Return -1 if it doesn't qualify for Low 8 or fails
  }
};

const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  highEvaluator: HighEvaluator,
  lowEvaluator: Low8Evaluator,
): { highRank: number; lowRank: number } => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards for the player
  const playerRemaining = d.slice(0, 4);
  const playerFullHand = [...holeCards, ...playerRemaining];

  let highRank = 0;
  try {
    highRank = highEvaluator.evaluate(playerFullHand);
  } catch (e) {
    highRank = 0;
  }
  const lowRank = bestStudLow(playerFullHand, lowEvaluator);

  return { highRank, lowRank };
};

const simulateWithOpponents = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  highEvaluator: HighEvaluator,
  lowEvaluator: Low8Evaluator,
  numOpponents: number,
): { equity: number; scoop: number; highWin: number; lowWin: number; highRank: number } => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Max 6 opponents for an 7-handed game (3 hole + 4 player cards = 7, 7 * 6 opponents = 42. Total 49. Deck has 49 left)
  // If > 6 opponents, we will just use the available cards. A real stud game might use community card for 7th st, but for sim purposes, limit max to 6.
  const actualOpponents = Math.min(numOpponents, 6);
  const totalNeeded = 4 + (actualOpponents * 7);
  const dealt = d.slice(0, totalNeeded);

  const playerRemaining = dealt.slice(0, 4);
  const playerFullHand = [...holeCards, ...playerRemaining];

  let ourHigh = 0;
  try {
     ourHigh = highEvaluator.evaluate(playerFullHand);
  } catch (e) {
     ourHigh = 0;
  }
  const ourLow = bestStudLow(playerFullHand, lowEvaluator);

  const oppHands: number[][] = [];
  let offset = 4;
  for (let i = 0; i < actualOpponents; i++) {
    oppHands.push(dealt.slice(offset, offset + 7));
    offset += 7;
  }

  let bestOppHigh = -1;
  let bestOppLow = -1; // -1 means no low qualified

  let highTies = 0;
  let lowTies = 0;

  for (const opp of oppHands) {
    if (opp.length < 7) continue;

    let oppHigh = 0;
    try {
        oppHigh = highEvaluator.evaluate(opp);
    } catch {
        oppHigh = 0;
    }

    if (oppHigh > bestOppHigh) {
      bestOppHigh = oppHigh;
      highTies = 1;
    } else if (oppHigh === bestOppHigh && oppHigh > -1) {
      highTies++;
    }

    const oppLow = bestStudLow(opp, lowEvaluator);
    if (oppLow > bestOppLow) {
      bestOppLow = oppLow;
      lowTies = 1;
    } else if (oppLow === bestOppLow && oppLow >= 0) {
      lowTies++;
    }
  }

  let highWinShare = 0;
  if (ourHigh > bestOppHigh) {
    highWinShare = 1;
  } else if (ourHigh === bestOppHigh) {
    highWinShare = 1 / (highTies + 1);
  }

  let lowWinShare = 0;
  const anyLowQualifies = ourLow >= 0 || bestOppLow >= 0;

  if (anyLowQualifies) {
    if (ourLow > bestOppLow) {
      lowWinShare = 1;
    } else if (ourLow === bestOppLow && ourLow >= 0) {
      lowWinShare = 1 / (lowTies + 1);
    }
  }

  let equity = 0;
  if (anyLowQualifies) {
    equity = (highWinShare * 0.5) + (lowWinShare * 0.5);
  } else {
    // If no low qualifies, high takes the entire pot.
    equity = highWinShare;
  }

  const scoop = (highWinShare === 1 && (!anyLowQualifies || lowWinShare === 1)) ? 1 : 0;

  return { equity, scoop, highWin: highWinShare, lowWin: lowWinShare, highRank: ourHigh };
};

export const simulateStudHiLoHand = (
  hand: HandGroup,
  config: SimulationConfig,
  highEvaluator: HighEvaluator,
  lowEvaluator: Low8Evaluator,
): HandStrengthResult => {
  const rng = new SeedableRNG(config.seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  // Stud deck logic: player has 3 cards. Max players that can receive 7 distinct cards = Math.floor(52 / 7) = 7.
  // 1 player + 6 opponents = 7 total.
  let numOpponents = config.opponents;
  if (numOpponents > 6) {
    numOpponents = 6;
  }

  if (numOpponents <= 0) {
    let totalRank = 0;
    let validRuns = 0;
    for (let i = 0; i < config.runs; i++) {
      const { highRank } = simulateSingleRun(hand.cards, deck, rng, highEvaluator, lowEvaluator);
      if (highRank > 0) {
        totalRank += highRank;
        validRuns++;
      }
    }
    return {
      key: hand.key,
      averageRank: validRuns > 0 ? totalRank / validRuns : 0,
      winPct: 0,
      tiePct: 0,
      runs: config.runs,
      equity: 0,
      highWinPct: 0,
      lowWinPct: 0,
      scoopPct: 0,
    };
  }

  let totalEquity = 0;
  let totalScoop = 0;
  let totalHighWins = 0;
  let totalLowWins = 0;
  let totalHighRank = 0;
  let validRuns = 0;
  let totalTies = 0;

  for (let i = 0; i < config.runs; i++) {
    const r = simulateWithOpponents(hand.cards, deck, rng, highEvaluator, lowEvaluator, numOpponents);
    if (r.highRank > 0 || r.equity >= 0) {
       totalEquity += r.equity;
       totalScoop += r.scoop;
       totalHighWins += r.highWin;
       totalLowWins += r.lowWin;
       totalHighRank += r.highRank;
       if (r.equity > 0 && r.equity < 1 && r.highWin < 1 && r.lowWin < 1) {
          totalTies++;
       }
       validRuns++;
    }
  }

  if (validRuns === 0) validRuns = 1;

  // To maintain generic sorting compatability, we'll set winPct = equity * 100
  return {
    key: hand.key,
    averageRank: totalHighRank / validRuns,
    winPct: (totalEquity / validRuns) * 100, // Equivalent to equity
    tiePct: (totalTies / validRuns) * 100, // True tie percentage approximation
    runs: config.runs,
    equity: (totalEquity / validRuns) * 100,
    highWinPct: (totalHighWins / validRuns) * 100,
    lowWinPct: (totalLowWins / validRuns) * 100,
    scoopPct: (totalScoop / validRuns) * 100,
  };
};
