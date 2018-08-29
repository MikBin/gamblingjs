import {
  atLeast5Eq,
  getVectorSum,
  getFlushSuit7,
  checkStraight5on7,
  singlePairsList,
  sortedPairsToAdd,
  doublePairsList,
  trisList,
  fullHouseList,
  quadsList,
  checkStraight,
  checkDoublePair,
  removeStraights,
  _rankOfHand,
  _rankOf5onX,
  fillRank5,
  fillRank5PlusFlushes,
  internalDoublePairsSort
} from '../src/routines';
import { NumberMap, hashRanking } from '../src/interfaces';

describe('testing basic routines', () => {
  it('returns the only element with 5 equals', () => {
    expect(atLeast5Eq([[2, 3, 1, 1, 1, 1, 1, 5], [1, 1, 1, 1]])).toEqual([
      [2, 3, 1, 1, 1, 1, 1, 5]
    ]);
  });
  it('sums all numbers', () => {
    expect(getVectorSum([2, 3, 1, 1, 1, 1, 1, 5])).toEqual(15);
  });

  it('gets sum suits on 7', () => {
    expect(getFlushSuit7([1, 2, 3, 2, 2, 2, 2])).toEqual(2);
  });

  it('false when no straight is passed', () => {
    expect(checkStraight5on7([1, 2, 3, 2, 2, 2, 2])).toEqual(false);
  });

  it('true when  straight is passed', () => {
    expect(checkStraight5on7([0, 1, 2, 2, 3, 8, 12])).toEqual(true);
  });

  it('to create single pairs from simple combinations set', () => {
    expect(singlePairsList([0, 1, 2, 3])).toEqual([
      [0, 0, 1, 2, 3],
      [1, 1, 0, 2, 3],
      [2, 2, 0, 1, 3],
      [3, 3, 0, 1, 2]
    ]);
  });

  it('to create single sorted pairs from simple combinations set', () => {
    expect(sortedPairsToAdd([0, 1, 2, 3])).toEqual([
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 0],
      [3, 1],
      [3, 2]
    ]);
  });

  it('creates a sorted list of double pairs', () => {
    expect(doublePairsList([0, 1, 2])).toEqual([[1, 1, 0, 0, 2], [2, 2, 0, 0, 1], [2, 2, 1, 1, 0]]);
  });

  it('creates sorted triples list', () => {
    expect(trisList([0, 1, 2])).toEqual([[0, 0, 0, 2, 1], [1, 1, 1, 2, 0], [2, 2, 2, 1, 0]]);
  });

  it('creates sorted fullhouses list', () => {
    expect(fullHouseList([0, 1, 2])).toEqual([
      [0, 0, 0, 1, 1],
      [0, 0, 0, 2, 2],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 2, 2],
      [2, 2, 2, 0, 0],
      [2, 2, 2, 1, 1]
    ]);
  });

  it('creates sorted four of a kind list', () => {
    expect(quadsList([0, 1, 2])).toEqual([
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 2],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 2],
      [2, 2, 2, 2, 0],
      [2, 2, 2, 2, 1]
    ]);
  });

  it('return true if its a straight, false otherwise', () => {
    expect(checkStraight([0, 1, 2, 3, 12])).toBe(true);
    expect(checkStraight([0, 1, 2, 3, 4])).toBe(true);
    expect(checkStraight([0, 1, 2, 3, 7])).toBe(false);
  });

  it('return true if its a double pair, false otherwise', () => {
    expect(checkDoublePair([0, 1, 2, 3, 12])).toBe(false);
    expect(checkDoublePair([0, 0, 3, 3, 4])).toBe(true);
    expect(checkDoublePair([0, 0, 3, 3, 3])).toBe(false);
  });

  it('removes straights from a list of hands', () => {
    let handslist = [[1, 2, 3, 4, 5], [0, 0, 0, 1, 1], [1, 1, 3, 4, 4]];
    expect(removeStraights(handslist)).toEqual([[0, 0, 0, 1, 1], [1, 1, 3, 4, 4]]);
  });

  it('returns 0 if values are equals 1 if first is bigger, -1 otherwise', () => {
    expect(internalDoublePairsSort([1, 1], [1, 1])).toBe(0);
    expect(internalDoublePairsSort([1, 1], [1, 0])).toBe(1);
    expect(internalDoublePairsSort([1, 1], [2, 0])).toBe(-1);
  });
});

describe('ranking calculators and hashes managers', () => {
  let fakeHash: NumberMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

  const fakeRankingObj: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: [0, 1, 2],
    baseSuitValues: [0, 1, 2],
    rankingInfos: []
  };

  it('should compute rank of hand given hash and hand list', () => {
    expect(_rankOfHand([0, 0, 0], fakeHash)).toBe(0);
    expect(_rankOfHand([0, 0, 1], fakeHash)).toBe(1);
    expect(_rankOfHand([1, 2, 2], fakeHash)).toBe(5);
  });

  it('should compute rank of best hand given hash and hand list of 7 cards', () => {
    expect(_rankOf5onX([0, 0, 0, 1, 2, 1, 0], fakeHash)).toBe(4);
    expect(_rankOf5onX([1, 1, 1, 1, 1, 1, 2], fakeHash)).toBe(6);
  });

  it('fills rank of 5', () => {
    expect(fillRank5([1, 1, 1], 3, fakeRankingObj)).toEqual({
      HASHES: { 3: 3 },
      FLUSH_CHECK_KEYS: {},
      FLUSH_RANK_HASHES: {},
      FLUSH_HASHES: {},
      baseRankValues: [0, 1, 2],
      baseSuitValues: [0, 1, 2],
      rankingInfos: [3]
    });

    expect(fillRank5PlusFlushes([1, 1, 0], 2, fakeRankingObj, 10)).toEqual({
      HASHES: { 3: 3, 2: 12 },
      FLUSH_CHECK_KEYS: {},
      FLUSH_RANK_HASHES: {},
      FLUSH_HASHES: {},
      baseRankValues: [0, 1, 2],
      baseSuitValues: [0, 1, 2],
      rankingInfos: [3, 12]
    });
  });
});
