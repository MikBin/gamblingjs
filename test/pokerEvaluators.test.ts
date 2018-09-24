import {
  handOfFiveEval,
  handOfFiveEvalIndexed,
  handOfSevenEval,
  handOfSevenEvalIndexed,
  bfBestOfFiveOnX,
  handOfSevenEval_Verbose,
  handOfSevenEvalIndexed_Verbose,
  handOfSixEvalIndexed,
  handOfFiveEvalLowBall27,
  handOfFiveEvalHiLow8,
  handOfFiveEvalHiLow9,
  handOfFiveEvalLow_Ato5,
  getHandInfo
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

  it('indexed eval have lowest hand as 0 rank and highest 7452', () => {
    expect(handOfFiveEvalIndexed(0, 1, 2, 3, 18)).toBe(0);
    expect(handOfFiveEvalIndexed(13, 14, 15, 16, 31)).toBe(0);
    expect(handOfFiveEvalIndexed(25, 13, 14, 15, 16)).toBe(7452);
  });
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

  expect(
    handOfFiveEvalHiLow9(
      fullCardsDeckHash_5[7],
      fullCardsDeckHash_5[5],
      fullCardsDeckHash_5[4],
      fullCardsDeckHash_5[3],
      fullCardsDeckHash_5[12]
    )
  ).toEqual({ hi: 6903, low: 38 });
});

describe('ace to five lowball: ', () => {
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

describe('testing handOfFiveEvalLowBall27: ', () => {
  it('top straight flush is the lowest', () => {
    expect(
      handOfFiveEvalLowBall27(
        fullCardsDeckHash_5[12],
        fullCardsDeckHash_5[11],
        fullCardsDeckHash_5[10],
        fullCardsDeckHash_5[9],
        fullCardsDeckHash_5[8]
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
  });
});

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
