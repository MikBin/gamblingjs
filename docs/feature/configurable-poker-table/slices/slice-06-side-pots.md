# Slice 06 — Side Pots & Multi-Way All-In

**Feature:** configurable-poker-table · **Effort:** ~6h · **Depends on:** 05

## Goal
Correctly construct main/side pots and split them when stacks are uneven and players go all-in (3+ seats).

## IN scope
- Pot-tier construction from sorted unique all-in contribution levels.
- Per-tier eligible-player sets; per-tier winner evaluation.
- 3+ seat support (raise `seats.max`); correct chip accounting; uncalled-bet return.
- Side-pot included in `playHand` result.

## OUT scope
- Tournament payout ladders.
- Run-it-twice / multiple boards.

## Learning hypothesis
**Disproves:** "the engine splits pots correctly under multi-way all-in with uneven stacks."
**Confirms:** the pot module is independent of betting type and evaluation.

## Acceptance criteria
- [ ] Known 3-way all-in fixture → exact documented main/side distribution.
- [ ] Σ chip-deltas = 0 (zero-sum) including side pots.
- [ ] Player all-in for less cannot win more than their contributed tier.
- [ ] Uncalled overbet returned to the bettor.
- [ ] Eligibility: a folded player never wins any pot tier.

## Dogfood moment
Run the canonical all-in fixture (stacks 100/60/30, all-in) → assert per-tier allocation by hand.

## Reference class
Side-pot algorithms in mainstream poker servers; property tests over random stack distributions.
