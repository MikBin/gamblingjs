(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../src/constants.ts":
/*!***************************!*\
  !*** ../src/constants.ts ***!
  \***************************/
/*! exports provided: flushHash, suitsHash, flush5hHashCheck, flushHashToName, flushIndexToName, flush7HashCheck, ranksHashOn7, ranksHashOn5, rankToFaceSymbol, suitToFaceSymbol, deckOfRanks_5, deckOfRanks_7, deckOfFlushes, deckOfSuits, fullCardsDeckHash_5, fullCardsDeckHash_7, cardHashToDescription_5, cardHashToDescription_7, STRAIGHTS, rankCards, rankCards_low8, rankCards_low9, rankCards_low, HIGH_CARDS_5_AMOUNT, FLUSHES_BASE_START, STRAIGHT_FLUSH_BASE_START, HIGH_MAX_RANK, FLUSH_MASK, STRAIGHT_FLUSH_OFFSET, handsRankingDelimiter_5cards, handsRankingDelimiter_Ato5_5cards, handsRankingDelimiter_Ato6_5cards, handRankingGroupNames_Ato5, handRankingGroupNames, handRankingGroupNames_Ato6, distinctHandsQuantityByGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flushHash", function() { return flushHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "suitsHash", function() { return suitsHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flush5hHashCheck", function() { return flush5hHashCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flushHashToName", function() { return flushHashToName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flushIndexToName", function() { return flushIndexToName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flush7HashCheck", function() { return flush7HashCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ranksHashOn7", function() { return ranksHashOn7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ranksHashOn5", function() { return ranksHashOn5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rankToFaceSymbol", function() { return rankToFaceSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "suitToFaceSymbol", function() { return suitToFaceSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deckOfRanks_5", function() { return deckOfRanks_5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deckOfRanks_7", function() { return deckOfRanks_7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deckOfFlushes", function() { return deckOfFlushes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deckOfSuits", function() { return deckOfSuits; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullCardsDeckHash_5", function() { return fullCardsDeckHash_5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullCardsDeckHash_7", function() { return fullCardsDeckHash_7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cardHashToDescription_5", function() { return cardHashToDescription_5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cardHashToDescription_7", function() { return cardHashToDescription_7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STRAIGHTS", function() { return STRAIGHTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rankCards", function() { return rankCards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rankCards_low8", function() { return rankCards_low8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rankCards_low9", function() { return rankCards_low9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rankCards_low", function() { return rankCards_low; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGH_CARDS_5_AMOUNT", function() { return HIGH_CARDS_5_AMOUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSHES_BASE_START", function() { return FLUSHES_BASE_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STRAIGHT_FLUSH_BASE_START", function() { return STRAIGHT_FLUSH_BASE_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGH_MAX_RANK", function() { return HIGH_MAX_RANK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_MASK", function() { return FLUSH_MASK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STRAIGHT_FLUSH_OFFSET", function() { return STRAIGHT_FLUSH_OFFSET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handsRankingDelimiter_5cards", function() { return handsRankingDelimiter_5cards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handsRankingDelimiter_Ato5_5cards", function() { return handsRankingDelimiter_Ato5_5cards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handsRankingDelimiter_Ato6_5cards", function() { return handsRankingDelimiter_Ato6_5cards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handRankingGroupNames_Ato5", function() { return handRankingGroupNames_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handRankingGroupNames", function() { return handRankingGroupNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handRankingGroupNames_Ato6", function() { return handRankingGroupNames_Ato6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distinctHandsQuantityByGroup", function() { return distinctHandsQuantityByGroup; });
/**
 * think of using typed array for performance reasons as these data is accessed very often
 * 8bit or 16bits arrays can be used
 */
const flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]; // to be implemented to speed up flushcheck on 7
const suitsHash = [0, 1, 8, 57]; // 4 one for each suit
/**check for !==undefined */
const flush5hHashCheck = {
    '0': 0,
    '5': 1,
    '40': 8,
    '285': 57
};
const flushHashToName = {
    0: 'spades',
    1: 'diamonds',
    8: 'hearts',
    57: 'clubs'
};
const flushIndexToName = ['spades', 'diamonds', 'hearts', 'clubs'];
const flush7HashCheck = {
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
const ranksHashOn7 = []; // 13 one for each rank
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
const ranksHashOn5 = []; // one for each rank
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
const rankToFaceSymbol = [
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
const suitToFaceSymbol = ['s', 'd', 'h', 'c'];
/*
arrays initialization
*/
const deckOfRanks_5 = new Array(52);
const deckOfRanks_7 = new Array(52);
const deckOfFlushes = new Array(52);
const deckOfSuits = new Array(52);
const fullCardsDeckHash_5 = new Array(52);
const fullCardsDeckHash_7 = new Array(52);
const cardHashToDescription_5 = {};
const cardHashToDescription_7 = {};
for (let i = 0; i < 52; i++) {
    deckOfRanks_5[i] = ranksHashOn5[i % 13];
    deckOfRanks_7[i] = ranksHashOn7[i % 13];
    deckOfFlushes[i] = flushHash[i % 13];
    deckOfSuits[i] = suitsHash[~~(i / 13)];
    let card5 = (fullCardsDeckHash_5[i] = (deckOfRanks_5[i] << 9) + deckOfSuits[i]);
    let card7 = (fullCardsDeckHash_7[i] = (deckOfRanks_7[i] << 9) + deckOfSuits[i]);
    cardHashToDescription_5[card5] = i;
    cardHashToDescription_7[card7] = i;
}
const STRAIGHTS = [
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
const rankCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const rankCards_low8 = [6, 5, 4, 3, 2, 1, 0, 12];
const rankCards_low9 = [7, 6, 5, 4, 3, 2, 1, 0, 12];
const rankCards_low = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
const HIGH_CARDS_5_AMOUNT = 1277;
const FLUSHES_BASE_START = 5863;
const STRAIGHT_FLUSH_BASE_START = 7452;
const HIGH_MAX_RANK = 7461;
const FLUSH_MASK = 511;
const STRAIGHT_FLUSH_OFFSET = 1599;
const handsRankingDelimiter_5cards = [
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
const handsRankingDelimiter_Ato5_5cards = [155, 311, 1169, 2027, 4887, 6174];
const handsRankingDelimiter_Ato6_5cards = handsRankingDelimiter_5cards.map(r => 7461 - r);
handsRankingDelimiter_Ato6_5cards.pop();
handsRankingDelimiter_Ato6_5cards.reverse().push(7461);
//console.log(handsRankingDelimiter_Ato6_5cards);
const handRankingGroupNames_Ato5 = [
    'four of a kind',
    'full house',
    'three of a kind',
    'two pair',
    'one pair',
    'high card'
];
const handRankingGroupNames = [
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
const handRankingGroupNames_Ato6 = handRankingGroupNames.slice().reverse();
/**
 * fill with these:
 * https://en.wikipedia.org/wiki/Poker_probability
 */
const distinctHandsQuantityByGroup = {
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
 * @TODO make function to work with non full decks. ex. deck of 40 cards, just invert ranking of flush and fulls...
 *
 * */


/***/ }),

/***/ "../src/gamblingjs.ts":
/*!****************************!*\
  !*** ../src/gamblingjs.ts ***!
  \****************************/
/*! exports provided: handOfFiveEvalIndexed, getHandInfo, handOfSixEvalIndexed, getPartialHandStatsIndexed_7, FIVE_CARD_POKER_EVAL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIVE_CARD_POKER_EVAL", function() { return FIVE_CARD_POKER_EVAL; });
/* harmony import */ var _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerEvaluator5 */ "../src/pokerEvaluator5.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalIndexed", function() { return _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalIndexed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHandInfo", function() { return _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo"]; });

/* harmony import */ var _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pokerEvaluator6 */ "../src/pokerEvaluator6.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalIndexed", function() { return _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalIndexed"]; });

/* harmony import */ var _pokerMontecarloSym__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pokerMontecarloSym */ "../src/pokerMontecarloSym.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getPartialHandStatsIndexed_7", function() { return _pokerMontecarloSym__WEBPACK_IMPORTED_MODULE_2__["getPartialHandStatsIndexed_7"]; });

/* harmony import */ var _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pokerEvaluator7 */ "../src/pokerEvaluator7.ts");
/* harmony import */ var _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/pokerHashes7 */ "../src/pokerHashes7.ts");


/* istanbul ignore next */






/**@TODO create a config module, if development build all hashes? or used to preconfigure the library??? */
const FIVE_CARD_POKER_EVAL = {
    HandRank: {
        5: {
            "high": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalIndexed"],
            "low8": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalHiLow8Indexed"],
            "low9": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalHiLow9Indexed"],
            "Ato5": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato5Indexed"],
            "Ato6": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato6Indexed"],
            "2to7": _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLowBall27Indexed"]
        },
        6: {
            /**@TODO to be renamed with _  and looks same as 5 and 7 evaluators */
            "high": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalIndexed"],
            "low8": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalHiLow8Indexed"],
            "low9": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalHiLow9Indexed"],
            "Ato5": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalAto5Indexed"],
            "Ato6": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalAto6Indexed"],
            "2to7": _pokerEvaluator6__WEBPACK_IMPORTED_MODULE_1__["handOfSixEvalLowBall27Indexed"]
        },
        7: {
            "high": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEvalIndexed"],
            "low8": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEvalHiLow8Indexed"],
            "low9": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEvalHiLow9Indexed"],
            "Ato5": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEvalLow_Ato5Indexed"],
            "Ato6": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEval_Ato6Indexed"],
            "2to7": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["_handOfSevenEvalLowBall27Indexed"]
        }
    },
    HandRankVerbose: {
        7: {
            "high": _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalIndexed_Verbose"]
        }
    },
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
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].high();
                FIVE_CARD_POKER_EVAL.HandRank[7].high = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalIndexed"];
                //FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high = SevenEvaluators.handOfSevenEvalIndexed_Verbose
            },
            "low8": () => {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].low8();
                FIVE_CARD_POKER_EVAL.HandRank[7].low8 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalHiLow8Indexed"];
            },
            "low9": () => {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].low9();
                FIVE_CARD_POKER_EVAL.HandRank[7].low9 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalHiLow9Indexed"];
            },
            "Ato5": () => {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].Ato5();
                FIVE_CARD_POKER_EVAL.HandRank[7].Ato5 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalLow_Ato5Indexed"];
            },
            "Ato6": () => {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].Ato6();
                FIVE_CARD_POKER_EVAL.HandRank[7].Ato6 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEval_Ato6Indexed"];
            },
            "2to7": () => {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"]["2to7"]();
                FIVE_CARD_POKER_EVAL.HandRank[7]["2to7"] = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalLowBall27Indexed"];
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


/***/ }),

