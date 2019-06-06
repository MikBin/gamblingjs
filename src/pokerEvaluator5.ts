import {
  HASHES_OF_FIVE,
  FLUSH_CHECK_FIVE,
  HASH_RANK_FIVE,
  FLUSH_RANK_FIVE,
  HASH_RANK_FIVE_LOW8,
  HASH_RANK_FIVE_LOW9,
  HASH_RANK_FIVE_LOW_Ato5,
  HASH_RANK_FIVE_ATO6,
  FLUSH_RANK_FIVE_ATO6,
  HASHES_OF_FIVE_LOW_Ato5,
  HASHES_OF_FIVE_Ato6,
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9
} from './pokerHashes5';

import {
  fullCardsDeckHash_5,
  FLUSH_MASK,
  HIGH_MAX_RANK,
  gameType
} from './constants';
import {
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  hashRanking,
  gameTypesEvalFunction,
  verboseHandInfo,
  HiLowVerboseHandInfo,
  handInfo
} from './interfaces';

import { filterWinningCards, getFlushSuitFromIndex } from './routines'

import * as kombinatoricsJs from 'kombinatoricsjs'

/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
export const handOfFiveEval: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  let keySum: number = c1 + c2 + c3 + c4 + c5;
  let rankKey: number = keySum >>> 9;
  let flush_check_key: number = FLUSH_CHECK_FIVE[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    return FLUSH_RANK_FIVE[rankKey];
  }

  return HASH_RANK_FIVE[rankKey];
};

/** @function handOfFiveEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
export const handOfFiveEvalHiLow = (
  LOW_RANK_HASH: NumberMap,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  let keySum: number = c1 + c2 + c3 + c4 + c5;
  let rankKey: number = keySum >>> 9;
  let low = LOW_RANK_HASH[rankKey];
  let bothRank: hiLowRank = {
    hi: 0,
    low: isNaN(low) ? -1 : low
  };
  let flush_check_key: number = FLUSH_CHECK_FIVE[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    bothRank.hi = FLUSH_RANK_FIVE[rankKey];
  } else {
    bothRank.hi = HASH_RANK_FIVE[rankKey];
  }
  return bothRank;
};

/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfFiveEvalHiLow8: hiLowRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW8, c1, c2, c3, c4, c5);
};

export const handOfFiveEvalHiLow8Indexed: hiLowRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow8(
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5]
  );
};

/** @function handOfFiveEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfFiveEvalHiLow9: hiLowRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW9, c1, c2, c3, c4, c5);
};

export const handOfFiveEvalHiLow9Indexed: hiLowRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow9(
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5]
  );
};

/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
export const handOfFiveEvalLow_Ato5: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  let keySum: number = c1 + c2 + c3 + c4 + c5;
  let rankKey: number = keySum >>> 9;
  let rank = HASH_RANK_FIVE_LOW_Ato5[rankKey];
  return rank;
};

/** @function handOfFiveEvalLow_Ato5Indexed
 *
 * @param {Number} c1...c5 cards index in standard deck 52
 * @returns {number} hand ranking for Ato5 rules
 */
export const handOfFiveEvalLow_Ato5Indexed: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return handOfFiveEvalLow_Ato5(
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5]
  );
};

export const handOfFiveEvalLow_Ato6: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  let keySum: number = c1 + c2 + c3 + c4 + c5;
  let rankKey: number = keySum >>> 9;
  let flush_check_key: number = FLUSH_CHECK_FIVE[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    return FLUSH_RANK_FIVE_ATO6[rankKey];
  }

  return HASH_RANK_FIVE_ATO6[rankKey];
};

export const handOfFiveEvalLow_Ato6Indexed: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return handOfFiveEvalLow_Ato6(
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5]
  );
};

/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export const handOfFiveEvalLowBall27: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return HIGH_MAX_RANK - handOfFiveEval(c1, c2, c3, c4, c5);
};

