# Slice 07 — Hi-Lo / Lowball (Split Pots)

**Feature:** configurable-poker-table · **Effort:** ~5h · **Depends on:** 04, 06

## Goal
Support split-pot (hi-lo) and lowball games: low qualify (8/9), A-5 low, 2-7 low, and ranking direction — enabling Omaha Hi/Lo, Razz, and Stud Hi/Lo.

## IN scope
- `EvaluationConfig`: `evaluator` ∈ {high, A5-low, 2-7-low, low8, low9, hi-lo}; `ranking`; `lowQualify`.
- Low-half pot awarded only when a qualifying low exists (else high scoops).
- Ranking direction: low-wins (Razz) picks the *lowest* rank hand as winner.
- Split across side pots (slice 06) when applicable.

## OUT scope
- Declare/games with draw exchanges (draw exchange dealing is a later config axis).
- Triple-draw / multiple draws.

## Learning hypothesis
**Disproves:** "the evaluator+ranking+qualify config resolves hi-lo and lowball correctly, including no-low scoop cases."
**Confirms:** low-qualify is a pot-layer concern, not an evaluator concern.

## Acceptance criteria
- [ ] Omaha Hi/Lo: high pot and low pot (8-qualify) split correctly; no-qualify → high scoops.
- [ ] Razz: lowest A-5 hand wins (`ranking:'low-wins'`).
- [ ] 2-7 lowball winner correct.
- [ ] Split across side pots consistent with slice 06.
- [ ] Qualify boundary exact (8-high vs 9-high edge cases).

## Dogfood moment
Run Omaha Hi/Lo and Razz configs; verify against known hand outcomes.

## Reference class
`src/core/LowEvaluator` (Low8/Low9/Ato5) and `OmahaHiLoEvaluator`; `poker-sym` hi-lo simulations.