/***/ "../src/hashesCreator.ts":
/*!*******************************!*\
  !*** ../src/hashesCreator.ts ***!
  \*******************************/
/*! exports provided: createRankOfFiveHashes, createRankOf5On7Hashes, createRankOf5AceToFive_Low8, createRankOf5AceToFive_Full, createRankOf5AceToSix_Full, createRankOf7AceToSix_Low, createRankOf7AceToFive_Low, createRankOf5AceToFive_Low9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOfFiveHashes", function() { return createRankOfFiveHashes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf5On7Hashes", function() { return createRankOf5On7Hashes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf5AceToFive_Low8", function() { return createRankOf5AceToFive_Low8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf5AceToFive_Full", function() { return createRankOf5AceToFive_Full; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf5AceToSix_Full", function() { return createRankOf5AceToSix_Full; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf7AceToSix_Low", function() { return createRankOf7AceToSix_Low; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf7AceToFive_Low", function() { return createRankOf7AceToFive_Low; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRankOf5AceToFive_Low9", function() { return createRankOf5AceToFive_Low9; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");
/* harmony import */ var _routines__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./routines */ "../src/routines.ts");
/* harmony import */ var kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! kombinatoricsjs */ "../node_modules/kombinatoricsjs/dist/kombinatoricsjs.es5.js");




const createRankOfFiveHashes = () => {
    const hashRankingOfFive = {
        HASHES: {},
        FLUSH_CHECK_KEYS: _constants__WEBPACK_IMPORTED_MODULE_0__["flush5hHashCheck"],
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(7462)
    };
    //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
    const rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"];
    const STRAIGHTS = _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHTS"];
    const HIGH_CARDS_5_AMOUNT = _constants__WEBPACK_IMPORTED_MODULE_0__["HIGH_CARDS_5_AMOUNT"];
    let highCards = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1);
    const HIGH_CARDS = _routines__WEBPACK_IMPORTED_MODULE_1__["removeStraights"](highCards);
    const SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    const DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards);
    const TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards);
    const FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    const QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    let upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS);
    upToStraights.forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx, hashRankingOfFive);
    });
    let aboveStraights = FULLHOUSES.concat(QUADS);
    aboveStraights.forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5PlusFlushes"])(h, idx, hashRankingOfFive);
    });
    /**FLUSHES and STRAIGHT FLUSHES */
    HIGH_CARDS.forEach(h => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRankFlushes"])(h, hashRankingOfFive);
    });
    STRAIGHTS.forEach((h, idx) => {
        let hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(card => hashRankingOfFive.baseRankValues[card]));
        let rank = idx + _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHT_FLUSH_BASE_START"];
        hashRankingOfFive.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingOfFive.rankingInfos[rank] = {
            hand: h.slice(),
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handToCardsSymbols"])(h),
            handGroup: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handRankToGroup"])(rank)
        };
    });
    return hashRankingOfFive;
};
// @TODO export const createRankOf5On6Hashes = () => { };
const createRankOf5On7Hashes = (hashRankOfFive, INVERTED = false) => {
    const hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    const rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"];
    const ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
    kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 7, 4).forEach((hand, i) => {
        let h7 = hand.map(card => ranksHashOn7[card]);
        let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
        let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        hashRankingOfFiveOnSeven.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES, INVERTED);
    });
    let FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.MULTI_FLUSH_RANK_HASHES;
    let fiveFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 5);
    let sixFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 6);
    let sevenFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 7);
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach((h) => {
        let h5 = h.map(c => hashRankOfFive.baseRankValues[c]);
        let h7 = h.map(c => hashRankingOfFiveOnSeven.baseRankValues[c]);
        let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        let rank = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.FLUSH_RANK_HASHES, INVERTED);
        FLUSH_RANK_HASHES[h.length][hash7] = rank;
    });
    let fiveFlushHashes = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [8, 8, 8, 8, 8], [57, 57, 57, 57, 57]];
    let sixFlushHashes = [];
    fiveFlushHashes.forEach((v, i) => {
        sixFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });
    let sevenFlushHashes = [];
    sixFlushHashes.forEach(v => {
        sevenFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });
    const FLUSH_CHECK_KEYS = hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS;
    if (INVERTED) {
        sevenFlushHashes = [
            [0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [8, 8, 8, 8, 8, 8, 8],
            [57, 57, 57, 57, 57, 57, 57]
        ];
    }
    sevenFlushHashes.forEach(h => {
        FLUSH_CHECK_KEYS[Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h)] = h[0];
    });
    return hashRankingOfFiveOnSeven;
};
const createRankOf5AceToFive_Low8 = () => {
    let lowHands = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"]([6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    const hashRankingLow8 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx, hashRankingLow8);
    });
    /**change rankking infos as straights have to have different names */
    return hashRankingLow8;
};
const createRankOf5AceToFive_Full = () => {
    const rankCards = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
    const hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(6175)
    };
    const QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    const FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    const TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards, true);
    const DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards, true);
    const SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    let HIGH_CARDS = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1);
    let all = QUADS.concat(FULLHOUSES, TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS);
    all.forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5Ato5"])(h, idx, hashRankingLow);
    });
    return hashRankingLow;
};
const createRankOf5AceToSix_Full = () => {
    const hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(7462)
    };
    let rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards_low"];
    const STRAIGHTS = _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHTS"].slice(0, 9).reverse();
    const QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    const FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    const TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards, true);
    const DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards, true);
    const SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    let HIGH_CARDS = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1).filter((H, i) => {
        return !_routines__WEBPACK_IMPORTED_MODULE_1__["checkStraight"](H);
    });
    /**fill straight flushes as are the lowest hand possbile */
    STRAIGHTS.forEach((h, idx) => {
        let hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(card => hashRankingLow.baseRankValues[card]));
        let rank = idx;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handToCardsSymbols"])(h),
            handGroup: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handRankToGroup"])(rank, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"])
        };
    });
    let FLUSH_GAP = STRAIGHTS.length;
    /**@TODO verify how does straight AKQJT have to be valuated...if ACE counts for low only it should NOT BE a straight!!!! */
    QUADS.concat(FULLHOUSES).forEach((h, idx) => {
        /**add straights.length because of straight flushes are the lowest to be added */
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx + FLUSH_GAP, hashRankingLow);
    });
    FLUSH_GAP += QUADS.length + FULLHOUSES.length;
    HIGH_CARDS.forEach((h, idx) => {
        let hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(card => hashRankingLow.baseRankValues[card]));
        let rank = idx + FLUSH_GAP;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handToCardsSymbols"])(h),
            handGroup: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handRankToGroup"])(rank, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"])
        };
    });
    FLUSH_GAP += HIGH_CARDS.length;
    STRAIGHTS.concat(TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS).forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx + FLUSH_GAP, hashRankingLow, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"]);
    });
    return hashRankingLow;
};
const createRankOf7AceToSix_Low = (hashRankOfFive, baseLowRanking) => {
    const hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    let ranksHashOn7 = _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"];
    /**filling ranks */
    kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 7, 4).forEach((hand, idx) => {
        let h7 = hand.map(card => ranksHashOn7[card]);
        let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
        let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
    });
    /*let fiveFlushes = kombinatoricsJs.combinations(baseLowRanking, 5);
    let sixFlushes = kombinatoricsJs.combinations(baseLowRanking, 6);*/
    let sevenFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](baseLowRanking, 7);
    /*
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach((h: number[]) => {
      let h5: number[] = h.map(c => hashRankOfFive.baseRankValues[c]);
      let h7: number[] = h.map(c => hashRankingLow.baseRankValues[c]);
      let hash7 = getVectorSum(h7);
  
      let rank = _rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES);
  
      FLUSH_RANK_HASHES[h.length][hash7] = rank;
    });
  
    let fiveFlushHashes = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [8, 8, 8, 8, 8], [57, 57, 57, 57, 57]];
    let sixFlushHashes: number[][] = [];
    fiveFlushHashes.forEach((v, i) => {
      sixFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });
    let sevenFlushHashes: number[][] = [];
  
    sixFlushHashes.forEach(v => {
      sevenFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });*/
    let sevenFlushHashes = [
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [8, 8, 8, 8, 8, 8, 8],
        [57, 57, 57, 57, 57, 57, 57]
    ];
    /**filling only seven flushes as for 5 and 6 the best hand would never be a flush but another combos */
    sevenFlushHashes.forEach(h => {
        hashRankingLow.FLUSH_CHECK_KEYS[Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h)] = h[0];
    });
    sevenFlushes.forEach((h) => {
        let h5 = h.map(c => hashRankOfFive.baseRankValues[c]);
        let h7 = h.map(c => hashRankingLow.baseRankValues[c]);
        let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        let rank = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.FLUSH_RANK_HASHES);
        hashRankingLow.FLUSH_RANK_HASHES[hash7] = rank;
    });
    return hashRankingLow;
};
const createRankOf7AceToFive_Low = (hashRankOfFive, baseLowRanking, fullFlag = false) => {
    const hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    let ranksHashOn7 = _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"];
    if (fullFlag) {
        kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 7, 4).forEach((hand, idx) => {
            let h7 = hand.map(card => ranksHashOn7[card]);
            let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
            let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
            hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
        });
    }
    else {
        let lowHands = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 5, 1);
        kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](_constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"], 2, 2).forEach((pair, i) => {
            lowHands.forEach((lo, idx) => {
                let hand = lo.concat(pair);
                let h7 = hand.map(card => ranksHashOn7[card]);
                let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
                let hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
                hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
            });
        });
    }
    return hashRankingLow;
};
const createRankOf5AceToFive_Low9 = () => {
    let lowHands = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"]([7, 6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    const hashRankingLow9 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach((h, idx) => {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx, hashRankingLow9);
    });
    return hashRankingLow9;
};


