import { describe, it, expect } from 'vitest';
import { omahaKey, omahaRankPattern, omahaSuitPattern } from '../src/hands/omaha-canonical.js';
import { cardIndex } from '../src/utils/deck.js';
import { OmahaRankPattern, OmahaSuitPattern } from '../src/hands/types.js';

describe('omahaRankPattern', () => {
  it('identifies quads pattern', () => {
    const cards = [cardIndex(12,0), cardIndex(12,1), cardIndex(12,2), cardIndex(12,3)];
    expect(omahaRankPattern(cards)).toBe(OmahaRankPattern.QUADS);
  });

  it('identifies trips pattern', () => {
    const cards = [cardIndex(12,0), cardIndex(12,1), cardIndex(12,2), cardIndex(11,0)];
    expect(omahaRankPattern(cards)).toBe(OmahaRankPattern.TRIPS);
  });

  it('identifies two-pair pattern', () => {
    const cards = [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(11,1)];
    expect(omahaRankPattern(cards)).toBe(OmahaRankPattern.TWO_PAIR);
  });

  it('identifies one-pair pattern', () => {
    const cards = [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(10,0)];
    expect(omahaRankPattern(cards)).toBe(OmahaRankPattern.ONE_PAIR);
  });

  it('identifies high-card pattern', () => {
    const cards = [cardIndex(12,0), cardIndex(11,1), cardIndex(10,2), cardIndex(9,3)];
    expect(omahaRankPattern(cards)).toBe(OmahaRankPattern.HIGH);
  });
});

describe('omahaSuitPattern', () => {
  it('identifies monosuit', () => {
    const cards = [cardIndex(12,0), cardIndex(11,0), cardIndex(10,0), cardIndex(9,0)];
    expect(omahaSuitPattern(cards)).toBe(OmahaSuitPattern.MONOSUIT);
  });

  it('identifies double-suited', () => {
    const cards = [cardIndex(12,0), cardIndex(11,0), cardIndex(10,1), cardIndex(9,1)];
    expect(omahaSuitPattern(cards)).toBe(OmahaSuitPattern.DOUBLE_SUITED);
  });

  it('identifies three-one', () => {
    const cards = [cardIndex(12,0), cardIndex(11,0), cardIndex(10,0), cardIndex(9,1)];
    expect(omahaSuitPattern(cards)).toBe(OmahaSuitPattern.THREE_ONE);
  });

  it('identifies two-one-one', () => {
    const cards = [cardIndex(12,0), cardIndex(11,0), cardIndex(10,1), cardIndex(9,2)];
    expect(omahaSuitPattern(cards)).toBe(OmahaSuitPattern.TWO_ONE_ONE);
  });

  it('identifies rainbow', () => {
    const cards = [cardIndex(12,0), cardIndex(11,1), cardIndex(10,2), cardIndex(9,3)];
    expect(omahaSuitPattern(cards)).toBe(OmahaSuitPattern.RAINBOW);
  });
});

describe('omahaKey', () => {
  it('produces unique keys for non-isomorphic hands', () => {
    const hand1 = [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(11,1)];
    const hand2 = [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(11,2)];
    expect(omahaKey(hand1)).not.toEqual(omahaKey(hand2));
  });

  it('produces same key for isomorphic hands', () => {
    const hand1 = [cardIndex(12,0), cardIndex(12,1), cardIndex(11,0), cardIndex(11,1)];
    const hand2 = [cardIndex(12,2), cardIndex(12,3), cardIndex(11,2), cardIndex(11,3)];
    expect(omahaKey(hand1)).toEqual(omahaKey(hand2));
  });
});
