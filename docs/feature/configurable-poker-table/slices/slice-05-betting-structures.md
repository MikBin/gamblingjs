# Slice 05 — Betting Structures & Forced Bets

**Feature:** configurable-poker-table · **Effort:** ~6h · **Depends on:** 04

## Goal
Make betting fully config-driven: pot-limit, fixed-limit (small/big bet + raise cap), and forced bets (antes, bring-in) all resolve per street.

## IN scope
- `BettingConfig.type` ∈ {no-limit, pot-limit, fixed-limit}; legal-action generation per type.
- NL/PL floors (`minBet`, `minRaise`); PL max = current pot.
- FL small/big bet, `maxRaisesPerStreet` cap, big-bet doubling on later streets.
- `ForcedBetConfig`: antes (per player) + bring-in (stud, posted by low/high upcard).
- `actionOrder: 'low-upcard' | 'high-hand'` (stud bring-in).

## OUT scope
- Spread-limit (deferred; enum reserved).
- Straddle / kill pots (deferred).
- Side pots (slice 06).

## Learning hypothesis
**Disproves:** "betting limits, raise caps, and forced bets are fully derivable from config without type-laden branching leaking into the core."
**Confirms:** a single `computeLegalActions(state, rules)` covers all betting types.

## Acceptance criteria
- [ ] FL: raises capped at `maxRaisesPerStreet`; bet size = small (early) / big (late) street.
- [ ] PL: raise never exceeds pot-derived maximum; under-raise rejected.
- [ ] Antes collected from every active seat into the pot pre-deal.
- [ ] Bring-in posted by the correct seat (lowest upcard) and counted toward the bet.
- [ ] NL behavior from slice 01 unchanged (regression).

## Dogfood moment
Play a fixed-limit Stud hand and a pot-limit Omaha hand; assert caps/forced bets enforced.

## Reference class
Standard poker rulebooks; existing `poker-sym` stud/omaha simulations for expected behavior.
