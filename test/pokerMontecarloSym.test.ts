import { getPartialHandStatsIndexed_7, categoryByRankingValue } from '../src/pokerMontecarloSym';

describe('testing montecarlo sym on 7 hand holdem: ', () => {
  it('should return an object of stats: ', () => {
    expect(getPartialHandStatsIndexed_7([1, 2, 3, 4], 100)).toBeInstanceOf(Object);
    let stats = getPartialHandStatsIndexed_7([1, 2, 3, 4], 1000);
    expect(stats.average).toBeGreaterThan(5500);
    expect(stats.straight).toBeGreaterThan(0.2);
    console.log(stats);
    let sum = 0;
    for (let s in stats) {
      s !== 'average' ? (sum += stats[s]) : null;
    }
    console.log(sum);
    expect(sum).toBeLessThanOrEqual(1.00000000000001);
  });

  it('should return category by ranking value: ', () => {
    expect(categoryByRankingValue(1234)).toEqual('high card');
  });
});
