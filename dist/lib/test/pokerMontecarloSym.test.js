"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokerMontecarloSym_1 = require("../src/pokerMontecarloSym");
var pokerHashes7_1 = require("../src/pokerHashes7");
beforeAll(function () {
    pokerHashes7_1.fastHashesCreators.high();
    /*fastHashesCreators.Ato5();
    fastHashesCreators.Ato6();
    fastHashesCreators.low8();
    fastHashesCreators.low9();
    fastHashesCreators["2to7"]();*/
});
describe('testing montecarlo sym on 7 hand holdem: ', function () {
    it('should return an object of stats: ', function () {
        expect(pokerMontecarloSym_1.getPartialHandStatsIndexed_7([1, 2, 3, 4], 100)).toBeInstanceOf(Object);
        var stats = pokerMontecarloSym_1.getPartialHandStatsIndexed_7([1, 2, 3, 4], 15000);
        expect(stats.average).toBeGreaterThan(5270);
        /**@TODO check why using directly flush rank of 5 the above limit is always 5278 */
        expect(stats.straight).toBeGreaterThan(0.2);
        // console.log(stats);
        var sum = 0;
        for (var s in stats) {
            s !== 'average' ? (sum += stats[s]) : null;
        }
        console.log(sum);
        expect(sum).toBeLessThanOrEqual(1.00000000000001);
    });
    it('should return category by ranking value: ', function () {
        expect(pokerMontecarloSym_1.categoryByRankingValue(1234)).toEqual('high card');
    });
});
//# sourceMappingURL=pokerMontecarloSym.test.js.map