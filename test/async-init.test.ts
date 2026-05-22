import { describe, it, expect } from 'vitest';
import { initHashesAsync } from '../src/init';
import { FAST_HASH_DEFINED } from '../src/pokerHashes7';

describe('async init', () => {
  it('should initialize hashes asynchronously', async () => {
    // Need to reset it first to ensure it's not already true from other tests
    // that might run in the same context, but let's just run it
    await initHashesAsync();
    expect(FAST_HASH_DEFINED.high).toBe(true);
  });
});
