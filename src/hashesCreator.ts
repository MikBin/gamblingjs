import * as CONSTANTS from './constants'
import { getVectorSum } from './routines'
import * as ROUTINES from './routines'
import * as kombinatoricsJs from 'kombinatoricsjs'
import { hashRanking } from './interfaces'
import { NumberMap } from './interfaces'

const fillRank5 = (h: number[], idx: number, rankingObject: hashRanking): hashRanking => {
  let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]))
  rankingObject.HASHES[hash] = idx
  rankingObject.rankingInfos.push(idx)
  return rankingObject
}

const fillRank5PlusFlushes = (
  h: number[],
  idx: number,
  rankingObject: hashRanking,
  offset: number = CONSTANTS.FLUSHES_BASE_START + CONSTANTS.HIGH_CARDS_5_AMOUNT
): hashRanking => {
  let hash = getVectorSum(h.map(card => rankingObject.baseRankValues[card]))
  rankingObject.HASHES[hash] = idx + offset
  rankingObject.rankingInfos.push(idx + offset)
  return rankingObject
}

export const createRankOfFiveHashes = (): Readonly<hashRanking> => {
  const hashRankingOfFive: hashRanking = {
    HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn5,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: []
  }

  //const handRankingInfos: (string | number)[] = hashRankingOfFive.rankingInfos;

  const rankCards = CONSTANTS.rankCards
  const STRAIGHTS = CONSTANTS.STRAIGHTS
  const HIGH_CARDS_5_AMOUNT = CONSTANTS.HIGH_CARDS_5_AMOUNT
  let highCards = kombinatoricsJs.multiCombinations(rankCards, 5, 0)
  const HIGH_CARDS = ROUTINES.removeStraights(highCards)
  const SINGLE_PAIRS = ROUTINES.singlePairsList(rankCards)
  const DOUBLE_PAIRS = ROUTINES.doublePairsList(rankCards)
  const TRIPLES = ROUTINES.trisList(rankCards)
  const FULLHOUSES = ROUTINES.fullHouseList(rankCards)
  const QUADS = ROUTINES.quadsList(rankCards)
  console.log(HIGH_CARDS, FULLHOUSES, QUADS)
  let inc = 0
  console.log('high cards', (inc += HIGH_CARDS.length))
  console.log('single pairs', (inc += SINGLE_PAIRS.length))
  console.log('double pairs', (inc += DOUBLE_PAIRS.length))
  console.log('triples', (inc += TRIPLES.length))
  console.log('straights', (inc += STRAIGHTS.length))
  //flushes as many as highcards
  console.log('flushes', (inc += HIGH_CARDS_5_AMOUNT))
  console.log('full houses', (inc += FULLHOUSES.length))
  console.log('quads', (inc += QUADS.length))

  HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS).forEach((h, idx) => {
    return fillRank5(h, idx, hashRankingOfFive)
  })
  FULLHOUSES.concat(QUADS).forEach((h, idx) => {
    return fillRank5PlusFlushes(h, idx, hashRankingOfFive)
  })
  /**
   * @TODO
   * add strightflushes
   */
  /**
   * in evaluator of 5 cards always get the rank then add the flush value
   */
  return hashRankingOfFive
}

const _rankOfFive = (hand: number[], rankHash: NumberMap) => {
  return rankHash[getVectorSum(hand)]
}
const _rankOf5onX = (hand: number[], rankHash: NumberMap) => {
  return Math.max(...kombinatoricsJs.combinations(hand, 5).map(h => rankHash[getVectorSum(h)]))
}

export const createRankOf5On6Hashes = () => {}

export const createRankOf5On7Hashes = (hashRankOfFive: hashRanking) => {
  const hashRankingOfFiveOnSeven: hashRanking = {
    HASHES: {},
    FLUSH_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn7,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: []
  }
  let counter: number = 0
  const rankCards = CONSTANTS.rankCards
  const ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues

  kombinatoricsJs
    .multiCombinations(rankCards, 7, 3)
    .map(hand => hand.map(card => ranksHashOn7[card]))
    .forEach((h: number[], i: number) => {
      let hash: number = getVectorSum(h)
      hashRankingOfFiveOnSeven.HASHES[hash] = _rankOf5onX(h, hashRankOfFive.HASHES)
      counter++
    })

  /**
   * 5 same suits
   * 6 same suits
   * 7 same suits
   * the use best5On6 best5On7
   */
  let fiveFlushes = kombinatoricsJs
    .combinations(rankCards, 5)
    .map(hand => hand.map(card => ranksHashOn7[card]))
  let sixFlushes = kombinatoricsJs
    .combinations(rankCards, 6)
    .map(hand => hand.map(card => ranksHashOn7[card]))
  let sevenFlushes = kombinatoricsJs
    .combinations(rankCards, 7)
    .map(hand => hand.map(card => ranksHashOn7[card]))

  console.log(counter, hashRankingOfFiveOnSeven, sixFlushes, sevenFlushes, fiveFlushes)

  return hashRankingOfFiveOnSeven
}
