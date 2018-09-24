import * as kombinatoricsJs from 'kombinatoricsjs';
import { hashRanking, NumberMap } from './interfaces';
import * as CONSTANTS from './constants';

export const getDiffDeck5 = (listOfHands: number[]): number[] => {
  let deck = CONSTANTS.fullCardsDeckHash_5.slice().filter(c => !listOfHands.includes(c));
  return deck;
};
export const getDiffDeck7 = (listOfHands: number[]): number[] => {
  let deck = CONSTANTS.fullCardsDeckHash_7.slice().filter(c => !listOfHands.includes(c));
  return deck;
};

export const atLeast5Eq = (list: (number | string)[][]): (number | string)[][] => {
  return list.filter(v => {
    let l = v.length;
    let c = 0,
      i = 1;
    while (i < l) {
      if (v[i] === v[i - 1]) {
        c++;
      } else {
        c = 0;
      }
      i++;
      if (c === 4) break;
    }
    return c >= 4;
  });
};
export const getVectorSum = (v: number[]): number => {
  let l: number = v.length;
  let s: number = 0;
  for (let i: number = 0; i < l; i++) {
    s += v[i];
  }
  return s;
};

export const getFlushSuit7 = (v: number[]): number => {
  let t: number = v[0];
  let c: number = 0;
  let i: number = 1;
  while (i < 7) {
    if (t !== v[i]) {
      t = v[i];
      c = 0;
    } else {
      c++;
    }
    i++;
    /* istanbul ignore if  */
    if (c === 4) break;
  }
  return t;
};

export const checkStraight5on7 = (arr: number[]): boolean => {
  let c: number = 0;
  if (
    arr[arr.length - 1] === 12 &&
    arr[0] === 0 &&
    arr.includes(1) &&
    arr.includes(2) &&
    arr.includes(3)
  ) {
    return true;
  }
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i - 1] + 1 === arr[i]) {
      c++;
    } else {
      c = 0;
    }
    /* istanbul ignore if  */
    if (c === 4) break;
  }
  return c >= 4;
};

export const singlePairsList = (startSet: number[]): number[][] => {
  let toAdd = kombinatoricsJs.multiCombinations(startSet, 3, 1);
  let singlePairs = [];
  for (let i = 0; i < startSet.length; ++i) {
    for (let j = 0; j < toAdd.length; ++j) {
      if (!toAdd[j].includes(startSet[i])) {
        singlePairs.push([startSet[i], startSet[i], ...toAdd[j]]);
      }
    }
  }
  return singlePairs;
};

export const internalDoublePairsSort = (a: number[], b: number[]): number => {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
};

export const sortedPairsToAdd = (startSet: number[]): number[][] => {
  let _toAdd = kombinatoricsJs.multiCombinations(startSet, 2, 1);

  _toAdd.forEach(pair => {
    /* istanbul ignore next */
    if (pair[0] < pair[1]) {
      [pair[0], pair[1]] = [pair[1], pair[0]];
    }
  });
  _toAdd.sort(internalDoublePairsSort);

  return _toAdd;
};

export const doublePairsList = (startSet: number[]): number[][] => {
  let toAdd = sortedPairsToAdd(startSet);
  let doublePairs = [];

  for (let j = 0; j < toAdd.length; ++j) {
    for (let i = 0; i < startSet.length; ++i) {
      if (!toAdd[j].includes(startSet[i])) {
        doublePairs.push([toAdd[j][0], toAdd[j][0], toAdd[j][1], toAdd[j][1], startSet[i]]);
      }
    }
  }
  return doublePairs;
};

export const trisList = (startSet: number[]): number[][] => {
  let toAdd = sortedPairsToAdd(startSet);
  let tris = [];
  for (let i = 0; i < startSet.length; ++i) {
    for (let j = 0; j < toAdd.length; ++j) {
      if (!toAdd[j].includes(startSet[i])) {
        tris.push([startSet[i], startSet[i], startSet[i], ...toAdd[j]]);
      }
    }
  }
  return tris;
};

