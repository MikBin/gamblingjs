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
var flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]; // to be implemented to speed up flushcheck on 7
var suitsHash = [0, 1, 8, 57]; // 4 one for each suit
/**check for !==undefined */
var flush5hHashCheck = {
    '0': 0,
    '5': 1,
    '40': 8,
    '285': 57
};
var flushHashToName = {
    0: 'spades',
    1: 'diamonds',
    8: 'hearts',
    57: 'clubs'
};
var flushIndexToName = ['spades', 'diamonds', 'hearts', 'clubs'];
var flush7HashCheck = {
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
var ranksHashOn7 = []; // 13 one for each rank
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
var ranksHashOn5 = []; // one for each rank
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
var rankToFaceSymbol = [
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
var suitToFaceSymbol = ['s', 'd', 'h', 'c'];
/*
arrays initialization
*/
var deckOfRanks_5 = new Array(52);
var deckOfRanks_7 = new Array(52);
var deckOfFlushes = new Array(52);
var deckOfSuits = new Array(52);
var fullCardsDeckHash_5 = new Array(52);
var fullCardsDeckHash_7 = new Array(52);
var cardHashToDescription_5 = {};
var cardHashToDescription_7 = {};
for (var i = 0; i < 52; i++) {
    deckOfRanks_5[i] = ranksHashOn5[i % 13];
    deckOfRanks_7[i] = ranksHashOn7[i % 13];
    deckOfFlushes[i] = flushHash[i % 13];
    deckOfSuits[i] = suitsHash[~~(i / 13)];
    var card5 = (fullCardsDeckHash_5[i] = (deckOfRanks_5[i] << 9) + deckOfSuits[i]);
    var card7 = (fullCardsDeckHash_7[i] = (deckOfRanks_7[i] << 9) + deckOfSuits[i]);
    cardHashToDescription_5[card5] = i;
    cardHashToDescription_7[card7] = i;
}
var STRAIGHTS = [
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
var rankCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var rankCards_low8 = [6, 5, 4, 3, 2, 1, 0, 12];
var rankCards_low9 = [7, 6, 5, 4, 3, 2, 1, 0, 12];
var rankCards_low = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
var HIGH_CARDS_5_AMOUNT = 1277;
var FLUSHES_BASE_START = 5863;
var STRAIGHT_FLUSH_BASE_START = 7452;
var HIGH_MAX_RANK = 7461;
var FLUSH_MASK = 511;
var STRAIGHT_FLUSH_OFFSET = 1599;
var handsRankingDelimiter_5cards = [
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
var handsRankingDelimiter_Ato5_5cards = [155, 311, 1169, 2027, 4887, 6174];
var handsRankingDelimiter_Ato6_5cards = handsRankingDelimiter_5cards.map(function (r) { return 7461 - r; });
handsRankingDelimiter_Ato6_5cards.pop();
handsRankingDelimiter_Ato6_5cards.reverse().push(7461);
//console.log(handsRankingDelimiter_Ato6_5cards);
var handRankingGroupNames_Ato5 = [
    'four of a kind',
    'full house',
    'three of a kind',
    'two pair',
    'one pair',
    'high card'
];
var handRankingGroupNames = [
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
var handRankingGroupNames_Ato6 = handRankingGroupNames.slice().reverse();
/**
 * fill with these:
 * https://en.wikipedia.org/wiki/Poker_probability
 */
var distinctHandsQuantityByGroup = {
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
var FIVE_CARD_POKER_EVAL = {
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
            "high": function () {
                throw Error("method not yet implemented");
            },
            "low8": function () {
                throw Error("method not yet implemented");
            },
            "low9": function () {
                throw Error("method not yet implemented");
            },
            "Ato5": function () {
                throw Error("method not yet implemented");
            },
            "Ato6": function () {
                throw Error("method not yet implemented");
            },
            "2to7": function () {
                throw Error("method not yet implemented");
            }
        },
        7: {
            "high": function () {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].high();
                FIVE_CARD_POKER_EVAL.HandRank[7].high = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalIndexed"];
                //FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high = SevenEvaluators.handOfSevenEvalIndexed_Verbose
            },
            "low8": function () {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].low8();
                FIVE_CARD_POKER_EVAL.HandRank[7].low8 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalHiLow8Indexed"];
            },
            "low9": function () {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].low9();
                FIVE_CARD_POKER_EVAL.HandRank[7].low9 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalHiLow9Indexed"];
            },
            "Ato5": function () {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].Ato5();
                FIVE_CARD_POKER_EVAL.HandRank[7].Ato5 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEvalLow_Ato5Indexed"];
            },
            "Ato6": function () {
                _src_pokerHashes7__WEBPACK_IMPORTED_MODULE_4__["fastHashesCreators"].Ato6();
                FIVE_CARD_POKER_EVAL.HandRank[7].Ato6 = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEval_Ato6Indexed"];
            },
            "2to7": function () {
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




var createRankOfFiveHashes = function () {
    var hashRankingOfFive = {
        HASHES: {},
        FLUSH_CHECK_KEYS: _constants__WEBPACK_IMPORTED_MODULE_0__["flush5hHashCheck"],
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(7462)
    };
    //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
    var rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"];
    var STRAIGHTS = _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHTS"];
    var HIGH_CARDS_5_AMOUNT = _constants__WEBPACK_IMPORTED_MODULE_0__["HIGH_CARDS_5_AMOUNT"];
    var highCards = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1);
    var HIGH_CARDS = _routines__WEBPACK_IMPORTED_MODULE_1__["removeStraights"](highCards);
    var SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    var DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards);
    var TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards);
    var FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    var QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    var upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS);
    upToStraights.forEach(function (h, idx) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx, hashRankingOfFive);
    });
    var aboveStraights = FULLHOUSES.concat(QUADS);
    aboveStraights.forEach(function (h, idx) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5PlusFlushes"])(h, idx, hashRankingOfFive);
    });
    /**FLUSHES and STRAIGHT FLUSHES */
    HIGH_CARDS.forEach(function (h) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRankFlushes"])(h, hashRankingOfFive);
    });
    STRAIGHTS.forEach(function (h, idx) {
        var hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(function (card) { return hashRankingOfFive.baseRankValues[card]; }));
        var rank = idx + _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHT_FLUSH_BASE_START"];
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
var createRankOf5On7Hashes = function (hashRankOfFive, INVERTED) {
    if (INVERTED === void 0) { INVERTED = false; }
    var hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"];
    var ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
    kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 7, 4).forEach(function (hand, i) {
        var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
        var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
        var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        hashRankingOfFiveOnSeven.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES, INVERTED);
    });
    var FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.MULTI_FLUSH_RANK_HASHES;
    var fiveFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 5);
    var sixFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 6);
    var sevenFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](rankCards, 7);
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingOfFiveOnSeven.baseRankValues[c]; });
        var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        var rank = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.FLUSH_RANK_HASHES, INVERTED);
        FLUSH_RANK_HASHES[h.length][hash7] = rank;
    });
    var fiveFlushHashes = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [8, 8, 8, 8, 8], [57, 57, 57, 57, 57]];
    var sixFlushHashes = [];
    fiveFlushHashes.forEach(function (v, i) {
        sixFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });
    var sevenFlushHashes = [];
    sixFlushHashes.forEach(function (v) {
        sevenFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
    });
    var FLUSH_CHECK_KEYS = hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS;
    if (INVERTED) {
        sevenFlushHashes = [
            [0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [8, 8, 8, 8, 8, 8, 8],
            [57, 57, 57, 57, 57, 57, 57]
        ];
    }
    sevenFlushHashes.forEach(function (h) {
        FLUSH_CHECK_KEYS[Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h)] = h[0];
    });
    return hashRankingOfFiveOnSeven;
};
var createRankOf5AceToFive_Low8 = function () {
    var lowHands = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"]([6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    var hashRankingLow8 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach(function (h, idx) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx, hashRankingLow8);
    });
    /**change rankking infos as straights have to have different names */
    return hashRankingLow8;
};
var createRankOf5AceToFive_Full = function () {
    var rankCards = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(6175)
    };
    var QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    var FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    var TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards, true);
    var DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards, true);
    var SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    var HIGH_CARDS = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1);
    var all = QUADS.concat(FULLHOUSES, TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS);
    all.forEach(function (h, idx) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5Ato5"])(h, idx, hashRankingLow);
    });
    return hashRankingLow;
};
var createRankOf5AceToSix_Full = function () {
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(7462)
    };
    var rankCards = _constants__WEBPACK_IMPORTED_MODULE_0__["rankCards_low"];
    var STRAIGHTS = _constants__WEBPACK_IMPORTED_MODULE_0__["STRAIGHTS"].slice(0, 9).reverse();
    var QUADS = _routines__WEBPACK_IMPORTED_MODULE_1__["quadsList"](rankCards);
    var FULLHOUSES = _routines__WEBPACK_IMPORTED_MODULE_1__["fullHouseList"](rankCards);
    var TRIPLES = _routines__WEBPACK_IMPORTED_MODULE_1__["trisList"](rankCards, true);
    var DOUBLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["doublePairsList"](rankCards, true);
    var SINGLE_PAIRS = _routines__WEBPACK_IMPORTED_MODULE_1__["singlePairsList"](rankCards);
    var HIGH_CARDS = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](rankCards, 5, 1).filter(function (H, i) {
        return !_routines__WEBPACK_IMPORTED_MODULE_1__["checkStraight"](H);
    });
    /**fill straight flushes as are the lowest hand possbile */
    STRAIGHTS.forEach(function (h, idx) {
        var hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
        var rank = idx;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handToCardsSymbols"])(h),
            handGroup: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handRankToGroup"])(rank, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"])
        };
    });
    var FLUSH_GAP = STRAIGHTS.length;
    /**@TODO verify how does straight AKQJT have to be valuated...if ACE counts for low only it should NOT BE a straight!!!! */
    QUADS.concat(FULLHOUSES).forEach(function (h, idx) {
        /**add straights.length because of straight flushes are the lowest to be added */
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx + FLUSH_GAP, hashRankingLow);
    });
    FLUSH_GAP += QUADS.length + FULLHOUSES.length;
    HIGH_CARDS.forEach(function (h, idx) {
        var hash = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
        var rank = idx + FLUSH_GAP;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handToCardsSymbols"])(h),
            handGroup: Object(_routines__WEBPACK_IMPORTED_MODULE_1__["handRankToGroup"])(rank, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"])
        };
    });
    FLUSH_GAP += HIGH_CARDS.length;
    STRAIGHTS.concat(TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS).forEach(function (h, idx) {
        Object(_routines__WEBPACK_IMPORTED_MODULE_1__["fillRank5"])(h, idx + FLUSH_GAP, hashRankingLow, _constants__WEBPACK_IMPORTED_MODULE_0__["handsRankingDelimiter_Ato6_5cards"], _constants__WEBPACK_IMPORTED_MODULE_0__["handRankingGroupNames_Ato6"]);
    });
    return hashRankingLow;
};
var createRankOf7AceToSix_Low = function (hashRankOfFive, baseLowRanking) {
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var ranksHashOn7 = _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"];
    /**filling ranks */
    kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 7, 4).forEach(function (hand, idx) {
        var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
        var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
        var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
    });
    /*let fiveFlushes = kombinatoricsJs.combinations(baseLowRanking, 5);
    let sixFlushes = kombinatoricsJs.combinations(baseLowRanking, 6);*/
    var sevenFlushes = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["combinations"](baseLowRanking, 7);
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
    var sevenFlushHashes = [
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [8, 8, 8, 8, 8, 8, 8],
        [57, 57, 57, 57, 57, 57, 57]
    ];
    /**filling only seven flushes as for 5 and 6 the best hand would never be a flush but another combos */
    sevenFlushHashes.forEach(function (h) {
        hashRankingLow.FLUSH_CHECK_KEYS[Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h)] = h[0];
    });
    sevenFlushes.forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingLow.baseRankValues[c]; });
        var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
        var rank = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.FLUSH_RANK_HASHES);
        hashRankingLow.FLUSH_RANK_HASHES[hash7] = rank;
    });
    return hashRankingLow;
};
var createRankOf7AceToFive_Low = function (hashRankOfFive, baseLowRanking, fullFlag) {
    if (fullFlag === void 0) { fullFlag = false; }
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var ranksHashOn7 = _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn7"];
    if (fullFlag) {
        kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 7, 4).forEach(function (hand, idx) {
            var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
            var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
            var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
            hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
        });
    }
    else {
        var lowHands_1 = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](baseLowRanking, 5, 1);
        kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"](_constants__WEBPACK_IMPORTED_MODULE_0__["rankCards"], 2, 2).forEach(function (pair, i) {
            lowHands_1.forEach(function (lo, idx) {
                var hand = lo.concat(pair);
                var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
                var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
                var hash7 = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["getVectorSum"])(h7);
                hashRankingLow.HASHES[hash7] = Object(_routines__WEBPACK_IMPORTED_MODULE_1__["_rankOf5onX"])(h5, hashRankOfFive.HASHES);
            });
        });
    }
    return hashRankingLow;
};
var createRankOf5AceToFive_Low9 = function () {
    var lowHands = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_2__["multiCombinations"]([7, 6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    var hashRankingLow9 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: _constants__WEBPACK_IMPORTED_MODULE_0__["ranksHashOn5"],
        baseSuitValues: _constants__WEBPACK_IMPORTED_MODULE_0__["suitsHash"],
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach(function (h, idx) {
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
var handOfFiveEval = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
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
var handOfFiveEvalHiLow = function (LOW_RANK_HASH, c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var low = LOW_RANK_HASH[rankKey];
    var bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    var flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
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
var handOfFiveEvalHiLow8 = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalHiLow(_pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW8"], c1, c2, c3, c4, c5);
};
var handOfFiveEvalHiLow8Indexed = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalHiLow8(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfFiveEvalHiLow9 = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalHiLow(_pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW9"], c1, c2, c3, c4, c5);
};
var handOfFiveEvalHiLow9Indexed = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalHiLow9(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalLow_Ato5
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for Ato5 rules
 */
var handOfFiveEvalLow_Ato5 = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var rank = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_LOW_Ato5"][rankKey];
    return rank;
};
/** @function handOfFiveEvalLow_Ato5Indexed
 *
 * @param {Number} c1...c5 cards index in standard deck 52
 * @returns {number} hand ranking for Ato5 rules
 */
var handOfFiveEvalLow_Ato5Indexed = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalLow_Ato5(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
var handOfFiveEvalLow_Ato6 = function (c1, c2, c3, c4, c5) {
    var keySum = c1 + c2 + c3 + c4 + c5;
    var rankKey = keySum >>> 9;
    var flush_check_key = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_FIVE"][keySum & _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["FLUSH_RANK_FIVE_ATO6"][rankKey];
    }
    return _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_FIVE_ATO6"][rankKey];
};
var handOfFiveEvalLow_Ato6Indexed = function (c1, c2, c3, c4, c5) {
    return handOfFiveEvalLow_Ato6(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function handOfFiveEvalLowBall27
 *
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
var handOfFiveEvalLowBall27 = function (c1, c2, c3, c4, c5) {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - handOfFiveEval(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalLowBall27Indexed
 *
 * @param {Number} c1...c5 cards hash from 0-51
 * @returns {number} hand ranking for lowBall 2to7 basically inverse of high rank
 */
var handOfFiveEvalLowBall27Indexed = function (c1, c2, c3, c4, c5) {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_MAX_RANK"] - handOfFiveEvalIndexed(c1, c2, c3, c4, c5);
};
/** @function handOfFiveEvalIndexed
 *
 * @param {Number} c1...c5 cards index from [0...51]
 * @returns {Number} hand ranking
 */
var handOfFiveEvalIndexed = function (c1, c2, c3, c4, c5) {
    return handOfFiveEval(_constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c1], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c2], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c3], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c4], _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"][c5]);
};
/** @function getHandInfo
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
var getHandInfo = function (rank, HASHES, INVERTED) {
    if (HASHES === void 0) { HASHES = _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE"]; }
    if (INVERTED === void 0) { INVERTED = false; }
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
var getHandInfo27 = function (rank) {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE"], true);
};
/** @function getHandInfoLow8
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
var getHandInfoLow8 = function (rank) {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW8"]);
};
/** @function getHandInfoLow9
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
var getHandInfoLow9 = function (rank) {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW9"]);
};
/** @function getHandInfoAto5
 *
 * @param {Number} hand rank
 * @returns {handInfo} object containing hand info
 */
var getHandInfoAto5 = function (rank) {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_LOW_Ato5"]);
};
/** @function getHandInfoAto6
*
* @param {Number} hand rank
* @returns {handInfo} object containing hand info
*/
var getHandInfoAto6 = function (rank) {
    return getHandInfo(rank, _pokerHashes5__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_Ato6"]);
};
/** @function bfBestOfFiveOnX  @TODO move on routines or create helpersfunction.ts
*
* @param {Array:Number[]} hand array of 6 or more cards making up an hand
* @param {Function} evalFn evaluator defaults to hand of 5 high only
* @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
*/
var bfBestOfFiveOnX = function (hand, evalFn) {
    if (evalFn === void 0) { evalFn = handOfFiveEval; }
    //@ts-ignore
    return Math.max.apply(Math, kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5).map(function (h) { return evalFn.apply(void 0, h); }));
};
/** @function bfBestOfFiveOnXindexed
 *
 * @param {Array:Number[]} hand array of 6 or more cards making up an hand
 * @param {Function} evalFn evaluator defaults to hand of 5 high only
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var bfBestOfFiveOnXindexed = function (hand, evalFn) {
    if (evalFn === void 0) { evalFn = handOfFiveEvalIndexed; }
    //@ts-ignore
    return Math.max.apply(Math, kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5).map(function (h) { return evalFn.apply(void 0, h); }));
};
var bestFiveOnXHiLowIndexed = function (evalFn, hand) {
    var res = { hi: -1, low: -1 };
    //@ts-ignore
    var all = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5)
        //@ts-ignore
        .map(function (hand) { return evalFn.apply(void 0, hand); });
    all.forEach(function (R, i) {
        R.hi > res.hi ? (res.hi = R.hi) : null;
        R.low > res.low ? (res.low = R.low) : null;
    });
    return res;
};
/**to be used in generic verbose eval function  */
var evaluatorByGameType = {
    "high": handOfFiveEvalIndexed,
    "low8": handOfFiveEvalHiLow8Indexed,
    "low9": handOfFiveEvalHiLow9Indexed,
    "Ato5": handOfFiveEvalLow_Ato5Indexed,
    "Ato6": handOfFiveEvalLow_Ato6Indexed,
    "2to7": handOfFiveEvalLowBall27Indexed
};
var evaluatorInfoByGameType = {
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
var getHandInfo5onX = function (hand, gameType) {
    var combinations = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_3__["combinations"](hand, 5);
    var evalFn = evaluatorByGameType[gameType];
    var rank = Math.max.apply(Math, combinations.map(function (H) { return evalFn.apply(void 0, H); }));
    var handInfo = evaluatorInfoByGameType[gameType](rank);
    var winningCards = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfo.hand);
    var flushSuit = handInfo.handGroup == "flush" ? Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getFlushSuitFromIndex"])(winningCards[0]) : "no flush";
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
var getHandInfo5onXHiLow = function (hand, gameType) {
    var evalFn = evaluatorByGameType[gameType];
    var ranks = bestFiveOnXHiLowIndexed(evalFn, hand);
    var handInfoLow = evaluatorInfoByGameType[gameType](ranks.low);
    var winningCardsLow = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfoLow.hand);
    var handInfoHi = evaluatorInfoByGameType["high"](ranks.hi);
    var winningCardsHi = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["filterWinningCards"])(hand, handInfoHi.hand);
    var flushSuit = handInfoHi.handGroup == "flush" ? Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getFlushSuitFromIndex"])(winningCardsHi[0]) : "no flush";
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
var handOfSixEvalIndexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand);
};
/** @function handOfSixEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSixEvalLowBall27Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLowBall27Indexed"]);
};
/** @function handOfSixEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSixEvalAto5Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato5Indexed"]);
};
/** @function handOfSixEvalAto5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSixEvalAto6Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalLow_Ato6Indexed"]);
};
/** @function handOfSixEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSixEvalHiLow8Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["handOfFiveEvalHiLow8Indexed"], hand);
};
/** @function handOfSixEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSixEvalHiLow9Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
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
var _handOfSixEvalIndexed_Verbose = function (hand) {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "high");
};
/** @function _handOfSixEvalLowBall27Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
var _handOfSixEvalLowBall27Indexed_Verbose = function (hand) {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "2to7");
};
/** @function _handOfSixEvalAto5Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
var _handOfSixEvalAto5Indexed_Verbose = function (hand) {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "Ato5");
};
/** @function _handOfSixEvalAto6Indexed_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
var _handOfSixEvalAto6Indexed_Verbose = function (hand) {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "Ato6");
};
/** @function _handOfSixEvalLow8_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
var _handOfSixEvalLow8_Verbose = function (hand) {
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_0__["getHandInfo5onX"])(hand, "low8");
};
/** @function _handOfSixEvalLow9_Verbose
*
* @param {Array:Number[]} array of 6 cards making up an hand
* @returns {verboseHandInfo} hand info about the winning subgroup of 5 cards
*/
var _handOfSixEvalLow9_Verbose = function (hand) {
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
var handOfSevenEval = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        /**no full house or quads possible ---> can return flush_rank */
        var flushyCardsCounter = 0;
        var flushRankKey = 0;
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
var handOfSevenEvalLowBall27 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN_LOWBALL27"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
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
var handOfSevenEvalLowBall27Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalLowBall27(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEval_Ato6
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {Number} hand ranking for lowball Ato6
 */
var handOfSevenEval_Ato6 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN_ATO6"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
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
var handOfSevenEval_Ato6Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval_Ato6(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow
 *
 * @param {NumberMap} hash rannking for low hands, depending on which ato5 low is used: can be low8 low9 or lowAll
 * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
 * @returns {hiLowRank} hand ranking object for both low and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalHiLow = function (LOW_RANK_HASH, c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var rankKey = keySum >>> 9;
    var low = LOW_RANK_HASH[rankKey];
    var bothRank = {
        hi: 0,
        low: isNaN(low) ? -1 : low
    };
    var flush_check_key = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["FLUSH_CHECK_SEVEN"][keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    if (flush_check_key >= 0) {
        var flushyCardsCounter = 0;
        var flushRankKey = 0;
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
var handOfSevenEvalLow_Ato5 = function (c1, c2, c3, c4, c5, c6, c7) {
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var rankKey = keySum >>> 9;
    var rank = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW_Ato5"][rankKey];
    return rank;
};
/** @function handOfSevenEvalLow_Ato5Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalLow_Ato5Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalLow_Ato5(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow8
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalHiLow8 = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalHiLow(_pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW8"], c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow8Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 8 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalHiLow8Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalHiLow8(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalHiLow9
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalHiLow9 = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalHiLow(_pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASH_RANK_SEVEN_LOW9"], c1, c2, c3, c4, c5, c6, c7);
};
/** @function handOfSevenEvalHiLow9Indexed
 *
 * @param {NumberMap} hash ranking for low hands
 * @param {Number} c1...c7 cards index from 0 to 12
 * @returns {hiLowRank} hand ranking object for both low 9 or better, and high ( if doesnt qualify for low it returns -1)
 */
var handOfSevenEvalHiLow9Indexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEvalHiLow9(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEvalIndexed
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7]);
};
/** @function handOfSevenEval_Verbose
 *
 * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
 * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
 */
var handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK, INVERTED) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN"]; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"]; }
    if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
    if (INVERTED === void 0) { INVERTED = false; }
    var _FLUSH_CHECK_SEVEN = SEVEN_EVAL_HASH.FLUSH_CHECK_KEYS;
    var _FLUSH_RANK_SEVEN = USE_MULTI_FLUSH_RANK
        ? SEVEN_EVAL_HASH.MULTI_FLUSH_RANK_HASHES
        : SEVEN_EVAL_HASH.FLUSH_RANK_HASHES;
    var _HASH_RANK_SEVEN = SEVEN_EVAL_HASH.HASHES;
    var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    var handRank = 0;
    var flush_check_key = _FLUSH_CHECK_SEVEN[keySum & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]];
    var flushRankKey = 0;
    var handVector = [c1, c2, c3, c4, c5, c6, c7];
    if (flush_check_key >= 0) {
        handVector = handVector.filter(function (c, i) {
            return (c & _constants__WEBPACK_IMPORTED_MODULE_3__["FLUSH_MASK"]) == flush_check_key;
        });
        handVector.forEach(function (c) { return (flushRankKey += c); });
        handRank = USE_MULTI_FLUSH_RANK
            //@ts-ignore
            ? _FLUSH_RANK_SEVEN[handVector.length][flushRankKey >>> 9] : _FLUSH_RANK_SEVEN[flushRankKey >>> 9];
    }
    else {
        handRank = _HASH_RANK_SEVEN[keySum >>> 9];
        flushRankKey = -1;
    }
    var handIndexes = handVector.map(function (c) { return _constants__WEBPACK_IMPORTED_MODULE_3__["cardHashToDescription_7"][c]; });
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
    var wHand = FIVE_EVAL_HASH.rankingInfos[INVERTED ? _constants__WEBPACK_IMPORTED_MODULE_3__["HIGH_MAX_RANK"] - handRank : handRank].hand;
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
var handOfSevenEvalLowBall27Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN_LOWBALL27"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], true, true);
};
var handOfSevenEvalAto6Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW_Ato6"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_Ato6"], false);
};
/** @function handOfSevenEvalIndexed_Verbose
 *
 * @param {Array:Number[]} array of 7 cards making up an hand
 * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
 */
var handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK) {
    if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_FIVE_ON_SEVEN"]; }
    if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"]; }
    if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
};
var handOfSevenEvalAto5Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW_Ato5"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW_Ato5"], false);
};
var handOfSevenEvalLow8Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
    return handOfSevenEval_Verbose(_constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c1], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c2], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c3], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c4], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c5], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c6], _constants__WEBPACK_IMPORTED_MODULE_3__["fullCardsDeckHash_7"][c7], _pokerHashes7__WEBPACK_IMPORTED_MODULE_0__["HASHES_OF_SEVEN_LOW8"], _pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW8"], false);
};
var handOfSevenEvalLow9Indexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
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
var _handOfSevenEvalIndexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand);
};
/** @function _handOfSevenEvalLowBall27Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var _handOfSevenEvalLowBall27Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLowBall27Indexed"]);
};
/** @function _handOfSevenEvalato5Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var _handOfSevenEvalLow_Ato5Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLow_Ato5Indexed"]);
};
/** @function _handOfSevenEvalAto6Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var _handOfSevenEval_Ato6Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bfBestOfFiveOnXindexed"])(hand, _pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalLow_Ato6Indexed"]);
};
/** @function _handOfSevenEvalHiLow8Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var _handOfSevenEvalHiLow8Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
    return Object(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["bestFiveOnXHiLowIndexed"])(_pokerEvaluator5__WEBPACK_IMPORTED_MODULE_2__["handOfFiveEvalHiLow8Indexed"], hand);
};
/** @function _handOfSevenEvalHiLow9Indexed
 *
 * @param {Array:Number[]} array of 6 cards making up an hand
 * @returns {hiLowRank} hand ranking ( the best one on all combinations of input card in group of 5)
 */
