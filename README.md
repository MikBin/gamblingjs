# GamblingJS

A comprehensive TypeScript library for evaluating various poker and casino games with high-performance algorithms and extensive game variant support.

## Features

- **Multiple Game Variants**: Support for Texas Hold'em, Omaha, and various poker formats
- **High-Performance Evaluation**: Optimized algorithms for fast hand evaluation
- **Comprehensive API**: Both simple and advanced interfaces for different use cases
- **TypeScript Support**: Full type definitions and IntelliSense support
- **Card Utilities**: Helper functions for card representation and validation
- **Backward Compatibility**: Legacy API maintained for existing projects

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Card Representation](#card-representation)
- [API Reference](#api-reference)
  - [New Unified API](#new-unified-api)
  - [Legacy API](#legacy-api)
- [Game Variants](#game-variants)
- [Usage Examples](#usage-examples)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

### NPM Installation

```bash
npm install gamblingjs
```

### Yarn Installation

```bash
yarn add gamblingjs
```

### Browser Usage

For browser usage, include the UMD build from a CDN:

```html
<script src="https://unpkg.com/gamblingjs/dist/gamblingjs.umd.js"></script>
```

## Quick Start

```typescript
import { PokerEvaluator, GameVariant, stringToCardIndex } from 'gamblingjs';

// Convert card strings to indices
const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts'].map(stringToCardIndex);

// Evaluate a 5-card hand
const rank = PokerEvaluator.evaluate5Cards(hand, GameVariant.HIGH);
console.log(`Hand rank: ${rank}`); // Lower numbers indicate stronger hands
```

## Card Representation

GamblingJS uses a numeric representation for cards (0-51):

- **Card Indices**: Each card is represented by an integer from 0 to 51
- **Rank Mapping**: 0-2, 1-3, ..., 8-T, 9-J, 10-Q, 11-K, 12-A
- **Suit Mapping**: 0-spades, 1-diamonds, 2-hearts, 3-clubs
- **Card Formula**: `cardIndex = rankIndex + (suitIndex * 13)`

### Card String Format

Cards can also be represented using strings:
- Format: `[Rank][Suit]`
- Ranks: `2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A`
- Suits: `s` (spades), `d` (diamonds), `h` (hearts), `c` (clubs)
- Examples: `As` (Ace of spades), `Kc` (King of clubs), `Th` (Ten of hearts)

### Conversion Utilities

```typescript
import { stringToCardIndex, cardIndexToString, stringsToCardIndices } from 'gamblingjs';

// Convert string to index
const aceOfSpades = stringToCardIndex('As'); // Returns 0

// Convert index to string
const cardString = cardIndexToString(0); // Returns "2s"

// Convert arrays
const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts'];
const indices = stringsToCardIndices(hand);
```

## API Reference

### New Unified API

The new unified API provides a clean, consistent interface for all poker evaluations.

#### PokerEvaluator Class

The main class for evaluating poker hands across different game variants.

```typescript
import { PokerEvaluator, GameVariant } from 'gamblingjs';
```

#### Static Methods

##### `PokerEvaluator.evaluate5Cards(hand, variant?)`

Evaluates a 5-card poker hand.

```typescript
static evaluate5Cards(
  hand: number[], 
  variant: GameVariant = GameVariant.HIGH
): number
```

**Parameters:**
- `hand`: Array of 5 card indices (0-51)
- `variant`: Game variant to evaluate for (optional, defaults to HIGH)

**Returns:** Numeric rank (lower is better for high games, higher is better for low games)

##### `PokerEvaluator.evaluate7Cards(hand, variant?)`

Evaluates a 7-card poker hand.

```typescript
static evaluate7Cards(
  hand: number[], 
  variant: GameVariant = GameVariant.HIGH
): number
```

**Parameters:**
- `hand`: Array of 7 card indices (0-51)
- `variant`: Game variant to evaluate for (optional, defaults to HIGH)

**Returns:** Numeric rank of the best 5-card combination

##### `PokerEvaluator.evaluate7CardsVerbose(hand, variant?)`

Evaluates a 7-card poker hand with detailed information.

```typescript
static evaluate7CardsVerbose(
  hand: number[], 
  variant: GameVariant = GameVariant.HIGH
): verboseHandInfo
```

**Returns:** Object containing hand rank, winning cards, and description

##### `PokerEvaluator.evaluateTexasHoldem(holeCards, communityCards, gameType?)`

Evaluates a Texas Hold'em hand.

```typescript
static evaluateTexasHoldem(
  holeCards: number[],
  communityCards: number[],
  gameType: TexasHoldemGameType = TexasHoldemGameType.HIGH_ONLY
): hiLowRank
```

**Parameters:**
- `holeCards`: Array of 2 card indices
- `communityCards`: Array of 3-5 card indices
- `gameType`: Type of Texas Hold'em game (optional)

**Returns:** Object with high and/or low rankings

#### Game Variants

```typescript
enum GameVariant {
  HIGH = 'high',
  LOW_A_TO_5 = 'low-a-to-5',
  LOW_8_OR_BETTER = 'low-8-or-better',
  LOW_9_OR_BETTER = 'low-9-or-better',
  TEXAS_HOLDEM = 'texas-holdem'
}
```

#### Texas Hold'em Game Types

```typescript
enum TexasHoldemGameType {
  HIGH_ONLY = 'high-only',
  HIGH_LOW_8 = 'high-low-8',
  HIGH_LOW_9 = 'high-low-9'
}
```

### Legacy API

The legacy API is maintained for backward compatibility.

#### FIVE_CARD_POKER_EVAL

```typescript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';
```

##### HandRank

Functions for evaluating 5, 6, and 7-card poker hands.

```typescript
FIVE_CARD_POKER_EVAL.HandRank[5|6|7][ranking](hand: string[]): number
```

**Ranking Options:**
- `"high"`: Standard high poker ranking
- `"low8"`: Low 8-or-better ranking
- `"low9"`: Low 9-or-better ranking
- `"Ato5"`: Ace-to-5 lowball ranking
- `"Ato6"`: Ace-to-6 lowball ranking
- `"2to7"`: Deuce-to-seven lowball ranking

##### HandRankVerbose

Functions for evaluating poker hands with detailed results.

```typescript
FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high(hand: string[]): verboseHandInfo
```

##### hashLoaders

Functions for loading hash tables used by the evaluators.

```typescript
FIVE_CARD_POKER_EVAL.hashLoaders[6|7][ranking](): void
```

**Note:** Hash loaders for 6-card hands are not yet implemented and will throw an error.

## Game Variants

### High Poker

Standard poker ranking where higher hands are better:
1. Royal Flush
2. Straight Flush
3. Four of a Kind
4. Full House
5. Flush
6. Straight
7. Three of a Kind
8. Two Pair
9. One Pair
10. High Card

### Low Poker Variants

#### Ace-to-Five (A-5)
- Aces are low, straights and flushes don't count
- Best hand: A-2-3-4-5 (wheel)

#### Ace-to-Six (A-6)
- Aces are low, straights and flushes count against the hand
- Best hand: A-2-3-4-6

#### Deuce-to-Seven (2-7)
- Aces are high, straights and flushes count against the hand
- Best hand: 2-3-4-5-7

#### Low 8-or-Better
- Must have five cards 8 or lower
- Aces can be high or low
- Straights and flushes don't count for low

#### Low 9-or-Better
- Must have five cards 9 or lower
- Aces can be high or low
- Straights and flushes don't count for low

### Texas Hold'em

- Players receive 2 hole cards
- 5 community cards are dealt in stages (flop, turn, river)
- Best 5-card hand from 7 total cards
- Can be played high-only or high-low split

## Usage Examples

### Basic 5-Card Evaluation

```typescript
import { PokerEvaluator, GameVariant, stringsToCardIndices } from 'gamblingjs';

const handStrings = ['As', 'Ks', 'Qs', 'Js', 'Ts']; // Royal Flush
const hand = stringsToCardIndices(handStrings);

const rank = PokerEvaluator.evaluate5Cards(hand, GameVariant.HIGH);
console.log(`Hand rank: ${rank}`); // Output: 1 (best possible hand)
```

### 7-Card Evaluation with Verbose Output

```typescript
import { PokerEvaluator, GameVariant, stringsToCardIndices } from 'gamblingjs';

const handStrings = ['As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s'];
const hand = stringsToCardIndices(handStrings);

const result = PokerEvaluator.evaluate7CardsVerbose(hand, GameVariant.HIGH);
console.log(result);
// Output:
// {
//   hand: [0, 1, 2, 3, 4, 5, 6],
//   faces: 'AKQJT98',
//   handGroup: 'Royal Flush',
//   winningCards: [0, 1, 2, 3, 4],
//   flushSuit: 0,
//   handRank: 1
// }
```

### Texas Hold'em Evaluation

```typescript
import { PokerEvaluator, TexasHoldemGameType, stringsToCardIndices } from 'gamblingjs';

const holeCards = stringsToCardIndices(['As', 'Ad']);
const communityCards = stringsToCardIndices(['Ks', 'Kd', 'Kh', '2c', '3c']);

// High-only evaluation
const highResult = PokerEvaluator.evaluateTexasHoldem(
  holeCards, 
  communityCards, 
  TexasHoldemGameType.HIGH_ONLY
);
console.log(`High hand rank: ${highResult.hi}`);

// High-low 8-or-better evaluation
const highLowResult = PokerEvaluator.evaluateTexasHoldem(
  holeCards, 
  communityCards, 
  TexasHoldemGameType.HIGH_LOW_8
);
console.log(`High: ${highLowResult.hi}, Low: ${highLowResult.low}`);
```

### Lowball Evaluation

```typescript
import { PokerEvaluator, GameVariant, stringsToCardIndices } from 'gamblingjs';

const handStrings = ['As', '2s', '3s', '4s', '5s']; // Wheel (best A-5 low hand)
const hand = stringsToCardIndices(handStrings);

// Ace-to-five lowball
const a5Rank = PokerEvaluator.evaluate5Cards(hand, GameVariant.LOW_A_TO_5);
console.log(`A-5 low rank: ${a5Rank}`);

// Low 8-or-better
const low8Rank = PokerEvaluator.evaluate5Cards(hand, GameVariant.LOW_8_OR_BETTER);
console.log(`Low 8 rank: ${low8Rank}`);
```

### Using Card Utilities

```typescript
import { 
  createDeck, 
  shuffleCards, 
  cardIndexToString, 
  getCardRankName,
  getCardSuitName 
} from 'gamblingjs';

// Create and shuffle a deck
const deck = createDeck();
const shuffledDeck = shuffleCards(deck);

// Examine cards
const firstCard = shuffledDeck[0];
console.log(`First card: ${cardIndexToString(firstCard)}`);
console.log(`Rank: ${getCardRankName(firstCard)}`);
console.log(`Suit: ${getCardSuitName(firstCard)}`);
```

### Legacy API Usage

```typescript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';

// Load hash tables for 7-card evaluation
FIVE_CARD_POKER_EVAL.hashLoaders[7].high();

// Evaluate a 7-card hand
const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s'];
const rank = FIVE_CARD_POKER_EVAL.HandRank[7].high(hand);
console.log(`Hand rank: ${rank}`);

// Get verbose information
const verboseResult = FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high(hand);
console.log(`Hand description: ${verboseResult.handGroup}`);
```

## Performance Considerations

### Hash Table Loading

For optimal performance with 7-card evaluations, hash tables should be loaded before evaluation:

```typescript
// New API - automatically loads hash tables
const evaluator = new PokerEvaluator();

// Legacy API - manual loading required
FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
FIVE_CARD_POKER_EVAL.hashLoaders[7].low8();
// ... etc for other variants
```

### Batch Evaluation

For evaluating multiple hands, create a single evaluator instance:

```typescript
import { PokerEvaluator, GameVariant } from 'gamblingjs';

const evaluator = new PokerEvaluator();
const hands = [/* array of hand arrays */];

const results = hands.map(hand => evaluator.evaluate(hand, GameVariant.HIGH));
```

## Troubleshooting

### Common Issues

#### "Invalid card index" Error
- Ensure card indices are integers between 0 and 51
- Check for duplicate cards in the hand

#### "Hand must contain exactly X cards" Error
- Verify the hand has the correct number of cards for the evaluation method
- 5-card hands for `evaluate5Cards`
- 7-card hands for `evaluate7Cards`

#### "method not yet implemented" Error
- This occurs when using hash loaders for 6-card hands in the legacy API
- Use the new unified API instead, which supports all hand sizes

#### Performance Issues
- Ensure hash tables are loaded before 7-card evaluations
- Consider using the new unified API for better performance
- For batch evaluations, reuse evaluator instances

### Debug Tips

```typescript
import { validateCardIndices, cardIndicesToStrings } from 'gamblingjs';

// Validate hand before evaluation
try {
  validateCardIndices(hand);
  console.log('Hand is valid:', cardIndicesToStrings(hand));
} catch (error) {
  console.error('Invalid hand:', error.message);
}
```

## Contributing

We welcome contributions to GamblingJS! Please follow these steps:

### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:

```bash
npm install
```

4. Build the project:

```bash
npm run build
```

5. Run tests:

```bash
npm test
```

### Making Changes

1. Create a new branch for your feature or bugfix
2. Make your changes following the existing code style
3. Add tests for new functionality
4. Ensure all tests pass:

```bash
npm run test:prod
```

5. Build the project to ensure no compilation errors:

```bash
npm run build
```

### Submitting Changes

1. Commit your changes with clear, descriptive messages
2. Push to your fork
3. Create a pull request with a clear description of your changes
4. Wait for code review and address any feedback

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier is configured)
- Add JSDoc comments for public APIs
- Include unit tests for new functionality

## Tech Stack

- **TypeScript**: Type-safe JavaScript development
- **Rollup**: Module bundler for optimized builds
- **Vitest**: Fast unit testing framework
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped improve this library
- Special thanks to the poker evaluation algorithms that make this library possible