/***/ }),

/***/ "../src/pokerEvaluator5.ts":
/*!*********************************!*\
  !*** ../src/pokerEvaluator5.ts ***!
  \*********************************/
/*! exports provided: handOfFiveEval, handOfFiveEvalHiLow, handOfFiveEvalHiLow8, handOfFiveEvalHiLow8Indexed, handOfFiveEvalHiLow9, handOfFiveEvalHiLow9Indexed, handOfFiveEvalLow_Ato5, handOfFiveEvalLow_Ato5Indexed, handOfFiveEvalLow_Ato6, handOfFiveEvalLow_Ato6Indexed, handOfFiveEvalLowBall27, handOfFiveEvalLowBall27Indexed, handOfFiveEvalIndexed, getHandInfo, getHandInfo27, getHandInfoLow8, getHandInfoLow9, getHandInfoAto5, getHandInfoAto6, bfBestOfFiveOnX, bfBestOfFiveOnXindexed, bestFiveOnXHiLowIndexed, getHandInfo5onX, getHandInfo5onXHiLow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEval", function() { return handOfFiveEval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalHiLow", function() { return handOfFiveEvalHiLow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalHiLow8", function() { return handOfFiveEvalHiLow8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalHiLow8Indexed", function() { return handOfFiveEvalHiLow8Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalHiLow9", function() { return handOfFiveEvalHiLow9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalHiLow9Indexed", function() { return handOfFiveEvalHiLow9Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLow_Ato5", function() { return handOfFiveEvalLow_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLow_Ato5Indexed", function() { return handOfFiveEvalLow_Ato5Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLow_Ato6", function() { return handOfFiveEvalLow_Ato6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLow_Ato6Indexed", function() { return handOfFiveEvalLow_Ato6Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLowBall27", function() { return handOfFiveEvalLowBall27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalLowBall27Indexed", function() { return handOfFiveEvalLowBall27Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfFiveEvalIndexed", function() { return handOfFiveEvalIndexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfo", function() { return getHandInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfo27", function() { return getHandInfo27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfoLow8", function() { return getHandInfoLow8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfoLow9", function() { return getHandInfoLow9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfoAto5", function() { return getHandInfoAto5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfoAto6", function() { return getHandInfoAto6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bfBestOfFiveOnX", function() { return bfBestOfFiveOnX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bfBestOfFiveOnXindexed", function() { return bfBestOfFiveOnXindexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bestFiveOnXHiLowIndexed", function() { return bestFiveOnXHiLowIndexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfo5onX", function() { return getHandInfo5onX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHandInfo5onXHiLow", function() { return getHandInfo5onXHiLow; });
/* harmony import */ var _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerHashes5 */ "../src/pokerHashes5.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");
/* harmony import */ var _routines__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routines */ "../src/routines.ts");
/* harmony import */ var kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! kombinatoricsjs */ "../node_modules/kombinatoricsjs/dist/kombinatoricsjs.es5.js");




/** @function handOfFiveEval
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {Number} hand ranking
 */
const handOfFiveEval = (c1, c2, c3, c4, c5) => {
    let keySum = c1 + c2 + c3 + c4 + c5;
    let rankKey = keySum >>> 9;
    let flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_FIVE"][rankKey];
    }
    return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE"][rankKey];
};
/** @function handOfFiveEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
const handOfFiveEvalHiLow = (LOW_RANK_HASH, c1, c2, c3, c4, c5) => {
    let keySum = c1 + c2 + c3 + c4 + c5;
    let rankKey = keySum >>> 9;
    let low = LOW_RANK_HASH[rankKey];
    let bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    let flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        bothRank.hi = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_FIVE"][rankKey];
    }
    else {
        bothRank.hi = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE"][rankKey];
    }
    return bothRank;
};
/** @function handOfFiveEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfFiveEvalHiLow8 = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalHiLow(_pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW8"], c1, c2, c3, c4, c5);
};
const handOfFiveEvalHiLow8Indexed = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalHiLow8(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfFiveEvalHiLow9 = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalHiLow(_pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW9"], c1, c2, c3, c4, c5);
};
const handOfFiveEvalHiLow9Indexed = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalHiLow9(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
const handOfFiveEvalLow_Ato5 = (c1, c2, c3, c4, c5) => {
    let keySum = c1 + c2 + c3 + c4 + c5;
    let rankKey = keySum >>> 9;
    let rank = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW_Ato5"][rankKey];
    return rank;
};
/** @function handOfFiveEvalLow_Ato5Indexed
 *
 * @param {Number} c1...c5 cards index in standard deck 52
 * @returns {number} hand ranking for Ato5 rules
 */
