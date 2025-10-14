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

import { fastHashesCreators, fastHashesCreators6 } from '../src/pokerHashes7'

export {
  handOfFiveEvalIndexed,
  getHandInfo,
  handOfSixEvalIndexed,
  getPartialHandStatsIndexed_7
};

/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */

/**
 * @namespace PokerEvaluator
 * @description Provides a comprehensive set of poker hand evaluation functions for various card counts and rule sets.
 */
export const PokerEvaluator = {
  /**
   * @description Contains poker hand evaluation functions for 5, 6, and 7-card hands under different rule sets.
   */
  HandRank: {
    /**
     * @description Evaluation functions for 5-card hands.
     */
    5: {
      /**
       * @description Evaluates a 5-card hand for high rank.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {number} The hand's rank.
       */
      "high": FiveEvaluators.handOfFiveEvalIndexed,
      /**
       * @description Evaluates a 5-card hand for Hi-Low 8-or-better.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low8": FiveEvaluators.handOfFiveEvalHiLow8Indexed,
      /**
       * @description Evaluates a 5-card hand for Hi-Low 9-or-better.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low9": FiveEvaluators.handOfFiveEvalHiLow9Indexed,
      /**
       * @description Evaluates a 5-card hand for A-5 Lowball.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato5": FiveEvaluators.handOfFiveEvalLow_Ato5Indexed,
      /**
       * @description Evaluates a 5-card hand for A-6 Lowball.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato6": FiveEvaluators.handOfFiveEvalLow_Ato6Indexed,
      /**
       * @description Evaluates a 5-card hand for 2-7 Lowball.
       * @function
       * @param {number[]} hand - An array of 5 card indices.
       * @returns {number} The hand's rank.
       */
      "2to7": FiveEvaluators.handOfFiveEvalLowBall27Indexed
    },
    /**
     * @description Evaluation functions for 6-card hands.
     */
    6: {
      /**
       * @description Evaluates a 6-card hand for high rank.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {number} The hand's rank.
       */
      "high": SixEvaluators.handOfSixEvalIndexed,
      /**
       * @description Evaluates a 6-card hand for Hi-Low 8-or-better.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low8": SixEvaluators.handOfSixEvalHiLow8Indexed,
      /**
       * @description Evaluates a 6-card hand for Hi-Low 9-or-better.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low9": SixEvaluators.handOfSixEvalHiLow9Indexed,
      /**
       * @description Evaluates a 6-card hand for A-5 Lowball.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato5": SixEvaluators.handOfSixEvalAto5Indexed,
      /**
       * @description Evaluates a 6-card hand for A-6 Lowball.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato6": SixEvaluators.handOfSixEvalAto6Indexed,
      /**
       * @description Evaluates a 6-card hand for 2-7 Lowball.
       * @function
       * @param {number[]} hand - An array of 6 card indices.
       * @returns {number} The hand's rank.
       */
      "2to7": SixEvaluators.handOfSixEvalLowBall27Indexed
    },
    /**
     * @description Evaluation functions for 7-card hands.
     */
    7: {
      /**
       * @description Evaluates a 7-card hand for high rank.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {number} The hand's rank.
       */
      "high": SevenEvaluators._handOfSevenEvalIndexed,
      /**
       * @description Evaluates a 7-card hand for Hi-Low 8-or-better.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low8": SevenEvaluators._handOfSevenEvalHiLow8Indexed,
      /**
       * @description Evaluates a 7-card hand for Hi-Low 9-or-better.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {hiLowRank} An object containing `hi` and `low` ranks.
       */
      "low9": SevenEvaluators._handOfSevenEvalHiLow9Indexed,
      /**
       * @description Evaluates a 7-card hand for A-5 Lowball.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato5": SevenEvaluators._handOfSevenEvalLow_Ato5Indexed,
      /**
       * @description Evaluates a 7-card hand for A-6 Lowball.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {number} The hand's rank.
       */
      "Ato6": SevenEvaluators._handOfSevenEval_Ato6Indexed,
      /**
       * @description Evaluates a 7-card hand for 2-7 Lowball.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {number} The hand's rank.
       */
      "2to7": SevenEvaluators._handOfSevenEvalLowBall27Indexed
    }
  },
  /**
   * @description Provides verbose hand evaluation, returning detailed information about the hand.
   */
  HandRankVerbose: {
    /**
     * @description Provides verbose evaluation for 7-card hands.
     */
    7: {
      /**
       * @description Evaluates a 7-card hand for high rank and returns detailed information.
       * @function
       * @param {number[]} hand - An array of 7 card indices.
       * @returns {verboseHandInfo} An object with detailed hand information.
       */
      "high": SevenEvaluators.handOfSevenEvalIndexed_Verbose
    }
  },
  /**
   * @description Dynamically loads pre-computed hash tables for faster 7-card hand evaluations.
   */
  hashLoaders: {
    /**
     * @description Hash loaders for 6-card hands (currently not implemented).
     */
    6: {
      "high": () => {
        fastHashesCreators6.high();
        PokerEvaluator.HandRank[6].high = SixEvaluators.handOfSixEvalIndexed;
      },
      "low8": () => {
        fastHashesCreators6.low8();
        PokerEvaluator.HandRank[6].low8 = SixEvaluators.handOfSixEvalHiLow8Indexed;
      },
      "low9": () => {
        fastHashesCreators6.low9();
        PokerEvaluator.HandRank[6].low9 = SixEvaluators.handOfSixEvalHiLow9Indexed;
      },
      "Ato5": () => {
        fastHashesCreators6.Ato5();
        PokerEvaluator.HandRank[6].Ato5 = SixEvaluators.handOfSixEvalAto5Indexed;
      },
      "Ato6": () => {
        fastHashesCreators6.Ato6();
        PokerEvaluator.HandRank[6].Ato6 = SixEvaluators.handOfSixEvalAto6Indexed;
      },
      "2to7": () => {
        fastHashesCreators6["2to7"]();
        PokerEvaluator.HandRank[6]["2to7"] = SixEvaluators.handOfSixEvalLowBall27Indexed;
      }
    },
    /**
     * @description Hash loaders for 7-card hands.
     */
    7: {
      /**
       * @description Loads the hash table for 7-card high hand evaluation.
       * @function
       */
      "high": () => {
        fastHashesCreators.high();
        PokerEvaluator.HandRank[7].high = SevenEvaluators.handOfSevenEvalIndexed;
      },
      /**
       * @description Loads the hash table for 7-card Hi-Low 8-or-better evaluation.
       * @function
       */
      "low8": () => {
        fastHashesCreators.low8();
        PokerEvaluator.HandRank[7].low8 = SevenEvaluators.handOfSevenEvalHiLow8Indexed;
      },
      /**
       * @description Loads the hash table for 7-card Hi-Low 9-or-better evaluation.
       * @function
       */
      "low9": () => {
        fastHashesCreators.low9();
        PokerEvaluator.HandRank[7].low9 = SevenEvaluators.handOfSevenEvalHiLow9Indexed;
      },
      /**
       * @description Loads the hash table for 7-card A-5 Lowball evaluation.
       * @function
       */
      "Ato5": () => {
        fastHashesCreators.Ato5();
        PokerEvaluator.HandRank[7].Ato5 = SevenEvaluators.handOfSevenEvalLow_Ato5Indexed;
      },
      /**
       * @description Loads the hash table for 7-card A-6 Lowball evaluation.
       * @function
       */
      "Ato6": () => {
        fastHashesCreators.Ato6();
        PokerEvaluator.HandRank[7].Ato6 = SevenEvaluators.handOfSevenEval_Ato6Indexed;
      },
      /**
       * @description Loads the hash table for 7-card 2-7 Lowball evaluation.
       * @function
       */
      "2to7": () => {
        fastHashesCreators["2to7"]();
        PokerEvaluator.HandRank[7]["2to7"] = SevenEvaluators.handOfSevenEvalLowBall27Indexed;
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
