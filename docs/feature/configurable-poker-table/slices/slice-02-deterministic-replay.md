# Slice 02 — Deterministic Replay

**Status: ✅ DONE** · 6 new tests (23 total) · type-check + lint clean

**Feature:** configurable-poker-table · **Effort:** ~3h · **Depends on:** 01

## Goal
Make any hand fully reproducible: same `(seed, agents)` → byte-identical transcript, with snapshot/resume.

## IN scope
- `PlayerAgent` interface finalized (decide + onEvent).
- Seeded `RngSource` (Mulberry32, reused from `poker-sym/src/utils/rng.ts`).
- RNG state folded into `GameState`; transitions are pure functions of `(state, action, rng)`.
- Transcript capture + state snapshot; resume from snapshot.

## OUT scope
- Step API surface (slice 03).
- New agents beyond the stub (a real bot is downstream).

## Learning hypothesis
**Disproves:** "determinism is actually achievable end-to-end (no stray `Math.random`, no mutation)."
**Confirms:** immutability discipline holds; snapshot/resume is exact.

## Acceptance criteria
- [ ] Same `(seed, agents)` → byte-identical `transcript` JSON.
- [ ] Snapshot at any action → resume → identical final state.
- [ ] Zero non-injected randomness in `src/poker-table/` (grep guard / lint rule).
- [ ] `onEvent` emits every state change in order.

## Dogfood moment
Record a hand, snapshot mid-river, resume, assert final stacks match the non-snapshot run.

## Reference class
`poker-sym` Mulberry32 RNG; classic reducer/pure-transition pattern.
