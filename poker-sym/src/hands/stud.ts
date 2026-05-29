import { cardIndex } from '../utils/deck.js';
import { HandGroup } from './types.js';

export const enumerateStudStartingHands = (): HandGroup[] => {
  const hands: HandGroup[] = [];

  const rankSym = (r: number) => '23456789TJQKA'[r];

  // 1. Trips
  for (let r = 12; r >= 0; r--) {
    hands.push({
      key: `${rankSym(r)}${rankSym(r)}${rankSym(r)}`,
      cards: [cardIndex(r, 0), cardIndex(r, 1), cardIndex(r, 2)],
      description: `Rolled up ${rankSym(r)}s`,
    });
  }

  // 2. Pairs
  for (let r1 = 12; r1 >= 0; r1--) {
    for (let r2 = 12; r2 >= 0; r2--) {
      if (r1 === r2) continue;

      const str = r1 > r2 ? `${rankSym(r1)}${rankSym(r1)}${rankSym(r2)}` : `${rankSym(r2)}${rankSym(r1)}${rankSym(r1)}`;

      // Pair 2-suited: odd card shares suit with one of the pair cards
      hands.push({
        key: `${str} 2-suited`,
        cards: [cardIndex(r1, 0), cardIndex(r1, 1), cardIndex(r2, 0)],
        description: `Pair of ${rankSym(r1)}s with ${rankSym(r2)} kicker (2-suited)`,
      });

      // Pair rainbow: all different suits
      hands.push({
        key: `${str} rainbow`,
        cards: [cardIndex(r1, 0), cardIndex(r1, 1), cardIndex(r2, 2)],
        description: `Pair of ${rankSym(r1)}s with ${rankSym(r2)} kicker (rainbow)`,
      });
    }
  }

  // 3. Three different ranks
  for (let r1 = 12; r1 >= 2; r1--) {
    for (let r2 = r1 - 1; r2 >= 1; r2--) {
      for (let r3 = r2 - 1; r3 >= 0; r3--) {
        const str = `${rankSym(r1)}${rankSym(r2)}${rankSym(r3)}`;

        // Suited: all suit 0
        hands.push({
          key: `${str} suited`,
          cards: [cardIndex(r1, 0), cardIndex(r2, 0), cardIndex(r3, 0)],
          description: `${str} suited`,
        });

        // 2-suited (high): r1 and r2 share suit 0, r3 is suit 1
        hands.push({
          key: `${str} 2-suited (high)`,
          cards: [cardIndex(r1, 0), cardIndex(r2, 0), cardIndex(r3, 1)],
          description: `${str} 2-suited (high)`,
        });

        // 2-suited (gap): r1 and r3 share suit 0, r2 is suit 1
        hands.push({
          key: `${str} 2-suited (gap)`,
          cards: [cardIndex(r1, 0), cardIndex(r2, 1), cardIndex(r3, 0)],
          description: `${str} 2-suited (gap)`,
        });

        // 2-suited (low): r2 and r3 share suit 0, r1 is suit 1
        hands.push({
          key: `${str} 2-suited (low)`,
          cards: [cardIndex(r1, 1), cardIndex(r2, 0), cardIndex(r3, 0)],
          description: `${str} 2-suited (low)`,
        });

        // Rainbow: suits 0, 1, 2
        hands.push({
          key: `${str} rainbow`,
          cards: [cardIndex(r1, 0), cardIndex(r2, 1), cardIndex(r3, 2)],
          description: `${str} rainbow`,
        });
      }
    }
  }

  return hands;
};