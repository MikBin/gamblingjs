# Feature Delta — `configurable-poker-table`

**Wave:** DISCUSS · **Status:** DoR passed (9/9) · **Feature type:** Cross-cutting backend (game engine)
**Greenfield:** yes (within brownfield eval library). No prior `docs/product/` or `docs/feature/` existed; this feature bootstraps the `src/poker-table/` module that `docs/architecture.md` *describes but does not contain*.

## Overview

A fully **configuration-driven poker table engine** that simulates a complete game (deal → betting streets → showdown → pot payout) for any standard variant and arbitrary invented variants. Config declares blinds, stacks, street structure, per-street betting type, forced bets, and the evaluation/composition rule — and can be changed hand-to-hand. The engine is a **pure deterministic state machine** with decision sources (bot policy or human/socket) and a seeded RNG injected, so the same code serves both bot-training simulation and live real games.

---

## Wave: DISCUSS / [REF] Personas & JTBD

| Persona | Job-to-be-Done (job story) | job_id |
|---|---|---|
| **P1 — RL/bot researcher** | When I train a poker agent, I want a deterministic, step-able environment that evaluates any variant, so I can run millions of hands and get correct pot payouts. | `j-bot-train` |
| **P2 — Real-game client dev** | When I run a live game, I want the same engine that simulates, so a human/network input is the only thing that differs from a bot. | `j-realgame` |
| **P3 — Variant designer** | When I invent a game, I want to declare it via config without writing engine code, so I can plug in existing *and* non-existing games hand-to-hand. | `j-variant-design` |

**JTBD dimensions (P1, the primary persona):** functional = correct chip payout per hand; emotional = confidence/trust in results under aggression; social = shareable, reproducible benchmarks.

**Four forces (P1):** push = current eval lib has no game loop, can't train; pull = one engine yields both training env and live table; anxiety = will payouts be correct (side pots, split pots)?; habit = rolling a custom half-correct loop.

---

## Wave: DISCUSS / [REF] Locked Decisions

- **[D1]** Engine = **pure deterministic state machine**; `PlayerAgent` + seeded `RngSource` are *injected*. → one engine serves sim + real. Non-negotiable; also yields replay/determinism and trivial testing.
- **[D2]** v1 scope = **maximal**: count + pattern composition, NL/PL/FL, blinds/antes/bring-in, side pots. Delivered as **8 sequenced slices** (not a monolith); the walking skeleton (slice 01) stays thin.
- **[D3]** Composition selector = **Level-1 counts + Level-2 per-pool `pattern` predicates** → invented games need zero engine code.
- **[D4]** Evaluation **reuses existing `src/core` evaluators** (`HighEvaluator`, `Low8/9`, `OmahaEvaluator`, `OmahaHiLoEvaluator`); ranking direction + low-qualify are config.
- **[D5]** Side-pot / multi-way all-in resolution is an **engine rule**; `EvaluationConfig` declares winner(s) per pot.

---

## Wave: DISCUSS / [REF] Configuration Model

```ts
interface TableConfig {                  // fixed at table creation
  gameId: string;
  seats: { min: number; max: number };   // 2 = heads-up … N
  deck: 'standard52' | 'shortDeck' | 'stripped' | 'standard52+jokers';
}

interface HandConfig {                   // per-hand, MUTABLE hand-to-hand
  forcedBets: ForcedBetConfig;
  stacks: { min: number; max: number; buyIn: number };
  streets: StreetConfig[];               // ordered
  evaluation: EvaluationConfig;
}

interface StreetConfig {
  name: string;                          // 'preflop' | 'third-street' | 'flop'
  deal: { holeDown: number; playerUp: number; community: number };
  betting: BettingConfig;
  actionOrder: 'left-of-button' | 'low-upcard' | 'high-hand';
}

interface BettingConfig {
  type: 'no-limit' | 'pot-limit' | 'fixed-limit' | 'spread-limit';
  smallBet?: number; bigBet?: number;    // fixed-limit (doubles on later streets)
  maxRaisesPerStreet?: number;           // limit raise cap
  minBet?: number; minRaise?: number;    // NL/PL floors
}

interface ForcedBetConfig {
  blinds?: { sb: number; bb: number };
  ante?: number;
  bringIn?: number;                      // stud forced bet
  postRule: 'standard' | 'heads-up' | 'stud';
}

interface EvaluationConfig {
  evaluator: 'high' | 'A5-low' | '2-7-low' | 'low8' | 'low9' | 'hi-lo';
  ranking: 'high-wins' | 'low-wins';
  lowQualify?: 8 | 9 | null;
  composition: CompositionSelector;
}

interface CompositionSelector {
  total: number;                         // evaluated hand size (usually 5)
  pools: CompositionPool[];
}
interface CompositionPool {
  pool: 'hole' | 'door' | 'community' | 'hand';
  exactly?: number; min?: number; max?: number;     // Level 1: counts
  pattern?: 'any' | 'pair' | 'trips' | 'flush' | 'straight'
          | ((cards: number[]) => boolean);         // Level 2: invented games
}
```

**Variant → config mapping (proves the model):**

| Variant | `pools` | `total` | evaluator / ranking |
|---|---|---|---|
| Hold'em | `hole[0–5] + community[0–5]` | 5 | high / high-wins (best 5 of 7) |
| Omaha Hi | `hole[exactly 2] + community[exactly 3]` | 5 | high |
| Omaha Hi/Lo | same composition | 5 | hi-lo, lowQualify 8 |
| 7-Stud | `hand[0–5]` (own 7) | 5 | high |
| Razz | `hand[0–5]` | 5 | A5-low / **low-wins** |
| 5-Card Draw | `hand[0–5]` | 5 | high |
| Invented: pair-from-hole + trips-from-board | `hole[exactly 2, pattern pair] + community[exactly 3, pattern trips]` | 5 | high |