var _handOfSevenEvalHiLow9Indexed = function () {
    var hand = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hand[_i] = arguments[_i];
    }
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
var HASHES_OF_FIVE = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOfFiveHashes"])();
var FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
var HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
var FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;
/**LOW Ato5*/
var HASHES_OF_FIVE_LOW8 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Low8"])();
var HASH_RANK_FIVE_LOW8 = HASHES_OF_FIVE_LOW8.HASHES;
var HASHES_OF_FIVE_LOW9 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Low9"])();
var HASH_RANK_FIVE_LOW9 = HASHES_OF_FIVE_LOW9.HASHES;
var HASHES_OF_FIVE_LOW_Ato5 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToFive_Full"])();
var HASH_RANK_FIVE_LOW_Ato5 = HASHES_OF_FIVE_LOW_Ato5.HASHES;
/**LOW Ato6*/
var HASHES_OF_FIVE_Ato6 = Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5AceToSix_Full"])();
var HASH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.HASHES;
var FLUSH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.FLUSH_RANK_HASHES;


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



var baseHashRankingSeven = {
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
var FAST_HASH_DEFINED = {
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
var HASHES_OF_FIVE_ON_SEVEN = JSON.parse(JSON.stringify(baseHashRankingSeven));
var FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
var FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;
var HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = JSON.parse(JSON.stringify(baseHashRankingSeven));
var FLUSH_CHECK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
var FLUSH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;
var HASHES_OF_SEVEN_LOW8 = JSON.parse(JSON.stringify(baseHashRankingSeven));
var HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
var HASHES_OF_SEVEN_LOW9 = JSON.parse(JSON.stringify(baseHashRankingSeven));
var HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;
var HASHES_OF_SEVEN_LOW_Ato5 = JSON.parse(JSON.stringify(baseHashRankingSeven));
var HASH_RANK_SEVEN_LOW_Ato5 = HASHES_OF_SEVEN_LOW_Ato5.HASHES;
var HASHES_OF_SEVEN_LOW_Ato6 = JSON.parse(JSON.stringify(baseHashRankingSeven));
var FLUSH_CHECK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
var HASH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.HASHES;
var FLUSH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;
var subAssignHashesSeven = function (target, source) {
    for (var p in target) {
        //@ts-ignore
        Object.assign(target[p], source[p]);
    }
};
var fastHashesCreators = {
    high: function () {
        subAssignHashesSeven(HASHES_OF_FIVE_ON_SEVEN, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5On7Hashes"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"]));
        FAST_HASH_DEFINED.high = true;
    },
    Ato5: function () {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW_Ato5, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToFive_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW_Ato5"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low"], true));
        FAST_HASH_DEFINED.Ato5 = true;
    },
    Ato6: function () {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW_Ato6, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToSix_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_Ato6"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low"]));
        FAST_HASH_DEFINED.Ato6 = true;
    },
    "2to7": function () {
        subAssignHashesSeven(HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf5On7Hashes"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE"], true));
        FAST_HASH_DEFINED["2to7"] = true;
    },
    low8: function () {
        subAssignHashesSeven(HASHES_OF_SEVEN_LOW8, Object(_hashesCreator__WEBPACK_IMPORTED_MODULE_0__["createRankOf7AceToFive_Low"])(_pokerHashes5__WEBPACK_IMPORTED_MODULE_1__["HASHES_OF_FIVE_LOW8"], _constants__WEBPACK_IMPORTED_MODULE_2__["rankCards_low8"]));
        FAST_HASH_DEFINED.low8 = true;
    },
    low9: function () {
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




var DEFAULT_N_RUNS = 10000;
var categoryByRankingValue = function (rank) {
    var i = 0;
    while (rank > _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"][i])
        i++;
    return _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"][i];
};
/** @TODO compute total runs using combinations formula */
var getPartialHandStatsIndexed_7 = function (partialHand, totalRuns) {
    if (totalRuns === void 0) { totalRuns = DEFAULT_N_RUNS; }
    var stats = {
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
    var pHand = partialHand.map(function (c) { return _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_7"][c]; });
    var partialDeck = Object(_routines__WEBPACK_IMPORTED_MODULE_2__["getDiffDeck7"])(pHand);
    var L = partialDeck.length;
    var missingCardsLength = 7 - partialHand.length;
    var fullHand = pHand.slice();
    fullHand.length = 7;
    var totalHandComputed = 0;
    for (var i = 0; i < totalRuns; i++) {
        Object(kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["shuffle"])(partialDeck);
        var j = 0, t = 0;
        while (j < L) {
            fullHand[pHand.length + t] = partialDeck[j];
            if (t === missingCardsLength) {
                //@ts-ignore
                var rank = _pokerEvaluator7__WEBPACK_IMPORTED_MODULE_3__["handOfSevenEval"].apply(void 0, fullHand);
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
    for (var p in stats) {
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
var getDiffDeck5 = function (listOfHands) {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_5"].slice().filter(function (c) { return !listOfHands.includes(c); });
};
var getDiffDeck7 = function (listOfHands) {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["fullCardsDeckHash_7"].slice().filter(function (c) { return !listOfHands.includes(c); });
};
var atLeastFiveEqual = function (list) {
    return list.filter(function (v) {
        var l = v.length;
        var c = 0, i = 1;
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
var getVectorSum = function (v) {
    var l = v.length;
    var s = 0;
    for (var i = 0; i < l; i++) {
        s += v[i];
    }
    return s;
};
var getFlushSuit7 = function (v) {
    if (v.length != 7) {
        return -1;
    }
    var t = v[0];
    var c = 0;
    var i = 1;
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
var checkStraight5on7 = function (arr) {
    if (arr.length != 7) {
        return false;
    }
    var c = 0;
    if (arr[arr.length - 1] === 12 &&
        arr[0] === 0 &&
        arr.includes(1) &&
        arr.includes(2) &&
        arr.includes(3)) {
        return true;
    }
    for (var i = 1; i < arr.length; ++i) {
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
var singlePairsList = function (startSet) {
    var toAdd = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 3, 1);
    var singlePairs = [];
    for (var i = 0; i < startSet.length; ++i) {
        for (var j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                singlePairs.push([startSet[i], startSet[i]].concat(toAdd[j]));
            }
        }
    }
    return singlePairs;
};
var internalDoublePairsSort = function (a, b) {
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
var sortedPairsToAdd = function (startSet) {
    var _toAdd = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1);
    _toAdd.forEach(function (pair) {
        var _a;
        /* istanbul ignore next */
        if (pair[0] < pair[1]) {
            _a = [pair[1], pair[0]], pair[0] = _a[0], pair[1] = _a[1];
        }
    });
    _toAdd.sort(internalDoublePairsSort);
    return _toAdd;
};
var doublePairsList = function (startSet, isLow) {
    if (isLow === void 0) { isLow = false; }
    var toAdd = isLow
        ? kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    var doublePairs = [];
    for (var j = 0; j < toAdd.length; ++j) {
        for (var i = 0; i < startSet.length; ++i) {
            if (!toAdd[j].includes(startSet[i])) {
                doublePairs.push([toAdd[j][0], toAdd[j][0], toAdd[j][1], toAdd[j][1], startSet[i]]);
            }
        }
    }
    return doublePairs;
};
var trisList = function (startSet, isLow) {
    if (isLow === void 0) { isLow = false; }
    var toAdd = isLow
        ? kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["multiCombinations"](startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    var tris = [];
    for (var i = 0; i < startSet.length; ++i) {
        for (var j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                tris.push([startSet[i], startSet[i], startSet[i]].concat(toAdd[j]));
            }
        }
    }
    return tris;
};
var fullHouseList = function (startSet) {
    var fullHouses = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["crossProduct"](startSet, 2).filter(function (p) { return p[0] !== p[1]; });
    return fullHouses.map(function (hand, idx) {
        return [hand[0], hand[0], hand[0], hand[1], hand[1]];
    });
};
var quadsList = function (startSet) {
    var quads = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["crossProduct"](startSet, 2).filter(function (p) { return p[0] !== p[1]; });
    return quads.map(function (hand) {
        return [hand[0], hand[0], hand[0], hand[0], hand[1]];
    });
};
var checkStraight = function (arr) {
    var cond = true;
    if (arr[4] === 12 && arr[0] === 0) {
        return arr[1] === 1 && arr[2] === 2 && arr[3] === 3;
    }
    if (arr[4] === 12 && arr[0] === 3) {
        return arr[1] === 2 && arr[2] === 1 && arr[3] === 0;
    }
    /* if (arr[4] === 12 && arr[0] === 11) {
       return arr[1] === 10 && arr[2] === 9 && arr[3] === 8;
     }*/
    for (var i = 1; i < arr.length; ++i) {
        cond = cond && Math.abs(arr[i - 1] - arr[i]) === 1;
    }
    return cond;
};
var checkDoublePair = function (hand) {
    /* istanbul ignore next */
    return ((hand[0] === hand[1] && hand[2] === hand[3] && hand[3] !== hand[4] && hand[1] !== hand[4]) ||
        (hand[0] === hand[1] && hand[3] === hand[4] && hand[3] !== hand[2] && hand[1] !== hand[2]) ||
        (hand[1] === hand[2] && hand[3] === hand[4] && hand[3] !== hand[0] && hand[2] !== hand[0]));
};
var removeStraights = function (list) {
    return list.filter(function (hand, idx) {
        return !checkStraight(hand);
    });
};
var _rankOfHand = function (hand, rankHash) {
    return rankHash[getVectorSum(hand)];
};
var _rankOf5onX = function (hand, rankHash, INVERTED) {
    if (INVERTED === void 0) { INVERTED = false; }
    var comb = kombinatoricsjs__WEBPACK_IMPORTED_MODULE_0__["combinations"](hand, 5);
    var max = 0;
    comb.forEach(function (h) {
        var s = getVectorSum(h);
        var r = rankHash[s];
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
var filterWinningCards = function (fullHand, winningRanks) {
    var winning = {};
    winningRanks.forEach(function (c) {
        !winning[c] ? (winning[c] = 1) : winning[c]++;
    });
    var full = [];
    fullHand.forEach(function (card) {
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
var getFlushSuitFromIndex = function (c) {
    return _constants__WEBPACK_IMPORTED_MODULE_1__["flushIndexToName"][~~(c / 13)];
};
/**
 * @function handToCardsSymbols
 * @param {Array} hand array of indexes in deck of cards 0..51
 * @return {Array} char face symbols representation of the indexed hand
 */
var handToCardsSymbols = function (hand) {
    return hand.map(function (c) { return _constants__WEBPACK_IMPORTED_MODULE_1__["rankToFaceSymbol"][c % 13]; }).join('');
};
var handRankToGroup = function (rank, groupsRanking, groupNameMap) {
    if (groupsRanking === void 0) { groupsRanking = _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"]; }
    if (groupNameMap === void 0) { groupNameMap = _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"]; }
    var i = 0;
    var groupName = groupNameMap[i];
    while (rank > groupsRanking[i]) {
        i++;
        groupName = groupNameMap[i];
    }
    return groupName;
};
var fillRank5Ato5 = function (h, idx, rankingObject) {
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_Ato5_5cards"], _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames_Ato5"])
    };
    return rankingObject;
};
var fillRank5 = function (h, idx, rankingObject, groupsRanking, groupNameMap) {
    if (groupsRanking === void 0) { groupsRanking = _constants__WEBPACK_IMPORTED_MODULE_1__["handsRankingDelimiter_5cards"]; }
    if (groupNameMap === void 0) { groupNameMap = _constants__WEBPACK_IMPORTED_MODULE_1__["handRankingGroupNames"]; }
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, groupsRanking, groupNameMap)
    };
    return rankingObject;
};
var fillRank5_ato5 = function (h, idx, rankingObject) {
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx)
    };
    return rankingObject;
};
var fillRank5PlusFlushes = function (h, idx, rankingObject, offset) {
    if (offset === void 0) { offset = _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSHES_BASE_START"] + _constants__WEBPACK_IMPORTED_MODULE_1__["HIGH_CARDS_5_AMOUNT"]; }
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    var r = idx + offset;
    rankingObject.HASHES[hash] = r;
    rankingObject.rankingInfos[r] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(r)
    };
    return rankingObject;
};
var fillRankFlushes = function (h, rankingObject) {
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    var rank = rankingObject.HASHES[hash] + _constants__WEBPACK_IMPORTED_MODULE_1__["FLUSHES_BASE_START"];
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
var AbstractDeck = /** @class */ (function () {
    function AbstractDeck(assetsUri) {
        var _this = this;
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
        this.deck = (new Array(52)).fill(0).map(function (v, i) {
            return i;
        });
        this.suits = ['s', 'd', 'h', 'c'];
        this.backImages = this.deck.map(function (V, I) {
            return { backgroundImage: "url(" + _this.assetsUri + _this.ranks[I % 13] + _this.suits[~~(I / 13)] + "-min.png)" };
        });
        this.backFaceUrl = {
            backgroundImage: "url(" + this.assetsUri + "54-min.png)"
        };
        this.backImages.push({
            backgroundImage: "url(" + this.assetsUri + "54-min.png)"
        });
    }
    return AbstractDeck;
}());



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var routes = [];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubsub.service */ "./src/app/pubsub.service.ts");
/* harmony import */ var _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../src/gamblingjs */ "../src/gamblingjs.ts");




var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'gamble';
        this.localCardMessages = new _pubsub_service__WEBPACK_IMPORTED_MODULE_2__["DeckMessageService"]();
    }
    AppComponent.prototype.cardFromDeckToHand = function (ci) { };
    AppComponent.prototype.cardFromHandToDeck = function (ci) { };
    AppComponent.prototype.ngOnInit = function () {
        _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"].hashLoaders[7].high();
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



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
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _fulldeck_fulldeck_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fulldeck/fulldeck.component */ "./src/app/fulldeck/fulldeck.component.ts");
/* harmony import */ var _hand_analyzer_hand_analyzer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hand-analyzer/hand-analyzer.component */ "./src/app/hand-analyzer/hand-analyzer.component.ts");







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
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
    return AppModule;
}());



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pubsub.service */ "./src/app/pubsub.service.ts");
/* harmony import */ var _AbstractDeck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../AbstractDeck */ "./src/app/AbstractDeck.ts");





var FulldeckComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](FulldeckComponent, _super);
    function FulldeckComponent() {
        return _super.call(this, "assets/imgs/") || this;
    }
    FulldeckComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cardPubSub.cardBackToDeck.subscribe(function (v) { _this.setCardBack(v); });
    };
    FulldeckComponent.prototype.cardClick = function (cardIndex) {
        if (this.cardsOut == 7)
            return;
        if (this.deck[cardIndex] !== 52)
            this.deck[cardIndex] = 52;
        this.cardsOut++;
        this.cardPubSub.addCardToHand.emit(cardIndex);
    };
    FulldeckComponent.prototype.setCardBack = function (cardIndex) {
        if (this.cardsOut == 0)
            return;
        this.deck[cardIndex] = cardIndex;
        this.cardsOut--;
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
    return FulldeckComponent;
}(_AbstractDeck__WEBPACK_IMPORTED_MODULE_3__["AbstractDeck"]));



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _AbstractDeck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../AbstractDeck */ "./src/app/AbstractDeck.ts");
/* harmony import */ var _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../src/gamblingjs */ "../src/gamblingjs.ts");
/* harmony import */ var _pubsub_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pubsub.service */ "./src/app/pubsub.service.ts");






console.log(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"]);
var HandAnalyzerComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](HandAnalyzerComponent, _super);
    function HandAnalyzerComponent() {
        var _this = _super.call(this, "assets/imgs/") || this;
        _this.dataStats = {
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
        _this.cardsIn = 0;
        _this.hand = [
            52,
            52,
            52,
            52,
            52,
            52,
            52
        ];
        _this.handWinClasses = [
            "card",
            "card",
            "card",
            "card",
            "card",
            "card",
            "card"
        ];
        _this.deck.push(52);
        _this.backImages.push({
            backgroundImage: "url(" + _this.assetsUri + "54-min.png)"
        });
        return _this;
    }
    HandAnalyzerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cardPubSub.addCardToHand.subscribe(function (v) { _this.setCard(v); });
    };
    HandAnalyzerComponent.prototype.cardClick = function (cardIndex) {
        var card = this.hand[cardIndex];
        if (card !== 52) {
            this.hand[cardIndex] = 52;
            this.cardsIn--;
            this.cardPubSub.cardBackToDeck.emit(card);
            this.computeRankingFigures();
        }
        else
            return;
    };
    HandAnalyzerComponent.prototype.setCard = function (cardIndex) {
        if (this.cardsIn < 7) {
            var i = this.hand.findIndex(function (x) { return x == 52; });
            this.hand[i] = cardIndex;
            this.cardsIn++;
            this.computeRankingFigures();
        }
        else
            return;
    };
    HandAnalyzerComponent.prototype.computeRankingFigures = function () {
        var _this = this;
        if (this.cardsIn == 7) {
            var handinfo_1 = _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["FIVE_CARD_POKER_EVAL"].HandRankVerbose[7].high(this.hand[0], this.hand[1], this.hand[2], this.hand[3], this.hand[4], this.hand[5], this.hand[6]);
            this.dataStats.rankValue = handinfo_1.handRank;
            this.dataStats.rankCategory = handinfo_1.handGroup;
            //handinfo.flushSuit
            this.hand.forEach(function (h, i) {
                if (handinfo_1.winningCards.includes(h)) {
                    _this.handWinClasses[i] = "card winner";
                }
            });
            setTimeout(function () {
                _this.resetWinners();
            }, 2000);
        }
        else {
            var subHand = this.hand.filter(function (c) { return c !== 52; });
            var rank = void 0;
            var hInfo = void 0;
            if (subHand.length == 6) {
                rank = _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["handOfSixEvalIndexed"].apply(void 0, subHand);
                hInfo = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getHandInfo"])(rank);
            }
            else if (subHand.length == 5) {
                rank = _src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["handOfSixEvalIndexed"].apply(void 0, subHand);
                hInfo = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getHandInfo"])(rank);
            }
            if (subHand.length > 4) {
                this.dataStats.rankValue = rank;
                this.dataStats.rankCategory = hInfo.handGroup;
            }
            var stats = Object(_src_gamblingjs__WEBPACK_IMPORTED_MODULE_3__["getPartialHandStatsIndexed_7"])(subHand, 1000);
            for (var s in stats) {
                this.dataStats.stats[s] = (100 * stats[s]).toFixed(2);
            }
            this.dataStats.avgPotentialRank = ~~stats.average;
        }
    };
    HandAnalyzerComponent.prototype.resetWinners = function () {
        for (var i = 0; i < this.handWinClasses.length; i++)
            this.handWinClasses[i] = "card";
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
    return HandAnalyzerComponent;
}(_AbstractDeck__WEBPACK_IMPORTED_MODULE_2__["AbstractDeck"]));



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var DeckMessageService = /** @class */ (function () {
    function DeckMessageService() {
        this.addCardToHand = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.cardBackToDeck = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
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
    return DeckMessageService;
}());



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
var environment = {
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


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
//# sourceMappingURL=main-es5.js.map