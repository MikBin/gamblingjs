import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  bfBestOfFiveOnXindexed,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalHiLow8Indexed,
  bestFiveOnXHiLowIndexed,
  getHandInfo5onX,
} from './pokerEvaluator5';

import { fullCardsDeckHash_5, FLUSH_MASK, HIGH_MAX_RANK } from './constants';
import {
  handInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  hashRanking,
  verboseHandInfo,
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

/** @function handOfSixEvalAto5Indexed
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

/**
 *
 * VERBOSE
 *
 */

/** @function _handOfSixEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalIndexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'high');
};

/** @function _handOfSixEvalLowBall27Indexed_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalLowBall27Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, '2to7');
};

/** @function _handOfSixEvalAto5Indexed_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalAto5Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'Ato5');
};

/** @function _handOfSixEvalAto6Indexed_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalAto6Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'Ato6');
};

/** @function _handOfSixEvalLow8_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalLow8_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'low8');
};

/** @function _handOfSixEvalLow9_Verbose
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
 */
export const _handOfSixEvalLow9_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'low9');
};
