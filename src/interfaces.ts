export interface NumberMap {
  [s: number]: number
}
export interface StringMap {
  [s: string]: string
}
export interface hashRanking {
  HASHES: NumberMap
  FLUSH_HASHES?: NumberMap
  baseRankValues: number[]
  baseSuitValues: number[]
  rankingInfos: (string | number)[]
}
