import {
  handOfFiveEval,
  handOfFiveEvalIndexed,
  handOfFiveEvalLowBall27,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalHiLow8,
  handOfFiveEvalHiLow8Indexed,
  handOfFiveEvalHiLow9,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalLow_Ato5,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalHiLow,
  getHandInfo,
  getHandInfo27,
  getHandInfoAto5,
  getHandInfoAto6,
  getHandInfoLow8,
  getHandInfoLow9,
  handOfFiveEvalLow_Ato6,
  handOfFiveEvalLow_Ato6Indexed,
  bfBestOfFiveOnXindexed,
  bfBestOfFiveOnX,
  getHandInfo5onX,
  getHandInfo5onXHiLow
} from '../src/pokerEvaluator5';
import {
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9
} from '../src/pokerHashes5'

import { fullCardsDeckHash_5 } from '../src/constants';

import { TEST_DATA } from './test_data/hiLowVerboseTestData'

describe("best of five on X", () => {

  it('get best hand of 5 card on 7 (brute force version)', () => {
    expect(
      bfBestOfFiveOnX([
        fullCardsDeckHash_5[12],
        fullCardsDeckHash_5[0],
        fullCardsDeckHash_5[1],
        fullCardsDeckHash_5[2],
        fullCardsDeckHash_5[3],
        fullCardsDeckHash_5[25],
        fullCardsDeckHash_5[38]
      ])
    ).toBe(7452);

  });

  expect(bfBestOfFiveOnXindexed([12, 0, 1, 2, 3, 25, 38])).toBe(7452);
});
describe('testing hand of five eval', () => {
  it('A2345 suited rank should be 7452', () => {
    expect(
      handOfFiveEval(
        fullCardsDeckHash_5[12],
        fullCardsDeckHash_5[0],
        fullCardsDeckHash_5[1],
        fullCardsDeckHash_5[2],
        fullCardsDeckHash_5[3]
      )
    ).toBe(7452);
  });

  it('23457 unsuited rank should be 0', () => {
    expect(
      handOfFiveEval(
        fullCardsDeckHash_5[5],
        fullCardsDeckHash_5[13],
        fullCardsDeckHash_5[1],
        fullCardsDeckHash_5[2],
        fullCardsDeckHash_5[3]
      )
    ).toBe(0);
  });

  it('indexed eval have lowest hand as 0 rank and highest 7452', () => {
    expect(handOfFiveEvalIndexed(0, 1, 2, 3, 18)).toBe(0);
    expect(handOfFiveEvalIndexed(13, 14, 15, 16, 31)).toBe(0);
    expect(handOfFiveEvalIndexed(25, 13, 14, 15, 16)).toBe(7452);
  });

  /**test all ranks and all flush by making a sequence
   * kombinatoricsJs.multiCombinations(ranks,5,4).evaluate().sort() must equal all ranks hash
   */
});

describe('testing hilo 8 and 9 routines: ', () => {

  expect(
    handOfFiveEvalHiLow8(
      fullCardsDeckHash_5[12],
      fullCardsDeckHash_5[11],
      fullCardsDeckHash_5[10],
      fullCardsDeckHash_5[9],
      fullCardsDeckHash_5[8]
    )
  ).toEqual({ hi: 7461, low: -1 });

  expect(
    handOfFiveEvalHiLow(
      HASHES_OF_FIVE_LOW8.HASHES,
      fullCardsDeckHash_5[12],
      fullCardsDeckHash_5[11],
      fullCardsDeckHash_5[10],
      fullCardsDeckHash_5[9],
      fullCardsDeckHash_5[8]
    )
  ).toEqual({ hi: 7461, low: -1 });

  expect(
    handOfFiveEvalHiLow8(
      fullCardsDeckHash_5[6],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[2]
    )
  ).toEqual({ hi: 7455, low: 0 });

  expect(
    handOfFiveEvalHiLow8(
      fullCardsDeckHash_5[6],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[12]
    )
  ).toEqual({ hi: 6898, low: 3 });

  expect(
    handOfFiveEvalHiLow8(
      fullCardsDeckHash_5[7],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[12]
    )
  ).toEqual({ hi: 6903, low: -1 });

  expect(handOfFiveEvalHiLow8Indexed(7, 5, 4, 3, 12)).toEqual({ hi: 6903, low: -1 });

  expect(
    handOfFiveEvalHiLow9(
      fullCardsDeckHash_5[7],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[12]
    )
  ).toEqual({ hi: 6903, low: 38 });

  expect(handOfFiveEvalHiLow9Indexed(7, 5, 4, 3, 12)).toEqual({ hi: 6903, low: 38 });

  expect(
    handOfFiveEvalHiLow(
      HASHES_OF_FIVE_LOW9.HASHES,
      fullCardsDeckHash_5[7],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[12]
    )
  ).toEqual({ hi: 6903, low: 38 });
});

