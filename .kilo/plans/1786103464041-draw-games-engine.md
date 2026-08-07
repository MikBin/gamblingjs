# Plan: General Draw-Game Engine + Complete 8-Game SNG

## Goal
Add a config-driven **draw phase** to the poker-table engine so it can run 5-Card Draw, 2-7 Triple Draw, and any custom draw combination, then finish the 8-Game Sit-and-Go (the blocker identified earlier).

## Context (verified against current code)
- `StreetConfig` (`src/poker-table/config/types.ts:46`) has `deal/betting/actionOrder` — **no draw concept**.
- `ActionType` (`src/poker-table/engine/state.ts:3`) = `fold|check|call|bet|raise|allin` — **no discard**.
- `resumeHand` (`transitions.ts:504`) = `dealStreet` + `runBettingRound` per street (`runBettingRound:459`). `replayHandSteps` (`table.ts:106`) mirrors it.
- The 5-card 2-7 low primitive **exists**: `handOfFiveEvalLowBall27Indexed(c1..c5)` (`pokerEvaluator5.ts:245`), returns **higher = better low** (`pokerEvaluator5.test.ts:270`: best=7461).
- A5-low works on 5 cards already (`LowAto5Evaluator.evaluate`, `core/LowEvaluator.ts:44`).
- **Latent bug:** resolver `2-7-low` spec sets `better: 'lower'` (`evaluation/resolver.ts:63`) but its evaluators return higher=better → a 2-7 showdown picks the *worst* low. Untested because `deuceSeven` is only hand-evaluated, never engine-settled.
- SNG layer is rotation-agnostic (`session/sng.ts:88`) and untracked-but-present. HORSE reuses preset builders (`session/horse.ts`).
- Webapp is data-driven: `gameLabel` rendered generically (`webapp/src/views/SitAndGoView.vue:9`); only swap point is `useSitAndGo.ts:45` + two cosmetic strings.

## Key Decisions
- **D1 — Draw is a street-level config block**, orthogonal to `deal`. A street with `draw` runs: deal (usually 0) → **discard/replace phase** → betting round. First street (initial deal) has no draw. Expresses 5-Card Draw (1 draw), Triple Draw (3 draws), custom (N draws) with zero game-specific branching.
- **D2 — Discard names specific cards by index.** `Action.discardIndices: number[]` (hole-card positions); engine replaces exactly those from the deck. Stand pat = `[]`. Keeps strategy in agents (chosen), not the engine.
- **D3 — Draw phase is a closed loop** (`runDrawRound`), mirroring `runBettingRound`; each active seat discards once in `firstToAct` order. All-in hands are **frozen** (no discard). Implemented in both `resumeHand` and `replayHandSteps` for SNG-play + UI-replay parity.
- **D4 — Fix 2-7 polarity:** set `2-7-low` `better` to `'higher'` and add a 5-card `rank5` branch. Fixes the latent 7-card `deuceSeven` bug and enables 5-card Triple Draw.
- **D5 — Reuse, don't recreate:** 8-Game delegates the 5 fixed-limit games to existing `horseGame` (H/O/R/S/E); only 2-7 Triple Draw, NL Hold'em (`standardHoldem`), and PLO (new `potLimitOmaha`) are built. Rotation reuses `fastHorseLevels()`.

## Ordered Task List (TDD — tests first per AGENTS.md)

### Phase 1 — Evaluator polarity fix + 5-card 2-7 wiring
1. **TEST** `test/poker-table/lowball-polarity.test.ts` (red):
   - 5-card: through `resolveHand` with `{total:5, pools:[{pool:'hole',min:0,max:5}]}`, assert 75432-rainbow (best) beats 85432; a straight and a flush rank as *worse* lows.
   - 7-card regression: `deuceSeven` preset showdown, best low wins.
2. **IMPL** `src/poker-table/evaluation/resolver.ts`:
   - Import `handOfFiveEvalLowBall27Indexed` from `../../pokerEvaluator5`.
   - `2-7-low` spec: `better: 'higher'`; `rank5`: if `c.length===5` call the 5-card fn, if `7` call the 7-card fn, else throw. `rank7` unchanged.

### Phase 2 — Config + types for draw
3. **IMPL** `src/poker-table/config/types.ts`:
   - `DrawConfig { from: 'hole'; max: number }` (union extensible to `'door'` later).
   - Add `draw?: DrawConfig` to `StreetConfig`.
   - Add `'discard'` to `ActionType`; add `discardIndices?: number[]` to `Action`; add `'drawing'` to `GamePhase`; add `discardCount?: number` to `ActionRecord` (public tell).
4. **IMPL** `src/poker-table/config/validate.ts`: validate `draw.max >= 0`, `from` is a known pool; draw streets must be able to source from `hole` (i.e. prior streets dealt hole cards).

