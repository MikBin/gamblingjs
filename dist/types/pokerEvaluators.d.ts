import { handInfo, verboseHandInfo, hiLowRank, NumberMap, singleRankFiveCardHandEvalFn, hiLowRankFiveCardHandEvalFn, hashRankingSeven, hashRanking } from './interfaces';
export declare const HASHES_OF_FIVE: Readonly<hashRanking>;
export declare const HASHES_OF_FIVE_ON_SEVEN: Readonly<hashRankingSeven>;
export declare const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27: Readonly<hashRankingSeven>;
export declare const HASHES_OF_FIVE_LOW8: Readonly<hashRanking>;
export declare const HASHES_OF_FIVE_LOW9: hashRanking;
export declare const HASEHS_OF_FIVE_LOW_Ato5: Readonly<hashRanking>;
export declare const HASHES_OF_SEVEN_LOW8: Readonly<hashRankingSeven>;
export declare const HASHES_OF_SEVEN_LOW9: Readonly<hashRankingSeven>;
export declare const HASEHS_OF_SEVEN_LOW_Ato5: Readonly<hashRankingSeven>;
export declare const HASHES_OF_SEVEN_LOW_Ato6: Readonly<hashRankingSeven>;
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
/**
 *
 *
 * END OF FIVE EVAL
 *
 */
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
/** @function bfBestOfFiveFromTwoSets  @TODO make verbose version
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
export declare const bfBestOfFiveFromTwoSetsHiLow8Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow9: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow9Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow_Ato5: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLow_Ato6: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLow_Ato6Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLowBall27: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLowBall27Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
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
/**
 *
 *
 * END OF SEVEN EVAL
 *
 */
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalIndexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => number;
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalLowBall27Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => number;
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalAto5Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => number;
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalAto6Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => number;
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalHiLow8Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => hiLowRank;
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const handOfSixEvalHiLow9Indexed: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number) => hiLowRank;
/**
 *
 * END OF SIX EVAL INDEXED
 *
 */
/** @function handOfSevenEval_Verbose  @TODO try to reuse
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
