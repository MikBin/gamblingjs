const factorial = (n) => {
    let f = 1;
    for (let i = 1; i < n + 1; ++i) {
        f *= i;
    }
    return f;
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
/**
 *@method
 *
 *@param
 *@return
 */
const multiCombinations = (_collection, n, repetition) => {
    let multiComb = [];
    pick(n, [], 0, _collection, repetition, 0, (c) => {
        multiComb.push(c.slice());
    });
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
        let number = i;
        for (let j = k - 1; j >= 0; --j) {
            let digit = number % ln;
            number = Math.floor(number / ln);
            tmpList[j] = list[digit];
        }
        crossProdList[i] = tmpList;
    }
    return crossProdList;
};

var flushHash = [1, 2, 4, 8, 16, 32, 64, 128, 255, 508, 1012, 2016, 4016]; // 13 one for each rank
var suitsHash = [0, 57, 1, 8]; // 4 one for each suit
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
/*
arrays initialization
*/
var deckOfRanks = new Array(52);
var deckOfFlushes = new Array(52);
var deckOfSuits = new Array(52);
for (var i = 0; i < 52; i++) {
    deckOfRanks[i] = ranksHashOn5[i % 13];
    deckOfFlushes[i] = flushHash[i % 13];
    deckOfSuits[i] = suitsHash[~~(i / 13)];
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
/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards
 *
 * */
/**
 * @TODO prepare similar stuff for dice suited poker
 *
 * */

var getVectorSum = function (v) {
    var l = v.length;
    var s = 0;
    for (var i = 0; i < l; i++) {
        s += v[i];
    }
    return s;
};
var singlePairsList = function (startSet) {
    var toAdd = multiCombinations(startSet, 3, 0);
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
var sortedPairsToAdd = function (startSet) {
    var _toAdd = multiCombinations(startSet, 2, 0);
    _toAdd.forEach(function (pair, idx) {
        if (pair[0] < pair[1]) {
            var tmp = pair[0];
            pair[0] = pair[1];
            pair[1] = tmp;
        }
    });
    _toAdd.sort(function (a, b) {
        if (a[0] < b[0])
            return -1;
        if (a[0] > b[0])
            return 1;
        if (a[1] < b[1])
            return -1;
        if (a[1] > b[1])
            return 1;
        return 0;
    });
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
    return quads.map(function (hand, idx) {
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

var fillRank5 = function (h, idx, rankingObject) {
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos.push(idx);
    return rankingObject;
};
var fillRank5PlusFlushes = function (h, idx, rankingObject, offset) {
    if (offset === void 0) { offset = FLUSHES_BASE_START + HIGH_CARDS_5_AMOUNT; }
    var hash = getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx + offset;
    rankingObject.rankingInfos.push(idx + offset);
    return rankingObject;
};
var createRankOfFiveHashes = function () {
    var hashRankingOfFive = {
        HASHES: {},
        baseRankValues: ranksHashOn5,
        baseSuitValues: suitsHash,
        rankingInfos: []
    };
    //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;
    var rankCards$$1 = rankCards;
    var STRAIGHTS$$1 = STRAIGHTS;
    var HIGH_CARDS_5_AMOUNT$$1 = HIGH_CARDS_5_AMOUNT;
    var highCards = multiCombinations(rankCards$$1, 5, 0);
    var HIGH_CARDS = removeStraights(highCards);
    var SINGLE_PAIRS = singlePairsList(rankCards$$1);
    var DOUBLE_PAIRS = doublePairsList(rankCards$$1);
    var TRIPLES = trisList(rankCards$$1);
    var FULLHOUSES = fullHouseList(rankCards$$1);
    var QUADS = quadsList(rankCards$$1);
    console.log(HIGH_CARDS, FULLHOUSES, QUADS);
    var inc = 0;
    console.log("high cards", inc += HIGH_CARDS.length);
    console.log("single pairs", inc += SINGLE_PAIRS.length);
    console.log("double pairs", inc += DOUBLE_PAIRS.length);
    console.log("triples", inc += TRIPLES.length);
    console.log("straights", inc += STRAIGHTS$$1.length);
    //flushes as many as highcards
    console.log("flushes", inc += HIGH_CARDS_5_AMOUNT$$1);
    console.log("full houses", inc += FULLHOUSES.length);
    console.log("quads", inc += QUADS.length);
    HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS$$1).forEach(function (h, idx) {
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
var _rankOf5onX = function (hand, rankHash) {
    return Math.max.apply(Math, combinations(hand, 5).map(function (h) { return rankHash[getVectorSum(h)]; }));
};
var createRankOf5On7Hashes = function (hashRankOfFive) {
    var hashRankingOfFiveOnSeven = {
        HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: ranksHashOn7,
        baseSuitValues: suitsHash,
        rankingInfos: []
    };
    var counter = 0;
    var rankCards$$1 = rankCards;
    var ranksHashOn7$$1 = hashRankingOfFiveOnSeven.baseRankValues;
    multiCombinations(rankCards$$1, 7, 3).map(function (hand) { return hand.map(function (card) { return ranksHashOn7$$1[card]; }); }).forEach(function (h, i) {
        var hash = getVectorSum(h);
        hashRankingOfFiveOnSeven.HASHES[hash] = _rankOf5onX(h, hashRankOfFive.HASHES);
        counter++;
    });
    /**
  * 5 same suits
  * 6 same suits
  * 7 same suits
  * the use best5On6 best5On7
  */
    var fiveFlushes = combinations(rankCards$$1, 5).map(function (hand) { return hand.map(function (card) { return ranksHashOn7$$1[card]; }); });
    var sixFlushes = combinations(rankCards$$1, 6).map(function (hand) { return hand.map(function (card) { return ranksHashOn7$$1[card]; }); });
    var sevenFlushes = combinations(rankCards$$1, 7).map(function (hand) { return hand.map(function (card) { return ranksHashOn7$$1[card]; }); });
    console.log(counter, hashRankingOfFiveOnSeven, sixFlushes, sevenFlushes, fiveFlushes);
    return hashRankingOfFiveOnSeven;
};

var HASHES_OF_FIVE = createRankOfFiveHashes();
var HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
console.log(HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN);
var fac = function (n) {
    return factorial(n);
};

export { fac };
//# sourceMappingURL=gamblingjs.es5.js.map
