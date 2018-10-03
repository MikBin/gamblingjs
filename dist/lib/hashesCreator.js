"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONSTANTS = require("./constants");
var routines_1 = require("./routines");
var ROUTINES = require("./routines");
var kombinatoricsJs = require("kombinatoricsjs");
exports.createRankOfFiveHashes = function () {
    var hashRankingOfFive = {
        HASHES: {},
        FLUSH_CHECK_KEYS: CONSTANTS.flush5hHashCheck,
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: new Array(7462)
    };
    //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
    var rankCards = CONSTANTS.rankCards;
    var STRAIGHTS = CONSTANTS.STRAIGHTS;
    var HIGH_CARDS_5_AMOUNT = CONSTANTS.HIGH_CARDS_5_AMOUNT;
    var highCards = kombinatoricsJs.multiCombinations(rankCards, 5, 1);
    var HIGH_CARDS = ROUTINES.removeStraights(highCards);
    var SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
    var DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards);
    var TRIPLES = ROUTINES.trisList(rankCards);
    var FULLHOUSES = ROUTINES.fullHouseList(rankCards);
    var QUADS = ROUTINES.quadsList(rankCards);
    var upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS);
    upToStraights.forEach(function (h, idx) {
        routines_1.fillRank5(h, idx, hashRankingOfFive);
    });
    var aboveStraights = FULLHOUSES.concat(QUADS);
    aboveStraights.forEach(function (h, idx) {
        routines_1.fillRank5PlusFlushes(h, idx, hashRankingOfFive);
    });
    /**FLUSHES and STRAIGHT FLUSHES */
    HIGH_CARDS.forEach(function (h) {
        routines_1.fillRankFlushes(h, hashRankingOfFive);
    });
    STRAIGHTS.forEach(function (h, idx) {
        var hash = routines_1.getVectorSum(h.map(function (card) { return hashRankingOfFive.baseRankValues[card]; }));
        var rank = idx + CONSTANTS.STRAIGHT_FLUSH_BASE_START;
        hashRankingOfFive.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingOfFive.rankingInfos[rank] = {
            hand: h.slice(),
            faces: routines_1.handToCardsSymbols(h),
            handGroup: routines_1.handRankToGroup(rank)
        };
    });
    return hashRankingOfFive;
};
//export const createRankOf5On6Hashes = () => { };
exports.createRankOf5On7Hashes = function (hashRankOfFive) {
    var hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: CONSTANTS.ranksHashOn7,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var counter = 0;
    var rankCards = CONSTANTS.rankCards;
    var ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
    var suit7Hash = hashRankingOfFiveOnSeven.baseSuitValues;
    kombinatoricsJs.multiCombinations(rankCards, 7, 4).forEach(function (hand, i) {
        var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
        var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
        var hash7 = routines_1.getVectorSum(h7);
        hashRankingOfFiveOnSeven.HASHES[hash7] = routines_1._rankOf5onX(h5, hashRankOfFive.HASHES);
    });
    var FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.MULTI_FLUSH_RANK_HASHES;
    var fiveFlushes = kombinatoricsJs.combinations(rankCards, 5);
    var sixFlushes = kombinatoricsJs.combinations(rankCards, 6);
    var sevenFlushes = kombinatoricsJs.combinations(rankCards, 7);
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingOfFiveOnSeven.baseRankValues[c]; });
        var hash7 = routines_1.getVectorSum(h7);
        var rank = routines_1._rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES);
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
    fiveFlushHashes.concat(sixFlushHashes, sevenFlushHashes).forEach(function (h) {
        FLUSH_CHECK_KEYS[routines_1.getVectorSum(h)] = h[0];
    });
    /*console.log(counter, sixFlushes, sevenFlushes, fiveFlushes);
      console.log(cc, fiveFlushHashes, sixFlushHashes, sevenFlushHashes, hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS);
      console.log("--------", hashRankingOfFiveOnSeven);*/
    return hashRankingOfFiveOnSeven;
};
exports.createRankOf5AceToFive_Low8 = function () {
    var lowHands = kombinatoricsJs.multiCombinations([6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    var hashRankingLow8 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach(function (h, idx) {
        routines_1.fillRank5(h, idx, hashRankingLow8);
    });
    /**change rankking infos as straights have to have different names */
    return hashRankingLow8;
};
exports.createRankOf5AceToFive_Full = function () {
    var rankCards = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: new Array(6175)
    };
    var QUADS = ROUTINES.quadsList(rankCards);
    var FULLHOUSES = ROUTINES.fullHouseList(rankCards);
    var TRIPLES = ROUTINES.trisList(rankCards, true);
    var DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards, true);
    var SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
    var HIGH_CARDS = kombinatoricsJs.multiCombinations(rankCards, 5, 1);
    var all = QUADS.concat(FULLHOUSES, TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS);
    all.forEach(function (h, idx) {
        routines_1.fillRank5(h, idx, hashRankingLow);
    });
    return hashRankingLow;
};
exports.createRankOf5AceToSix_Full = function () {
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: new Array(7462)
    };
    var rankCards = CONSTANTS.rankCards_low;
    var STRAIGHTS = CONSTANTS.STRAIGHTS.slice(0, 9).reverse();
    var QUADS = ROUTINES.quadsList(rankCards);
    var FULLHOUSES = ROUTINES.fullHouseList(rankCards);
    var TRIPLES = ROUTINES.trisList(rankCards, true);
    var DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards, true);
    var SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
    var HIGH_CARDS = kombinatoricsJs.multiCombinations(rankCards, 5, 1).filter(function (H, i) {
        return !ROUTINES.checkStraight(H);
    });
    /**fill straight flushes as are the lowest hand possbile */
    STRAIGHTS.forEach(function (h, idx) {
        var hash = routines_1.getVectorSum(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
        var rank = idx;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: routines_1.handToCardsSymbols(h),
            handGroup: routines_1.handRankToGroup(rank)
        };
    });
    var FLUSH_GAP = STRAIGHTS.length;
    /**@TODO verify how does straight AKQJT have to be valuated...if ACE counts for low only it should NOT BE a straight!!!! */
    QUADS.concat(FULLHOUSES).forEach(function (h, idx) {
        /**add straights.length because of straight flushes are the lowest to be added */
        routines_1.fillRank5(h, idx + FLUSH_GAP, hashRankingLow);
    });
    FLUSH_GAP += QUADS.length + FULLHOUSES.length;
    HIGH_CARDS.forEach(function (h, idx) {
        var hash = routines_1.getVectorSum(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
        var rank = idx + FLUSH_GAP;
        hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
        hashRankingLow.rankingInfos[rank] = {
            hand: h.slice(),
            faces: routines_1.handToCardsSymbols(h),
            handGroup: routines_1.handRankToGroup(rank)
        };
    });
    FLUSH_GAP += HIGH_CARDS.length;
    STRAIGHTS.concat(TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS).forEach(function (h, idx) {
        routines_1.fillRank5(h, idx + FLUSH_GAP, hashRankingLow);
    });
    return hashRankingLow;
};
exports.createRankOf7AceToSix_Low = function (hashRankOfFive, baseLowRanking) {
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
        baseRankValues: CONSTANTS.ranksHashOn7,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var ranksHashOn7 = CONSTANTS.ranksHashOn7;
    /**filling ranks */
    kombinatoricsJs.multiCombinations(baseLowRanking, 7, 4).forEach(function (hand, idx) {
        var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
        var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
        var hash7 = routines_1.getVectorSum(h7);
        hashRankingLow.HASHES[hash7] = routines_1._rankOf5onX(h5, hashRankOfFive.HASHES);
    });
    var FLUSH_RANK_HASHES = hashRankingLow.MULTI_FLUSH_RANK_HASHES;
    var fiveFlushes = kombinatoricsJs.combinations(baseLowRanking, 5);
    var sixFlushes = kombinatoricsJs.combinations(baseLowRanking, 6);
    var sevenFlushes = kombinatoricsJs.combinations(baseLowRanking, 7);
    fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingLow.baseRankValues[c]; });
        var hash7 = routines_1.getVectorSum(h7);
        var rank = routines_1._rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES);
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
    /**filling only seven flushes as for 5 and 6 the best hand would never be a flush but another combos */
    sevenFlushHashes.forEach(function (h) {
        hashRankingLow.FLUSH_CHECK_KEYS[routines_1.getVectorSum(h)] = h[0];
    });
    sevenFlushes.forEach(function (h) {
        var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
        var h7 = h.map(function (c) { return hashRankingLow.baseRankValues[c]; });
        var hash7 = routines_1.getVectorSum(h7);
        var rank = routines_1._rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES);
        hashRankingLow.FLUSH_RANK_HASHES[hash7] = rank;
    });
    return hashRankingLow;
};
exports.createRankOf7AceToFive_Low = function (hashRankOfFive, baseLowRanking, fullFlag) {
    if (fullFlag === void 0) { fullFlag = false; }
    var hashRankingLow = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn7,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: hashRankOfFive.rankingInfos
    };
    var ranksHashOn7 = CONSTANTS.ranksHashOn7;
    if (fullFlag) {
        kombinatoricsJs.multiCombinations(baseLowRanking, 7, 4).forEach(function (hand, idx) {
            var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
            var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
            var hash7 = routines_1.getVectorSum(h7);
            hashRankingLow.HASHES[hash7] = routines_1._rankOf5onX(h5, hashRankOfFive.HASHES);
        });
    }
    else {
        var lowHands_1 = kombinatoricsJs.multiCombinations(baseLowRanking, 5, 1);
        kombinatoricsJs.multiCombinations(CONSTANTS.rankCards, 2, 2).forEach(function (pair, i) {
            lowHands_1.forEach(function (lo, idx) {
                var hand = lo.concat(pair);
                var h7 = hand.map(function (card) { return ranksHashOn7[card]; });
                var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
                var hash7 = routines_1.getVectorSum(h7);
                hashRankingLow.HASHES[hash7] = routines_1._rankOf5onX(h5, hashRankOfFive.HASHES);
            });
        });
    }
    return hashRankingLow;
};
exports.createRankOf5AceToFive_Low9 = function () {
    var lowHands = kombinatoricsJs.multiCombinations([7, 6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
    var hashRankingLow9 = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: CONSTANTS.ranksHashOn5,
        baseSuitValues: CONSTANTS.suitsHash,
        rankingInfos: new Array(lowHands.length)
    };
    lowHands.forEach(function (h, idx) {
        routines_1.fillRank5(h, idx, hashRankingLow9);
    });
    return hashRankingLow9;
};
//# sourceMappingURL=hashesCreator.js.map