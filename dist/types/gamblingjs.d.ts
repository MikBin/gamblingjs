import { handOfSevenEvalIndexed, handOfFiveEvalIndexed, getHandInfo, handOfSevenEvalIndexed_Verbose, handOfSixEvalIndexed } from './pokerEvaluators';
import { getPartialHandStatsIndexed_7 } from './pokerMontecarloSym';
import { HASH_RANK_FIVE } from './pokerHashes5';
import { HASHES_OF_FIVE_ON_SEVEN } from './pokerEvaluators';
export { HASH_RANK_FIVE, HASHES_OF_FIVE_ON_SEVEN };
export { handOfSevenEvalIndexed, handOfFiveEvalIndexed, getHandInfo, handOfSevenEvalIndexed_Verbose, handOfSixEvalIndexed, getPartialHandStatsIndexed_7 };
/**@TODO create a config module, if development build all hashes? or used to preconfigure the library? */
export declare const FIVE_CARD_POKER_EVAL: {
    HandRank: {
        5: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            _2to7: () => void;
        };
        6: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            _2to7: () => void;
        };
        7: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            _2To7: () => void;
        };
    };
    /**generate hashesofSeven and set  FIVE_CARD_POKER_EVAL.HandRank.7.high = fastEvalfunction
     * @TODO create verbose to work starting from numericRank and fullHand array, drawing flushy cards always in the same way
     * whther faster hashes are generated or not
    */
    hashLoaders: {
        6: {};
        7: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            _2to7: () => void;
        };
    };
};
export declare const getTableSlice: (startIdx: number, keys: number[], gapSize?: number) => {
    start: number;
    end: number;
    values: number[];
};
export declare const splitHashTable: (hashTable: Object, gapSize?: number) => void;
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio and the various caisino video poker*/
