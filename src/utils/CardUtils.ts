/**
 * Utility functions for working with playing cards.
 * Provides conversion between different card representations and validation.
 */

/**
 * Card rank names in order from lowest to highest.
 */
export const RANK_NAMES = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;

/**
 * Card suit names.
 */
export const SUIT_NAMES = ['s', 'd', 'h', 'c'] as const; // spades, diamonds, hearts, clubs (matching constants.ts)

/**
 * Converts a card index (0-51) to a human-readable card string.
 *
 * @param cardIndex - Card index from 0-51
 * @returns Card string in format "Rs" where R is rank and s is suit
 * @example cardIndexToString(0) returns "2s", cardIndexToString(51) returns "Ac"
 */
export function cardIndexToString(cardIndex: number): string {
  if (cardIndex < 0 || cardIndex > 51) {
    throw new Error(`Invalid card index: ${cardIndex}. Must be between 0 and 51.`);
  }

  const rankIndex = cardIndex % 13; // Modulo 13 to get rank (0-12)
  const suitIndex = Math.floor(cardIndex / 13); // Divide by 13 to get suit (0-3)

  return RANK_NAMES[rankIndex] + SUIT_NAMES[suitIndex];
}

/**
 * Converts a human-readable card string to a card index (0-51).
 *
 * @param cardString - Card string in format "Rs" where R is rank and s is suit
 * @returns Card index from 0-51
 * @example stringToCardIndex("2s") returns 0, stringToCardIndex("Ac") returns 51
 */
export function stringToCardIndex(cardString: string): number {
  if (cardString.length !== 2) {
    throw new Error(`Invalid card string: ${cardString}. Must be 2 characters.`);
  }

  const rankChar = cardString[0].toUpperCase();
  const suitChar = cardString[1].toLowerCase();

  const rankIndex = RANK_NAMES.indexOf(rankChar as typeof RANK_NAMES[number]);
  const suitIndex = SUIT_NAMES.indexOf(suitChar as typeof SUIT_NAMES[number]);

  if (rankIndex === -1) {
    throw new Error(`Invalid rank: ${rankChar}. Must be one of: ${RANK_NAMES.join(', ')}`);
  }

  if (suitIndex === -1) {
    throw new Error(`Invalid suit: ${suitChar}. Must be one of: ${SUIT_NAMES.join(', ')}`);
  }

  return rankIndex + (suitIndex * 13); // rank + suit * 13
}

/**
 * Converts an array of card indices to human-readable card strings.
 *
 * @param cardIndices - Array of card indices (0-51)
 * @returns Array of card strings
 */
export function cardIndicesToStrings(cardIndices: number[]): string[] {
  return cardIndices.map(cardIndexToString);
}

/**
 * Converts an array of card strings to card indices.
 *
 * @param cardStrings - Array of card strings
 * @returns Array of card indices (0-51)
 */
export function stringsToCardIndices(cardStrings: string[]): number[] {
  return cardStrings.map(stringToCardIndex);
}

/**
 * Gets the rank index (0-12) from a card index.
 *
 * @param cardIndex - Card index (0-51)
 * @returns Rank index where 0 = 2, 12 = Ace
 */
export function getCardRank(cardIndex: number): number {
  return cardIndex % 13;
}

/**
 * Gets the suit index (0-3) from a card index.
 *
 * @param cardIndex - Card index (0-51)
 * @returns Suit index where 0 = spades, 1 = diamonds, 2 = hearts, 3 = clubs
 */
export function getCardSuit(cardIndex: number): number {
  return Math.floor(cardIndex / 13);
}

/**
 * Gets the rank name from a card index.
 *
 * @param cardIndex - Card index (0-51)
 * @returns Rank name ('2', '3', ..., 'A')
 */
export function getCardRankName(cardIndex: number): string {
  return RANK_NAMES[getCardRank(cardIndex)];
}

/**
 * Gets the suit name from a card index.
 *
 * @param cardIndex - Card index (0-51)
 * @returns Suit name ('c', 'd', 'h', 's')
 */
export function getCardSuitName(cardIndex: number): string {
  return SUIT_NAMES[getCardSuit(cardIndex)];
}

/**
 * Checks if two cards have the same rank.
 *
 * @param card1 - First card index
 * @param card2 - Second card index
 * @returns true if cards have the same rank
 */
export function sameRank(card1: number, card2: number): boolean {
  return getCardRank(card1) === getCardRank(card2);
}

/**
 * Checks if two cards have the same suit.
 *
 * @param card1 - First card index
 * @param card2 - Second card index
 * @returns true if cards have the same suit
 */
export function sameSuit(card1: number, card2: number): boolean {
  return getCardSuit(card1) === getCardSuit(card2);
}

/**
 * Validates that an array contains valid card indices with no duplicates.
 *
 * @param cards - Array of card indices to validate
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateCardIndices(cards: number[]): boolean {
  if (!Array.isArray(cards)) {
    throw new Error('Cards must be an array');
  }

  const seen = new Set<number>();
  for (const card of cards) {
    if (typeof card !== 'number' || !Number.isInteger(card) || card < 0 || card > 51) {
      throw new Error(`Invalid card index: ${card}. Must be integer between 0 and 51.`);
    }
    if (seen.has(card)) {
      throw new Error(`Duplicate card found: ${cardIndexToString(card)}`);
    }
    seen.add(card);
  }

  return true;
}

/**
 * Creates a standard 52-card deck in sorted order.
 *
 * @returns Array of card indices from 0-51
 */
export function createDeck(): number[] {
  const deck: number[] = [];
  for (let i = 0; i < 52; i++) {
    deck.push(i);
  }
  return deck;
}

/**
 * Shuffles an array of cards using Fisher-Yates algorithm.
 *
 * @param cards - Array of card indices to shuffle
 * @returns New shuffled array
 */
export function shuffleCards(cards: number[]): number[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
