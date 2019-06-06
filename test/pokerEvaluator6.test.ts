import {
  handOfSixEvalIndexed,
  handOfSixEvalLowBall27Indexed,
  handOfSixEvalAto5Indexed,
  handOfSixEvalAto6Indexed,
  handOfSixEvalHiLow9Indexed,
  handOfSixEvalHiLow8Indexed,
  _handOfSixEvalIndexed_Verbose,
  _handOfSixEvalLowBall27Indexed_Verbose,
  _handOfSixEvalAto5Indexed_Verbose,
  _handOfSixEvalAto6Indexed_Verbose,
  _handOfSixEvalLow8_Verbose,
  _handOfSixEvalLow9_Verbose
} from '../src/pokerEvaluator6';
import {
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9
} from '../src/pokerHashes5'

import { fullCardsDeckHash_5 } from '../src/constants';
import { _handOfSevenEval_Ato6Indexed } from '../src/pokerEvaluator7';

describe('testing hand of six eval', () => {

  it('checks hand of six eval: ', () => {
    expect(handOfSixEvalIndexed(3, 23, 4, 45, 27, 7)).toBe(1053);
    expect(handOfSixEvalIndexed(0, 1, 2, 3, 18, 19)).toBe(500);
  });

  it('checks hand of six eval indexed lowball 2-7', () => {
    expect(handOfSixEvalLowBall27Indexed(13, 1, 2, 3, 4, 5)).toBe(7461);
  });
  it('checks hand of six eval indexed Ato5 ', () => {
    expect(handOfSixEvalAto5Indexed(12, 1, 2, 3, 4, 5)).toBe(6170);
    expect(handOfSixEvalAto5Indexed(12, 0, 1, 2, 3, 4)).toBe(6174);
  });

  it('checks hand of six eval indexed Ato6 ', () => {
    expect(handOfSixEvalAto6Indexed(12, 1, 2, 3, 4, 5)).toBe(1595);
    expect(handOfSixEvalAto6Indexed(25, 1, 2, 3, 4, 5)).toBe(7458);
    expect(handOfSixEvalAto6Indexed(12, 0, 1, 2, 3, 4)).toBe(1598);
  });

  it('check handOfSixEvalHiLow8Indexed: ', () => {
    expect(handOfSixEvalHiLow8Indexed(12, 1, 2, 3, 4, 5)).toEqual({
      hi: 7454,
      low: 51
    });
  });

  it('check handOfSixEvalHiLow9Indexed: ', () => {
    expect(handOfSixEvalHiLow9Indexed(9, 1, 2, 3, 4, 7)).toEqual({
      hi: 6698,
      low: 55
    });
  });
});

describe.skip("hand of six eval verbose testing brute force (combinatorial) version: ", () => {
  /**@TODO paramterize these test to reuse in fast eval as well as in seven eval */
  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalIndexed_Verbose([4, 17, 19, 20, 11, 5])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalLowBall27Indexed_Verbose([4, 17, 19, 20, 11, 5])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalAto5Indexed_Verbose([4, 17, 19, 20, 11, 5])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalAto6Indexed_Verbose([4, 17, 19, 20, 11, 5])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalLow8_Verbose([4, 17, 19, 20, 3, 0])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

  it("gets info of best high hand of 5 cards on group of 6", () => {
    expect(_handOfSixEvalLow9_Verbose([4, 17, 19, 20, 3, 5])).toEqual({
      hand: [4, 4, 6, 7, 11],
      handRank: 2345,
      faces: '6689K',
      handGroup: 'one pair',
      flushSuit: "no flush",
      winningCards: [4, 17, 19, 20, 11]
    });
  });

});
