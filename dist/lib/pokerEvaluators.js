"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var hashesCreator_1 = require("./hashesCreator");
var constants_1 = require("./constants");
exports.HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
var FLUSH_CHECK_FIVE = exports.HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
var HASH_RANK_FIVE = exports.HASHES_OF_FIVE.HASHES;
var FLUSH_RANK_FIVE = exports.HASHES_OF_FIVE.FLUSH_RANK_HASHES;
exports.HASHES_OF_FIVE_ON_SEVEN = hashesCreator_1.createRankOf5On7Hashes(exports.HASHES_OF_FIVE);
var FLUSH_CHECK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.HASHES;
var FLUSH_RANK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES;
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
        var flushRankKey = ((c1 & constants_1.FLUSH_MASK) == flush_check_key) * c1 + ((c2 & constants_1.FLUSH_MASK) == flush_check_key) * c2 +
            //@ts-ignore
            ((c3 & constants_1.FLUSH_MASK) == flush_check_key) * c3 + ((c4 & constants_1.FLUSH_MASK) == flush_check_key) * c4 +
            //@ts-ignore
            ((c5 & constants_1.FLUSH_MASK) == flush_check_key) * c5 + ((c6 & constants_1.FLUSH_MASK) == flush_check_key) * c6 + ((c7 & constants_1.FLUSH_MASK) == flush_check_key) * c7;
        handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = HASH_RANK_SEVEN[keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/**@TODO getHandInfo(rank:number) */ 
//# sourceMappingURL=pokerEvaluators.js.map