# Feature Delta — `tunable-search-bot`

**Wave:** DISCUSS · **Status:** DoR passed (9/9) · **Feature type:** Backend (agent module)
**Greenfield:** no — brownfield. Builds on the shipped `configurable-poker-table` engine (`src/poker-table/`), reusing its `PlayerAgent`, `Observation`, seeded `RngSource`, and `src/core` evaluators. Adds `src/poker-table/agents/search/`.

**Density:** lean + ask-intelligent (resolver default; no `~/.nwave` config). No `ask-intelligent` trigger fired (single persona P1; ≤2 bounded contexts; WS strategy A; no compliance) → strict lean output, no Tier-2 menu. One silent-skip density event recorded.

## Overview

A **tunable, training-free poker bot** whose decision core mixes Monte Carlo equity with bounded search, controlled entirely by a config object. No offline training, no neural networks, no precomputed strategy tables — the bot re-searches every decision from the current observation, so its behaviour is a pure function of `(observation, config, seed)`. The config exposes a **difficulty dial** (temperature / epsilon) and a **strength ceiling** (search depth / iteration count), yielding a spectrum of credible opponents to benchmark RL/bot research against — replacing the exploitable cliché heuristic bots (`maniac`, `calling-station`, `tight`, `random`) with a rational-ish, reproducible baseline.

Phased delivery: **Phase 1 = PIMC rollout bot** (equity-vs-opponent Monte Carlo + softmax/config) ships first as this feature's committed scope; **Phase 2 = opponent modelling**; **Phase 3 = IS-MCTS/UCT core**. Phases 2–3 are documented as a committed roadmap and get their own slice briefs when started.

---

## Wave: DISCUSS / [REF] Personas & JTBD

| Persona | Job-to-be-Done (job story) | job_id |
|---|---|---|
| **P1 — RL/bot researcher** (primary, = existing persona from `configurable-poker-table`) | When I train or evaluate a poker agent, I want a strong, tunable, reproducible opponent that needs no training and adapts to the game state, so I can benchmark my agent against a credible non-trivial baseline rather than against exploitable cliché bots. | `j-bot-train` |

**JTBD dimensions (P1):** functional = produce a legal action from an `Observation`, reproducibly, across a difficulty spectrum; emotional = confidence that win/loss reflects the opponent's search depth/skill, not bugs or dumb luck; social = a shareable, config-described opponent others can reproduce ("the search bot at `temperature=0.3, equitySamples=20000`").

**Four forces (P1):** push = existing heuristic bots are exploitable clichés and expose no meaningful difficulty knob; pull = a config-driven search bot gives a real difficulty dial and a near-rational baseline; anxiety = will pure-JS search be fast enough, and will MC equity be meaningful / IS-MCTS strategy-fusion too leaky?; habit = hand-tuning threshold bots.

---

## Wave: DISCUSS / [REF] Locked Decisions

- **[D1] No training, ever.** Pure online search — every decision is re-derived from the observation. CFR / MCCFR / CFR+ and any offline solving, plus neural value/policy networks (ReBeL/DeepStack style), are **permanently out of scope** (user constraint). This is what makes the bot "prebuilt with a config".
- **[D2] Forward-compatible config.** `SearchBotConfig` declares **all** knobs on day 1 — `equitySamples`, `temperature`, `epsilon`, `bluffFrequency`, `potOddsTolerance`, `sizing`, `opponentModel`, `explorationC`, `treeIterations`, `maxDepthStreets`, `seed` — even though Phase 1 only consumes a subset. Prevents config churn across phases and makes a saved config a stable, comparable artifact.
- **[D3] Rollout = drive the existing engine.** A rollout clones the `GameState`, assigns opponent hole cards sampled from the model, and runs the shipped engine to showdown. **Never a second game model** (reuses [D1] of the predecessor). The engine's `step`/`applyAction` is the search simulator.
- **[D4] Reproducible via the seeded RNG.** No `Math.random` (lint-guard inherited from predecessor); `decide(observation, config, seed)` is a pure function. Same `(observation, config, seed)` → identical action.
- **[D5] Heads-up Hold'em first.** 2-player NLHE. Multi-way / 6-max and Omaha/Stud search trees are Phase 4+ (deferred); search cost and opponent-modelling fan-out make them a separate feature each.
- **[D6] Phased shipping, each phase independently benchmarkable.** Phase 1 (PIMC rollout) is the committed scope of this feature; Phase 2 (opponent modelling) and Phase 3 (IS-MCTS/UCT) are sequels with their own slice briefs. No mega-feature DoR.
- **[D7] The equity primitive is the IS-MCTS leaf evaluator.** `monteCarloEquity(...)` (slice 01) is designed once and reused as the leaf value in Phase 3's tree search — designing it well now amortises across phases.

