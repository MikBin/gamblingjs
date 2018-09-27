import * as CONSTANTS from './constants';
import {
  getVectorSum,
  _rankOf5onX,
  fillRank5,
  fillRank5PlusFlushes,
  fillRankFlushes,
  checkStraight5on7,
  handToCardsSymbols,
  handRankToGroup
} from './routines';
import * as ROUTINES from './routines';
import * as kombinatoricsJs from 'kombinatoricsjs';
import { hashRanking, NumberMap, hashRankingSeven } from './interfaces';

export const createRankOfFiveHashes = (): Readonly<hashRanking> => {
  const hashRankingOfFive: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: CONSTANTS.flush5hHashCheck,
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: new Array(7462)
  };

  //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;

  const rankCards = CONSTANTS.rankCards;
  const STRAIGHTS = CONSTANTS.STRAIGHTS;
  const HIGH_CARDS_5_AMOUNT = CONSTANTS.HIGH_CARDS_5_AMOUNT;
  let highCards = kombinatoricsJs.multiCombinations(rankCards, 5, 1);
  const HIGH_CARDS = ROUTINES.removeStraights(highCards);
  const SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
  const DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards);
  const TRIPLES = ROUTINES.trisList(rankCards);
  const FULLHOUSES = ROUTINES.fullHouseList(rankCards);
  const QUADS = ROUTINES.quadsList(rankCards);

  let upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS);
  upToStraights.forEach((h, idx) => {
    fillRank5(h, idx, hashRankingOfFive);
  });
  let aboveStraights = FULLHOUSES.concat(QUADS);
  aboveStraights.forEach((h, idx) => {
    fillRank5PlusFlushes(h, idx, hashRankingOfFive);
  });

  /**FLUSHES and STRAIGHT FLUSHES */
  HIGH_CARDS.forEach(h => {
    fillRankFlushes(h, hashRankingOfFive);
  });

  STRAIGHTS.forEach((h, idx) => {
    let hash = getVectorSum(h.map(card => hashRankingOfFive.baseRankValues[card]));
    let rank = idx + CONSTANTS.STRAIGHT_FLUSH_BASE_START;
    hashRankingOfFive.FLUSH_RANK_HASHES[hash] = rank;
    hashRankingOfFive.rankingInfos[rank] = {
      hand: h.slice(),
      faces: handToCardsSymbols(h),
      handGroup: handRankToGroup(rank)
    };
  });

  return hashRankingOfFive;
};

//export const createRankOf5On6Hashes = () => { };

export const createRankOf5On7Hashes = (hashRankOfFive: hashRanking) => {
  const hashRankingOfFiveOnSeven: hashRankingSeven = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    MULTI_FLUSH_RANK_HASHES: { 5: {}, 6: {}, 7: {} },
    baseRankValues: CONSTANTS.ranksHashOn7,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: hashRankOfFive.rankingInfos
  };

  let counter: number = 0;
  const rankCards = CONSTANTS.rankCards;
  const ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues;
  const suit7Hash = hashRankingOfFiveOnSeven.baseSuitValues;

  kombinatoricsJs.multiCombinations(rankCards, 7, 4).forEach((hand: number[], i: number) => {
    let h7 = hand.map(card => ranksHashOn7[card]);
    let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
    let hash7: number = getVectorSum(h7);

    hashRankingOfFiveOnSeven.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
  });

  let FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.MULTI_FLUSH_RANK_HASHES;

  let fiveFlushes = kombinatoricsJs.combinations(rankCards, 5);
  let sixFlushes = kombinatoricsJs.combinations(rankCards, 6);
  let sevenFlushes = kombinatoricsJs.combinations(rankCards, 7);

  fiveFlushes.concat(sixFlushes, sevenFlushes).forEach((h: number[]) => {
    let h5: number[] = h.map(c => hashRankOfFive.baseRankValues[c]);
    let h7: number[] = h.map(c => hashRankingOfFiveOnSeven.baseRankValues[c]);
    let hash7 = getVectorSum(h7);

    /**@TODO simply draw rank from hashRankOfFive.FLUSH_RANK_HASHES   */
    let rank = _rankOf5onX(h5, /*hashRankOfFive.HASHES*/ hashRankOfFive.FLUSH_RANK_HASHES);
    /* if (checkStraight5on7(h)) {
       rank += CONSTANTS.STRAIGHT_FLUSH_OFFSET;
     } else {
       rank += CONSTANTS.FLUSHES_BASE_START;
     }*/

    FLUSH_RANK_HASHES[h.length][hash7] = rank;
  });

  let fiveFlushHashes = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [8, 8, 8, 8, 8], [57, 57, 57, 57, 57]];
  let sixFlushHashes: number[][] = [];
  fiveFlushHashes.forEach((v, i) => {
    sixFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
  });
  let sevenFlushHashes: number[][] = [];

  sixFlushHashes.forEach(v => {
    sevenFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]));
  });

  const FLUSH_CHECK_KEYS = hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS;

  fiveFlushHashes.concat(sixFlushHashes, sevenFlushHashes).forEach(h => {
    FLUSH_CHECK_KEYS[getVectorSum(h)] = h[0];
  });

  /*console.log(counter, sixFlushes, sevenFlushes, fiveFlushes);
    console.log(cc, fiveFlushHashes, sixFlushHashes, sevenFlushHashes, hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS);
    console.log("--------", hashRankingOfFiveOnSeven);*/

  return hashRankingOfFiveOnSeven;
};

