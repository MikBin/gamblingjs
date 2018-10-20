"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var constants_1 = require("./constants");
var pokerEvaluator5_1 = require("./pokerEvaluator5");
/** @function bfBestOfFiveFromTwoSets  @TODO make verbose version
 *
 * @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
 * @param {Array:Number[]} handSetB array of sizeB cards representing board cards
 * @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
 * @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.bfBestOfFiveFromTwoSets = function (handSetA, handSetB, nA, nB, evalFn) {
    if (evalFn === void 0) { evalFn = pokerEvaluator5_1.handOfFiveEval; }
    if (nA + nB !== 5) {
        throw new RangeError('sum of nA+nB parameters MUST be 5');
    }
    var setACombinations = kombinatoricsJs.combinations(handSetA, nA);
    var setBCombinations = kombinatoricsJs.combinations(handSetB, nB);
    var maxRank = 0;
    setACombinations.forEach(function (handA, idxA) {
        setBCombinations.forEach(function (handB, idxB) {
            //@ts-ignore
            var rank = evalFn.apply(void 0, handA.concat(handB));
            rank > maxRank ? (maxRank = rank) : null;
        });
    });
    return maxRank;
};
exports.bfBestOfFiveFromTwoSetsHiLow = function (handSetA, handSetB, nA, nB, evalFn) {
    if (nA + nB !== 5) {
        throw new RangeError('sum of nA+nB parameters MUST be 5');
    }
    var setACombinations = kombinatoricsJs.combinations(handSetA, nA);
    var setBCombinations = kombinatoricsJs.combinations(handSetB, nB);
    var maxRank = { hi: 0, low: -1 };
    setACombinations.forEach(function (handA, idxA) {
        setBCombinations.forEach(function (handB, idxB) {
            //@ts-ignore
            var hlRank = evalFn.apply(void 0, handA.concat(handB));
            hlRank.hi > maxRank.hi ? (maxRank.hi = hlRank.hi) : null;
            hlRank.low > maxRank.low ? (maxRank.low = hlRank.low) : null;
        });
    });
    return maxRank;
};
exports.bfBestOfFiveFromTwoSetsHiLow8 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, pokerEvaluator5_1.handOfFiveEvalHiLow8);
};
exports.bfBestOfFiveFromTwoSetsHiLow8Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, pokerEvaluator5_1.handOfFiveEvalHiLow8);
};
exports.bfBestOfFiveFromTwoSetsHiLow9 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, pokerEvaluator5_1.handOfFiveEvalHiLow9);
};
exports.bfBestOfFiveFromTwoSetsHiLow9Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, pokerEvaluator5_1.handOfFiveEvalHiLow9);
};
exports.bfBestOfFiveFromTwoSetsHiLow_Ato5 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, pokerEvaluator5_1.handOfFiveEvalLow_Ato5);
};
exports.bfBestOfFiveFromTwoSetsLow_Ato6 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, pokerEvaluator5_1.handOfFiveEvalLow_Ato6);
};
exports.bfBestOfFiveFromTwoSetsLow_Ato6Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, pokerEvaluator5_1.handOfFiveEvalLow_Ato6);
};
exports.bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, pokerEvaluator5_1.handOfFiveEvalLow_Ato5);
};
exports.bfBestOfFiveFromTwoSetsLowBall27 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, pokerEvaluator5_1.handOfFiveEvalLowBall27);
};
exports.bfBestOfFiveFromTwoSetsLowBall27Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, pokerEvaluator5_1.handOfFiveEvalLowBall27);
};
//# sourceMappingURL=pokerEvaluatorTwoSets.js.map