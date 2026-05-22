# AGENTS.md

## Build & Test
- **Build:** `npm run build` (clean + types + rollup)
- **Lint:** `npm run lint` | Fix: `npm run lint:fix`
- **Format:** `npm run format` (prettier) | Check: `npm run format:check`
- **Test all:** `npm run test` (vitest)
- **Single test:** `npx vitest run test/pokerEvaluator.test.ts`
- **Type check:** `npm run type-check`

## Architecture
TypeScript ESM library for poker hand evaluation and simulation. No runtime dependencies.
- `src/core/` — Core evaluators (HighEvaluator, LowEvaluator)
- `src/variants/` — Game variants (Texas Hold'em, Omaha, Stud)
- `src/poker-table/` — Table simulation (PokerTable, dealers, players, analytics)
- `src/utils/` — Card/validation utilities
- `src/PokerEvaluator.ts` — Unified public API facade
- `test/` — Vitest tests (`.test.ts`), setup in `test/setup.ts`
- Path aliases: `@/*`→`src/*`, `@core/*`, `@utils/*`, `@variants/*`

## Code Style
- TypeScript strict mode, target ES2020, semicolons, single quotes, 2-space indent, trailing commas (es5), arrow parens: avoid
- Prettier + ESLint (extends `eslint:recommended`, `@typescript-eslint/recommended`, `prettier`)
- Tests use vitest globals (`describe`, `it`, `expect` — no imports needed)

## Design Principles
- **SOLID:** Single responsibility per class/module, depend on abstractions not concretions, prefer composition over inheritance, keep interfaces small and focused
- **Pure functions:** Prefer pure functions with no side effects. Isolate state and I/O at boundaries; keep core logic deterministic and testable
- **TDD:** Write tests first (red → green → refactor). Every new function or behavior must have a corresponding test *before* implementation
- **Coverage:** Maintain >95% test coverage (branches, functions, lines, statements). Run `npm run test:coverage` and verify thresholds pass before completing any change
