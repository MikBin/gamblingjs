"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var pokerEvaluator5_1 = require("./pokerEvaluator5");
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalIndexed = function (c1, c2, c3, c4, c5, c6) {
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6]);
};
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalLowBall27Indexed = function (c1, c2, c3, c4, c5, c6) {
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], pokerEvaluator5_1.handOfFiveEvalLowBall27Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto5Indexed = function (c1, c2, c3, c4, c5, c6) {
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto6Indexed = function (c1, c2, c3, c4, c5, c6) {
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed);
};
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalHiLow8Indexed = function (c1, c2, c3, c4, c5, c6) {
    var res = { hi: -1, low: -1 };
    var all = kombinatoricsJs
        .combinations([c1, c2, c3, c4, c5, c6], 5)
        //@ts-ignore
        .map(function (hand) { return pokerEvaluator5_1.handOfFiveEvalHiLow8Indexed.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? (res.hi = R.hi) : null;
        R.low > res.low ? (res.low = R.low) : null;
    });
    return res;
};
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalHiLow9Indexed = function (c1, c2, c3, c4, c5, c6) {
    var res = { hi: -1, low: -1 };
    //@ts-ignore
    var all = kombinatoricsJs
        .combinations([c1, c2, c3, c4, c5, c6], 5)
        //@ts-ignore
        .map(function (hand) { return pokerEvaluator5_1.handOfFiveEvalHiLow9Indexed.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? (res.hi = R.hi) : null;
        R.low > res.low ? (res.low = R.low) : null;
    });
    return res;
};
//# sourceMappingURL=pokerEvaluator6.js.map