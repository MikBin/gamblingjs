import {
  HASHES_OF_FIVE_ON_SIX,
  FLUSH_CHECK_SIX,
  HASH_RANK_SIX,
  FLUSH_RANK_SIX,
  HASHES_OF_FIVE_ON_SIX_LOWBALL27,
  FLUSH_CHECK_SIX_LOWBALL27,
  HASH_RANK_SIX_LOWBALL27,
  HASHES_OF_SIX_LOW8,
  HASH_RANK_SIX_LOW8,
  HASHES_OF_SIX_LOW9,
  HASH_RANK_SIX_LOW9,
  HASHES_OF_SIX_LOW_Ato5,
  HASH_RANK_SIX_LOW_Ato5,
  HASHES_OF_SIX_LOW_Ato6,
  FLUSH_CHECK_SIX_ATO6,
  HASH_RANK_SIX_ATO6,
  FLUSH_RANK_SIX_ATO6,
  FAST_HASH_DEFINED_6,
  fastHashesCreators6,
} from './pokerHashes6';

import {
  bfBestOfFiveOnXindexed,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalHiLow8Indexed,
  bestFiveOnXHiLowIndexed,
  getHandInfo5onX,
} from './pokerEvaluator5';

import {
  fullCardsDeckHash_7,
  FLUSH_MASK,
  flushHashToName,
  cardHashToDescription_7,
  HIGH_MAX_RANK,
} from './constants';
import {
  handInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn,
  hashRanking,
  verboseHandInfo,
  hashRankingSeven,
} from './interfaces';

import { handToCardsSymbols, filterWinningCards } from './routines';

import * as kombinatoricsJs from './lib/kombinatoricsjs/src/kombinatoricsjs';

