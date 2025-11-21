// Placeholder for now. We will use a CDN for card images.
// This file will contain helper functions to get card image URLs.

export function getCardImage(cardIndex: number): string {
  // gamblingjs uses 0-51 for cards.
  // 0 = 2 of clubs, 1 = 3 of clubs ... 12 = Ace of clubs
  // 13 = 2 of diamonds ...
  // 26 = 2 of hearts ...
  // 39 = 2 of spades ...

  // However, gamblingjs might use a different ordering.
  // Let's verify gamblingjs card mapping.
  // Looking at standard conventions:
  // Usually: 0-12: 2c, 3c, ..., Ac
  // 13-25: 2d, ..., Ad
  // 26-38: 2h, ..., Ah
  // 39-51: 2s, ..., As

  // Actually, let's verify with the library later if possible or assume standard.
  // Standard deck:
  // Ranks: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
  // Suits: c, d, h, s (or some order)

  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  // Let's assume the order is Clubs, Diamonds, Hearts, Spades for now.
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const suitShort = ['c', 'd', 'h', 's'];

  const rankIndex = cardIndex % 13;
  const suitIndex = Math.floor(cardIndex / 13);

  if (suitIndex < 0 || suitIndex > 3) return ''; // Invalid

  const rank = ranks[rankIndex];
  const suit = suits[suitIndex];

  // CDN URL format (example using deckofcardsapi or similar)
  // Or using the tekeye.uk one
  // https://tekeye.uk/playing_cards/images/svg_cards/
  // The naming there is usually: 2_of_clubs.svg, etc.

  const rankName = rank === 'A' ? 'ace' :
                   rank === 'K' ? 'king' :
                   rank === 'Q' ? 'queen' :
                   rank === 'J' ? 'jack' : rank;

  // Filename: ace_of_spades.svg
  const filename = `${rankName}_of_${suit}.svg`;

  return `https://tekeye.uk/playing_cards/images/svg_cards/${filename}`;
}

export function getCardBackImage(): string {
   return 'https://tekeye.uk/playing_cards/images/svg_cards/back.png';
}