---

## Wave: DISCUSS / [REF] Scope Assessment: PASS

Full vision is large (3 phases) but each phase ships end-to-end and is independently usable/benchmarkable. This feature's **committed scope = Phase 1** (5 slices, each ≤1 day); Phases 2–3 are a documented roadmap, not part of this DoR. No oversized-signal (≤5 slices, 1 bounded context `agents/search/`, ≤2 integration points, <2 weeks). Carpaccio taste tests applied per slice in `slices/`.

---

## Wave: DISCUSS / [REF] User Stories

| # | Story (LeanUX) | job_id |
|---|---|---|
| **S1** | As P1, I dial the opponent's strength via config (`temperature`/`epsilon`), so I can generate opponents across a difficulty spectrum for training. | `j-bot-train` |
| **S2** | As P1, the bot decides from equity-vs-a-sampled-range + pot odds, so it is a rational-ish baseline, not a hardcoded cliché. | `j-bot-train` |
| **S3** | As P1, the same `(seed, config)` reproduces identical play, so my benchmarks are reproducible and shareable. | `j-bot-train` |
| **S4** | As P1, the bot runs fast enough heads-up to play millions of hands, so training/eval scales. | `j-bot-train` |
| **S5** | As P1, the bluff / pot-odds knobs behave as documented (measured rates track config), so I can trust the opponent's "style". | `j-bot-train` |

### Elevator Pitches

- **S1** — *Before:* difficulty is fixed per heuristic bot, no dial. *After:* set `config.temperature` from `0.05`→`2.0`, run `playHand(tableCfg, handCfg, [searchBot, randomAgent], seed)` over 10k hands → printed win rate falls monotonically. *Decision enabled:* pick the difficulty for this training run.
- **S2** — *Before:* bots are `if facingBet roll<60 raise` clichés. *After:* `createSearchAgent(config)` returns a `PlayerAgent` whose `decide()` calls `monteCarloEquity(myHole, community, range, nSamples)` and compares to pot odds → returns a sized fold/call/raise. *Decision enabled:* trust the opponent as a rational baseline, not a pattern to exploit.
- **S3** — *Before:* can't reproduce a bot's play across machines. *After:* same `(seed, config)` → byte-identical action stream (property test). *Decision enabled:* publish a reproducible benchmark.
- **S5** — *Before:* "aggressive" means whatever the thresholds say. *After:* set `config.bluffFrequency = 0.15`, run 10k hands → measured bluff rate prints `0.14–0.16`. *Decision enabled:* dial a precise, comparable style.

---

## Wave: DISCUSS / [REF] Acceptance Criteria (testable, embedded)

- **S1** Win rate vs `randomAgent` is **monotonically decreasing** in `temperature` across ≥4 settings over 10k hands; low-temp bot beats `randomAgent` and `alwaysCallAgent` > 90%.
- **S2** (a) `monteCarloEquity(['AA'], [], range=uniform, nSamples)` ≈ 0.852 ± 0.02; (b) equity ∈ [0,1] always; (c) variance of equity estimate decreases as `nSamples` rises (property).
- **S3** Identical `(seed, config)` → identical action stream (snapshot equality) over 5k hands; changing `seed` or any config field diverges.
- **S4** `decide()` p95 latency < 5ms heads-up at default `equitySamples`; `playHand` throughput ≥ 5k hands/sec heads-up (equity-bound).
- **S5** Measured bluff rate within ±2pp of `config.bluffFrequency` over 10k hands; tight `potOddsTolerance` folds marginal-equity hands measurably more than loose.

---

## Wave: DISCUSS / [REF] Story Map & Slices

Backbone (activities): **estimate equity → score actions (equity vs pot odds) → inject noise (difficulty) → size the bet → return legal action**. Phase-1 slices, ordered by learning leverage (full briefs in `slices/slice-NN-*.md`):

1. **Equity-vs-opponent Monte Carlo primitive** (leaf evaluator; reused by Phase 3) — `monteCarloEquity(...)`.
2. **Search-bot config + factory skeleton** — forward-compatible `SearchBotConfig`, `createSearchAgent(config)`, v1 decide().
3. **Difficulty dial + benchmark harness** — softmax/epsilon wiring + bot-vs-heuristic-bots benchmark.
4. **Pot-odds + bluff knobs + bet sizing** — measured rates track config.
5. **Reproducibility + perf gate** — determinism property + latency/throughput budget.

### Roadmap (committed direction, separate features later)

