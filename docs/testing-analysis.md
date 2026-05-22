# gamblingjs & Webapp - Testing Analysis

## 1. Executive Summary
This document analyzes the current state of unit and performance tests across the project. The core library (`gamblingjs`) demonstrates excellent coverage and testing practices, while the `webapp` is entirely missing tests.

## 2. gamblingjs Testing Analysis

### Coverage Metrics
The vitest coverage runner for the core library achieved the following outstanding metrics:
* **Statements:** 90.32%
* **Branches:** 90.88%
* **Functions:** 82.62%
* **Lines:** 90.32%

### Strengths
* **High Coverage on Critical Paths:** Files like `pokerEvaluator.ts`, `constants.ts`, and core evaluators (`pokerHashes5.ts`, `HighEvaluator.ts`) boast 100% test coverage.
* **Granular Unit Testing:** The tests are well-separated based on responsibilities (e.g., `pokerEvaluator5.test.ts`, `pokerEvaluator7.test.ts`). This ensures precise isolation for debugging combinatoric failures.
* **Performance Testing Integration:** The existence of `vitest.perf.config.ts` and performance-specific testing (`npm run test:perf`) shows maturity. Poker evaluations require high speed (especially for Monte Carlo simulations), and testing performance regressions is a strong asset.
* **E2E Integration for Table Logic:** The inclusion of e2e flow tests (`PokerTable.e2e.test.ts`) simulates real deterministic behavior accurately.

### Weaknesses and Recommendations
* **Flaky/Unhandled Errors in Tests:** The test run logged an unhandled error: `[vitest-worker]: Timeout calling "onTaskUpdate"`.
  * **Recommendation:** Investigate and resolve this timeout error to prevent false positives and flaky CI runs.
* **Low Coverage in specific areas:** `src/poker-table/deck.ts` (30.3% coverage) and `src/poker-table/player.ts` (31.42% coverage) drastically lower the average.
  * **Recommendation:** Expand unit test coverage specifically targeting the `PokerTable` models, testing edge cases like deck shuffling anomalies or player state manipulation.

## 3. Webapp Testing Analysis

### Coverage Metrics
* **Total Coverage:** 0%

### Current State
There are no test files in the `webapp` repository (0 tests passed, `No test files found` from vitest). The project is in the scaffolding phase.

### Testing Strategy Recommendations
As the webapp code is implemented, the testing strategy should adopt the following:
* **Vitest with jsdom:** Required for component testing. Ensure `jsdom` is installed and `vitest.config.ts` is configured to map the DOM correctly.
* **Vue Test Utils:** Use `@vue/test-utils` for rendering and mounting components (`Card.vue`, `HandDisplay.vue`).
* **Store Testing (Pinia):** Write isolated unit tests for `stores/poker.ts` using Pinia's testing utilities (`createTestingPinia`).
* **E2E with Playwright:** The scaffolding mentions Playwright for End-to-End testing. Implement critical path E2E tests for the monte carlo simulation and visual hand evaluation matching core backend results.
