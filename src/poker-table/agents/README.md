# Poker Agents — Bots & Improvement Roadmap

Player agents for the `poker-table` engine. Every agent implements the
`PlayerAgent` port (`types.ts:3`) — `decide(observation) → Action` — so any bot
slots into `playHand(...)` / `Table.step(...)` for any variant and bet type with
no engine changes. All bots are **deterministic given a seed** and reuse the
engine's `resolveHand` / `resolveHiLo` resolvers, so they are **variant-agnostic
by construction** (Hold'em, Omaha, Hi/Lo, Razz, Stud, Draw; NL/PL/FL/Spread).

## The three tiers

| Tier | File | Decision signal | Strength | Adaptive? | Tunable? |
|---|---|---|---|---|---|
| **Stub** | `stub.ts` | Hardcoded behaviour trees | Weak (cliché) | No | No (personality fixed) |
| **Smart (heuristic)** | `smart.ts` | Made-hand strength (`madeStrength`, Chen preflop, draw bonus) + context thresholds | Medium | No (plays its own cards) | Yes (`aggression`/`tightness`/`bluffiness`/`sizing`) |
| **Search (Monte-Carlo)** | `search/` | True win-share equity (`monteCarloEquity`) + pot odds | Medium-High | No (uniform opponent range) | Yes (`temperature`/`aggression`/`tightness`/`bluffFrequency`/`equitySamples`) |

`createSmartBot` and `createSearchAgent` are siblings: same proven policy
skeleton and the same `analyzeObservation` / `discardAction` / resolver path —
they differ only in the hand-strength signal (heuristic vs. sampled equity).

### Quick reference
- `stub.ts` — `alwaysCallAgent`, `alwaysFoldAgent`, `createRandomAgent`,
  `createAggressiveAgent`, `createManiacAgent`, `createCallingStationAgent`,
  `createTightAgent`. Baselines / sparring partners / tests.
- `smart.ts` — `createSmartBot({ seed, aggression, tightness, bluffiness?, sizing? })`.
- `search/searchAgent.ts` — `createSearchAgent({ seed, temperature?, aggression?,
  tightness?, bluffFrequency?, equitySamples?, sizing? })`.
- `search/equity.ts` — `monteCarloEquity(...)`: the reusable Monte-Carlo equity
  primitive (also the intended leaf evaluator for future IS-MCTS).

---

## Current state (what ships)

The search bot is **fully playable today** for cash games and SNGs across all
variants and bet types: legal, zero-sum, deterministic, and rational-ish. It
beats the `randomAgent` and `alwaysCallAgent` baselines decisively and its
strength is monotonic in `temperature` (greedy > noisy). See
`test/poker-table/searchBot.test.ts` and the design at
`docs/feature/tunable-search-bot/design/architecture.md`.

What is **not** implemented is below. None of it blocks playing against the bot;
it controls **how strong / how correct for the game format** the bot is.

---

## Improvement roadmap (prioritized by impact-per-effort)

| # | Improvement | What it adds | Cost of not having it | When you need it | Effort | Status |
|---|---|---|---|---|---|---|
| 0 | **ICM awareness (tournament value)** | Decisions weighted by payout structure, not raw chips | Bot plays chip-EV — **too aggressive on SNG bubbles / final tables / pay jumps** | **Any SNG/tournament training** (cash is unaffected — chip-EV is correct there) | Medium | Not started |
| 1 | **Multi-way calibration (N>2)** | Tune raise/bet/bluff thresholds for 6-max / 9-max | Equity already handles N opponents; the *policy* is heads-up-tuned, so it may play slightly too loose full-ring | Full-ring cash or SNG | Small (data-driven threshold tuning + tests) | Not started |
| 2 | **Opponent modelling (Phase 2)** | Put the opponent on a range from their `actionLog`; narrow it over the hand | Bot assumes opponent cards are uniform-random — it plays its own cards, not yours. Exploitable by an adaptive human | When you want a *tough, adaptive* opponent rather than a fixed practice one | Medium (`OpponentModel` seam already exists in the design) | Designed, not built |
| 3 | **IS-MCTS / UCT lookahead (Phase 3)** | Multi-street search: plan "call now to bluff the river", value of future fold equity | 1-ply equity + pot odds only. Correct for ~90% of decisions; misses deep-SPR planning | Deep-stacked cash, or pushing toward near-optimal strength | Large (tree search; `monteCarloEquity` is already the leaf) | Designed, not built |

### Guidance by game format

- **Heads-up cash** → ship as-is. Fully tuned and verified.
- **6-max / 9-max cash** → playable now; add **#1 (multi-way calibration)** if you
  want it well-tuned full-ring.
- **SNG / tournament (for fun)** → playable now.
- **SNG / tournament (for correct strategy training)** → add **#0 (ICM)** first —
  it matters more for tournament results than #2 or #3 do.

---

## Detail on each improvement

### #0 — ICM awareness (the real SNG gap)
The shipped bot maximizes **chip-EV** (expected chips). For cash this is exactly
right (chips = money, linear). In a tournament, chips have **non-linear value**:
busting near a pay jump or the bubble is disproportionately costly, so correct
play is more risk-averse than chip-EV implies. Without ICM the bot will call off
its stack at break-even equity on a bubble where it should fold.

**How to add:** introduce a tournament-aware EV that weights chip deltas by the
ICM payout function (or a faster Malmuth-Haruthunyan / buster approximation), and
gate it behind a config flag (cash = cEV, tournament = ICM). The pot/payout data
is available at the session layer (`session/sng.ts`); the agent would receive the
payout structure through its config or observation. This is a **policy-layer**
change — the equity primitive and engine are untouched.

### #1 — Multi-way calibration
`monteCarloEquity` already samples and ranks all N opponents correctly. Only the
decision thresholds in `search/searchAgent.ts` (`utility()`) and the smart bot's
`requiredStrength()` were tuned heads-up. In multi-way pots your equity share
shrinks, so the continue/raise bars should rise with `opponents`. A data-driven
pass (run the bot vs. the existing bots across N=2..9, fit thresholds to a target
win rate) closes this without architectural change.

### #2 — Opponent modelling (Phase 2)
Today every opponent's hidden cards are sampled uniformly from the unseen deck
(the `OpponentModel` / `uniformModel` abstraction in the design). Bayesian range
narrowing — tighten the sampled range from the opponent's `actionLog` (bet/raise
= stronger range; call = capped; fold = dead) and their visible upcards in Stud —
makes the bot exploit *weak* opponents and respect *strong* ones. It is a pure
swap of the model passed into `monteCarloEquity`; the rest of the bot is
unchanged. This is what makes the bot "adapt to the game".

