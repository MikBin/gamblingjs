import { SeedableRNG } from './rng.js';

/**
 * Card encoding: index = suit * 13 + rank
 * - suit: 0=spades, 1=diamonds, 2=hearts, 3=clubs
 * - rank: 0=2, 1=3, ..., 8=T, 9=J, 10=Q, 11=K, 12=A
 */
export const RANK_COUNT = 13;
export const SUIT_COUNT = 4;
export const DECK_SIZE = 52;

/** Build a card index from rank (0-12) and suit (0-3). */
export const cardIndex = (rank: number, suit: number): number => suit * RANK_COUNT + rank;

/** Extract rank (0-12) from a card index. */
export const cardRank = (card: number): number => card % RANK_COUNT;

/** Extract suit (0-3) from a card index. */
export const cardSuit = (card: number): number => Math.floor(card / RANK_COUNT);

/** Create a full 52-card deck as an array of indices 0..51. */
export const fullDeck = (): number[] => Array.from({ length: DECK_SIZE }, (_, i) => i);

/** Create a deck excluding the given cards. */
export const makeDeck = (exclude: number[]): number[] => {
  const ex = new Set(exclude);
  return fullDeck().filter((c) => !ex.has(c));
};

/** Fisher-Yates shuffle in-place, using the provided RNG. */
export const shuffle = (deck: number[], rng: () => number = Math.random): void => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
};

/** Draw k cards from the deck (mutates deck by removing cards). */
export const draw = (deck: number[], k: number, rng: () => number = Math.random): number[] => {
  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    const j = Math.floor(rng() * deck.length);
    result.push(deck[j]!);
    deck.splice(j, 1);
  }
  return result;
};

/** Draw k cards without mutation (shuffles a copy). */
export const drawCopy = (
  deck: number[],
  k: number,
  rng: SeedableRNG | (() => number) = Math.random,
): number[] => {
  const copy = [...deck];
  const rngFn = typeof rng === 'function' ? rng : () => rng.next();
  shuffle(copy, rngFn);
  return copy.slice(0, k);
};