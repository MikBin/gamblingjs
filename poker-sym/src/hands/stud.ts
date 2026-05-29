import { HandGroup } from './types.js';
import { studKey, studDescription } from './stud-canonical.js';

/**
 * Generates all C(52, 3) possible Stud hands,
 * maps each to its canonical representation,
 * and retains only one unique combination per canonical key.
 */
export const enumerateStudStartingHands = (): HandGroup[] => {
  const canonicalMap = new Map<string, number[]>();

  // Iterate over all combinations of 3 cards (0 to 51)
  for (let c1 = 0; c1 < 50; c1++) {
    for (let c2 = c1 + 1; c2 < 51; c2++) {
      for (let c3 = c2 + 1; c3 < 52; c3++) {
        const cards = [c1, c2, c3];
        const key = studKey(cards);

        if (!canonicalMap.has(key)) {
          canonicalMap.set(key, cards);
        }
      }
    }
  }

  // Convert the map to an array of HandGroup objects
  const hands: HandGroup[] = [];
  for (const [key, cards] of canonicalMap.entries()) {
    hands.push({
      key,
      cards,
      description: studDescription(key),
    });
  }

  return hands;
};
