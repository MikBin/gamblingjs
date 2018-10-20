"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluator7_1 = require("../src/pokerEvaluator7");
var pokerHashes7_1 = require("../src/pokerHashes7");
var pokerHashes7_2 = require("../src/pokerHashes7");
var constants_1 = require("../src/constants");
/** @TODO make a describe for non fastHashes and one for the fast one that includes the beforeAll
 * use same data for both
 * fill with test cases where slow bf version have to equal the fast one
 */
beforeAll(function () {
    pokerHashes7_1.fastHashesCreators.high();
    pokerHashes7_1.fastHashesCreators.Ato5();
    pokerHashes7_1.fastHashesCreators.Ato6();
    pokerHashes7_1.fastHashesCreators.low8();
    pokerHashes7_1.fastHashesCreators.low9();
    pokerHashes7_1.fastHashesCreators["2to7"]();
});
describe('testing hilo 8 and 9 on SEVEN cards', function () {
    it("hand strong for high but weak for low 8", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow8(constants_1.fullCardsDeckHash_7[6], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 6898, low: 3 });
    });
    it("hand strong for high but weak for low9 using general hilow eval", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow(pokerHashes7_2.HASHES_OF_SEVEN_LOW9.HASHES, constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 6903, low: 38 });
    });
    it("hand strong for high not qualified low8 using general hilow eval", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow(pokerHashes7_2.HASHES_OF_SEVEN_LOW8.HASHES, constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 6903, low: -1 });
    });
    it("hand strong for high not qualified low8 using general hilow eval", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow(pokerHashes7_2.HASHES_OF_SEVEN_LOW8.HASHES, constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[18], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[29], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 5813, low: -1 });
    });
    it("hand strong for high but weak for low9 using general hilow eval", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow(pokerHashes7_2.HASHES_OF_SEVEN_LOW9.HASHES, constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[9], constants_1.fullCardsDeckHash_7[2], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[11])).toEqual({ hi: 7038, low: 35 });
    });
    it("hand strong for high but weak for low handOfSevenEvalHiLow8", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow8(constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 6903, low: -1 });
    });
    it("hand strong for high not qualified low8 handOfSevenEvalHiLow8Indexed", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow8Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: -1 });
    });
    it("hand strong for high not qualified low8 _handOfSevenEvalHiLow8Indexed (slow one)", function () {
        expect(pokerEvaluator7_1._handOfSevenEvalHiLow8Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: -1 });
    });
    it("hand strong for high but weak for low handOfSevenEvalHiLow9", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow9(constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[5], constants_1.fullCardsDeckHash_7[4], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[25], constants_1.fullCardsDeckHash_7[38])).toEqual({ hi: 6903, low: 38 });
    });
    it("hand strong for high but weak for low handOfSevenEvalHiLow9Indexed", function () {
        expect(pokerEvaluator7_1.handOfSevenEvalHiLow9Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: 38 });
    });
    it("hand strong for high but weak for low _handOfSevenEvalHiLow9Indexed (slow one)", function () {
        expect(pokerEvaluator7_1._handOfSevenEvalHiLow9Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: 38 });
    });
});
describe("Ato5 on SEVEN fast and slow", function () {
    it('handOfSevenEvalLow_Ato5 has max on 6174 and min on 168', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow_Ato5(constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[10], constants_1.fullCardsDeckHash_7[10], constants_1.fullCardsDeckHash_7[10])).toBe(168);
    });
    it('handOfSevenEvalLow_Ato5 has max on 6174 and min on 168', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow_Ato5Indexed(11, 11, 11, 11, 10, 10, 10)).toBe(168);
    });
    it('handOfSevenEvalLow_Ato5 has max on 6174 and min on 168', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow_Ato5Indexed(12, 0, 1, 2, 16, 29, 42)).toBe(6174);
    });
    it('_handOfSevenEvalLow_Ato5 has max on 6174 and min on 168 in slow version too ', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalLow_Ato5Indexed(11, 11, 11, 11, 10, 10, 10)).toBe(168);
    });
    it('_handOfSevenEvalLow_Ato5 has max on 6174 and min on 168 in slow version too', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalLow_Ato5Indexed(12, 0, 1, 2, 16, 29, 42)).toBe(6174);
    });
    it('handOfSevenEvalLow_Ato5 has max on 6174 and min on 168', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow_Ato5(constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[0], constants_1.fullCardsDeckHash_7[1], constants_1.fullCardsDeckHash_7[2], constants_1.fullCardsDeckHash_7[16], constants_1.fullCardsDeckHash_7[29], constants_1.fullCardsDeckHash_7[42])).toBe(6174);
    });
});
describe('Ato6  on SEVEN', function () {
    it('on seven cards the lowest is a full house, since straight flush is not possible', function () {
        expect(pokerEvaluator7_1.handOfSevenEval_Ato6(constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[24], constants_1.fullCardsDeckHash_7[37], constants_1.fullCardsDeckHash_7[50], constants_1.fullCardsDeckHash_7[10], constants_1.fullCardsDeckHash_7[23], constants_1.fullCardsDeckHash_7[36])).toBe(177);
    });
    it('handOfSevenEval_Ato6Indexed in seven eval straight flush is not possible', function () {
        expect(pokerEvaluator7_1.handOfSevenEval_Ato6Indexed(11, 10, 9, 8, 7, 6, 5)).toBe(934);
    });
    it(' _handOfSevenEval_Ato6Indexed in seven eval straight flush is not possible', function () {
        expect(pokerEvaluator7_1._handOfSevenEval_Ato6Indexed(11, 10, 9, 8, 7, 6, 5)).toBe(934);
    });
});
describe('2to7  on SEVEN', function () {
    it('top straight flush cannot exist in 7 eval as the minimum is KJT98 ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLowBall27(constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[11], constants_1.fullCardsDeckHash_7[10], constants_1.fullCardsDeckHash_7[9], constants_1.fullCardsDeckHash_7[8], constants_1.fullCardsDeckHash_7[7], constants_1.fullCardsDeckHash_7[6])).toBe(339);
    });
    it('handOfSevenEvalLowBall27Indexed top straight flush cannot exist in 7 eval as the minimum is KJT98 ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLowBall27Indexed(12, 11, 10, 9, 8, 7, 6)).toBe(339);
    });
    it('handOfSevenEvalLowBall27Indexed 23458 is the second absolute best hand ranked 7460', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLowBall27Indexed(0, 1, 2, 3, 4, 23, 45)).toBe(7460);
    });
    it('handOfSevenEvalLowBall27Indexed 23457 is the absolute best hand', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLowBall27Indexed(0, 1, 2, 3, 4, 23, 44)).toBe(7461);
    });
    it('_handOfSevenEvalLowBall27Indexed top straight flush cannot exist in 7 eval as the minimum is KJT98', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalLowBall27Indexed(12, 11, 10, 9, 8, 7, 6)).toBe(339);
    });
    it('_handOfSevenEvalLowBall27Indexed 23458 is the second absolute best hand ranked 7460', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalLowBall27Indexed(0, 1, 2, 3, 4, 23, 45)).toBe(7460);
    });
    it('_handOfSevenEvalLowBall27Indexed 23457 is the absolute best hand', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalLowBall27Indexed(0, 1, 2, 3, 4, 23, 44)).toBe(7461);
    });
});
describe('testing hand of seven eval', function () {
    it('A2345+J7 suited rank should be 7452', function () {
        expect(pokerEvaluator7_1.handOfSevenEval(constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[0], constants_1.fullCardsDeckHash_7[1], constants_1.fullCardsDeckHash_7[2], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[21], constants_1.fullCardsDeckHash_7[17])).toBe(7452);
    });
    it('A2345+J7 suited rank should be 7452 in indexed eval too', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed(17, 3, 1, 2, 0, 21, 12)).toBe(7452);
    });
    it('A2345+J7 suited rank should be 7452 in slow bruteforce eval too', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalIndexed(17, 3, 1, 2, 0, 21, 12)).toBe(7452);
    });
    it('has 10 straights in right order ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed(12, 0, 14, 15, 29, 44, 25)).toBe(5853);
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed(12, 0, 14, 15, 29, 50, 30)).toBe(5854);
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed(31, 50, 14, 15, 29, 44, 30)).toBe(5855);
    });
    it('has 10 straights in right order in slow brute force eval too ', function () {
        expect(pokerEvaluator7_1._handOfSevenEvalIndexed(12, 0, 14, 15, 29, 44, 25)).toBe(5853);
        expect(pokerEvaluator7_1._handOfSevenEvalIndexed(12, 0, 14, 15, 29, 50, 30)).toBe(5854);
        expect(pokerEvaluator7_1._handOfSevenEvalIndexed(31, 50, 14, 15, 29, 44, 30)).toBe(5855);
    });
});
/**
 *
 * SEVEN EVAL VERBOSE
 *
 */