### Phase 3 — Engine draw mechanics
5. **TEST** `test/poker-table/draw.test.ts` (red): discard specific indices → exact replacements from deck; stand-pat; over-max/invalid-index rejected; all-in hand frozen; draw order = `firstToAct`; replay parity (`replayHandSteps`); determinism (same seed).
6. **IMPL** `src/poker-table/engine/transitions.ts`:
   - `runDrawRound(state, handCfg, agents, emit)`: set `phase='drawing'`; single pass over active seats in `actingSeat` order; `observe` → `agent.decide` → `applyAction`; restore `phase` after.
   - `applyAction` `'discard'` case: validate indices (unique, in range, count ≤ `draw.max`, against `from:'hole'`); splice discarded, draw replacements from deck into `seat.hole`.
   - `computeLegalActions` (`actions.ts`): if `phase==='drawing'`, return single `{type:'discard', seat, streetIndex, max}`.
   - `resumeHand` `runCurrentStreet`: after `dealStreet`, if street has `draw`, call `runDrawRound` before `runBettingRound`.
   - `observePublic`: include `discardCount` in `ActionRecord`.
7. **IMPL** `src/poker-table/table.ts` `replayHandSteps`: insert the same `runDrawRound` call mirroring `resumeHand` (replay agent returns recorded discard actions in order).
8. **IMPL** `Table.step` / `advanceToNextDecision` parity: transition into `'drawing'`, advance to next undrawn active seat, then to betting. (Highest-risk step; if webapp never exercises draw via step, may defer — see Open Questions.)

### Phase 4 — Presets
9. **IMPL** `src/poker-table/config/presets.ts`:
   - `tripleDraw27({sb,bb,smallBet,bigBet,maxRaises,ante})`: 4 streets; st0 deal 5 hole + FL bet; st1-3 `deal 0` + `draw:{from:'hole',max:5}` + FL bet (`bigBetFromStreet:2`); blinds; eval `2-7-low`, comp `{total:5,pool hole min0 max5}`; gameId `2-7-triple-draw`.
   - `fiveCardDraw({sb,bb,stack,ante})`: st0 deal 5 hole + NL bet; st1 `deal 0`+`draw max5`+ NL bet; eval `high`; gameId `five-card-draw`.
   - `potLimitOmaha({sb,bb,stack,minBet,minRaise})`: from `omahaHi`, map betting to `pot-limit` (mirror `potLimitHoldem:179`); gameId `omaha-pl`.
   - `aFiveTripleDraw(...)` (optional, demo generality): like `tripleDraw27`, eval `A5-low`.
10. **TEST** preset smoke: each preset builds, `validateHandConfig` passes, a single `playHand` settles without throwing.

### Phase 5 — 8-Game rotation + SNG wiring
11. **IMPL** `src/poker-table/session/eightgame.ts`:
    - `type EightGameLetter = 'T'|'H'|'O'|'R'|'S'|'E'|'N'|'P'`.
    - `eightGameGame(letter, level, seats)`: T→`tripleDraw27`(FL from level); H/O/R/S/E→ delegate to `horseGame`; N→`standardHoldem`; P→`potLimitOmaha`. Set `seats` range + `ante`.
    - `eightGameRotation()`: WSOP order `[T,H,O,R,S,E,N,P]` with labels + gameIds.
    - `fastEightGameLevels()` = reuse `fastHorseLevels()`.
12. **TEST** `test/poker-table/session/eightgame.test.ts`: rotation has 8 entries/labels; `runSitAndGo(eightGame, …)` completes deterministically and exercises ≥1 triple-draw + ≥1 PLO hand.
13. **EXPORT** `session/index.ts` + `src/poker-table/index.ts`: add `eightGameGame/eightGameRotation/fastEightGameLevels` and the new presets.

### Phase 6 — Webapp swap
14. **IMPL** `webapp/src/composables/useSitAndGo.ts:45`: `horseRotation()` → `eightGameRotation()`; update title/desc strings in `SitAndGoView.vue:7,135`.

## Risks
- **2-7 polarity change alters `deuceSeven`** (was silently wrong). No existing test depends on the broken behaviour (confirmed: only hand-eval, no engine-settle test) — but re-run full suite.
- **Deck exhaustion** in large multi-draw fields (e.g. 8-handed Triple Draw may exceed 52). Rely on existing SNG retry (`sng.ts:17` RETRIES) to void+reseed; document the limit. Do not add stud-style common-card fallback to draw.
- **`Table.step` draw parity** is the most invasive change; contain risk behind its own tests and consider deferring if unused (see Open Questions).
- **`applyAction` clone cost** during draw adds one clone per discard — negligible vs betting clones.

## Validation
- `npm run type-check`, `npm run lint` (or `lint:fix`), `npm run format:check`.
- `npm run test:coverage` — keep **>95%** (branches/functions/lines/statements) per AGENTS.md.
- Single-suite runs: `npx vitest run test/poker-table/draw.test.ts`, `…/lowball-polarity.test.ts`, `…/session/eightgame.test.ts`.
- Determinism check: run an 8-Game SNG twice with the same seed → identical `SitAndGoResult`.
- Targeted 8-game smoke: confirm each of the 8 gameIds appears in `result.history`.

## Open Questions
1. Does anything use the **`Table.step` imperative API** for draw games, or only `playHand`/`resumeHand` (SNG) + `replayHandSteps` (UI)? If step is unused for draw, defer Task 8 to de-risk. *(Recommend: implement Task 8 but timebox; defer if it balloons.)*
2. Keep **A-5 Triple Draw** preset (Task 9 optional) or drop as YAGNI? *(Recommend: keep — it's ~10 lines and proves the "custom combination" generality the user asked for.)*
