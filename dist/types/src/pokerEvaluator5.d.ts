import { handInfo, hiLowRank, NumberMap, singleRankFiveCardHandEvalFn, hiLowRankFiveCardHandEvalFn, hashRanking, verboseHandInfo } from './interfaces';
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
export declare const handOfFiveEvalHiLow8Indexed: hiLowRankFiveCardHandEvalFn;
/** @function handOfFiveEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export declare const handOfFiveEvalHiLow9: hiLowRankFiveCardHandEvalFn;
export declare const handOfFiveEvalHiLow9Indexed: hiLowRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
export declare const handOfFiveEvalLow_Ato5: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLow_Ato5Indexed
 *
 * @param {Number} c1...c5 cards index in standard deck 52
 * @returns {number} hand ranking for Ato5 rules
 */
export declare const handOfFiveEvalLow_Ato5Indexed: singleRankFiveCardHandEvalFn;
export declare const handOfFiveEvalLow_Ato6: singleRankFiveCardHandEvalFn;
export declare const handOfFiveEvalLow_Ato6Indexed: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export declare const handOfFiveEvalLowBall27: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalLowBall27Indexed
 *
 * @param {Number} c1...c5 cards hash from 0-51
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export declare const handOfFiveEvalLowBall27Indexed: singleRankFiveCardHandEvalFn;
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
export declare const handOfFiveEvalIndexed: singleRankFiveCardHandEvalFn;
/** @function getHandInfo
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
export declare const getHandInfo: (rank: number, HASHES?: hashRanking, INVERTED?: boolean) => handInfo;
/** @function getHandInfo27
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export declare const getHandInfo27: (rank: number) => handInfo;
/** @function getHandInfoLow8
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export declare const getHandInfoLow8: (rank: number) => handInfo;
/** @function getHandInfoLow9
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export declare const getHandInfoLow9: (rank: number) => handInfo;
/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export declare const getHandInfoAto5: (rank: number) => handInfo;
/** @function getHandInfoAto6
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
export declare const getHandInfoAto6: (rank: number) => handInfo;
/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
*
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @param {Function} evalFn evaluator defaults to hand of 5 high only
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
export declare const bfBestOfFiveOnX: (hand: number[], evalFn?: Function) => number;
/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} hand array of 6 or more cards making up an hand
 * @param {Function} evalFn evaluator defaults to hand of 5 high only
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const bfBestOfFiveOnXindexed: (hand: number[], evalFn?: Function) => number;
/** @function getHandInfo5onX
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
export declare const getHandInfo5onX: (hand: number[], gameType: string) => verboseHandInfo;
export declare const bestFiveOnXHiLowIndexed: (evalFn: Function, hand: number[]) => hiLowRank;
