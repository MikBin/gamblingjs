"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
exports.atLeast5Eq = function (list) {
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
        if (c === 4)
            break;
    }
    return t;
};
exports.checkStraight5on7 = function (arr) {
    var c = 0;
    if (arr[6] === 12 && arr[0] === 0 && arr.includes(1) && arr.includes(2) && arr.includes(3)) {
        return true;
    }
    for (var i = 1; i < arr.length; ++i) {
        if (arr[i - 1] + 1 === arr[i]) {
            c++;
        }
        else {
            c = 0;
        }
        if (c === 4)
            break;
    }
    return c >= 4;
};
exports.singlePairsList = function (startSet) {
    var toAdd = kombinatoricsJs.multiCombinations(startSet, 3, 0);
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
exports.sortedPairsToAdd = function (startSet) {
    var _toAdd = kombinatoricsJs.multiCombinations(startSet, 2, 0);
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
exports.doublePairsList = function (startSet) {
    var toAdd = exports.sortedPairsToAdd(startSet);
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
exports.trisList = function (startSet) {
    var toAdd = exports.sortedPairsToAdd(startSet);
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
    return quads.map(function (hand, idx) {
        return [hand[0], hand[0], hand[0], hand[0], hand[1]];
    });
};
exports.checkStraight = function (arr) {
    var cond = true;
    if (arr[4] === 12 && arr[0] === 0) {
        return arr[1] === 1 && arr[2] === 2 && arr[3] === 3;
    }
    for (var i = 1; i < arr.length; ++i) {
        cond = cond && arr[i - 1] + 1 === arr[i];
    }
    return cond;
};
exports.checkDoublePair = function (hand) {
    return ((hand[0] === hand[1] && hand[2] === hand[3]) ||
        (hand[0] === hand[1] && hand[3] === hand[4]) ||
        (hand[1] === hand[2] && hand[3] === hand[4]));
};
exports.removeStraights = function (list) {
    return list.filter(function (hand, idx) {
        return !exports.checkStraight(hand);
    });
};
//# sourceMappingURL=routines.js.map