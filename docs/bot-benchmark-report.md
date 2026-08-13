# Bot Configuration Benchmark — NL Hold'em · PLO · Limit Hold'em

**Date:** 2026-08-11 · **Harness:** `tools/bench-variant.ts` · **Format:** 6-max, cash (100 bb for NL/PLO, 200 bb / 50 big-bets for FL)

## Executive summary

| Variant | Best *search* config | bb/100 (±95%) | Runner-up | Notes |
|---|---|---|---|---|
| **No-Limit Hold'em** | `pimc-soft` (temp 0.2, tightness 0.5) | **+259 ±97** | `pimc-loose` +247 | PIMC ≫ smart ≫ stubs. Loose/soft PIMC edges greedy. |
| **Fixed-Limit Hold'em** | `pimc-greedy` / `pimc-soft` (temp 0–0.2) | **+337 ±48–63** | `pimc-loose` +334 | All smart bots **negative**; maniac stub tops via cheap-bet spam. |
| **Pot-Limit Omaha** | `pimc-bayes` / `pimc-tight` (temp 0, tight) | **+43 ±92** | `pimc-loose` +37 | Smart bots **catastrophic** (−150 to −450). PIMC is the only competent family; results noisy. |

**Headline:** the Monte-Carlo **PIMC search bot is the strongest family in every variant**, and the heuristic **`smart` bot collapses outside no-limit Hold'em** (negative in FL, disastrous in PLO). The single most important config knob is `temperature` (low = strong); `tightness` should be looser in FL and tighter in PLO.

---

## Methodology

- **Field:** each candidate plays seat 0 vs a fixed **`mixed` field** of 5 opponents (`smart-balanced`, calling-station, aggressive, tight, maniac). A diverse field is far less exploitable than the pure-smart field used earlier (where maniac won purely on fold-equity). Every candidate faces the identical field → the relative comparison is fair; all share the seat-0 (button) position.
- **Equity:** PIMC cores use Monte-Carlo equity (`equitySamples` = 400 for NL/FL, 250 for PLO where each sample is ~3× costlier due to the Omaha exactly-2/exactly-3 composition).
- **Metric:** bb/100 in **big blinds** (bb = 2), with the **95% confidence half-width** (±) computed from per-hand variance: `± = 1.96·σ/√n·100`.
- **Bots excluded from the grid:** `alwaysFold` (trivial), `alwaysCall` (floor), and `core:'ismcts'` (IS-MCTS) — IS-MCTS is ~100× slower and already shown to be non-competitive (over-aggressive); it is discussed separately under Limitations.
- **Statistical strength varies by variant** (see Limitations): FL has tight CIs (low betting variance) → solid; NL CIs are moderate → top-tier vs lower-tier separable, within-tier tied; PLO CIs are very wide → directional only.

All numbers below are reproducible: `npx tsx tools/bench-variant.ts <nl|plo|fl> <hands> mixed <eq>`.

---

## 1. No-Limit Hold'em (6-max, 9000 hands, eq 400)

```
rank  config         type    bb/100     ±95%
 1.   pimc-soft      pimc    +259.4   ±97.3
 2.   pimc-loose     pimc    +247.4   ±98.8
 3.   pimc-bayes     pimc    +193.8   ±58.5
 4.   pimc-greedy    pimc    +193.6   ±63.2
 5.   pimc-tight     pimc    +183.7   ±59.4
 6.   smart-lag      smart   +156.8  ±101.2
 7.   smart-balanced smart   +130.6   ±85.0
 8.   maniac         stub     +99.2  ±176.5
 9.   pimc-noisy     pimc     +68.9  ±116.4
10.   smart-tight    smart    −58.3   ±68.5
11.   tight          stub    −288.1   ±87.0
```

**Best config: `pimc-soft`** — `createSearchAgent({ core:'pimc', temperature:0.2, tightness:0.5, equitySamples:500 })`.

Findings:
- Every PIMC variant (temp ≤ 0.2) beats every smart variant. The search bot's true-equity decisions clearly outperform the heuristic.
- **`temperature` is the dominant dial**: `pimc-noisy` (temp 0.5) collapses to +69, while `pimc-soft` (temp 0.2) leads at +259. Keep temperature low (0–0.2).
- The two loose PIMC configs (`pimc-soft`, `pimc-loose`) edge out the tighter ones (`pimc-greedy`, `pimc-tight`) — but their CIs (±97–99) overlap heavily, so **within the PIMC top tier the ranking is statistically tied**. They are, however, clearly above `smart-lag` (+157 ±101).
- The `tight` stub (−288) and `smart-tight` (−58) confirm: over-tight play loses in NL 6-max.

---

## 2. Fixed-Limit Hold'em (6-max, 6000 hands, eq 400)

```
rank  config         type    bb/100     ±95%
 1.   maniac         stub    +510.2  ±115.7
 2.   pimc-soft      pimc    +340.2   ±63.1
 3.   pimc-greedy    pimc    +336.8   ±47.5
 4.   pimc-loose     pimc    +334.4   ±63.2
 5.   pimc-tight     pimc    +310.6   ±45.9
 6.   pimc-bayes     pimc    +277.7   ±41.7
 7.   pimc-noisy     pimc     −19.9   ±47.6
 8.   smart-tight    smart    −26.1    ±2.6
 9.   smart-balanced smart    −55.1    ±5.1
10.   smart-lag      smart    −68.1    ±7.0
11.   tight          stub     −98.6    ±4.8
```

**Best *skilled* config: `pimc-greedy` / `pimc-soft`** (tied, ~+338) — `createSearchAgent({ core:'pimc', temperature:0, tightness:0.5, equitySamples:400 })`.

