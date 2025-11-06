
import { describe, it, expect, beforeAll } from 'vitest';
import { PokerEvaluator, GameVariant } from '../../src/PokerEvaluator';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  generateRandomSevenCardHand,
  measureExecutionTime,
} from '../testUtils';

describe('Performance Tests', () => {

  describe('Hashes Construction', () => {
    it('should measure the construction time for all hash variants', async () => {
      const variants = Object.keys(fastHashesCreators);
      for (const variant of variants) {
        // NOTE: This test is still not perfect because the underlying hash creation
        // might not fully reset between runs. However, without a dedicated reset
        // function, this is the best we can do to measure each creator.
        const { averageTime, totalTime } = await measureExecutionTime(
          () => fastHashesCreators[variant](),
          1 // Measure one full construction
        );
        console.log(`Hash Construction - ${variant}:`);
        console.log(`  Average Time: ${averageTime.toFixed(4)} ms`);
        console.log(`  Total Time: ${totalTime.toFixed(4)} ms`);
      }
    });
  });

  describe('Hand Evaluation', () => {
    let evaluator: PokerEvaluator;

    beforeAll(() => {
      // Create the evaluator instance once. The constructor will build all necessary hashes.
      // This simulates a real-world scenario where setup is a one-time cost.
      evaluator = new PokerEvaluator();
    });

    const handSizes = [5, 7];
    const gameVariants = [
      GameVariant.HIGH,
      GameVariant.LOW_A_TO_5,
      GameVariant.LOW_8_OR_BETTER,
      GameVariant.LOW_9_OR_BETTER,
    ];

    for (const size of handSizes) {
      for (const variant of gameVariants) {
        it(`should measure evaluation time for ${size}-card ${variant} hands`, async () => {
          const { averageTime, totalTime } = await measureExecutionTime(
            () => {
              // Generate a new random hand for each iteration to get a realistic benchmark
              const hand = generateRandomSevenCardHand().slice(0, size);
              evaluator.evaluate(hand, variant);
            },
            1000 // Use a sufficient number of iterations for a stable average
          );
          console.log(`Hand Evaluation - ${size}-card ${variant}:`);
          console.log(`  Average Time: ${(averageTime * 1000).toFixed(4)} µs`); // Log in microseconds
          console.log(`  Total Time: ${totalTime.toFixed(4)} ms`);
        });
      }
    }
  });
});
