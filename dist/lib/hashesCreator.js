"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONSTANTS = require("./constants");
var routines_1 = require("./routines");
var ROUTINES = require("./routines");
var kombinatoricsJs = require("kombinatoricsjs");
var fillRank5 = function (h, idx, rankingObject) {
    var hash = routines_1.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos.push(idx);
    return rankingObject;
};
var fillRank5PlusFlushes = function (h, idx, rankingObject, offset) {
    if (offset === void 0) { offset = CONSTANTS.FLUSHES_BASE_START + CONSTANTS.HIGH_CARDS_5_AMOUNT; }
    var hash = routines_1.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx + offset;
    rankingObject.rankingInfos.push(idx + offset);
    return rankingObject;
};
exports.createRankOfFiveHashes = function () {
    var hashRankingOfFive = {
        HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: []
    };
    //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
    var rankCards = CONSTANTS.rankCards;
    var STRAIGHTS = CONSTANTS.STRAIGHTS;
    var HIGH_CARDS_5_AMOUNT = CONSTANTS.HIGH_CARDS_5_AMOUNT;
    var highCards = kombinatoricsJs.multiCombinations(rankCards, 5, 0);
    var HIGH_CARDS = ROUTINES.removeStraights(highCards);
    var SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
    var DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards);
    var TRIPLES = ROUTINES.trisList(rankCards);
    var FULLHOUSES = ROUTINES.fullHouseList(rankCards);
    var QUADS = ROUTINES.quadsList(rankCards);
    console.log(HIGH_CARDS, FULLHOUSES, QUADS);
    var inc = 0;
    console.log("high cards", inc += HIGH_CARDS.length);
    console.log("single pairs", inc += SINGLE_PAIRS.length);
    console.log("double pairs", inc += DOUBLE_PAIRS.length);
    console.log("triples", inc += TRIPLES.length);
    console.log("straights", inc += STRAIGHTS.length);
    //flushes as many as highcards
    console.log("flushes", inc += HIGH_CARDS_5_AMOUNT);
    console.log("full houses", inc += FULLHOUSES.length);
    console.log("quads", inc += QUADS.length);
    HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS).forEach(function (h, idx) {
        return fillRank5(h, idx, hashRankingOfFive);
    });
    FULLHOUSES.concat(QUADS).forEach(function (h, idx) {
        return fillRank5PlusFlushes(h, idx, hashRankingOfFive);
    });
    /**
     * @TODO
     * add strightflushes
     */
    /**
     * in evaluator of 5 cards always get the rank then add the flush value
     */
    return hashRankingOfFive;
};
var _rankOfFive = function (hand, rankHash) {
    return rankHash[routines_1.getVectorSum(hand)];
};
var _rankOf5onX = function (hand, rankHash) {
    return Math.max.apply(Math, kombinatoricsJs.combinations(hand, 5).map(function (h) { return rankHash[routines_1.getVectorSum(h)]; }));
};
exports.createRankOf5On6Hashes = function () { };
exports.createRankOf5On7Hashes = function (hashRankOfFive) {
    var hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn7,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: []
    };
    var counter = 0;
    var rankCards = CONSTANTS.rankCards;
    var ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
    kombinatoricsJs.multiCombinations(rankCards, 7, 3).map(function (hand) { return hand.map(function (card) { return ranksHashOn7[card]; }); }).forEach(function (h, i) {
        var hash = routines_1.getVectorSum(h);
        hashRankingOfFiveOnSeven.HASHES[hash] = _rankOf5onX(h, hashRankOfFive.HASHES);
        counter++;
    });
    /**
  * 5 same suits
  * 6 same suits
  * 7 same suits
  * the use best5On6 best5On7
  */
    var fiveFlushes = kombinatoricsJs.combinations(rankCards, 5).map(function (hand) { return hand.map(function (card) { return ranksHashOn7[card]; }); });
    var sixFlushes = kombinatoricsJs.combinations(rankCards, 6).map(function (hand) { return hand.map(function (card) { return ranksHashOn7[card]; }); });
    var sevenFlushes = kombinatoricsJs.combinations(rankCards, 7).map(function (hand) { return hand.map(function (card) { return ranksHashOn7[card]; }); });
    console.log(counter, hashRankingOfFiveOnSeven, sixFlushes, sevenFlushes, fiveFlushes);
    return hashRankingOfFiveOnSeven;
};
//# sourceMappingURL=hashesCreator.js.map