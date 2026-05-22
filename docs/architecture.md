# gamblingjs & Webapp - Architecture Review

## 1. Executive Summary
This review covers both the `gamblingjs` core poker library and the Vue.js `webapp`. The `gamblingjs` library is a zero-dependency, ESM-first TypeScript library providing poker hand evaluation, table simulation, and Monte Carlo analysis. It follows SOLID design principles with an OOP evaluator hierarchy, a unified public API facade, and a fully-featured poker-table simulation module supporting 8 game variants. The Vue 3 webapp is designed to consume this library as a visual interface, presenting evaluations, simulations, and visualizations to the end user.

## 2. gamblingjs (Core Library) Architecture

### Structure
```
src/
├── core/                    # Evaluator hierarchy (SOLID OOP)
│   ├── BaseEvaluator.ts     #   Abstract base (validateHand, normalizeHand)
│   ├── HighEvaluator.ts     #   High hand evaluation
│   └── LowEvaluator.ts      #   LowAto5Evaluator, Low8Evaluator, Low9Evaluator
├── variants/
│   └── TexasHoldem.ts       # TexasHoldemEvaluator (HIGH_ONLY, HIGH_LOW_8, HIGH_LOW_9)
├── poker-table/             # Full table simulation module
│   ├── PokerTable.ts        #   Orchestrates hands/turns/rotation with pluggable Dealer
│   ├── deck.ts              #   LocalDealer, RemoteDealer, createStandardDeck
│   ├── player.ts            #   BasePlayer, PLAYER_PRESETS, createPlayer, PlayerAgent
│   ├── analytics.ts         #   TableAnalytics with OnlineStats (Welford's algorithm)
│   └── types.ts             #   GameId (8 variants), LimitType, BlindsStructure, etc.
├── utils/
│   ├── CardUtils.ts         # Card manipulation utilities
│   └── ValidationUtils.ts   # Input validation utilities
├── PokerEvaluator.ts        # Unified public API facade (GameVariant enum, static + instance methods)
├── pokerEvaluator5.ts       # 5-card evaluator
├── pokerEvaluator6.ts       # 6-card evaluator
├── pokerEvaluator7.ts       # 7-card evaluator
├── pokerEvaluatorTwoSets.ts # Two-set evaluator (hi-lo games)
├── pokerHashes5.ts          # 5-card hash tables
├── pokerHashes6.ts          # 6-card hash tables
├── pokerHashes7.ts          # 7-card hash tables
├── hashesCreator.ts         # Hash table generation
├── pokerMontecarloSym.ts    # Monte Carlo simulation engine
├── routines.ts              # Shared evaluation routines
├── interfaces.ts            # Core types (verboseHandInfo, hiLowRank, etc.)
├── constants.ts             # Constants
├── init.ts                  # Initialization logic
├── gamblingjs.ts            # Legacy entry point
└── index.ts                 # Main entry point, re-exports everything
```

### Strengths
* **SOLID Evaluator Hierarchy:** The core evaluator system follows a clean OOP design — `BaseEvaluator` (abstract) provides shared validation and normalization, `HighEvaluator` and `LowEvaluator` (abstract) extend it, with concrete low evaluators (`LowAto5Evaluator`, `Low8Evaluator`, `Low9Evaluator`) implementing specific low-hand rules. This adheres to the Open/Closed and Single Responsibility principles.
* **Unified Facade API:** `PokerEvaluator.ts` wraps all evaluators behind a single public interface with a `GameVariant` enum, static convenience methods (`evaluate5Cards`, `evaluate7Cards`, `evaluate7CardsVerbose`, `evaluateTexasHoldem`), and instance methods — simplifying consumption.
* **Performance Focus:** Poker hands generate combinations up to 7 cards. Using hashing, lookup arrays, and memory-intensive pre-computations correctly targets fast, O(1) runtime evaluation over real-time combinatoric computation.
* **Zero Runtime Dependencies:** The library has no runtime dependencies (`dependencies: {}` in `package.json`), relying entirely on its own implementations. The previously external `kombinatoricsjs` dependency has been inlined.
* **Full Table Simulation:** The `poker-table/` module is a comprehensive simulation engine supporting 8 game variants (texas-holdem, omaha, omaha-hi-lo, razz, seven-card-stud, seven-card-stud-hi-lo, five-card-draw, 2-7-triple-draw) with pluggable dealers (`LocalDealer`, `RemoteDealer`), configurable player agents (`PlayerAgent` interface, `PLAYER_PRESETS`, `createPlayer`), and real-time analytics (`TableAnalytics` using Welford's online algorithm for streaming statistical computation).
* **Strong Typing:** Extensive TypeScript usage in strict mode with comprehensive type definitions (`GameId` enum, `LimitType`, `BlindsStructure`, `TournamentStructure`, `CashStructure`, etc.) prevents common card-eval errors and provides excellent IDE support.
* **ESM-First with Rollup:** The library ships as an ESM package (`"type": "module"`) bundled via Rollup, with path aliases (`@/*`, `@core/*`, `@utils/*`, `@variants/*`, `@lib/*`) for clean internal imports.

### Areas for Improvement & Recommendations
* **Async Initialization vs Sync API:** The library relies on `initFiveCardHashes()`. This pattern is somewhat restrictive and blocks the main thread when generating 5-card hashes on initialization if not placed correctly in workers.
  * **Recommendation:** Offer a lazy-loaded static asset file (like a pre-compiled JSON blob/binary of the hash map) that can be loaded instantly instead of running hashing algorithms on the client's browser/server startup.

## 3. Webapp (Frontend) Architecture

### Current Status
The webapp is currently in the scaffolding phase. While `.vue` files are scaffolded and structure exists, source code logic is mainly placeholders according to `IMPLEMENTATION_PLAN.md` and `TECHNICAL_SPECIFICATION.md`. The `webapp/tests/` directory contains only a `README.md`.

### Architecture Design Analysis
The planned architecture leverages Vue 3, Pinia for State Management, Tailwind CSS for styling, and Vite for building.
* **Component-Driven Design:** The component structure (Card, HandDisplay, MonteCarloSimulator) is logically decoupled.
* **Composables Usage:** The decision to extract complex logic (e.g., `usePokerEvaluator.ts`, `useMonteCarlo.ts`) into composables is excellent for keeping components clean.
* **State Management:** Using Pinia (`stores/poker.ts`, `stores/ui.ts`) ensures the global poker state (table cards, user cards, simulation status) is reactive across multiple disconnected components.

### Recommendations
* **Web Workers for Simulations:** The `useMonteCarlo.ts` logic relies on `pokerMontecarloSym` from the core library. Since Monte Carlo simulations are CPU intensive, these will freeze the UI thread on the browser.
  * **Recommendation:** Update the architectural plan to execute Monte Carlo composables via Web Workers.
* **Build Constraints:** The current app tries to import `@gamblingjs` as a local monorepo-style package without proper monorepo tooling (like Turborepo or npm workspaces) setup at the root, leading to potential build/resolution errors.
  * **Recommendation:** Move to a strict monorepo setup (e.g., using npm workspaces by defining `workspaces` in the root `package.json`) to handle the resolution between the webapp and the gamblingjs library transparently.