- **Phase 2 — opponent modelling:** Bayesian range narrowing from `actionLog`; `opponentModel: 'uniform'|'bayesian'`. Learning hypothesis: improves win rate vs exploitable heuristic bots (calling-station, nit).
- **Phase 3 — IS-MCTS / UCT core:** information-set tree search with UCB1 selection, rollouts via the engine, `monteCarloEquity` as leaf. Learning hypothesis: lookahead beats 1-ply equity at equal compute; if not, strategy-fusion dominates and search isn't worth the JS complexity.
- **Phase 4+ — multi-way / 6-max, then Omaha/Stud trees.**

---

## Wave: DISCUSS / [REF] Outcome KPIs (Phase 1)

- **Strength:** low-temp search bot beats `randomAgent` & `alwaysCallAgent` > 90% over 10k hands.
- **Monotonic difficulty:** win rate vs `randomAgent` monotonic decreasing in `temperature`.
- **Reproducibility:** same `(seed, config)` → byte-identical action stream (100%).
- **Perf:** `decide()` p95 < 5ms heads-up; `playHand` ≥ 5k hands/sec heads-up.
- **Honest knobs:** measured bluff rate within ±2pp of config over 10k hands.
- **Equity correctness:** AA vs random preflop ≈ 0.852 ± 0.02; estimate variance decreasing in `nSamples`.

---

## Wave: DISCUSS / [REF] Definition of Ready (9/9 — passed)

1. Business value — credible tunable training opponent (vs exploitable cliché bots). ✓
2. Stakeholder need — P1 JTBD (`j-bot-train`). ✓
3. Acceptance criteria defined. ✓
4. Sized — 5 Phase-1 slices. ✓
5. Prioritized — by learning leverage (equity primitive first). ✓
6. Architectural input — [D2] forward-compatible config; [D3] reuse engine for rollouts. ✓
7. Dependencies present — engine, `PlayerAgent`, `Observation`, seeded RNG, 7-card eval all shipped. ✓
8. Testable — reproducibility property, equity cross-check, benchmark vs heuristic bots. ✓
9. No blockers. ✓

---

## Wave: DISCUSS / [REF] Out of Scope

- Opponent modelling / Bayesian range narrowing — **Phase 2**.
- IS-MCTS / UCT tree search — **Phase 3**.
- CFR / MCCFR / CFR+ / offline solving — **permanently out** ([D1]).
- Neural value/policy networks (ReBeL/DeepStack) — **permanently out** ([D1]).
- Multi-way / 6-max — **Phase 4** ([D5]).
- Omaha / Stud search trees (composition differs) — **Phase 5+** ([D5]).
- Opponent exploitation beyond a uniform range — until Phase 2.
- GUI / remote-agent wire protocol / persistence — covered by predecessor's non-goals.

---

## Wave: DISCUSS / [REF] WS strategy · Driving ports · Pre-requisites

- **WS strategy: A** — reuse the existing walking skeleton (engine + step API from `configurable-poker-table`). No new skeleton; the bot is additive.
- **Driving ports (inbound):** the library factory `createSearchAgent(config): PlayerAgent`, consumed by the shipped `playHand(tableCfg, handCfg, agents, seed)` / `table.step()`. No CLI / HTTP / GUI.
- **Pre-requisites:** `configurable-poker-table` feature shipped — `agents/types.ts` (`PlayerAgent`), `engine/state.ts` (`Observation`, `Action`), `engine/rng.ts` (`createRng`), `src/core/HighEvaluator`, `src/routines.ts` (`shuffle`, `getDiffDeck7`).

---

## Wave: DISCUSS / [REF] Wave Decisions Summary

**Key Decisions:** [D1] no training (online search only) · [D2] forward-compatible `SearchBotConfig` · [D3] rollouts drive the shipped engine · [D4] seeded-RNG reproducibility · [D5] heads-up Hold'em first · [D6] phased shipping, Phase 1 committed · [D7] equity primitive = IS-MCTS leaf.

**Requirements summary:** P1 needs a tunable, reproducible, training-free opponent across a difficulty spectrum. Phase 1 delivers the PIMC rollout bot (equity + softmax/config + pot-odds/bluff knobs); Phases 2–3 add opponent modelling and IS-MCTS.

**Constraints established:** zero `Math.random`; pure `decide(obs, config, seed)`; heads-up NLHE; ≥5k hands/sec; no second game model.

**Upstream changes:** none. This feature consumes (does not modify) the `configurable-poker-table` engine.

**Handoff to:** DESIGN (`design/architecture.md`) for the `agents/search/` module + `SearchBotConfig`; DEVOPS for the KPI list above.
