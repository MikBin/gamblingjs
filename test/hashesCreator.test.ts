import { createRankOfFiveHashes, createRankOf5On7Hashes } from '../src/hashesCreator'

describe('testing rank of 5 and 7 hashes creator', () => {
  const HASHES_OF_FIVE = createRankOfFiveHashes()
  it('has 7462 hands', () => {
    expect(HASHES_OF_FIVE.rankingInfos.length).toBe(7462)
  })
  const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE)
  it('has 7462 hands too', () => {
    expect(HASHES_OF_FIVE_ON_SEVEN.rankingInfos.length).toBe(7462)
  })
  let counter = 0
  for (let h in HASHES_OF_FIVE_ON_SEVEN.HASHES) {
    counter++
  }
  it('has a lot of hands', () => {
    expect(counter).toBe(48347)
  })
})
