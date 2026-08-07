// Card encoding: rank = c % 13 (0='2' … 12='A'), suit = floor(c / 13).
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const SUITS = ['♠', '♦', '♥', '♣']; // 0=spades … 3=clubs

export function cardText(c: number): string {
  return RANKS[c % 13]! + SUITS[Math.floor(c / 13)]!;
}

export function cardColor(c: number): string {
  const s = Math.floor(c / 13);
  return s === 1 || s === 2 ? 'text-red-500' : 'text-base-content';
}
