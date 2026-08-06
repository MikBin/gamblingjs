# Slice 04 — Composition Generalization

**Feature:** configurable-poker-table · **Effort:** ~4h · **Depends on:** 01

## Goal
Generalize the composition selector so Omaha (exactly 2 hole / 3 community) and Stud (best 5 of own 7) play from config with zero engine branching.

## IN scope
- `CompositionSelector` enumerator: respects `exactly/min/max` per pool + `total`.
- Map evaluator names → `src/core` evaluators; ranking direction (high-wins/low-wins).
- Omaha config validates (2 hole, 4 dealt) and reuses `OmahaEvaluator` as a cross-check.
- Stud config (own 7, no community, `hand` pool).

## OUT scope
- Pattern predicates (slice 08).
- Hi-lo / low qualify (slice 07).

## Learning hypothesis
**Disproves:** "count composition alone expresses multiple real variants with no engine branch."
**Confirms:** the pool-count model is the right abstraction level.

## Acceptance criteria
- [ ] Omaha hand winner == `OmahaEvaluator` on identical cards (exactly-2/exactly-3 enforced).
- [ ] Invalid composition (e.g., requesting 3 hole when only 2 legal) is rejected at config validation.
- [ ] Hold'em (0–5/0–5) and Omaha (2/3) both resolve from the same code path.
- [ ] Stud `hand`-pool winner == best-5-of-7 high on the player's own 7.

## Dogfood moment
Run Hold'em, Omaha, and Stud configs over the same engine; only config differs.

## Reference class
Existing `OmahaEvaluator` pair-sum optimization; combinatoric enumeration from `src/routines.ts`.
