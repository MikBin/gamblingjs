import {
  handOfSixEvalIndexed,
  handOfSixEvalLowBall27Indexed,
  handOfSixEvalAto5Indexed,
  handOfSixEvalAto6Indexed,
  handOfSixEvalHiLow9Indexed,
  handOfSixEvalHiLow8Indexed,
  _handOfSixEvalIndexed,
  _handOfSixEvalIndexed_Verbose,
  _handOfSixEvalLowBall27Indexed_Verbose,
  _handOfSixEvalAto5Indexed_Verbose,
  _handOfSixEvalAto6Indexed_Verbose,
  _handOfSixEvalLow8_Verbose,
  _handOfSixEvalLow9_Verbose
} from '../src/pokerEvaluator6';
import {
  bestFiveOnXHiLowIndexed,
  bfBestOfFiveOnXindexed,
  handOfFiveEvalHiLow8Indexed,
  handOfFiveEvalHiLow9Indexed,
  handOfFiveEvalLow_Ato5Indexed,
  handOfFiveEvalLow_Ato6Indexed,
  handOfFiveEvalLowBall27Indexed,
} from '../src/pokerEvaluator5';
import {
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9
} from '../src/pokerHashes5'
import {
  fastHashesCreators6,
} from '../src/pokerHashes7'
import { fullCardsDeckHash_5 } from '../src/constants';
import { _handOfSevenEval_Ato6Indexed } from '../src/pokerEvaluator7';

describe('testing hand of six eval', () => {
  it('checks hand of six eval: ', () => {
    expect(_handOfSixEvalIndexed(3, 23, 4, 45, 27, 7)).toBe(1053);
    expect(_handOfSixEvalIndexed(0, 1, 2, 3, 18, 19)).toBe(500);
  });

  it('checks hand of six eval indexed lowball 2-7', () => {
    const hand = [13, 1, 2, 3, 4, 5];
    expect(handOfSixEvalLowBall27Indexed(...hand)).toBe(bfBestOfFiveOnXindexed(hand, handOfFiveEvalLowBall27Indexed));
  });
  it('checks hand of six eval indexed Ato5 ', () => {
    const hand1 = [12, 1, 2, 3, 4, 5];
    const hand2 = [12, 0, 1, 2, 3, 4];
    expect(handOfSixEvalAto5Indexed(...hand1)).toBe(bfBestOfFiveOnXindexed(hand1, handOfFiveEvalLow_Ato5Indexed));
    expect(handOfSixEvalAto5Indexed(...hand2)).toBe(bfBestOfFiveOnXindexed(hand2, handOfFiveEvalLow_Ato5Indexed));
  });

  it('checks hand of six eval indexed Ato6 ', () => {
    const hand1 = [12, 1, 2, 3, 4, 5];
    const hand2 = [25, 1, 2, 3, 4, 5];
    const hand3 = [12, 0, 1, 2, 3, 4];
    expect(handOfSixEvalAto6Indexed(...hand1)).toBe(bfBestOfFiveOnXindexed(hand1, handOfFiveEvalLow_Ato6Indexed));
    expect(handOfSixEvalAto6Indexed(...hand2)).toBe(bfBestOfFiveOnXindexed(hand2, handOfFiveEvalLow_Ato6Indexed));
    expect(handOfSixEvalAto6Indexed(...hand3)).toBe(bfBestOfFiveOnXindexed(hand3, handOfFiveEvalLow_Ato6Indexed));
  });

  it('check handOfSixEvalHiLow8Indexed: ', () => {
    const hand = [12, 1, 2, 3, 4, 5];
    expect(handOfSixEvalHiLow8Indexed(...hand)).toEqual(bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow8Indexed, hand));
  });

  it('check handOfSixEvalHiLow9Indexed: ', () => {
    const hand = [9, 1, 2, 3, 4, 7];
    expect(handOfSixEvalHiLow9Indexed(...hand)).toEqual(bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow9Indexed, hand));
  });
});

describe('testing fast hand of six eval', () => {
  beforeAll(() => {
    fastHashesCreators6.high();
  });

  it('checks hand of six eval: Straight Flush', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalIndexed(...hand)).toBe(_handOfSixEvalIndexed(...hand));
  });

  it('checks hand of six eval: Four of a Kind', () => {
    const hand = [0, 13, 26, 39, 4, 5];
    expect(handOfSixEvalIndexed(...hand)).toBe(_handOfSixEvalIndexed(...hand));
  });

  it('checks hand of six eval: Full House', () => {
    const hand = [0, 13, 26, 1, 14, 5];
    expect(handOfSixEvalIndexed(...hand)).toBe(_handOfSixEvalIndexed(...hand));
  });

  it('checks hand of six eval: Flush', () => {
    const hand = [0, 2, 4, 6, 8, 10];
    expect(handOfSixEvalIndexed(...hand)).toBe(_handOfSixEvalIndexed(...hand));
  });

  it('checks hand of six eval: Straight', () => {
    const hand = [0, 14, 2, 16, 3, 17];
    expect(handOfSixEvalIndexed(...hand)).toBe(_handOfSixEvalIndexed(...hand));
  });
});

describe('testing fast hand of six eval low8', () => {
  beforeAll(() => {
    fastHashesCreators6.low8();
  });

  it('checks hand of six eval: low8', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalHiLow8Indexed(...hand)).toEqual(bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow8Indexed, hand));
  });
});

describe('testing fast hand of six eval low9', () => {
  beforeAll(() => {
    fastHashesCreators6.low9();
  });

  it('checks hand of six eval: low9', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalHiLow9Indexed(...hand)).toEqual(bestFiveOnXHiLowIndexed(handOfFiveEvalHiLow9Indexed, hand));
  });
});

describe('testing fast hand of six eval Ato5', () => {
  beforeAll(() => {
    fastHashesCreators6.Ato5();
  });

  it('checks hand of six eval: Ato5', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalAto5Indexed(...hand)).toEqual(bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato5Indexed));
  });
});

describe('testing fast hand of six eval Ato6', () => {
  beforeAll(() => {
    fastHashesCreators6.Ato6();
  });

  it('checks hand of six eval: Ato6', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalAto6Indexed(...hand)).toEqual(bfBestOfFiveOnXindexed(hand, handOfFiveEvalLow_Ato6Indexed));
  });
});

describe('testing fast hand of six eval 2to7', () => {
  beforeAll(() => {
    fastHashesCreators6["2to7"]();
  });

  it('checks hand of six eval: 2to7', () => {
    const hand = [0, 1, 2, 3, 4, 5];
    expect(handOfSixEvalLowBall27Indexed(...hand)).toEqual(bfBestOfFiveOnXindexed(hand, handOfFiveEvalLowBall27Indexed));
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
