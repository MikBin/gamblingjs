import * as kombinatoricsJs from 'kombinatoricsjs'
import { createRankOfFiveHashes } from './hashesCreator'
import { createRankOf5On7Hashes } from './hashesCreator'

const HASHES_OF_FIVE = createRankOfFiveHashes()

const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE)

//console.log("MAIN:", HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN);
/*
let count = 0;
for (let h in HASHES_OF_FIVE_ON_SEVEN.HASHES) {
  count++;
  if (isNaN(HASHES_OF_FIVE_ON_SEVEN.HASHES[h])) {
    console.log(h, count);
  }
}
*/
export const fac = (n: number) => {
  return kombinatoricsJs.factorial(n)
}

/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio*/
