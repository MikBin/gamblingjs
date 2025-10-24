# Comprehensive Source Code Conversion Strategy: JavaScript to TypeScript

This guide provides a systematic approach for migrating JavaScript files to TypeScript in the gamblingjs project, which contains both .js/.ts pairs and pure JavaScript files.

## Table of Contents

1. [Project Analysis](#project-analysis)
2. [File Conversion Prioritization Strategy](#file-conversion-prioritization-strategy)
3. [Type Annotation Strategies](#type-annotation-strategies)
4. [Module System Migration Guidelines](#module-system-migration-guidelines)
5. [Conversion Patterns for Common JavaScript Constructs](#conversion-patterns-for-common-javascript-constructs)
6. [GamblingJS-Specific Conversion Challenges](#gamblingjs-specific-conversion-challenges)
7. [Step-by-Step Conversion Workflow](#step-by-step-conversion-workflow)
8. [Before/After Examples](#beforeafter-examples)
9. [Validation and Testing](#validation-and-testing)

## Project Analysis

### Current State of the gamblingjs Project

Based on the project structure analysis, the gamblingjs project has:

1. **Existing .js/.ts pairs** in the main `src/` directory:
   - `constants.js` / `constants.ts`
   - `gamblingjs.js` / `gamblingjs.ts`
   - `hashesCreator.js` / `hashesCreator.ts`
   - `interfaces.js` / `interfaces.ts`
   - `pokerEvaluator5.js` / `pokerEvaluator5.ts`
   - `pokerEvaluator6.js` / `pokerEvaluator6.ts`
   - `pokerEvaluator7.js` / `pokerEvaluator7.ts`
   - `pokerHashes5.js` / `pokerHashes5.ts`
   - `pokerHashes7.js` / `pokerHashes7.ts`
   - `pokerMontecarloSym.js` / `pokerMontecarloSym.ts`
   - `routines.js` / `routines.ts`

2. **Pure TypeScript files** already converted:
   - `index.ts`
   - `PokerEvaluator.ts`
   - `pokerEvaluatorOmaha.ts`
   - `pokerEvaluatorTwoSets.ts`
   - Files in `src/core/`, `src/utils/`, `src/variants/`

3. **Web application with .js/.ts pairs**:
   - Vue components with both .js and .ts versions
   - Composables with both versions
   - Stores with both versions
   - Utility functions with both versions

### Key Observations

1. The project already has a significant TypeScript foundation
2. Many files have been partially converted with .js/.ts pairs
3. The TypeScript versions show good typing practices already established
4. The project uses both CommonJS and ES modules
5. Complex poker evaluation algorithms require careful typing

## File Conversion Prioritization Strategy

### Conversion Priority Matrix

| Priority | File Type | Reason | Examples |
|----------|-----------|--------|----------|
| **P0** | Core interfaces/types | Foundation for all other conversions | `interfaces.ts` |
| **P1** | Constants and enums | Used throughout the codebase | `constants.ts` |
| **P2** | Core utilities | Low dependencies, high usage | `src/utils/` |
| **P3** | Hash creators | Required by evaluators | `hashesCreator.ts` |
| **P4** | Poker evaluators | Core business logic | `pokerEvaluator*.ts` |
| **P5** | Monte Carlo simulations | Complex algorithms | `pokerMontecarloSym.ts` |
| **P6** | Main library entry | Depends on all others | `gamblingjs.ts` |
| **P7** | Web application | Separate concern | `webapp/` |

### Dependency-First Conversion Order

1. **Phase 1: Foundation Types**
   ```
   interfaces.ts → constants.ts → routines.ts
   ```

2. **Phase 2: Core Infrastructure**
   ```
   hashesCreator.ts → pokerHashes*.ts
   ```

3. **Phase 3: Evaluation Logic**
   ```
   pokerEvaluator5.ts → pokerEvaluator6.ts → pokerEvaluator7.ts
   ```

4. **Phase 4: Advanced Features**
   ```
   pokerMontecarloSym.ts → pokerEvaluatorOmaha.ts → pokerEvaluatorTwoSets.ts
   ```

5. **Phase 5: Library Integration**
   ```
   gamblingjs.ts → index.ts
   ```

6. **Phase 6: Web Application**
   ```
   webapp/src/types/ → webapp/src/utils/ → webapp/src/composables/ → webapp/src/stores/ → webapp/src/components/
   ```

### Handling Existing .js/.ts Pairs

For files that already have both JavaScript and TypeScript versions:

1. **Audit the TypeScript version** to ensure it's complete and up-to-date
2. **Compare functionality** between .js and .ts versions
3. **Verify the TypeScript version** maintains all functionality
4. **Remove the JavaScript version** once TypeScript is verified
5. **Update all imports** to use the TypeScript version

## Type Annotation Strategies

### Converting JSDoc Comments to TypeScript Types

#### Before (JSDoc)
```javascript
/**
 * Evaluates a poker hand and returns the rank
 * @param {number[]} cards - Array of card values
 * @param {number} gameType - Type of poker game
 * @returns {number} Hand rank
 */
function evaluateHand(cards, gameType) {
    // Implementation
}
```

#### After (TypeScript)
```typescript
interface Card {
    value: number;
    suit: string;
}

enum GameType {
    HIGH = 'high',
    LOW_8 = 'low8',
    LOW_9 = 'low9',
    A_TO_5 = 'Ato5',
    A_TO_6 = 'Ato6',
    TWO_TO_SEVEN = '2to7'
}

function evaluateHand(cards: number[], gameType: GameType): number {
    // Implementation
}
```

### Adding Explicit Type Annotations

#### 1. Function Parameters and Return Types

```typescript
// Before
function calculateOdds(wins, total) {
    return wins / total;
}

// After
function calculateOdds(wins: number, total: number): number {
    return wins / total;
}
```

#### 2. Complex Object Types

```typescript
// Before
function createHandInfo(hand, rank, description) {
    return {
        hand,
        rank,
        description,
        timestamp: Date.now()
    };
}

// After
interface HandInfo {
    hand: number[];
    rank: number;
    description: string;
    timestamp: number;
}

function createHandInfo(
    hand: number[], 
    rank: number, 
    description: string
): HandInfo {
    return {
        hand,
        rank,
        description,
        timestamp: Date.now()
    };
}
```

#### 3. Array and Generic Types

```typescript
// Before
function getBestHands(hands) {
    return hands.filter(hand => hand.rank > 1000);
}

// After
function getBestHands(hands: HandInfo[]): HandInfo[] {
    return hands.filter(hand => hand.rank > 1000);
}
```

### Typing Complex Data Structures

#### 1. Poker Card Representation

```typescript
// Define a comprehensive card type
interface Card {
    id: number;
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
    value: number;
}

// Deck representation
type Deck = Card[];

// Hand representation
interface Hand {
    cards: Card[];
    rank: number;
    description: string;
    winningCards?: Card[];
}
```

#### 2. Game State Types

```typescript
interface GameState {
    pocketCards: number[];
    communityCards: number[];
    gameStage: 'preflop' | 'flop' | 'turn' | 'river';
    potSize: number;
    players: Player[];
}

interface Player {
    id: string;
    name: string;
    chips: number;
    cards: number[];
    isActive: boolean;
    betAmount: number;
}
```

#### 3. Evaluation Results

```typescript
interface EvaluationResult {
    handRank: number;
    handStrength: number;
    description: string;
    winningCards: number[];
    potOdds?: number;
    impliedOdds?: number;
}

interface HiLowEvaluationResult {
    high: EvaluationResult;
    low: EvaluationResult;
}
```

### Dealing with Dynamic Properties and Objects

#### 1. Index Signatures

```typescript
// For dynamic hash tables
interface CardHashTable {
    [key: number]: string | number;
}

// For game-specific configurations
interface GameConfig {
    [gameType: string]: {
        minPlayers: number;
        maxPlayers: number;
        deckSize: number;
    };
}
```

#### 2. Union Types for Dynamic Values

```typescript
type CardValue = number | string;
type GamePhase = 'waiting' | 'dealing' | 'betting' | 'showdown' | 'complete';

interface DynamicGameState {
    phase: GamePhase;
    data: Record<string, CardValue> | null;
}
```

#### 3. Type Guards for Runtime Validation

```typescript
function isCard(value: any): value is Card {
    return value && 
           typeof value.id === 'number' &&
           ['hearts', 'diamonds', 'clubs', 'spades'].includes(value.suit) &&
           ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'].includes(value.rank);
}

function processCard(input: unknown): Card {
    if (isCard(input)) {
        return input;
    }
    throw new Error('Invalid card format');
}
```

## Module System Migration Guidelines

### Converting CommonJS to ES Modules

#### 1. Module Exports

```javascript
// Before (CommonJS)
const { evaluateHand } = require('./pokerEvaluator');
module.exports = { evaluateHand, calculateOdds };
exports.helper = function() { /* ... */ };
```

```typescript
// After (ES Modules)
import { evaluateHand } from './pokerEvaluator';
export { evaluateHand, calculateOdds };
export const helper = () => { /* ... */ };
```

#### 2. Default vs Named Exports

```typescript
// Named exports (preferred for library consistency)
export { evaluateHand, calculateOdds };
export type { HandInfo, EvaluationResult };

// Default export (for main entry points)
export default {
    evaluateHand,
    calculateOdds,
    // ... other exports
};
```

#### 3. Dynamic Imports

```typescript
// Before
const evaluator = require(`./evaluators/${gameType}`);

// After
const evaluator = await import(`./evaluators/${gameType}`);
```

### Handling Module Resolution Issues

#### 1. Path Mapping Configuration

```json
// tsconfig.json
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"],
            "@core/*": ["src/core/*"],
            "@utils/*": ["src/utils/*"],
            "@evaluators/*": ["src/evaluators/*"],
            "@types/*": ["src/types/*"]
        }
    }
}
```

#### 2. Import Strategies

```typescript
// Use explicit extensions for clarity
import { HandEvaluator } from './core/HandEvaluator.ts';

// Use path aliases for cleaner imports
import { CardUtils } from '@utils/cardUtils';
import { PokerEvaluator } from '@evaluators/pokerEvaluator';
```

#### 3. Circular Dependency Resolution

```typescript
// Use dependency injection to break circular dependencies
interface EvaluatorDependencies {
    hashProvider: HashProvider;
    rankCalculator: RankCalculator;
}

class PokerEvaluator {
    constructor(private deps: EvaluatorDependencies) {}
}

// Or use interfaces to decouple
interface IHashProvider {
    getHash(cards: number[]): number;
}

class PokerEvaluator {
    constructor(private hashProvider: IHashProvider) {}
}
```

## Conversion Patterns for Common JavaScript Constructs

### 1. Classes and Prototypes

#### Before (Prototype-based)
```javascript
function PokerHand(cards) {
    this.cards = cards;
    this.rank = 0;
}

PokerHand.prototype.evaluate = function() {
    // Evaluation logic
    return this.rank;
};

PokerHand.prototype.getDescription = function() {
    return `Hand rank: ${this.rank}`;
};
```

#### After (TypeScript Class)
```typescript
class PokerHand {
    private _rank: number = 0;
    
    constructor(public cards: number[]) {}
    
    get rank(): number {
        return this._rank;
    }
    
    evaluate(): number {
        // Evaluation logic
        this._rank = this.calculateRank();
        return this._rank;
    }
    
    getDescription(): string {
        return `Hand rank: ${this._rank}`;
    }
    
    private calculateRank(): number {
        // Private implementation
        return 0;
    }
}
```

### 2. Async/Await and Promise Handling

#### Before
```javascript
async function simulateGame(players, iterations) {
    try {
        const results = [];
        for (let i = 0; i < iterations; i++) {
            const result = await runSimulation(players);
            results.push(result);
        }
        return results;
    } catch (error) {
        console.error('Simulation failed:', error);
        return null;
    }
}
```

#### After
```typescript
interface SimulationResult {
    winner: string;
    hands: HandInfo[];
    duration: number;
}

async function simulateGame(
    players: Player[], 
    iterations: number
): Promise<SimulationResult[] | null> {
    try {
        const results: SimulationResult[] = [];
        for (let i = 0; i < iterations; i++) {
            const result = await runSimulation(players);
            results.push(result);
        }
        return results;
    } catch (error) {
        console.error('Simulation failed:', error);
        return null;
    }
}
```

### 3. Event Handling and Callbacks

#### Before
```javascript
function setupGameEvents(game) {
    game.on('handComplete', (handResult) => {
        console.log('Hand completed:', handResult);
    });
    
    game.on('playerAction', (player, action) => {
        if (action.type === 'fold') {
            handleFold(player);
        }
    });
}
```

#### After
```typescript
interface HandResult {
    winner: string;
    pot: number;
    hands: HandInfo[];
}

interface PlayerAction {
    type: 'fold' | 'call' | 'raise' | 'check';
    amount?: number;
}

function setupGameEvents(game: GameEngine): void {
    game.on('handComplete', (handResult: HandResult) => {
        console.log('Hand completed:', handResult);
    });
    
    game.on('playerAction', (player: Player, action: PlayerAction) => {
        if (action.type === 'fold') {
            handleFold(player);
        }
    });
}
```

### 4. Array/Object Manipulation Methods

#### Before
```javascript
function getBestHands(hands) {
    return hands
        .filter(hand => hand.rank > 1000)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 10);
}

function groupHandsByRank(hands) {
    return hands.reduce((groups, hand) => {
        const rank = hand.rank;
        if (!groups[rank]) {
            groups[rank] = [];
        }
        groups[rank].push(hand);
        return groups;
    }, {});
}
```

#### After
```typescript
function getBestHands(hands: HandInfo[]): HandInfo[] {
    return hands
        .filter(hand => hand.rank > 1000)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 10);
}

function groupHandsByRank(hands: HandInfo[]): Record<number, HandInfo[]> {
    return hands.reduce((groups: Record<number, HandInfo[]>, hand) => {
        const rank = hand.rank;
        if (!groups[rank]) {
            groups[rank] = [];
        }
        groups[rank].push(hand);
        return groups;
    }, {});
}
```

### 5. Error Handling Patterns

#### Before
```javascript
function evaluateCards(cards) {
    if (!cards || cards.length < 5) {
        throw new Error('Invalid hand: must have at least 5 cards');
    }
    
    if (cards.some(card => card < 0 || card > 51)) {
        throw new Error('Invalid card: must be between 0 and 51');
    }
    
    // Evaluation logic
}
```

#### After
```typescript
class InvalidHandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidHandError';
    }
}

class InvalidCardError extends Error {
    constructor(cardIndex: number, cardValue: number) {
        super(`Invalid card at index ${cardIndex}: ${cardValue} (must be between 0 and 51)`);
        this.name = 'InvalidCardError';
    }
}

function evaluateCards(cards: number[]): number {
    if (!cards || cards.length < 5) {
        throw new InvalidHandError('Invalid hand: must have at least 5 cards');
    }
    
    const invalidCard = cards.findIndex(card => card < 0 || card > 51);
    if (invalidCard !== -1) {
        throw new InvalidCardError(invalidCard, cards[invalidCard]);
    }
    
    // Evaluation logic
    return 0;
}
```

## GamblingJS-Specific Conversion Challenges

### 1. Converting Poker Evaluation Algorithms

#### Challenge: Complex Hash-Based Evaluations

```typescript
// Define types for hash-based evaluation
interface HashTable {
    [key: number]: number;
}

interface FlushHashTable {
    [key: number]: number;
}

interface EvaluationTables {
    HASHES: HashTable;
    FLUSH_HASHES: FlushHashTable;
    FLUSH_CHECK_KEYS: HashTable;
    FLUSH_RANK_HASHES: HashTable;
    baseRankValues: number[];
    baseSuitValues: number[];
    rankingInfos: HandInfo[];
}

class PokerEvaluator {
    private tables: EvaluationTables;
    
    constructor(tables: EvaluationTables) {
        this.tables = tables;
    }
    
    evaluateHand(cards: number[]): number {
        const hash = this.calculateHash(cards);
        return this.tables.HASHES[hash] || 0;
    }
    
    private calculateHash(cards: number[]): number {
        // Complex hash calculation logic
        return cards.reduce((hash, card) => {
            return hash + this.tables.baseRankValues[card % 13] + 
                   this.tables.baseSuitValues[Math.floor(card / 13)];
        }, 0);
    }
}
```

### 2. Typing Card Representations and Game State

```typescript
// Comprehensive card type system
enum Suit {
    SPADES = 'spades',
    HEARTS = 'hearts',
    DIAMONDS = 'diamonds',
    CLUBS = 'clubs'
}

enum Rank {
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = 'T',
    JACK = 'J',
    QUEEN = 'Q',
    KING = 'K',
    ACE = 'A'
}

interface Card {
    id: number;
    suit: Suit;
    rank: Rank;
    value: number;
}

interface Hand {
    cards: Card[];
    rank: number;
    description: string;
    category: HandCategory;
}

enum HandCategory {
    HIGH_CARD = 'high card',
    ONE_PAIR = 'one pair',
    TWO_PAIR = 'two pair',
    THREE_OF_A_KIND = 'three of a kind',
    STRAIGHT = 'straight',
    FLUSH = 'flush',
    FULL_HOUSE = 'full house',
    FOUR_OF_A_KIND = 'four of a kind',
    STRAIGHT_FLUSH = 'straight flush'
}
```

### 3. Handling Monte Carlo Simulation Code

```typescript
interface SimulationConfig {
    iterations: number;
    players: number;
    gameType: GameType;
    concurrency?: number;
}

interface SimulationResult {
    winProbability: number;
    tieProbability: number;
    loseProbability: number;
    expectedValue: number;
    standardDeviation: number;
    sampleHands: HandInfo[];
}

class MonteCarloSimulator {
    constructor(private evaluator: PokerEvaluator) {}
    
    async simulate(
        playerHand: Card[],
        communityCards: Card[],
        opponents: number,
        config: SimulationConfig
    ): Promise<SimulationResult> {
        const results = await this.runSimulations(
            playerHand, 
            communityCards, 
            opponents, 
            config.iterations
        );
        
        return this.calculateStatistics(results);
    }
    
    private async runSimulations(
        playerHand: Card[],
        communityCards: Card[],
        opponents: number,
        iterations: number
    ): Promise<number[]> {
        // Parallel simulation implementation
        const promises: Promise<number>[] = [];
        
        for (let i = 0; i < iterations; i++) {
            promises.push(this.runSingleSimulation(playerHand, communityCards, opponents));
        }
        
        return Promise.all(promises);
    }
    
    private async runSingleSimulation(
        playerHand: Card[],
        communityCards: Card[],
        opponents: number
    ): Promise<number> {
        // Single simulation logic
        return 0;
    }
    
    private calculateStatistics(results: number[]): SimulationResult {
        // Statistical calculation
        return {
            winProbability: 0,
            tieProbability: 0,
            loseProbability: 0,
            expectedValue: 0,
            standardDeviation: 0,
            sampleHands: []
        };
    }
}
```

### 4. Converting Utility Functions and Helpers

```typescript
// Card utility functions with proper typing
export class CardUtils {
    static createDeck(): Card[] {
        const deck: Card[] = [];
        const suits = Object.values(Suit);
        const ranks = Object.values(Rank);
        
        let id = 0;
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({
                    id: id++,
                    suit,
                    rank,
                    value: this.getRankValue(rank)
                });
            }
        }
        
        return deck;
    }
    
    static getRankValue(rank: Rank): number {
        const values: Record<Rank, number> = {
            [Rank.TWO]: 2,
            [Rank.THREE]: 3,
            [Rank.FOUR]: 4,
            [Rank.FIVE]: 5,
            [Rank.SIX]: 6,
            [Rank.SEVEN]: 7,
            [Rank.EIGHT]: 8,
            [Rank.NINE]: 9,
            [Rank.TEN]: 10,
            [Rank.JACK]: 11,
            [Rank.QUEEN]: 12,
            [Rank.KING]: 13,
            [Rank.ACE]: 14
        };
        
        return values[rank];
    }
    
    static cardsToString(cards: Card[]): string {
        return cards.map(card => `${card.rank}${card.suit[0].toUpperCase()}`).join(' ');
    }
    
    static parseCards(cardString: string): Card[] {
        const deck = this.createDeck();
        const result: Card[] = [];
        
        for (const cardStr of cardString.split(' ')) {
            const rank = cardStr[0] as Rank;
            const suitChar = cardStr[1].toLowerCase();
            const suit = this.getSuitFromChar(suitChar);
            
            const card = deck.find(c => c.rank === rank && c.suit === suit);
            if (card) {
                result.push(card);
            }
        }
        
        return result;
    }
    
    private static getSuitFromChar(char: string): Suit {
        const suitMap: Record<string, Suit> = {
            's': Suit.SPADES,
            'h': Suit.HEARTS,
            'd': Suit.DIAMONDS,
            'c': Suit.CLUBS
        };
        
        return suitMap[char] || Suit.SPADES;
    }
}
```

## Step-by-Step Conversion Workflow

### Pre-Conversion Preparation

1. **Set Up TypeScript Configuration**
   ```bash
   # Ensure tsconfig.json is properly configured
   npm install --save-dev typescript @types/node
   ```

2. **Create Type Definition Files**
   ```typescript
   // types/global.d.ts
   declare global {
       interface Window {
           gamblingJS?: any;
       }
   }
   ```

3. **Establish Conversion Standards**
   - Create a style guide for TypeScript conventions
   - Set up ESLint rules for TypeScript
   - Configure Prettier for consistent formatting

### Conversion Process for Individual Files

1. **Analyze the JavaScript File**
   - Identify all functions and their signatures
   - Note any complex data structures
   - Document dependencies and imports

2. **Create TypeScript Interfaces**
   ```typescript
   // Before writing implementation, define types
   interface FileSpecificTypes {
       // Define all types used in this file
   }
   ```

3. **Convert Function Signatures**
   ```typescript
   // Add explicit types to all functions
   function functionName(param1: Type1, param2: Type2): ReturnType {
       // Implementation
   }
   ```

4. **Add Type Annotations to Variables**
   ```typescript
   const variableName: Type = initialValue;
   let mutableVariable: Type = initialValue;
   ```

5. **Handle Edge Cases and Errors**
   ```typescript
   // Add proper error handling with typed errors
   try {
       // Code that might throw
   } catch (error) {
       if (error instanceof SpecificError) {
           // Handle specific error
       }
       throw error;
   }
   ```

6. **Update Imports and Exports**
   ```typescript
   // Convert to ES modules
   import { Type, Function } from './module';
   export { ConvertedFunction, NewType };
   ```

### Validation Steps After Each Conversion

1. **Type Checking**
   ```bash
   npx tsc --noEmit
   ```

2. **Linting**
   ```bash
   npx eslint src/converted-file.ts --fix
   ```

3. **Testing**
   ```bash
   npm test -- converted-file.test.ts
   ```

4. **Build Verification**
   ```bash
   npm run build
   ```

### Handling Compilation Errors

1. **Implicit Any Errors**
   ```typescript
   // Error: Parameter 'param' implicitly has an 'any' type
   function func(param) { } // ❌
   
   // Solution: Add explicit type
   function func(param: SpecificType) { } // ✅
   ```

2. **Missing Type Definitions**
   ```typescript
   // Error: Could not find a declaration for module 'external-lib'
   import external from 'external-lib'; // ❌
   
   // Solution: Create type definition
   declare module 'external-lib' {
       export default function external(): any;
   }
   ```

3. **Type Mismatch Errors**
   ```typescript
   // Error: Type 'string' is not assignable to type 'number'
   const num: number = getString(); // ❌
   
   // Solution: Add type conversion or fix the source
   const num: number = parseInt(getString()); // ✅
   ```

## Before/After Examples for Common Conversion Scenarios

### 1. Simple Function Conversion

#### Before
```javascript
function calculateWinProbability(wins, total) {
    if (total === 0) return 0;
    return (wins / total) * 100;
}

function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}
```

#### After
```typescript
function calculateWinProbability(wins: number, total: number): number {
    if (total === 0) return 0;
    return (wins / total) * 100;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

// Or with more specific types
type Percentage = number; // 0-100

function calculateWinProbability(wins: number, total: number): Percentage {
    if (total === 0) return 0;
    return (wins / total) * 100;
}

function formatPercentage(value: Percentage): string {
    return `${value.toFixed(2)}%`;
}
```

### 2. Class Conversion

#### Before
```javascript
function PokerTable(maxPlayers) {
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.pot = 0;
    this.communityCards = [];
}

PokerTable.prototype.addPlayer = function(player) {
    if (this.players.length < this.maxPlayers) {
        this.players.push(player);
        return true;
    }
    return false;
};

PokerTable.prototype.addToPot = function(amount) {
    this.pot += amount;
};

PokerTable.prototype.determineWinner = function() {
    // Complex winner determination logic
    return this.players[0]; // Simplified
};
```

#### After
```typescript
interface Player {
    id: string;
    name: string;
    chips: number;
    cards: number[];
}

interface Winner {
    player: Player;
    hand: HandInfo;
    potShare: number;
}

class PokerTable {
    private readonly maxPlayers: number;
    private players: Player[] = [];
    private pot: number = 0;
    private communityCards: number[] = [];
    
    constructor(maxPlayers: number) {
        this.maxPlayers = maxPlayers;
    }
    
    addPlayer(player: Player): boolean {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            return true;
        }
        return false;
    }
    
    addToPot(amount: number): void {
        this.pot += amount;
    }
    
    determineWinner(): Winner[] {
        // Complex winner determination logic
        // Return array to handle potential ties
        return [{
            player: this.players[0],
            hand: {} as HandInfo,
            potShare: this.pot
        }];
    }
    
    // Getters for read-only access
    get Players(): ReadonlyArray<Player> {
        return this.players;
    }
    
    get Pot(): number {
        return this.pot;
    }
    
    get CommunityCards(): ReadonlyArray<number> {
        return this.communityCards;
    }
}
```

### 3. Module Conversion

#### Before
```javascript
// utils.js
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

function createCard(suit, rank) {
    return {
        suit,
        rank,
        value: RANKS.indexOf(rank) + 2
    };
}

function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push(createCard(suit, rank));
        }
    }
    return deck;
}

module.exports = {
    SUITS,
    RANKS,
    createCard,
    createDeck
};
```

#### After
```typescript
// utils.ts
export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;

export type Suit = typeof SUITS[number];
export type Rank = typeof RANKS[number];

export interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

export function createCard(suit: Suit, rank: Rank): Card {
    return {
        suit,
        rank,
        value: RANKS.indexOf(rank) + 2
    };
}

export function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push(createCard(suit, rank));
        }
    }
    return deck;
}

// Also export types for consumers
export type { Card };
```

### 4. Complex Object Typing

#### Before
```javascript
function createEvaluationResult(handRank, description, winningCards, potOdds) {
    return {
        handRank,
        description,
        winningCards,
        potOdds,
        timestamp: Date.now(),
        metadata: {
            version: '1.0.0',
            algorithm: 'fast-hash'
        }
    };
}

function processEvaluationResults(results) {
    return results.map(result => {
        return {
            ...result,
            strength: calculateStrength(result.handRank),
            category: categorizeHand(result.handRank)
        };
    });
}
```

#### After
```typescript
interface EvaluationMetadata {
    version: string;
    algorithm: string;
}

interface EvaluationResult {
    handRank: number;
    description: string;
    winningCards: number[];
    potOdds: number;
    timestamp: number;
    metadata: EvaluationMetadata;
}

interface ProcessedEvaluationResult extends EvaluationResult {
    strength: number;
    category: HandCategory;
}

function createEvaluationResult(
    handRank: number,
    description: string,
    winningCards: number[],
    potOdds: number
): EvaluationResult {
    return {
        handRank,
        description,
        winningCards,
        potOdds,
        timestamp: Date.now(),
        metadata: {
            version: '1.0.0',
            algorithm: 'fast-hash'
        }
    };
}

function processEvaluationResults(
    results: EvaluationResult[]
): ProcessedEvaluationResult[] {
    return results.map(result => {
        return {
            ...result,
            strength: calculateStrength(result.handRank),
            category: categorizeHand(result.handRank)
        };
    });
}

function calculateStrength(handRank: number): number {
    // Implementation
    return 0;
}

function categorizeHand(handRank: number): HandCategory {
    // Implementation
    return HandCategory.HIGH_CARD;
}
```

## Validation and Testing

### Type Checking Strategies

1. **Strict Type Checking**
   ```json
   // tsconfig.json
   {
       "compilerOptions": {
           "strict": true,
           "noImplicitAny": true,
           "strictNullChecks": true,
           "strictFunctionTypes": true
       }
   }
   ```

2. **Incremental Type Adoption**
   ```json
   // Start with permissive settings
   {
       "compilerOptions": {
           "strict": false,
           "noImplicitAny": false
       }
   }
   
   // Gradually enable stricter options
   ```

### Testing Converted Code

1. **Unit Tests with TypeScript**
   ```typescript
   // evaluator.test.ts
   import { PokerEvaluator } from '../src/PokerEvaluator';
   import { HandCategory } from '../src/types';
   
   describe('PokerEvaluator', () => {
       let evaluator: PokerEvaluator;
       
       beforeEach(() => {
           evaluator = new PokerEvaluator();
       });
       
       test('should correctly identify a royal flush', () => {
           const royalFlush = [0, 9, 18, 27, 36]; // A♠ K♠ Q♠ J♠ T♠
           const result = evaluator.evaluateHand(royalFlush);
           
           expect(result.category).toBe(HandCategory.STRAIGHT_FLUSH);
           expect(result.rank).toBeGreaterThan(9000);
       });
   });
   ```

2. **Integration Tests**
   ```typescript
   // integration.test.ts
   import { simulateGame } from '../src/simulation';
   import { GameType } from '../src/types';
   
   describe('Game Simulation', () => {
       test('should complete a full game simulation', async () => {
           const result = await simulateGame(
               players,
               GameType.TEXAS_HOLDEM,
               1000
           );
           
           expect(result.winProbability).toBeGreaterThanOrEqual(0);
           expect(result.winProbability).toBeLessThanOrEqual(1);
       });
   });
   ```

### Performance Considerations

1. **TypeScript Compilation Performance**
   ```json
   // tsconfig.json
   {
       "compilerOptions": {
           "incremental": true,
           "tsBuildInfoFile": "./dist/.tsbuildinfo"
       }
   }
   ```

2. **Runtime Performance**
   ```typescript
   // Use type assertions sparingly
   const result = (externalLib as any).method(); // Only when necessary
   
   // Prefer type guards over type assertions
   if (isCard(value)) {
       // TypeScript knows value is Card here
       processCard(value);
   }
   ```

## Conclusion

This comprehensive conversion strategy provides a systematic approach to migrating the gamblingjs project from JavaScript to TypeScript. By following the prioritization strategy, implementing proper type annotations, and using the established patterns, the migration can be completed efficiently while maintaining code quality and functionality.

Key takeaways for successful migration:

1. **Start with foundational types** and work up the dependency chain
2. **Leverage existing TypeScript files** as examples of good practices
3. **Implement comprehensive testing** to ensure functionality is preserved
4. **Gradually increase type strictness** to avoid overwhelming the team
5. **Document all custom types** for future maintainability

The end result will be a more maintainable, type-safe codebase that's easier to understand and less prone to runtime errors.
