# Slice 03 — Difficulty Dial + Benchmark Harness

**Feature:** tunable-search-bot (Phase 1) · **Effort:** ~5h · **Depends on:** slice 02

## Goal
Turn raw equity strength into a **tunable difficulty spectrum** by wiring `temperature` (softmax over action values) and/or `epsilon` (ε-greedy) to action selection, and prove the bot is a credible opponent by benchmarking it against every existing heuristic bot.

## IN scope
- Action-selection layer in `searchAgent.ts`: softmax over (equity-scaled) action utilities parameterised by `config.temperature`; ε-greedy fallback. Pick softmax as primary (ε-greedy optional).
- `src/poker-table/agents/search/benchmark.ts`: heads-up match runner — `searchBot(cfg)` vs each of `{random, alwaysCall, alwaysFold, aggressive, maniac, callingStation, tight}`, configurable hands + seeds, prints win-rate matrix.
- Strength-monotonicity test across ≥4 `temperature` settings.

## OUT scope
- Opponent modelling (range stays uniform). Tree search. Anything beyond heads-up.

## Learning hypothesis
**Disproves:** "the bot's strength is monotonic in `temperature`, and it clears a minimum credibility bar."
**Confirms:** low-temp ≫ high-temp vs `randomAgent`; and at low temp it is at least competitive with (ideally beats) the smarter heuristic bots (`aggressive`, `tight`) — proving the dial works and the baseline is credible, not a cliché.

## Acceptance criteria
- [ ] Win rate vs `randomAgent` strictly decreases as `temperature` rises across ≥4 settings (10k hands each).
- [ ] Lowest-`temperature` bot beats `randomAgent` and `alwaysCallAgent` > 90%.
- [ ] Benchmark prints a win-rate matrix over all 7 heuristic opponents; recorded as a checked-in snapshot.
- [ ] No non-determinism introduced: softmax sampling threads the seeded RNG ([D4]).

## Dogfood moment
Run the full benchmark once at `temperature=0.1` and once at `1.5`; eyeball the matrix shift from "crushes everything" toward "≈ coin-flip vs random".

## Reference class
Existing heuristic bots in `agents/stub.ts` as opponents; the benchmark is the "train against a proper opponent" dogfood that justifies the whole feature.