describe('ace to five lowball: ', () => {
  it('on five cards have max on 6174 and min on 0', () => {
    expect(
      handOfFiveEvalLow_Ato5(
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[10]
      )
    ).toBe(0);

    expect(
      handOfFiveEvalLow_Ato5(
        fullCardsDeckHash_5[7],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[10],
        fullCardsDeckHash_5[9],
        fullCardsDeckHash_5[8]
      )
    ).toBe(4888);

    expect(
      handOfFiveEvalLow_Ato5(
        fullCardsDeckHash_5[12],
        fullCardsDeckHash_5[0],
        fullCardsDeckHash_5[1],
        fullCardsDeckHash_5[2],
        fullCardsDeckHash_5[3]
      )
    ).toBe(6174);
  });

  it('ace to five lowball full have ranks inverted', () => {
    expect(handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 9, 0)).toBe(1311);
    expect(handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 9, 12)).toBe(1312);

    expect(handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 8, 0)).toBe(2310);
    expect(handOfFiveEvalLow_Ato5Indexed(10, 10, 9, 8, 12)).toBe(2311);
  });
});

describe('testing ace to six lowball ', () => {
  it('has lowest rank for straightflushes', () => {
    expect(
      handOfFiveEvalLow_Ato6(
        fullCardsDeckHash_5[7],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[10],
        fullCardsDeckHash_5[9],
        fullCardsDeckHash_5[8]
      )
    ).toBe(0);
  });

  it('top straight flush is not the lowest as the ace is low and doesnt makeup to a straight', () => {
    expect(handOfFiveEvalLow_Ato6Indexed(12, 8, 9, 10, 11)).toBe(328);
  });

  it('the following of the above has a deuce instead of the ace', () => {
    expect(handOfFiveEvalLow_Ato6Indexed(0, 8, 9, 10, 11)).toBe(327);
  });

  it('same holds for high cards equivalent of above flushes', () => {
    expect(handOfFiveEvalLow_Ato6Indexed(25, 8, 9, 10, 11)).toBe(6191);
    expect(handOfFiveEvalLow_Ato6Indexed(13, 8, 9, 10, 11)).toBe(6190);
  });
  it('has best hand a2346 not suited, while suited one is bad', () => {
    expect(handOfFiveEvalLow_Ato6Indexed(25, 0, 1, 2, 4)).toBe(7461);
    expect(handOfFiveEvalLow_Ato6Indexed(12, 0, 1, 2, 4)).toBe(1598);
  });

  it('a2345 is bad hand', () => {
    expect(handOfFiveEvalLow_Ato6Indexed(25, 0, 1, 2, 3)).toBe(1607);
  });
});

describe('testing LowBall27: ', () => {
  it('top straight flush is the lowest in five eval', () => {
    expect(
      handOfFiveEvalLowBall27(
        fullCardsDeckHash_5[12],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[10],
        fullCardsDeckHash_5[9],
        fullCardsDeckHash_5[8]
      )
    ).toBe(0);

    expect(handOfFiveEvalLowBall27Indexed(12, 11, 10, 9, 8)).toBe(0);
  });

  it('2 to 7 is the highest', () => {
    expect(
      handOfFiveEvalLowBall27(
        fullCardsDeckHash_5[0],
        fullCardsDeckHash_5[1],
        fullCardsDeckHash_5[2],
        fullCardsDeckHash_5[3],
        fullCardsDeckHash_5[18]
      )
    ).toBe(7461);
    expect(handOfFiveEvalLowBall27Indexed(0, 1, 2, 3, 18)).toBe(7461);
  });
});

