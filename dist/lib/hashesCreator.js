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
        FLUSH_CHECK_KEYS: CONSTANTS.flush5hHashCheck,
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
    var inc = 0;
    console.log('high cards', (inc += HIGH_CARDS.length));
    console.log('single pairs', (inc += SINGLE_PAIRS.length));
    console.log('double pairs', (inc += DOUBLE_PAIRS.length));
    console.log('triples', (inc += TRIPLES.length));
    console.log('straights', (inc += STRAIGHTS.length));
    //flushes as many as highcards
    console.log('flushes', (inc += HIGH_CARDS_5_AMOUNT));
    console.log('full houses', (inc += FULLHOUSES.length));
    console.log('quads', (inc += QUADS.length));
    var upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS);
    upToStraights.forEach(function (h, idx) {
        return fillRank5(h, idx, hashRankingOfFive);
    });
    var aboveStraights = HIGH_CARDS.concat(FULLHOUSES, QUADS, STRAIGHTS);
    aboveStraights.forEach(function (h, idx) {
        return fillRank5PlusFlushes(h, idx, hashRankingOfFive);
    });
    //console.log(upToStraights, aboveStraights);
    /**
     * @TODO
     * add strightflushes
     */
    /**
     * in evaluator of 5 cards always get the rank then add the flush value
     */
    return hashRankingOfFive;
};
var _rankOfHand = function (hand, rankHash) {
    return rankHash[routines_1.getVectorSum(hand)];
};
var _rankOf5onX = function (hand, rankHash) {
    return Math.max.apply(Math, kombinatoricsJs.combinations(hand, 5).map(function (h) { return rankHash[routines_1.getVectorSum(h)]; }));
};
exports.createRankOf5On6Hashes = function () { };
exports.createRankOf5On7Hashes = function (hashRankOfFive) {
    var hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn7,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: []
    };
    var counter = 0;
    var rankCards = CONSTANTS.rankCards;
    var ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
    var suit7Hash = hashRankingOfFiveOnSeven.baseSuitValues;
    kombinatoricsJs
        .multiCombinations(rankCards, 7, 3)
        .forEach(function (hand, i) {
        var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
        var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
        var hash7 = routines_1.getVectorSum(h7);
        hashRankingOfFiveOnSeven.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
        counter++;
    });
    console.log("7rankhands:", counter);
    /**
     * 5 same suits
     * 6 same suits
     * 7 same suits
     * the use best5On6 best5On7
     */
    var FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.FLUSH_RANK_HASHES || {};
    var fiveFlushes = kombinatoricsJs
        .combinations(rankCards, 5);
    var sixFlushes = kombinatoricsJs
        .combinations(rankCards, 6);
    var sevenFlushes = kombinatoricsJs
        .combinations(rankCards, 7);
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingOfFiveOnSeven.baseRankValues[c]; });
        var hash7 = routines_1.getVectorSum(h7);
        FLUSH_RANK_HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES) + CONSTANTS.FLUSHES_BASE_START;
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
    var cc = 0;
    var FLUSH_CHECK_KEYS = hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS;
    /**for testing count all to be 84 and equally distributed */
    fiveFlushHashes.concat(sixFlushHashes, sevenFlushHashes).forEach(function (h) {
        FLUSH_CHECK_KEYS[routines_1.getVectorSum(h)] = h[0];
        cc++;
    });
    /*console.log(counter, sixFlushes, sevenFlushes, fiveFlushes);
    console.log(cc, fiveFlushHashes, sixFlushHashes, sevenFlushHashes, hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS);
    console.log("--------", hashRankingOfFiveOnSeven);*/
    return hashRankingOfFiveOnSeven;
};
//# sourceMappingURL=hashesCreator.js.map