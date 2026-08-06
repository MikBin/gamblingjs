# Slice 01 — NL Heads-Up Skeleton (Walking Skeleton)

**Feature:** configurable-poker-table · **Effort:** ~6h · **Depends on:** —

## Goal
Prove a pure, config-driven engine can deal a heads-up No-Limit Hold'em hand and produce a correct showdown payout in a single pot.

## IN scope
- `TableConfig` (seats=2, standard52) + `HandConfig` (NL, blinds, 4 streets preflop→river, best-5-of-7 high, count composition).
- Pure `GameState` (immutable) + seeded `RngSource`.
- `deal` → betting round → `advanceStreet` (deal community per street) → `resolveShowdown`.
- Single main pot only; no side pots; no chops edge cases beyond even split.
- `playHand(tableCfg, handCfg, agents, seed)` returns `{winners, transcript, finalStacks}`.
- One `PlayerAgent` implementation: always-call/random-legal stub.

## OUT scope
- Pot-limit / fixed-limit, antes, bring-in (slice 05).
- Side pots / 3+ seats (slice 06).
- Hi-lo / lowball (slice 07).
- Pattern validators (slice 08).
- Step `observation/action` API (slice 03 — `playHand` is the only surface here).

## Learning hypothesis
**Disproves:** "the config-driven pure engine can reach a correct heads-up showdown/payout."
**Confirms:** the state-machine + injected-RNG + count-composition abstractions are sound enough to build the rest on.

## Acceptance criteria
- [ ] Σ seat chip-deltas = 0 over 10,000 random hands.
- [ ] Showdown winner == `PokerEvaluator.evaluate7Cards` on identical cards (cross-check).
- [ ] Fold-to-win (one folds) awards pot correctly; blinds posted by correct seats.
- [ ] Blinds + min-raise (1bb) enforced; cannot act below legal bounds.
- [ ] Identical `(seed)` → identical deal/transcript (with deterministic stub agents).

## Dogfood moment
Bot vs stub plays 10k hands; assert zero-sum invariant holds and one hand's transcript prints legibly.

## Reference class
Existing `poker-sym` deal/shuffle + `src/core/HighEvaluator`; this slice adds the loop around them.