export const createRankOf5AceToFive_Low8 = (): Readonly<hashRanking> => {
  let lowHands: number[][] = kombinatoricsJs.multiCombinations([6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
  const hashRankingLow8: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: new Array(lowHands.length)
  };

  lowHands.forEach((h, idx) => {
    fillRank5(h, idx, hashRankingLow8);
  });
  /**change rankking infos as straights have to have different names */

  return hashRankingLow8;
};

export const createRankOf5AceToFive_Full = (): Readonly<hashRanking> => {
  const rankCards: number[] = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12];

  const hashRankingLow: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: new Array(6175)
  };
  const QUADS = ROUTINES.quadsList(rankCards);
  const FULLHOUSES = ROUTINES.fullHouseList(rankCards);
  const TRIPLES = ROUTINES.trisList(rankCards, true);
  const DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards, true);
  const SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
  let HIGH_CARDS: number[][] = kombinatoricsJs.multiCombinations(rankCards, 5, 1);

  let all = QUADS.concat(FULLHOUSES, TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS);
  all.forEach((h, idx) => {
    fillRank5(h, idx, hashRankingLow);
  });

  return hashRankingLow;
};

export const createRankOf5AceToSix_Full = (): Readonly<hashRanking> => {
  const hashRankingLow: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: new Array(7462)
  };
  let rankCards = CONSTANTS.rankCards_low;
  const STRAIGHTS = CONSTANTS.STRAIGHTS.slice().reverse();
  const QUADS = ROUTINES.quadsList(rankCards);
  const FULLHOUSES = ROUTINES.fullHouseList(rankCards);
  const TRIPLES = ROUTINES.trisList(rankCards, true);
  const DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards, true);
  const SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards);
  let HIGH_CARDS: number[][] = kombinatoricsJs.multiCombinations(rankCards, 5, 1).filter((H, i) => {
    return !ROUTINES.checkStraight(H);
  });

  /**fill straight flushes as are the lowest hand possbile */
  STRAIGHTS.forEach((h, idx) => {
    let hash = getVectorSum(h.map(card => hashRankingLow.baseRankValues[card]));
    let rank = idx;
    hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
    hashRankingLow.rankingInfos[rank] = {
      hand: h.slice(),
      faces: handToCardsSymbols(h),
      handGroup: handRankToGroup(rank)
    };
  });
  let FLUSH_GAP: number = STRAIGHTS.length;
  /**@TODO verify how does straight AKQJT have to be valuated...if ACE counts for low only it should NOT BE a straight!!!! */
  QUADS.concat(FULLHOUSES).forEach((h, idx) => {
    /**add straights.length because of straight flushes are the lowest to be added */
    fillRank5(h, idx + FLUSH_GAP, hashRankingLow);
  });
  FLUSH_GAP += QUADS.length + FULLHOUSES.length;
  HIGH_CARDS.forEach((h, idx) => {
    let hash = getVectorSum(h.map(card => hashRankingLow.baseRankValues[card]));
    let rank = idx + FLUSH_GAP;
    hashRankingLow.FLUSH_RANK_HASHES[hash] = rank;
    hashRankingLow.rankingInfos[rank] = {
      hand: h.slice(),
      faces: handToCardsSymbols(h),
      handGroup: handRankToGroup(rank)
    };
  });
  FLUSH_GAP += HIGH_CARDS.length;
  STRAIGHTS.concat(TRIPLES, DOUBLE_PAIRS, SINGLE_PAIRS, HIGH_CARDS).forEach((h, idx) => {
    fillRank5(h, idx + FLUSH_GAP, hashRankingLow);
  });

  return hashRankingLow;
};

export const createRankOf7AceToFive_Low = (
  hashRankOfFive: hashRanking,
  baseLowRanking: number[],
  fullFlag: boolean = false
): Readonly<hashRanking> => {
  const hashRankingLow: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn7,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: hashRankOfFive.rankingInfos
  };

  let ranksHashOn7 = CONSTANTS.ranksHashOn7;

  if (fullFlag) {
    kombinatoricsJs.multiCombinations(baseLowRanking, 7, 4).forEach((hand, idx) => {
      let h7 = hand.map(card => ranksHashOn7[card]);
      let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
      let hash7: number = getVectorSum(h7);

      hashRankingLow.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
    });
  } else {
    let lowHands: number[][] = kombinatoricsJs.multiCombinations(baseLowRanking, 5, 1);
    kombinatoricsJs.multiCombinations(CONSTANTS.rankCards, 2, 2).forEach((pair, i) => {
      lowHands.forEach((lo, idx) => {
        let hand = lo.concat(pair);

        let h7 = hand.map(card => ranksHashOn7[card]);
        let h5 = hand.map(card => hashRankOfFive.baseRankValues[card]);
        let hash7: number = getVectorSum(h7);

        hashRankingLow.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES);
      });
    });
  }

  return hashRankingLow;
};

export const createRankOf5AceToFive_Low9 = () => {
  let lowHands: number[][] = kombinatoricsJs.multiCombinations([7, 6, 5, 4, 3, 2, 1, 0, 12], 5, 1);
  const hashRankingLow9: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: new Array(lowHands.length)
  };

  lowHands.forEach((h, idx) => {
    fillRank5(h, idx, hashRankingLow9);
  });

  return hashRankingLow9;
};
