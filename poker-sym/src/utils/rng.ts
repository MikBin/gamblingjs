/**
 * Seedable pseudo-random number generator using mulberry32 algorithm.
 * Provides reproducible simulations when given the same seed.
 */
export class SeedableRNG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed;
  }

  /**
   * Returns a pseudo-random number in [0, 1).
   */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a pseudo-random integer in [0, max).
   */
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  /**
   * Returns the current seed state (for serialization/debugging).
   */
  getState(): number {
    return this.state;
  }
}

/**
 * Default unseeded RNG using Math.random().
 */
export const defaultRNG = () => Math.random();