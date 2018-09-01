import { createRankOfFiveHashes, createRankOf5On7Hashes } from '../src/hashesCreator';

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
    expect(counter).toBe(48347);
  });

  it('has a lot of hands for flush too', () => {
    let counter = 0;
    for (let h in HASHES_OF_FIVE_ON_SEVEN.FLUSH_RANK_HASHES) {
      counter++;
    }
    expect(counter).toBe(3003);
  });
});
