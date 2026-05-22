# gamblingjs & Webapp - Architecture Review

## 1. Executive Summary
This review covers both the `gamblingjs` core poker library and the Vue.js `webapp`. The `gamblingjs` library acts as a backend engine providing poker logic, evaluations, hand hashing, and monte carlo simulations. The Vue 3 webapp is designed to consume this library as a visual interface, presenting evaluations, simulations, and visualizations to the end user.

## 2. gamblingjs (Core Library) Architecture

### Strengths
* **Clear Core Separation:** The structure separates evaluators (`src/core/`, `src/pokerEvaluator5.ts`, etc.), hash creation (`src/hashesCreator.ts`), and Monte Carlo simulations (`src/pokerMontecarloSym.ts`).
* **Performance Focus:** Poker hands generate combinations up to 7 cards. Using hashing, lookup arrays, and memory-intensive pre-computations correctly targets fast, O(1) runtime evaluation for combinations over real-time combinatoric computation.
* **Typing:** Extensive usage of TypeScript is positive, preventing common card-eval errors.
* **Extendability:** Use of `src/variants/TexasHoldem.ts` mapping and class-based tables (`PokerTable.ts`) indicates good domain-driven extendability for supporting multiple poker variants (Hold'em, Omaha, Draw).

### Areas for Improvement & Recommendations
* **Async Initialization vs Sync API:** The library relies on `initFiveCardHashes()`. This pattern is somewhat restrictive and blocks main thread when generating 5-card hashes on initialization if not placed correctly in workers.
  * **Recommendation:** Offer a lazy-loaded static asset file (like a pre-compiled JSON blob/binary of the hash map) that can be loaded instantly instead of running hashing algorithms on the client's browser/server startup.
* **Kombinatorics Dependency:** Using a local dependency (`kombinatoricsjs`) which isn't on npm creates friction for consuming this library externally or publishing to a package manager.
  * **Recommendation:** Either inline the specific combinatorics methods required or publish `kombinatoricsjs` to a registry like npm/GitHub packages.

## 3. Webapp (Frontend) Architecture

### Current Status
The webapp is currently in the scaffolding phase. While `.vue` files are scaffolded and structure exists, source code logic is mainly placeholders according to `IMPLEMENTATION_PLAN.md` and `TECHNICAL_SPECIFICATION.md`.

### Architecture Design Analysis
The planned architecture leverages Vue 3, Pinia for State Management, and Vite for building.
* **Component-Driven Design:** The component structure (Card, HandDisplay, MonteCarloSimulator) is logically decoupled.
* **Composables Usage:** The decision to extract complex logic (e.g., `usePokerEvaluator.ts`, `useMonteCarlo.ts`) into composables is excellent for keeping components clean.
* **State Management:** Using Pinia (`stores/poker.ts`, `stores/ui.ts`) ensures the global poker state (table cards, user cards, simulation status) is reactive across multiple disconnected components.

### Recommendations
* **Web Workers for Simulations:** The `useMonteCarlo.ts` logic relies on `pokerMontecarloSym` from the core library. Since Monte Carlo simulations are CPU intensive, these will freeze the UI thread on the browser.
  * **Recommendation:** Update the architectural plan to execute Monte Carlo composables via Web Workers.
* **Build Constraints:** The current app tries to import `@gamblingjs` as a local monorepo-style package without proper monorepo tooling (like Turborepo or npm workspaces) setup at the root, leading to potential build/resolution errors.
  * **Recommendation:** Move to a strict monorepo setup (e.g., using npm workspaces by defining `workspaces` in the root `package.json`) to handle the resolution between the webapp and the gamblingjs library transparently.
