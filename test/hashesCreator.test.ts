import {
  createRankOfFiveHashes,
  createRankOf5On7Hashes,
  createRankOf5AceToFive_Low8,
  createRankOf5AceToFive_Low9,
  createRankOf5AceToFive_Full,
  createRankOf7AceToFive_Low
} from '../src/hashesCreator';
import * as CONSTANTS from '../src/constants';

/**something wrong in length and max rank value---> @TODO verify */
describe('testing rank of 5 and 7 hashes creator', () => {
  let HASHES_OF_FIVE;
  it('has 7462 hands', () => {
    expect((HASHES_OF_FIVE = createRankOfFiveHashes())).toBeTruthy();
    expect(HASHES_OF_FIVE.rankingInfos.length).toBe(7462);
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
    let counter = 0;
    for (let h in HASHES_OF_FIVE_ON_SEVEN.HASHES) {
      counter++;
    }
    expect(counter).toBe(49205);
  });

  it('has a lot of hands for flush too', () => {
    let counter = 0;
    for (let h in HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES) {
      counter++;
    }
    expect(counter).toBe(3003);
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
