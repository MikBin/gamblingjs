
import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  bfBestOfFiveOnXindexed,
  handOfFiveEval,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalHiLow8Indexed,
  bestFiveOnXGeneric
} from './pokerEvaluator5'

import {
  fullCardsDeckHash_5,
  FLUSH_MASK,
  HIGH_MAX_RANK
} from './constants';
import {
  handInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  hashRanking
} from './interfaces';

/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalIndexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand);
};

/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalLowBall27Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLowBall27Indexed);
};

/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalAto5Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number
): number => {
  return bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], handOfFiveEvalLow_Ato5Indexed);
};

/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalAto6Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number
): number => {
  return bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], handOfFiveEvalLow_Ato6Indexed);
};

/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow8Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number
): hiLowRank => {
  let res = { hi: -1, low: -1 };

  let all = kombinatoricsJs
    .combinations([c1, c2, c3, c4, c5, c6], 5)
    //@ts-ignore
    .map(hand => handOfFiveEvalHiLow8Indexed(...hand));
  all.forEach((R, i) => {
    R.hi > res.hi ? (res.hi = R.hi) : null;
    R.low > res.low ? (res.low = R.low) : null;
  });

  return res;
};

/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow9Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number
): hiLowRank => {
  let res = { hi: -1, low: -1 };
  //@ts-ignore
  let all = kombinatoricsJs
    .combinations([c1, c2, c3, c4, c5, c6], 5)
    //@ts-ignore
    .map(hand => handOfFiveEvalHiLow9Indexed(...hand));
  all.forEach((R, i) => {
    R.hi > res.hi ? (res.hi = R.hi) : null;
    R.low > res.low ? (res.low = R.low) : null;
  });
  return res;
};
