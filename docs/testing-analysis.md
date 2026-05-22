# gamblingjs & Webapp - Testing Analysis

## 1. Executive Summary
This document analyzes the current state of unit and performance tests across the project. The core library (`gamblingjs`) demonstrates excellent coverage and testing practices with 20 test files, 232 passing tests, and enforced coverage thresholds. The `webapp` is entirely missing tests.

## 2. gamblingjs Testing Analysis

### Coverage Metrics
The vitest coverage runner (v8) for the core library achieved the following metrics:
* **Statements:** 93.27%
* **Branches:** 89.86%
* **Functions:** 92.07%
* **Lines:** 93.27%

Coverage thresholds are enforced in `vitest.config.ts`:
* **Global:** branches 90%, functions 95%, lines 95%, statements 95%
* **`src/core/**/*.ts`:** branches 95%, functions 98%, lines 98%, statements 98%
* **`src/PokerEvaluator.ts`:** branches 95%, functions 100%, lines 100%, statements 100%

### Test Suite Summary
* **Test Files:** 20 passed (20)
* **Tests:** 232 passed | 6 skipped (238)
* **Duration:** ~61s

### Per-File Coverage Breakdown

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| **src/** | 95.9% | 93.72% | 93.02% | 95.9% |
| PokerEvaluator.ts | 100% | 100% | 100% | 100% |
| constants.ts | 100% | 100% | 100% | 100% |
| hashesCreator.ts | 99.62% | 96.72% | 100% | 99.62% |
| init.ts | 100% | 40% | 100% | 100% |
| pokerEvaluator5 | 100% | 98.03% | 100% | 100% |
| pokerEvaluator6 | 92.33% | 89.74% | 76.92% | 92.33% |
| pokerEvaluator7 | 99.8% | 98.41% | 100% | 99.8% |
| pokerEvalTwoSets | 91.39% | 97.82% | 92.85% | 91.39% |
| pokerHashes5 | 100% | 100% | 100% | 100% |
| pokerHashes6 | 100% | 100% | 100% | 100% |
| pokerHashes7 | 100% | 100% | 100% | 100% |
| montecarloSym | 100% | 100% | 100% | 100% |
| routines.ts | 83.84% | 92.71% | 86.48% | 83.84% |
| **src/core/** | 100% | 100% | 100% | 100% |
| BaseEvaluator | 100% | 100% | 100% | 100% |
| HighEvaluator | 100% | 100% | 100% | 100% |
| LowEvaluator | 100% | 100% | 100% | 100% |
| **src/poker-table/** | 90.09% | 80.63% | 92.75% | 90.09% |
| PokerTable.ts | 94.66% | 80.57% | 85.71% | 94.66% |
| analytics.ts | 75.54% | 62.22% | 94.11% | 75.54% |
| deck.ts | 100% | 93.93% | 100% | 100% |
| player.ts | 97.14% | 91.17% | 100% | 97.14% |
| types.ts | 100% | 100% | 100% | 100% |
| **src/variants/** | 89.06% | 88.23% | 66.66% | 89.06% |
| TexasHoldem.ts | 89.06% | 88.23% | 66.66% | 89.06% |

### Test Files
* `test/pokerEvaluator.test.ts`, `test/pokerEvaluator5.test.ts`, `test/pokerEvaluator6.test.ts`, `test/pokerEvaluator6_coverage.test.ts`, `test/pokerEvaluator7.test.ts`
* `test/pokerEvaluatorTwoSets.test.ts`, `test/pokerMontecarloSym.test.ts`
* `test/coreEvaluators.test.ts`, `test/routines.test.ts`, `test/hashesCreator.test.ts`
* `test/gamblingjs.test.ts`, `test/load-hashes.test.ts`, `test/async-init.test.ts`
* `test/poker-table/deck.test.ts`, `test/poker-table/player.test.ts`
* `test/poker-table/PokerTable.holdem.test.ts`, `test/poker-table/PokerTable.stud.test.ts`, `test/poker-table/PokerTable.draw.test.ts`, `test/poker-table/PokerTable.rotation.test.ts`, `test/poker-table/PokerTable.e2e.test.ts`

### Strengths
* **High Coverage on Critical Paths:** Files like `PokerEvaluator.ts`, `constants.ts`, all hash tables (`pokerHashes5/6/7`), and core evaluators (`BaseEvaluator`, `HighEvaluator`, `LowEvaluator`) maintain 100% test coverage across all metrics.
* **Enforced Coverage Thresholds:** Coverage thresholds are configured in `vitest.config.ts` with tiered requirements — stricter thresholds for core evaluators and the public API facade, preventing coverage regressions in CI.
* **Comprehensive Poker-Table Testing:** The poker-table module is thoroughly tested with dedicated test files for deck, player, and multiple PokerTable variants (Hold'em, Stud, Draw, rotation logic), plus E2E integration tests.
* **Granular Unit Testing:** The tests are well-separated based on responsibilities (e.g., `pokerEvaluator5.test.ts`, `pokerEvaluator7.test.ts`). This ensures precise isolation for debugging combinatoric failures.
* **Performance Testing Integration:** The existence of `vitest.perf.config.ts` and performance-specific testing (`npm run test:perf`) shows maturity. Poker evaluations require high speed (especially for Monte Carlo simulations), and testing performance regressions is a strong asset.
* **E2E Integration for Table Logic:** The inclusion of e2e flow tests (`PokerTable.e2e.test.ts`) simulates real deterministic behavior accurately.
* **Clean Test Runs:** All 20 test files pass reliably with no flaky tests or unhandled errors.

### Weaknesses and Recommendations
* **Low Coverage in `analytics.ts`:** At 75.54% statements/lines and 62.22% branches, this is the lowest-covered file in the project.
  * **Recommendation:** Add targeted unit tests for uncovered analytics computation paths and branch conditions.
* **Low Coverage in `routines.ts`:** At 83.84% statements/lines and 86.48% functions, this utility module has meaningful gaps.
  * **Recommendation:** Identify and test uncovered routine functions, particularly edge cases in poker evaluation helper logic.
* **Low Function Coverage in `TexasHoldem.ts`:** While statements are at 89.06%, function coverage is only 66.66%, indicating untested methods in the variant.
  * **Recommendation:** Add tests for unused or less-common Texas Hold'em variant methods to reach the 95% function threshold.
* **Low Function Coverage in `pokerEvaluator6.ts`:** Function coverage is 76.92% despite 92.33% statement coverage.
  * **Recommendation:** Identify and exercise the untested functions in the 6-card evaluator module.
* **Branch Coverage Below Global Threshold:** Overall branch coverage (89.86%) is just below the 90% threshold configured in `vitest.config.ts`. Key contributors are `analytics.ts` (62.22%), `PokerTable.ts` (80.57%), and `TexasHoldem.ts` (88.23%).
  * **Recommendation:** Prioritize branch coverage improvements in these files to consistently pass the global threshold.

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
