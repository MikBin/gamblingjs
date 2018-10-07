import { hashRanking, NumberMap } from './interfaces';
export declare const getDiffDeck5: (listOfHands: number[]) => number[];
export declare const getDiffDeck7: (listOfHands: number[]) => number[];
export declare const atLeast5Eq: (list: (string | number)[][]) => (string | number)[][];
export declare const getVectorSum: (v: number[]) => number;
export declare const getFlushSuit7: (v: number[]) => number;
export declare const checkStraight5on7: (arr: number[]) => boolean;
export declare const singlePairsList: (startSet: number[]) => number[][];
export declare const internalDoublePairsSort: (a: number[], b: number[]) => number;
export declare const sortedPairsToAdd: (startSet: number[]) => number[][];
export declare const doublePairsList: (startSet: number[], isLow?: boolean) => number[][];
export declare const trisList: (startSet: number[], isLow?: boolean) => number[][];
export declare const fullHouseList: (startSet: number[]) => number[][];
export declare const quadsList: (startSet: number[]) => number[][];
export declare const checkStraight: (arr: number[]) => boolean;
export declare const checkDoublePair: (hand: number[]) => boolean;
export declare const removeStraights: (list: number[][]) => number[][];
export declare const _rankOfHand: (hand: number[], rankHash: NumberMap) => number;
export declare const _rankOf5onX: (hand: number[], rankHash: NumberMap, INVERTED?: boolean) => number;
/**
 * @function filterWinningCards
 * @param {Array} fullHand array of indexes in deck of cards 0..51
 * @param {Array} winningRanks array of 5 cards indexes
 * @return {Array} only cards of winning hand
 */
export declare const filterWinningCards: (fullHand: number[], winningRanks: number[]) => number[];
/**
 * @function handToCardsSymbols
 * @param {Array} hand array of indexes in deck of cards 0..51
 * @return {Array} char face symbols representation of the indexed hand
 */
export declare const handToCardsSymbols: (hand: number[]) => string;
export declare const handRankToGroup: (rank: number, groupsRanking?: number[], groupNameMap?: string[]) => string;
export declare const fillRank5Ato5: (h: number[], idx: number, rankingObject: hashRanking) => hashRanking;
export declare const fillRank5: (h: number[], idx: number, rankingObject: hashRanking, groupsRanking?: number[], groupNameMap?: string[]) => hashRanking;
export declare const fillRank5_ato5: (h: number[], idx: number, rankingObject: hashRanking) => hashRanking;
export declare const fillRank5PlusFlushes: (h: number[], idx: number, rankingObject: hashRanking, offset?: number) => hashRanking;
export declare const fillRankFlushes: (h: number[], rankingObject: hashRanking) => hashRanking;
