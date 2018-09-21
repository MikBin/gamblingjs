export interface NumberMap {
  [s: number]: number;
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
  straight: number;
  flush: number;
  'full house': number;
  'four of a kind': number;
  'straight flush': number;
  average: number;
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
