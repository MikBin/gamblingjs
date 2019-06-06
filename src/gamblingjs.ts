import {
  handOfFiveEvalIndexed,
  getHandInfo
} from './pokerEvaluator5';
import {
  handOfSixEvalIndexed
} from './pokerEvaluator6';

/* istanbul ignore next */
import { getPartialHandStatsIndexed_7 } from './pokerMontecarloSym';

import * as FiveEvaluators from './pokerEvaluator5'
import * as SevenEvaluators from './pokerEvaluator7'
import * as SixEvaluators from './pokerEvaluator6'

import { fastHashesCreators } from '../src/pokerHashes7'

export {
  handOfFiveEvalIndexed,
  getHandInfo,
  handOfSixEvalIndexed,
  getPartialHandStatsIndexed_7
};

/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */

export const FIVE_CARD_POKER_EVAL = {
  HandRank: {
    5: {
      "high": FiveEvaluators.handOfFiveEvalIndexed,
      "low8": FiveEvaluators.handOfFiveEvalHiLow8Indexed,
      "low9": FiveEvaluators.handOfFiveEvalHiLow9Indexed,
      "Ato5": FiveEvaluators.handOfFiveEvalLow_Ato5Indexed,
      "Ato6": FiveEvaluators.handOfFiveEvalLow_Ato6Indexed,
      "2to7": FiveEvaluators.handOfFiveEvalLowBall27Indexed
    },
    6: {
      /**@TODO to be renamed with _  and looks same as 5 and 7 evaluators */
      "high": SixEvaluators.handOfSixEvalIndexed,
      "low8": SixEvaluators.handOfSixEvalHiLow8Indexed,
      "low9": SixEvaluators.handOfSixEvalHiLow9Indexed,
      "Ato5": SixEvaluators.handOfSixEvalAto5Indexed,
      "Ato6": SixEvaluators.handOfSixEvalAto6Indexed,
      "2to7": SixEvaluators.handOfSixEvalLowBall27Indexed
    },
    7: {
      "high": SevenEvaluators._handOfSevenEvalIndexed,
      "low8": SevenEvaluators._handOfSevenEvalHiLow8Indexed,
      "low9": SevenEvaluators._handOfSevenEvalHiLow9Indexed,
      "Ato5": SevenEvaluators._handOfSevenEvalLow_Ato5Indexed,
      "Ato6": SevenEvaluators._handOfSevenEval_Ato6Indexed,
      "2to7": SevenEvaluators._handOfSevenEvalLowBall27Indexed
    }
  },
  HandRankVerbose: {},
  hashLoaders: {
    6: {
      "high": () => {
        throw Error("method not yet implemented");
      },
      "low8": () => {
        throw Error("method not yet implemented");
      },
      "low9": () => {
        throw Error("method not yet implemented");
      },
      "Ato5": () => {
        throw Error("method not yet implemented");
      },
      "Ato6": () => {
        throw Error("method not yet implemented");
      },
      "2to7": () => {
        throw Error("method not yet implemented");
      }
    },
    7: {
      "high": () => {
        fastHashesCreators.high();
        FIVE_CARD_POKER_EVAL.HandRank[7].high = SevenEvaluators.handOfSevenEvalIndexed;
      },
      "low8": () => {
        fastHashesCreators.low8();
        FIVE_CARD_POKER_EVAL.HandRank[7].low8 = SevenEvaluators.handOfSevenEvalHiLow8Indexed;
      },
      "low9": () => {
        fastHashesCreators.low9();
        FIVE_CARD_POKER_EVAL.HandRank[7].low9 = SevenEvaluators.handOfSevenEvalHiLow9Indexed;
      },
      "Ato5": () => {
        fastHashesCreators.Ato5();
        FIVE_CARD_POKER_EVAL.HandRank[7].Ato5 = SevenEvaluators.handOfSevenEvalLow_Ato5Indexed;
      },
      "Ato6": () => {
        fastHashesCreators.Ato6();
        FIVE_CARD_POKER_EVAL.HandRank[7].Ato6 = SevenEvaluators.handOfSevenEval_Ato6Indexed;
      },
      "2to7": () => {
        fastHashesCreators["2to7"]();
        FIVE_CARD_POKER_EVAL.HandRank[7]["2to7"] = SevenEvaluators.handOfSevenEvalLowBall27Indexed;
      }
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
