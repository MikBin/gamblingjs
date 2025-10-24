import { HASHES_OF_FIVE_ON_SEVEN, FLUSH_CHECK_SEVEN, HASH_RANK_SEVEN, FLUSH_RANK_SEVEN, HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, FLUSH_CHECK_SEVEN_LOWBALL27, HASH_RANK_SEVEN_LOWBALL27, FLUSH_RANK_SEVEN_LOWBALL27, HASHES_OF_SEVEN_LOW8, HASH_RANK_SEVEN_LOW8, HASHES_OF_SEVEN_LOW9, HASH_RANK_SEVEN_LOW9, HASHES_OF_SEVEN_LOW_Ato5, HASH_RANK_SEVEN_LOW_Ato5, HASHES_OF_SEVEN_LOW_Ato6, FLUSH_CHECK_SEVEN_ATO6, FLUSH_RANK_SEVEN_ATO6, HASH_RANK_SEVEN_ATO6, } from './pokerHashes7';
import { HASHES_OF_FIVE_LOW9, HASHES_OF_FIVE, HASHES_OF_FIVE_Ato6, HASHES_OF_FIVE_LOW_Ato5, HASHES_OF_FIVE_LOW8, } from './pokerHashes5';
import { bfBestOfFiveOnXindexed, handOfFiveEvalLowBall27Indexed, handOfFiveEvalLow_Ato5Indexed, handOfFiveEvalLow_Ato6Indexed, bestFiveOnXHiLowIndexed, handOfFiveEvalHiLow8Indexed, handOfFiveEvalHiLow9Indexed, } from './pokerEvaluator5';
import { fullCardsDeckHash_7, FLUSH_MASK, flushHashToName, cardHashToDescription_7, HIGH_MAX_RANK, } from './constants';
import { handToCardsSymbols, filterWinningCards } from './routines';
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
export const handOfSevenEval = (c1, c2, c3, c4, c5, c6, c7) => {
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    const flush_check_key = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
    if (flush_check_key >= 0) {
        /**no full house or quads possible ---> can return flush_rank */
        let flushyCardsCounter = 0;
        let flushRankKey = 0;
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
    }
    else {
        handRank = HASH_RANK_SEVEN[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export const handOfSevenEvalLowBall27 = (c1, c2, c3, c4, c5, c6, c7) => {
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    const flush_check_key = FLUSH_CHECK_SEVEN_LOWBALL27[keySum & FLUSH_MASK];
    if (flush_check_key >= 0) {
        /**only seven card flush possible in lowball 2-7. in case of 6 or 5 flushy cards any high card or pair would be a better hand */
        handRank = FLUSH_RANK_SEVEN_LOWBALL27[7][keySum >>> 9];
    }
    else {
        handRank = HASH_RANK_SEVEN_LOWBALL27[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27Indexed
 *
 * @param {Number} c1...c7 cards from 0-51
 * @returns {Number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
export const handOfSevenEvalLowBall27Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalLowBall27(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval_Ato6
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking for lowball Ato6
 */
export const handOfSevenEval_Ato6 = (c1, c2, c3, c4, c5, c6, c7) => {
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    const flush_check_key = FLUSH_CHECK_SEVEN_ATO6[keySum & FLUSH_MASK];
    if (flush_check_key >= 0) {
        handRank = FLUSH_RANK_SEVEN_ATO6[keySum >>> 9];
    }
    else {
        handRank = HASH_RANK_SEVEN_ATO6[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEval_Ato6Indexed
 *
 * @param {Number} c1...c7 cards from deck 0-51
 * @returns {Number} hand ranking for lowball Ato6
 */
export const handOfSevenEval_Ato6Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Ato6(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow = (LOW_RANK_HASH, c1, c2, c3, c4, c5, c6, c7) => {
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    const rankKey = keySum >>> 9;
    const low = LOW_RANK_HASH[rankKey];
    const bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low,
    };
    const flush_check_key = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
    if (flush_check_key >= 0) {
        let flushyCardsCounter = 0;
        let flushRankKey = 0;
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
    }
    else {
        bothRank.hi = HASH_RANK_SEVEN[rankKey];
    }
    return bothRank;
};
/** @function handOfSevenEvalLow_Ato5
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for Ato5 rules
 */
export const handOfSevenEvalLow_Ato5 = (c1, c2, c3, c4, c5, c6, c7) => {
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    const rankKey = keySum >>> 9;
    const rank = HASH_RANK_SEVEN_LOW_Ato5[rankKey];
    return rank;
};
/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalLow_Ato5Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalLow_Ato5(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow8 = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW8, c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow8Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow8(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow9 = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW9, c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
export const handOfSevenEvalHiLow9Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow9(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const handOfSevenEvalIndexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
export const handOfSevenEval_Verbose = (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH = HASHES_OF_FIVE_ON_SEVEN, FIVE_EVAL_HASH = HASHES_OF_FIVE, USE_MULTI_FLUSH_RANK = true, INVERTED = false) => {
    const _FLUSH_CHECK_SEVEN = SEVEN_EVAL_HASH.FLUSH_CHECK_KEYS;
    const _FLUSH_RANK_SEVEN = USE_MULTI_FLUSH_RANK
        ? SEVEN_EVAL_HASH.MULTI_FLUSH_RANK_HASHES
        : SEVEN_EVAL_HASH.FLUSH_RANK_HASHES;
    const _HASH_RANK_SEVEN = SEVEN_EVAL_HASH.HASHES;
    const keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    const flush_check_key = _FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
    let flushRankKey = 0;
    let handVector = [c1, c2, c3, c4, c5, c6, c7];
    if (flush_check_key >= 0) {
        handVector = handVector.filter((c, i) => {
            return (c & FLUSH_MASK) == flush_check_key;
        });
        handVector.forEach((c) => (flushRankKey += c));
        handRank = USE_MULTI_FLUSH_RANK
            ? //@ts-ignore
                _FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9]
            : _FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = _HASH_RANK_SEVEN[keySum >>> 9];
        flushRankKey = -1;
    }
    const handIndexes = handVector.map((c) => cardHashToDescription_7[c]);
    /**NB if undefined hand rank prepare for unqualified information */
    if (handRank !== 0 && !handRank) {
        return {
            handRank: -1,
            hand: [],
            faces: handToCardsSymbols(handIndexes),
            handGroup: 'unqualified',
            winningCards: [],
            flushSuit: 'unqualified',
        };
    }
    const wHand = FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].hand;
    return {
        handRank: handRank,
        hand: wHand,
        faces: FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].faces,
        handGroup: FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].handGroup,
        winningCards: filterWinningCards(handIndexes, wHand),
        /**in low8 or 9 there could be more than 5 cards ex AAA2345--->apply procedure to remove duplicates when highliting cards
         * by taking the first of each rank encountered (starting from communitaire cards)
         */
        flushSuit: flushRankKey > -1 ? flushHashToName[flush_check_key] : 'no flush',
    };
};
export const handOfSevenEvalLowBall27Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, HASHES_OF_FIVE, true, true);
};
export const handOfSevenEvalAto6Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], HASHES_OF_SEVEN_LOW_Ato6, HASHES_OF_FIVE_Ato6, false);
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
export const handOfSevenEvalIndexed_Verbose = (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH = HASHES_OF_FIVE_ON_SEVEN, FIVE_EVAL_HASH = HASHES_OF_FIVE, USE_MULTI_FLUSH_RANK = true) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
};
export const handOfSevenEvalAto5Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], HASHES_OF_SEVEN_LOW_Ato5, HASHES_OF_FIVE_LOW_Ato5, false);
};
export const handOfSevenEvalLow8Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], HASHES_OF_SEVEN_LOW8, HASHES_OF_FIVE_LOW8, false);
};
export const handOfSevenEvalLow9Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], HASHES_OF_SEVEN_LOW9, HASHES_OF_FIVE_LOW9, false);
};
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
export const _handOfSevenEvalIndexed = (...hand) => {
    return bfBestOfFiveOnXindexed(hand);
};
/** @function _handOfSevenEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSevenEvalLowBall27Indexed = (...hand) => {
    return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLowBall27Indexed);
};
/** @function _handOfSevenEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSevenEvalLow_Ato5Indexed = (...hand) => {
    return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato5Indexed);
};
/** @function _handOfSevenEvalAto6Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSevenEval_Ato6Indexed = (...hand) => {
    return bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato6Indexed);
};
/** @function _handOfSevenEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSevenEvalHiLow8Indexed = (...hand) => {
    return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow8Indexed, hand);
};
/** @function _handOfSevenEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export const _handOfSevenEvalHiLow9Indexed = (...hand) => {
    return bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow9Indexed, hand);
};
