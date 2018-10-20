"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluator5_1 = require("../src/pokerEvaluator5");
var pokerHashes5_1 = require("../src/pokerHashes5");
var constants_1 = require("../src/constants");
describe("best of five on X", function () {
    it('get best hand of 5 card on 7 (brute force version)', function () {
        expect(pokerEvaluator5_1.bfBestOfFiveOnX([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[0],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[38]
        ])).toBe(7452);
    });
    expect(pokerEvaluator5_1.bfBestOfFiveOnXindexed([12, 0, 1, 2, 3, 25, 38])).toBe(7452);
});
describe('testing hand of five eval', function () {
    it('A2345 suited rank should be 7452', function () {
        expect(pokerEvaluator5_1.handOfFiveEval(constants_1.fullCardsDeckHash_5[12], constants_1.fullCardsDeckHash_5[0], constants_1.fullCardsDeckHash_5[1], constants_1.fullCardsDeckHash_5[2], constants_1.fullCardsDeckHash_5[3])).toBe(7452);
    });
    it('23457 unsuited rank should be 0', function () {
        expect(pokerEvaluator5_1.handOfFiveEval(constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[13], constants_1.fullCardsDeckHash_5[1], constants_1.fullCardsDeckHash_5[2], constants_1.fullCardsDeckHash_5[3])).toBe(0);
    });
    it('indexed eval have lowest hand as 0 rank and highest 7452', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalIndexed(0, 1, 2, 3, 18)).toBe(0);
        expect(pokerEvaluator5_1.handOfFiveEvalIndexed(13, 14, 15, 16, 31)).toBe(0);
        expect(pokerEvaluator5_1.handOfFiveEvalIndexed(25, 13, 14, 15, 16)).toBe(7452);
    });
    /**test all ranks and all flush by making a sequence
     * kombinatoricsJs.multiCombinations(ranks,5,4).evaluate().sort() must equal all ranks hash
     */
});
describe('testing hilo 8 and 9 routines: ', function () {
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow8(constants_1.fullCardsDeckHash_5[12], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10], constants_1.fullCardsDeckHash_5[9], constants_1.fullCardsDeckHash_5[8])).toEqual({ hi: 7461, low: -1 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow(pokerHashes5_1.HASHES_OF_FIVE_LOW8.HASHES, constants_1.fullCardsDeckHash_5[12], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10], constants_1.fullCardsDeckHash_5[9], constants_1.fullCardsDeckHash_5[8])).toEqual({ hi: 7461, low: -1 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow8(constants_1.fullCardsDeckHash_5[6], constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[4], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[2])).toEqual({ hi: 7455, low: 0 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow8(constants_1.fullCardsDeckHash_5[6], constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[4], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[12])).toEqual({ hi: 6898, low: 3 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow8(constants_1.fullCardsDeckHash_5[7], constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[4], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[12])).toEqual({ hi: 6903, low: -1 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow8Indexed(7, 5, 4, 3, 12)).toEqual({ hi: 6903, low: -1 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow9(constants_1.fullCardsDeckHash_5[7], constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[4], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[12])).toEqual({ hi: 6903, low: 38 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow9Indexed(7, 5, 4, 3, 12)).toEqual({ hi: 6903, low: 38 });
    expect(pokerEvaluator5_1.handOfFiveEvalHiLow(pokerHashes5_1.HASHES_OF_FIVE_LOW9.HASHES, constants_1.fullCardsDeckHash_5[7], constants_1.fullCardsDeckHash_5[5], constants_1.fullCardsDeckHash_5[4], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[12])).toEqual({ hi: 6903, low: 38 });
});
describe('ace to five lowball: ', function () {
    it('on five cards have max on 6174 and min on 0', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5(constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10])).toBe(0);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5(constants_1.fullCardsDeckHash_5[7], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10], constants_1.fullCardsDeckHash_5[9], constants_1.fullCardsDeckHash_5[8])).toBe(4888);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5(constants_1.fullCardsDeckHash_5[12], constants_1.fullCardsDeckHash_5[0], constants_1.fullCardsDeckHash_5[1], constants_1.fullCardsDeckHash_5[2], constants_1.fullCardsDeckHash_5[3])).toBe(6174);
    });
    it('ace to five lowball full have ranks inverted', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 9, 0)).toBe(1311);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 9, 12)).toBe(1312);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 8, 0)).toBe(2310);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 8, 12)).toBe(2311);
    });
});
describe('testing ace to six lowball ', function () {
    it('has lowest rank for straightflushes', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6(constants_1.fullCardsDeckHash_5[7], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10], constants_1.fullCardsDeckHash_5[9], constants_1.fullCardsDeckHash_5[8])).toBe(0);
    });
    it('top straight flush is not the lowest as the ace is low and doesnt makeup to a straight', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(12, 8, 9, 10, 11)).toBe(328);
    });
    it('the following of the above has a deuce instead of the ace', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(0, 8, 9, 10, 11)).toBe(327);
    });
    it('same holds for high cards equivalent of above flushes', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(25, 8, 9, 10, 11)).toBe(6191);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(13, 8, 9, 10, 11)).toBe(6190);
    });
    it('has best hand a2346 not suited, while suited one is bad', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(25, 0, 1, 2, 4)).toBe(7461);
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(12, 0, 1, 2, 4)).toBe(1598);
    });
    it('a2345 is bad hand', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLow_Ato6Indexed(25, 0, 1, 2, 3)).toBe(1607);
    });
});
describe('testing LowBall27: ', function () {
    it('top straight flush is the lowest in five eval', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLowBall27(constants_1.fullCardsDeckHash_5[12], constants_1.fullCardsDeckHash_5[11], constants_1.fullCardsDeckHash_5[10], constants_1.fullCardsDeckHash_5[9], constants_1.fullCardsDeckHash_5[8])).toBe(0);
        expect(pokerEvaluator5_1.handOfFiveEvalLowBall27Indexed(12, 11, 10, 9, 8)).toBe(0);
    });
    it('2 to 7 is the highest', function () {
        expect(pokerEvaluator5_1.handOfFiveEvalLowBall27(constants_1.fullCardsDeckHash_5[0], constants_1.fullCardsDeckHash_5[1], constants_1.fullCardsDeckHash_5[2], constants_1.fullCardsDeckHash_5[3], constants_1.fullCardsDeckHash_5[18])).toBe(7461);
        expect(pokerEvaluator5_1.handOfFiveEvalLowBall27Indexed(0, 1, 2, 3, 18)).toBe(7461);
    });
});
describe('test hand info: ', function () {
    /**@TODO one assertion for each test case
     * extend test to all hand groups
    */
    it('should get some infos: ', function () {
        expect(pokerEvaluator5_1.getHandInfo(2345)).toBeInstanceOf(Object);
        expect(pokerEvaluator5_1.getHandInfo(2345)).toEqual({
            hand: [4, 4, 6, 7, 11],
            faces: '6689K',
            handGroup: 'one pair'
        });
        expect(pokerEvaluator5_1.getHandInfo27(7461)).toEqual({
            hand: [0, 1, 2, 3, 5],
            faces: '23457',
            handGroup: 'high card'
        });
        expect(pokerEvaluator5_1.getHandInfoAto5(0)).toEqual({
            hand: [11, 11, 11, 11, 10],
            faces: 'KKKKQ',
            handGroup: 'four of a kind'
        });
        expect(pokerEvaluator5_1.getHandInfoAto5(6174)).toEqual({
            hand: [3, 2, 1, 0, 12],
            faces: '5432A',
            handGroup: 'high card'
        });
        expect(pokerEvaluator5_1.getHandInfoAto6(6174)).toEqual({
            faces: 'AA654',
            hand: [12, 12, 4, 3, 2],
            handGroup: 'one pair'
        });
        expect(pokerEvaluator5_1.getHandInfoAto6(7461)).toEqual({
            hand: [4, 2, 1, 0, 12],
            faces: '6432A',
            handGroup: 'high card'
        });
    });
    it("get info on low8 on five cards: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow8(28)).toEqual({
            hand: [6, 4, 2, 0, 12],
            faces: '8642A',
            handGroup: 'high card'
        });
    });
    it("get no hand defined for that rank: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow8(88)).toEqual({
            hand: [],
            faces: '',
            handGroup: 'unqualified'
        });
    });
    it("get info on low9 on five cards: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow9(28)).toEqual({
            hand: [7, 6, 3, 1, 0],
            faces: '98532',
            handGroup: 'high card'
        });
    });
    it("get info on low8 on five cards for best hand possible: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow8(55)).toEqual({
            hand: [3, 2, 1, 0, 12],
            faces: '5432A',
            handGroup: 'high card'
        });
    });
    it("get info on low9 on five cards for best hand possible: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow9(125)).toEqual({
            hand: [3, 2, 1, 0, 12],
            faces: '5432A',
            handGroup: 'high card'
        });
    });
    it("in low9 get no hand defined for that rank: ", function () {
        expect(pokerEvaluator5_1.getHandInfoLow9(588)).toEqual({
            hand: [],
            faces: '',
            handGroup: 'unqualified'
        });
    });
});
//# sourceMappingURL=pokerEvaluator5.test.js.map