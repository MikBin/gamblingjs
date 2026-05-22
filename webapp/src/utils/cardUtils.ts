// Card image utility functions
// Using local high-quality card images from the assets directory
// Images downloaded from https://github.com/MikBin/html5-playing-cards/tree/master/png/full_color_layout

// Instead of images, we now use CSS-based rendering due to missing assets
export interface CardDetails {
  rank: string;
  suit: string;
  color: string;
  symbol: string;
}

export function getCardDetails(cardIndex: number): CardDetails | null {
  // gamblingjs uses 0-51 for cards.
  // 0 = 2 of clubs, 1 = 3 of clubs ... 12 = Ace of clubs
  // 13 = 2 of diamonds ...
  // 26 = 2 of hearts ...
  // 39 = 2 of spades ...

  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const symbols = ['♣', '♦', '♥', '♠'];
  const colors = ['black', 'red', 'red', 'black'];

  const rankIndex = cardIndex % 13;
  const suitIndex = Math.floor(cardIndex / 13);

  if (suitIndex < 0 || suitIndex > 3) return null; // Invalid

  return {
    rank: ranks[rankIndex],
    suit: suits[suitIndex],
    color: colors[suitIndex],
    symbol: symbols[suitIndex]
  };
}
