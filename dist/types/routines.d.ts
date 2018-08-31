import { hashRanking, NumberMap } from './interfaces';
export declare const atLeast5Eq: (list: (string | number)[][]) => (string | number)[][];
export declare const getVectorSum: (v: number[]) => number;
export declare const getFlushSuit7: (v: number[]) => number;
export declare const checkStraight5on7: (arr: number[]) => boolean;
export declare const singlePairsList: (startSet: number[]) => number[][];
export declare const internalDoublePairsSort: (a: number[], b: number[]) => number;
export declare const sortedPairsToAdd: (startSet: number[]) => number[][];
export declare const doublePairsList: (startSet: number[]) => number[][];
export declare const trisList: (startSet: number[]) => number[][];
export declare const fullHouseList: (startSet: number[]) => number[][];
export declare const quadsList: (startSet: number[]) => number[][];
export declare const checkStraight: (arr: number[]) => boolean;
export declare const checkDoublePair: (hand: number[]) => boolean;
export declare const removeStraights: (list: number[][]) => number[][];
export declare const _rankOfHand: (hand: number[], rankHash: NumberMap) => number;
export declare const _rankOf5onX: (hand: number[], rankHash: NumberMap) => number;
export declare const fillRank5: (h: number[], idx: number, rankingObject: hashRanking) => hashRanking;
export declare const fillRank5PlusFlushes: (h: number[], idx: number, rankingObject: hashRanking, offset?: number) => hashRanking;
export declare const fillRankFlushes: (h: number[], rankingObject: hashRanking) => hashRanking;
