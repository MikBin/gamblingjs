/**hashes to be created at boot by default!!!! */

import {
  createRankOfFiveHashes,
  createRankOf5AceToFive_Low8,
  createRankOf5AceToFive_Low9,
  createRankOf5AceToFive_Full,
  createRankOf5AceToSix_Full,
} from './hashesCreator';

/**HIGH*/
export const HASHES_OF_FIVE = createRankOfFiveHashes();
export const FLUSH_CHECK_FIVE = HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
export const HASH_RANK_FIVE = HASHES_OF_FIVE.HASHES;
export const FLUSH_RANK_FIVE = HASHES_OF_FIVE.FLUSH_RANK_HASHES;

/**LOW Ato5*/
export const HASHES_OF_FIVE_LOW8 = createRankOf5AceToFive_Low8();
export const HASH_RANK_FIVE_LOW8 = HASHES_OF_FIVE_LOW8.HASHES;

export const HASHES_OF_FIVE_LOW9 = createRankOf5AceToFive_Low9();
export const HASH_RANK_FIVE_LOW9 = HASHES_OF_FIVE_LOW9.HASHES;

export const HASHES_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
export const HASH_RANK_FIVE_LOW_Ato5 = HASHES_OF_FIVE_LOW_Ato5.HASHES;

/**LOW Ato6*/
export const HASHES_OF_FIVE_Ato6 = createRankOf5AceToSix_Full();
export const HASH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.HASHES;
export const FLUSH_RANK_FIVE_ATO6 = HASHES_OF_FIVE_Ato6.FLUSH_RANK_HASHES;