### #3 — IS-MCTS / UCT lookahead (Phase 3)
The current decision is 1-ply: "is my equity + pot odds good enough now?".
Information-Set Monte-Carlo Tree Search (Cowling/Powley/Whitehouse 2012) expands
a tree over future betting rounds, using UCB1 for selection and
`monteCarloEquity` as the leaf value, with rollouts driven by the **existing
engine** (`engine/transitions.applyAction`). This is the path to a near-optimal,
planning opponent. It is the largest item; the design (architecture.md §10) is
shaped so it lands as an additive `search/tree.ts` with no change to the config
shape, factory signature, or `Observation`. Known limitation: IS-MCTS suffers
strategy-fusion/leakage in poker (Long et al. 2010) — acceptable for a *training
opponent*, not for claiming Nash-optimal play.

---

## Extension seams (where new work plugs in)

- **New opponent model** → implement the `OpponentModel` interface (design §7.2),
  pass it into `monteCarloEquity`. Phase 2 lands here.
- **New decision core** → `createSearchAgent` gains a `core: 'pimc' | 'ismcts'`
  strategy switch reading the existing reserved config knobs (`explorationC`,
  `treeIterations`, `maxDepthStreets`). Phase 3 lands here.
- **Tournament EV** → config flag + a payout-weighted EV in `utility()`. ICM
  lands here.
- **New variant** → none required in the bots. Add the preset in
  `config/presets.ts`; the bots already route through `resolveHand`/`resolveHiLo`.

## Constraints that must hold for any change
- **No `Math.random`** anywhere in `agents/` — thread the seeded `RngSource`
  (engine/rng.ts) through every sampling call, or reproducibility breaks.
  `src/routines.ts:shuffle` is forbidden (it uses `Math.random`).
- **No `Observation` changes** — the frozen surface is defended by property
  tests; read the variant from `obs.handCfg` (already present).
- **Variant-agnostic** — no per-variant `switch` in the bots; rank through the
  engine resolvers.