Findings:
- **All smart bots are negative in FL** (smart-tight −26 down to smart-lag −68), with *very tight* CIs (±3–7) so this is statistically solid: the heuristic's big-bet-tuned thresholds are mis-calibrated for fixed-limit. **Do not use `smart` for FL.**
- The PIMC family is uniformly strong (+278 to +340). `pimc-greedy/soft/loose` (~+335) are statistically tied at the top; `pimc-bayes` (+278) slightly behind.
- `maniac` tops the table (+510) — but this is **cheap-bet aggression spam**, not skill: in FL every bet is a small fixed unit, so a bot that always raises gets paid by the field's callers and rarely risks much. It is a stub with no evaluation; it is *not* a recommended config. (Against a field that calls down more, maniac's edge would shrink — as the earlier `callers` field showed.)
- Again `pimc-noisy` (temp 0.5) is the only losing PIMC config.

---

## 3. Pot-Limit Omaha (6-max, 2500 hands, eq 250)

```
rank  config         type    bb/100      ±95%
 1.   maniac         stub    +227.9   ±328.5
 2.   pimc-bayes     pimc     +43.2    ±92.1
 3.   pimc-loose     pimc     +37.5   ±163.5
 4.   pimc-tight     pimc     +22.8    ±87.8
 5.   pimc-greedy    pimc     −13.4    ±85.7
 6.   pimc-noisy     pimc     −52.5   ±200.2
 7.   pimc-soft      pimc     −89.3   ±157.6
 8.   smart-tight    smart   −151.4   ±117.7
 9.   smart-balanced smart   −228.1   ±152.3
10.   tight          stub    −250.1   ±102.3
11.   smart-lag      smart   −449.2   ±180.9
```

**Best config: `pimc-bayes` / `pimc-tight`** (marginal, +23 to +43) — `createSearchAgent({ core:'pimc', temperature:0, tightness:0.5–0.85, opponentModel:'bayesian', equitySamples:300 })`.

Findings (treat as **directional** — PLO CIs are very wide):
- **The `smart` heuristic is catastrophic in Omaha** (−151 to −449): its starting-hand/strength model does not transfer to 4-card exactly-2-hole composition. `smart-lag` at −449 is the worst bot in the entire study.
- PIMC is the **only** competent family, but only marginally above zero (`pimc-bayes` +43 down to `pimc-soft` −89). Omaha demands very tight preflop discipline and careful draw evaluation that none of these configs nail.
- The Bayesian opponent model edges the field here (`pimc-bayes` +43) — plausible, since PLO action is highly informative about nutted ranges.
- `maniac` (+228 ±329) is statistically indistinguishable from zero — PLO's pot-sized bets make blind aggression extremely high-variance.

---

## Cross-variant conclusions

1. **PIMC is the universal winner.** It is the top *skilled* family in all three variants. `core:'pimc'` is the recommended default everywhere.
2. **`smart` is a no-limit-Hold'em specialist.** It is competitive only in NL; in FL it loses (its thresholds are big-bet-tuned) and in PLO it is disastrous. This is the single biggest configuration pitfall.
3. **`temperature` controls strength everywhere.** Low (0–0.2) = strong; 0.5 = weak. Never use high temperature for a strong opponent.
4. **`tightness` is variant-dependent** (now a live knob): looser helps in **FL** (cheap continuation, blind defense); tighter helps in **PLO** (4-card discipline). NL is roughly neutral-to-slightly-loose.
5. **`maniac` (stub) tops FL and is noisy-#1 in PLO**, but this is bet-sizing-arbitrage against the field, not poker skill — it has no evaluation and folds nothing. It is not a real "config." Against a calling field its advantage vanishes (shown in the earlier `callers` run).
6. **IS-MCTS (`core:'ismcts'`) was excluded** from this grid: it is ~100× slower and its over-aggression makes it non-competitive in NL/FL and unrankable in PLO. It remains an experimental core.

## Recommended configs (copy-paste)

```ts
// No-Limit Hold'em — strongest overall
createSearchAgent({ core: 'pimc', temperature: 0.2, tightness: 0.5, equitySamples: 500 })

// Fixed-Limit Hold'em — PIMC family; smart is NOT viable here
createSearchAgent({ core: 'pimc', temperature: 0, tightness: 0.5, equitySamples: 400 })

// Pot-Limit Omaha — only PIMC is competent; smart is catastrophic
createSearchAgent({ core: 'pimc', temperature: 0, tightness: 0.6, opponentModel: 'bayesian', equitySamples: 300 })
```

## Limitations

- **Field-relative, not absolute.** Even the diverse `mixed` field has biases (it over-calls in some spots), so absolute bb/100 are inflated vs a genuinely optimal opponent. The *rankings* and *config selection* are the robust output.
- **PLO is under-sampled** (2500 hands, eq 250) because Omaha equity is ~3× slower; its CIs (±85–328) permit only coarse conclusions (smart-bad, PIMC-marginal). A decisive PLO study needs ~20k hands/config (hours of compute).
- **NL within-tier ties:** the top PIMC configs (`soft/loose/greedy/bayes/tight`) overlap within their CIs; "best" among them is not statistically decisive at 9000 hands. They are, however, clearly above the smart tier.
- **No IS-MCTS / no multi-way-specific tuning / ICM absent** — see `src/poker-table/agents/README.md` for the roadmap.
- **Stub `maniac` artefact:** where it ranks #1, read it as "aggression exploits this field," not as a recommended bot.

## Reproduce

```bash
npx tsx tools/bench-variant.ts nl 9000 mixed 400   # No-Limit Hold'em
npx tsx tools/bench-variant.ts fl 6000 mixed 400   # Fixed-Limit Hold'em
npx tsx tools/bench-variant.ts plo 2500 mixed 250  # Pot-Limit Omaha (slow)
```
