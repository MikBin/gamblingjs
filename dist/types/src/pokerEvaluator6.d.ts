import { hiLowRank } from './interfaces';
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalIndexed: (...hand: number[]) => number;
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalLowBall27Indexed: (...hand: number[]) => number;
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalAto5Indexed: (...hand: number[]) => number;
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalAto6Indexed: (...hand: number[]) => number;
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalHiLow8Indexed: (...hand: number[]) => hiLowRank;
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalHiLow9Indexed: (...hand: number[]) => hiLowRank;
/** @TODO verbose versions (taking again the one from 5 cards hand) */
