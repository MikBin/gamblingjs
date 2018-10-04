import {
  handOfFiveEval,
  handOfFiveEvalIndexed,
  handOfSevenEval,
  handOfSevenEvalIndexed,
  bfBestOfFiveOnX,
  bfBestOfFiveOnXindexed,
  handOfSevenEval_Verbose,
  handOfSevenEvalIndexed_Verbose,
  handOfSixEvalIndexed,
  handOfFiveEvalLowBall27,
  handOfFiveEvalLowBall27Indexed,
  handOfFiveEvalHiLow8,
  handOfFiveEvalHiLow8Indexed,
  handOfFiveEvalHiLow9,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalLow_Ato5,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalHiLow,
  handOfSevenEvalHiLow,
  getHandInfo,
  HASHES_OF_SEVEN_LOW8,
  HASHES_OF_SEVEN_LOW9,
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9,
  handOfSevenEvalHiLow8,
  handOfSevenEvalHiLow9,
  handOfSevenEvalLow_Ato5,
  handOfSevenEvalLowBall27,
  bfBestOfFiveFromTwoSets,
  bfBestOfFiveFromTwoSetsHiLow,
  bfBestOfFiveFromTwoSetsHiLow8,
  bfBestOfFiveFromTwoSetsHiLow8Indexed,
  bfBestOfFiveFromTwoSetsHiLow9,
  bfBestOfFiveFromTwoSetsHiLow9Indexed,
  bfBestOfFiveFromTwoSetsHiLow_Ato5,
  bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed,
  bfBestOfFiveFromTwoSetsLow_Ato6,
  bfBestOfFiveFromTwoSetsLow_Ato6Indexed,
  bfBestOfFiveFromTwoSetsLowBall27,
  bfBestOfFiveFromTwoSetsLowBall27Indexed,
  handOfSevenEvalLow_Ato5Indexed,
  handOfSevenEvalHiLow8Indexed,
  handOfSevenEvalHiLow9Indexed,
  handOfFiveEvalLow_Ato6,
  handOfFiveEvalLow_Ato6Indexed,
  handOfSevenEval_Ato6,
  handOfSevenEval_Ato6Indexed,
  handOfSevenEvalAto5Indexed_Verbose,
  handOfSevenEvalLow8Indexed_Verbose,
  handOfSevenEvalLow9Indexed_Verbose
} from '../src/pokerEvaluators';
import { fullCardsDeckHash_5, fullCardsDeckHash_7 } from '../src/constants';

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
  //it("message",()=>{});
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

