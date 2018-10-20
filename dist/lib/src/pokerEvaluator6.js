"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluator5_1 = require("./pokerEvaluator5");
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalIndexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand);
};
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalLowBall27Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLowBall27Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto5Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto6Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bfBestOfFiveOnXindexed(hand, pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed);
};
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalHiLow8Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bestFiveOnXHiLowIndexed(pokerEvaluator5_1.handOfFiveEvalHiLow8Indexed, hand);
};
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalHiLow9Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return pokerEvaluator5_1.bestFiveOnXHiLowIndexed(pokerEvaluator5_1.handOfFiveEvalHiLow9Indexed, hand);
};
/** @TODO verbose versions (taking again the one from 5 cards hand) */
//# sourceMappingURL=pokerEvaluator6.js.map