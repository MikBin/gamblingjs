import { handOfFiveEvalHiLow8Indexed } from '../../../src/pokerEvaluator5.js';
import { handOfSixEvalHiLow8Indexed } from '../../../src/pokerEvaluator6.js';
import { handOfSevenEvalHiLow8Indexed } from '../../../src/pokerEvaluator7.js';
import { SeedableRNG } from '../utils/rng.js';
import { makeDeck } from '../utils/deck.js';
import { HandGroup } from '../hands/types.js';
import { StudHiLoStreetHandResult, StudHiLoStreetStats } from './types.js';

export interface StudHiLoStreetRunResult {
  fifth: { highWinShare: number; lowWinShare: number; scoop: number; lowQualifies: boolean; equity: number };
  sixth: { highWinShare: number; lowWinShare: number; scoop: number; lowQualifies: boolean; equity: number };
  seventh: { highWinShare: number; lowWinShare: number; scoop: number; lowQualifies: boolean; equity: number };
}

const evaluateStudHiLoStreet = (
  heroCards: number[],
  opponentsCards: number[][],
  streetCardsCount: number,
): { highWinShare: number; lowWinShare: number; scoop: number; lowQualifies: boolean; equity: number } => {
  const evalFn =
    streetCardsCount === 5
      ? handOfFiveEvalHiLow8Indexed
      : streetCardsCount === 6
        ? handOfSixEvalHiLow8Indexed
        : handOfSevenEvalHiLow8Indexed;

  const heroResult = evalFn(
    heroCards[0]!,
    heroCards[1]!,
    heroCards[2]!,
    heroCards[3]!,
    heroCards[4]!,
    streetCardsCount >= 6 ? heroCards[5]! : 0,
    streetCardsCount >= 7 ? heroCards[6]! : 0,
  );

  let bestOppHigh = -1;
  let bestOppLow = -1;
  let highTies = 0;
  let lowTies = 0;

  for (const opp of opponentsCards) {
    const oppResult = evalFn(
      opp[0]!,
      opp[1]!,
      opp[2]!,
      opp[3]!,
      opp[4]!,
      streetCardsCount >= 6 ? opp[5]! : 0,
      streetCardsCount >= 7 ? opp[6]! : 0,
    );

    if (oppResult.hi > bestOppHigh) {
      bestOppHigh = oppResult.hi;
      highTies = 1;
    } else if (oppResult.hi === bestOppHigh && oppResult.hi > -1) {
      highTies++;
    }

    if (oppResult.low > bestOppLow) {
      bestOppLow = oppResult.low;
      lowTies = 1;
    } else if (oppResult.low === bestOppLow && oppResult.low >= 0) {
      lowTies++;
    }
  }

  let highWinShare = 0;
  if (heroResult.hi > bestOppHigh) {
    highWinShare = 1;
  } else if (heroResult.hi === bestOppHigh) {
    highWinShare = 1 / (highTies + 1);
  }

  let lowWinShare = 0;
  const anyLowQualifies = heroResult.low >= 0 || bestOppLow >= 0;
  if (anyLowQualifies) {
    if (heroResult.low > bestOppLow) {
      lowWinShare = 1;
    } else if (heroResult.low === bestOppLow && heroResult.low >= 0) {
      lowWinShare = 1 / (lowTies + 1);
    }
  }

  const scoop = highWinShare === 1 && (!anyLowQualifies || lowWinShare === 1) ? 1 : 0;

  let equity = 0;
  if (anyLowQualifies) {
    equity = highWinShare * 0.5 + lowWinShare * 0.5;
  } else {
    equity = highWinShare;
  }

  return { highWinShare, lowWinShare, scoop, lowQualifies: heroResult.low >= 0, equity };
};

export const simulateStudHiLoStreetRun = (
  holeCards: number[],
  deck: number[],
  rng: SeedableRNG,
  numOpponents: number,
): StudHiLoStreetRunResult => {
  const actualOpponents = Math.min(numOpponents, 6);
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [d[i], d[j]] = [d[j]!, d[i]!];
  }

  const totalNeeded = 4 + actualOpponents * 7;
  const dealt = d.slice(0, totalNeeded);
  const heroRemaining = dealt.slice(0, 4);
  const heroFull = [...holeCards, ...heroRemaining];

  const opponentsCards: number[][] = [];
  let offset = 4;
  for (let i = 0; i < actualOpponents; i++) {
    opponentsCards.push(dealt.slice(offset, offset + 7));
    offset += 7;
  }

  return {
    fifth: evaluateStudHiLoStreet(
      heroFull.slice(0, 5),
      opponentsCards.map((o) => o.slice(0, 5)),
      5,
    ),
    sixth: evaluateStudHiLoStreet(
      heroFull.slice(0, 6),
      opponentsCards.map((o) => o.slice(0, 6)),
      6,
    ),
    seventh: evaluateStudHiLoStreet(heroFull, opponentsCards, 7),
  };
};

const aggregateStreetStats = (
  runs: number,
  samples: Array<{ highWinShare: number; lowWinShare: number; scoop: number; lowQualifies: boolean; equity: number }>,
): StudHiLoStreetStats => {
  let equity = 0;
  let highWin = 0;
  let lowWin = 0;
  let scoop = 0;
  let lowQual = 0;

  for (const s of samples) {
    equity += s.equity;
    highWin += s.highWinShare;
    lowWin += s.lowWinShare;
    scoop += s.scoop;
    if (s.lowQualifies) lowQual++;
  }

  return {
    equity: (equity / runs) * 100,
    highWinPct: (highWin / runs) * 100,
    lowWinPct: (lowWin / runs) * 100,
    scoopPct: (scoop / runs) * 100,
    lowQualifyPct: (lowQual / runs) * 100,
  };
};

export const analyzeStudHiLoHandStreets = (
  hand: HandGroup,
  runs: number,
  opponents: number,
  seed?: number,
): StudHiLoStreetHandResult => {
  const rng = new SeedableRNG(seed ?? Date.now());
  const deck = makeDeck(hand.cards);
  const numOpponents = opponents > 0 ? Math.min(opponents, 6) : 1;

  const fifthSamples: StudHiLoStreetRunResult['fifth'][] = [];
  const sixthSamples: StudHiLoStreetRunResult['sixth'][] = [];
  const seventhSamples: StudHiLoStreetRunResult['seventh'][] = [];

  for (let i = 0; i < runs; i++) {
    const res = simulateStudHiLoStreetRun(hand.cards, deck, rng, numOpponents);
    fifthSamples.push(res.fifth);
    sixthSamples.push(res.sixth);
    seventhSamples.push(res.seventh);
  }

  return {
    hand: hand.key,
    fifth: aggregateStreetStats(runs, fifthSamples),
    sixth: aggregateStreetStats(runs, sixthSamples),
    seventh: aggregateStreetStats(runs, seventhSamples),
  };
};
