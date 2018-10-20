import {
  handOfFiveEvalIndexed,
  getHandInfo
} from './pokerEvaluator5';
import {
  handOfSixEvalIndexed
} from './pokerEvaluator6';
import {
  handOfSevenEvalIndexed,
  handOfSevenEvalIndexed_Verbose
} from './pokerEvaluator7';
/* istanbul ignore next */
import { getPartialHandStatsIndexed_7 } from './pokerMontecarloSym';

import { HASH_RANK_FIVE } from './pokerHashes5'

export {
  handOfSevenEvalIndexed,
  handOfFiveEvalIndexed,
  getHandInfo,
  handOfSevenEvalIndexed_Verbose,
  handOfSixEvalIndexed,
  getPartialHandStatsIndexed_7
};

/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */

export const FIVE_CARD_POKER_EVAL = {
  HandRank: {
    5: {
      high: () => { },
      low8: () => { },
      low9: () => { },
      Ato5: () => { },
      Ato6: () => { },
      "2to7": () => { }
    },
    6: {
      high: () => { },
      low8: () => { },
      low9: () => { },
      Ato5: () => { },
      Ato6: () => { },
      "2to7": () => { }
    },
    7: {
      high: () => { },
      low8: () => { },
      low9: () => { },
      Ato5: () => { },
      Ato6: () => { },
      "2To7": () => { }
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
      high: () => { },
      low8: () => { },
      low9: () => { },
      Ato5: () => { },
      Ato6: () => { },
      "2to7": () => { }
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
