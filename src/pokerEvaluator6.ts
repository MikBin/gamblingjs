
import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  bfBestOfFiveOnXindexed,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalHiLow8Indexed,
  bestFiveOnXHiLowIndexed,
  getHandInfo5onX
} from './pokerEvaluator5'
import {
  HASHES_OF_FIVE_ON_SIX,
} from './pokerHashes7'
import {
  fullCardsDeckHash_7,
  FLUSH_MASK,
  HIGH_MAX_RANK
} from './constants';
import {
  handInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  hashRanking,
  verboseHandInfo
} from './interfaces';

/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSixEvalIndexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand);
};

export const handOfSixEval = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
  const FLUSH_CHECK_SIX = HASHES_OF_FIVE_ON_SIX.FLUSH_CHECK_KEYS;
  const FLUSH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.MULTI_FLUSH_RANK_HASHES;
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: number = 0;
  let flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    /**no full house or quads possible ---> can return flush_rank */
    let flushyCardsCounter = 0;

    let flushRankKey: number = 0;

    if ((c1 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c1;
    }
    if ((c2 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c2;
    }
    if ((c3 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c3;
    }
    if ((c4 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c4;
    }
    if ((c5 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c5;
    }
    if ((c6 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c6;
    }

    handRank = FLUSH_RANK_SIX[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SIX[keySum >>> 9];
  }

  return handRank;
}

export const handOfSixEvalHiLow9 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
  const FLUSH_CHECK_SIX = HASHES_OF_FIVE_ON_SIX.FLUSH_CHECK_KEYS;
  const FLUSH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.MULTI_FLUSH_RANK_HASHES;
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: hiLowRank = { hi: 0, low: -1 };
  const HASH_RANK_SIX_LOW = HASHES_OF_FIVE_ON_SIX.HASHES;
  handRank.low = HASH_RANK_SIX_LOW[keySum >>> 9] || -1;
  let flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    /**no full house or quads possible ---> can return flush_rank */
    let flushyCardsCounter = 0;

    let flushRankKey: number = 0;

    if ((c1 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c1;
    }
    if ((c2 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c2;
    }
    if ((c3 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c3;
    }
    if ((c4 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c4;
    }
    if ((c5 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c5;
    }
    if ((c6 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c6;
    }

    handRank.hi = FLUSH_RANK_SIX[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    handRank.hi = HASH_RANK_SIX[keySum >>> 9];
  }

  return handRank;
}

export const handOfSixEvalHiLow8 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
  const FLUSH_CHECK_SIX = HASHES_OF_FIVE_ON_SIX.FLUSH_CHECK_KEYS;
  const FLUSH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.MULTI_FLUSH_RANK_HASHES;
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: hiLowRank = { hi: 0, low: -1 };
  const HASH_RANK_SIX_LOW = HASHES_OF_FIVE_ON_SIX.HASHES;
  handRank.low = HASH_RANK_SIX_LOW[keySum >>> 9] || -1;
  let flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    /**no full house or quads possible ---> can return flush_rank */
    let flushyCardsCounter = 0;

    let flushRankKey: number = 0;

    if ((c1 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c1;
    }
    if ((c2 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c2;
    }
    if ((c3 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c3;
    }
    if ((c4 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c4;
    }
    if ((c5 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c5;
    }
    if ((c6 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c6;
    }

    handRank.hi = FLUSH_RANK_SIX[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    handRank.hi = HASH_RANK_SIX[keySum >>> 9];
  }

  return handRank;
}

export const handOfSixEvalAto5 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  return HASH_RANK_SIX[keySum >>> 9];
}

export const handOfSixEvalAto6 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
  const FLUSH_CHECK_SIX = HASHES_OF_FIVE_ON_SIX.FLUSH_CHECK_KEYS;
  const FLUSH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.MULTI_FLUSH_RANK_HASHES;
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: number = 0;
  let flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK];
  if (flush_check_key >= 0) {
    /**no full house or quads possible ---> can return flush_rank */
    let flushyCardsCounter = 0;

    let flushRankKey: number = 0;

    if ((c1 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c1;
    }
    if ((c2 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c2;
    }
    if ((c3 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c3;
    }
    if ((c4 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c4;
    }
    if ((c5 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c5;
    }
    if ((c6 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c6;
    }

    handRank = FLUSH_RANK_SIX[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SIX[keySum >>> 9];
  }

  return handRank;
}

export const handOfSixEvalLowBall27 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return HIGH_MAX_RANK - handOfSixEval(c1, c2, c3, c4, c5, c6);
}

/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalIndexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEval(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
};

export const handOfSixEvalLowBall27Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEvalLowBall27(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
};

/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalAto5Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEvalAto5(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
};

/** @function handOfSixEvalAto5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalAto6Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEvalAto6(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
};

/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow8Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  return handOfSixEvalHiLow8(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
};

/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSixEvalHiLow9Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  return handOfSixEvalHiLow9(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
  );
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
  return getHandInfo5onX(hand, "high");
};

/** @function _handOfSixEvalLowBall27Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
export const _handOfSixEvalLowBall27Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, "2to7");
};

/** @function _handOfSixEvalAto5Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
export const _handOfSixEvalAto5Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, "Ato5");
};

/** @function _handOfSixEvalAto6Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
export const _handOfSixEvalAto6Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, "Ato6");
};

/** @function _handOfSixEvalLow8_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
export const _handOfSixEvalLow8_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, "low8");
};

/** @function _handOfSixEvalLow9_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
export const _handOfSixEvalLow9_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, "low9");
};
