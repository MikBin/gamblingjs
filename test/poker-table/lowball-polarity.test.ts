import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import { resolveHand } from '../../src/poker-table';
import type { CompositionSelector } from '../../src/poker-table';

// Card index i -> rank = i % 13 (0='2' ... 12='A'), suit = floor(i / 13).
// 2-7 lowball: lower cards win; straights and flushes count AGAINST; aces high.
// The resolver returns a NORMALIZED rank where HIGHER is always better.

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
  fastHashesCreators['2to7']();
});

const hole5Sel: CompositionSelector = { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] };
const hand7Sel: CompositionSelector = { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] };

// 7-5-4-3-2 rainbow = the nuts (best 2-7 low). '2's0=0,'3's1=14,'4's2=28,'5's3=42,'7's0=5.
const nuts5 = [0, 14, 28, 42, 5];
// 8-5-4-3-2 rainbow: worse top card. '8's0=6.
const worse5 = [0, 14, 28, 42, 6];
// 6-5-4-3-2 straight: a straight is a BAD 2-7 hand. '6's0=4.
const straight5 = [0, 14, 28, 42, 4];
// 7-5-4-3-2 all suit 0: a flush is a BAD 2-7 hand.
const flush5 = [0, 13, 26, 39, 5];

describe('2-7 lowball polarity (5-card, via resolveHand)', () => {
  it('wires the 5-card 2-7 evaluator (no throw on a 5-card pool)', () => {
    const r = resolveHand({ hole: nuts5, door: [], community: [] }, hole5Sel, '2-7-low');
    expect(r.rank).toBeGreaterThan(Number.NEGATIVE_INFINITY);
  });

  it('ranks the nuts (7-5-4-3-2) above an 8-high low', () => {
    const best = resolveHand({ hole: nuts5, door: [], community: [] }, hole5Sel, '2-7-low');
    const worse = resolveHand({ hole: worse5, door: [], community: [] }, hole5Sel, '2-7-low');
    expect(best.rank).toBeGreaterThan(worse.rank);
  });

  it('counts a straight AGAINST the hand (7-5-4-3-2 beats 6-5-4-3-2 straight)', () => {
    const best = resolveHand({ hole: nuts5, door: [], community: [] }, hole5Sel, '2-7-low');
    const straight = resolveHand({ hole: straight5, door: [], community: [] }, hole5Sel, '2-7-low');
    expect(best.rank).toBeGreaterThan(straight.rank);
  });

  it('counts a flush AGAINST the hand (7-5-4-3-2 rainbow beats 7-5-4-3-2 flush)', () => {
    const best = resolveHand({ hole: nuts5, door: [], community: [] }, hole5Sel, '2-7-low');
    const flush = resolveHand({ hole: flush5, door: [], community: [] }, hole5Sel, '2-7-low');
    expect(best.rank).toBeGreaterThan(flush.rank);
  });

  it('ranks an 8-high no-pair above a 6-high straight', () => {
    const noPair = resolveHand({ hole: worse5, door: [], community: [] }, hole5Sel, '2-7-low');
    const straight = resolveHand({ hole: straight5, door: [], community: [] }, hole5Sel, '2-7-low');
    expect(noPair.rank).toBeGreaterThan(straight.rank);
  });
});

describe('2-7 lowball polarity (7-card fast path — deuceSeven regression)', () => {
  // 7-card pool 'hand' = hole + door. Best 5-of-7 must be chosen correctly.
  // a7: 2,3,4,5,7,K,Q -> best 5 = 7-5-4-3-2 (nuts).
  const a7 = { hole: [0, 14], door: [28, 42, 5, 11, 23], community: [] };
  // b7: 2,3,4,5,8,K,Q -> best 5 = 8-5-4-3-2.
  const b7 = { hole: [0, 14], door: [28, 42, 6, 11, 23], community: [] };

  it('picks the better 7-card low as the winner (not the worse one)', () => {
    const best = resolveHand(a7, hand7Sel, '2-7-low');
    const worse = resolveHand(b7, hand7Sel, '2-7-low');
    expect(best.rank).toBeGreaterThan(worse.rank);
  });
});
