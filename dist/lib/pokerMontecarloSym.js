"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsjs_1 = require("kombinatoricsjs");
var constants_1 = require("./constants");
var routines_1 = require("./routines");
var pokerEvaluators_1 = require("./pokerEvaluators");
var DEFAULT_N_RUNS = 10000;
exports.categoryByRankingValue = function (rank) {
    var i = 0;
    while (rank > constants_1.handsRankingDelimiter_5cards[i])
        i++;
    return constants_1.handRankingGroupNames[i];
};
exports.getPartialHandStatsIndexed_7 = function (partialHand, totalRuns) {
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
    var pHand = partialHand.map(function (c) { return constants_1.fullCardsDeckHash_7[c]; });
    var partialDeck = routines_1.getDiffDeck7(pHand);
    var L = partialDeck.length;
    var missingCardsLength = 7 - partialHand.length;
    var fullHand = pHand.slice();
    fullHand.length = 7;
    var totalHandComputed = 0;
    for (var i = 0; i < totalRuns; i++) {
        kombinatoricsjs_1.shuffle(partialDeck);
        var j = 0, t = 0;
        while (j < L) {
            fullHand[pHand.length + t] = partialDeck[j];
            if (t === missingCardsLength) {
                //@ts-ignore
                var rank = pokerEvaluators_1.handOfSevenEval.apply(void 0, fullHand);
                stats.average += rank;
                stats[exports.categoryByRankingValue(rank)]++;
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
//# sourceMappingURL=pokerMontecarloSym.js.map