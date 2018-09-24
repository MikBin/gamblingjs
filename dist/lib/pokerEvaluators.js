"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var hashesCreator_1 = require("./hashesCreator");
var constants_1 = require("./constants");
/**low hands ato5 as well as hand on 6 and omaha optimization are not created at boot,
 * they have to be instantiated explicitly
 */
exports.HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
var FLUSH_CHECK_FIVE = exports.HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
var HASH_RANK_FIVE = exports.HASHES_OF_FIVE.HASHES;
var FLUSH_RANK_FIVE = exports.HASHES_OF_FIVE.FLUSH_RANK_HASHES;
exports.HASHES_OF_FIVE_ON_SEVEN = hashesCreator_1.createRankOf5On7Hashes(exports.HASHES_OF_FIVE);
var FLUSH_CHECK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.HASHES;
var FLUSH_RANK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES;
/**LOW Ato5 HASHES */
exports.HASHES_OF_FIVE_LOW8 = hashesCreator_1.createRankOf5AceToFive_Low8();
var HASH_RANK_FIVE_LOW8 = exports.HASHES_OF_FIVE_LOW8.HASHES;
exports.HASHES_OF_FIVE_LOW9 = hashesCreator_1.createRankOf5AceToFive_Low9();
var HASH_RANK_FIVE_LOW9 = exports.HASHES_OF_FIVE_LOW9.HASHES;
exports.HASEHS_OF_FIVE_LOW_Ato5 = hashesCreator_1.createRankOf5AceToFive_Full();
var HASH_RANK_FIVE_LOW_Ato5 = exports.HASEHS_OF_FIVE_LOW_Ato5.HASHES;
exports.HASHES_OF_SEVEN_LOW8 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASHES_OF_FIVE_LOW8, constants_1.rankCards_low8);
exports.HASHES_OF_SEVEN_LOW9 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASHES_OF_FIVE_LOW9, constants_1.rankCards_low9);
exports.HASEHS_OF_SEVEN_LOW_Ato5 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASEHS_OF_FIVE_LOW_Ato5, constants_1.rankCards_low);
/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
exports.handOfFiveEval = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var flush_check_key = FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
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
exports.handOfFiveEvalHiLow = function (LOW_RANK_HASH, c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var low = LOW_RANK_HASH[rankKey];
    var bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    var flush_check_key = FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        bothRank.hi = FLUSH_RANK_FIVE[rankKey];
    }
    else {
        bothRank.hi = HASH_RANK_FIVE[rankKey];
    }
    return bothRank;
};
exports.handOfFiveEvalHiLow8 = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW8, c1, c2, c3, c4, c5);
};
exports.handOfFiveEvalHiLow9 = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW9, c1, c2, c3, c4, c5);
};
exports.handOfFiveEvalLow_Ato5 = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var rank = HASH_RANK_FIVE_LOW_Ato5[rankKey];
    return rank;
};
/**inverse ranking */
exports.handOfFiveEvalLowBall27 = function (c1, c2, c3, c4, c5) {
    return constants_1.HIGH_MAX_RANK - exports.handOfFiveEval(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
exports.handOfFiveEvalIndexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEval(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
/** @function bfBestOfFiveOnX
 *
 * @param {Array:Number[]} array of 6 or more cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.bfBestOfFiveOnX = function (hand) {
    //@ts-ignore
    return Math.max.apply(Math, kombinatoricsJs.combinations(hand, 5).map(function (h) { return exports.handOfFiveEval.apply(void 0, h); }));
};
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
exports.handOfSevenEval = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        /**no full house or quads possible ---> can return flush_rank */
        //@ts-ignore
        var flushRankKey = 
        //@ts-ignore
        ((c1 & constants_1.FLUSH_MASK) == flush_check_key) * c1 +
            //@ts-ignore
            ((c2 & constants_1.FLUSH_MASK) == flush_check_key) * c2 +
            //@ts-ignore
            ((c3 & constants_1.FLUSH_MASK) == flush_check_key) * c3 +
            //@ts-ignore
            ((c4 & constants_1.FLUSH_MASK) == flush_check_key) * c4 +
            //@ts-ignore
            ((c5 & constants_1.FLUSH_MASK) == flush_check_key) * c5 +
            //@ts-ignore
            ((c6 & constants_1.FLUSH_MASK) == flush_check_key) * c6 +
            //@ts-ignore
            ((c7 & constants_1.FLUSH_MASK) == flush_check_key) * c7;
        handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = HASH_RANK_SEVEN[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalIndexed = function (c1, c2, c3, c4, c5, c6) {
    return exports.bfBestOfFiveOnX([
        constants_1.fullCardsDeckHash_5[c1],
        constants_1.fullCardsDeckHash_5[c2],
        constants_1.fullCardsDeckHash_5[c3],
        constants_1.fullCardsDeckHash_5[c4],
        constants_1.fullCardsDeckHash_5[c5],
        constants_1.fullCardsDeckHash_5[c6]
    ]);
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
exports.handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
    var flushRankKey = 0;
    var handVector = [c1, c2, c3, c4, c5, c6, c7];
    if (flush_check_key >= 0) {
        /* istanbul ignore next */
        handVector = handVector.filter(function (c, i) {
            return (c & constants_1.FLUSH_MASK) == flush_check_key;
        });
        /* istanbul ignore next */
        handVector.forEach(function (c) { return (flushRankKey += c); });
        /* istanbul ignore next */
        handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = HASH_RANK_SEVEN[keySum >>> 9];
        flushRankKey = -1;
    }
    var wHand = exports.HASHES_OF_FIVE.rankingInfos[handRank].hand;
    var handIndexes = handVector.map(function (c) { return constants_1.cardHashToDescription_7[c]; });
    return {
        handRank: handRank,
        hand: wHand,
        faces: exports.HASHES_OF_FIVE.rankingInfos[handRank].faces,
        handGroup: exports.HASHES_OF_FIVE.rankingInfos[handRank].handGroup,
        winningCards: handIndexes.filter(function (c) { return wHand.includes(c % 13); }),
        flushSuit: flushRankKey > -1 ? constants_1.flushHashToName[flush_check_key] : 'no flush'
    };
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
exports.handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function getHandInfo
 *
 * @param {Number} hand rank
 * @returns {Number} object containing hand info
 */
exports.getHandInfo = function (rank) {
    return exports.HASHES_OF_FIVE.rankingInfos[rank];
};
//# sourceMappingURL=pokerEvaluators.js.map