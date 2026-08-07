# Slice 02 — Search-Bot Config + Factory Skeleton

**Feature:** tunable-search-bot (Phase 1) · **Effort:** ~5h · **Depends on:** slice 01

## Goal
Deliver the public surface — a forward-compatible `SearchBotConfig` and `createSearchAgent(config): PlayerAgent` — whose v1 `decide()` turns equity into a legal, sized action via pot odds. Establishes the config shape all later phases consume ([D2]).

## IN scope
- `src/poker-table/agents/search/config.ts`: `SearchBotConfig` (all knobs declared: `equitySamples`, `temperature`, `epsilon`, `bluffFrequency`, `potOddsTolerance`, `sizing`, `opponentModel`, `explorationC`, `treeIterations`, `maxDepthStreets`, `seed`) + sane defaults + validation.
- `src/poker-table/agents/search/searchAgent.ts`: `createSearchAgent(config)` → `PlayerAgent`. v1 `decide()`: compute equity (slice 01, range = uniform), compare to pot odds from `Observation.toCall`/`pot`, choose fold/call/raise; sizing via gaussian `withSizing` (pattern from `agents/stub.ts`).
- `index.ts` export.

## OUT scope
- Softmax/epsilon *noise* wiring + benchmark (slice 03). Bluff / pot-odds *knobs* as measurable rates (slice 04). v1 is greedy-equity (temperature treated as 0 / epsilon 0) — just enough to be a legal, reproducible `PlayerAgent`.

## Learning hypothesis
**Disproves:** "equity → pot-odds → legal sized action" is a sound, reproducible decision core.
**Confirms:** the bot is a legal `PlayerAgent` that, even greedy, already beats `randomAgent` and `alwaysCallAgent` — so the foundation and config shape are right before adding the difficulty dial.

## Acceptance criteria
- [ ] `createSearchAgent(cfg).decide(obs)` always returns an action present in `obs.legalActions` (property test over random heads-up observations).
- [ ] Greedy bot beats `randomAgent` and `alwaysCallAgent` > 80% over 10k hands.
- [ ] Config validation rejects impossible values (`equitySamples < 0`, `temperature < 0`, `bluffFrequency ∉ [0,1]`).
- [ ] Every declared config field has a documented default and an explicit "Phase 1 used / unused" note.

## Dogfood moment
Run `playHand(holdemHU, handCfg, [searchBot, randomAgent], seed)` for 5k hands; print win rate and one hand's transcript (decision + equity + pot odds used).

## Reference class
`agents/stub.ts` factory + gaussian-sizing pattern; `createSearchAgent` mirrors `createAggressiveAgent`'s shape.
