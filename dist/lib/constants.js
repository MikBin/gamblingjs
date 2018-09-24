"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 255, 508, 1012, 2016, 4016]; // 13 one for each rank
exports.suitsHash = [0, 57, 1, 8]; // 4 one for each suit
/**check for !==undefined */
exports.flush5hHashCheck = {
    '0': 0,
    '5': 1,
    '40': 8,
    '285': 57
};
exports.flushHashToName = {
    0: 'spades',
    1: 'diamonds',
    8: 'hearts',
    9: 'clubs'
};
exports.flush7HashCheck = {
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
exports.ranksHashOn7 = []; // 13 one for each rank
exports.ranksHashOn7[0] = 0;
exports.ranksHashOn7[1] = 1;
exports.ranksHashOn7[2] = 5;
exports.ranksHashOn7[3] = 22;
exports.ranksHashOn7[4] = 98;
exports.ranksHashOn7[5] = 453;
exports.ranksHashOn7[6] = 2031;
exports.ranksHashOn7[7] = 8698;
exports.ranksHashOn7[8] = 22854;
exports.ranksHashOn7[9] = 83661;
exports.ranksHashOn7[10] = 262349;
exports.ranksHashOn7[11] = 636345;
exports.ranksHashOn7[12] = 1479181;
exports.ranksHashOn5 = []; // one for each rank
exports.ranksHashOn5[0] = 0; // 2
exports.ranksHashOn5[1] = 1; // 3
exports.ranksHashOn5[2] = 5; // 4
exports.ranksHashOn5[3] = 22; // 5
exports.ranksHashOn5[4] = 94; // 6
exports.ranksHashOn5[5] = 312; // 7
exports.ranksHashOn5[6] = 992; // 8
exports.ranksHashOn5[7] = 2422; // 9
exports.ranksHashOn5[8] = 5624; // 10
exports.ranksHashOn5[9] = 12522; // J
exports.ranksHashOn5[10] = 19998; // Q
exports.ranksHashOn5[11] = 43258; // K
exports.ranksHashOn5[12] = 79415; // A
exports.rankToFaceSymbol = [
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
exports.suitToFaceSymbol = ['s', 'd', 'h', 'c'];
/*
arrays initialization
*/
exports.deckOfRanks_5 = new Array(52);
exports.deckOfRanks_7 = new Array(52);
exports.deckOfFlushes = new Array(52);
exports.deckOfSuits = new Array(52);
exports.fullCardsDeckHash_5 = new Array(52);
exports.fullCardsDeckHash_7 = new Array(52);
exports.cardHashToDescription_5 = {};
exports.cardHashToDescription_7 = {};
for (var i = 0; i < 52; i++) {
    exports.deckOfRanks_5[i] = exports.ranksHashOn5[i % 13];
    exports.deckOfRanks_7[i] = exports.ranksHashOn7[i % 13];
    exports.deckOfFlushes[i] = exports.flushHash[i % 13];
    exports.deckOfSuits[i] = exports.suitsHash[~~(i / 13)];
    var card5 = (exports.fullCardsDeckHash_5[i] = (exports.deckOfRanks_5[i] << 9) + exports.deckOfSuits[i]);
    var card7 = (exports.fullCardsDeckHash_7[i] = (exports.deckOfRanks_7[i] << 9) + exports.deckOfSuits[i]);
    exports.cardHashToDescription_5[card5] = i;
    exports.cardHashToDescription_7[card7] = i;
}
exports.STRAIGHTS = [
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
exports.rankCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
exports.rankCards_low8 = [6, 5, 4, 3, 2, 1, 0, 12];
exports.rankCards_low9 = [7, 6, 5, 4, 3, 2, 1, 0, 12];
exports.rankCards_low = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
exports.HIGH_CARDS_5_AMOUNT = 1277;
exports.FLUSHES_BASE_START = 5863;
exports.STRAIGHT_FLUSH_BASE_START = 7452;
exports.FLUSH_MASK = 511;
exports.STRAIGHT_FLUSH_OFFSET = 1599;
exports.handsRankingDelimiter_5cards = [
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
exports.handRankingGroupNames = [
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
/**
 * fill with these:
 * https://en.wikipedia.org/wiki/Poker_probability
 */
exports.distinctHandsQuantityByGroup = {
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
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards
 *
 * */
/**
 * @TODO prepare similar stuff for dice suited poker
 *
 * */
//# sourceMappingURL=constants.js.map