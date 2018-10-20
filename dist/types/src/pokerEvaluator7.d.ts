import { verboseHandInfo, hiLowRank, NumberMap, hashRankingSeven, hashRanking } from './interfaces';
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
/** @function handOfSevenEvalLowBall27Indexed
 *
 * @param {Number} c1...c7 cards from 0-51
 * @returns {Number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export declare const handOfSevenEvalLowBall27Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEval_Ato6
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking for lowball Ato6
 */
export declare const handOfSevenEval_Ato6: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
/** @function handOfSevenEval_Ato6Indexed
 *
 * @param {Number} c1...c7 cards from deck 0-51
 * @returns {Number} hand ranking for lowball Ato6
 */
export declare const handOfSevenEval_Ato6Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
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
export declare const handOfSevenEval_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number, SEVEN_EVAL_HASH?: hashRankingSeven, FIVE_EVAL_HASH?: hashRanking, USE_MULTI_FLUSH_RANK?: boolean, INVERTED?: boolean) => verboseHandInfo;
export declare const handOfSevenEvalLowBall27Indexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
export declare const handOfSevenEvalAto6Indexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
export declare const handOfSevenEvalIndexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number, SEVEN_EVAL_HASH?: hashRankingSeven, FIVE_EVAL_HASH?: hashRanking, USE_MULTI_FLUSH_RANK?: boolean) => verboseHandInfo;
export declare const handOfSevenEvalAto5Indexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
export declare const handOfSevenEvalLow8Indexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
export declare const handOfSevenEvalLow9Indexed_Verbose: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => verboseHandInfo;
/**
 *
 * slow brute force versions
 *
 *
 *  */
/** @function _handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEvalIndexed: (...hand: number[]) => number;
/** @function _handOfSevenEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEvalLowBall27Indexed: (...hand: number[]) => number;
/** @function _handOfSevenEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEvalLow_Ato5Indexed: (...hand: number[]) => number;
/** @function _handOfSevenEvalAto6Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEval_Ato6Indexed: (...hand: number[]) => number;
/** @function _handOfSevenEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEvalHiLow8Indexed: (...hand: number[]) => hiLowRank;
/** @function _handOfSevenEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const _handOfSevenEvalHiLow9Indexed: (...hand: number[]) => hiLowRank;
