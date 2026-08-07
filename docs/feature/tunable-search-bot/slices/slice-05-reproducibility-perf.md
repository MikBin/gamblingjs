# Slice 05 — Reproducibility + Perf Gate

**Feature:** tunable-search-bot (Phase 1) · **Effort:** ~4h · **Depends on:** slices 02–04

## Goal
Lock the two properties that make the bot usable *for the very job it exists for* — RL/benchmarking at scale: full seed-determinism and a per-decision latency/throughput budget. This is the gate before Phase 1 is declared shippable.

## IN scope
- Determinism property test: identical `(seed, config)` → byte-identical action stream over 5k hands; changing `seed` or any used config field diverges the stream.
- Latency benchmark: `decide()` p95 over a corpus of heads-up observations at default `equitySamples`.
- Throughput benchmark: `playHand` hands/sec heads-up, equity-bound.
- Perf budget recorded as checked-in figures + a regression test threshold.

## OUT scope
- Opponent modelling. Search. Optimising the evaluator itself (reuse shipped `HighEvaluator`).

## Learning hypothesis
**Disproves:** "the bot is fully reproducible *and* fast enough to play millions of hands."
**Confirms:** byte-identical replay from `(seed, config)` and `decide()` p95 < 5ms / `playHand` ≥ 5k hands/sec heads-up — so the bot is a valid large-scale training/eval opponent, not a toy.

## Acceptance criteria
- [ ] Same `(seed, config)` → identical action stream (snapshot equality) over 5k hands (property test).
- [ ] Mutating `seed` or any Phase-1-used config field changes the stream (property test).
- [ ] `decide()` p95 < 5ms at default `equitySamples` (benchmark).
- [ ] `playHand` ≥ 5k hands/sec heads-up (benchmark); regression test fails if throughput drops below threshold.
- [ ] No `Math.random` anywhere in `src/poker-table/agents/search/` (lint guard inherited).

## Dogfood moment
Run a 100k-hand heads-up self-play (`searchBot` vs `searchBot`, different seeds); assert determinism holds and print hands/sec + mean `decide()` latency.

## Reference class
Predecessor's `(seed, actionLog)` replay invariant and ≥10k hands/sec sim target; this slice asserts the bot preserves both within an equity-bound budget.
