/** @TODO --> pokerEvaluators.ts have to gather all below functions from specific evaluators files
 *  ex deuceToSevenEval.ts, highRankEval.ts... */
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
import {
  handInfo,
  verboseHandInfo,
  hiLowRank,
  NumberMap,
  singleRankFiveCardHandEvalFn,
  hiLowRankFiveCardHandEvalFn
} from './interfaces';

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
const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;

/**LOW Ato5 HASHES */
export const HASHES_OF_FIVE_LOW8 = createRankOf5AceToFive_Low8();
const HASH_RANK_FIVE_LOW8 = HASHES_OF_FIVE_LOW8.HASHES;
export const HASHES_OF_FIVE_LOW9 = createRankOf5AceToFive_Low9();
const HASH_RANK_FIVE_LOW9 = HASHES_OF_FIVE_LOW9.HASHES;
export const HASEHS_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
const HASH_RANK_FIVE_LOW_Ato5 = HASEHS_OF_FIVE_LOW_Ato5.HASHES;

/**LOW Ato5 on 7 cards HASHES */
export const HASHES_OF_SEVEN_LOW8 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8);
const HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
export const HASHES_OF_SEVEN_LOW9 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9);
const HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;
export const HASEHS_OF_SEVEN_LOW_Ato5 = createRankOf7AceToFive_Low(
  HASEHS_OF_FIVE_LOW_Ato5,
  rankCards_low,
  true
);

const HASH_RANK_SEVEN_LOW_Ato5 = HASEHS_OF_SEVEN_LOW_Ato5.HASHES;

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

export const handOfFiveEvalLow_Ato6 = () => {};
export const handOfFiveEvalLow_Ato6Indexed = () => {};

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

/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveOnX = (hand: number[]) => {
  //@ts-ignore
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => handOfFiveEval(...h)));
};

/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveOnXindexed = (hand: number[]) => {
  //@ts-ignore
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => handOfFiveEvalIndexed(...h)));
};

/** @function bfBestOfFiveFromTwoSets
 *
 * @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
 * @param {Array:Number[]} handSetB array of sizeB cards representing board cards
 * @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
 * @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const bfBestOfFiveFromTwoSets = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
  evalFn: Function = handOfFiveEval
): number => {
  if (nA + nB !== 5) {
    throw new RangeError('sum of nA+nB parameters MUST be 5');
  }
  let setACombinations: number[][] = kombinatoricsJs.combinations(handSetA, nA);
  let setBCombinations: number[][] = kombinatoricsJs.combinations(handSetB, nB);
  let maxRank: number = 0;
  setACombinations.forEach((handA, idxA) => {
    setBCombinations.forEach((handB, idxB) => {
      //@ts-ignore
      let rank = evalFn(...handA, ...handB);
      rank > maxRank ? (maxRank = rank) : null;
    });
  });

  return maxRank;
};

export const bfBestOfFiveFromTwoSetsHiLow = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number,
  evalFn: Function
): hiLowRank => {
  if (nA + nB !== 5) {
    throw new RangeError('sum of nA+nB parameters MUST be 5');
  }
  let setACombinations: number[][] = kombinatoricsJs.combinations(handSetA, nA);
  let setBCombinations: number[][] = kombinatoricsJs.combinations(handSetB, nB);
  let maxRank: hiLowRank = { hi: 0, low: -1 };
  setACombinations.forEach((handA, idxA) => {
    setBCombinations.forEach((handB, idxB) => {
      //@ts-ignore
      let hlRank: hiLowRank = evalFn(...handA, ...handB);
      hlRank.hi > maxRank.hi ? (maxRank.hi = hlRank.hi) : null;
      hlRank.low > maxRank.low ? (maxRank.low = hlRank.low) : null;
    });
  });
  return maxRank;
};

export const bfBestOfFiveFromTwoSetsHiLow8 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, handOfFiveEvalHiLow8);
};

export const bfBestOfFiveFromTwoSetsHiLow8Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(
    handSetA.map(c => fullCardsDeckHash_5[c]),
    handSetB.map(c => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalHiLow8
  );
};

export const bfBestOfFiveFromTwoSetsHiLow9 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, handOfFiveEvalHiLow9);
};

export const bfBestOfFiveFromTwoSetsHiLow9Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): hiLowRank => {
  return bfBestOfFiveFromTwoSetsHiLow(
    handSetA.map(c => fullCardsDeckHash_5[c]),
    handSetB.map(c => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalHiLow9
  );
};

export const bfBestOfFiveFromTwoSetsHiLow_Ato5 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): number => {
  return bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, handOfFiveEvalLow_Ato5);
};

export const bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): number => {
  return bfBestOfFiveFromTwoSets(
    handSetA.map(c => fullCardsDeckHash_5[c]),
    handSetB.map(c => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalLow_Ato5
  );
};

export const bfBestOfFiveFromTwoSetsLowBall27 = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): number => {
  return bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, handOfFiveEvalLowBall27);
};

export const bfBestOfFiveFromTwoSetsLowBall27Indexed = (
  handSetA: number[],
  handSetB: number[],
  nA: number,
  nB: number
): number => {
  return bfBestOfFiveFromTwoSets(
    handSetA.map(c => fullCardsDeckHash_5[c]),
    handSetB.map(c => fullCardsDeckHash_5[c]),
    nA,
    nB,
    handOfFiveEvalLowBall27
  );
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
    let flushyCardsCounter = 0;

    let flushRankKey: number = 0;
    /*
      ((c1 & FLUSH_MASK) == flush_check_key) * c1 +
     
        ((c2 & FLUSH_MASK) == flush_check_key) * c2 +
     
        ((c3 & FLUSH_MASK) == flush_check_key) * c3 +
     
        ((c4 & FLUSH_MASK) == flush_check_key) * c4 +
     
        ((c5 & FLUSH_MASK) == flush_check_key) * c5 +
       
        ((c6 & FLUSH_MASK) == flush_check_key) * c6 +
        
        ((c7 & FLUSH_MASK) == flush_check_key) * c7;
  */
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
    if ((c7 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c7;
    }

    handRank = FLUSH_RANK_SEVEN[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    handRank = HASH_RANK_SEVEN[keySum >>> 9];
  }

  return handRank;
};

