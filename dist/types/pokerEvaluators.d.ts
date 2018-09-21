import { handInfo, verboseHandInfo } from './interfaces';
export declare const HASHES_OF_FIVE: Readonly<import("./interfaces").hashRanking>;
export declare const HASHES_OF_FIVE_ON_SEVEN: import("./interfaces").hashRanking;
/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
export declare const handOfFiveEval: (c1: number, c2: number, c3: number, c4: number, c5: number) => number;
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
export declare const handOfFiveEvalIndexed: (c1: number, c2: number, c3: number, c4: number, c5: number) => number;
/** @function bfBestOfFiveOnX
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const bfBestOfFiveOnX: (hand: number[]) => number;
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export declare const handOfSevenEval: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalIndexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => number;
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSevenEvalIndexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export declare const handOfSevenEval_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
export declare const handOfSevenEvalIndexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/** @function getHandInfo
 *
 * @param {Number} hand rank
 * @returns {Number} object containing hand info
 */
export declare const getHandInfo: (rank: number) => handInfo;
