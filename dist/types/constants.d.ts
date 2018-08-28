/**
 * think of using typed array for performance reasons as these data is accessed very often
 * 8bit or 16bits arrays can be used
 */
import { NumberMap } from './interfaces';
import { NumberToStringMap } from './interfaces';
export declare const flushHash: number[];
export declare const suitsHash: number[];
/**check for !==undefined */
export declare const flush5hHashCheck: Readonly<NumberMap>;
export declare const flush7HashCheck: Readonly<NumberMap>;
export declare const ranksHashOn7: number[];
export declare const ranksHashOn5: number[];
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
export declare const HIGH_CARDS_5_AMOUNT = 1277;
export declare const FLUSHES_BASE_START = 5863;
export declare const handsRankingDelimiter_5cards: number[];
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
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards
 *
 * */
/**
 * @TODO prepare similar stuff for dice suited poker
 *
 * */
