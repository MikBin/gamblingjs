import { handOfFiveEvalIndexed, getHandInfo } from './pokerEvaluator5';
import { handOfSixEvalIndexed } from './pokerEvaluator6';
import { handOfSevenEvalIndexed, handOfSevenEvalIndexed_Verbose } from './pokerEvaluator7';
import { getPartialHandStatsIndexed_7 } from './pokerMontecarloSym';
export { handOfSevenEvalIndexed, handOfFiveEvalIndexed, getHandInfo, handOfSevenEvalIndexed_Verbose, handOfSixEvalIndexed, getPartialHandStatsIndexed_7 };
/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */
export declare const FIVE_CARD_POKER_EVAL: {
    HandRank: {
        5: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            "2to7": () => void;
        };
        6: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            "2to7": () => void;
        };
        7: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            "2To7": () => void;
        };
    };
    /**generate hashesofSeven and set  FIVE_CARD_POKER_EVAL.HandRank.7.high = fastEvalfunction
     * @TODO create verbose to work starting from numericRank and fullHand array, drawing flushy cards always in the same way
     * whther faster hashes are generated or not
     * if hashes are not generated use the basic version...
    */
    hashLoaders: {
        6: {};
        7: {
            high: () => void;
            low8: () => void;
            low9: () => void;
            Ato5: () => void;
            Ato6: () => void;
            "2to7": () => void;
        };
    };
};
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio and the various caisino video poker*/