const handOfFiveEvalLow_Ato5Indexed = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalLow_Ato5(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
const handOfFiveEvalLow_Ato6 = (c1, c2, c3, c4, c5) => {
    let keySum = c1 + c2 + c3 + c4 + c5;
    let rankKey = keySum >>> 9;
    let flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_FIVE_ATO6"][rankKey];
    }
    return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_ATO6"][rankKey];
};
const handOfFiveEvalLow_Ato6Indexed = (c1, c2, c3, c4, c5) => {
    return handOfFiveEvalLow_Ato6(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
const handOfFiveEvalLowBall27 = (c1, c2, c3, c4, c5) => {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - handOfFiveEval(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalLowBall27Indexed
 *
 * @param {Number} c1...c5 cards hash from 0-51
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
const handOfFiveEvalLowBall27Indexed = (c1, c2, c3, c4, c5) => {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - handOfFiveEvalIndexed(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
const handOfFiveEvalIndexed = (c1, c2, c3, c4, c5) => {
    return handOfFiveEval(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function getHandInfo
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
const getHandInfo = (rank, HASHES = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE"], INVERTED = false) => {
    return HASHES.rankingInfos[INVERTED ? _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - rank : rank] || {
        hand: [],
        faces: '',
        handGroup: 'unqualified'
    };
};
/** @function getHandInfo27
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
const getHandInfo27 = (rank) => {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE"], true);
};
/** @function getHandInfoLow8
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
const getHandInfoLow8 = (rank) => {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW8"]);
};
/** @function getHandInfoLow9
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
const getHandInfoLow9 = (rank) => {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW9"]);
};
/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
const getHandInfoAto5 = (rank) => {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW_Ato5"]);
};
/** @function getHandInfoAto6
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
const getHandInfoAto6 = (rank) => {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_Ato6"]);
};
/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
*
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @param {Function} evalFn evaluator defaults to hand of 5 high only
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
const bfBestOfFiveOnX = (hand, evalFn = handOfFiveEval) => {
    //@ts-ignore
    return Math.max(...kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5).map(h => evalFn(...h)));
};
/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} hand array of 6 or more cards making up an hand
 * @param {Function} evalFn evaluator defaults to hand of 5 high only
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const bfBestOfFiveOnXindexed = (hand, evalFn = handOfFiveEvalIndexed) => {
    //@ts-ignore
    return Math.max(...kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5).map(h => evalFn(...h)));
};
const bestFiveOnXHiLowIndexed = (evalFn, hand) => {
    let res = { hi: -1, low: -1 };
    //@ts-ignore
    let all = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5)
        //@ts-ignore
        .map(hand => evalFn(...hand));
    all.forEach((R, i) => {
        R.hi > res.hi ? (res.hi = R.hi) : null;
        R.low > res.low ? (res.low = R.low) : null;
    });
    return res;
};
/**to be used in generic verbose eval function  */
const evaluatorByGameType = {
    "high": handOfFiveEvalIndexed,
    "low8": handOfFiveEvalHiLow8Indexed,
    "low9": handOfFiveEvalHiLow9Indexed,
    "Ato5": handOfFiveEvalLow_Ato5Indexed,
    "Ato6": handOfFiveEvalLow_Ato6Indexed,
    "2to7": handOfFiveEvalLowBall27Indexed
};
const evaluatorInfoByGameType = {
    "high": getHandInfo,
    "low8": getHandInfoLow8,
    "low9": getHandInfoLow9,
    "Ato5": getHandInfoAto5,
    "Ato6": getHandInfoAto6,
    "2to7": getHandInfo27
};
/** @function getHandInfo5onX
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
const getHandInfo5onX = (hand, gameType) => {
    let combinations = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5);
    let evalFn = evaluatorByGameType[gameType];
    let rank = Math.max(...combinations.map(H => evalFn(...H)));
    let handInfo = evaluatorInfoByGameType[gameType](rank);
    let winningCards = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfo.hand);
    let flushSuit = handInfo.handGroup == "flush" ? Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getFlushSuitFromIndex"])(winningCards[0]) : "no flush";
    return {
        handRank: rank,
        hand: handInfo.hand,
        faces: handInfo.faces,
        handGroup: handInfo.handGroup,
        winningCards: winningCards,
        flushSuit: flushSuit
    };
};
/** @function getHandInfo5onXHiLow
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @returns {verboseHandInfo} info of best 5 cards hand
*/
const getHandInfo5onXHiLow = (hand, gameType) => {
    let evalFn = evaluatorByGameType[gameType];
    let ranks = bestFiveOnXHiLowIndexed(evalFn, hand);
    let handInfoLow = evaluatorInfoByGameType[gameType](ranks.low);
    let winningCardsLow = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfoLow.hand);
    let handInfoHi = evaluatorInfoByGameType["high"](ranks.hi);
    let winningCardsHi = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfoHi.hand);
    let flushSuit = handInfoHi.handGroup == "flush" ? Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getFlushSuitFromIndex"])(winningCardsHi[0]) : "no flush";
    return {
        hi: {
            handRank: ranks.hi,
            hand: handInfoHi.hand,
            faces: handInfoHi.faces,
            handGroup: handInfoHi.handGroup,
            winningCards: winningCardsHi,
            flushSuit: flushSuit
        },
        low: {
            handRank: ranks.low,
            hand: handInfoLow.hand,
            faces: handInfoLow.faces,
            handGroup: handInfoLow.handGroup,
            winningCards: winningCardsLow,
            flushSuit: "no flush"
        }
    };
};


/***/ }),

/***/ "../src/pokerEvaluator6.ts":
/*!*********************************!*\
  !*** ../src/pokerEvaluator6.ts ***!
  \*********************************/
/*! exports provided: handOfSixEvalIndexed, handOfSixEvalLowBall27Indexed, handOfSixEvalAto5Indexed, handOfSixEvalAto6Indexed, handOfSixEvalHiLow8Indexed, handOfSixEvalHiLow9Indexed, _handOfSixEvalIndexed_Verbose, _handOfSixEvalLowBall27Indexed_Verbose, _handOfSixEvalAto5Indexed_Verbose, _handOfSixEvalAto6Indexed_Verbose, _handOfSixEvalLow8_Verbose, _handOfSixEvalLow9_Verbose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalIndexed", function() { return handOfSixEvalIndexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalLowBall27Indexed", function() { return handOfSixEvalLowBall27Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalAto5Indexed", function() { return handOfSixEvalAto5Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalAto6Indexed", function() { return handOfSixEvalAto6Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalHiLow8Indexed", function() { return handOfSixEvalHiLow8Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSixEvalHiLow9Indexed", function() { return handOfSixEvalHiLow9Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalIndexed_Verbose", function() { return _handOfSixEvalIndexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalLowBall27Indexed_Verbose", function() { return _handOfSixEvalLowBall27Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalAto5Indexed_Verbose", function() { return _handOfSixEvalAto5Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalAto6Indexed_Verbose", function() { return _handOfSixEvalAto6Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalLow8_Verbose", function() { return _handOfSixEvalLow8_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSixEvalLow9_Verbose", function() { return _handOfSixEvalLow9_Verbose; });
/* harmony import */ var _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerEvaluator5 */ "../src/pokerEvaluator5.ts");

/** @function handOfSixEvalIndexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalIndexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand);
};
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalLowBall27Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLowBall27Indexed"]);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalAto5Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato5Indexed"]);
};
/** @function handOfSixEvalAto5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalAto6Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato6Indexed"]);
};
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalHiLow8Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalHiLow8Indexed"], hand);
};
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSixEvalHiLow9Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalHiLow9Indexed"], hand);
};
/**
 *
 * VERBOSE
 *
 */
/** @function _handOfSixEvalIndexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalIndexed_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "high");
};
/** @function _handOfSixEvalLowBall27Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalLowBall27Indexed_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "2to7");
};
/** @function _handOfSixEvalAto5Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalAto5Indexed_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "Ato5");
};
/** @function _handOfSixEvalAto6Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalAto6Indexed_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "Ato6");
};
/** @function _handOfSixEvalLow8_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalLow8_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "low8");
};
/** @function _handOfSixEvalLow9_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
const _handOfSixEvalLow9_Verbose = (hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "low9");
};


/***/ }),

/***/ "../src/pokerEvaluator7.ts":
/*!*********************************!*\
  !*** ../src/pokerEvaluator7.ts ***!
  \*********************************/
/*! exports provided: handOfSevenEval, handOfSevenEvalLowBall27, handOfSevenEvalLowBall27Indexed, handOfSevenEval_Ato6, handOfSevenEval_Ato6Indexed, handOfSevenEvalHiLow, handOfSevenEvalLow_Ato5, handOfSevenEvalLow_Ato5Indexed, handOfSevenEvalHiLow8, handOfSevenEvalHiLow8Indexed, handOfSevenEvalHiLow9, handOfSevenEvalHiLow9Indexed, handOfSevenEvalIndexed, handOfSevenEval_Verbose, handOfSevenEvalLowBall27Indexed_Verbose, handOfSevenEvalAto6Indexed_Verbose, handOfSevenEvalIndexed_Verbose, handOfSevenEvalAto5Indexed_Verbose, handOfSevenEvalLow8Indexed_Verbose, handOfSevenEvalLow9Indexed_Verbose, _handOfSevenEvalIndexed, _handOfSevenEvalLowBall27Indexed, _handOfSevenEvalLow_Ato5Indexed, _handOfSevenEval_Ato6Indexed, _handOfSevenEvalHiLow8Indexed, _handOfSevenEvalHiLow9Indexed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEval", function() { return handOfSevenEval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLowBall27", function() { return handOfSevenEvalLowBall27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLowBall27Indexed", function() { return handOfSevenEvalLowBall27Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEval_Ato6", function() { return handOfSevenEval_Ato6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEval_Ato6Indexed", function() { return handOfSevenEval_Ato6Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalHiLow", function() { return handOfSevenEvalHiLow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLow_Ato5", function() { return handOfSevenEvalLow_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLow_Ato5Indexed", function() { return handOfSevenEvalLow_Ato5Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalHiLow8", function() { return handOfSevenEvalHiLow8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalHiLow8Indexed", function() { return handOfSevenEvalHiLow8Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalHiLow9", function() { return handOfSevenEvalHiLow9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalHiLow9Indexed", function() { return handOfSevenEvalHiLow9Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalIndexed", function() { return handOfSevenEvalIndexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEval_Verbose", function() { return handOfSevenEval_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLowBall27Indexed_Verbose", function() { return handOfSevenEvalLowBall27Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalAto6Indexed_Verbose", function() { return handOfSevenEvalAto6Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalIndexed_Verbose", function() { return handOfSevenEvalIndexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalAto5Indexed_Verbose", function() { return handOfSevenEvalAto5Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLow8Indexed_Verbose", function() { return handOfSevenEvalLow8Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handOfSevenEvalLow9Indexed_Verbose", function() { return handOfSevenEvalLow9Indexed_Verbose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEvalIndexed", function() { return _handOfSevenEvalIndexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEvalLowBall27Indexed", function() { return _handOfSevenEvalLowBall27Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEvalLow_Ato5Indexed", function() { return _handOfSevenEvalLow_Ato5Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEval_Ato6Indexed", function() { return _handOfSevenEval_Ato6Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEvalHiLow8Indexed", function() { return _handOfSevenEvalHiLow8Indexed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_handOfSevenEvalHiLow9Indexed", function() { return _handOfSevenEvalHiLow9Indexed; });
/* harmony import */ var _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerHashes7 */ "../src/pokerHashes7.ts");
/* harmony import */ var _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pokerHashes5 */ "../src/pokerHashes5.ts");
/* harmony import */ var _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pokerEvaluator5 */ "../src/pokerEvaluator5.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");
/* harmony import */ var _routines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routines */ "../src/routines.ts");





/** @function handOfSevenEval
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking
 */