/** @function handOfSevenEvalLowBall27
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export const handOfSevenEvalLowBall27 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): number => {
  return HIGH_MAX_RANK - handOfSevenEval(c1, c2, c3, c4, c5, c6, c7);
};

/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow = (
  LOW_RANK_HASH: NumberMap,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): hiLowRank => {
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  let rankKey: number = keySum >>> 9;
  let low = LOW_RANK_HASH[rankKey];
  let bothRank: hiLowRank = {
    hi: 0,
    low: isNaN(low) ? -1 : low
  };
  let flush_check_key: number = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
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
    if ((c7 & FLUSH_MASK) == flush_check_key) {
      flushyCardsCounter++;
      flushRankKey += c7;
    }

    bothRank.hi = FLUSH_RANK_SEVEN[flushyCardsCounter][flushRankKey >>> 9];
  } else {
    bothRank.hi = HASH_RANK_SEVEN[rankKey];
  }
  return bothRank;
};

/** @function handOfSevenEvalLow_Ato5
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for Ato5 rules
 */
export const handOfSevenEvalLow_Ato5 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): number => {
  let keySum: number = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  let rankKey: number = keySum >>> 9;
  let rank = HASH_RANK_SEVEN_LOW_Ato5[rankKey];
  return rank;
};

/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalLow_Ato5Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): number => {
  return handOfSevenEvalLow_Ato5(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
    fullCardsDeckHash_7[c7]
  );
};

/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow8 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): hiLowRank => {
  return handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW8, c1, c2, c3, c4, c5, c6, c7);
};

/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow8Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): hiLowRank => {
  return handOfSevenEvalHiLow8(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
    fullCardsDeckHash_7[c7]
  );
};

/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow9 = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): hiLowRank => {
  return handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW9, c1, c2, c3, c4, c5, c6, c7);
};

/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow9Indexed = (
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number
): hiLowRank => {
  return handOfSevenEvalHiLow9(
    fullCardsDeckHash_7[c1],
    fullCardsDeckHash_7[c2],
    fullCardsDeckHash_7[c3],
    fullCardsDeckHash_7[c4],
    fullCardsDeckHash_7[c5],
    fullCardsDeckHash_7[c6],
    fullCardsDeckHash_7[c7]
  );
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

/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
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
    handVector = handVector.filter((c, i) => {
      return (c & FLUSH_MASK) == flush_check_key;
    });

    handVector.forEach(c => (flushRankKey += c));

    handRank = FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9];
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
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
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
 * @returns {handInfo} object containing hand info
 */
export const getHandInfo = (rank: number): handInfo => {
  return HASHES_OF_FIVE.rankingInfos[rank];
};
