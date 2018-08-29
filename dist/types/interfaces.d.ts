export interface NumberMap {
    [s: number]: number;
}
export interface StringMap {
    [s: string]: string;
}
export interface NumberToStringMap {
    [s: number]: string | number;
}
export interface hashRanking {
    HASHES: NumberMap;
    FLUSH_HASHES: NumberMap;
    FLUSH_CHECK_KEYS: NumberMap;
    FLUSH_RANK_HASHES: NumberMap;
    baseRankValues: number[];
    baseSuitValues: number[];
    rankingInfos: (string | number)[];
}