export const fullHouseList = (startSet: number[]): number[][] => {
  let fullHouses = kombinatoricsJs.crossProduct(startSet, 2).filter(p => p[0] !== p[1]);
  return fullHouses.map((hand, idx) => {
    return [hand[0], hand[0], hand[0], hand[1], hand[1]];
  });
};

export const quadsList = (startSet: number[]): number[][] => {
  let quads = kombinatoricsJs.crossProduct(startSet, 2).filter(p => p[0] !== p[1]);
  return quads.map(hand => {
    return [hand[0], hand[0], hand[0], hand[0], hand[1]];
  });
};

export const checkStraight = (arr: number[]): boolean => {
  let cond = true;
  if (arr[4] === 12 && arr[0] === 0) {
    return arr[1] === 1 && arr[2] === 2 && arr[3] === 3;
  }
  for (let i = 1; i < arr.length; ++i) {
    cond = cond && arr[i - 1] + 1 === arr[i];
  }
  return cond;
};

export const checkDoublePair = (hand: number[]): boolean => {
  /* istanbul ignore next */
  return (
    (hand[0] === hand[1] && hand[2] === hand[3] && hand[3] !== hand[4] && hand[1] !== hand[4]) ||
    (hand[0] === hand[1] && hand[3] === hand[4] && hand[3] !== hand[2] && hand[1] !== hand[2]) ||
    (hand[1] === hand[2] && hand[3] === hand[4] && hand[3] !== hand[0] && hand[2] !== hand[0])
  );
};

export const removeStraights = (list: number[][]): number[][] => {
  return list.filter((hand, idx) => {
    return !checkStraight(hand);
  });
};

export const _rankOfHand = (hand: number[], rankHash: NumberMap) => {
  return rankHash[getVectorSum(hand)];
};
export const _rankOf5onX = (hand: number[], rankHash: NumberMap) => {
  let comb = kombinatoricsJs.combinations(hand, 5);
  let max = 0;
  comb.forEach(h => {
    let s = getVectorSum(h);
    let r = rankHash[s];
    max = max < r ? r : max;
  });
  return max;
};

export const handToCardsSymbols = (hand: number[]): string => {
  return hand.map(c => CONSTANTS.rankToFaceSymbol[c % 13]).join('');
};
export const handRankToGroup = (rank: number): string => {
  let groupsRanking = CONSTANTS.handsRankingDelimiter_5cards;
  let i: number = 0;
  let groupName: string = CONSTANTS.handRankingGroupNames[i];
  while (rank > groupsRanking[i]) {
    i++;
    groupName = CONSTANTS.handRankingGroupNames[i];
  }
  return groupName;
};

export const fillRank5 = (h: number[], idx: number, rankingObject: hashRanking): hashRanking => {
  let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
  rankingObject.HASHES[hash] = idx;
  rankingObject.rankingInfos[idx] = {
    hand: h.slice(),
    faces: handToCardsSymbols(h),
    handGroup: handRankToGroup(idx)
  };
  return rankingObject;
};

export const fillRank5PlusFlushes = (
  h: number[],
  idx: number,
  rankingObject: hashRanking,
  offset: number = CONSTANTS.FLUSHES_BASE_START + CONSTANTS.HIGH_CARDS_5_AMOUNT
): hashRanking => {
  let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
  let r = idx + offset;
  rankingObject.HASHES[hash] = r;
  rankingObject.rankingInfos[r] = {
    hand: h.slice(),
    faces: handToCardsSymbols(h),
    handGroup: handRankToGroup(r)
  };
  return rankingObject;
};

export const fillRankFlushes = (h: number[], rankingObject: hashRanking): hashRanking => {
  let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]));
  let rank = rankingObject.HASHES[hash] + CONSTANTS.FLUSHES_BASE_START;
  rankingObject.FLUSH_RANK_HASHES[hash] = rank;
  rankingObject.rankingInfos[rank] = {
    hand: h.slice(),
    faces: handToCardsSymbols(h),
    handGroup: handRankToGroup(rank)
  };

  return rankingObject;
};
