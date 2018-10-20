"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var CONSTANTS = require("./constants");
exports.getDiffDeck5 = function (listOfHands) {
    var deck = CONSTANTS.fullCardsDeckHash_5.slice().filter(function (c) { return !listOfHands.includes(c); });
    return deck;
};
exports.getDiffDeck7 = function (listOfHands) {
    var deck = CONSTANTS.fullCardsDeckHash_7.slice().filter(function (c) { return !listOfHands.includes(c); });
    return deck;
};
exports.atLeastFiveEqual = function (list) {
    return list.filter(function (v) {
        var l = v.length;
        var c = 0, i = 1;
        while (i < l) {
            if (v[i] === v[i - 1]) {
                c++;
            }
            else {
                c = 0;
            }
            i++;
            if (c === 4)
                break;
        }
        return c >= 4;
    });
};
exports.getVectorSum = function (v) {
    var l = v.length;
    var s = 0;
    for (var i = 0; i < l; i++) {
        s += v[i];
    }
    return s;
};
exports.getFlushSuit7 = function (v) {
    if (v.length != 7) {
        return 0;
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
exports.checkStraight5on7 = function (arr) {
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
exports.singlePairsList = function (startSet) {
    var toAdd = kombinatoricsJs.multiCombinations(startSet, 3, 1);
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
exports.internalDoublePairsSort = function (a, b) {
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
exports.sortedPairsToAdd = function (startSet) {
    var _toAdd = kombinatoricsJs.multiCombinations(startSet, 2, 1);
    _toAdd.forEach(function (pair) {
        var _a;
        /* istanbul ignore next */
        if (pair[0] < pair[1]) {
            _a = [pair[1], pair[0]], pair[0] = _a[0], pair[1] = _a[1];
        }
    });
    _toAdd.sort(exports.internalDoublePairsSort);
    return _toAdd;
};
exports.doublePairsList = function (startSet, isLow) {
    if (isLow === void 0) { isLow = false; }
    var toAdd = isLow
        ? kombinatoricsJs.multiCombinations(startSet, 2, 1)
        : exports.sortedPairsToAdd(startSet);
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
exports.trisList = function (startSet, isLow) {
    if (isLow === void 0) { isLow = false; }
    var toAdd = isLow
        ? kombinatoricsJs.multiCombinations(startSet, 2, 1)
        : exports.sortedPairsToAdd(startSet);
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
exports.fullHouseList = function (startSet) {
    var fullHouses = kombinatoricsJs.crossProduct(startSet, 2).filter(function (p) { return p[0] !== p[1]; });
    return fullHouses.map(function (hand, idx) {
        return [hand[0], hand[0], hand[0], hand[1], hand[1]];
    });
};
exports.quadsList = function (startSet) {
    var quads = kombinatoricsJs.crossProduct(startSet, 2).filter(function (p) { return p[0] !== p[1]; });
    return quads.map(function (hand) {
        return [hand[0], hand[0], hand[0], hand[0], hand[1]];
    });
};
exports.checkStraight = function (arr) {
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
exports.checkDoublePair = function (hand) {
    /* istanbul ignore next */
    return ((hand[0] === hand[1] && hand[2] === hand[3] && hand[3] !== hand[4] && hand[1] !== hand[4]) ||
        (hand[0] === hand[1] && hand[3] === hand[4] && hand[3] !== hand[2] && hand[1] !== hand[2]) ||
        (hand[1] === hand[2] && hand[3] === hand[4] && hand[3] !== hand[0] && hand[2] !== hand[0]));
};
exports.removeStraights = function (list) {
    return list.filter(function (hand, idx) {
        return !exports.checkStraight(hand);
    });
};
exports._rankOfHand = function (hand, rankHash) {
    return rankHash[exports.getVectorSum(hand)];
};
exports._rankOf5onX = function (hand, rankHash, INVERTED) {
    if (INVERTED === void 0) { INVERTED = false; }
    var comb = kombinatoricsJs.combinations(hand, 5);
    var max = 0;
    comb.forEach(function (h) {
        var s = exports.getVectorSum(h);
        var r = rankHash[s];
        INVERTED ? (r = CONSTANTS.HIGH_MAX_RANK - r) : null;
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
exports.filterWinningCards = function (fullHand, winningRanks) {
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
exports.handToCardsSymbols = function (hand) {
    return hand.map(function (c) { return CONSTANTS.rankToFaceSymbol[c % 13]; }).join('');
};
exports.handRankToGroup = function (rank, groupsRanking, groupNameMap) {
    if (groupsRanking === void 0) { groupsRanking = CONSTANTS.handsRankingDelimiter_5cards; }
    if (groupNameMap === void 0) { groupNameMap = CONSTANTS.handRankingGroupNames; }
    var i = 0;
    var groupName = groupNameMap[i];
    while (rank > groupsRanking[i]) {
        i++;
        groupName = groupNameMap[i];
    }
    return groupName;
};
exports.fillRank5Ato5 = function (h, idx, rankingObject) {
    var hash = exports.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: exports.handToCardsSymbols(h),
        handGroup: exports.handRankToGroup(idx, CONSTANTS.handsRankingDelimiter_Ato5_5cards, CONSTANTS.handRankingGroupNames_Ato5)
    };
    return rankingObject;
};
exports.fillRank5 = function (h, idx, rankingObject, groupsRanking, groupNameMap) {
    if (groupsRanking === void 0) { groupsRanking = CONSTANTS.handsRankingDelimiter_5cards; }
    if (groupNameMap === void 0) { groupNameMap = CONSTANTS.handRankingGroupNames; }
    var hash = exports.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: exports.handToCardsSymbols(h),
        handGroup: exports.handRankToGroup(idx, groupsRanking, groupNameMap)
    };
    return rankingObject;
};
exports.fillRank5_ato5 = function (h, idx, rankingObject) {
    var hash = exports.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: exports.handToCardsSymbols(h),
        handGroup: exports.handRankToGroup(idx)
    };
    return rankingObject;
};
exports.fillRank5PlusFlushes = function (h, idx, rankingObject, offset) {
    if (offset === void 0) { offset = CONSTANTS.FLUSHES_BASE_START + CONSTANTS.HIGH_CARDS_5_AMOUNT; }
    var hash = exports.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    var r = idx + offset;
    rankingObject.HASHES[hash] = r;
    rankingObject.rankingInfos[r] = {
        hand: h.slice(),
        faces: exports.handToCardsSymbols(h),
        handGroup: exports.handRankToGroup(r)
    };
    return rankingObject;
};
exports.fillRankFlushes = function (h, rankingObject) {
    var hash = exports.getVectorSum(h.map(function (card) { return rankingObject.baseRankValues[card]; }));
    var rank = rankingObject.HASHES[hash] + CONSTANTS.FLUSHES_BASE_START;
    rankingObject.FLUSH_RANK_HASHES[hash] = rank;
    rankingObject.rankingInfos[rank] = {
        hand: h.slice(),
        faces: exports.handToCardsSymbols(h),
        handGroup: exports.handRankToGroup(rank)
    };
    return rankingObject;
};
//# sourceMappingURL=routines.js.map