---

## Wave: DISCUSS / [REF] User Stories

| # | Story (LeanUX) | job_id |
|---|---|---|
| **S1** | As P1, I run a hand to a correct showdown payout. | `j-bot-train` |
| **S2** | As P3, I declare any variant via config and it plays with no engine branching. | `j-variant-design` |
| **S3** | As P1, I inject agents + seed and get byte-identical replay. | `j-bot-train` |
| **S4** | As P1, I drive the table step-by-step (observation/action) with no hidden-info leak. | `j-bot-train` |
| **S5** | As P3, I define an invented game via per-pool `pattern` and it evaluates correctly. | `j-variant-design` |
| **S6** | As P1, multi-way all-in splits into correct side pots. | `j-bot-train` |
| **S7** | As P2, I swap a bot agent for a socket/human agent and transitions stay identical. | `j-realgame` |
| **S8** | As P3, NL/PL/FL + blinds/antes/bring-in resolve per street per config. | `j-variant-design` |

### Elevator Pitches (representative)

- **S1** — *Before:* can't get a correct chip result. *After:* `playHand(tableCfg, handCfg, agents, seed)` → `{winners:[{seat,pot,amount}], transcript}`. *Decision enabled:* score the bot.
- **S4** — *Before:* can't plug a policy per decision. *After:* `table.step(action)` → `observation` with `legalActions` and **no opponent hole cards**. *Decision enabled:* train stepwise.
- **S5** — *Before:* "pair-from-hole + trips-from-board" is impossible. *After:* set `pattern:'pair'/'trips'` → evaluates. *Decision enabled:* prototype a new variant.

---

## Wave: DISCUSS / [REF] Acceptance Criteria (testable)

**S1** (a) Σ seat chip-deltas = 0 every hand (zero-sum); (b) showdown winner == `PokerEvaluator.evaluate7Cards` on the same cards (cross-check vs existing lib); (c) chopped pot splits evenly.
**S4** (a) `observation` never contains another seat's hole-card indices (property test); (b) only legal actions returned; (c) `toCall/minRaise/maxRaise` reflect current betting state.
**S6** fixed all-in fixture → documented main/side pot distribution exactly.
**S3** same `(seed, agents)` → byte-identical transcript (snapshot + resume equal).
**S8** fixed-limit raise cap enforced; bring-in posted by correct seat.

---

## Wave: DISCUSS / [REF] Story Map & Slices

Backbone (activities): **configure → deal → bet (per street) → advance street → resolve showdown → payout**. Slices ordered by learning leverage (full briefs in `slices/slice-NN-*.md`):

1. **NL heads-up skeleton** (walking skeleton) — pure engine, 1 pot, best-5-of-7 high.
2. **Deterministic replay** — injected agents + seeded RNG.
3. **Step observation/action surface** — RL API, hidden-info safe.
4. **Composition generalization** — Omaha 2/3, Stud own-7 → reuse `OmahaEvaluator`.
5. **Betting structures** — PL + FL (raise cap, bet doubling) + antes + bring-in.
6. **Side pots** — multi-way all-in, main/side split.
7. **Hi-lo / lowball** — low qualify (8/9), A5-low / 2-7-low, ranking direction (Razz).
8. **Pattern validators** — invented games (S5).

---

## Wave: DISCUSS / [REF] Outcome KPIs

- **Correctness:** 100% pass on golden-hand suite; winner == `PokerEvaluator` on randomized deals.
- **Zero-sum:** Σ chip-deltas = 0 every hand (100%).
- **Replay:** same `(seed, agents)` → byte-identical transcript (100%).
- **Config coverage:** 6 reference variants playable with **0** engine-branch code.
- **Hidden-info safety:** property test — no opponent hole-card leak.
- **Throughput:** ≥10k hands/sec heads-up (evaluator-bound; reuses 7-card hash eval).

---

## Wave: DISCUSS / [REF] Definition of Ready (9/9 — passed)

1. Business value — bot training + live game from one engine. ✓
2. Stakeholder need — P1/P2/P3 JTBD. ✓
3. Acceptance criteria defined. ✓
4. Sized — 8 slices. ✓
5. Prioritized — by learning leverage. ✓
6. Architectural input — D1 pure engine; reuse `src/core`. ✓
7. Dependencies present — evaluators exist. ✓
8. Testable — zero-sum / replay / golden hands. ✓
9. No blockers. ✓

---

## Wave: DISCUSS / [REF] Out of Scope

- Multi-table tournaments (MTT) scheduling, blind-schedule automation (config *can* mutate blinds hand-to-hand, but no scheduler).
- Cash-game lobby / matchmaking / persistence.
- GUI rendering (the webapp consumes the engine; not part of it).
- Network transport (a `remote` agent adapter is in scope as the *port*; the wire protocol is not).
- Collusion detection, anti-bot, KYC.
- Time-bank / disconnect handling policy.

---

## Wave: DISCUSS / [REF] Wave Decisions

See [Locked Decisions](#wave-discuss--ref-locked-decisions) [D1]–[D5] above.

**Upstream correction:** `docs/architecture.md` describes a `src/poker-table/` module (PokerTable.ts, LocalDealer/RemoteDealer, PlayerAgent, GameId, TableAnalytics) as already implemented. **It is not** (verified by glob/grep). This feature creates it for real; the architecture doc's API is **non-normative** — the DESIGN wave (`design/architecture.md`) defines the actual contract.

**Handoff to:** DESIGN (`design/architecture.md`) for engine architecture; DEVOPS for the KPI list above.
