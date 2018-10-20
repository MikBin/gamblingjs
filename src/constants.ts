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

export const flushHash: number[] = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]; // to be implemented to speed up flushcheck on 7

export const suitsHash: number[] = [0, 57, 1, 8]; // 4 one for each suit

/**check for !==undefined */
export const flush5hHashCheck: Readonly<NumberMap> = {
  '0': 0,
  '5': 1,
  '40': 8,
  '285': 57
};
export const flushHashToName: Readonly<NumberToStringMap> = {
  0: 'spades',
  1: 'diamonds',
  8: 'hearts',
  57: 'clubs'
};

export const flush7HashCheck: Readonly<NumberMap> = {
  '0': 0,
  '1': 0,
  '2': 0,
  '5': 1,
  '6': 1,
  '7': 1,
  '8': 0,
  '9': 0,
  '13': 1,
  '14': 1,
  '16': 0,
  '21': 1,
  '40': 8,
  '41': 8,
  '42': 8,
  '48': 8,
  '49': 8,
  '56': 8,
  '57': 0,
  '58': 0,
  '62': 1,
  '63': 1,
  '65': 0,
  '70': 1,
  '97': 8,
  '98': 8,
  '105': 8,
  '114': 0,
  '119': 1,
  '154': 8,
  '285': 57,
  '286': 57,
  '287': 57,
  '293': 57,
  '294': 57,
  '301': 57,
  '342': 57,
  '343': 57,
  '350': 57,
  '399': 57
};

export const ranksHashOn7: number[] = []; // 13 one for each rank

ranksHashOn7[0] = 0;
ranksHashOn7[1] = 1;
ranksHashOn7[2] = 5;
ranksHashOn7[3] = 22;
ranksHashOn7[4] = 98;
ranksHashOn7[5] = 453;
ranksHashOn7[6] = 2031;
ranksHashOn7[7] = 8698;
ranksHashOn7[8] = 22854;
ranksHashOn7[9] = 83661;
ranksHashOn7[10] = 262349;
ranksHashOn7[11] = 636345;
ranksHashOn7[12] = 1479181;
/** @TODO make it like below */
export const ranksHashOn5: number[] = []; // one for each rank

ranksHashOn5[0] = 0; // 2
ranksHashOn5[1] = 1; // 3
ranksHashOn5[2] = 5; // 4
ranksHashOn5[3] = 22; // 5
ranksHashOn5[4] = 94; // 6
ranksHashOn5[5] = 312; // 7
ranksHashOn5[6] = 992; // 8
ranksHashOn5[7] = 2422; // 9
ranksHashOn5[8] = 5624; // 10
ranksHashOn5[9] = 12522; // J
ranksHashOn5[10] = 19998; // Q
ranksHashOn5[11] = 43258; // K
ranksHashOn5[12] = 79415; // A

/** @TODO to be tested tuples for hasof5 and 7 */

export const rankToFaceSymbol: string[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A'
];
export const suitToFaceSymbol: string[] = ['s', 'd', 'h', 'c'];
/* 
arrays initialization
*/
export const deckOfRanks_5: number[] = new Array(52);
export const deckOfRanks_7: number[] = new Array(52);
export const deckOfFlushes: number[] = new Array(52);
export const deckOfSuits: number[] = new Array(52);

export const fullCardsDeckHash_5: number[] = new Array(52);
export const fullCardsDeckHash_7: number[] = new Array(52);

export const cardHashToDescription_5: NumberToStringMap = {};
export const cardHashToDescription_7: NumberToStringMap = {};

for (let i: number = 0; i < 52; i++) {
  deckOfRanks_5[i] = ranksHashOn5[i % 13];
  deckOfRanks_7[i] = ranksHashOn7[i % 13];
  deckOfFlushes[i] = flushHash[i % 13];
  deckOfSuits[i] = suitsHash[~~(i / 13)];

  let card5 = (fullCardsDeckHash_5[i] = (deckOfRanks_5[i] << 9) + deckOfSuits[i]);
  let card7 = (fullCardsDeckHash_7[i] = (deckOfRanks_7[i] << 9) + deckOfSuits[i]);
  cardHashToDescription_5[card5] = i;
  cardHashToDescription_7[card7] = i;
}

export const STRAIGHTS: number[][] = [
  [12, 0, 1, 2, 3],
  [0, 1, 2, 3, 4],
  [1, 2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7],
  [4, 5, 6, 7, 8],
  [5, 6, 7, 8, 9],
  [6, 7, 8, 9, 10],
  [7, 8, 9, 10, 11],
  [8, 9, 10, 11, 12]
];

export const rankCards: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const rankCards_low8: number[] = [6, 5, 4, 3, 2, 1, 0, 12];
export const rankCards_low9: number[] = [7, 6, 5, 4, 3, 2, 1, 0, 12];
export const rankCards_low: number[] = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
export const HIGH_CARDS_5_AMOUNT: number = 1277;
export const FLUSHES_BASE_START: number = 5863;
export const STRAIGHT_FLUSH_BASE_START: number = 7452;
export const HIGH_MAX_RANK: number = 7461;
export const FLUSH_MASK: number = 511;
export const STRAIGHT_FLUSH_OFFSET: number = 1599;
export const handsRankingDelimiter_5cards: number[] = [
  1276,
  4136,
  4994,
  5852,
  5862,
  7139,
  7295,
  7451,
  7461
];

export const handsRankingDelimiter_Ato5_5cards: number[] = [155, 311, 1169, 2027, 4887, 6174];
export const handsRankingDelimiter_Ato6_5cards: number[] = handsRankingDelimiter_5cards.map(
  r => 7461 - r
);
handsRankingDelimiter_Ato6_5cards.pop();
handsRankingDelimiter_Ato6_5cards.reverse().push(7461);
//console.log(handsRankingDelimiter_Ato6_5cards);
export const handRankingGroupNames_Ato5: string[] = [
  'four of a kind',
  'full house',
  'three of a kind',
  'two pair',
  'one pair',
  'high card'
];

export const handRankingGroupNames: string[] = [
  'high card',
  'one pair',
  'two pair',
  'three of a kind',
  'straight',
  'flush',
  'full house',
  'four of a kind',
  'straight flush'
];

export const handRankingGroupNames_Ato6: string[] = handRankingGroupNames.slice().reverse();

/**
 * fill with these:
 * https://en.wikipedia.org/wiki/Poker_probability
 */
export const distinctHandsQuantityByGroup = {
  HIGH_CARD: 1277,
  ONE_PAIR: 2860,
  TWO_PAIR: 858,
  THREE_OF_A_KIND: 858,
  STRAIGHT: 10,
  FLUSH: 1277,
  FULL_HOUSE: 156,
  FOUR_OF_A_KIND: 156,
  STRAIGHT_FLUSH: 10
};

export const enum gameType {
  HIGH, Ato5, Ato6, _2to7, LOW8, LOW9
}
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards, just invert ranking of flush and fulls...
 *
 * */