const handOfSevenEval = (c1, c2, c3, c4, c5, c6, c7) => {
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    let flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        /**no full house or quads possible ---> can return flush_rank */
        let flushyCardsCounter = 0;
        let flushRankKey = 0;
        if ((c1 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c1;
        }
        if ((c2 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c2;
        }
        if ((c3 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c3;
        }
        if ((c4 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c4;
        }
        if ((c5 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c5;
        }
        if ((c6 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c6;
        }
        if ((c7 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c7;
        }
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_SEVEN"][flushyCardsCounter][flushRankKey >>> 9];
    }
    else {
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN"][keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
const handOfSevenEvalLowBall27 = (c1, c2, c3, c4, c5, c6, c7) => {
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    let flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN_LOWBALL27"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        /**only seven card flush possible in lowball 2-7. in case of 6 or 5 flushy cards any high card or pair would be a better hand */
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_SEVEN_LOWBALL27"][7][keySum >>> 9];
    }
    else {
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOWBALL27"][keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEvalLowBall27Indexed
 *
 * @param {Number} c1...c7 cards from 0-51
 * @returns {Number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
const handOfSevenEvalLowBall27Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalLowBall27(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEval_Ato6
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking for lowball Ato6
 */
const handOfSevenEval_Ato6 = (c1, c2, c3, c4, c5, c6, c7) => {
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    let flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN_ATO6"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_SEVEN_ATO6"][keySum >>> 9];
    }
    else {
        handRank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_ATO6"][keySum >>> 9];
    }
    return handRank;
};
/** @function handOfSevenEval_Ato6Indexed
 *
 * @param {Number} c1...c7 cards from deck 0-51
 * @returns {Number} hand ranking for lowball Ato6
 */
const handOfSevenEval_Ato6Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Ato6(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalHiLow = (LOW_RANK_HASH, c1, c2, c3, c4, c5, c6, c7) => {
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let rankKey = keySum >>> 9;
    let low = LOW_RANK_HASH[rankKey];
    let bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    let flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        let flushyCardsCounter = 0;
        let flushRankKey = 0;
        if ((c1 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c1;
        }
        if ((c2 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c2;
        }
        if ((c3 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c3;
        }
        if ((c4 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c4;
        }
        if ((c5 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c5;
        }
        if ((c6 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c6;
        }
        if ((c7 & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key) {
            flushyCardsCounter++;
            flushRankKey += c7;
        }
        bothRank.hi = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_SEVEN"][flushyCardsCounter][flushRankKey >>> 9];
    }
    else {
        bothRank.hi = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN"][rankKey];
    }
    return bothRank;
};
/** @function handOfSevenEvalLow_Ato5
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {number} hand ranking for Ato5 rules
 */
const handOfSevenEvalLow_Ato5 = (c1, c2, c3, c4, c5, c6, c7) => {
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let rankKey = keySum >>> 9;
    let rank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW_Ato5"][rankKey];
    return rank;
};
/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalLow_Ato5Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalLow_Ato5(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalHiLow8 = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow(_pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW8"], c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalHiLow8Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow8(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalHiLow9 = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow(_pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW9"], c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
const handOfSevenEvalHiLow9Indexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEvalHiLow9(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const handOfSevenEvalIndexed = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
const handOfSevenEval_Verbose = (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN"], FIVE_EVAL_HASH = _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], USE_MULTI_FLUSH_RANK = true, INVERTED = false) => {
    let _FLUSH_CHECK_SEVEN = SEVEN_EVAL_HASH.FLUSH_CHECK_KEYS;
    let _FLUSH_RANK_SEVEN = USE_MULTI_FLUSH_RANK
        ? SEVEN_EVAL_HASH.MULTI_FLUSH_RANK_HASHES
        : SEVEN_EVAL_HASH.FLUSH_RANK_HASHES;
    let _HASH_RANK_SEVEN = SEVEN_EVAL_HASH.HASHES;
    let keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    let handRank = 0;
    let flush_check_key = _FLUSH_CHECK_SEVEN[keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    let flushRankKey = 0;
    let handVector = [c1, c2, c3, c4, c5, c6, c7];
    if (flush_check_key >= 0) {
        handVector = handVector.filter((c, i) => {
            return (c & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key;
        });
        handVector.forEach(c => (flushRankKey += c));
        handRank = USE_MULTI_FLUSH_RANK
            //@ts-ignore
            ? _FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9] : _FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = _HASH_RANK_SEVEN[keySum >>> 9];
        flushRankKey = -1;
    }
    let handIndexes = handVector.map(c => _constants__WEBPACK_IMPORTED_MODULE_3__["cardHashToDescription_7"][c]);
    /**NB if undefined hand rank prepare for unqualified information */
    if (handRank !== 0 && !handRank) {
        return {
            handRank: -1,
            hand: [],
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_4__["handToCardsSymbols"])(handIndexes),
            handGroup: 'unqualified',
            winningCards: [],
            flushSuit: 'unqualified'
        };
    }
    let wHand = FIVE_EVAL_HASH.rankingInfos[INVERTED ? _constants__WEBPACK_IMPORTED_MODULE_3__["HIGH_MAX_RANK"] - handRank : handRank].hand;
    return {
        handRank: handRank,
        hand: wHand,
        faces: FIVE_EVAL_HASH.rankingInfos[INVERTED ? _constants__WEBPACK_IMPORTED_MODULE_3__["HIGH_MAX_RANK"] - handRank : handRank].faces,
        handGroup: FIVE_EVAL_HASH.rankingInfos[INVERTED ? _constants__WEBPACK_IMPORTED_MODULE_3__["HIGH_MAX_RANK"] - handRank : handRank].handGroup,
        winningCards: Object(_routines__WEBPACK_IMPORTED_MODULE_4__["filterWinningCards"])(handIndexes, wHand),
        /**in low8 or 9 there could be more than 5 cards ex AAA2345--->apply procedure to remove duplicates when highliting cards
         * by taking the first of each rank encountered (starting from communitaire cards)
         */
        flushSuit: flushRankKey > -1 ? _constants__WEBPACK_IMPORTED_MODULE_3__["flushHashToName"][flush_check_key] : 'no flush'
    };
};
const handOfSevenEvalLowBall27Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN_LOWBALL27"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], true, true);
};
const handOfSevenEvalAto6Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW_Ato6"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_Ato6"], false);
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
const handOfSevenEvalIndexed_Verbose = (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN"], FIVE_EVAL_HASH = _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], USE_MULTI_FLUSH_RANK = true) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
};
const handOfSevenEvalAto5Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW_Ato5"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW_Ato5"], false);
};
const handOfSevenEvalLow8Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW8"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW8"], false);
};
const handOfSevenEvalLow9Indexed_Verbose = (c1, c2, c3, c4, c5, c6, c7) => {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW9"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW9"], false);
};
/**
 *
 * slow brute force versions
 *
 *
 *  */
/** @function _handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEvalIndexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand);
};
/** @function _handOfSevenEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEvalLowBall27Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLowBall27Indexed"]);
};
/** @function _handOfSevenEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEvalLow_Ato5Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLow_Ato5Indexed"]);
};
/** @function _handOfSevenEvalAto6Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEval_Ato6Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLow_Ato6Indexed"]);
};
/** @function _handOfSevenEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEvalHiLow8Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalHiLow8Indexed"], hand);
};
/** @function _handOfSevenEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
const _handOfSevenEvalHiLow9Indexed = (...hand) => {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalHiLow9Indexed"], hand);
};


/***/ }),

/***/ "../src/pokerHashes5.ts":
/*!******************************!*\
  !*** ../src/pokerHashes5.ts ***!
  \******************************/
/*! exports provided: HASHES_OF_FIVE, FLUSH_CHECK_FIVE, HASH_RANK_FIVE, FLUSH_RANK_FIVE, HASHES_OF_FIVE_LOW8, HASH_RANK_FIVE_LOW8, HASHES_OF_FIVE_LOW9, HASH_RANK_FIVE_LOW9, HASHES_OF_FIVE_LOW_Ato5, HASH_RANK_FIVE_LOW_Ato5, HASHES_OF_FIVE_Ato6, HASH_RANK_FIVE_ATO6, FLUSH_RANK_FIVE_ATO6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE", function() { return HASHES_OF_FIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_CHECK_FIVE", function() { return FLUSH_CHECK_FIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_FIVE", function() { return HASH_RANK_FIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_RANK_FIVE", function() { return FLUSH_RANK_FIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_LOW8", function() { return HASHES_OF_FIVE_LOW8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_FIVE_LOW8", function() { return HASH_RANK_FIVE_LOW8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_LOW9", function() { return HASHES_OF_FIVE_LOW9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_FIVE_LOW9", function() { return HASH_RANK_FIVE_LOW9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_LOW_Ato5", function() { return HASHES_OF_FIVE_LOW_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_FIVE_LOW_Ato5", function() { return HASH_RANK_FIVE_LOW_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_Ato6", function() { return HASHES_OF_FIVE_Ato6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_FIVE_ATO6", function() { return HASH_RANK_FIVE_ATO6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_RANK_FIVE_ATO6", function() { return FLUSH_RANK_FIVE_ATO6; });
/* harmony import */ var _hashesCreator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hashesCreator */ "../src/hashesCreator.ts");
/**hashes to be created at boot by default!!!! */

/**HIGH*/
const HASHES_OF_FIVE = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOfFiveHashes"])();
const FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
const HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
const FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;
/**LOW Ato5*/
const HASHES_OF_FIVE_LOW8 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Low8"])();
const HASH_RANK_FIVE_LOW8 = HASHES_OF_FIVE_LOW8.HASHES;
const HASHES_OF_FIVE_LOW9 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Low9"])();
const HASH_RANK_FIVE_LOW9 = HASHES_OF_FIVE_LOW9.HASHES;
const HASHES_OF_FIVE_LOW_Ato5 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Full"])();
const HASH_RANK_FIVE_LOW_Ato5 = HASHES_OF_FIVE_LOW_Ato5.HASHES;
/**LOW Ato6*/
const HASHES_OF_FIVE_Ato6 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToSix_Full"])();
const HASH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.HASHES;
const FLUSH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.FLUSH_RANK_HASHES;


/***/ }),

/***/ "../src/pokerHashes7.ts":
/*!******************************!*\
  !*** ../src/pokerHashes7.ts ***!
  \******************************/
/*! exports provided: FAST_HASH_DEFINED, HASHES_OF_FIVE_ON_SEVEN, FLUSH_CHECK_SEVEN, HASH_RANK_SEVEN, FLUSH_RANK_SEVEN, HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, FLUSH_CHECK_SEVEN_LOWBALL27, HASH_RANK_SEVEN_LOWBALL27, FLUSH_RANK_SEVEN_LOWBALL27, HASHES_OF_SEVEN_LOW8, HASH_RANK_SEVEN_LOW8, HASHES_OF_SEVEN_LOW9, HASH_RANK_SEVEN_LOW9, HASHES_OF_SEVEN_LOW_Ato5, HASH_RANK_SEVEN_LOW_Ato5, HASHES_OF_SEVEN_LOW_Ato6, FLUSH_CHECK_SEVEN_ATO6, HASH_RANK_SEVEN_ATO6, FLUSH_RANK_SEVEN_ATO6, fastHashesCreators */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FAST_HASH_DEFINED", function() { return FAST_HASH_DEFINED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_ON_SEVEN", function() { return HASHES_OF_FIVE_ON_SEVEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_CHECK_SEVEN", function() { return FLUSH_CHECK_SEVEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN", function() { return HASH_RANK_SEVEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_RANK_SEVEN", function() { return FLUSH_RANK_SEVEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_FIVE_ON_SEVEN_LOWBALL27", function() { return HASHES_OF_FIVE_ON_SEVEN_LOWBALL27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_CHECK_SEVEN_LOWBALL27", function() { return FLUSH_CHECK_SEVEN_LOWBALL27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN_LOWBALL27", function() { return HASH_RANK_SEVEN_LOWBALL27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_RANK_SEVEN_LOWBALL27", function() { return FLUSH_RANK_SEVEN_LOWBALL27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_SEVEN_LOW8", function() { return HASHES_OF_SEVEN_LOW8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN_LOW8", function() { return HASH_RANK_SEVEN_LOW8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_SEVEN_LOW9", function() { return HASHES_OF_SEVEN_LOW9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN_LOW9", function() { return HASH_RANK_SEVEN_LOW9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_SEVEN_LOW_Ato5", function() { return HASHES_OF_SEVEN_LOW_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN_LOW_Ato5", function() { return HASH_RANK_SEVEN_LOW_Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASHES_OF_SEVEN_LOW_Ato6", function() { return HASHES_OF_SEVEN_LOW_Ato6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_CHECK_SEVEN_ATO6", function() { return FLUSH_CHECK_SEVEN_ATO6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HASH_RANK_SEVEN_ATO6", function() { return HASH_RANK_SEVEN_ATO6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLUSH_RANK_SEVEN_ATO6", function() { return FLUSH_RANK_SEVEN_ATO6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fastHashesCreators", function() { return fastHashesCreators; });
/* harmony import */ var _hashesCreator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hashesCreator */ "../src/hashesCreator.ts");
/* harmony import */ var _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pokerHashes5 */ "../src/pokerHashes5.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");



const baseHashRankingSeven = {
    HASHES: {},
    FLUSH_HASHES: {},
    FLUSH_CHECK_KEYS: {},
    MULTI_FLUSH_RANK_HASHES: {},
    FLUSH_RANK_HASHES: {},
    baseRankValues: [],
    baseSuitValues: [],
    rankingInfos: []
};
/**make a config file like this:
 *
 * {
 * createOnBoot: {7:{high:true,low8:false....}}
 * }
 *
 * if an HASH is not created on boot clone an empty template
 * during runtime creation use Object.assign(HASH_OF_SEVEN,createRankOf5On7Hashes)
 */
const FAST_HASH_DEFINED = {
    high: false,
    Ato5: false,
    Ato6: false,
    "2to7": false,
    low8: false,
    low9: false
};
/*
export const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
export const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
export const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = createRankOf5On7Hashes(HASHES_OF_FIVE, true);
export const FLUSH_CHECK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
export const FLUSH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_SEVEN_LOW8 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8);
export const HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
export const HASHES_OF_SEVEN_LOW9 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9);
export const HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;
export const HASHES_OF_SEVEN_LOW_Ato5 = createRankOf7AceToFive_Low(
  HASHES_OF_FIVE_LOW_Ato5,
  rankCards_low,
  true
);
export const HASH_RANK_SEVEN_LOW_Ato5 = HASHES_OF_SEVEN_LOW_Ato5.HASHES;

export const HASHES_OF_SEVEN_LOW_Ato6 = createRankOf7AceToSix_Low(
  HASHES_OF_FIVE_Ato6,
  rankCards_low
);
export const FLUSH_CHECK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.HASHES;
export const FLUSH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;
*/
const HASHES_OF_FIVE_ON_SEVEN = JSON.parse(JSON.stringify(baseHashRankingSeven));
const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;
const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = JSON.parse(JSON.stringify(baseHashRankingSeven));
const FLUSH_CHECK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
const HASH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
const FLUSH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;
const HASHES_OF_SEVEN_LOW8 = JSON.parse(JSON.stringify(baseHashRankingSeven));
const HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
const HASHES_OF_SEVEN_LOW9 = JSON.parse(JSON.stringify(baseHashRankingSeven));
const HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;
const HASHES_OF_SEVEN_LOW_Ato5 = JSON.parse(JSON.stringify(baseHashRankingSeven));
const HASH_RANK_SEVEN_LOW_Ato5 = HASHES_OF_SEVEN_LOW_Ato5.HASHES;
const HASHES_OF_SEVEN_LOW_Ato6 = JSON.parse(JSON.stringify(baseHashRankingSeven));
const FLUSH_CHECK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
const HASH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.HASHES;
const FLUSH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;
const subAssignHashesSeven = (target, source) => {
    for (let p in target) {
        //@ts-ignore
        Object.assign(target[p], source[p]);
    }
};
const fastHashesCreators = {
    high: () => {
        subAssignHashesSeven(HASHES_OF_FIVE_ON_SEVEN, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5On7Hashes"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"]));
        FAST_HASH_DEFINED.high = true;
    },
    Ato5: () => {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW_Ato5, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToFive_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW_Ato5"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low"], true));
        FAST_HASH_DEFINED.Ato5 = true;
    },
    Ato6: () => {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW_Ato6, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToSix_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_Ato6"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low"]));
        FAST_HASH_DEFINED.Ato6 = true;
    },
    "2to7": () => {
        subAssignHashesSeven(HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5On7Hashes"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], true));
        FAST_HASH_DEFINED["2to7"] = true;
    },
    low8: () => {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW8, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToFive_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW8"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low8"]));
        FAST_HASH_DEFINED.low8 = true;
    },
    low9: () => {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW9, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToFive_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW9"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low9"]));
        FAST_HASH_DEFINED.low9 = true;
    },
};
/**do not export rank of 7 hashes...just export a function wrapper that could return falsy
 * in test files create all hashes
 * function replacement will be in gamblingjs.ts where a big object contains all evaluators (here they can be swapped for the faster one)
 */


