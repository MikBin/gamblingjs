import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  createRankOfFiveHashes,
  createRankOf5On7Hashes,
  createRankOf5AceToFive_Low8,
  createRankOf7AceToFive_Low,
  createRankOf5AceToFive_Low9,
  createRankOf5AceToFive_Full
} from './hashesCreator';
import {
  fullCardsDeckHash_5,
  fullCardsDeckHash_7,
  FLUSH_MASK,
  flushHashToName,
  cardHashToDescription_7,
  rankCards_low8,
  rankCards_low9,
  rankCards_low,
  HIGH_MAX_RANK
} from './constants';
import { handInfo, verboseHandInfo, hiLowRank, NumberMap } from './interfaces';

/**low hands ato5 as well as hand on 6 and omaha optimization are not created at boot,
 * they have to be instantiated explicitly
 */

export const HASHES_OF_FIVE = createRankOfFiveHashes();
const FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
const HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
const FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES;

/**LOW Ato5 HASHES */
export const HASHES_OF_FIVE_LOW8 = createRankOf5AceToFive_Low8();
const HASH_RANK_FIVE_LOW8 = HASHES_OF_FIVE_LOW8.HASHES;
export const HASHES_OF_FIVE_LOW9 = createRankOf5AceToFive_Low9();
const HASH_RANK_FIVE_LOW9 = HASHES_OF_FIVE_LOW9.HASHES;
export const HASEHS_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
const HASH_RANK_FIVE_LOW_Ato5 = HASEHS_OF_FIVE_LOW_Ato5.HASHES;
export const HASHES_OF_SEVEN_LOW8 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8);
export const HASHES_OF_SEVEN_LOW9 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9);
export const HASEHS_OF_SEVEN_LOW_Ato5 = createRankOf7AceToFive_Low(
  HASEHS_OF_FIVE_LOW_Ato5,
  rankCards_low
);

/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
export const handOfFiveEval = (
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

export const handOfFiveEvalHiLow8 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW8, c1, c2, c3, c4, c5);
};

export const handOfFiveEvalHiLow9 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): hiLowRank => {
  return handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW9, c1, c2, c3, c4, c5);
};
export const handOfFiveEvalLow_Ato5 = (
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

/**inverse ranking */
export const handOfFiveEvalLowBall27 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number => {
  return HIGH_MAX_RANK - handOfFiveEval(c1, c2, c3, c4, c5);
};

/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
export const handOfFiveEvalIndexed = (
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

/** @function bfBestOfFiveOnX
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveOnX = (hand: number[]) => {
  //@ts-ignore
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => handOfFiveEval(...h)));
};

/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export const handOfSevenEval = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): number => {
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  let handRank: number = 0;
  let flush_check_key: number = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    /**no full house or quads possible ---> can return flush_rank */

    //@ts-ignore
    let flushRankKey: number =
      //@ts-ignore
      ((c1 & FLUSH_MASK) == flush_check_key) * c1 +
      //@ts-ignore
      ((c2 & FLUSH_MASK) == flush_check_key) * c2 +
      //@ts-ignore
      ((c3 & FLUSH_MASK) == flush_check_key) * c3 +
      //@ts-ignore
      ((c4 & FLUSH_MASK) == flush_check_key) * c4 +
      //@ts-ignore
      ((c5 & FLUSH_MASK) == flush_check_key) * c5 +
      //@ts-ignore
      ((c6 & FLUSH_MASK) == flush_check_key) * c6 +
      //@ts-ignore
      ((c7 & FLUSH_MASK) == flush_check_key) * c7;

    handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SEVEN[keySum >>> 9];
  }

  return handRank;
};

/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalIndexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number
): number => {
  return bfBestOfFiveOnX([
    fullCardsDeckHash_5[c1],
    fullCardsDeckHash_5[c2],
    fullCardsDeckHash_5[c3],
    fullCardsDeckHash_5[c4],
    fullCardsDeckHash_5[c5],
    fullCardsDeckHash_5[c6]
  ]);
};

/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSevenEvalIndexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): number => {
  return handOfSevenEval(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
    fullCardsDeckHash_7[c7]
  );
};

/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export const handOfSevenEval_Verbose = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): verboseHandInfo => {
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  let handRank: number = 0;
  let flush_check_key: number = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
  let flushRankKey = 0;
  let handVector = [c1, c2, c3, c4, c5, c6, c7];
  if (flush_check_key >= 0) {
    /* istanbul ignore next */
    handVector = handVector.filter((c, i) => {
      return (c & FLUSH_MASK) == flush_check_key;
    });

    /* istanbul ignore next */
    handVector.forEach(c => (flushRankKey += c));
    /* istanbul ignore next */
    handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SEVEN[keySum >>> 9];
    flushRankKey = -1;
  }

  let wHand = HASHES_OF_FIVE.rankingInfos[handRank].hand;
  let handIndexes = handVector.map(c => cardHashToDescription_7[c]);
  return {
    handRank: handRank,
    hand: wHand,
    faces: HASHES_OF_FIVE.rankingInfos[handRank].faces,
    handGroup: HASHES_OF_FIVE.rankingInfos[handRank].handGroup,
    winningCards: handIndexes.filter(c => wHand.includes(<number>c % 13)),
    flushSuit: flushRankKey > -1 ? flushHashToName[flush_check_key] : 'no flush'
  };
};

/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
export const handOfSevenEvalIndexed_Verbose = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): verboseHandInfo => {
  return handOfSevenEval_Verbose(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
    fullCardsDeckHash_7[c7]
  );
};

/** @function getHandInfo
 *
 * @param {Number} hand rank
 * @returns {Number} object containing hand info
 */
export const getHandInfo = (rank: number): handInfo => {
  return HASHES_OF_FIVE.rankingInfos[rank];
};
