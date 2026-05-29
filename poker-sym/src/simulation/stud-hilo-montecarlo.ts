import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { HandStrengthResult, SimulationConfig } from './types.js';
import { handOfSevenEvalHiLow8Indexed } from '../../../src/pokerEvaluator7.js';
import { hiLowRank } from '../../../src/interfaces.js';

export type StudHiLoEvaluator = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
) => hiLowRank;

const simulateSingleRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: StudHiLoEvaluator,
): { highRank: number; lowRank: number } => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  // Draw 4 more cards for the player
  const board = d.slice(0, 4);
  const result = evaluator(
    holeCards[0]!,
    holeCards[1]!,
    holeCards[2]!,
    board[0]!,
    board[1]!,
    board[2]!,
    board[3]!,
  );

  return { highRank: result.hi, lowRank: result.low };
};

const simulateWithOpponents = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  evaluator: StudHiLoEvaluator,
  numOpponents: number,
): { equity: number; scoop: number; highWin: number; lowWin: number; highRank: number } => {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  const actualOpponents = Math.min(numOpponents, 6);
  const totalNeeded = 4 + (actualOpponents * 7);
  const dealt = d.slice(0, totalNeeded);

  const playerRemaining = dealt.slice(0, 4);
  const ourResult = evaluator(
    holeCards[0]!,
    holeCards[1]!,
    holeCards[2]!,
    playerRemaining[0]!,
    playerRemaining[1]!,
    playerRemaining[2]!,
    playerRemaining[3]!,
  );
  const ourHigh = ourResult.hi;
  const ourLow = ourResult.low;

  let bestOppHigh = -1;
  let bestOppLow = -1;
  let highTies = 0;
  let lowTies = 0;
  let offset = 4;

  for (let i = 0; i < actualOpponents; i++) {
    const oppResult = evaluator(
      d[offset]!,
      d[offset + 1]!,
      d[offset + 2]!,
      d[offset + 3]!,
      d[offset + 4]!,
      d[offset + 5]!,
      d[offset + 6]!,
    );
    const oppHigh = oppResult.hi;
    const oppLow = oppResult.low;

    if (oppHigh > bestOppHigh) {
      bestOppHigh = oppHigh;
      highTies = 1;
    } else if (oppHigh === bestOppHigh && oppHigh > -1) {
      highTies++;
    }

    if (oppLow > bestOppLow) {
      bestOppLow = oppLow;
      lowTies = 1;
    } else if (oppLow === bestOppLow && oppLow >= 0) {
      lowTies++;
    }
    offset += 7;
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
    equity = highWinShare;
  }

  const scoop = (highWinShare === 1 && (!anyLowQualifies || lowWinShare === 1)) ? 1 : 0;

  return { equity, scoop, highWin: highWinShare, lowWin: lowWinShare, highRank: ourHigh };
};

export const simulateStudHiLoHand = (
  hand: HandGroup,
  config: SimulationConfig,
  evaluator: StudHiLoEvaluator = handOfSevenEvalHiLow8Indexed,
): HandStrengthResult => {
  const rng = new SeedableRNG(config.seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  let numOpponents = config.opponents;
  if (numOpponents > 6) {
    numOpponents = 6;
  }

  if (numOpponents <= 0) {
    let totalRank = 0;
    let validRuns = 0;
    for (let i = 0; i < config.runs; i++) {
      const { highRank } = simulateSingleRun(hand.cards, deck, rng, evaluator);
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
    const r = simulateWithOpponents(hand.cards, deck, rng, evaluator, numOpponents);
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

  return {
    key: hand.key,
    averageRank: totalHighRank / validRuns,
    winPct: (totalEquity / validRuns) * 100,
    tiePct: (totalTies / validRuns) * 100,
    runs: config.runs,
    equity: (totalEquity / validRuns) * 100,
    highWinPct: (totalHighWins / validRuns) * 100,
    lowWinPct: (totalLowWins / validRuns) * 100,
    scoopPct: (totalScoop / validRuns) * 100,
  };
};