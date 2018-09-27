import * as kombinatoricsJs from 'kombinatoricsjs';
import {
  createRankOfFiveHashes,
  createRankOf5On7Hashes,
  createRankOf5AceToFive_Low8,
  createRankOf5AceToFive_Low9,
  createRankOf5AceToFive_Full,
  createRankOf7AceToFive_Low,
  createRankOf5AceToSix_Full
} from '../src/hashesCreator';
import * as CONSTANTS from '../src/constants';

/**something wrong in length and max rank value---> @TODO verify */
describe('testing rank of 5 and 7 hashes creator', () => {
  let HASHES_OF_FIVE;
  it('has 7462 hands', () => {
    expect((HASHES_OF_FIVE = createRankOfFiveHashes())).toBeTruthy();
    expect(HASHES_OF_FIVE.rankingInfos.length).toBe(7462);
    expect(Object.keys(HASHES_OF_FIVE.HASHES).length).toBe(6175);
    expect(Object.keys(HASHES_OF_FIVE.FLUSH_RANK_HASHES).length).toBe(1287);
  });

  it('has no missings ranking values', () => {
    let found = 0;
    kombinatoricsJs.multiCombinations(CONSTANTS.ranksHashOn5, 5, 4).forEach((h, i) => {
      let k = h[0] + h[1] + h[2] + h[3] + h[4];
      if (!isNaN(HASHES_OF_FIVE.HASHES[k])) {
        found++;
      } else {
        console.log(`missing: ${i} - ${k}`);
      }
    });
    expect(found).toBe(6175);
  });

  it('has no missings flush ranking values', () => {
    let found = 0;
    kombinatoricsJs.multiCombinations(CONSTANTS.ranksHashOn5, 5, 1).forEach((h, i) => {
      let k = h[0] + h[1] + h[2] + h[3] + h[4];
      if (!isNaN(HASHES_OF_FIVE.FLUSH_RANK_HASHES[k])) {
        found++;
      } else {
        console.log(`missing: ${i} - ${k}`);
      }
    });
    expect(found).toBe(1287);
  });

  it('have highest rank 7451', () => {
    let m = 0;
    for (let h in HASHES_OF_FIVE.HASHES) {
      HASHES_OF_FIVE.HASHES[h] > m ? (m = HASHES_OF_FIVE.HASHES[h]) : null;
    }
    console.log(m, HASHES_OF_FIVE.rankingInfos[m]);
    expect(m).toBe(7451);
  });

  it('has highest rank in fluses 7461', () => {
    let m = 0;
    for (let h in HASHES_OF_FIVE.FLUSH_RANK_HASHES) {
      HASHES_OF_FIVE.FLUSH_RANK_HASHES[h] > m ? (m = HASHES_OF_FIVE.FLUSH_RANK_HASHES[h]) : null;
    }
    expect(m).toBe(7461);
  });

  let HASHES_OF_FIVE_ON_SEVEN;
  it('has 7462 hands too', () => {
    expect((HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE))).toBeTruthy();
    expect(HASHES_OF_FIVE_ON_SEVEN.rankingInfos.length).toBe(7462);
  });

  it('has a lot of hands', () => {
    expect(Object.keys(HASHES_OF_FIVE_ON_SEVEN.HASHES).length).toBe(49205);
  });

  it('has a lot of hands for flush too', () => {
    let counter = 0;
    let all5 = [];
    let all6 = [];
    let all7 = [];
    let checkGaps = vector => {
      vector.sort();
      let count = 0;
      let diffsum = 0;
      for (let i = 1; i < vector.length; i++) {
        let diff = Math.abs(vector[i] - vector[i - 1]);
        if (diff !== 1) {
          count++;
          diffsum += diff;
          //console.log(`diff: ${diff} -- ${i} ${vector[i]}-${vector[i - 1]}`);
        }
      }
      return diffsum;
    };
    for (let h in HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[5]) {
      counter++;
      all5.push(HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[5][h]);
    }

    expect(checkGaps(all5)).toBe(313);
    for (let h in HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[6]) {
      counter++;
      all6.push(HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[6][h]);
    }

    expect(checkGaps(all6)).toBe(326);
    for (let h in HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[7]) {
      counter++;
      all7.push(HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES[7][h]);
    }

    expect(checkGaps(all7)).toBe(349);

    expect(counter).toBe(4719);
  });
});

describe('testing hash of low Ato5: ', () => {
  let HASHES_OF_LOW8_on5;
  it('low8 hash 56 hands', () => {
    expect((HASHES_OF_LOW8_on5 = createRankOf5AceToFive_Low8())).toBeTruthy();
    expect(HASHES_OF_LOW8_on5.rankingInfos.length).toBe(56);
  });

  let HASHES_OF_LOW9_on5;
  it('low8 hash 56 hands', () => {
    expect((HASHES_OF_LOW9_on5 = createRankOf5AceToFive_Low9())).toBeTruthy();
    expect(HASHES_OF_LOW9_on5.rankingInfos.length).toBe(126);
  });

  it('creates all ace to five ranking: ', () => {
    let HASHES_OF_LOW_on5;
    expect((HASHES_OF_LOW_on5 = createRankOf5AceToFive_Full())).toBeTruthy();
    expect(HASHES_OF_LOW_on5.rankingInfos.length).toBe(6175);
  });

  it('creates hash low8 for 7 cards hand', () => {
    let HASHES_OF_LOW_on7;
    expect(
      (HASHES_OF_LOW_on7 = createRankOf7AceToFive_Low(HASHES_OF_LOW8_on5, CONSTANTS.rankCards))
    ).toBeTruthy();
  });
});

describe('testing hash of low ace to six', () => {
  let HASHESATo6;
  expect((HASHESATo6 = createRankOf5AceToSix_Full())).toBeTruthy();
  expect(HASHESATo6.rankingInfos.length).toBe(7462);
  expect(Object.keys(HASHESATo6.HASHES).length).toBe(6175);
  expect(Object.keys(HASHESATo6.FLUSH_RANK_HASHES).length).toBe(1287);
});
