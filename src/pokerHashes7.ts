import {
  createRankOf5On7Hashes,
  createRankOf7AceToSix_Low,
  createRankOf7AceToFive_Low,
} from './hashesCreator';
import {
  HASHES_OF_FIVE,
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9,
  HASHES_OF_FIVE_LOW_Ato5,
  HASHES_OF_FIVE_Ato6,
} from './pokerHashes5';
import { rankCards_low, rankCards_low8, rankCards_low9, gameType } from './constants';
import { hashRankingSeven, gameTypesBool, gameTypesEvalFunction } from './interfaces';

const baseHashRankingSeven: hashRankingSeven = {
  HASHES: {},
  FLUSH_HASHES: {},
  FLUSH_CHECK_KEYS: {},
  MULTI_FLUSH_RANK_HASHES: {},
  FLUSH_RANK_HASHES: {},
  baseRankValues: [],
  baseSuitValues: [],
  rankingInfos: [],
};
/**make a config file like this:
 *
 * {
 * createOnBoot: {7:{high:true,low8:false....}}
 * }
 *
 * if an HASH is not created on boot clone an empty template
 * during runtime creation use Object.assign(HASH_OF_SEVEN,createRankOf5On7Hashes)
 */
export const FAST_HASH_DEFINED: gameTypesBool = {
  high: false,
  Ato5: false,
  Ato6: false,
  '2to7': false,
  low8: false,
  low9: false,
};

/*
export const HASHES_OF_FIVE_ON_SEVEN = createRankOf5On7Hashes(HASHES_OF_FIVE);
export const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
export const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = createRankOf5On7Hashes(HASHES_OF_FIVE, true);
export const FLUSH_CHECK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
export const FLUSH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_SEVEN_LOW8 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8);
export const HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
export const HASHES_OF_SEVEN_LOW9 = createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9);
export const HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;
export const HASHES_OF_SEVEN_LOW_Ato5 = createRankOf7AceToFive_Low(
  HASHES_OF_FIVE_LOW_Ato5,
  rankCards_low,
  true
);
export const HASH_RANK_SEVEN_LOW_Ato5 = HASHES_OF_SEVEN_LOW_Ato5.HASHES;

export const HASHES_OF_SEVEN_LOW_Ato6 = createRankOf7AceToSix_Low(
  HASHES_OF_FIVE_Ato6,
  rankCards_low
);
export const FLUSH_CHECK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.HASHES;
export const FLUSH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;
*/

export const HASHES_OF_FIVE_ON_SEVEN = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const FLUSH_CHECK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.HASHES;
export const FLUSH_RANK_SEVEN = HASHES_OF_FIVE_ON_SEVEN.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27 = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const FLUSH_CHECK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.HASHES;
export const FLUSH_RANK_SEVEN_LOWBALL27 = HASHES_OF_FIVE_ON_SEVEN_LOWBALL27.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_SEVEN_LOW8 = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const HASH_RANK_SEVEN_LOW8 = HASHES_OF_SEVEN_LOW8.HASHES;
export const HASHES_OF_SEVEN_LOW9 = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const HASH_RANK_SEVEN_LOW9 = HASHES_OF_SEVEN_LOW9.HASHES;

export const HASHES_OF_SEVEN_LOW_Ato5 = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const HASH_RANK_SEVEN_LOW_Ato5 = HASHES_OF_SEVEN_LOW_Ato5.HASHES;

export const HASHES_OF_SEVEN_LOW_Ato6 = JSON.parse(JSON.stringify(baseHashRankingSeven));
export const FLUSH_CHECK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_CHECK_KEYS;
export const HASH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.HASHES;
export const FLUSH_RANK_SEVEN_ATO6 = HASHES_OF_SEVEN_LOW_Ato6.FLUSH_RANK_HASHES;

const subAssignHashesSeven = (target: hashRankingSeven, source: hashRankingSeven) => {
  for (const p in target) {
    //@ts-ignore
    Object.assign(target[p], source[p]);
  }
};
export const fastHashesCreators: gameTypesEvalFunction = {
  high: () => {
    subAssignHashesSeven(HASHES_OF_FIVE_ON_SEVEN, createRankOf5On7Hashes(HASHES_OF_FIVE));
    FAST_HASH_DEFINED.high = true;
  },
  Ato5: () => {
    subAssignHashesSeven(
      HASHES_OF_SEVEN_LOW_Ato5,
      createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW_Ato5, rankCards_low, true),
    );
    FAST_HASH_DEFINED.Ato5 = true;
  },
  Ato6: () => {
    subAssignHashesSeven(
      HASHES_OF_SEVEN_LOW_Ato6,
      createRankOf7AceToSix_Low(HASHES_OF_FIVE_Ato6, rankCards_low),
    );
    FAST_HASH_DEFINED.Ato6 = true;
  },
  '2to7': () => {
    subAssignHashesSeven(
      HASHES_OF_FIVE_ON_SEVEN_LOWBALL27,
      createRankOf5On7Hashes(HASHES_OF_FIVE, true),
    );
    FAST_HASH_DEFINED['2to7'] = true;
  },
  low8: () => {
    subAssignHashesSeven(
      HASHES_OF_SEVEN_LOW8,
      createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8),
    );
    FAST_HASH_DEFINED.low8 = true;
  },
  low9: () => {
    subAssignHashesSeven(
      HASHES_OF_SEVEN_LOW9,
      createRankOf7AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9),
    );
    FAST_HASH_DEFINED.low9 = true;
  },
};
/**do not export rank of 7 hashes...just export a function wrapper that could return falsy
 * in test files create all hashes
 * function replacement will be in gamblingjs.ts where a big object contains all evaluators (here they can be swapped for the faster one)
 */
