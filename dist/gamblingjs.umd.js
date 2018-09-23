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

    var flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 255, 508, 1012, 2016, 4016]; // 13 one for each rank
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
        9: 'clubs'
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
    var HIGH_CARDS_5_AMOUNT = 1277;
    var FLUSHES_BASE_START = 5863;
    var STRAIGHT_FLUSH_BASE_START = 7452;
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
    /**
     * @TODO make function to work with non full decks. ex. deck of 40 cards
     *
     * */
    /**
     * @TODO prepare similar stuff for dice suited poker
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
    var checkStraight5on7 = function (arr) {
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
    var doublePairsList = function (startSet) {
        var toAdd = sortedPairsToAdd(startSet);
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
    var trisList = function (startSet) {
        var toAdd = sortedPairsToAdd(startSet);
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
        for (var i = 1; i < arr.length; ++i) {
            cond = cond && arr[i - 1] + 1 === arr[i];
        }
        return cond;
    };
    var removeStraights = function (list) {
        return list.filter(function (hand, idx) {
            return !checkStraight(hand);
        });
    };
    var _rankOf5onX = function (hand, rankHash) {
        return Math.max.apply(Math, combinations(hand, 5).map(function (h) { return rankHash[getVectorSum(h)]; }));
    };
    var handToCardsSymbols = function (hand) {
        return hand.map(function (c) { return rankToFaceSymbol[c % 13]; }).join('');
    };
    var handRankToGroup = function (rank) {
        var groupsRanking = handsRankingDelimiter_5cards;
        var i = 0;
        var groupName = handRankingGroupNames[i];
        while (rank > groupsRanking[i]) {
            i++;
            groupName = handRankingGroupNames[i];
        }
        return groupName;
    };
    var fillRank5 = function (h, idx, rankingObject) {
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
        /*
        let inc = 0;
        console.log('high cards', (inc += HIGH_CARDS.length));
        console.log('single pairs', (inc += SINGLE_PAIRS.length));
        console.log('double pairs', (inc += DOUBLE_PAIRS.length));
        console.log('triples', (inc += TRIPLES.length));
        console.log('straights', (inc += STRAIGHTS.length));
        
        console.log('flushes', (inc += HIGH_CARDS_5_AMOUNT));
        console.log('full houses', (inc += FULLHOUSES.length));
        console.log('quads', (inc += QUADS.length));
      */
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
    //export const createRankOf5On6Hashes = () => { };
    /**@TODO add hand code to rankingInfo : [12,0,1,2,3,10,11] this is straight A2345KQ
     * or just retrieve category from rankValue the fine hightest card or components by statical exaustive hand analisys
     */
    var createRankOf5On7Hashes = function (hashRankOfFive) {
        var hashRankingOfFiveOnSeven = {
            HASHES: {},
            FLUSH_CHECK_KEYS: {},
            FLUSH_RANK_HASHES: {},
            FLUSH_HASHES: {},
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
            hashRankingOfFiveOnSeven.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
        });
        var fiveFlushes = combinations(rankCards$$1, 5);
        var sixFlushes = combinations(rankCards$$1, 6);
        var sevenFlushes = combinations(rankCards$$1, 7);
        fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(function (h) {
            var h5 = h.map(function (c) { return hashRankOfFive.baseRankValues[c]; });
            var h7 = h.map(function (c) { return hashRankingOfFiveOnSeven.baseRankValues[c]; });
            var hash7 = getVectorSum(h7);
            /**@TODO simply draw rank from hashRankOfFive.FLUSH_RANK_HASHES*/
            var rank = _rankOf5onX(h5, hashRankOfFive.HASHES);
            if (checkStraight5on7(h)) {
                rank += STRAIGHT_FLUSH_OFFSET;
            }
            else {
                rank += FLUSHES_BASE_START;
            }
            hashRankingOfFiveOnSeven.FLUSH_RANK_HASHES[hash7] = rank;
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
            FLUSH_CHECK_KEYS[getVectorSum(h)] = h[0];
        });
        /*console.log(counter, sixFlushes, sevenFlushes, fiveFlushes);
          console.log(cc, fiveFlushHashes, sixFlushHashes, sevenFlushHashes, hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS);
          console.log("--------", hashRankingOfFiveOnSeven);*/
        return hashRankingOfFiveOnSeven;
    };

    var HASHES_OF_FIVE = createRankOfFiveHashes();
    var FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
    var HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
    var FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;
    var HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
    var FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
    var HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
    var FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES;
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
    /** @function bfBestOfFiveOnX
     *
     * @param {Array:Number[]} array of 6 or more cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
     */
    var bfBestOfFiveOnX = function (hand) {
        //@ts-ignore
        return Math.max.apply(Math, combinations(hand, 5).map(function (h) { return handOfFiveEval.apply(void 0, h); }));
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
            //@ts-ignore
            var flushRankKey = 
            //@ts-ignore
            ((c1 & FLUSH_MASK) == flush_check_key) * c1 +
                //@ts-ignore
                ((c2 & FLUSH_MASK) == flush_check_key) * c2 +
                //@ts-ignore
                ((c3 & FLUSH_MASK) == flush_check_key) * c3 +
                //@ts-ignore
                ((c4 & FLUSH_MASK) == flush_check_key) * c4 +
                //@ts-ignore
                ((c5 & FLUSH_MASK) == flush_check_key) * c5 +
                //@ts-ignore
                ((c6 & FLUSH_MASK) == flush_check_key) * c6 +
                //@ts-ignore
                ((c7 & FLUSH_MASK) == flush_check_key) * c7;
            handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
        }
        else {
            handRank = HASH_RANK_SEVEN[keySum >>> 9];
        }
        return handRank;
    };
    /** @function handOfSixEvalIndexed
     *
     * @param {Array:Number[]} array of 7 cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
     */
    var handOfSixEvalIndexed = function (c1, c2, c3, c4, c5, c6) {
        return bfBestOfFiveOnX([
            fullCardsDeckHash_5[c1],
            fullCardsDeckHash_5[c2],
            fullCardsDeckHash_5[c3],
            fullCardsDeckHash_5[c4],
            fullCardsDeckHash_5[c5],
            fullCardsDeckHash_5[c6]
        ]);
    };
    /** @function handOfSevenEvalIndexed
     *
     * @param {Array:Number[]} array of 7 cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
     */
    var handOfSevenEvalIndexed = function (c1, c2, c3, c4, c5, c6, c7) {
        return handOfSevenEval(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
    };
    /** @function handOfSevenEval
     *
     * @param {Number} c1...c7 cards hash from CONSTANTS.fullCardsDeckHash_7
     * @returns {Number} hand ranking
     */
    var handOfSevenEval_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
        var keySum = c1 + c2 + c3 + c4 + c5 + c6 + c7;
        var handRank = 0;
        var flush_check_key = FLUSH_CHECK_SEVEN[keySum & FLUSH_MASK];
        var flushRankKey = 0;
        var handVector = [c1, c2, c3, c4, c5, c6, c7];
        if (flush_check_key >= 0) {
            /* istanbul ignore next */
            handVector = handVector.filter(function (c, i) {
                return (c & FLUSH_MASK) == flush_check_key;
            });
            /* istanbul ignore next */
            handVector.forEach(function (c) { return (flushRankKey += c); });
            /* istanbul ignore next */
            handRank = FLUSH_RANK_SEVEN[flushRankKey >>> 9];
        }
        else {
            handRank = HASH_RANK_SEVEN[keySum >>> 9];
            flushRankKey = -1;
        }
        var wHand = HASHES_OF_FIVE.rankingInfos[handRank].hand;
        var handIndexes = handVector.map(function (c) { return cardHashToDescription_7[c]; });
        return {
            handRank: handRank,
            hand: wHand,
            faces: HASHES_OF_FIVE.rankingInfos[handRank].faces,
            handGroup: HASHES_OF_FIVE.rankingInfos[handRank].handGroup,
            winningCards: handIndexes.filter(function (c) { return wHand.includes(c % 13); }),
            flushSuit: flushRankKey > -1 ? flushHashToName[flush_check_key] : 'no flush'
        };
    };
    /** @function handOfSevenEvalIndexed_Verbose
     *
     * @param {Array:Number[]} array of 7 cards making up an hand
     * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5) + ranking info including flush suit and winning cards
     */
    var handOfSevenEvalIndexed_Verbose = function (c1, c2, c3, c4, c5, c6, c7) {
        return handOfSevenEval_Verbose(fullCardsDeckHash_7[c1], fullCardsDeckHash_7[c2], fullCardsDeckHash_7[c3], fullCardsDeckHash_7[c4], fullCardsDeckHash_7[c5], fullCardsDeckHash_7[c6], fullCardsDeckHash_7[c7]);
    };
    /** @function getHandInfo
     *
     * @param {Number} hand rank
     * @returns {Number} object containing hand info
     */
    var getHandInfo = function (rank) {
        return HASHES_OF_FIVE.rankingInfos[rank];
    };

    var PKEval = /*#__PURE__*/Object.freeze({
        HASHES_OF_FIVE: HASHES_OF_FIVE,
        HASHES_OF_FIVE_ON_SEVEN: HASHES_OF_FIVE_ON_SEVEN,
        handOfFiveEval: handOfFiveEval,
        handOfFiveEvalIndexed: handOfFiveEvalIndexed,
        bfBestOfFiveOnX: bfBestOfFiveOnX,
        handOfSevenEval: handOfSevenEval,
        handOfSixEvalIndexed: handOfSixEvalIndexed,
        handOfSevenEvalIndexed: handOfSevenEvalIndexed,
        handOfSevenEval_Verbose: handOfSevenEval_Verbose,
        handOfSevenEvalIndexed_Verbose: handOfSevenEvalIndexed_Verbose,
        getHandInfo: getHandInfo
    });

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
            'straight': 0,
            'flush': 0,
            'full house': 0,
            'four of a kind': 0,
            'straight flush': 0,
            'average': 0
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

    /**@TODO yahtzee ,poker dice,yacht,generala ,cheerio*/

    exports.default = PKEval;
    exports.handOfSevenEvalIndexed = handOfSevenEvalIndexed;
    exports.handOfFiveEvalIndexed = handOfFiveEvalIndexed;
    exports.getHandInfo = getHandInfo;
    exports.handOfSevenEvalIndexed_Verbose = handOfSevenEvalIndexed_Verbose;
    exports.handOfSixEvalIndexed = handOfSixEvalIndexed;
    exports.getPartialHandStatsIndexed_7 = getPartialHandStatsIndexed_7;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gamblingjs.umd.js.map
