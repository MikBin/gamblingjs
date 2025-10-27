# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- This repo has two parts:
  - Core TypeScript library (gamblingjs) at repository root
  - Demo web application in webapp/ (Vue 3 + Vite) that consumes the library directly via a path alias
- Card representation is numeric (0–51). Utilities in src/utils/CardUtils.ts convert between indices and strings (e.g., stringToCardIndex, cardIndexToString).

Common commands
- Library (run in repo root)
  - Install deps: npm install
  - Build (types + bundle via Rollup): npm run build
  - Watch build: npm run dev
  - Lint: npm run lint (fix: npm run lint:fix)
  - Format: npm run format (check: npm run format:check)
  - Type-check: npm run type-check | strict: npm run type-check:strict
  - Tests (Vitest, node env):
    - All: npm run test
    - Watch: npm run test:watch
    - Coverage: npm run test:coverage
    - Single file: npm run test -- test/pokerEvaluator7.test.ts
    - Single test name: npm run test -- -t "evaluates straight flush"
    - UI: npm run test:ui
- Web app (run in webapp/)
  - Install deps: npm install
  - Dev server (Vite on :3000): npm run dev
  - Build: npm run build
  - Preview built app: npm run preview
  - Lint/format/type-check: npm run lint | npm run format | npm run type-check
  - Tests (Vitest, jsdom env):
    - All: npm run test
    - Coverage: npm run test:coverage
    - UI: npm run test:ui
    - Single file: npm run test -- tests/unit/usePokerEvaluator.test.ts
    - Single test name: npm run test -- -t "renders evaluator"

High-level architecture and structure
- Core library (src/)
  - Entry point: src/index.ts exports the unified API (PokerEvaluator, GameVariant, TexasHoldemGameType), utilities, and legacy functions for compatibility.
  - Evaluator composition:
    - src/PokerEvaluator.ts orchestrates evaluation across variants.
      - On construction, it preloads 7-card hash tables via fastHashesCreators (from pokerHashes7) for performance.
      - High hands: core/HighEvaluator.ts (5- and 7-card), with verbose 7-card support.
      - Low hands: core/LowEvaluator.ts (A-5, 8-or-better, 9-or-better), including verbose for 8/9 in 7-card mode.
      - Texas Hold’em: variants/TexasHoldem.ts composes high and low evaluators; HIGH_LOW_* uses bestFiveOnXHiLowIndexed from pokerEvaluator5.
  - Hash-based evaluation:
    - pokerEvaluator5.ts and pokerEvaluator7.ts implement the fast evaluators over precomputed hash tables.
    - constants.ts defines deck encodings, rank/suit hashes, group thresholds, and helpers used by evaluators.
    - interfaces.ts defines result types (handInfo, verboseHandInfo, hiLowRank, etc.).
  - Utilities:
    - utils/CardUtils.ts (index/string conversions, deck helpers), utils/ValidationUtils.ts (parameter validation).
  - Monte Carlo:
    - pokerMontecarloSym.ts exposes getPartialHandStatsIndexed_7 for probabilistic analysis of partial hands.
  - Tests (Vitest, node env): test/**/*.test.ts cover evaluators, hashes, routines, and Monte Carlo; see vitest.config.ts for aliases and coverage thresholds (high minimums on core paths).
- Demo web app (webapp/)
  - Tech: Vue 3 + Vite + TypeScript. Aliases in vite.config.ts and vitest.config.ts map @gamblingjs to ../src/index.ts for live development against the library source.
  - Structure (src/): components (Card, CardSelector, HandDisplay, MonteCarloSimulator, HandRankingDisplay), composables (usePokerEvaluator, useMonteCarlo, useCardSelection), stores (Pinia), views (Home, Evaluator, Documentation), utils/types.
  - Tests (Vitest, jsdom): tests/{unit, integration, e2e}/*.test.ts run under Vitest; coverage configured in webapp/vitest.config.ts.

Notes for future agents
- When iterating on core library behavior, the webapp consumes ../src via @gamblingjs; running webapp’s dev server reflects library changes without publishing.
- Verbose evaluation is implemented for 7-card high and low8/low9; A-5 verbose is intentionally not implemented.
- Texas Hold’em API (evaluateTexasHoldem) returns hi/low ranks depending on game type (HIGH_ONLY, HIGH_LOW_8, HIGH_LOW_9).
