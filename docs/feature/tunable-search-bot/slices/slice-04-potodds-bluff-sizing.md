# Slice 04 — Pot-Odds + Bluff Knobs + Bet Sizing

**Feature:** tunable-search-bot (Phase 1) · **Effort:** ~4h · **Depends on:** slice 03

## Goal
Make the stochastic style knobs **honest and measurable**: `bluffFrequency` produces bluffs at the configured rate, `potOddsTolerance` folds marginal hands predictably, and bet sizing clusters sanely. The config must be a trustworthy, comparable description of the opponent's style.

## IN scope
- Pot-odds gating: call/continue only when `equity ≥ potOdds * (1 - config.potOddsTolerance)` (potOdds from `Observation`).
- Bluff injection: with probability `config.bluffFrequency` (seeded), raise/bet a weak hand that pure-equity would fold/check.
- Sizing: gaussian bet sizing via the existing `withSizing(rng, mean, sigma)` driven by `config.sizing`.
- Measurement tests asserting rates track config over many hands.

## OUT scope
- Opponent modelling (range uniform). Search. Bluffs that adapt to the opponent (Phase 2).

## Learning hypothesis
**Disproves:** "the config knobs behave as documented — measured rates track configured values."
**Confirms:** over 10k hands, measured bluff rate ≈ `bluffFrequency` (±2pp) and tighter `potOddsTolerance` measurably increases fold rate on marginal-equity spots — i.e. the config is a precise, reproducible style dial, not magic numbers.

## Acceptance criteria
- [ ] Measured bluff rate within ±2pp of `config.bluffFrequency` over 10k hands (≥2 settings).
- [ ] Strict `potOddsTolerance` (e.g. 0.02) folds marginal-equity facing-bet spots more than loose (e.g. 0.30) — measurable fold-rate delta.
- [ ] Bet sizes fall within `[min, max]` legal bounds 100% of the time (property test).
- [ ] RNG threading is local per decision: bluff/pot-odds sampling does not leak state across hands (reproducibility still holds from slice 05).

## Dogfood moment
Set `bluffFrequency=0.0` vs `0.20`, run 10k hands each vs `alwaysCallAgent`; print measured bluff rates — they should match the two configs.

## Reference class
`agents/stub.ts` gaussian sizing (`withSizing`, `gaussFrac`) and `maybeShove` probability patterns — reused verbatim for consistency.
