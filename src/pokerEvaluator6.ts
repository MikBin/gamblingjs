
import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  bfBestOfFiveOnXindexed,
  handOfFiveEval,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalHiLow8Indexed,
  bestFiveOnXHiLowIndexed
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
export const handOfSixEvalAto5Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato5Indexed);
};

/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalAto6Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato6Indexed);
};

/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow8Indexed = (...hand: number[]): hiLowRank => {
  return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow8Indexed, hand);
};

/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow9Indexed = (...hand: number[]): hiLowRank => {
  return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow9Indexed, hand);
};

/** @TODO verbose versions (taking again the one from 5 cards hand) */
