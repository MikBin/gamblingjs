"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerHashes7_1 = require("./pokerHashes7");
var pokerHashes5_1 = require("./pokerHashes5");
var pokerEvaluator5_1 = require("./pokerEvaluator5");
var constants_1 = require("./constants");
var routines_1 = require("./routines");
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
exports.handOfSevenEval = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = pokerHashes7_1.FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        /**no full house or quads possible ---> can return flush_rank */
        var flushyCardsCounter = 0;
        var flushRankKey = 0;
        if ((c1 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c1;
        }
        if ((c2 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c2;
        }
        if ((c3 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c3;
        }
        if ((c4 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c4;
        }
        if ((c5 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c5;
        }
        if ((c6 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c6;
        }
        if ((c7 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c7;
        }
        handRank = pokerHashes7_1.FLUSH_RANK_SEVEN[flushyCardsCounter][flushRankKey >>> 9];
    }
    else {
        handRank = pokerHashes7_1.HASH_RANK_SEVEN[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
exports.handOfSevenEvalLowBall27 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = pokerHashes7_1.FLUSH_CHECK_SEVEN_LOWBALL27[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        /**only seven card flush possible in lowball 2-7. in case of 6 or 5 flushy cards any high card or pair would be a better hand */
        handRank = pokerHashes7_1.FLUSH_RANK_SEVEN_LOWBALL27[7][keySum >>> 9];
    }
    else {
        handRank = pokerHashes7_1.HASH_RANK_SEVEN_LOWBALL27[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27Indexed
 *
 * @param {Number} c1...c7 cards from 0-51
 * @returns {Number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
exports.handOfSevenEvalLowBall27Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalLowBall27(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval_Ato6
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking for lowball Ato6
 */
exports.handOfSevenEval_Ato6 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = pokerHashes7_1.FLUSH_CHECK_SEVEN_ATO6[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        handRank = pokerHashes7_1.FLUSH_RANK_SEVEN_ATO6[keySum >>> 9];
    }
    else {
        handRank = pokerHashes7_1.HASH_RANK_SEVEN_ATO6[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEval_Ato6Indexed
 *
 * @param {Number} c1...c7 cards from deck 0-51
 * @returns {Number} hand ranking for lowball Ato6
 */
exports.handOfSevenEval_Ato6Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Ato6(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalHiLow = function (LOW_RANK_HASH, c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var rankKey = keySum >>> 9;
    var low = LOW_RANK_HASH[rankKey];
    var bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    var flush_check_key = pokerHashes7_1.FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        var flushyCardsCounter = 0;
        var flushRankKey = 0;
        if ((c1 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c1;
        }
        if ((c2 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c2;
        }
        if ((c3 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c3;
        }
        if ((c4 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c4;
        }
        if ((c5 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c5;
        }
        if ((c6 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c6;
        }
        if ((c7 & constants_1.FLUSH_MASK) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c7;
        }
        bothRank.hi = pokerHashes7_1.FLUSH_RANK_SEVEN[flushyCardsCounter][flushRankKey >>> 9];
    }
    else {
        bothRank.hi = pokerHashes7_1.HASH_RANK_SEVEN[rankKey];
    }
    return bothRank;
};
/** @function handOfSevenEvalLow_Ato5
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for Ato5 rules
 */
exports.handOfSevenEvalLow_Ato5 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var rankKey = keySum >>> 9;
    var rank = pokerHashes7_1.HASH_RANK_SEVEN_LOW_Ato5[rankKey];
    return rank;
};
/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalLow_Ato5Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalLow_Ato5(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalHiLow8 = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalHiLow(pokerHashes7_1.HASH_RANK_SEVEN_LOW8, c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalHiLow8Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalHiLow8(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalHiLow9 = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalHiLow(pokerHashes7_1.HASH_RANK_SEVEN_LOW9, c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfSevenEvalHiLow9Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEvalHiLow9(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
exports.handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK, INVERTED) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = pokerHashes7_1.HASHES_OF_FIVE_ON_SEVEN; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = pokerHashes5_1.HASHES_OF_FIVE; }
    if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
    if (INVERTED === void 0) { INVERTED = false; }
    var _FLUSH_CHECK_SEVEN = SEVEN_EVAL_HASH.FLUSH_CHECK_KEYS;
    var _FLUSH_RANK_SEVEN = USE_MULTI_FLUSH_RANK
        ? SEVEN_EVAL_HASH.MULTI_FLUSH_RANK_HASHES
        : SEVEN_EVAL_HASH.FLUSH_RANK_HASHES;
    var _HASH_RANK_SEVEN = SEVEN_EVAL_HASH.HASHES;
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = _FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
    var flushRankKey = 0;
    var handVector = [c1, c2, c3, c4, c5, c6, c7];
    if (flush_check_key >= 0) {
        handVector = handVector.filter(function (c, i) {
            return (c & constants_1.FLUSH_MASK) == flush_check_key;
        });
        handVector.forEach(function (c) { return (flushRankKey += c); });
        handRank = USE_MULTI_FLUSH_RANK
            //@ts-ignore
            ? _FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9] : _FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = _HASH_RANK_SEVEN[keySum >>> 9];
        flushRankKey = -1;
    }
    var handIndexes = handVector.map(function (c) { return constants_1.cardHashToDescription_7[c]; });
    /**NB if undefined hand rank prepare for unqualified information */
    if (handRank !== 0 && !handRank) {
        return {
            handRank: -1,
            hand: [],
            faces: routines_1.handToCardsSymbols(handIndexes),
            handGroup: 'unqualified',
            winningCards: [],
            flushSuit: 'unqualified'
        };
    }
    var wHand = FIVE_EVAL_HASH.rankingInfos[INVERTED ? constants_1.HIGH_MAX_RANK - handRank : handRank].hand;
    return {
        handRank: handRank,
        hand: wHand,
        faces: FIVE_EVAL_HASH.rankingInfos[INVERTED ? constants_1.HIGH_MAX_RANK - handRank : handRank].faces,
        handGroup: FIVE_EVAL_HASH.rankingInfos[INVERTED ? constants_1.HIGH_MAX_RANK - handRank : handRank].handGroup,
        winningCards: routines_1.filterWinningCards(handIndexes, wHand),
        /**in low8 or 9 there could be more than 5 cards ex AAA2345--->apply procedure to remove duplicates when highliting cards
         * by taking the first of each rank encountered (starting from communitaire cards)
         */
        flushSuit: flushRankKey > -1 ? constants_1.flushHashToName[flush_check_key] : 'no flush'
    };
};
exports.handOfSevenEvalLowBall27Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], pokerHashes7_1.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, pokerHashes5_1.HASHES_OF_FIVE, true, true);
};
exports.handOfSevenEvalAto6Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], pokerHashes7_1.HASHES_OF_SEVEN_LOW_Ato6, pokerHashes5_1.HASHES_OF_FIVE_Ato6, false);
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
exports.handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = pokerHashes7_1.HASHES_OF_FIVE_ON_SEVEN; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = pokerHashes5_1.HASHES_OF_FIVE; }
    if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
};
exports.handOfSevenEvalAto5Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], pokerHashes7_1.HASHES_OF_SEVEN_LOW_Ato5, pokerHashes5_1.HASHES_OF_FIVE_LOW_Ato5, false);
};
exports.handOfSevenEvalLow8Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], pokerHashes7_1.HASHES_OF_SEVEN_LOW8, pokerHashes5_1.HASHES_OF_FIVE_LOW8, false);
};
exports.handOfSevenEvalLow9Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], pokerHashes7_1.HASHES_OF_SEVEN_LOW9, pokerHashes5_1.HASHES_OF_FIVE_LOW9, false);
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
exports._handOfSevenEvalIndexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand);
};
/** @function _handOfSevenEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports._handOfSevenEvalLowBall27Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLowBall27Indexed);
};
/** @function _handOfSevenEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports._handOfSevenEvalLow_Ato5Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed);
};
/** @function _handOfSevenEvalAto6Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports._handOfSevenEval_Ato6Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed);
};
/** @function _handOfSevenEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports._handOfSevenEvalHiLow8Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bestFiveOnXHiLowIndexed(pokerEvaluator5_1.handOfFiveEvalHiLow8Indexed, hand);
};
/** @function _handOfSevenEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports._handOfSevenEvalHiLow9Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bestFiveOnXHiLowIndexed(pokerEvaluator5_1.handOfFiveEvalHiLow9Indexed, hand);
};
//# sourceMappingURL=pokerEvaluator7.js.map