describe('testing hilo 8 and 9 on SEVEN cards', () => {
  expect(
    handOfSevenEvalHiLow8(
      fullCardsDeckHash_7[6],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 6898, low: 3 });

  expect(
    handOfSevenEvalHiLow(
      HASHES_OF_SEVEN_LOW9.HASHES,
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 6903, low: 38 });

  expect(
    handOfSevenEvalHiLow(
      HASHES_OF_SEVEN_LOW8.HASHES,
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 6903, low: -1 });

  expect(
    handOfSevenEvalHiLow(
      HASHES_OF_SEVEN_LOW8.HASHES,
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[18],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[29],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 5813, low: -1 });

  expect(
    handOfSevenEvalHiLow(
      HASHES_OF_SEVEN_LOW9.HASHES,
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[9],
      fullCardsDeckHash_7[2],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[11]
    )
  ).toEqual({ hi: 7038, low: 35 });

  expect(
    handOfSevenEvalHiLow8(
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 6903, low: -1 });

  expect(handOfSevenEvalHiLow8Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: -1 });

  expect(
    handOfSevenEvalHiLow9(
      fullCardsDeckHash_7[7],
      fullCardsDeckHash_7[5],
      fullCardsDeckHash_7[4],
      fullCardsDeckHash_7[3],
      fullCardsDeckHash_7[12],
      fullCardsDeckHash_7[25],
      fullCardsDeckHash_7[38]
    )
  ).toEqual({ hi: 6903, low: 38 });

  expect(handOfSevenEvalHiLow9Indexed(7, 5, 4, 3, 12, 25, 38)).toEqual({ hi: 6903, low: 38 });

  it('handOfSevenEvalLow_Ato5 has max on 6174 and min on 168', () => {
    expect(
      handOfSevenEvalLow_Ato5(
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[10],
        fullCardsDeckHash_7[10],
        fullCardsDeckHash_7[10]
      )
    ).toBe(168);

    expect(handOfSevenEvalLow_Ato5Indexed(11, 11, 11, 11, 10, 10, 10)).toBe(168);

    expect(handOfSevenEvalLow_Ato5Indexed(12, 0, 1, 2, 16, 29, 42)).toBe(6174);

    expect(
      handOfSevenEvalLow_Ato5(
        fullCardsDeckHash_7[12],
        fullCardsDeckHash_7[0],
        fullCardsDeckHash_7[1],
        fullCardsDeckHash_7[2],
        fullCardsDeckHash_7[16],
        fullCardsDeckHash_7[29],
        fullCardsDeckHash_7[42]
      )
    ).toBe(6174);
  });
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
  it('on seven cards the lowest is a full house, since straight flush is not possible', () => {
    expect(
      handOfSevenEval_Ato6(
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[24],
        fullCardsDeckHash_7[37],
        fullCardsDeckHash_7[50],
        fullCardsDeckHash_7[10],
        fullCardsDeckHash_7[23],
        fullCardsDeckHash_7[36]
      )
    ).toBe(177);
  });

  it('in seven eval straight flush is not possible', () => {
    expect(handOfSevenEval_Ato6Indexed(11, 10, 9, 8, 7, 6, 5)).toBe(934);
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

  it('top straight flush cannot exist in 7 eval as the minimum is QJT98 ', () => {
    expect(
      handOfSevenEvalLowBall27(
        fullCardsDeckHash_7[12],
        fullCardsDeckHash_7[11],
        fullCardsDeckHash_7[10],
        fullCardsDeckHash_7[9],
        fullCardsDeckHash_7[8],
        fullCardsDeckHash_7[7],
        fullCardsDeckHash_7[6]
      )
    ).toBe(0);
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

/**
 *
 * SEVEN EVAL VERBOSE
 *
 */
describe('testing handOfSevenEval_Verbose: ', () => {
  it('should get some infos: ', () => {
    expect(getHandInfo(2345)).toBeInstanceOf(Object);
  });

  it('should get one pair category: ', () => {
    expect(
      handOfSevenEval_Verbose(
        fullCardsDeckHash_7[12],
        fullCardsDeckHash_7[15],
        fullCardsDeckHash_7[1],
        fullCardsDeckHash_7[2],
        fullCardsDeckHash_7[3],
        fullCardsDeckHash_7[21],
        fullCardsDeckHash_7[17]
      )
    ).toEqual({
      handRank: 1874,
      hand: [2, 2, 4, 8, 12],
      faces: '446TA',
      handGroup: 'one pair',
      winningCards: [12, 15, 2, 21, 17],
      flushSuit: 'no flush'
    });
  });

  it('should get same results in indexed version: ', () => {
    expect(handOfSevenEvalIndexed_Verbose(12, 15, 1, 2, 3, 10, 17)).toEqual({
      handRank: 6389,
      hand: [1, 2, 3, 10, 12],
      faces: '345QA',
      handGroup: 'flush',
      winningCards: [12, 1, 2, 3, 10],
      flushSuit: 'spades'
    });
  });

  it('should get flush category: ', () => {
    expect(
      handOfSevenEval_Verbose(
        fullCardsDeckHash_7[12],
        fullCardsDeckHash_7[15],
        fullCardsDeckHash_7[1],
        fullCardsDeckHash_7[2],
        fullCardsDeckHash_7[3],
        fullCardsDeckHash_7[10],
        fullCardsDeckHash_7[17]
      )
    ).toEqual({
      handRank: 6389,
      hand: [1, 2, 3, 10, 12],
      faces: '345QA',
      handGroup: 'flush',
      winningCards: [12, 1, 2, 3, 10],
      flushSuit: 'spades'
    });
  });

  it('should get same results in indexed version: ', () => {
    expect(handOfSevenEvalIndexed_Verbose(12, 15, 1, 2, 3, 21, 17)).toEqual({
      handRank: 1874,
      hand: [2, 2, 4, 8, 12],
      faces: '446TA',
      handGroup: 'one pair',
      winningCards: [12, 15, 2, 21, 17],
      flushSuit: 'no flush'
    });

    expect(handOfSevenEvalIndexed_Verbose(0, 1, 2, 3, 18, 19, 20)).toEqual({
      faces: '45789',
      flushSuit: 'no flush',
      hand: [2, 3, 5, 6, 7],
      handGroup: 'high card',
      handRank: 849,
      winningCards: [2, 3, 18, 19, 20]
    });
  });

  it('should evaluate verbose Ato5', () => {
    expect(handOfSevenEvalAto5Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
      faces: '65432',
      flushSuit: 'no flush',
      hand: [4, 3, 2, 1, 0],
      handGroup: 'high card',
      handRank: 6169,
      winningCards: [0, 1, 2, 3, 4]
    });
  });

  it('should evaluate verbose Ato5 low 8', () => {
    expect(handOfSevenEvalLow8Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
      faces: '65432',
      flushSuit: 'no flush',
      hand: [4, 3, 2, 1, 0],
      handGroup: 'high card',
      handRank: 50,
      winningCards: [0, 1, 2, 3, 4]
    });
  });

  it('should evaluate verbose Ato5 low 8-- hand doesnt qualify for low8', () => {
    expect(handOfSevenEvalLow8Indexed_Verbose(0, 11, 23, 24, 4, 36, 45)).toEqual({
      faces: '2KQK6Q8',
      flushSuit: 'unqualified',
      hand: [],
      handGroup: 'unqualified',
      handRank: -1,
      winningCards: []
    });
  });

  it('should evaluate verbose Ato5 low 9', () => {
    expect(handOfSevenEvalLow9Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
      faces: '65432',
      flushSuit: 'no flush',
      hand: [4, 3, 2, 1, 0],
      handGroup: 'high card',
      handRank: 120,
      winningCards: [0, 1, 2, 3, 4]
    });
  });

  it('should evaluate verbose Ato5 low 9-- hand doesnt qualify for low9', () => {
    expect(handOfSevenEvalLow9Indexed_Verbose(0, 11, 23, 24, 4, 36, 45)).toEqual({
      faces: '2KQK6Q8',
      flushSuit: 'unqualified',
      hand: [],
      handGroup: 'unqualified',
      handRank: -1,
      winningCards: []
    });
  });

  /**@TODO verbose from lowball Ato6 and from two sets */
});

/**
 *
 * FIVE FROM TWO SETS
 *
 */
describe('bfBestOfFiveFromTwoSets', () => {
  it('gets fullhouse when flush exists on omaha like 4-5', () => {
    expect(
      bfBestOfFiveFromTwoSets(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[35],
          fullCardsDeckHash_5[22],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        2,
        3
      )
    ).toBeGreaterThan(7139);
  });

  it('throw range error', () => {
    expect(() => {
      bfBestOfFiveFromTwoSets(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[35],
          fullCardsDeckHash_5[22],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        3,
        4
      );
    }).toThrowError('sum of nA+nB parameters MUST be 5');
  });

  it('throw range error', () => {
    expect(() => {
      bfBestOfFiveFromTwoSetsLow_Ato6(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[35],
          fullCardsDeckHash_5[22],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        3,
        4
      );
    }).toThrowError('sum of nA+nB parameters MUST be 5');
  });

  it('throw range error', () => {
    expect(() => {
      bfBestOfFiveFromTwoSetsHiLow(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[35],
          fullCardsDeckHash_5[22],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        3,
        4,
        handOfFiveEvalHiLow8
      );
    }).toThrowError('sum of nA+nB parameters MUST be 5');
  });

  it('gets quads when flush exists on omaha like 4-5', () => {
    expect(
      bfBestOfFiveFromTwoSets(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        2,
        3
      )
    ).toBeGreaterThan(7295);
  });

  it('bfBestOfFiveFromTwoSetsHiLow no low and quads of aces', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        2,
        3,
        handOfFiveEvalHiLow8
      )
    ).toEqual({ hi: 7449, low: -1 });
  });

  it('bfBestOfFiveFromTwoSetsHiLow8 no low and quads of aces', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow8(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[3],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[4],
          fullCardsDeckHash_5[7]
        ],
        2,
        3
      )
    ).toEqual({ hi: 7449, low: -1 });
  });

  it('bfBestOfFiveFromTwoSetsHiLow8 a straight flush wheel', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow8(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[0],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[3]
        ],
        2,
        3
      )
    ).toEqual({ hi: 7452, low: 55 });

    expect(bfBestOfFiveFromTwoSetsHiLow8Indexed([12, 25, 0, 36], [1, 2, 3, 38, 51], 2, 3)).toEqual({
      hi: 7452,
      low: 55
    });
  });

  it('bfBestOfFiveFromTwoSetsHiLow9 a straight flush wheel', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow9(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[0],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[3]
        ],
        2,
        3
      )
    ).toEqual({ hi: 7452, low: 125 });

    expect(bfBestOfFiveFromTwoSetsHiLow9Indexed([12, 25, 0, 36], [1, 2, 3, 38, 51], 2, 3)).toEqual({
      hi: 7452,
      low: 125
    });
  });

  it('bfBestOfFiveFromTwoSetsHiLow_Ato5 a straight flush wheel', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow_Ato5(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[0],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[3]
        ],
        2,
        3
      )
    ).toBe(6174);

    expect(bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed([12, 25, 36, 0], [1, 3, 2, 38, 51], 2, 3)).toBe(
      6174
    );
  });

  it('bfBestOfFiveFromTwoSetsLow_Ato6 the only A to 6 available is a flush so its not the best hand', () => {
    expect(
      bfBestOfFiveFromTwoSetsLow_Ato6(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[0],
          fullCardsDeckHash_5[50],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[4]
        ],
        2,
        3
      )
    ).toBe(7006);
  });

  it('bfBestOfFiveFromTwoSetsLow_Ato6 top hand is A 2 3 4 6', () => {
    expect(bfBestOfFiveFromTwoSetsLow_Ato6Indexed([12, 0, 26, 36], [38, 51, 1, 2, 4], 2, 3)).toBe(
      7461
    );
  });

  it('bfBestOfFiveFromTwoSetsHiLow_Ato5 a  wheel ranks highest at 6174', () => {
    expect(
      bfBestOfFiveFromTwoSetsHiLow_Ato5(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[13],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[36]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[3]
        ],
        2,
        3
      )
    ).toBe(6174);
  });

  it('bfBestOfFiveFromTwoSetsLowBall27 counts flush and straights as bad hand as well as ACES', () => {
    expect(
      bfBestOfFiveFromTwoSetsLowBall27(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[11],
          fullCardsDeckHash_5[24]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[51],
          fullCardsDeckHash_5[10],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[8]
        ],
        2,
        3
      )
    ).toBe(3548);

    expect(
      bfBestOfFiveFromTwoSetsLowBall27Indexed([12, 25, 11, 24], [10, 9, 8, 38, 51], 2, 3)
    ).toBe(3548);
  });

  it('bfBestOfFiveFromTwoSetsLowBall27 has best hand 2-7 unsuited 7461', () => {
    expect(
      bfBestOfFiveFromTwoSetsLowBall27(
        [
          fullCardsDeckHash_5[12],
          fullCardsDeckHash_5[13],
          fullCardsDeckHash_5[25],
          fullCardsDeckHash_5[5]
        ],
        [
          fullCardsDeckHash_5[38],
          fullCardsDeckHash_5[9],
          fullCardsDeckHash_5[1],
          fullCardsDeckHash_5[2],
          fullCardsDeckHash_5[3]
        ],
        2,
        3
      )
    ).toBe(7461);
  });
});

