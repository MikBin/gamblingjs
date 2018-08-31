import * as kombinatoricsJs from 'kombinatoricsjs';
import { createRankOfFiveHashes, createRankOf5On7Hashes } from './hashesCreator';

import { handOfSevenEvalIndexed } from './pokerEvaluators';

const HASHES_OF_FIVE = createRankOfFiveHashes();

const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);

//console.log("MAIN:", HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN, handOfSevenEvalIndexed(12, 0, 1, 2, 3, 34, 23));

export default handOfSevenEvalIndexed;

/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio*/
