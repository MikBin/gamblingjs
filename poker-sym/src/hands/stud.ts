import { cardIndex } from '../utils/deck.js';
import { HandGroup } from './types.js';

const RANK_SYMBOLS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;

export const rankSym = (r: number): string => RANK_SYMBOLS[r]!;

/**
 * Enumerate all 455 canonical 3-card starting hands for Stud/Razz.
 *
 * For A-5 Razz, suits are entirely irrelevant, and flushes do not count.
 * A starting hand is uniquely identified by the combination of 3 card ranks (with replacement).
 * C(13 + 3 - 1, 3) = C(15, 3) = 455 possible canonical hands.
 */
export const enumerateStudStartingHands = (): HandGroup[] => {
  const hands: HandGroup[] = [];

  // Iterate all combinations of 3 ranks with replacement
  for (let r1 = 12; r1 >= 0; r1--) {
    for (let r2 = r1; r2 >= 0; r2--) {
      for (let r3 = r2; r3 >= 0; r3--) {
        // r1 >= r2 >= r3 is guaranteed by the loop structure
        const key = `${rankSym(r1)}${rankSym(r2)}${rankSym(r3)}`;

        // Determine suits: if ranks are identical, use different suits to form valid cards.
        let s1 = 0, s2 = 0, s3 = 0;

        if (r1 === r2 && r2 === r3) {
          s1 = 0; s2 = 1; s3 = 2; // e.g. AAA -> As, Ad, Ah
        } else if (r1 === r2) {
          s1 = 0; s2 = 1; s3 = 0; // e.g. AAK -> As, Ad, Ks
        } else if (r2 === r3) {
          s1 = 0; s2 = 0; s3 = 1; // e.g. AKK -> As, Ks, Kd
        } else {
          s1 = 0; s2 = 0; s3 = 0; // e.g. AKQ -> As, Ks, Qs
        }

        const cards = [
          cardIndex(r1, s1),
          cardIndex(r2, s2),
          cardIndex(r3, s3)
        ];

        hands.push({
          key,
          cards,
          description: `Stud Hand ${key}`
        });
      }
    }
  }

  return hands;
};