/***/ }),

/***/ "../src/pokerMontecarloSym.ts":
/*!************************************!*\
  !*** ../src/pokerMontecarloSym.ts ***!
  \************************************/
/*! exports provided: categoryByRankingValue, getPartialHandStatsIndexed_7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "categoryByRankingValue", function() { return categoryByRankingValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPartialHandStatsIndexed_7", function() { return getPartialHandStatsIndexed_7; });
/* harmony import */ var kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kombinatoricsjs */ "../node_modules/kombinatoricsjs/dist/kombinatoricsjs.es5.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");
/* harmony import */ var _routines__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routines */ "../src/routines.ts");
/* harmony import */ var _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pokerEvaluator7 */ "../src/pokerEvaluator7.ts");




const DEFAULT_N_RUNS = 10000;
const categoryByRankingValue = (rank) => {
    let i = 0;
    while (rank > _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"][i])
        i++;
    return _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"][i];
};
/** @TODO compute total runs using combinations formula */
const getPartialHandStatsIndexed_7 = (partialHand, totalRuns = DEFAULT_N_RUNS) => {
    let stats = {
        'high card': 0,
        'one pair': 0,
        'two pair': 0,
        'three of a kind': 0,
        straight: 0,
        flush: 0,
        'full house': 0,
        'four of a kind': 0,
        'straight flush': 0,
        average: 0
    };
    let pHand = partialHand.map(c => _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_7"][c]);
    let partialDeck = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getDiffDeck7"])(pHand);
    const L = partialDeck.length;
    const missingCardsLength = 7 - partialHand.length;
    const fullHand = pHand.slice();
    fullHand.length = 7;
    let totalHandComputed = 0;
    for (let i = 0; i < totalRuns; i++) {
        Object(kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["shuffle"])(partialDeck);
        let j = 0, t = 0;
        while (j < L) {
            fullHand[pHand.length + t] = partialDeck[j];
            if (t === missingCardsLength) {
                //@ts-ignore
                let rank = Object(_pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEval"])(...fullHand);
                stats.average += rank;
                stats[categoryByRankingValue(rank)]++;
                t = 0;
                totalHandComputed++;
            }
            else {
                t++;
            }
            j++;
        }
    }
    for (let p in stats) {
        stats[p] /= totalHandComputed;
    }
    return stats;
};


/***/ }),

/***/ "../src/routines.ts":
/*!**************************!*\
  !*** ../src/routines.ts ***!
  \**************************/
/*! exports provided: getDiffDeck5, getDiffDeck7, atLeastFiveEqual, getVectorSum, getFlushSuit7, checkStraight5on7, singlePairsList, internalDoublePairsSort, sortedPairsToAdd, doublePairsList, trisList, fullHouseList, quadsList, checkStraight, checkDoublePair, removeStraights, _rankOfHand, _rankOf5onX, filterWinningCards, getFlushSuitFromIndex, handToCardsSymbols, handRankToGroup, fillRank5Ato5, fillRank5, fillRank5_ato5, fillRank5PlusFlushes, fillRankFlushes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDiffDeck5", function() { return getDiffDeck5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDiffDeck7", function() { return getDiffDeck7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "atLeastFiveEqual", function() { return atLeastFiveEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVectorSum", function() { return getVectorSum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlushSuit7", function() { return getFlushSuit7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkStraight5on7", function() { return checkStraight5on7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "singlePairsList", function() { return singlePairsList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "internalDoublePairsSort", function() { return internalDoublePairsSort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortedPairsToAdd", function() { return sortedPairsToAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doublePairsList", function() { return doublePairsList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trisList", function() { return trisList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullHouseList", function() { return fullHouseList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quadsList", function() { return quadsList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkStraight", function() { return checkStraight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkDoublePair", function() { return checkDoublePair; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeStraights", function() { return removeStraights; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_rankOfHand", function() { return _rankOfHand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_rankOf5onX", function() { return _rankOf5onX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterWinningCards", function() { return filterWinningCards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlushSuitFromIndex", function() { return getFlushSuitFromIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handToCardsSymbols", function() { return handToCardsSymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handRankToGroup", function() { return handRankToGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRank5Ato5", function() { return fillRank5Ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRank5", function() { return fillRank5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRank5_ato5", function() { return fillRank5_ato5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRank5PlusFlushes", function() { return fillRank5PlusFlushes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRankFlushes", function() { return fillRankFlushes; });
/* harmony import */ var kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kombinatoricsjs */ "../node_modules/kombinatoricsjs/dist/kombinatoricsjs.es5.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "../src/constants.ts");


/** rename in getDeckWithHandCardsRemoved */
const getDiffDeck5 = (listOfHands) => {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"].slice().filter(c => !listOfHands.includes(c));
};
const getDiffDeck7 = (listOfHands) => {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_7"].slice().filter(c => !listOfHands.includes(c));
};
const atLeastFiveEqual = (list) => {
    return list.filter(v => {
        let l = v.length;
        let c = 0, i = 1;
        while (i < l) {
            if (v[i] == v[i - 1]) {
                c++;
            }
            else {
                c = 0;
            }
            i++;
            if (c == 4)
                break;
        }
        return c >= 4;
    });
};
const getVectorSum = (v) => {
    let l = v.length;
    let s = 0;
    for (let i = 0; i < l; i++) {
        s += v[i];
    }
    return s;
};
const getFlushSuit7 = (v) => {
    if (v.length != 7) {
        return -1;
    }
    let t = v[0];
    let c = 0;
    let i = 1;
    while (i < 7) {
        if (t !== v[i]) {
            t = v[i];
            c = 0;
        }
        else {
            c++;
        }
        i++;
        /* istanbul ignore if  */
        if (c === 4)
            break;
    }
    return t;
};
const checkStraight5on7 = (arr) => {
    if (arr.length != 7) {
        return false;
    }
    let c = 0;
    if (arr[arr.length - 1] === 12 &&
        arr[0] === 0 &&
        arr.includes(1) &&
        arr.includes(2) &&
        arr.includes(3)) {
        return true;
    }
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i - 1] + 1 === arr[i]) {
            c++;
        }
        else {
            c = 0;
        }
        /* istanbul ignore if  */
        if (c === 4)
            break;
    }
    return c >= 4;
};
const singlePairsList = (startSet) => {
    let toAdd = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 3, 1);
    let singlePairs = [];
    for (let i = 0; i < startSet.length; ++i) {
        for (let j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                singlePairs.push([startSet[i], startSet[i], ...toAdd[j]]);
            }
        }
    }
    return singlePairs;
};
const internalDoublePairsSort = (a, b) => {
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    if (a[1] < b[1])
        return -1;
    if (a[1] > b[1])
        return 1;
    return 0;
};
const sortedPairsToAdd = (startSet) => {
    let _toAdd = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1);
    _toAdd.forEach(pair => {
        /* istanbul ignore next */
        if (pair[0] < pair[1]) {
            [pair[0], pair[1]] = [pair[1], pair[0]];
        }
    });
    _toAdd.sort(internalDoublePairsSort);
    return _toAdd;
};
const doublePairsList = (startSet, isLow = false) => {
    let toAdd = isLow
        ? kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    let doublePairs = [];
    for (let j = 0; j < toAdd.length; ++j) {
        for (let i = 0; i < startSet.length; ++i) {
            if (!toAdd[j].includes(startSet[i])) {
                doublePairs.push([toAdd[j][0], toAdd[j][0], toAdd[j][1], toAdd[j][1], startSet[i]]);
            }
        }
    }
    return doublePairs;
};
const trisList = (startSet, isLow = false) => {
    let toAdd = isLow
        ? kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    let tris = [];
    for (let i = 0; i < startSet.length; ++i) {
        for (let j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                tris.push([startSet[i], startSet[i], startSet[i], ...toAdd[j]]);
            }
        }
    }
    return tris;
};
const fullHouseList = (startSet) => {
    let fullHouses = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["crossProduct"](startSet, 2).filter(p => p[0] !== p[1]);
    return fullHouses.map((hand, idx) => {
        return [hand[0], hand[0], hand[0], hand[1], hand[1]];
    });
};
const quadsList = (startSet) => {
    let quads = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["crossProduct"](startSet, 2).filter(p => p[0] !== p[1]);
    return quads.map(hand => {
        return [hand[0], hand[0], hand[0], hand[0], hand[1]];
    });
};
const checkStraight = (arr) => {
    let cond = true;
    if (arr[4] === 12 && arr[0] === 0) {
        return arr[1] === 1 && arr[2] === 2 && arr[3] === 3;
    }
    if (arr[4] === 12 && arr[0] === 3) {
        return arr[1] === 2 && arr[2] === 1 && arr[3] === 0;
    }
    /* if (arr[4] === 12 && arr[0] === 11) {
       return arr[1] === 10 && arr[2] === 9 && arr[3] === 8;
     }*/
    for (let i = 1; i < arr.length; ++i) {
        cond = cond && Math.abs(arr[i - 1] - arr[i]) === 1;
    }
    return cond;
};
const checkDoublePair = (hand) => {
    /* istanbul ignore next */
    return ((hand[0] === hand[1] && hand[2] === hand[3] && hand[3] !== hand[4] && hand[1] !== hand[4]) ||
        (hand[0] === hand[1] && hand[3] === hand[4] && hand[3] !== hand[2] && hand[1] !== hand[2]) ||
        (hand[1] === hand[2] && hand[3] === hand[4] && hand[3] !== hand[0] && hand[2] !== hand[0]));
};
const removeStraights = (list) => {
    return list.filter((hand, idx) => {
        return !checkStraight(hand);
    });
};
const _rankOfHand = (hand, rankHash) => {
    return rankHash[getVectorSum(hand)];
};
const _rankOf5onX = (hand, rankHash, INVERTED = false) => {
    let comb = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["combinations"](hand, 5);
    let max = 0;
    comb.forEach(h => {
        let s = getVectorSum(h);
        let r = rankHash[s];
        INVERTED ? (r = _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - r) : null;
        max = max < r ? r : max;
    });
    return max;
};
/**
 * @function filterWinningCards
 * @param {Array} fullHand array of indexes in deck of cards 0..51 (more than 5 cards)
 * @param {Array} winningRanks array of 5 cards indexes
 * @return {Array} only cards of winning hand
 * @TODO add flushKey? ... in case a flush filtering is necessary ---> better to do it before this using another filer
 */
