"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluators_1 = require("./pokerEvaluators");
exports.handOfSevenEvalIndexed = pokerEvaluators_1.handOfSevenEvalIndexed;
exports.handOfFiveEvalIndexed = pokerEvaluators_1.handOfFiveEvalIndexed;
exports.getHandInfo = pokerEvaluators_1.getHandInfo;
exports.handOfSevenEvalIndexed_Verbose = pokerEvaluators_1.handOfSevenEvalIndexed_Verbose;
exports.handOfSixEvalIndexed = pokerEvaluators_1.handOfSixEvalIndexed;
/* istanbul ignore next */
var pokerMontecarloSym_1 = require("./pokerMontecarloSym");
exports.getPartialHandStatsIndexed_7 = pokerMontecarloSym_1.getPartialHandStatsIndexed_7;
var pokerHashes5_1 = require("./pokerHashes5");
exports.HASH_RANK_FIVE = pokerHashes5_1.HASH_RANK_FIVE;
var pokerEvaluators_2 = require("./pokerEvaluators");
exports.HASHES_OF_FIVE_ON_SEVEN = pokerEvaluators_2.HASHES_OF_FIVE_ON_SEVEN;
/**@TODO create a config module, if development build all hashes? or used to preconfigure the library? */
exports.FIVE_CARD_POKER_EVAL = {
    HandRank: {
        5: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            _2to7: function () { }
        },
        6: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            _2to7: function () { }
        },
        7: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            _2To7: function () { }
        }
    },
    /**generate hashesofSeven and set  FIVE_CARD_POKER_EVAL.HandRank.7.high = fastEvalfunction
     * @TODO create verbose to work starting from numericRank and fullHand array, drawing flushy cards always in the same way
     * whther faster hashes are generated or not
    */
    hashLoaders: {
        6: {},
        7: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            _2to7: function () { }
        }
    }
};
exports.getTableSlice = function (startIdx, keys, gapSize) {
    if (gapSize === void 0) { gapSize = 1; }
    var count = 0;
    var i = startIdx + 1;
    var slice = {
        start: startIdx,
        end: startIdx,
        values: [keys[startIdx]]
    };
    var nogap = true;
    while (i < keys.length && nogap) {
        if (keys[i] - keys[i - 1] > gapSize) {
            nogap = false;
        }
        else {
            slice.end = i;
            slice.values.push(keys[i]);
            i++;
        }
    }
    return slice;
};
exports.splitHashTable = function (hashTable, gapSize) {
    if (gapSize === void 0) { gapSize = 1; }
    var splitted = [];
    var keys = Object.keys(hashTable).map(function (v) { return parseInt(v); });
    keys.sort(function (a, b) { return a - b; });
    console.log(keys);
    var aSlice = exports.getTableSlice(0, keys, gapSize);
    while (aSlice.end < keys.length - 1) {
        splitted.push(aSlice);
        aSlice = exports.getTableSlice(aSlice.end + 1, keys, gapSize);
    }
    console.log(splitted);
};
console.log(exports.splitHashTable(pokerEvaluators_2.HASHES_OF_FIVE_ON_SEVEN.HASHES, 1000));
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio and the various caisino video poker*/
//# sourceMappingURL=gamblingjs.js.map