describe('testing handOfSevenEval_Verbose and hand infos: ', function () {
    it('should get one pair category: ', function () {
        expect(pokerEvaluator7_1.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[15], constants_1.fullCardsDeckHash_7[1], constants_1.fullCardsDeckHash_7[2], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[21], constants_1.fullCardsDeckHash_7[17])).toEqual({
            handRank: 1874,
            hand: [2, 2, 4, 8, 12],
            faces: '446TA',
            handGroup: 'one pair',
            winningCards: [12, 15, 2, 21, 17],
            flushSuit: 'no flush'
        });
    });
    it('should get same results in indexed version: ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed_Verbose(12, 15, 1, 2, 3, 10, 17)).toEqual({
            handRank: 6389,
            hand: [1, 2, 3, 10, 12],
            faces: '345QA',
            handGroup: 'flush',
            winningCards: [12, 1, 2, 3, 10],
            flushSuit: 'spades'
        });
    });
    it('should get flush category: ', function () {
        expect(pokerEvaluator7_1.handOfSevenEval_Verbose(constants_1.fullCardsDeckHash_7[12], constants_1.fullCardsDeckHash_7[15], constants_1.fullCardsDeckHash_7[1], constants_1.fullCardsDeckHash_7[2], constants_1.fullCardsDeckHash_7[3], constants_1.fullCardsDeckHash_7[10], constants_1.fullCardsDeckHash_7[17])).toEqual({
            handRank: 6389,
            hand: [1, 2, 3, 10, 12],
            faces: '345QA',
            handGroup: 'flush',
            winningCards: [12, 1, 2, 3, 10],
            flushSuit: 'spades'
        });
    });
    it('should get same results in indexed version: ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed_Verbose(12, 15, 1, 2, 3, 21, 17)).toEqual({
            handRank: 1874,
            hand: [2, 2, 4, 8, 12],
            faces: '446TA',
            handGroup: 'one pair',
            winningCards: [12, 15, 2, 21, 17],
            flushSuit: 'no flush'
        });
        expect(pokerEvaluator7_1.handOfSevenEvalIndexed_Verbose(0, 1, 2, 3, 18, 19, 20)).toEqual({
            faces: '45789',
            flushSuit: 'no flush',
            hand: [2, 3, 5, 6, 7],
            handGroup: 'high card',
            handRank: 849,
            winningCards: [2, 3, 18, 19, 20]
        });
    });
    it('should evaluate verbose Ato5', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalAto5Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
            faces: '65432',
            flushSuit: 'no flush',
            hand: [4, 3, 2, 1, 0],
            handGroup: 'high card',
            handRank: 6169,
            winningCards: [0, 1, 2, 3, 4]
        });
    });
    it('should evaluate verbose Ato5 low 8', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow8Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
            faces: '65432',
            flushSuit: 'no flush',
            hand: [4, 3, 2, 1, 0],
            handGroup: 'high card',
            handRank: 50,
            winningCards: [0, 1, 2, 3, 4]
        });
    });
    it('should evaluate verbose Ato5 low 8-- hand doesnt qualify for low8', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow8Indexed_Verbose(0, 11, 23, 24, 4, 36, 45)).toEqual({
            faces: '2KQK6Q8',
            flushSuit: 'unqualified',
            hand: [],
            handGroup: 'unqualified',
            handRank: -1,
            winningCards: []
        });
    });
    it('should evaluate verbose Ato5 low 9', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow9Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
            faces: '65432',
            flushSuit: 'no flush',
            hand: [4, 3, 2, 1, 0],
            handGroup: 'high card',
            handRank: 120,
            winningCards: [0, 1, 2, 3, 4]
        });
    });
    it('should evaluate verbose Ato5 low 9-- hand doesnt qualify for low9', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLow9Indexed_Verbose(0, 11, 23, 24, 4, 36, 45)).toEqual({
            faces: '2KQK6Q8',
            flushSuit: 'unqualified',
            hand: [],
            handGroup: 'unqualified',
            handRank: -1,
            winningCards: []
        });
    });
    it('should evaluate verbose lowball 2-7 on seven cards', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalLowBall27Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
            faces: '23458',
            flushSuit: 'no flush',
            hand: [0, 1, 2, 3, 6],
            handGroup: 'high card',
            handRank: 7460,
            winningCards: [0, 1, 2, 3, 45]
        });
    });
    it('should evaluate Ato6 verbose on seven: ', function () {
        expect(pokerEvaluator7_1.handOfSevenEvalAto6Indexed_Verbose(11, 24, 37, 50, 10, 23, 36)).toEqual({
            faces: 'QQQKK',
            flushSuit: 'no flush',
            hand: [10, 10, 10, 11, 11],
            handGroup: 'high card',
            handRank: 177,
            winningCards: [11, 24, 10, 23, 36]
        });
    });
    /**@TODO verbose from lowball Ato6 and from two sets */
});
//# sourceMappingURL=pokerEvaluator7.test.js.map