"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluatorTwoSets_1 = require("../src/pokerEvaluatorTwoSets");
var pokerEvaluator5_1 = require("../src/pokerEvaluator5");
var constants_1 = require("../src/constants");
describe('bfBestOfFiveFromTwoSets', function () {
    it('gets fullhouse when flush exists on omaha like 4-5', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSets([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[3],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[35],
            constants_1.fullCardsDeckHash_5[22],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[4],
            constants_1.fullCardsDeckHash_5[7]
        ], 2, 3)).toBeGreaterThan(7139);
    });
    it('throw range error', function () {
        expect(function () {
            pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSets([
                constants_1.fullCardsDeckHash_5[12],
                constants_1.fullCardsDeckHash_5[3],
                constants_1.fullCardsDeckHash_5[25],
                constants_1.fullCardsDeckHash_5[36]
            ], [
                constants_1.fullCardsDeckHash_5[35],
                constants_1.fullCardsDeckHash_5[22],
                constants_1.fullCardsDeckHash_5[9],
                constants_1.fullCardsDeckHash_5[4],
                constants_1.fullCardsDeckHash_5[7]
            ], 3, 4);
        }).toThrowError('sum of nA+nB parameters MUST be 5');
    });
    it('throw range error', function () {
        expect(function () {
            pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLow_Ato6([
                constants_1.fullCardsDeckHash_5[12],
                constants_1.fullCardsDeckHash_5[3],
                constants_1.fullCardsDeckHash_5[25],
                constants_1.fullCardsDeckHash_5[36]
            ], [
                constants_1.fullCardsDeckHash_5[35],
                constants_1.fullCardsDeckHash_5[22],
                constants_1.fullCardsDeckHash_5[9],
                constants_1.fullCardsDeckHash_5[4],
                constants_1.fullCardsDeckHash_5[7]
            ], 3, 4);
        }).toThrowError('sum of nA+nB parameters MUST be 5');
    });
    it('throw range error', function () {
        expect(function () {
            pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow([
                constants_1.fullCardsDeckHash_5[12],
                constants_1.fullCardsDeckHash_5[3],
                constants_1.fullCardsDeckHash_5[25],
                constants_1.fullCardsDeckHash_5[36]
            ], [
                constants_1.fullCardsDeckHash_5[35],
                constants_1.fullCardsDeckHash_5[22],
                constants_1.fullCardsDeckHash_5[9],
                constants_1.fullCardsDeckHash_5[4],
                constants_1.fullCardsDeckHash_5[7]
            ], 3, 4, pokerEvaluator5_1.handOfFiveEvalHiLow8);
        }).toThrowError('sum of nA+nB parameters MUST be 5');
    });
    it('gets quads when flush exists on omaha like 4-5', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSets([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[3],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[4],
            constants_1.fullCardsDeckHash_5[7]
        ], 2, 3)).toBeGreaterThan(7295);
    });
    it('bfBestOfFiveFromTwoSetsHiLow no low and quads of aces', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[3],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[4],
            constants_1.fullCardsDeckHash_5[7]
        ], 2, 3, pokerEvaluator5_1.handOfFiveEvalHiLow8)).toEqual({ hi: 7449, low: -1 });
    });
    it('bfBestOfFiveFromTwoSetsHiLow8 no low and quads of aces', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow8([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[3],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[4],
            constants_1.fullCardsDeckHash_5[7]
        ], 2, 3)).toEqual({ hi: 7449, low: -1 });
    });
    it('bfBestOfFiveFromTwoSetsHiLow8 a straight flush wheel', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow8([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[0],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3]
        ], 2, 3)).toEqual({ hi: 7452, low: 55 });
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow8Indexed([12, 25, 0, 36], [1, 2, 3, 38, 51], 2, 3)).toEqual({
            hi: 7452,
            low: 55
        });
    });
    it('bfBestOfFiveFromTwoSetsHiLow9 a straight flush wheel', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow9([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[0],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3]
        ], 2, 3)).toEqual({ hi: 7452, low: 125 });
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow9Indexed([12, 25, 0, 36], [1, 2, 3, 38, 51], 2, 3)).toEqual({
            hi: 7452,
            low: 125
        });
    });
    it('bfBestOfFiveFromTwoSetsHiLow_Ato5 a straight flush wheel', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow_Ato5([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[0],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3]
        ], 2, 3)).toBe(6174);
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed([12, 25, 36, 0], [1, 3, 2, 38, 51], 2, 3)).toBe(6174);
    });
    it('bfBestOfFiveFromTwoSetsLow_Ato6 the only A to 6 available is a flush so its not the best hand', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLow_Ato6([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[0],
            constants_1.fullCardsDeckHash_5[50],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[4]
        ], 2, 3)).toBe(7006);
    });
    it('bfBestOfFiveFromTwoSetsLow_Ato6 top hand is A 2 3 4 6', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLow_Ato6Indexed([12, 0, 26, 36], [38, 51, 1, 2, 4], 2, 3)).toBe(7461);
    });
    it('bfBestOfFiveFromTwoSetsHiLow_Ato5 a  wheel ranks highest at 6174', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsHiLow_Ato5([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[13],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[36]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3]
        ], 2, 3)).toBe(6174);
    });
    it('bfBestOfFiveFromTwoSetsLowBall27 counts flush and straights as bad hand as well as ACES', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLowBall27([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[11],
            constants_1.fullCardsDeckHash_5[24]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[51],
            constants_1.fullCardsDeckHash_5[10],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[8]
        ], 2, 3)).toBe(3548);
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLowBall27Indexed([12, 25, 11, 24], [10, 9, 8, 38, 51], 2, 3)).toBe(3548);
    });
    it('bfBestOfFiveFromTwoSetsLowBall27 has best hand 2-7 unsuited 7461', function () {
        expect(pokerEvaluatorTwoSets_1.bfBestOfFiveFromTwoSetsLowBall27([
            constants_1.fullCardsDeckHash_5[12],
            constants_1.fullCardsDeckHash_5[13],
            constants_1.fullCardsDeckHash_5[25],
            constants_1.fullCardsDeckHash_5[5]
        ], [
            constants_1.fullCardsDeckHash_5[38],
            constants_1.fullCardsDeckHash_5[9],
            constants_1.fullCardsDeckHash_5[1],
            constants_1.fullCardsDeckHash_5[2],
            constants_1.fullCardsDeckHash_5[3]
        ], 2, 3)).toBe(7461);
    });
});
//# sourceMappingURL=pokerEvaluatorTwoSets.test.js.map