/** @function handOfFiveEvalLowBall27Indexed
 *
 * @param {Number} c1...c5 cards hash from 0-51
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export const handOfFiveEvalLowBall27Indexed: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return HIGH_MAX_RANK - handOfFiveEvalIndexed(c1, c2, c3, c4, c5);
};

/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
export const handOfFiveEvalIndexed: singleRankFiveCardHandEvalFn = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return handOfFiveEval(
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5]
  );
};

/** @function getHandInfo
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
export const getHandInfo = (
  rank: number,
  HASHES: hashRanking = HASHES_OF_FIVE,
  INVERTED: boolean = false
): handInfo => {
  return HASHES.rankingInfos[INVERTED ? HIGH_MAX_RANK - rank : rank] || {
    hand: [],
    faces: '',
    handGroup: 'unqualified'
  };
};

/** @function getHandInfo27
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export const getHandInfo27 = (rank: number): handInfo => {
  return getHandInfo(rank, HASHES_OF_FIVE, true);
};

/** @function getHandInfoLow8
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export const getHandInfoLow8 = (rank: number): handInfo => {
  return getHandInfo(rank, HASHES_OF_FIVE_LOW8);
};

/** @function getHandInfoLow9
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export const getHandInfoLow9 = (rank: number): handInfo => {
  return getHandInfo(rank, HASHES_OF_FIVE_LOW9);
};

/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
export const getHandInfoAto5 = (rank: number): handInfo => {
  return getHandInfo(rank, HASHES_OF_FIVE_LOW_Ato5);
};

/** @function getHandInfoAto6
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
export const getHandInfoAto6 = (rank: number): handInfo => {
  return getHandInfo(rank, HASHES_OF_FIVE_Ato6);
};

/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
*
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @param {Function} evalFn evaluator defaults to hand of 5 high only
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
export const bfBestOfFiveOnX = (hand: number[], evalFn: Function = handOfFiveEval) => {
  //@ts-ignore
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => evalFn(...h)));
};

/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} hand array of 6 or more cards making up an hand
 * @param {Function} evalFn evaluator defaults to hand of 5 high only
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveOnXindexed = (
  hand: number[],
  evalFn: Function = handOfFiveEvalIndexed
) => {
  //@ts-ignore
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => evalFn(...h)));
};

export const bestFiveOnXHiLowIndexed = (
  evalFn: Function,
  hand: number[]
): hiLowRank => {
  let res = { hi: -1, low: -1 };
  //@ts-ignore
  let all = kombinatoricsJs
    .combinations(hand, 5)
    //@ts-ignore
    .map(hand => evalFn(...hand));
  all.forEach((R, i) => {
    R.hi > res.hi ? (res.hi = R.hi) : null;
    R.low > res.low ? (res.low = R.low) : null;
  });
  return res;
};

/**to be used in generic verbose eval function  */
const evaluatorByGameType: gameTypesEvalFunction = {
  "high": handOfFiveEvalIndexed,
  "low8": handOfFiveEvalHiLow8Indexed,
  "low9": handOfFiveEvalHiLow9Indexed,
  "Ato5": handOfFiveEvalLow_Ato5Indexed,
  "Ato6": handOfFiveEvalLow_Ato6Indexed,
  "2to7": handOfFiveEvalLowBall27Indexed
};

const evaluatorInfoByGameType: gameTypesEvalFunction = {
  "high": getHandInfo,
  "low8": getHandInfoLow8,
  "low9": getHandInfoLow9,
  "Ato5": getHandInfoAto5,
  "Ato6": getHandInfoAto6,
  "2to7": getHandInfo27
};

/** @function getHandInfo5onX  
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
export const getHandInfo5onX = (hand: number[], gameType: string): verboseHandInfo => {

  let combinations: number[][] = kombinatoricsJs.combinations(hand, 5);
  let evalFn: Function = evaluatorByGameType[gameType];
  let rank: number = Math.max(...combinations.map(H => evalFn(...H)));
  let handInfo: handInfo = evaluatorInfoByGameType[gameType](rank);
  let winningCards: number[] = filterWinningCards(hand, handInfo.hand);
  let flushSuit: string = handInfo.handGroup == "flush" ? getFlushSuitFromIndex(winningCards[0]) : "no flush";

  return {
    handRank: rank,
    hand: handInfo.hand,
    faces: handInfo.faces,
    handGroup: handInfo.handGroup,
    winningCards: winningCards,
    flushSuit: flushSuit
  }
};

/** @function getHandInfo5onXHiLow  
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
export const getHandInfo5onXHiLow = (hand: number[], gameType: string): HiLowVerboseHandInfo => {

  let evalFn: Function = evaluatorByGameType[gameType];
  let ranks: hiLowRank = bestFiveOnXHiLowIndexed(evalFn, hand);

  let handInfoLow: handInfo = evaluatorInfoByGameType[gameType](ranks.low);
  let winningCardsLow: number[] = filterWinningCards(hand, handInfoLow.hand);

  let handInfoHi: handInfo = evaluatorInfoByGameType["high"](ranks.hi);
  let winningCardsHi: number[] = filterWinningCards(hand, handInfoHi.hand);
  let flushSuit: string = handInfoHi.handGroup == "flush" ? getFlushSuitFromIndex(winningCardsHi[0]) : "no flush";

  return {
    hi: {
      handRank: ranks.hi,
      hand: handInfoHi.hand,
      faces: handInfoHi.faces,
      handGroup: handInfoHi.handGroup,
      winningCards: winningCardsHi,
      flushSuit: flushSuit
    },
    low: {
      handRank: ranks.low,
      hand: handInfoLow.hand,
      faces: handInfoLow.faces,
      handGroup: handInfoLow.handGroup,
      winningCards: winningCardsLow,
      flushSuit: "no flush"
    }
  }
};