const filterWinningCards = (fullHand, winningRanks) => {
    let winning = {};
    winningRanks.forEach(c => {
        !winning[c] ? (winning[c] = 1) : winning[c]++;
    });
    let full = [];
    fullHand.forEach(card => {
        if (winning[card % 13] > 0) {
            winning[card % 13]--;
            full.push(card);
        }
    });
    return full;
};
/**
 * @function getFlushSuitFromIndex
 * @param {number} card index in deck 0...51
 * @return {string} only cards of winning hand
 */
const getFlushSuitFromIndex = (c) => {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["flushIndexToName"][~~(c / 13)];
};
/**
 * @function handToCardsSymbols
 * @param {Array} hand array of indexes in deck of cards 0..51
 * @return {Array} char face symbols representation of the indexed hand
 */
const handToCardsSymbols = (hand) => {
    return hand.map(c => _constants__WEBPACK_IMPORTED_MODULE_1__["rankToFaceSymbol"][c % 13]).join('');
};
const handRankToGroup = (rank, groupsRanking = _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"], groupNameMap = _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"]) => {
    let i = 0;
    let groupName = groupNameMap[i];
    while (rank > groupsRanking[i]) {
        i++;
        groupName = groupNameMap[i];
    }
    return groupName;
};
const fillRank5Ato5 = (h, idx, rankingObject) => {
    let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_Ato5_5cards"], _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames_Ato5"])
    };
    return rankingObject;
};
const fillRank5 = (h, idx, rankingObject, groupsRanking = _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"], groupNameMap = _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"]) => {
    let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, groupsRanking, groupNameMap)
    };
    return rankingObject;
};
const fillRank5_ato5 = (h, idx, rankingObject) => {
    let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx)
    };
    return rankingObject;
};
const fillRank5PlusFlushes = (h, idx, rankingObject, offset = _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSHES_BASE_START"] + _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_CARDS_5_AMOUNT"]) => {
    let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
    let r = idx + offset;
    rankingObject.HASHES[hash] = r;
    rankingObject.rankingInfos[r] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(r)
    };
    return rankingObject;
};
const fillRankFlushes = (h, rankingObject) => {
    let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
    let rank = rankingObject.HASHES[hash] + _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSHES_BASE_START"];
    rankingObject.FLUSH_RANK_HASHES[hash] = rank;
    rankingObject.rankingInfos[rank] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(rank)
    };
    return rankingObject;
};


/***/ }),

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div class=\"container-fluid\">\n  <div style=\"text-align:center\">\n    <h1>\n      Poker Hand Ranks Evaluator\n    </h1>\n\n  </div>\n\n\n  <div>\n    <app-fulldeck [cardPubSub]=\"localCardMessages\"></app-fulldeck>\n  </div>\n\n  <div>\n    <app-hand-analyzer [cardPubSub]=\"localCardMessages\"></app-hand-analyzer>\n  </div>\n\n  <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/fulldeck/fulldeck.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/fulldeck/fulldeck.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"full-deck\">\n\n  <div class=\"card\" *ngFor=\"let card of deck; let i = index\" [ngStyle]=backImages[card] (click)=\"cardClick(i)\">\n\n  </div>\n</div>\n<!-- deck-index={{card}}  -->\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/hand-analyzer/hand-analyzer.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/hand-analyzer/hand-analyzer.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"single-hand-container\">\n  <div class=\"single-hand\">\n\n    <div *ngFor=\"let card of hand; let i = index\" [ngClass]=\"handWinClasses[i]\" [ngStyle]=backImages[card]\n      (click)=\"cardClick(i)\">\n    </div>\n    <div class=\"columns data-panels\">\n      <div class=\"left-data-panel column\">\n        <table class=\"table is-fullwidth\">\n          <thead>\n            <tr>\n              <th>property</th>\n              <th>value</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>rank category</td>\n              <td>{{dataStats.rankCategory}}</td>\n            </tr>\n            <tr>\n              <td>rank value</td>\n              <td>{{dataStats.rankValue}}</td>\n            </tr>\n            <tr>\n              <td>average potential rank</td>\n              <td>{{dataStats.avgPotentialRank}}</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n      <div class=\"right-data-panel column\">\n        <table class=\"table is-fullwidth\">\n          <thead>\n            <tr>\n              <th>Hand Category</th>\n              <th>Frequency</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>high card</td>\n              <td>{{dataStats.stats[\"high card\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>one pair</td>\n              <td>{{dataStats.stats[\"one pair\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>two pair</td>\n              <td>{{dataStats.stats[\"two pair\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>three of a kind</td>\n              <td>{{dataStats.stats[\"three of a kind\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>straight</td>\n              <td>{{dataStats.stats[\"straight\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>flush</td>\n              <td>{{dataStats.stats[\"flush\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>full house</td>\n              <td>{{dataStats.stats[\"full house\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>four of a kind</td>\n              <td>{{dataStats.stats[\"four of a kind\"] || 0}}%</td>\n            </tr>\n            <tr>\n              <td>straight flush</td>\n              <td>{{dataStats.stats[\"straight flush\"] || 0}}%</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n"

