/**
 * think of using typed array for performance reasons as these data is accessed very often
 * 8bit or 16bits arrays can be used
 */
/**OpenDyslexicMono
 * Go Mono
 * http://app.programmingfonts.org/#go-mono
 */
import { NumberMap } from './interfaces';
import { NumberToStringMap } from './interfaces';
export declare const flushHash: number[];
export declare const suitsHash: number[];
/**check for !==undefined */
export declare const flush5hHashCheck: Readonly<NumberMap>;
export declare const flushHashToName: Readonly<NumberToStringMap>;
export declare const flush7HashCheck: Readonly<NumberMap>;
export declare const ranksHashOn7: number[];
/** @TODO make it like below */
export declare const ranksHashOn5: number[];
/** @TODO to be tested tuples for hasof5 and 7 */
export declare const rankToFaceSymbol: string[];
export declare const suitToFaceSymbol: string[];
export declare const deckOfRanks_5: number[];
export declare const deckOfRanks_7: number[];
export declare const deckOfFlushes: number[];
export declare const deckOfSuits: number[];
export declare const fullCardsDeckHash_5: number[];
export declare const fullCardsDeckHash_7: number[];
export declare const cardHashToDescription_5: NumberToStringMap;
export declare const cardHashToDescription_7: NumberToStringMap;
export declare const STRAIGHTS: number[][];
export declare const rankCards: number[];
export declare const rankCards_low8: number[];
export declare const rankCards_low9: number[];
export declare const rankCards_low: number[];
export declare const HIGH_CARDS_5_AMOUNT: number;
export declare const FLUSHES_BASE_START: number;
export declare const STRAIGHT_FLUSH_BASE_START: number;
export declare const HIGH_MAX_RANK: number;
export declare const FLUSH_MASK: number;
export declare const STRAIGHT_FLUSH_OFFSET: number;
export declare const handsRankingDelimiter_5cards: number[];
export declare const handsRankingDelimiter_Ato5_5cards: number[];
export declare const handsRankingDelimiter_Ato6_5cards: number[];
export declare const handRankingGroupNames_Ato5: string[];
export declare const handRankingGroupNames: string[];
export declare const handRankingGroupNames_Ato6: string[];
/**
 * fill with these:
 * https://en.wikipedia.org/wiki/Poker_probability
 */
export declare const distinctHandsQuantityByGroup: {
    HIGH_CARD: number;
    ONE_PAIR: number;
    TWO_PAIR: number;
    THREE_OF_A_KIND: number;
    STRAIGHT: number;
    FLUSH: number;
    FULL_HOUSE: number;
    FOUR_OF_A_KIND: number;
    STRAIGHT_FLUSH: number;
};
export declare const enum gameType {
    HIGH = 0,
    Ato5 = 1,
    Ato6 = 2,
    _2to7 = 3,
    LOW8 = 4,
    LOW9 = 5
}
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards, just invert ranking of flush and fulls...
 *
 * */
