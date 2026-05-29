import { cardIndex } from '../utils/deck.js';
import { HandGroup, HoldemHandType } from './types.js';
import { holdemKey, holdemHandType, holdemDescription } from './canonical.js';

/**
 * Enumerate all 169 canonical Texas Hold'em starting hands.
 *
 * For each hand, generates a canonical key and a representative concrete
 * card pair (using suit 0 for suited, suits 0+1 for pairs/offsuit).
 */
export const enumerateHoldemStartingHands = (): HandGroup[] => {
  const hands: HandGroup[] = [];

  for (let hi = 12; hi >= 0; hi--) {
    // Pair: use suits 0 and 1
    const pairCards = [cardIndex(hi, 0), cardIndex(hi, 1)];
    const pairKey = holdemKey(hi, hi, false);
    hands.push({
      key: pairKey,
      cards: pairCards,
      description: holdemDescription(pairKey),
    });

    for (let lo = hi - 1; lo >= 0; lo--) {
      // Suited: both use suit 0
      const suitedCards = [cardIndex(hi, 0), cardIndex(lo, 0)];
      const suitedKey = holdemKey(hi, lo, true);
      hands.push({
        key: suitedKey,
        cards: suitedCards,
        description: holdemDescription(suitedKey),
      });

      // Offsuit: hi uses suit 0, lo uses suit 1
      const offsuitCards = [cardIndex(hi, 0), cardIndex(lo, 1)];
      const offsuitKey = holdemKey(hi, lo, false);
      hands.push({
        key: offsuitKey,
        cards: offsuitCards,
        description: holdemDescription(offsuitKey),
      });
    }
  }

  return hands;
};

/** Total number of canonical hold'em starting hands. */
export const HOLDEM_HAND_COUNT = 169; // 13 pairs + 78 suited + 78 offsuit