"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerEvaluator6_1 = require("../src/pokerEvaluator6");
describe('testing hand of six eval', function () {
    it('checks hand of six eval: ', function () {
        expect(pokerEvaluator6_1.handOfSixEvalIndexed(3, 23, 4, 45, 27, 7)).toBe(1053);
        expect(pokerEvaluator6_1.handOfSixEvalIndexed(0, 1, 2, 3, 18, 19)).toBe(500);
    });
    it('checks hand of six eval indexed lowball 2-7', function () {
        expect(pokerEvaluator6_1.handOfSixEvalLowBall27Indexed(13, 1, 2, 3, 4, 5)).toBe(7461);
    });
    it('checks hand of six eval indexed Ato5 ', function () {
        expect(pokerEvaluator6_1.handOfSixEvalAto5Indexed(12, 1, 2, 3, 4, 5)).toBe(6170);
        expect(pokerEvaluator6_1.handOfSixEvalAto5Indexed(12, 0, 1, 2, 3, 4)).toBe(6174);
    });
    it('checks hand of six eval indexed Ato6 ', function () {
        expect(pokerEvaluator6_1.handOfSixEvalAto6Indexed(12, 1, 2, 3, 4, 5)).toBe(1595);
        expect(pokerEvaluator6_1.handOfSixEvalAto6Indexed(25, 1, 2, 3, 4, 5)).toBe(7458);
        expect(pokerEvaluator6_1.handOfSixEvalAto6Indexed(12, 0, 1, 2, 3, 4)).toBe(1598);
    });
    it('check handOfSixEvalHiLow8Indexed: ', function () {
        expect(pokerEvaluator6_1.handOfSixEvalHiLow8Indexed(12, 1, 2, 3, 4, 5)).toEqual({
            hi: 7454,
            low: 51
        });
    });
    it('check handOfSixEvalHiLow9Indexed: ', function () {
        expect(pokerEvaluator6_1.handOfSixEvalHiLow9Indexed(9, 1, 2, 3, 4, 7)).toEqual({
            hi: 6698,
            low: 55
        });
    });
});
//# sourceMappingURL=pokerEvaluator6.test.js.map