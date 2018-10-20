"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluator5_1 = require("./pokerEvaluator5");
exports.handOfFiveEvalIndexed = pokerEvaluator5_1.handOfFiveEvalIndexed;
exports.getHandInfo = pokerEvaluator5_1.getHandInfo;
var pokerEvaluator6_1 = require("./pokerEvaluator6");
exports.handOfSixEvalIndexed = pokerEvaluator6_1.handOfSixEvalIndexed;
var pokerEvaluator7_1 = require("./pokerEvaluator7");
exports.handOfSevenEvalIndexed = pokerEvaluator7_1.handOfSevenEvalIndexed;
exports.handOfSevenEvalIndexed_Verbose = pokerEvaluator7_1.handOfSevenEvalIndexed_Verbose;
/* istanbul ignore next */
var pokerMontecarloSym_1 = require("./pokerMontecarloSym");
exports.getPartialHandStatsIndexed_7 = pokerMontecarloSym_1.getPartialHandStatsIndexed_7;
/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */
exports.FIVE_CARD_POKER_EVAL = {
    HandRank: {
        5: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            "2to7": function () { }
        },
        6: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            "2to7": function () { }
        },
        7: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            "2To7": function () { }
        }
    },
    /**generate hashesofSeven and set  FIVE_CARD_POKER_EVAL.HandRank.7.high = fastEvalfunction
     * @TODO create verbose to work starting from numericRank and fullHand array, drawing flushy cards always in the same way
     * whther faster hashes are generated or not
     * if hashes are not generated use the basic version...
    */
    hashLoaders: {
        6: {},
        7: {
            high: function () { },
            low8: function () { },
            low9: function () { },
            Ato5: function () { },
            Ato6: function () { },
            "2to7": function () { }
        }
    }
};
/*
export const getTableSlice = (startIdx: number, keys: number[], gapSize: number = 1) => {
  let count: number = 0;
  let i = startIdx + 1;
  let slice = {
    start: startIdx,
    end: startIdx,
    values: [keys[startIdx]]
  };
  let nogap = true;
  while (i < keys.length && nogap) {
    if (keys[i] - keys[i - 1] > gapSize) {
      nogap = false;
    } else {
      slice.end = i;
      slice.values.push(keys[i]);
      i++;
    }
  }

  return slice;
};

export const splitHashTable = (hashTable: Object,gapSize=1) => {
  let splitted = [];
  let keys = Object.keys(hashTable).map(v=>parseInt(v));
  keys.sort((a,b)=>{return a-b});
  console.log(keys);
  let aSlice = getTableSlice(0,keys,gapSize);
  while(aSlice.end<keys.length-1) {
    splitted.push(aSlice);
    aSlice = getTableSlice(aSlice.end+1,keys,gapSize);
  }
console.log(splitted);
};

console.log(splitHashTable(HASHES_OF_FIVE_ON_SEVEN.HASHES,1000));

*/
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio and the various caisino video poker*/
//# sourceMappingURL=gamblingjs.js.map