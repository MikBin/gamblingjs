"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerHashes5_1 = require("./pokerHashes5");
var constants_1 = require("./constants");
var kombinatoricsJs = require("kombinatoricsjs");
/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
exports.handOfFiveEval = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var flush_check_key = pokerHashes5_1.FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        return pokerHashes5_1.FLUSH_RANK_FIVE[rankKey];
    }
    return pokerHashes5_1.HASH_RANK_FIVE[rankKey];
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
    var flush_check_key = pokerHashes5_1.FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        bothRank.hi = pokerHashes5_1.FLUSH_RANK_FIVE[rankKey];
    }
    else {
        bothRank.hi = pokerHashes5_1.HASH_RANK_FIVE[rankKey];
    }
    return bothRank;
};
/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfFiveEvalHiLow8 = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow(pokerHashes5_1.HASH_RANK_FIVE_LOW8, c1, c2, c3, c4, c5);
};
exports.handOfFiveEvalHiLow8Indexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow8(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
/** @function handOfFiveEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfFiveEvalHiLow9 = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow(pokerHashes5_1.HASH_RANK_FIVE_LOW9, c1, c2, c3, c4, c5);
};
exports.handOfFiveEvalHiLow9Indexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow9(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
exports.handOfFiveEvalLow_Ato5 = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var rank = pokerHashes5_1.HASH_RANK_FIVE_LOW_Ato5[rankKey];
    return rank;
};
/** @function handOfFiveEvalLow_Ato5Indexed
 *
 * @param {Number} c1...c5 cards index in standard deck 52
 * @returns {number} hand ranking for Ato5 rules
 */
exports.handOfFiveEvalLow_Ato5Indexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalLow_Ato5(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
exports.handOfFiveEvalLow_Ato6 = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var flush_check_key = pokerHashes5_1.FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        return pokerHashes5_1.FLUSH_RANK_FIVE_ATO6[rankKey];
    }
    return pokerHashes5_1.HASH_RANK_FIVE_ATO6[rankKey];
};
exports.handOfFiveEvalLow_Ato6Indexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalLow_Ato6(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
exports.handOfFiveEvalLowBall27 = function (c1, c2, c3, c4, c5) {
    return constants_1.HIGH_MAX_RANK - exports.handOfFiveEval(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalLowBall27Indexed
 *
 * @param {Number} c1...c5 cards hash from 0-51
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
exports.handOfFiveEvalLowBall27Indexed = function (c1, c2, c3, c4, c5) {
    return constants_1.HIGH_MAX_RANK - exports.handOfFiveEvalIndexed(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
exports.handOfFiveEvalIndexed = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEval(constants_1.fullCardsDeckHash_5[c1], constants_1.fullCardsDeckHash_5[c2], constants_1.fullCardsDeckHash_5[c3], constants_1.fullCardsDeckHash_5[c4], constants_1.fullCardsDeckHash_5[c5]);
};
/** @function getHandInfo
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
exports.getHandInfo = function (rank, HASHES, INVERTED) {
    if (HASHES === void 0) { HASHES = pokerHashes5_1.HASHES_OF_FIVE; }
    if (INVERTED === void 0) { INVERTED = false; }
    return HASHES.rankingInfos[INVERTED ? constants_1.HIGH_MAX_RANK - rank : rank] || {
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
exports.getHandInfo27 = function (rank) {
    return exports.getHandInfo(rank, pokerHashes5_1.HASHES_OF_FIVE, true);
};
/** @function getHandInfoLow8
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfoLow8 = function (rank) {
    return exports.getHandInfo(rank, pokerHashes5_1.HASHES_OF_FIVE_LOW8);
};
/** @function getHandInfoLow9
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfoLow9 = function (rank) {
    return exports.getHandInfo(rank, pokerHashes5_1.HASHES_OF_FIVE_LOW9);
};
/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfoAto5 = function (rank) {
    return exports.getHandInfo(rank, pokerHashes5_1.HASHES_OF_FIVE_LOW_Ato5);
};
/** @function getHandInfoAto6
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
exports.getHandInfoAto6 = function (rank) {
    return exports.getHandInfo(rank, pokerHashes5_1.HASHES_OF_FIVE_Ato6);
};
/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
*
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @param {Function} evalFn evaluator defaults to hand of 5 high only
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
exports.bfBestOfFiveOnX = function (hand, evalFn) {
    if (evalFn === void 0) { evalFn = exports.handOfFiveEval; }
    //@ts-ignore
    return Math.max.apply(Math, kombinatoricsJs.combinations(hand, 5).map(function (h) { return evalFn.apply(void 0, h); }));
};
/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} hand array of 6 or more cards making up an hand
 * @param {Function} evalFn evaluator defaults to hand of 5 high only
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.bfBestOfFiveOnXindexed = function (hand, evalFn) {
    if (evalFn === void 0) { evalFn = exports.handOfFiveEvalIndexed; }
    //@ts-ignore
    return Math.max.apply(Math, kombinatoricsJs.combinations(hand, 5).map(function (h) { return evalFn.apply(void 0, h); }));
};
/**to be used in generic verbose eval function  */
var evaluatorByGameType = {
    "high": exports.handOfFiveEvalIndexed,
    "low8": exports.handOfFiveEvalHiLow8Indexed,
    "low9": exports.handOfFiveEvalHiLow9Indexed,
    "Ato5": exports.handOfFiveEvalLow_Ato5Indexed,
    "Ato6": exports.handOfFiveEvalLow_Ato6Indexed,
    "2to7": exports.handOfFiveEvalLowBall27Indexed
};
var evaluatorInfoByGameType = {
    "high": exports.getHandInfo,
    "low8": exports.getHandInfoLow8,
    "low9": exports.getHandInfoLow9,
    "Ato5": exports.getHandInfoAto5,
    "Ato6": exports.getHandInfoAto6,
    "2to7": exports.getHandInfo27
};
/** @function getHandInfo5onX
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
exports.getHandInfo5onX = function (hand, gameType) {
    /** game types decides which HASH and which Evalfunction
     * start from verbose hand info
     * if flush, get flush suit to filter out correct cards --> */
    var combinations = kombinatoricsJs.combinations(hand, 5);
    var winningCards = [];
    return {
        handRank: 875,
        hand: [],
        faces: "SDF",
        handGroup: "",
        winningCards: [],
        flushSuit: 'no flush'
    };
};
exports.bestFiveOnXHiLowIndexed = function (evalFn, hand) {
    var res = { hi: -1, low: -1 };
    //@ts-ignore
    var all = kombinatoricsJs
        .combinations(hand, 5)
        //@ts-ignore
        .map(function (hand) { return evalFn.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? (res.hi = R.hi) : null;
        R.low > res.low ? (res.low = R.low) : null;
    });
    return res;
};
//# sourceMappingURL=pokerEvaluator5.js.map