import { hashRanking } from './interfaces';
export declare const createRankOfFiveHashes: () => Readonly<hashRanking>;
/**@TODO add hand code to rankingInfo : [12,0,1,2,3,10,11] this is straight A2345KQ
 * or just retrieve category from rankValue the fine hightest card or components by statical exaustive hand analisys
*/
export declare const createRankOf5On7Hashes: (hashRankOfFive: hashRanking) => hashRanking;
