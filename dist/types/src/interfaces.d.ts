export interface NumberMap {
    [s: number]: number;
}
export interface MultiNumberMap {
    [s: number]: NumberMap;
}
export interface StringMap {
    [s: string]: string;
}
export interface NumberToStringMap {
    [s: number]: string | number;
}
export interface StringToNumberMap {
    [s: string]: number;
}
export interface handInfo {
    hand: number[];
    faces: string;
    handGroup: string;
}
export interface hiLowRank {
    hi: number;
    low: number;
}
export interface verboseHandInfo extends handInfo {
    winningCards: (number | string)[];
    flushSuit: string | number;
    handRank: number;
}
export interface handCategoryDistribution extends StringToNumberMap {
    'high card': number;
    'one pair': number;
    'two pair': number;
    'three of a kind': number;
    'straight': number;
    'flush': number;
    'full house': number;
    'four of a kind': number;
    'straight flush': number;
    'average': number;
}
export interface hashRanking {
    HASHES: NumberMap;
    FLUSH_HASHES: NumberMap;
    FLUSH_CHECK_KEYS: NumberMap;
    FLUSH_RANK_HASHES: NumberMap;
    baseRankValues: number[];
    baseSuitValues: number[];
    rankingInfos: handInfo[];
}
export interface hashRankingSeven extends hashRanking {
    MULTI_FLUSH_RANK_HASHES: MultiNumberMap;
}
export declare type singleRankFiveCardHandEvalFn = (c1: number, c2: number, c3: number, c4: number, c5: number) => number;
export declare type hiLowRankFiveCardHandEvalFn = (c1: number, c2: number, c3: number, c4: number, c5: number) => hiLowRank;
export declare type singleRankSevenCardHandEvalFn = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number;
export declare type hiLowRankSevenCardHandEvalFn = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => hiLowRank;
export interface gameTypesEvalFunction {
    "high": Function;
    "Ato5": Function;
    "Ato6": Function;
    "2to7": Function;
    "low8": Function;
    "low9": Function;
}
export interface gameTypesBool {
    "high": boolean;
    "Ato5": boolean;
    "Ato6": boolean;
    "2to7": boolean;
    "low8": boolean;
    "low9": boolean;
}
