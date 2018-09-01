import * as kombinatoricsJs from 'kombinatoricsjs';
import { createRankOfFiveHashes, createRankOf5On7Hashes } from './hashesCreator';
import { fullCardsDeckHash_5, fullCardsDeckHash_7, FLUSH_MASK } from './constants';

export const HASHES_OF_FIVE = createRankOfFiveHashes();
const FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
const HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
const FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES;

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
      ((c1 & FLUSH_MASK) == flush_check_key) * c1 +
      ((c2 & FLUSH_MASK) == flush_check_key) * c2 +
      //@ts-ignore
      ((c3 & FLUSH_MASK) == flush_check_key) * c3 +
      ((c4 & FLUSH_MASK) == flush_check_key) * c4 +
      //@ts-ignore
      ((c5 & FLUSH_MASK) == flush_check_key) * c5 +
      ((c6 & FLUSH_MASK) == flush_check_key) * c6 +
      ((c7 & FLUSH_MASK) == flush_check_key) * c7;

    handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SEVEN[keySum >>> 9];
  }

  return handRank;
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

/**@TODO getHandInfo(rank:number) */
