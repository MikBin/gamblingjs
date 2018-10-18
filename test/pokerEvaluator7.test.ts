import {
  handOfSevenEval,
  handOfSevenEvalIndexed,
  handOfSevenEvalHiLow,
  handOfSevenEvalHiLow8,
  handOfSevenEvalHiLow9,
  handOfSevenEvalLow_Ato5,
  handOfSevenEvalLowBall27,
  handOfSevenEvalLowBall27Indexed,
  handOfSevenEvalLow_Ato5Indexed,
  handOfSevenEvalHiLow8Indexed,
  handOfSevenEvalHiLow9Indexed,
  handOfSevenEval_Ato6,
  handOfSevenEval_Ato6Indexed,
  handOfSevenEvalAto6Indexed_Verbose,
  handOfSevenEvalAto5Indexed_Verbose,
  handOfSevenEvalLow8Indexed_Verbose,
  handOfSevenEvalLow9Indexed_Verbose,
  handOfSevenEvalLowBall27Indexed_Verbose,
  handOfSevenEvalIndexed_Verbose,
  handOfSevenEval_Verbose
} from '../src/pokerEvaluator7';
import {
  HASHES_OF_SEVEN_LOW9,
  HASHES_OF_SEVEN_LOW8
} from '../src/pokerHashes7'

import { fullCardsDeckHash_5, fullCardsDeckHash_7 } from '../src/constants';

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

describe('testing hand of seven eval', () => {

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

});

/**
 *
 * SEVEN EVAL VERBOSE
 *
 */
describe('testing handOfSevenEval_Verbose and hand infos: ', () => {

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

  it('should evaluate verbose lowball 2-7 on seven cards', () => {
    expect(handOfSevenEvalLowBall27Indexed_Verbose(0, 1, 2, 3, 4, 23, 45)).toEqual({
      faces: '23458',
      flushSuit: 'no flush',
      hand: [0, 1, 2, 3, 6],
      handGroup: 'high card',
      handRank: 7460,
      winningCards: [0, 1, 2, 3, 45]
    });
  });

  it('should evaluate Ato6 verbose on seven: ', () => {
    expect(handOfSevenEvalAto6Indexed_Verbose(11, 24, 37, 50, 10, 23, 36)).toEqual({
      faces: 'QQQKK',
      flushSuit: 'no flush',
      hand: [10, 10, 10, 11, 11],
      handGroup: 'high card',
      handRank: 177,
      winningCards: [11, 24, 10, 23, 36]
    });
  });
  /**@TODO verbose from lowball Ato6 and from two sets */
});
