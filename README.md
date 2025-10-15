# GamblingJS

A library for evaluating various poker and casino games
# Usage (typescript)
```bash
npm install gamblingjs
```
```javascript
import * as GAMBLINGJS from "gamblingjs"
```

### Tech
tech used
* [Typescript] 
* [Rollup] 
* [Jest] 

### Installation
clone repo then:

```sh
$ npm install 
$ npm run build
```

## API

### `FIVE_CARD_POKER_EVAL`

The `FIVE_CARD_POKER_EVAL` object provides a set of functions for evaluating poker hands.

#### `HandRank`

This object contains functions for evaluating 5, 6, and 7-card poker hands for different ranking systems.

*   **`FIVE_CARD_POKER_EVAL.HandRank[5|6|7][ranking]`**
    *   `ranking`: The ranking system to use. Can be one of `"high"`, `"low8"`, `"low9"`, `"Ato5"`, `"Ato6"`, `"2to7"`.
    *   Returns a number representing the hand rank.

#### `HandRankVerbose`

This object contains functions for evaluating poker hands that return a more descriptive result. Currently, this is only implemented for 7-card high hands.

*   **`FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high`**
    *   Returns an object with information about the hand rank.

#### `hashLoaders`

This object contains functions for loading the hash tables used by the evaluators.

*   **`FIVE_CARD_POKER_EVAL.hashLoaders[6|7][ranking]`**
    *   `ranking`: The ranking system to use. Can be one of `"high"`, `"low8"`, `"low9"`, `"Ato5"`, `"Ato6"`, `"2to7"`.
    *   Loads the hash table for the specified ranking system.

## Usage Examples

### 5-Card Hand Evaluation

```javascript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';

const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts']; // Royal Flush
const rank = FIVE_CARD_POKER_EVAL.HandRank[5].high(hand);
console.log(rank); // Output: 1
```

### 6-Card Hand Evaluation

```javascript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';

const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts', '9s']; // Royal Flush
const rank = FIVE_CARD_POKER_EVAL.HandRank[6].high(hand);
console.log(rank); // Output: 1
```

### 7-Card Hand Evaluation

```javascript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';

// Load the hash table for 7-card high hand evaluation
FIVE_CARD_POKER_EVAL.hashLoaders[7].high();

const hand = ['As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s']; // Royal Flush
const rank = FIVE_CARD_POKER_EVAL.HandRank[7].high(hand);
console.log(rank); // Output: 1
```

### 5-Card Lowball (A-5) Hand Evaluation

```javascript
import { FIVE_CARD_POKER_EVAL } from 'gamblingjs';

const hand = ['As', '2s', '3s', '4s', '5s']; // Wheel
const rank = FIVE_CARD_POKER_EVAL.HandRank[5].low8(hand);
console.log(rank);
```
