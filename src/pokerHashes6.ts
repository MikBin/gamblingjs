import {
  createRankOf5On6Hashes,
  createRankOf6AceToSix_Low,
  createRankOf6AceToFive_Low,
} from './hashesCreator';
import {
  HASHES_OF_FIVE,
  HASHES_OF_FIVE_LOW8,
  HASHES_OF_FIVE_LOW9,
  HASHES_OF_FIVE_LOW_Ato5,
  HASHES_OF_FIVE_Ato6,
} from './pokerHashes5';
import { rankCards_low, rankCards_low8, rankCards_low9 } from './constants';
import { hashRankingSeven, gameTypesBool, gameTypesEvalFunction } from './interfaces';

const baseHashRankingSix: hashRankingSeven = {
  HASHES: {},
  FLUSH_HASHES: {},
  FLUSH_CHECK_KEYS: {},
  MULTI_FLUSH_RANK_HASHES: {},
  FLUSH_RANK_HASHES: {},
  baseRankValues: [],
  baseSuitValues: [],
  rankingInfos: [],
};

export const FAST_HASH_DEFINED_6: gameTypesBool = {
  high: false,
  Ato5: false,
  Ato6: false,
  '2to7': false,
  low8: false,
  low9: false,
};

export const HASHES_OF_FIVE_ON_SIX = JSON.parse(JSON.stringify(baseHashRankingSix));
export const FLUSH_CHECK_SIX = HASHES_OF_FIVE_ON_SIX.FLUSH_CHECK_KEYS;
export const HASH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.HASHES;
export const FLUSH_RANK_SIX = HASHES_OF_FIVE_ON_SIX.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_FIVE_ON_SIX_LOWBALL27 = JSON.parse(JSON.stringify(baseHashRankingSix));
export const FLUSH_CHECK_SIX_LOWBALL27 = HASHES_OF_FIVE_ON_SIX_LOWBALL27.FLUSH_CHECK_KEYS;
export const HASH_RANK_SIX_LOWBALL27 = HASHES_OF_FIVE_ON_SIX_LOWBALL27.HASHES;
export const FLUSH_RANK_SIX_LOWBALL27 = HASHES_OF_FIVE_ON_SIX_LOWBALL27.MULTI_FLUSH_RANK_HASHES;

export const HASHES_OF_SIX_LOW8 = JSON.parse(JSON.stringify(baseHashRankingSix));
export const HASH_RANK_SIX_LOW8 = HASHES_OF_SIX_LOW8.HASHES;
export const HASHES_OF_SIX_LOW9 = JSON.parse(JSON.stringify(baseHashRankingSix));
export const HASH_RANK_SIX_LOW9 = HASHES_OF_SIX_LOW9.HASHES;

export const HASHES_OF_SIX_LOW_Ato5 = JSON.parse(JSON.stringify(baseHashRankingSix));
export const HASH_RANK_SIX_LOW_Ato5 = HASHES_OF_SIX_LOW_Ato5.HASHES;

export const HASHES_OF_SIX_LOW_Ato6 = JSON.parse(JSON.stringify(baseHashRankingSix));
export const FLUSH_CHECK_SIX_ATO6 = HASHES_OF_SIX_LOW_Ato6.FLUSH_CHECK_KEYS;
export const HASH_RANK_SIX_ATO6 = HASHES_OF_SIX_LOW_Ato6.HASHES;
export const FLUSH_RANK_SIX_ATO6 = HASHES_OF_SIX_LOW_Ato6.FLUSH_RANK_HASHES;

const subAssignHashesSix = (target: hashRankingSeven, source: hashRankingSeven) => {
  for (const p in target) {
    // @ts-ignore
    Object.assign(target[p], source[p]);
  }
};

export const fastHashesCreators6: gameTypesEvalFunction = {
  high: () => {
    subAssignHashesSix(HASHES_OF_FIVE_ON_SIX, createRankOf5On6Hashes(HASHES_OF_FIVE));
    FAST_HASH_DEFINED_6.high = true;
  },
  Ato5: () => {
    subAssignHashesSix(
      HASHES_OF_SIX_LOW_Ato5,
      createRankOf6AceToFive_Low(HASHES_OF_FIVE_LOW_Ato5, rankCards_low, true),
    );
    FAST_HASH_DEFINED_6.Ato5 = true;
  },
  Ato6: () => {
    subAssignHashesSix(HASHES_OF_SIX_LOW_Ato6, createRankOf6AceToSix_Low(HASHES_OF_FIVE_Ato6, rankCards_low));
    FAST_HASH_DEFINED_6.Ato6 = true;
  },
  '2to7': () => {
    subAssignHashesSix(
      HASHES_OF_FIVE_ON_SIX_LOWBALL27,
      createRankOf5On6Hashes(HASHES_OF_FIVE, true),
    );
    FAST_HASH_DEFINED_6['2to7'] = true;
  },
  low8: () => {
    subAssignHashesSix(HASHES_OF_SIX_LOW8, createRankOf6AceToFive_Low(HASHES_OF_FIVE_LOW8, rankCards_low8));
    FAST_HASH_DEFINED_6.low8 = true;
  },
  low9: () => {
    subAssignHashesSix(HASHES_OF_SIX_LOW9, createRankOf6AceToFive_Low(HASHES_OF_FIVE_LOW9, rankCards_low9));
    FAST_HASH_DEFINED_6.low9 = true;
  },
};
