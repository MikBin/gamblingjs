"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @TODO --> pokerEvaluators.ts have to gather all below functions from specific evaluators files
 *  ex deuceToSevenEval.ts, highRankEval.ts... */
var kombinatoricsJs = require("kombinatoricsjs");
var hashesCreator_1 = require("./hashesCreator");
var constants_1 = require("./constants");
var routines_1 = require("./routines");
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
var FLUSH_RANK_SEVEN = exports.HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;
/**LOWBALL DEUCE TO SEVEN HASH ON 7 CARDS*/
exports.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = hashesCreator_1.createRankOf5On7Hashes(exports.HASHES_OF_FIVE, true);
var FLUSH_CHECK_SEVEN_LOWBALL27 = exports.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN_LOWBALL27 = exports.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
var FLUSH_RANK_SEVEN_LOWBALL27 = exports.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;
/**LOW Ato5 HASHES */
exports.HASHES_OF_FIVE_LOW8 = hashesCreator_1.createRankOf5AceToFive_Low8();
var HASH_RANK_FIVE_LOW8 = exports.HASHES_OF_FIVE_LOW8.HASHES;
exports.HASHES_OF_FIVE_LOW9 = hashesCreator_1.createRankOf5AceToFive_Low9();
var HASH_RANK_FIVE_LOW9 = exports.HASHES_OF_FIVE_LOW9.HASHES;
exports.HASEHS_OF_FIVE_LOW_Ato5 = hashesCreator_1.createRankOf5AceToFive_Full();
var HASH_RANK_FIVE_LOW_Ato5 = exports.HASEHS_OF_FIVE_LOW_Ato5.HASHES;
/**LOW Ato5 on 7 cards HASHES */
exports.HASHES_OF_SEVEN_LOW8 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASHES_OF_FIVE_LOW8, constants_1.rankCards_low8);
var HASH_RANK_SEVEN_LOW8 = exports.HASHES_OF_SEVEN_LOW8.HASHES;
exports.HASHES_OF_SEVEN_LOW9 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASHES_OF_FIVE_LOW9, constants_1.rankCards_low9);
var HASH_RANK_SEVEN_LOW9 = exports.HASHES_OF_SEVEN_LOW9.HASHES;
exports.HASEHS_OF_SEVEN_LOW_Ato5 = hashesCreator_1.createRankOf7AceToFive_Low(exports.HASEHS_OF_FIVE_LOW_Ato5, constants_1.rankCards_low, true);
var HASH_RANK_SEVEN_LOW_Ato5 = exports.HASEHS_OF_SEVEN_LOW_Ato5.HASHES;
/**LOW Ato6 HASHES */
var HASHES_OF_FIVE_Ato6 = hashesCreator_1.createRankOf5AceToSix_Full();
var HASH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.HASHES;
var FLUSH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.FLUSH_RANK_HASHES;
exports.HASHES_OF_SEVEN_LOW_Ato6 = hashesCreator_1.createRankOf7AceToSix_Low(HASHES_OF_FIVE_Ato6, constants_1.rankCards_low);
var FLUSH_CHECK_SEVEN_ATO6 = exports.HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN_ATO6 = exports.HASHES_OF_SEVEN_LOW_Ato6.HASHES;
var FLUSH_RANK_SEVEN_ATO6 = exports.HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;
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
/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
exports.handOfFiveEvalHiLow8 = function (c1, c2, c3, c4, c5) {
    return exports.handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW8, c1, c2, c3, c4, c5);
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
    return exports.handOfFiveEvalHiLow(HASH_RANK_FIVE_LOW9, c1, c2, c3, c4, c5);
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
    var rank = HASH_RANK_FIVE_LOW_Ato5[rankKey];
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
    var flush_check_key = FLUSH_CHECK_FIVE[keySum & constants_1.FLUSH_MASK];
    if (flush_check_key >= 0) {
        return FLUSH_RANK_FIVE_ATO6[rankKey];
    }
    return HASH_RANK_FIVE_ATO6[rankKey];
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
/** @function bfBestOfFiveFromTwoSets
 *
 * @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
 * @param {Array:Number[]} handSetB array of sizeB cards representing board cards
 * @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
 * @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.bfBestOfFiveFromTwoSets = function (handSetA, handSetB, nA, nB, evalFn) {
    if (evalFn === void 0) { evalFn = exports.handOfFiveEval; }
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
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, exports.handOfFiveEvalHiLow8);
};
exports.bfBestOfFiveFromTwoSetsHiLow8Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, exports.handOfFiveEvalHiLow8);
};
exports.bfBestOfFiveFromTwoSetsHiLow9 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA, handSetB, nA, nB, exports.handOfFiveEvalHiLow9);
};
exports.bfBestOfFiveFromTwoSetsHiLow9Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSetsHiLow(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, exports.handOfFiveEvalHiLow9);
};
exports.bfBestOfFiveFromTwoSetsHiLow_Ato5 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, exports.handOfFiveEvalLow_Ato5);
};
exports.bfBestOfFiveFromTwoSetsLow_Ato6 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, exports.handOfFiveEvalLow_Ato6);
};
exports.bfBestOfFiveFromTwoSetsLow_Ato6Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, exports.handOfFiveEvalLow_Ato6);
};
exports.bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, exports.handOfFiveEvalLow_Ato5);
};
exports.bfBestOfFiveFromTwoSetsLowBall27 = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA, handSetB, nA, nB, exports.handOfFiveEvalLowBall27);
};
exports.bfBestOfFiveFromTwoSetsLowBall27Indexed = function (handSetA, handSetB, nA, nB) {
    return exports.bfBestOfFiveFromTwoSets(handSetA.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), handSetB.map(function (c) { return constants_1.fullCardsDeckHash_5[c]; }), nA, nB, exports.handOfFiveEvalLowBall27);
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
exports.handOfSevenEvalLowBall27 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = FLUSH_CHECK_SEVEN_LOWBALL27[keySum & constants_1.FLUSH_MASK];
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
    var flush_check_key = FLUSH_CHECK_SEVEN_ATO6[keySum & constants_1.FLUSH_MASK];
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
    var flush_check_key = FLUSH_CHECK_SEVEN[keySum & constants_1.FLUSH_MASK];
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
exports.handOfSevenEvalLow_Ato5 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var rankKey = keySum >>> 9;
    var rank = HASH_RANK_SEVEN_LOW_Ato5[rankKey];
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
    return exports.handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW8, c1, c2, c3, c4, c5, c6, c7);
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
    return exports.handOfSevenEvalHiLow(HASH_RANK_SEVEN_LOW9, c1, c2, c3, c4, c5, c6, c7);
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
/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalIndexed = function (c1, c2, c3, c4, c5, c6) {
    return exports.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6]);
};
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalLowBall27Indexed = function (c1, c2, c3, c4, c5, c6) {
    return exports.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], exports.handOfFiveEvalLowBall27Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto5Indexed = function (c1, c2, c3, c4, c5, c6) {
    return exports.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], exports.handOfFiveEvalLow_Ato5Indexed);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalAto6Indexed = function (c1, c2, c3, c4, c5, c6) {
    return exports.bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6], exports.handOfFiveEvalLow_Ato6Indexed);
};
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSixEvalHiLow8Indexed = function (c1, c2, c3, c4, c5, c6) {
    var res = { hi: -1, low: -1 };
    //@ts-ignore
    var all = kombinatoricsJs.combinations([c1, c2, c3, c4, c5, c6], 5).map(function (hand) { return exports.handOfFiveEvalHiLow8Indexed.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? res.hi = R.hi : null;
        R.low > res.low ? res.low = R.low : null;
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
    var all = kombinatoricsJs.combinations([c1, c2, c3, c4, c5, c6], 5).map(function (hand) { return exports.handOfFiveEvalHiLow9Indexed.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? res.hi = R.hi : null;
        R.low > res.low ? res.low = R.low : null;
    });
    return res;
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
exports.handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7]);
};
/** @function handOfSevenEval_Verbose  @TODO try to reuse
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
exports.handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK, INVERTED) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = exports.HASHES_OF_FIVE_ON_SEVEN; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = exports.HASHES_OF_FIVE; }
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
        handRank = USE_MULTI_FLUSH_RANK ?
            //@ts-ignore
            _FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9]
            : _FLUSH_RANK_SEVEN[flushRankKey >>> 9];
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
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], exports.HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, exports.HASHES_OF_FIVE, true, true);
};
exports.handOfSevenEvalAto6Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], exports.HASHES_OF_SEVEN_LOW_Ato6, HASHES_OF_FIVE_Ato6, false);
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
exports.handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = exports.HASHES_OF_FIVE_ON_SEVEN; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = exports.HASHES_OF_FIVE; }
    if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
};
exports.handOfSevenEvalAto5Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], exports.HASEHS_OF_SEVEN_LOW_Ato5, exports.HASEHS_OF_FIVE_LOW_Ato5, false);
};
exports.handOfSevenEvalLow8Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], exports.HASHES_OF_SEVEN_LOW8, exports.HASHES_OF_FIVE_LOW8, false);
};
exports.handOfSevenEvalLow9Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return exports.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[c1], constants_1.fullCardsDeckHash_7[c2], constants_1.fullCardsDeckHash_7[c3], constants_1.fullCardsDeckHash_7[c4], constants_1.fullCardsDeckHash_7[c5], constants_1.fullCardsDeckHash_7[c6], constants_1.fullCardsDeckHash_7[c7], exports.HASHES_OF_SEVEN_LOW9, exports.HASHES_OF_FIVE_LOW9, false);
};
/** @function getHandInfo
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfo = function (rank, HASHES, INVERTED) {
    if (HASHES === void 0) { HASHES = exports.HASHES_OF_FIVE; }
    if (INVERTED === void 0) { INVERTED = false; }
    return HASHES.rankingInfos[INVERTED ? constants_1.HIGH_MAX_RANK - rank : rank];
};
/** @function getHandInfo27
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfo27 = function (rank) {
    return exports.getHandInfo(rank, exports.HASHES_OF_FIVE, true);
};
/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfoAto5 = function (rank) {
    return exports.getHandInfo(rank, exports.HASEHS_OF_FIVE_LOW_Ato5);
};
/** @function getHandInfoAto6
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
exports.getHandInfoAto6 = function (rank) {
    return exports.getHandInfo(rank, HASHES_OF_FIVE_Ato6);
};
//# sourceMappingURL=pokerEvaluators.js.map