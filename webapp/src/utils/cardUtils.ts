import type { Card } from '../types/poker';

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS = ['♠', '♥', '♦', '♣'];
export const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'];

export function getCardFromIndex(index: number): Card {
  const rank = RANKS[index % 13];
  const suitIndex = Math.floor(index / 13);
  const suit = SUITS[suitIndex];
  const color = suitIndex === 1 || suitIndex === 2 ? 'red' : 'black';

  return {
    index,
    rank,
    suit,
    color
  };
}

export function getCardImagePath(cardIndex: number, format: 'png' | 'svg' = 'png'): string {
  const card = getCardFromIndex(cardIndex);
  const rankFile = card.rank === '10' ? 'T' : card.rank;
  const suitFile = SUIT_NAMES[Math.floor(cardIndex / 13)].charAt(0).toLowerCase();

  return `/assets/cards/${rankFile}${suitFile}-min.${format}`;
}

export function getCardBackPath(color: 'blue' | 'red' | 'green' = 'blue'): string {
  return `/assets/cards/backs/${color}.svg`;
}

export function formatCardString(cardIndex: number): string {
  const card = getCardFromIndex(cardIndex);
  return `${card.rank}${card.suit}`;
}

export function validateCardSelection(cards: number[]): { isValid: boolean; error?: string } {
  if (cards.length > 7) {
    return { isValid: false, error: 'Cannot select more than 7 cards' };
  }

  const uniqueCards = new Set(cards);
  if (uniqueCards.size !== cards.length) {
    return { isValid: false, error: 'Duplicate cards selected' };
  }

  if (cards.some(card => card < 0 || card > 51)) {
    return { isValid: false, error: 'Invalid card index' };
  }

  return { isValid: true };
}

export function getAvailableCards(selectedCards: number[]): number[] {
  const allCards = Array.from({ length: 52 }, (_, i) => i);
  return allCards.filter(card => !selectedCards.includes(card));
}

export function getHandDescription(rank: number): string {
  if (rank >= 6185) return 'Royal Flush';
  if (rank >= 5996) return 'Straight Flush';
  if (rank >= 5863) return 'Four of a Kind';
  if (rank >= 5853) return 'Full House';
  if (rank >= 5822) return 'Flush';
  if (rank >= 5780) return 'Straight';
  if (rank >= 5695) return 'Three of a Kind';
  if (rank >= 5640) return 'Two Pair';
  if (rank >= 5118) return 'One Pair';
  return 'High Card';
}

export function getHandStrengthPercentage(rank: number): number {
  return Math.max(0, Math.min(100, ((6185 - rank) / 6185) * 100));
}

export function getCardColor(cardIndex: number): 'red' | 'black' {
  const suitIndex = Math.floor(cardIndex / 13);
  return suitIndex === 1 || suitIndex === 2 ? 'red' : 'black';
}

export function sortCardsByRank(cards: number[]): number[] {
  return [...cards].sort((a, b) => {
    const rankA = a % 13;
    const rankB = b % 13;
    return rankB - rankA; // Higher ranks first
  });
}

export function sortCardsBySuit(cards: number[]): number[] {
  return [...cards].sort((a, b) => {
    const suitA = Math.floor(a / 13);
    const suitB = Math.floor(b / 13);
    return suitA - suitB;
  });
}
