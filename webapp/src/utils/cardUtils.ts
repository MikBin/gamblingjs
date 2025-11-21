// Card image utility functions
// Using local high-quality card images from the assets directory
// Images downloaded from https://github.com/MikBin/html5-playing-cards/tree/master/png/full_color_layout

export function getCardImage(cardIndex: number): string {
  // gamblingjs uses 0-51 for cards.
  // 0 = 2 of clubs, 1 = 3 of clubs ... 12 = Ace of clubs
  // 13 = 2 of diamonds ...
  // 26 = 2 of hearts ...
  // 39 = 2 of spades ...

  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suitShortCodes = ['c', 'd', 'h', 's']; // clubs, diamonds, hearts, spades

  const rankIndex = cardIndex % 13;
  const suitIndex = Math.floor(cardIndex / 13);

  if (suitIndex < 0 || suitIndex > 3) return ''; // Invalid

  const rank = ranks[rankIndex];
  const suitCode = suitShortCodes[suitIndex];

  // Using the high-quality PNG images with short notation (e.g., "2c.png", "Ah.png")
  // Note: 10 is represented as 'T' in the new image naming convention
  const rankCode = rank === '10' ? 'T' : rank;
  const filename = `${rankCode}${suitCode}.png`;

  return `/assets/cards/${filename}`;
}

export function getCardBackImage(): string {
   return '/assets/cards/back.png';
}