describe('testing hand of seven eval', () => {
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

    expect(bfBestOfFiveOnXindexed([12, 0, 1, 2, 3, 25, 38])).toBe(7452);
  });

  it('A2345+J7 suited rank should be 7452', () => {
    expect(
      handOfSevenEval(
        fullCardsDeckHash_7[12],
        fullCardsDeckHash_7[0],
        fullCardsDeckHash_7[1],
        fullCardsDeckHash_7[2],
        fullCardsDeckHash_7[3],
        fullCardsDeckHash_7[21],
        fullCardsDeckHash_7[17]
      )
    ).toBe(7452);
  });

  it('A2345+J7 suited rank should be 7452 in indexed eval too', () => {
    expect(handOfSevenEvalIndexed(17, 3, 1, 2, 0, 21, 12)).toBe(7452);
  });

  it('has 10 straights in right order ', () => {
    expect(handOfSevenEvalIndexed(12, 0, 14, 15, 29, 44, 25)).toBe(5853);
    expect(handOfSevenEvalIndexed(12, 0, 14, 15, 29, 50, 30)).toBe(5854);
    expect(handOfSevenEvalIndexed(31, 50, 14, 15, 29, 44, 30)).toBe(5855);
  });

  it('checks hand of six eval: ', () => {
    expect(handOfSixEvalIndexed(3, 23, 4, 45, 27, 7)).toBe(1053);
    expect(handOfSixEvalIndexed(0, 1, 2, 3, 18, 19)).toBe(500);
  });
});
