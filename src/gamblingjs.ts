import * as kombinatoricsJs from 'kombinatoricsjs'
import { createRankOfFiveHashes } from './hashesCreator'
import { createRankOf5On7Hashes } from './hashesCreator'

const HASHES_OF_FIVE = createRankOfFiveHashes()

const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE)

console.log(HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN)

export const fac = (n: number) => {
  return kombinatoricsJs.factorial(n)
}
