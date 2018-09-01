import {
  handOfFiveEval,
  handOfFiveEvalIndexed,
  handOfSevenEval,
  handOfSevenEvalIndexed,
  bfBestOfFiveOnX
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
});