/***/ }),

/***/ "./src/app/AbstractDeck.ts":
/*!*********************************!*\
  !*** ./src/app/AbstractDeck.ts ***!
  \*********************************/
/*! exports provided: AbstractDeck */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractDeck", function() { return AbstractDeck; });
class AbstractDeck {
    constructor(assetsUri) {
        this.assetsUri = assetsUri;
        this.cardsOut = 0;
        this.ranks = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "T",
            "J",
            "Q",
            "K",
            "A"
        ];
        this.deck = (new Array(52)).fill(0).map((v, i) => {
            return i;
        });
        this.suits = ['s', 'd', 'h', 'c'];
        this.backImages = this.deck.map((V, I) => {
            return { backgroundImage: `url(${this.assetsUri}${this.ranks[I % 13]}${this.suits[~~(I / 13)]}-min.png)` };
        });
        this.backFaceUrl = {
            backgroundImage: `url(${this.assetsUri}54-min.png)`
        };
        this.backImages.push({
            backgroundImage: `url(${this.assetsUri}54-min.png)`
        });
    }
}


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");



const routes = [];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubsub.service */ "./src/app/pubsub.service.ts");
/* harmony import */ var _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../src/gamblingjs */ "../src/gamblingjs.ts");




let AppComponent = class AppComponent {
    constructor() {
        this.title = 'gamble';
        this.localCardMessages = new _pubsub_service__WEBPACK_IMPORTED_MODULE_2__["DeckMessageService"]();
    }
    cardFromDeckToHand(ci) { }
    cardFromHandToDeck(ci) { }
    ngOnInit() {
        _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"].hashLoaders[7].high();
    }
};
AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
        styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
    })
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _fulldeck_fulldeck_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fulldeck/fulldeck.component */ "./src/app/fulldeck/fulldeck.component.ts");
/* harmony import */ var _hand_analyzer_hand_analyzer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hand-analyzer/hand-analyzer.component */ "./src/app/hand-analyzer/hand-analyzer.component.ts");







let AppModule = class AppModule {
};
AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
            _fulldeck_fulldeck_component__WEBPACK_IMPORTED_MODULE_5__["FulldeckComponent"],
            _hand_analyzer_hand_analyzer_component__WEBPACK_IMPORTED_MODULE_6__["HandAnalyzerComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"]
        ],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/fulldeck/fulldeck.component.scss":
/*!**************************************************!*\
  !*** ./src/app/fulldeck/fulldeck.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2Z1bGxkZWNrL2Z1bGxkZWNrLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/fulldeck/fulldeck.component.ts":
/*!************************************************!*\
  !*** ./src/app/fulldeck/fulldeck.component.ts ***!
  \************************************************/
/*! exports provided: FulldeckComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FulldeckComponent", function() { return FulldeckComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pubsub.service */ "./src/app/pubsub.service.ts");
/* harmony import */ var _AbstractDeck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../AbstractDeck */ "./src/app/AbstractDeck.ts");





let FulldeckComponent = 
/**@TODO create abstract class to inherit 80%of stuff...add FDS separatedly...or use more paramter in FDS */
class FulldeckComponent extends _AbstractDeck__WEBPACK_IMPORTED_MODULE_3__["AbstractDeck"] {
    constructor() {
        super("assets/imgs/");
    }
    ngOnInit() {
        this.cardPubSub.cardBackToDeck.subscribe((v) => { this.setCardBack(v); });
    }
    cardClick(cardIndex) {
        if (this.cardsOut == 7)
            return;
        if (this.deck[cardIndex] !== 52)
            this.deck[cardIndex] = 52;
        this.cardsOut++;
        this.cardPubSub.addCardToHand.emit(cardIndex);
    }
    setCardBack(cardIndex) {
        if (this.cardsOut == 0)
            return;
        this.deck[cardIndex] = cardIndex;
        this.cardsOut--;
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _pubsub_service__WEBPACK_IMPORTED_MODULE_2__["DeckMessageService"])
], FulldeckComponent.prototype, "cardPubSub", void 0);
FulldeckComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-fulldeck',
        template: __webpack_require__(/*! raw-loader!./fulldeck.component.html */ "./node_modules/raw-loader/index.js!./src/app/fulldeck/fulldeck.component.html"),
        styles: [__webpack_require__(/*! ./fulldeck.component.scss */ "./src/app/fulldeck/fulldeck.component.scss")]
    })
    /**@TODO create abstract class to inherit 80%of stuff...add FDS separatedly...or use more paramter in FDS */
    ,
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
], FulldeckComponent);



/***/ }),

/***/ "./src/app/hand-analyzer/hand-analyzer.component.scss":
/*!************************************************************!*\
  !*** ./src/app/hand-analyzer/hand-analyzer.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2hhbmQtYW5hbHl6ZXIvaGFuZC1hbmFseXplci5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/hand-analyzer/hand-analyzer.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/hand-analyzer/hand-analyzer.component.ts ***!
  \**********************************************************/
/*! exports provided: HandAnalyzerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HandAnalyzerComponent", function() { return HandAnalyzerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _AbstractDeck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../AbstractDeck */ "./src/app/AbstractDeck.ts");
/* harmony import */ var _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../src/gamblingjs */ "../src/gamblingjs.ts");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pubsub.service */ "./src/app/pubsub.service.ts");






console.log(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"]);
let HandAnalyzerComponent = class HandAnalyzerComponent extends _AbstractDeck__WEBPACK_IMPORTED_MODULE_2__["AbstractDeck"] {
    constructor() {
        super("assets/imgs/");
        this.dataStats = {
            rankCategory: "",
            rankValue: 0,
            avgPotentialRank: 0,
            stats: {
                'high card': 0,
                'one pair': 0,
                'two pair': 0,
                'three of a kind': 0,
                'straight': 0,
                'flush': 0,
                'full house': 0,
                'four of a kind': 0,
                'straight flush': 0,
                'average': 0
            }
        };
        this.cardsIn = 0;
        this.hand = [
            52,
            52,
            52,
            52,
            52,
            52,
            52
        ];
        this.handWinClasses = [
            "card",
            "card",
            "card",
            "card",
            "card",
            "card",
            "card"
        ];
        this.deck.push(52);
        this.backImages.push({
            backgroundImage: `url(${this.assetsUri}54-min.png)`
        });
    }
    ngOnInit() {
        this.cardPubSub.addCardToHand.subscribe((v) => { this.setCard(v); });
    }
    cardClick(cardIndex) {
        let card = this.hand[cardIndex];
        if (card !== 52) {
            this.hand[cardIndex] = 52;
            this.cardsIn--;
            this.cardPubSub.cardBackToDeck.emit(card);
            this.computeRankingFigures();
        }
        else
            return;
    }
    setCard(cardIndex) {
        if (this.cardsIn < 7) {
            let i = this.hand.findIndex(x => x == 52);
            this.hand[i] = cardIndex;
            this.cardsIn++;
            this.computeRankingFigures();
        }
        else
            return;
    }
    computeRankingFigures() {
        if (this.cardsIn == 7) {
            let handinfo = _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"].HandRankVerbose[7].high(this.hand[0], this.hand[1], this.hand[2], this.hand[3], this.hand[4], this.hand[5], this.hand[6]);
            this.dataStats.rankValue = handinfo.handRank;
            this.dataStats.rankCategory = handinfo.handGroup;
            //handinfo.flushSuit
            this.hand.forEach((h, i) => {
                if (handinfo.winningCards.includes(h)) {
                    this.handWinClasses[i] = "card winner";
                }
            });
            setTimeout(() => {
                this.resetWinners();
            }, 2000);
        }
        else {
            let subHand = this.hand.filter(c => c !== 52);
            let rank;
            let hInfo;
            if (subHand.length == 6) {
                rank = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["handOfSixEvalIndexed"])(...subHand);
                hInfo = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getHandInfo"])(rank);
            }
            else if (subHand.length == 5) {
                rank = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["handOfSixEvalIndexed"])(...subHand);
                hInfo = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getHandInfo"])(rank);
            }
            if (subHand.length > 4) {
                this.dataStats.rankValue = rank;
                this.dataStats.rankCategory = hInfo.handGroup;
            }
            let stats = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getPartialHandStatsIndexed_7"])(subHand, 1000);
            for (let s in stats) {
                this.dataStats.stats[s] = (100 * stats[s]).toFixed(2);
            }
            this.dataStats.avgPotentialRank = ~~stats.average;
        }
    }
    resetWinners() {
        for (let i = 0; i < this.handWinClasses.length; i++)
            this.handWinClasses[i] = "card";
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _pubsub_service__WEBPACK_IMPORTED_MODULE_4__["DeckMessageService"])
], HandAnalyzerComponent.prototype, "cardPubSub", void 0);
HandAnalyzerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-hand-analyzer',
        template: __webpack_require__(/*! raw-loader!./hand-analyzer.component.html */ "./node_modules/raw-loader/index.js!./src/app/hand-analyzer/hand-analyzer.component.html"),
        styles: [__webpack_require__(/*! ./hand-analyzer.component.scss */ "./src/app/hand-analyzer/hand-analyzer.component.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
], HandAnalyzerComponent);



/***/ }),

/***/ "./src/app/pubsub.service.ts":
/*!***********************************!*\
  !*** ./src/app/pubsub.service.ts ***!
  \***********************************/
/*! exports provided: DeckMessageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeckMessageService", function() { return DeckMessageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let DeckMessageService = class DeckMessageService {
    constructor() {
        this.addCardToHand = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.cardBackToDeck = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
], DeckMessageService.prototype, "addCardToHand", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
], DeckMessageService.prototype, "cardBackToDeck", void 0);
DeckMessageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
], DeckMessageService);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/ubuntu/Documents/projects/gamblingjs/gamble/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map