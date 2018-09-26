import { handInfo, verboseHandInfo, hiLowRank, NumberMap, singleRankFiveCardHandEvalFn, hiLowRankFiveCardHandEvalFn } from './interfaces';
/**low hands ato5 as well as hand on 6 and omaha optimization are not created at boot,
 * they have to be instantiated explicitly
 */
export declare const HASHES_OF_FIVE: Readonly<import("./interfaces").hashRanking>;
export declare const HASHES_OF_FIVE_ON_SEVEN: import("./interfaces").hashRankingSeven;
/**LOW Ato5 HASHES */
export declare const HASHES_OF_FIVE_LOW8: Readonly<import("./interfaces").hashRanking>;
export declare const HASHES_OF_FIVE_LOW9: import("./interfaces").hashRanking;
export declare const HASEHS_OF_FIVE_LOW_Ato5: import("./interfaces").hashRanking;
/**LOW Ato5 on 7 cards HASHES */
export declare const HASHES_OF_SEVEN_LOW8: Readonly<import("./interfaces").hashRanking>;
export declare const HASHES_OF_SEVEN_LOW9: Readonly<import("./interfaces").hashRanking>;
export declare const HASEHS_OF_SEVEN_LOW_Ato5: Readonly<import("./interfaces").hashRanking>;
/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
export declare const handOfFiveEval: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfFiveEvalHiLow: (LOW_RANK_HASH: NumberMap, c1: number, c2: number, c3: number, c4: number, c5: number) => hiLowRank;
/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfFiveEvalHiLow8: hiLowRankFiveCardHandEvalFn;
/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfFiveEvalHiLow9: hiLowRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
export declare const handOfFiveEvalLow_Ato5: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export declare const handOfFiveEvalLowBall27: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
export declare const handOfFiveEvalIndexed: singleRankFiveCardHandEvalFn;
/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const bfBestOfFiveOnX: (hand: number[]) => number;
/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const bfBestOfFiveOnXindexed: (hand: number[]) => number;
/** @function bfBestOfFiveFromTwoSets
*
* @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
* @param {Array:Number[]} handSetB array of sizeB cards representing board cards
* @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
* @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
export declare const bfBestOfFiveFromTwoSets: (handSetA: number[], handSetB: number[], nA: number, nB: number, evalFn?: Function) => number;
export declare const bfBestOfFiveFromTwoSetsHiLow: (handSetA: number[], handSetB: number[], nA: number, nB: number, evalFn: Function) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow8: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow9: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow_Ato5: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLowBall27: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export declare const handOfSevenEval: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEvalLowBall27
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export declare const handOfSevenEvalLowBall27: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalHiLow: (LOW_RANK_HASH: NumberMap, c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
/** @function handOfSevenEvalLow_Ato5
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for Ato5 rules
 */
export declare const handOfSevenEvalLow_Ato5: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalLow_Ato5Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalHiLow8: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalHiLow8Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalHiLow9: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfSevenEvalHiLow9Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
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
/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
export declare const handOfSevenEval_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
export declare const handOfSevenEvalIndexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/** @function getHandInfo
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export declare const getHandInfo: (rank: number) => handInfo;
