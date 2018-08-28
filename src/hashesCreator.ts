import * as CONSTANTS from './constants'
import { getVectorSum, _rankOf5onX, fillRank5, fillRank5PlusFlushes } from './routines'
import * as ROUTINES from './routines'
import * as kombinatoricsJs from 'kombinatoricsjs'
import { hashRanking, NumberMap } from './interfaces'

export const createRankOfFiveHashes = (): Readonly<hashRanking> => {
  const hashRankingOfFive: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: CONSTANTS.flush5hHashCheck,
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

  let upToStraights = HIGH_CARDS.concat(SINGLE_PAIRS, DOUBLE_PAIRS, TRIPLES, STRAIGHTS)
  upToStraights.forEach((h, idx) => {
    return fillRank5(h, idx, hashRankingOfFive)
  })
  let aboveStraights = HIGH_CARDS.concat(FULLHOUSES, QUADS, STRAIGHTS)
  aboveStraights.forEach((h, idx) => {
    return fillRank5PlusFlushes(h, idx, hashRankingOfFive)
  })

  //console.log(upToStraights, aboveStraights);
  /**
   * @TODO
   * add strightflushes
   */
  /**
   * in evaluator of 5 cards always get the rank then add the flush value
   */
  return hashRankingOfFive
}

//export const createRankOf5On6Hashes = () => { };

export const createRankOf5On7Hashes = (hashRankOfFive: hashRanking) => {
  const hashRankingOfFiveOnSeven: hashRanking = {
    HASHES: {},
    FLUSH_CHECK_KEYS: {},
    FLUSH_RANK_HASHES: {},
    baseRankValues: CONSTANTS.ranksHashOn7,
    baseSuitValues: CONSTANTS.suitsHash,
    rankingInfos: hashRankOfFive.rankingInfos
  }
  let counter: number = 0
  const rankCards = CONSTANTS.rankCards
  const ranksHashOn7 = hashRankingOfFiveOnSeven.baseRankValues
  const suit7Hash = hashRankingOfFiveOnSeven.baseSuitValues

  kombinatoricsJs.multiCombinations(rankCards, 7, 3).forEach((hand: number[], i: number) => {
    let h7 = hand.map(card => ranksHashOn7[card])
    let h5 = hand.map(card => hashRankOfFive.baseRankValues[card])
    let hash7: number = getVectorSum(h7)
    hashRankingOfFiveOnSeven.HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES)

    counter++
  })
  console.log('7rankhands:', counter)
  /**
   * 5 same suits
   * 6 same suits
   * 7 same suits
   * the use best5On6 best5On7
   */

  const FLUSH_RANK_HASHES = hashRankingOfFiveOnSeven.FLUSH_RANK_HASHES || {}

  let fiveFlushes = kombinatoricsJs.combinations(rankCards, 5)
  let sixFlushes = kombinatoricsJs.combinations(rankCards, 6)
  let sevenFlushes = kombinatoricsJs.combinations(rankCards, 7)

  fiveFlushes.concat(sixFlushes, sevenFlushes).forEach(h => {
    let h5: number[] = h.map(c => hashRankOfFive.baseRankValues[c])
    let h7: number[] = h.map(c => hashRankingOfFiveOnSeven.baseRankValues[c])
    let hash7 = getVectorSum(h7)

    FLUSH_RANK_HASHES[hash7] = _rankOf5onX(h5, hashRankOfFive.HASHES) + CONSTANTS.FLUSHES_BASE_START
  })

  let fiveFlushHashes = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [8, 8, 8, 8, 8], [57, 57, 57, 57, 57]]
  let sixFlushHashes: number[][] = []
  fiveFlushHashes.forEach((v, i) => {
    sixFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]))
  })
  let sevenFlushHashes: number[][] = []

  sixFlushHashes.forEach(v => {
    sevenFlushHashes.push(v.concat([0]), v.concat([1]), v.concat([8]), v.concat([57]))
  })

  let cc = 0
  const FLUSH_CHECK_KEYS = hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS
  /**for testing count all to be 84 and equally distributed */
  fiveFlushHashes.concat(sixFlushHashes, sevenFlushHashes).forEach(h => {
    FLUSH_CHECK_KEYS[getVectorSum(h)] = h[0]
    cc++
  })

  /*console.log(counter, sixFlushes, sevenFlushes, fiveFlushes);
    console.log(cc, fiveFlushHashes, sixFlushHashes, sevenFlushHashes, hashRankingOfFiveOnSeven.FLUSH_CHECK_KEYS);
    console.log("--------", hashRankingOfFiveOnSeven);*/

  return hashRankingOfFiveOnSeven
}
