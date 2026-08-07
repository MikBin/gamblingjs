# Slice 01 — Equity-vs-Opponent Monte Carlo Primitive

**Feature:** tunable-search-bot (Phase 1) · **Effort:** ~5h · **Depends on:** `configurable-poker-table` (shipped)

## Goal
Prove a correct, fast, seeded Monte Carlo equity estimate of my hand versus a sampled opponent range — the leaf evaluator for both the v1 bot and the later IS-MCTS core ([D7]).

## IN scope
- `src/poker-table/agents/search/equity.ts`: `monteCarloEquity(myHole, community, opponentRange, nSamples, rng) → { win, tie, lose }`.
- Opponent hole cards sampled from `opponentRange` (Phase 1 = uniform over unseen cards); remaining community dealt out; ranks compared via the shipped `HighEvaluator` / `handOfSevenEval`.
- Reuse `shuffle`, `getDiffDeck7`, `createRng(seed)`. No `Math.random`.

## OUT scope
- Any decision logic (slice 02). Any config object (slice 02). Opponent modelling — `range` is an input, here always uniform. Anything beyond Hold'em best-5-of-7.

## Learning hypothesis
**Disproves:** "MC equity vs a sampled range is correct *and* fast enough to be a leaf evaluator."
**Confirms:** matches published preflop equities (AA vs random ≈ 0.852), variance falls with `nSamples`, and throughput ≥ 50k samples/sec — sound to build both v1 and Phase-3 IS-MCTS on.

## Acceptance criteria
- [ ] `monteCarloEquity(['AhAd'], [], uniform, 20000)` ∈ [0.83, 0.87].
- [ ] Result components ∈ [0,1] and `win+tie+lose ≈ 1` (property test).
- [ ] Variance of the win estimate over 50 repeated runs decreases as `nSamples` rises (e.g. 1k vs 20k).
- [ ] ≥ 50k samples/sec (benchmark); no `Math.random` in the module (lint guard).

## Dogfood moment
A script prints equity for ~6 canonical matchups (AA vs random, KK vs AKs, pair vs two overcards, dominated, dominated-by, coin-flip) at `nSamples=20000`; eyeball against known values.

## Reference class
Existing `pokerMontecarloSym.getPartialHandStatsIndexed_7` (hand-distribution, *not* vs-opponent) + `src/core/HighEvaluator`; this slice repurposes the sampling loop to compare two hands.