/** @function handOfSixEval
 *
 * @param {Number} c1...c6 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export const handOfSixEval = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  if (!FAST_HASH_DEFINED_6.high) fastHashesCreators6.high();
  const keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: number = 0;
  const flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK] ?? -1;
  if (flush_check_key >= 0) {
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

    handRank = FLUSH_RANK_SIX[flushyCardsCounter]![flushRankKey >>> 9]!;
  } else {
    handRank = HASH_RANK_SIX[keySum >>> 9]!;
  }

  return handRank;
};

export const handOfSixEvalIndexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEval(
    fullCardsDeckHash_7[c1]!,
    fullCardsDeckHash_7[c2]!,
    fullCardsDeckHash_7[c3]!,
    fullCardsDeckHash_7[c4]!,
    fullCardsDeckHash_7[c5]!,
    fullCardsDeckHash_7[c6]!,
  );
};

export const handOfSixEvalLowBall27 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  if (!FAST_HASH_DEFINED_6['2to7']) fastHashesCreators6['2to7']();
  const keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: number = 0;
  const flush_check_key: number = FLUSH_CHECK_SIX_LOWBALL27[keySum & FLUSH_MASK] ?? -1;
  if (flush_check_key >= 0) {
    handRank = FLUSH_RANK_SIX[6]![keySum >>> 9]!;
  } else {
    handRank = HASH_RANK_SIX_LOWBALL27[keySum >>> 9]!;
  }
  return handRank;
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
    fullCardsDeckHash_7[c1]!,
    fullCardsDeckHash_7[c2]!,
    fullCardsDeckHash_7[c3]!,
    fullCardsDeckHash_7[c4]!,
    fullCardsDeckHash_7[c5]!,
    fullCardsDeckHash_7[c6]!,
  );
};

export const handOfSixEvalAto6 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  if (!FAST_HASH_DEFINED_6.Ato6) fastHashesCreators6.Ato6();
  const keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  let handRank: number = 0;
  const flush_check_key: number = FLUSH_CHECK_SIX_ATO6[keySum & FLUSH_MASK] ?? -1;
  if (flush_check_key >= 0) {
    handRank = FLUSH_RANK_SIX_ATO6[keySum >>> 9]!;
  } else {
    handRank = HASH_RANK_SIX_ATO6[keySum >>> 9]!;
  }

  return handRank;
};

export const handOfSixEvalAto6Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEvalAto6(
    fullCardsDeckHash_7[c1]!,
    fullCardsDeckHash_7[c2]!,
    fullCardsDeckHash_7[c3]!,
    fullCardsDeckHash_7[c4]!,
    fullCardsDeckHash_7[c5]!,
    fullCardsDeckHash_7[c6]!,
  );
};

export const handOfSixEvalLow_Ato5 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  if (!FAST_HASH_DEFINED_6.Ato5) fastHashesCreators6.Ato5();
  const keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  const rankKey: number = keySum >>> 9;
  const rank = HASH_RANK_SIX_LOW_Ato5[rankKey]!;
  return rank;
};

export const handOfSixEvalLow_Ato5Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): number => {
  return handOfSixEvalLow_Ato5(
    fullCardsDeckHash_7[c1]!,
    fullCardsDeckHash_7[c2]!,
    fullCardsDeckHash_7[c3]!,
    fullCardsDeckHash_7[c4]!,
    fullCardsDeckHash_7[c5]!,
    fullCardsDeckHash_7[c6]!,
  );
};

// Backward-compatible aliases (without Low_ and underscore)
export const handOfSixEvalAto5Indexed = handOfSixEvalLow_Ato5Indexed;

export const handOfSixEvalHiLow = (
  LOW_RANK_HASH: NumberMap,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  if (!FAST_HASH_DEFINED_6.high) fastHashesCreators6.high();
  const keySum: number = c1 + c2 + c3 + c4 + c5 + c6;
  const rankKey: number = keySum >>> 9;
  const low = LOW_RANK_HASH[rankKey];
  const bothRank: hiLowRank = {
    hi: 0,
    low: isNaN(low) ? -1 : low,
  };
  const flush_check_key: number = FLUSH_CHECK_SIX[keySum & FLUSH_MASK] ?? -1;
  if (flush_check_key >= 0) {
    let flushyCardsCounter: number = 0;
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

    bothRank.hi = FLUSH_RANK_SIX[flushyCardsCounter]![flushRankKey >>> 9]!;
  } else {
    bothRank.hi = HASH_RANK_SIX[rankKey]!;
  }
  return bothRank;
};

export const handOfSixEvalHiLow8 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  if (!FAST_HASH_DEFINED_6.low8) fastHashesCreators6.low8();
  return handOfSixEvalHiLow(HASH_RANK_SIX_LOW8, c1, c2, c3, c4, c5, c6);
};

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

export const handOfSixEvalHiLow9 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
): hiLowRank => {
  if (!FAST_HASH_DEFINED_6.low9) fastHashesCreators6.low9();
  return handOfSixEvalHiLow(HASH_RANK_SIX_LOW9, c1, c2, c3, c4, c5, c6);
};

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
 * slow brute force versions
 *
 */

export const _handOfSixEvalIndexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand);
};

export const _handOfSixEvalLowBall27Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLowBall27Indexed);
};

export const _handOfSixEvalLow_Ato5Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato5Indexed);
};

export const _handOfSixEval_Ato6Indexed = (...hand: number[]): number => {
  return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato6Indexed);
};

export const _handOfSixEvalHiLow8Indexed = (...hand: number[]): hiLowRank => {
  return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow8Indexed, hand);
};

export const _handOfSixEvalHiLow9Indexed = (...hand: number[]): hiLowRank => {
  return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow9Indexed, hand);
};

/**
 *
 * VERBOSE (generic via brute-force helpers)
 *
 */
export const _handOfSixEvalIndexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'high');
};

export const _handOfSixEvalLowBall27Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, '2to7');
};

export const _handOfSixEvalAto5Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'Ato5');
};

export const _handOfSixEvalAto6Indexed_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'Ato6');
};

export const _handOfSixEvalLow8_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'low8');
};

export const _handOfSixEvalLow9_Verbose = (hand: number[]): verboseHandInfo => {
  return getHandInfo5onX(hand, 'low9');
};
