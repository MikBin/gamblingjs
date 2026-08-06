# Slice 03 — Step Observation/Action Surface (RL API)

**Status: ✅ DONE** · 8 new tests (31 total) · coverage 100/96/100/100 · type-check + lint clean

**Feature:** configurable-poker-table · **Effort:** ~5h · **Depends on:** 02

## Goal
Expose the engine as a step-based environment a policy can drive decision-by-decision, with a guaranteed hidden-information boundary.

## IN scope
- `Table` session object: `step(action) → state`, `observe(seat) → Observation`.
- `Observation` contract (seat, myHole, community, myStack, pot, toCall, minRaise/maxRaise, players[public], actionHistory, isTerminal, legalActions).
- `PlayerPublicView` excludes hole cards (information barrier enforced by construction).
- Random-legal bot drives via `step` to showdown.

## OUT scope
- Gym/PettingZoo adapter wrappers (downstream, language-dependent).
- Vectorized/batched environments.

## Learning hypothesis
**Disproves:** "an agent can decide step-by-step without ever observing opponent hole cards."
**Confirms:** the observation shape is stable enough for bots to depend on (it is the hard-to-change surface).

## Acceptance criteria
- [ ] `observe(seat).players[*]` contains no hole-card indices (property test across 10k hands).
- [ ] `legalActions` is exactly the legal set; illegal `step(action)` throws.
- [ ] `toCall / minRaise / maxRaise` match the betting state for the acting seat.
- [ ] `step` path and `playHand` path reach identical outcomes for the same actions.

## Dogfood moment
A random policy plays 1k hands to terminal via `step`; zero info-leak; zero illegal-action accepts.

## Reference class
OpenAI Gym/PettingZoo turn-based env contracts; information-set poker APIs.
