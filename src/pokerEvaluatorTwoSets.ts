// Fallback combinatorics functions for demo
const combinations = (arr: any[], k: number): any[][] => {
  if (k > arr.length || k <= 0) return [];
  if (k === arr.length) return [arr];
  if (k === 1) return arr.map(el => [el]);
  
  const result: any[][] = [];
  for (let i = 0; i <= arr.length - k; i++) {
    const head = arr[i];
    const tailCombinations = combinations(arr.slice(i + 1), k - 1);
    for (const tail of tailCombinations) {
      result.push([head, ...tail]);
    }
  }
  return result;
};

const crossProduct = (list: any[], k: number): any[][] => {
  if (k < 1) return [list];
  let crossProdList: any[][] = new Array(Math.pow(list.length, k));
  let l: number = crossProdList.length;
  let ln: number = list.length;

  for (let i: number = 0; i < l; ++i) {
    let tmpList: any[][] = [];
    let N: number = i;
    for (let j = k - 1; j >= 0; --j) {
      let digit: number = N % ln;
      N = Math.floor(N / ln);
      tmpList[j] = list[digit];
    }
    crossProdList[i] = tmpList;
  }
  return crossProdList;
};
// import * as kombinatoricsJs from './lib/kombinatoricsjs/src/kombinatoricsjs.js';

import { fullCardsDeckHash_5 } from './constants.js';
import {
  handInfo,
  verboseHandInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  MultiNumberMap,
  hashRankingSeven,
  hashRanking,
} from './interfaces.js';
import { handToCardsSymbols, filterWinningCards } from './routines.js';
import {
  handOfFiveEval,
  handOfFiveEvalHiLow8,
  handOfFiveEvalHiLow9,
  handOfFiveEvalLow_Ato5,
  handOfFiveEvalLow_Ato6,
  handOfFiveEvalLowBall27,
} from './pokerEvaluator5.js';

/** @function bfBestOfFiveFromTwoSets  @TODO make verbose version
 *
 * @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
 * @param {Array:Number[]} handSetB array of sizeB cards representing board cards
 * @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
 * @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveFromTwoSets = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
  evalFn: Function = handOfFiveEval,
): number => {
  if (nA + nB !== 5) {
    throw new RangeError('sum of nA+nB parameters MUST be 5');
  }
  const setACombinations: number[][] = combinations(handSetA, nA);
  const setBCombinations: number[][] = combinations(handSetB, nB);
  let maxRank: number = 0;
  setACombinations.forEach((handA, idxA) => {
    setBCombinations.forEach((handB, idxB) => {
      //@ts-ignore
      const rank = evalFn(...handA, ...handB);
      rank > maxRank ? (maxRank = rank) : null;
    });
  });

  return maxRank;
};

export const bfBestOfFiveFromTwoSetsHiLow = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
  evalFn: Function,
): hiLowRank => {
  if (nA + nB !== 5) {
    throw new RangeError('sum of nA+nB parameters MUST be 5');
  }
  const setACombinations: number[][] = combinations(handSetA, nA);
  const setBCombinations: number[][] = combinations(handSetB, nB);
  const maxRank: hiLowRank = { hi: 0, low: -1 };
  setACombinations.forEach((handA, idxA) => {
    setBCombinations.forEach((handB, idxB) => {
      //@ts-ignore
      const hlRank: hiLowRank = evalFn(...handA, ...handB);
      hlRank.hi > maxRank.hi ? (maxRank.hi = hlRank.hi) : null;
      hlRank.low > maxRank.low ? (maxRank.low = hlRank.low) : null;
    });
  });
  return maxRank;
};

export const bfBestOfFiveFromTwoSetsHiLow8 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, handOfFiveEvalHiLow8);
};

export const bfBestOfFiveFromTwoSetsHiLow8Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(
    handSetA.map((c) => fullCardsDeckHash_5[c]),
    handSetB.map((c) => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalHiLow8,
  );
};

export const bfBestOfFiveFromTwoSetsHiLow9 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, handOfFiveEvalHiLow9);
};

export const bfBestOfFiveFromTwoSetsHiLow9Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(
    handSetA.map((c) => fullCardsDeckHash_5[c]),
    handSetB.map((c) => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalHiLow9,
  );
};

export const bfBestOfFiveFromTwoSetsHiLow_Ato5 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, handOfFiveEvalLow_Ato5);
};

export const bfBestOfFiveFromTwoSetsLow_Ato6 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, handOfFiveEvalLow_Ato6);
};

export const bfBestOfFiveFromTwoSetsLow_Ato6Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(
    handSetA.map((c) => fullCardsDeckHash_5[c]),
    handSetB.map((c) => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalLow_Ato6,
  );
};

export const bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(
    handSetA.map((c) => fullCardsDeckHash_5[c]),
    handSetB.map((c) => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalLow_Ato5,
  );
};

export const bfBestOfFiveFromTwoSetsLowBall27 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, handOfFiveEvalLowBall27);
};

export const bfBestOfFiveFromTwoSetsLowBall27Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
): number => {
  return bfBestOfFiveFromTwoSets(
    handSetA.map((c) => fullCardsDeckHash_5[c]),
    handSetB.map((c) => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalLowBall27,
  );
};
