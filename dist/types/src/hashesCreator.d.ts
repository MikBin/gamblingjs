import { hashRanking, hashRankingSeven } from './interfaces';
export declare const createRankOfFiveHashes: () => Readonly<hashRanking>;
export declare const createRankOf5On7Hashes: (hashRankOfFive: hashRanking, INVERTED?: boolean) => Readonly<hashRankingSeven>;
export declare const createRankOf5AceToFive_Low8: () => Readonly<hashRanking>;
export declare const createRankOf5AceToFive_Full: () => Readonly<hashRanking>;
export declare const createRankOf5AceToSix_Full: () => Readonly<hashRanking>;
export declare const createRankOf7AceToSix_Low: (hashRankOfFive: hashRanking, baseLowRanking: number[]) => Readonly<hashRankingSeven>;
export declare const createRankOf7AceToFive_Low: (hashRankOfFive: hashRanking, baseLowRanking: number[], fullFlag?: boolean) => Readonly<hashRankingSeven>;
export declare const createRankOf5AceToFive_Low9: () => hashRanking;
