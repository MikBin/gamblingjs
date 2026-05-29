import { HandGroup } from './types.js';
import { omahaKey, omahaDescription } from './omaha-canonical.js';

/**
 * Generates all C(52, 4) possible Omaha hands,
 * maps each to its canonical representation,
 * and retains only one unique combination per canonical key.
 */
export const enumerateOmahaStartingHands = (): HandGroup[] => {
  const canonicalMap = new Map<string, number[]>();

  // Iterate over all combinations of 4 cards (0 to 51)
  for (let c1 = 0; c1 < 49; c1++) {
    for (let c2 = c1 + 1; c2 < 50; c2++) {
      for (let c3 = c2 + 1; c3 < 51; c3++) {
        for (let c4 = c3 + 1; c4 < 52; c4++) {
          const cards = [c1, c2, c3, c4];
          const key = omahaKey(cards);

          if (!canonicalMap.has(key)) {
            canonicalMap.set(key, cards);
          }
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
      description: omahaDescription(key),
    });
  }

  return hands;
};
