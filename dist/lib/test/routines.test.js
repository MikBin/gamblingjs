"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routines_1 = require("../src/routines");
var constants_1 = require("../src/constants");
describe('testing diffs: ', function () {
    var hd5 = constants_1.fullCardsDeckHash_5.slice();
    var f2 = hd5.splice(0, 2);
    it('should get diff of deck 5', function () {
        expect(routines_1.getDiffDeck5(f2)).toEqual(hd5);
    });
    var hd7 = constants_1.fullCardsDeckHash_7.slice();
    var f27 = hd7.splice(0, 2);
    it('should get diff of deck 7', function () {
        expect(routines_1.getDiffDeck7(f27)).toEqual(hd7);
    });
});
describe('testing basic routines', function () {
    it('returns the only element with 5 equals', function () {
        expect(routines_1.atLeastFiveEqual([[2, 3, 1, 1, 1, 1, 1, 5], [1, 1, 1, 1]])).toEqual([
            [2, 3, 1, 1, 1, 1, 1, 5]
        ]);
    });
    it('sums all numbers', function () {
        expect(routines_1.getVectorSum([2, 3, 1, 1, 1, 1, 1, 5])).toEqual(15);
    });
    it('gets sum suits on 7', function () {
        expect(routines_1.getFlushSuit7([1, 2, 3, 2, 2, 2, 2])).toEqual(2);
    });
    it('false when no straight is passed', function () {
        expect(routines_1.checkStraight5on7([1, 2, 3, 2, 2, 2, 2])).toEqual(false);
    });
    it('true when  straight is passed', function () {
        expect(routines_1.checkStraight5on7([0, 1, 2, 2, 3, 8, 12])).toEqual(true);
    });
    it('to create single pairs from simple combinations set', function () {
        expect(routines_1.singlePairsList([0, 1, 2, 3])).toEqual([
            [0, 0, 1, 2, 3],
            [1, 1, 0, 2, 3],
            [2, 2, 0, 1, 3],
            [3, 3, 0, 1, 2]
        ]);
    });
    it('to create single sorted pairs from simple combinations set', function () {
        expect(routines_1.sortedPairsToAdd([0, 1, 2, 3])).toEqual([
            [1, 0],
            [2, 0],
            [2, 1],
            [3, 0],
            [3, 1],
            [3, 2]
        ]);
    });
    it('creates a sorted list of double pairs', function () {
        expect(routines_1.doublePairsList([0, 1, 2])).toEqual([[1, 1, 0, 0, 2], [2, 2, 0, 0, 1], [2, 2, 1, 1, 0]]);
    });
    it('creates sorted triples list', function () {
        expect(routines_1.trisList([0, 1, 2])).toEqual([[0, 0, 0, 2, 1], [1, 1, 1, 2, 0], [2, 2, 2, 1, 0]]);
    });
    it('creates sorted fullhouses list', function () {
        expect(routines_1.fullHouseList([0, 1, 2])).toEqual([
            [0, 0, 0, 1, 1],
            [0, 0, 0, 2, 2],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 2, 2],
            [2, 2, 2, 0, 0],
            [2, 2, 2, 1, 1]
        ]);
    });
    it('creates sorted four of a kind list', function () {
        expect(routines_1.quadsList([0, 1, 2])).toEqual([
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 2],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 2],
            [2, 2, 2, 2, 0],
            [2, 2, 2, 2, 1]
        ]);
    });
    it('return true if its a straight, false otherwise', function () {
        expect(routines_1.checkStraight([0, 1, 2, 3, 12])).toBe(true);
        expect(routines_1.checkStraight([0, 1, 2, 3, 4])).toBe(true);
        expect(routines_1.checkStraight([0, 1, 2, 3, 7])).toBe(false);
    });
    it('return true if its a double pair, false otherwise', function () {
        expect(routines_1.checkDoublePair([0, 1, 2, 3, 12])).toBe(false);
        expect(routines_1.checkDoublePair([0, 0, 3, 3, 4])).toBe(true);
        expect(routines_1.checkDoublePair([0, 0, 3, 3, 3])).toBe(false);
    });
    it('removes straights from a list of hands', function () {
        var handslist = [[1, 2, 3, 4, 5], [0, 0, 0, 1, 1], [1, 1, 3, 4, 4]];
        expect(routines_1.removeStraights(handslist)).toEqual([[0, 0, 0, 1, 1], [1, 1, 3, 4, 4]]);
    });
    it('returns 0 if values are equals 1 if first is bigger, -1 otherwise', function () {
        expect(routines_1.internalDoublePairsSort([1, 1], [1, 1])).toBe(0);
        expect(routines_1.internalDoublePairsSort([1, 1], [1, 0])).toBe(1);
        expect(routines_1.internalDoublePairsSort([1, 1], [2, 0])).toBe(-1);
    });
    it('filters 5 winning cards from a set of >5 ', function () {
        expect(routines_1.filterWinningCards([11, 24, 37, 50, 10, 23, 36], [10, 10, 10, 11, 11])).toEqual([
            11,
            24,
            10,
            23,
            36
        ]);
    });
});
describe('ranking calculators and hashes managers', function () {
    var fakeHash = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
    var fakeRankingObj = {
        HASHES: {},
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: [0, 1, 2],
        baseSuitValues: [0, 1, 2],
        rankingInfos: []
    };
    it('should compute rank of hand given hash and hand list', function () {
        expect(routines_1._rankOfHand([0, 0, 0], fakeHash)).toBe(0);
        expect(routines_1._rankOfHand([0, 0, 1], fakeHash)).toBe(1);
        expect(routines_1._rankOfHand([1, 2, 2], fakeHash)).toBe(5);
    });
    it('should compute rank of best hand given hash and hand list of 7 cards', function () {
        expect(routines_1._rankOf5onX([0, 0, 0, 1, 2, 1, 0], fakeHash)).toBe(4);
        expect(routines_1._rankOf5onX([1, 1, 1, 1, 1, 1, 2], fakeHash)).toBe(6);
    });
    var tempObj = {
        HASHES: { 3: 3 },
        FLUSH_CHECK_KEYS: {},
        FLUSH_RANK_HASHES: {},
        FLUSH_HASHES: {},
        baseRankValues: [0, 1, 2],
        baseSuitValues: [0, 1, 2],
        rankingInfos: []
    };
    it('fills rank of 5 hi and hi low', function () {
        /* tempObj.rankingInfos[3] = {
           hand: [0, 1],
           faces: "",
           handGroup: ""
         };*/
        expect(routines_1.fillRank5([1, 1, 1], 3, fakeRankingObj).HASHES).toEqual(tempObj.HASHES);
    });
    it('fills rank of 5 hilow: ', function () {
        tempObj.HASHES[5] = 7;
        expect(routines_1.fillRank5_ato5([2, 1, 2], 7, fakeRankingObj).HASHES).toEqual(tempObj.HASHES);
    });
    it('fills with post flush values', function () {
        /*tempObj.rankingInfos[12] = {
          hand: [0, 1],
          faces: "",
          handGroup: ""
        };*/
        tempObj.HASHES[2] = 12;
        expect(routines_1.fillRank5PlusFlushes([1, 1, 0], 2, fakeRankingObj, 10).HASHES).toEqual(tempObj.HASHES);
    });
    it('fills flush ranking', function () {
        tempObj.FLUSH_RANK_HASHES[2] = 5875;
        /*tempObj.rankingInfos[5875] = {
          hand: [0, 1],
          faces: "",
          handGroup: ""
        };*/
        expect(routines_1.fillRankFlushes([1, 1, 0], fakeRankingObj).FLUSH_RANK_HASHES).toEqual(tempObj.FLUSH_RANK_HASHES);
    });
});
//# sourceMappingURL=routines.test.js.map