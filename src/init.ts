import { fastHashesCreators } from './pokerHashes7';
import { fastHashesCreators6 } from './pokerHashes6';
import { gameTypesBool, gameTypesEvalFunction, hashRankingSeven } from './interfaces';
import {
  HASHES_OF_FIVE_ON_SEVEN,
  HASHES_OF_SEVEN_LOW_Ato5,
  HASHES_OF_SEVEN_LOW_Ato6,
  HASHES_OF_FIVE_ON_SEVEN_LOWBALL27,
  HASHES_OF_SEVEN_LOW8,
  HASHES_OF_SEVEN_LOW9,
  FAST_HASH_DEFINED,
} from './pokerHashes7';
import {
  HASHES_OF_FIVE_ON_SIX,
  HASHES_OF_SIX_LOW_Ato5,
  HASHES_OF_SIX_LOW_Ato6,
  HASHES_OF_FIVE_ON_SIX_LOWBALL27,
  HASHES_OF_SIX_LOW8,
  HASHES_OF_SIX_LOW9,
  FAST_HASH_DEFINED_6,
} from './pokerHashes6';

export interface PrecomputedHashes {
  7: {
    high?: hashRankingSeven;
    Ato5?: hashRankingSeven;
    Ato6?: hashRankingSeven;
    '2to7'?: hashRankingSeven;
    low8?: hashRankingSeven;
    low9?: hashRankingSeven;
  };
  6: {
    high?: hashRankingSeven;
    Ato5?: hashRankingSeven;
    Ato6?: hashRankingSeven;
    '2to7'?: hashRankingSeven;
    low8?: hashRankingSeven;
    low9?: hashRankingSeven;
  };
}

const assignHashRanking = (target: hashRankingSeven, source: hashRankingSeven) => {
  if (!source) return;
  for (const p in target) {
    // @ts-ignore
    Object.assign(target[p], source[p]);
  }
};

/**
 * Load precomputed hashes from a JSON object.
 */
export const loadHashes = (hashes: PrecomputedHashes) => {
  if (hashes['7']) {
    if (hashes['7'].high) {
      assignHashRanking(HASHES_OF_FIVE_ON_SEVEN, hashes['7'].high);
      FAST_HASH_DEFINED.high = true;
    }
    if (hashes['7'].Ato5) {
      assignHashRanking(HASHES_OF_SEVEN_LOW_Ato5, hashes['7'].Ato5);
      FAST_HASH_DEFINED.Ato5 = true;
    }
    if (hashes['7'].Ato6) {
      assignHashRanking(HASHES_OF_SEVEN_LOW_Ato6, hashes['7'].Ato6);
      FAST_HASH_DEFINED.Ato6 = true;
    }
    if (hashes['7']['2to7']) {
      assignHashRanking(HASHES_OF_FIVE_ON_SEVEN_LOWBALL27, hashes['7']['2to7']);
      FAST_HASH_DEFINED['2to7'] = true;
    }
    if (hashes['7'].low8) {
      assignHashRanking(HASHES_OF_SEVEN_LOW8, hashes['7'].low8);
      FAST_HASH_DEFINED.low8 = true;
    }
    if (hashes['7'].low9) {
      assignHashRanking(HASHES_OF_SEVEN_LOW9, hashes['7'].low9);
      FAST_HASH_DEFINED.low9 = true;
    }
  }

  if (hashes['6']) {
    if (hashes['6'].high) {
      assignHashRanking(HASHES_OF_FIVE_ON_SIX, hashes['6'].high);
      FAST_HASH_DEFINED_6.high = true;
    }
    if (hashes['6'].Ato5) {
      assignHashRanking(HASHES_OF_SIX_LOW_Ato5, hashes['6'].Ato5);
      FAST_HASH_DEFINED_6.Ato5 = true;
    }
    if (hashes['6'].Ato6) {
      assignHashRanking(HASHES_OF_SIX_LOW_Ato6, hashes['6'].Ato6);
      FAST_HASH_DEFINED_6.Ato6 = true;
    }
    if (hashes['6']['2to7']) {
      assignHashRanking(HASHES_OF_FIVE_ON_SIX_LOWBALL27, hashes['6']['2to7']);
      FAST_HASH_DEFINED_6['2to7'] = true;
    }
    if (hashes['6'].low8) {
      assignHashRanking(HASHES_OF_SIX_LOW8, hashes['6'].low8);
      FAST_HASH_DEFINED_6.low8 = true;
    }
    if (hashes['6'].low9) {
      assignHashRanking(HASHES_OF_SIX_LOW9, hashes['6'].low9);
      FAST_HASH_DEFINED_6.low9 = true;
    }
  }
};

/**
 * Generate all hashes asynchronously so as not to block the main thread.
 * This function can be used instead of synchronous `fastHashesCreators`
 * to initialize the library without freezing the UI.
 */
export const initHashesAsync = async () => {
  const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

  const tasks7 = [
    { name: 'high', fn: fastHashesCreators.high },
    { name: 'Ato5', fn: fastHashesCreators.Ato5 },
    { name: 'Ato6', fn: fastHashesCreators.Ato6 },
    { name: '2to7', fn: fastHashesCreators['2to7'] },
    { name: 'low8', fn: fastHashesCreators.low8 },
    { name: 'low9', fn: fastHashesCreators.low9 },
  ];

  for (const task of tasks7) {
    if (!FAST_HASH_DEFINED[task.name as keyof gameTypesBool]) {
      task.fn();
      await yieldToMain();
    }
  }

  const tasks6 = [
    { name: 'high', fn: fastHashesCreators6.high },
    { name: 'Ato5', fn: fastHashesCreators6.Ato5 },
    { name: 'Ato6', fn: fastHashesCreators6.Ato6 },
    { name: '2to7', fn: fastHashesCreators6['2to7'] },
    { name: 'low8', fn: fastHashesCreators6.low8 },
    { name: 'low9', fn: fastHashesCreators6.low9 },
  ];

  for (const task of tasks6) {
    if (!FAST_HASH_DEFINED_6[task.name as keyof gameTypesBool]) {
      task.fn();
      await yieldToMain();
    }
  }
};
