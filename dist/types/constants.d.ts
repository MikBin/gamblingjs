/**
 * think of using typed array for performance reasons as these data is accessed very often
 * 8bit or 16bits arrays can be used
 */
import { NumberMap } from "./interfaces";
export declare const flushHash: number[];
export declare const suitsHash: number[];
/**check for !==undefined */
export declare const flush5hHashCheck: Readonly<NumberMap>;
export declare const flush7HashCheck: Readonly<NumberMap>;
export declare const ranksHashOn7: number[];
export declare const ranksHashOn5: number[];
export declare const deckOfRanks: number[];
export declare const deckOfFlushes: number[];
export declare const deckOfSuits: number[];
export declare const STRAIGHTS: number[][];
export declare const rankCards: number[];
export declare const HIGH_CARDS_5_AMOUNT = 1277;
export declare const FLUSHES_BASE_START = 5863;
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards
 *
 * */
/**
 * @TODO prepare similar stuff for dice suited poker
 *
 * */
