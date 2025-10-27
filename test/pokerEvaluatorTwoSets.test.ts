import { describe, it, expect } from 'vitest';
import {
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
  bfBestOfFiveFromTwoSetsLowBall27Indexed
} from '../src/pokerEvaluatorTwoSets';

import {
  handOfFiveEvalHiLow8
} from '../src/pokerEvaluator5'

import { fullCardsDeckHash_5, fullCardsDeckHash_7 } from '../src/constants';

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
