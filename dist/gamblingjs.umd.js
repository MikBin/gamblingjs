(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.gamblingjs = {})));
}(this, (function (exports) { 'use strict';

    /**
     *@method
     *
     *@param
     *@return
     */
    const shuffle = (ar) => {
        let i, r, l = ar.length;
        for (i = 0; i < l; ++i) {
            r = ~~(Math.random() * l);
            [ar[r], ar[i]] = [ar[i], ar[r]];
        }
    };
    const pick = (n, got, pos, from, limit, cntLimit, callBack) => {
        let cnt = 0, limitCount = cntLimit;
        if (got.length == n) {
            callBack(got);
            return 1;
        }
        for (let i = pos; i < from.length; i++) {
            got.push(from[i]);
            if (limitCount === limit) {
                cnt += pick(n, got, i + 1, from, limit, 0, callBack);
                limitCount = 0;
            }
            else {
                let next = limitCount === 0 || got[got.length - 1] === got[got.length - 2]
                    ? limitCount + 1
                    : limitCount;
                cnt += pick(n, got, i, from, limit, next, callBack);
            }
            got.pop();
        }
        return cnt;
    };
    /**
     *@method
     *
     *@param
     *@return
     */
    const combinations = (_collection, k) => {
        if (_collection.length < k || k < 1) {
            return [_collection];
        }
        let comb = [];
        pick(k, [], 0, _collection, 0, 0, (c) => {
            comb.push(c.slice());
        });
        return comb;
    };
    const generateFirstMultiSetIndex = (n, k, limits) => {
        let index = new Array(k);
        let limitsCounter = (new Array(n)).fill(0);
        let lastVal = 0;
        for (let i = 0; i < k; i++) {
            index[i] = lastVal;
            limitsCounter[lastVal]++;
            if (limitsCounter[lastVal] == limits[lastVal]) {
                lastVal++;
            }
        }
        return {
            limitsCounter: limitsCounter,
            index: index
        };
    };
    const multiSetCombinationsStep = (index, maxVal, limits, limitsCount) => {
        let k = index.length - 1;
        if (index[k] < maxVal) {
            limitsCount[index[k]]--;
            index[k]++;
            limitsCount[index[k]]++;
        }
        else {
            /*find the first to increment*/
            let lastMaxVal = maxVal;
            let lastMaxValCounter = 0;
            while (index[k] == lastMaxVal) {
                limitsCount[index[k]]--;
                index[k] = 0;
                k--;
                lastMaxValCounter++;
                if (lastMaxValCounter == limits[lastMaxVal]) {
                    lastMaxVal--;
                    lastMaxValCounter = 0;
                }
            }
            if (k == -1) {
                return false;
                /*ended*/
            }
            limitsCount[index[k]]--;
            index[k]++;
            limitsCount[index[k]]++;
            k++;
            /*now set the following elements*/
            while (k < index.length) {
                let lastVal = index[k - 1];
                if (limitsCount[lastVal] < limits[lastVal]) {
                    index[k] = lastVal;
                    limitsCount[lastVal]++;
                }
                else if (lastVal < maxVal) {
                    lastVal++;
                    index[k] = lastVal;
                    limitsCount[lastVal]++;
                }
                else if (k = index.length - 1) {
                    return false;
                }
                k++;
            }
        }
        return index;
    };
    /**
     *@method
     *
     *@param
     *@return
     */
    const multiCombinations = (_collection, k, repetition) => {
        let multiComb = [];
        let maxVal = _collection.length - 1;
        let limits = (new Array(_collection.length)).fill(repetition);
        let { limitsCounter, index } = generateFirstMultiSetIndex(_collection.length, k, limits);
        //first element
        multiComb.push(index.map(v => _collection[v]));
        let next = [];
        while (next = multiSetCombinationsStep(index, maxVal, limits, limitsCounter)) {
            multiComb.push(next.map(v => _collection[v]));
        }
        /*
          pick(n, [], 0, _collection, repetition, 0, (c: any[]) => {
            multiComb.push(c.slice())
          })
        */
        return multiComb;
    };
    const crossProduct = (list, k) => {
        if (k < 1)
            return list;
        let crossProdList = new Array(Math.pow(list.length, k));
        let l = crossProdList.length;
        let ln = list.length;
        for (let i = 0; i < l; ++i) {
            let tmpList = [];
            let N = i;
            for (let j = k - 1; j >= 0; --j) {
                let digit = N % ln;
                N = Math.floor(N / ln);
                tmpList[j] = list[digit];
            }
            crossProdList[i] = tmpList;
        }
        return crossProdList;
    };

    /**
     * think of using typed array for performance reasons as these data is accessed very often
     * 8bit or 16bits arrays can be used
     */
    var flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]; // to be implemented to speed up flushcheck on 7
    var suitsHash = [0, 57, 1, 8]; // 4 one for each suit
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
    /*
    arrays initialization
    */
    var deckOfRanks_5 = new Array(52);
    var deckOfRanks_7 = new Array(52);
    var deckOfFlushes = new Array(52);
    var deckOfSuits = new Array(52);
    var fullCardsDeckHash_5 = new Array(52);
    var fullCardsDeckHash_7 = new Array(52);
    var cardHashToDescription_7 = {};
    for (var i = 0; i < 52; i++) {
        deckOfRanks_5[i] = ranksHashOn5[i % 13];
        deckOfRanks_7[i] = ranksHashOn7[i % 13];
        deckOfFlushes[i] = flushHash[i % 13];
        deckOfSuits[i] = suitsHash[~~(i / 13)];
        var card5 = (fullCardsDeckHash_5[i] = (deckOfRanks_5[i] << 9) + deckOfSuits[i]);
        var card7 = (fullCardsDeckHash_7[i] = (deckOfRanks_7[i] << 9) + deckOfSuits[i]);
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
     * @TODO make function to work with non full decks. ex. deck of 40 cards
     *
     * */

    var getDiffDeck7 = function (listOfHands) {
        var deck = fullCardsDeckHash_7.slice().filter(function (c) { return !listOfHands.includes(c); });
        return deck;
    };
    var getVectorSum = function (v) {
        var l = v.length;
        var s = 0;
        for (var i = 0; i < l; i++) {
            s += v[i];
        }
        return s;
    };
    var singlePairsList = function (startSet) {
        var toAdd = multiCombinations(startSet, 3, 1);
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
        var _toAdd = multiCombinations(startSet, 2, 1);
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
            ? multiCombinations(startSet, 2, 1)
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
            ? multiCombinations(startSet, 2, 1)
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
        var fullHouses = crossProduct(startSet, 2).filter(function (p) { return p[0] !== p[1]; });
        return fullHouses.map(function (hand, idx) {
            return [hand[0], hand[0], hand[0], hand[1], hand[1]];
        });
    };
    var quadsList = function (startSet) {
        var quads = crossProduct(startSet, 2).filter(function (p) { return p[0] !== p[1]; });
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
    var removeStraights = function (list) {
        return list.filter(function (hand, idx) {
            return !checkStraight(hand);
        });
    };
    var _rankOf5onX = function (hand, rankHash, INVERTED) {
        if (INVERTED === void 0) { INVERTED = false; }
        var comb = combinations(hand, 5);
        var max = 0;
        comb.forEach(function (h) {
            var s = getVectorSum(h);
            var r = rankHash[s];
            INVERTED ? (r = HIGH_MAX_RANK - r) : null;
            max = max < r ? r : max;
        });
        return max;
    };
    /**
     * @function filterWinningCards
     * @param {Array} fullHand array of indexes in deck of cards 0..51
     * @param {Array} winningRanks array of 5 cards indexes
     * @return {Array} only cards of winning hand
     * @TODO add flushKey ... in case a flush filtering is necessary
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
     * @function handToCardsSymbols
     * @param {Array} hand array of indexes in deck of cards 0..51
     * @return {Array} char face symbols representation of the indexed hand
     */
    var handToCardsSymbols = function (hand) {
        return hand.map(function (c) { return rankToFaceSymbol[c % 13]; }).join('');
    };
    var handRankToGroup = function (rank, groupsRanking, groupNameMap) {
        if (groupsRanking === void 0) { groupsRanking = handsRankingDelimiter_5cards; }
        if (groupNameMap === void 0) { groupNameMap = handRankingGroupNames; }
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
            handGroup: handRankToGroup(idx, handsRankingDelimiter_Ato5_5cards, handRankingGroupNames_Ato5)
        };
        return rankingObject;
    };
    var fillRank5 = function (h, idx, rankingObject, groupsRanking, groupNameMap) {
        if (groupsRanking === void 0) { groupsRanking = handsRankingDelimiter_5cards; }
        if (groupNameMap === void 0) { groupNameMap = handRankingGroupNames; }
        var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
        rankingObject.HASHES[hash] = idx;
        rankingObject.rankingInfos[idx] = {
            hand: h.slice(),
            faces: handToCardsSymbols(h),
            handGroup: handRankToGroup(idx, groupsRanking, groupNameMap)
        };
        return rankingObject;
    };
    var fillRank5PlusFlushes = function (h, idx, rankingObject, offset) {
        if (offset === void 0) { offset = FLUSHES_BASE_START + HIGH_CARDS_5_AMOUNT; }
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
        var rank = rankingObject.HASHES[hash] + FLUSHES_BASE_START;
        rankingObject.FLUSH_RANK_HASHES[hash] = rank;
        rankingObject.rankingInfos[rank] = {
            hand: h.slice(),
            faces: handToCardsSymbols(h),
            handGroup: handRankToGroup(rank)
        };
        return rankingObject;
    };

    var createRankOfFiveHashes = function () {
        var hashRankingOfFive = {
            HASHES: {},
            FLUSH_CHECK_KEYS: flush5hHashCheck,
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
            baseRankValues: ranksHashOn5,
            baseSuitValues: suitsHash,
            rankingInfos: new Array(7462)
        };
        //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
        var rankCards$$1 = rankCards;
        var STRAIGHTS$$1 = STRAIGHTS;
        var highCards = multiCombinations(rankCards$$1, 5, 1);
        var HIGH_CARDS = removeStraights(highCards);
        var SINGLE_PAIRS = singlePairsList(rankCards$$1);
        var DOUBLE_PAIRS = doublePairsList(rankCards$$1);
        var TRIPLES = trisList(rankCards$$1);
        var FULLHOUSES = fullHouseList(rankCards$$1);
        var QUADS = quadsList(rankCards$$1);
        var upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS$$1);
        upToStraights.forEach(function (h, idx) {
            fillRank5(h, idx, hashRankingOfFive);
        });
        var aboveStraights = FULLHOUSES.concat(QUADS);
        aboveStraights.forEach(function (h, idx) {
            fillRank5PlusFlushes(h, idx, hashRankingOfFive);
        });
        /**FLUSHES and STRAIGHT FLUSHES */
        HIGH_CARDS.forEach(function (h) {
            fillRankFlushes(h, hashRankingOfFive);
        });
        STRAIGHTS$$1.forEach(function (h, idx) {
            var hash = getVectorSum(h.map(function (card) { return hashRankingOfFive.baseRankValues[card]; }));
            var rank = idx + STRAIGHT_FLUSH_BASE_START;
            hashRankingOfFive.FLUSH_RANK_HASHES[hash] = rank;
            hashRankingOfFive.rankingInfos[rank] = {
                hand: h.slice(),
                faces: handToCardsSymbols(h),
                handGroup: handRankToGroup(rank)
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
            baseRankValues: ranksHashOn7,
            baseSuitValues: suitsHash,
            rankingInfos: hashRankOfFive.rankingInfos
        };
        var rankCards$$1 = rankCards;
        var ranksHashOn7$$1 = hashRankingOfFiveOnSeven.baseRankValues;
        multiCombinations(rankCards$$1, 7, 4).forEach(function (hand, i) {
            var h7 = hand.map(function (card) { return ranksHashOn7$$1[card]; });
            var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
            var hash7 = getVectorSum(h7);
            hashRankingOfFiveOnSeven.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES, INVERTED);
        });
        var FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.MULTI_FLUSH_RANK_HASHES;
        var fiveFlushes = combinations(rankCards$$1, 5);
        var sixFlushes = combinations(rankCards$$1, 6);
        var sevenFlushes = combinations(rankCards$$1, 7);
        fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
            var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
            var h7 = h.map(function (c) { return hashRankingOfFiveOnSeven.baseRankValues[c]; });
            var hash7 = getVectorSum(h7);
            var rank = _rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES, INVERTED);
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
            FLUSH_CHECK_KEYS[getVectorSum(h)] = h[0];
        });
        return hashRankingOfFiveOnSeven;
    };
    var createRankOf5AceToFive_Low8 = function () {
        var lowHands = multiCombinations([6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
        var hashRankingLow8 = {
            HASHES: {},
            FLUSH_CHECK_KEYS: {},
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
            baseRankValues: ranksHashOn5,
            baseSuitValues: suitsHash,
            rankingInfos: new Array(lowHands.length)
        };
        lowHands.forEach(function (h, idx) {
            fillRank5(h, idx, hashRankingLow8);
        });
        /**change rankking infos as straights have to have different names */
        return hashRankingLow8;
    };
    var createRankOf5AceToFive_Full = function () {
        var rankCards$$1 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];
        var hashRankingLow = {
            HASHES: {},
            FLUSH_CHECK_KEYS: {},
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
            baseRankValues: ranksHashOn5,
            baseSuitValues: suitsHash,
            rankingInfos: new Array(6175)
        };
        var QUADS = quadsList(rankCards$$1);
        var FULLHOUSES = fullHouseList(rankCards$$1);
        var TRIPLES = trisList(rankCards$$1, true);
        var DOUBLE_PAIRS = doublePairsList(rankCards$$1, true);
        var SINGLE_PAIRS = singlePairsList(rankCards$$1);
        var HIGH_CARDS = multiCombinations(rankCards$$1, 5, 1);
        var all = QUADS.concat(FULLHOUSES, TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS);
        all.forEach(function (h, idx) {
            fillRank5Ato5(h, idx, hashRankingLow);
        });
        return hashRankingLow;
    };
    var createRankOf5AceToSix_Full = function () {
        var hashRankingLow = {
            HASHES: {},
            FLUSH_CHECK_KEYS: {},
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
            baseRankValues: ranksHashOn5,
            baseSuitValues: suitsHash,
            rankingInfos: new Array(7462)
        };
        var rankCards$$1 = rankCards_low;
        var STRAIGHTS$$1 = STRAIGHTS.slice(0, 9).reverse();
        var QUADS = quadsList(rankCards$$1);
        var FULLHOUSES = fullHouseList(rankCards$$1);
        var TRIPLES = trisList(rankCards$$1, true);
        var DOUBLE_PAIRS = doublePairsList(rankCards$$1, true);
        var SINGLE_PAIRS = singlePairsList(rankCards$$1);
        var HIGH_CARDS = multiCombinations(rankCards$$1, 5, 1).filter(function (H, i) {
            return !checkStraight(H);
        });
        /**fill straight flushes as are the lowest hand possbile */
        STRAIGHTS$$1.forEach(function (h, idx) {
            var hash = getVectorSum(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
            var rank = idx;
            hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
            hashRankingLow.rankingInfos[rank] = {
                hand: h.slice(),
                faces: handToCardsSymbols(h),
                handGroup: handRankToGroup(rank, handsRankingDelimiter_Ato6_5cards, handRankingGroupNames_Ato6)
            };
        });
        var FLUSH_GAP = STRAIGHTS$$1.length;
        /**@TODO verify how does straight AKQJT have to be valuated...if ACE counts for low only it should NOT BE a straight!!!! */
        QUADS.concat(FULLHOUSES).forEach(function (h, idx) {
            /**add straights.length because of straight flushes are the lowest to be added */
            fillRank5(h, idx + FLUSH_GAP, hashRankingLow);
        });
        FLUSH_GAP += QUADS.length + FULLHOUSES.length;
        HIGH_CARDS.forEach(function (h, idx) {
            var hash = getVectorSum(h.map(function (card) { return hashRankingLow.baseRankValues[card]; }));
            var rank = idx + FLUSH_GAP;
            hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
            hashRankingLow.rankingInfos[rank] = {
                hand: h.slice(),
                faces: handToCardsSymbols(h),
                handGroup: handRankToGroup(rank, handsRankingDelimiter_Ato6_5cards, handRankingGroupNames_Ato6)
            };
        });
        FLUSH_GAP += HIGH_CARDS.length;
        STRAIGHTS$$1.concat(TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS).forEach(function (h, idx) {
            fillRank5(h, idx + FLUSH_GAP, hashRankingLow, handsRankingDelimiter_Ato6_5cards, handRankingGroupNames_Ato6);
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
            baseRankValues: ranksHashOn7,
            baseSuitValues: suitsHash,
            rankingInfos: hashRankOfFive.rankingInfos
        };
        var ranksHashOn7$$1 = ranksHashOn7;
        /**filling ranks */
        multiCombinations(baseLowRanking, 7, 4).forEach(function (hand, idx) {
            var h7 = hand.map(function (card) { return ranksHashOn7$$1[card]; });
            var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
            var hash7 = getVectorSum(h7);
            hashRankingLow.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
        });
        /*let fiveFlushes = kombinatoricsJs.combinations(baseLowRanking, 5);
        let sixFlushes = kombinatoricsJs.combinations(baseLowRanking, 6);*/
        var sevenFlushes = combinations(baseLowRanking, 7);
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
            hashRankingLow.FLUSH_CHECK_KEYS[getVectorSum(h)] = h[0];
        });
        sevenFlushes.forEach(function (h) {
            var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
            var h7 = h.map(function (c) { return hashRankingLow.baseRankValues[c]; });
            var hash7 = getVectorSum(h7);
            var rank = _rankOf5onX(h5, hashRankOfFive.FLUSH_RANK_HASHES);
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
            baseRankValues: ranksHashOn7,
            baseSuitValues: suitsHash,
            rankingInfos: hashRankOfFive.rankingInfos
        };
        var ranksHashOn7$$1 = ranksHashOn7;
        if (fullFlag) {
            multiCombinations(baseLowRanking, 7, 4).forEach(function (hand, idx) {
                var h7 = hand.map(function (card) { return ranksHashOn7$$1[card]; });
                var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
                var hash7 = getVectorSum(h7);
                hashRankingLow.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
            });
        }
        else {
            var lowHands_1 = multiCombinations(baseLowRanking, 5, 1);
            multiCombinations(rankCards, 2, 2).forEach(function (pair, i) {
                lowHands_1.forEach(function (lo, idx) {
                    var hand = lo.concat(pair);
                    var h7 = hand.map(function (card) { return ranksHashOn7$$1[card]; });
                    var h5 = hand.map(function (card) { return hashRankOfFive.baseRankValues[card]; });
                    var hash7 = getVectorSum(h7);
                    hashRankingLow.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
                });
            });
        }
        return hashRankingLow;
    };
    var createRankOf5AceToFive_Low9 = function () {
        var lowHands = multiCombinations([7, 6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
        var hashRankingLow9 = {
            HASHES: {},
            FLUSH_CHECK_KEYS: {},
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
            baseRankValues: ranksHashOn5,
            baseSuitValues: suitsHash,
            rankingInfos: new Array(lowHands.length)
        };
        lowHands.forEach(function (h, idx) {
            fillRank5(h, idx, hashRankingLow9);
        });
        return hashRankingLow9;
    };

    /** @TODO --> pokerEvaluators.ts have to gather all below functions from specific evaluators files
     *  ex deuceToSevenEval.ts, highRankEval.ts... */
    /**low hands ato5 as well as hand on 6 and omaha optimization are not created at boot,
     * they have to be instantiated explicitly
     */
    console.time("h5");
    var HASHES_OF_FIVE = createRankOfFiveHashes();
    console.timeEnd("h5");
    var FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
    var HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
    var FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;
    console.time("h7");
    var HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
    console.timeEnd("h7");
    var FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
    var HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
    var FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;
    /**LOWBALL DEUCE TO SEVEN HASH ON 7 CARDS*/
    console.time("h7low");
    var HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = createRankOf5On7Hashes(HASHES_OF_FIVE, true);
    console.timeEnd("h7low");
    /**LOW Ato5 HASHES */
    console.time("low5");
    var HASHES_OF_FIVE_LOW8 = createRankOf5AceToFive_Low8();
    var HASHES_OF_FIVE_LOW9 = createRankOf5AceToFive_Low9();
    var HASEHS_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
    console.timeEnd("low5");
    /**LOW Ato5 on 7 cards HASHES */
    console.time("low7");
    var HASHES_OF_SEVEN_LOW8 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8);
    var HASHES_OF_SEVEN_LOW9 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9);
    var HASEHS_OF_SEVEN_LOW_Ato5 = createRankOf7AceToFive_Low(HASEHS_OF_FIVE_LOW_Ato5, rankCards_low, true);
    /**LOW Ato6 HASHES */
    var HASHES_OF_FIVE_Ato6 = createRankOf5AceToSix_Full();
    var HASHES_OF_SEVEN_LOW_Ato6 = createRankOf7AceToSix_Low(HASHES_OF_FIVE_Ato6, rankCards_low);
    console.timeEnd("low7");
    /** @function handOfFiveEval
     *
     * @param {Number} c1...c5 cards hash from CONSTANTS.fullCardsDeckHash_5
     * @returns {Number} hand ranking
     */
    var handOfFiveEval = function (c1, c2, c3, c4, c5) {
        var keySum = c1 + c2 + c3 + c4 + c5;
        var rankKey = keySum >>> 9;
        var flush_check_key = FLUSH_CHECK_FIVE[keySum & FLUSH_MASK];
        if (flush_check_key >= 0) {
            return FLUSH_RANK_FIVE[rankKey];
        }
        return HASH_RANK_FIVE[rankKey];
    };
    /** @function handOfFiveEvalIndexed
     *
     * @param {Number} c1...c5 cards index from [0...51]
     * @returns {Number} hand ranking
     */
    var handOfFiveEvalIndexed = function (c1, c2, c3, c4, c5) {
        return handOfFiveEval(fullCardsDeckHash_5[c1], fullCardsDeckHash_5[c2], fullCardsDeckHash_5[c3], fullCardsDeckHash_5[c4], fullCardsDeckHash_5[c5]);
    };
    /** @function getHandInfo
     *
     * @param {Number} hand rank
     * @returns {handInfo} object containing hand info
     */
    var getHandInfo = function (rank, HASHES, INVERTED) {
        if (HASHES === void 0) { HASHES = HASHES_OF_FIVE; }
        if (INVERTED === void 0) { INVERTED = false; }
        return HASHES.rankingInfos[INVERTED ? HIGH_MAX_RANK - rank : rank];
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
        return Math.max.apply(Math, combinations(hand, 5).map(function (h) { return evalFn.apply(void 0, h); }));
    };
    /** @function handOfSevenEval
     *
     * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
     * @returns {Number} hand ranking
     */
    var handOfSevenEval = function (c1, c2, c3, c4, c5, c6, c7) {
        var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
        var handRank = 0;
        var flush_check_key = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
        if (flush_check_key >= 0) {
            /**no full house or quads possible ---> can return flush_rank */
            var flushyCardsCounter = 0;
            var flushRankKey = 0;
            if ((c1 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c1;
            }
            if ((c2 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c2;
            }
            if ((c3 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c3;
            }
            if ((c4 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c4;
            }
            if ((c5 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c5;
            }
            if ((c6 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c6;
            }
            if ((c7 & FLUSH_MASK) == flush_check_key) {
                flushyCardsCounter++;
                flushRankKey += c7;
            }
            handRank = FLUSH_RANK_SEVEN[flushyCardsCounter][flushRankKey >>> 9];
        }
        else {
            handRank = HASH_RANK_SEVEN[keySum >>> 9];
        }
        return handRank;
    };
    /** @function handOfSevenEvalIndexed
     *
     * @param {Array:Number[]} array of 7 cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
     */
    var handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
        return handOfSevenEval(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
    };
    /**
     *
     *
     * END OF SEVEN EVAL
     *
     */
    /** @function handOfSixEvalIndexed
     *
     * @param {Array:Number[]} array of 6 cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
     */
    var handOfSixEvalIndexed = function (c1, c2, c3, c4, c5, c6) {
        return bfBestOfFiveOnXindexed([c1, c2, c3, c4, c5, c6]);
    };
    /**
     *
     * END OF SIX EVAL INDEXED
     *
     */
    /** @function handOfSevenEval_Verbose  @TODO try to reuse
     *
     * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
     * @returns {verboseHandInfo} verbose information about best hand of 5 cards on seven
     */
    var handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK, INVERTED) {
        if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = HASHES_OF_FIVE_ON_SEVEN; }
        if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = HASHES_OF_FIVE; }
        if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
        if (INVERTED === void 0) { INVERTED = false; }
        var _FLUSH_CHECK_SEVEN = SEVEN_EVAL_HASH.FLUSH_CHECK_KEYS;
        var _FLUSH_RANK_SEVEN = USE_MULTI_FLUSH_RANK
            ? SEVEN_EVAL_HASH.MULTI_FLUSH_RANK_HASHES
            : SEVEN_EVAL_HASH.FLUSH_RANK_HASHES;
        var _HASH_RANK_SEVEN = SEVEN_EVAL_HASH.HASHES;
        var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
        var handRank = 0;
        var flush_check_key = _FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
        var flushRankKey = 0;
        var handVector = [c1, c2, c3, c4, c5, c6, c7];
        if (flush_check_key >= 0) {
            handVector = handVector.filter(function (c, i) {
                return (c & FLUSH_MASK) == flush_check_key;
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
        var handIndexes = handVector.map(function (c) { return cardHashToDescription_7[c]; });
        /**NB if undefined hand rank prepare for unqualified information */
        if (handRank !== 0 && !handRank) {
            return {
                handRank: -1,
                hand: [],
                faces: handToCardsSymbols(handIndexes),
                handGroup: 'unqualified',
                winningCards: [],
                flushSuit: 'unqualified'
            };
        }
        var wHand = FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].hand;
        return {
            handRank: handRank,
            hand: wHand,
            faces: FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].faces,
            handGroup: FIVE_EVAL_HASH.rankingInfos[INVERTED ? HIGH_MAX_RANK - handRank : handRank].handGroup,
            winningCards: filterWinningCards(handIndexes, wHand),
            /**in low8 or 9 there could be more than 5 cards ex AAA2345--->apply procedure to remove duplicates when highliting cards
             * by taking the first of each rank encountered (starting from communitaire cards)
             */
            flushSuit: flushRankKey > -1 ? flushHashToName[flush_check_key] : 'no flush'
        };
    };
    /** @function handOfSevenEvalIndexed_Verbose
     *
     * @param {Array:Number[]} array of 7 cards making up an hand
     * @returns {verboseHandInfo} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
     */
    var handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7, SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK) {
        if (SEVEN_EVAL_HASH === void 0) { SEVEN_EVAL_HASH = HASHES_OF_FIVE_ON_SEVEN; }
        if (FIVE_EVAL_HASH === void 0) { FIVE_EVAL_HASH = HASHES_OF_FIVE; }
        if (USE_MULTI_FLUSH_RANK === void 0) { USE_MULTI_FLUSH_RANK = true; }
        return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7], SEVEN_EVAL_HASH, FIVE_EVAL_HASH, USE_MULTI_FLUSH_RANK);
    };

    var DEFAULT_N_RUNS = 10000;
    var categoryByRankingValue = function (rank) {
        var i = 0;
        while (rank > handsRankingDelimiter_5cards[i])
            i++;
        return handRankingGroupNames[i];
    };
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
        var pHand = partialHand.map(function (c) { return fullCardsDeckHash_7[c]; });
        var partialDeck = getDiffDeck7(pHand);
        var L = partialDeck.length;
        var missingCardsLength = 7 - partialHand.length;
        var fullHand = pHand.slice();
        fullHand.length = 7;
        var totalHandComputed = 0;
        for (var i = 0; i < totalRuns; i++) {
            shuffle(partialDeck);
            var j = 0, t = 0;
            while (j < L) {
                fullHand[pHand.length + t] = partialDeck[j];
                if (t === missingCardsLength) {
                    //@ts-ignore
                    var rank = handOfSevenEval.apply(void 0, fullHand);
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

    /**hashes to be created at boot by default!!!! */
    /**HIGH*/
    var HASHES_OF_FIVE$1 = createRankOfFiveHashes();
    var HASH_RANK_FIVE$1 = HASHES_OF_FIVE$1.HASHES;
    /**LOW Ato5*/
    var HASHES_OF_FIVE_LOW8$1 = createRankOf5AceToFive_Low8();
    var HASHES_OF_FIVE_LOW9$1 = createRankOf5AceToFive_Low9();
    var HASHES_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
    /**LOW Ato6*/
    var HASHES_OF_FIVE_Ato6$1 = createRankOf5AceToSix_Full();

    /**@TODO create a config module, if development build all hashes? or used to preconfigure the library? */
    var FIVE_CARD_POKER_EVAL = {
        HandRank: {
            5: {
                high: function () { },
                low8: function () { },
                low9: function () { },
                Ato5: function () { },
                Ato6: function () { },
                _2to7: function () { }
            },
            6: {
                high: function () { },
                low8: function () { },
                low9: function () { },
                Ato5: function () { },
                Ato6: function () { },
                _2to7: function () { }
            },
            7: {
                high: function () { },
                low8: function () { },
                low9: function () { },
                Ato5: function () { },
                Ato6: function () { },
                _2To7: function () { }
            }
        },
        /**generate hashesofSeven and set  FIVE_CARD_POKER_EVAL.HandRank.7.high = fastEvalfunction
         * @TODO create verbose to work starting from numericRank and fullHand array, drawing flushy cards always in the same way
         * whther faster hashes are generated or not
        */
        hashLoaders: {
            6: {},
            7: {
                high: function () { },
                low8: function () { },
                low9: function () { },
                Ato5: function () { },
                Ato6: function () { },
                _2to7: function () { }
            }
        }
    };
    var getTableSlice = function (startIdx, keys, gapSize) {
        if (gapSize === void 0) { gapSize = 1; }
        var i = startIdx + 1;
        var slice = {
            start: startIdx,
            end: startIdx,
            values: [keys[startIdx]]
        };
        var nogap = true;
        while (i < keys.length && nogap) {
            if (keys[i] - keys[i - 1] > gapSize) {
                nogap = false;
            }
            else {
                slice.end = i;
                slice.values.push(keys[i]);
                i++;
            }
        }
        return slice;
    };
    var splitHashTable = function (hashTable, gapSize) {
        if (gapSize === void 0) { gapSize = 1; }
        var splitted = [];
        var keys = Object.keys(hashTable).map(function (v) { return parseInt(v); });
        keys.sort(function (a, b) { return a - b; });
        console.log(keys);
        var aSlice = getTableSlice(0, keys, gapSize);
        while (aSlice.end < keys.length - 1) {
            splitted.push(aSlice);
            aSlice = getTableSlice(aSlice.end + 1, keys, gapSize);
        }
        console.log(splitted);
    };
    console.log(splitHashTable(HASHES_OF_FIVE_ON_SEVEN.HASHES, 1000));
    /**@TODO yahtzee ,poker dice,yacht,generala ,cheerio and the various caisino video poker*/

    exports.HASH_RANK_FIVE = HASH_RANK_FIVE$1;
    exports.HASHES_OF_FIVE_ON_SEVEN = HASHES_OF_FIVE_ON_SEVEN;
    exports.handOfSevenEvalIndexed = handOfSevenEvalIndexed;
    exports.handOfFiveEvalIndexed = handOfFiveEvalIndexed;
    exports.getHandInfo = getHandInfo;
    exports.handOfSevenEvalIndexed_Verbose = handOfSevenEvalIndexed_Verbose;
    exports.handOfSixEvalIndexed = handOfSixEvalIndexed;
    exports.getPartialHandStatsIndexed_7 = getPartialHandStatsIndexed_7;
    exports.FIVE_CARD_POKER_EVAL = FIVE_CARD_POKER_EVAL;
    exports.getTableSlice = getTableSlice;
    exports.splitHashTable = splitHashTable;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gamblingjs.umd.js.map
