# Slice 08 — Pattern Validators (Invented Games)

**Feature:** configurable-poker-table · **Effort:** ~5h · **Depends on:** 04

## Goal
Allow arbitrary per-pool hand-pattern constraints so invented variants (e.g., "pair from hole + trips from community") evaluate with zero engine code.

## IN scope
- `CompositionPool.pattern`: named set {any, pair, trips, flush, straight} + pluggable `(cards:number[])=>boolean`.
- Composition resolver filters enumerated combinations by per-pool pattern before evaluating.
- Validation: pattern-compatible with pool size (e.g., `trips` needs ≥3 cards).
- The reference invented game (pair-from-hole + trips-from-board) playable end-to-end.

## OUT scope
- Exhaustive pattern DSL (named predicates + custom fn cover the stated need).
- Pattern-based pot eligibility (pattern only affects hand formation, not pot).

## Learning hypothesis
**Disproves:** "Level-2 pattern validators let a novel composition rule run without engine changes."
**Confirms:** the composition abstraction is genuinely extensible, closing the P3 (variant designer) job.

## Acceptance criteria
- [ ] Invented variant `{hole:exactly2,pattern:pair}+{community:exactly3,pattern:trips}` evaluates correctly on fixtures.
- [ ] When no legal composition satisfies patterns, the hand ranks as worst possible (no crash).
- [ ] Named patterns (pair/trips/flush/straight) match standard definitions.
- [ ] Custom predicate function honored identically to named patterns.

## Dogfood moment
Define the user's invented game purely in config, deal a fixture where it should win, confirm it wins.

## Reference class
Pattern-matching helpers in `src/routines.ts` (checkStraight, checkDoublePair); predicate-based rule engines.