describe('test hand info: ', () => {
  /**@TODO one assertion for each test case 
   * extend test to all hand groups 
  */
  it('should get some infos: ', () => {
    expect(getHandInfo(2345)).toBeInstanceOf(Object);
    expect(getHandInfo(2345)).toEqual({
      hand: [4, 4, 6, 7, 11],
      faces: '6689K',
      handGroup: 'one pair'
    });
    expect(getHandInfo27(7461)).toEqual({
      hand: [0, 1, 2, 3, 5],
      faces: '23457',
      handGroup: 'high card'
    });

    expect(getHandInfoAto5(0)).toEqual({
      hand: [11, 11, 11, 11, 10],
      faces: 'KKKKQ',
      handGroup: 'four of a kind'
    });

    expect(getHandInfoAto5(6174)).toEqual({
      hand: [3, 2, 1, 0, 12],
      faces: '5432A',
      handGroup: 'high card'
    });

    expect(getHandInfoAto6(6174)).toEqual({
      faces: 'AA654',
      hand: [12, 12, 4, 3, 2],
      handGroup: 'one pair'
    });

    expect(getHandInfoAto6(7461)).toEqual({
      hand: [4, 2, 1, 0, 12],
      faces: '6432A',
      handGroup: 'high card'
    });
  });

  it("get info on low8 on five cards: ", () => {
    expect(getHandInfoLow8(28)).toEqual({
      hand: [6, 4, 2, 0, 12],
      faces: '8642A',
      handGroup: 'high card'
    });
  });

  it("get no hand defined for that rank: ", () => {
    expect(getHandInfoLow8(88)).toEqual({
      hand: [],
      faces: '',
      handGroup: 'unqualified'
    });
  });

  it("get info on low9 on five cards: ", () => {
    expect(getHandInfoLow9(28)).toEqual({
      hand: [7, 6, 3, 1, 0],
      faces: '98532',
      handGroup: 'high card'
    });
  });

  it("get info on low8 on five cards for best hand possible: ", () => {
    expect(getHandInfoLow8(55)).toEqual({
      hand: [3, 2, 1, 0, 12],
      faces: '5432A',
      handGroup: 'high card'
    });
  });

  it("get info on low9 on five cards for best hand possible: ", () => {
    expect(getHandInfoLow9(125)).toEqual({
      hand: [3, 2, 1, 0, 12],
      faces: '5432A',
      handGroup: 'high card'
    });
  });

  it("in low9 get no hand defined for that rank: ", () => {
    expect(getHandInfoLow9(588)).toEqual({
      hand: [],
      faces: '',
      handGroup: 'unqualified'
    });
  });
});

describe("testing hand info of best five cards from hand of > 5 cards", () => {
  it("gets info of best high hand of 5 cards on group of 7", () => {
    expect(getHandInfo5onX([4, 17, 19, 20, 11, 5, 0], "high")).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6, tells flush suit (spades)", () => {
    expect(getHandInfo5onX([4, 6, 19, 20, 11, 5, 0], "high")).toEqual({
      hand: [0, 4, 5, 6, 11],
      handRank: 6234,
      faces: '2678K',
      handGroup: 'flush',
      flushSuit: "spades",
      winningCards: [4, 6, 11, 5, 0]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6, tells flush suit (hearts)", () => {
    expect(getHandInfo5onX([30, 32, 19, 20, 37, 33, 26], "high")).toEqual({
      hand: [0, 4, 6, 7, 11],
      handRank: 6254,
      faces: '2689K',
      handGroup: 'flush',
      flushSuit: "hearts",
      winningCards: [30, 32, 20, 37, 26]
    });
  });
});

describe("testing hand info of best five cards from hand of > 5 cards HiLow version ---> returns HiLowVerboseHandInfo", () => {
  it("gets info of best high hand of 5 cards on group of 7", () => {
    expect(getHandInfo5onXHiLow(TEST_DATA.low8[0]["inputs"][7], "low8")).toEqual(TEST_DATA.low8[0].output);
  });

});
