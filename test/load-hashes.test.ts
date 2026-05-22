import { describe, it, expect } from 'vitest';
import { loadHashes } from '../src/init';
import { FAST_HASH_DEFINED, HASHES_OF_FIVE_ON_SEVEN } from '../src/pokerHashes7';
import { fastHashesCreators } from '../src/pokerHashes7';

describe('loadHashes', () => {
  it('should load precomputed hashes', () => {
    // Save state
    const originalHigh = FAST_HASH_DEFINED.high;

    // Simulate loading
    FAST_HASH_DEFINED.high = false;

    // Some dummy hash data
    const dummyHashes = {
      '7': {
        high: {
          HASHES: { 123: 456 } as any,
          FLUSH_HASHES: {},
          FLUSH_CHECK_KEYS: {},
          MULTI_FLUSH_RANK_HASHES: {},
          FLUSH_RANK_HASHES: {},
          baseRankValues: [],
          baseSuitValues: [],
          rankingInfos: []
        }
      },
      '6': {}
    };

    loadHashes(dummyHashes as any);

    expect(FAST_HASH_DEFINED.high).toBe(true);
    expect(HASHES_OF_FIVE_ON_SEVEN.HASHES[123]).toBe(456);

    // Restore
    fastHashesCreators.high();
  });
});
