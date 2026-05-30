import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { StreetHandResultHiLo, StreetStatsHiLo } from './types.js';
import { handOfFiveEvalHiLow8Indexed } from '../../../src/pokerEvaluator5.js';
import { hiLowRank } from '../../../src/interfaces.js';

// Helper to get combinations
function combinations2of4(cards: number[]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      result.push([cards[i]!, cards[j]!]);
    }
  }
  return result;
}

function combinations3ofN(cards: number[]): number[][] {
  const n = cards.length;
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        result.push([cards[i]!, cards[j]!, cards[k]!]);
      }
    }
  }
  return result;
}

function bestOmahaHiLoHand(holeCards: number[], board: number[]): hiLowRank {
  let bestHi = -Infinity;
  let bestLo = -1;

  const holeCombos = combinations2of4(holeCards);
  const boardCombos = combinations3ofN(board);

  for (const hc of holeCombos) {
    for (const bc of boardCombos) {
      const score = handOfFiveEvalHiLow8Indexed(hc[0]!, hc[1]!, bc[0]!, bc[1]!, bc[2]!);
      if (score.hi > bestHi) bestHi = score.hi;
      if (score.low !== -1) {
        if (bestLo === -1 || score.low > bestLo) {
          bestLo = score.low;
        }
      }
    }
  }
  return { hi: bestHi, low: bestLo };
}

interface StreetRunStats {
  winHi: number;
  winLo: number;
  scoop: boolean;
  ourHiRank: number;
  ourLoRank: number;
}

function evaluateStreet(ourHoleCards: number[], oppHands: number[][], board: number[]): StreetRunStats {
  const ourScore = bestOmahaHiLoHand(ourHoleCards, board);

  let bestOpponentHi = -1;
  let bestOpponentLo = -1;
  let opponentLoPossible = false;

  for (const opp of oppHands) {
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

  const equityHi = winHi * (isLoPossibleForAnyone ? 0.5 : 1.0);
  const equityLo = isLoPossibleForAnyone ? (winLo * 0.5) : 0;
  const totalEquity = equityHi + equityLo;

  return {
    winHi,
    winLo,
    scoop: totalEquity === 1.0,
    ourHiRank: ourScore.hi,
    ourLoRank: ourScore.low,
  };
}

function aggregateStats(runs: number, stats: StreetRunStats[]): StreetStatsHiLo {
  let totalWinHi = 0;
  let totalWinLo = 0;
  let totalScoop = 0;
  let totalHiRank = 0;
  let totalLoRank = 0;
  let validLoRuns = 0;

  for (const s of stats) {
    totalWinHi += s.winHi;
    totalWinLo += s.winLo;
    if (s.scoop) totalScoop++;
    totalHiRank += s.ourHiRank;
    if (s.ourLoRank !== -1) {
      totalLoRank += s.ourLoRank;
      validLoRuns++;
    }
  }

  return {
    winHiPct: (totalWinHi / runs) * 100,
    winLoPct: (totalWinLo / runs) * 100,
    scoopPct: (totalScoop / runs) * 100,
    averageHighRank: totalHiRank / runs,
    averageLowRank: validLoRuns > 0 ? totalLoRank / validLoRuns : undefined,
  };
}

export const analyzeOmahaHiLoHandStreets = (
  hand: HandGroup,
  runs: number,
  opponents: number,
  seed?: number
): StreetHandResultHiLo => {
  const rng = new SeedableRNG(seed ?? Date.now());
  const deck = makeDeck(hand.cards);

  const actualOpponents = opponents > 0 ? opponents : 1; // Default to 1 opponent for scoop/win metrics

  const flopStats: StreetRunStats[] = [];
  const turnStats: StreetRunStats[] = [];
  const riverStats: StreetRunStats[] = [];

  for (let i = 0; i < runs; i++) {
    const d = [...deck];
    for (let j = d.length - 1; j > 0; j--) {
      const k = rng.nextInt(j + 1);
      [d[j], d[k]] = [d[k]!, d[j]!];
    }

    const totalNeeded = actualOpponents * 4 + 5;
    const dealt = d.slice(0, totalNeeded);

    const opponentHands: number[][] = [];
    for (let j = 0; j < actualOpponents; j++) {
      opponentHands.push([dealt[j * 4]!, dealt[j * 4 + 1]!, dealt[j * 4 + 2]!, dealt[j * 4 + 3]!]);
    }

    const board = dealt.slice(actualOpponents * 4, actualOpponents * 4 + 5);

    flopStats.push(evaluateStreet(hand.cards, opponentHands, board.slice(0, 3)));
    turnStats.push(evaluateStreet(hand.cards, opponentHands, board.slice(0, 4)));
    riverStats.push(evaluateStreet(hand.cards, opponentHands, board.slice(0, 5)));
  }

  return {
    hand: hand.key,
    flop: aggregateStats(runs, flopStats),
    turn: aggregateStats(runs, turnStats),
    river: aggregateStats(runs, riverStats),
  };
};
