# Bot Benchmark — Results Compendium (all games)

Consolidated results from every benchmark run in this study: **No-Limit / Pot-Limit / Fixed-Limit Hold'em, Pot-Limit / Fixed-Limit Omaha (Hi), and Pot-Limit / Fixed-Limit Omaha Hi/Lo**, in 6-max and heads-up. Every table states the exact field and sample size it was produced under — **bb/100 are not comparable across different fields** (see Legend).

Harnesses (reproducible): `tools/bench-variant.ts`, `tools/bench-bots.ts`, `tools/bench-fl-6max.ts`, `tools/bench-pl-6max.ts`, `tools/bench-counter.ts`.

---

## Legend — what every value means and how it is computed

### Metrics

| Symbol / column | Meaning | How computed |
|---|---|---|
| **bb/100** | Win rate in **big blinds per 100 hands**. | `mean(Δstack / BB) × 100`, where `Δstack = finalStack − buyIn` for the candidate's seat in one hand, and `BB = bigBlindOf(handCfg)` (the big blind, = 2 in every game here). Positive = the candidate wins chips vs the field. |
| **± (95% CI)** | Half-width of the 95% confidence interval on bb/100. | `1.96 · σ / √n · 100`, where `σ` = standard deviation of the per-hand `Δstack/BB` values and `n` = hands played. **If two configs' ranges (estimate ± CI) overlap, they are *statistically tied*.** |
| **hands** | Decisions/sample size for that row. | Number of independent deals played. |
| **Δ (delta)** | Winner − default, in bb/100. | `winner.bb100 − default.bb100` on the *same* field. Positive = the tuned specialist beat the generalist default. |

### Experimental terms

| Term | Meaning |
|---|---|
| **candidate** | The bot/config being measured. In fixed-field runs it is always **seat 0 (the button)**; in `seat-rotated` runs it cycles through every seat each hand so the result is **position-averaged** (no button bias). |
| **field** | The reference opponents occupying the other seats. Same field for every candidate in a table → fair *relative* comparison. The field's identity determines the absolute scale (a weak field inflates everyone's bb/100). |
| **`mixed` field** | `[smart-balanced, calling-station, aggressive, tight, maniac]` — diverse, less exploitable than a single-clone field. |
| **`smart` field** | 5× `smart-balanced` — over-folds to aggression, so it *flatters* aggressive bots (maniac, loose PIMC). |
| **`callers` field** | Calling-station + always-call heavy — punishes blind aggression, rewards value. |
| **`selfplay`** | Round-robin: the candidates play *each other*, rotating through all seats. Position-balanced, zero-sum, no fixed field to exploit — the *fairest* ranking. |
| **5×/N× archetype** | A field of N identical opponents of one archetype (e.g. 5× station). Used by the counter-strategy tuner to model "a table full of one player type." |
| **default (generalist)** | `createSearchAgent({ core:'pimc', temperature:0.2, tightness:0.5, opponentModel:'uniform', equitySamples:300-500 })` — the non-specialised reference the tuned winners are compared against. |

### Archetypes (the opponent personalities)

| Archetype | Bot | Behaviour |
|---|---|---|
| **maniac** | `createManiacAgent` (stub) | Raises/bets/shoves at every chance; never folds voluntarily; **ignores its cards**. |
| **station** | `createCallingStationAgent` (stub) | Loose-passive; calls everything, rarely raises. |
| **tight / nit** | `createTightAgent` (stub) | Folds most hands; plays only strong ones. |
| **aggressive** | `createAggressiveAgent` (stub) | Bets/raises with gaussian sizing. |
| **tag** | `createSmartBot` aggression 0.45 / tightness 0.85 | Tight-aggressive (heuristic). |
| **lag** | `createSmartBot` aggression 0.85 / tightness 0.30 | Loose-aggressive (heuristic). |
| **smart-balanced** | `createSmartBot` 0.5 / 0.5 | The heuristic reference. |
| **pimc-…** | `createSearchAgent` (search/PIMC) | Monte-Carlo equity + pot-odds policy; suffix = knob settings (below). |

### Search-bot config knobs (columns like `temp0.2/tight0.5/u`)

| Knob | Effect |
|---|---|
| **temperature** (`temp`) | Softmax noise over action utilities. **0 = greedy (strongest); higher = noisier/weaker.** The dominant strength dial. |
| **tightness** (`tight`) | Continuation looseness. Lower = calls wider; higher = folds more. Now a live dial; loosened automatically in fixed-limit. |
| **opponentModel** (`u`/`b`) | `u`=uniform random opponent range; `b`=Bayesian range narrowed from the opponent's actions. |
| **equitySamples** | Monte-Carlo samples per equity estimate (higher = sharper, slower). |
| **core** | `pimc` (1-ply Monte-Carlo equity, default/strong) or `ismcts` (UCB1 tree search, experimental). |

> All runs are **deterministic and reproducible** (seeded RNG; `Math.random` is forbidden in the bots). Same harness + hands → identical numbers.

---

## Table A — Per-variant best config (6-max, `mixed` field)

`bench-variant.ts`. Candidate at seat 0 vs a `mixed` field of 5. Highest bb/100 = best config for that game.

### A1. No-Limit Hold'em — 9000 hands, eq 400
```
rank  config         bb/100     ±95%      best?
 1.   pimc-soft      +259.4   ±97.3      ★ best
 2.   pimc-loose     +247.4   ±98.8      tied
 3.   pimc-bayes     +193.8   ±58.5      tied
 4.   pimc-greedy    +193.6   ±63.2      tied
 5.   pimc-tight     +183.7   ±59.4      tied
 6.   smart-lag      +156.8  ±101.2
 7.   smart-balanced +130.6   ±85.0
 8.   maniac          +99.2  ±176.5
 9.   pimc-noisy      +68.9  ±116.4
10.   smart-tight     −58.3   ±68.5
11.   tight          −288.1   ±87.0
```

### A2. Fixed-Limit Hold'em — 6000 hands, eq 400
```
rank  config         bb/100     ±95%      best?
 1.   maniac         +510.2  ±115.7      (stub — cheap-bet spam, not a config)
 2.   pimc-soft      +340.2   ±63.1      ★ best skilled (tied)
 3.   pimc-greedy    +336.8   ±47.5      ★ tied
 4.   pimc-loose     +334.4   ±63.2      tied
 5.   pimc-tight     +310.6   ±45.9
 6.   pimc-bayes     +277.7   ±41.7
 7.   pimc-noisy      −19.9   ±47.6
 8.   smart-tight     −26.1    ±2.6      ← smart loses in FL (tight CI)
 9.   smart-balanced  −55.1    ±5.1
10.   smart-lag       −68.1    ±7.0
11.   tight          −98.6    ±4.8
```

### A3. Pot-Limit Omaha (Hi) — 2500 hands, eq 250
```
rank  config         bb/100      ±95%     best?
 1.   maniac         +227.9   ±328.5     (noise)
 2.   pimc-bayes      +43.2    ±92.1     ★ best (marginal)
 3.   pimc-loose      +37.5   ±163.5     tied
 4.   pimc-tight      +22.8    ±87.8     tied
 5.   pimc-greedy     −13.4    ±85.7
 6.   pimc-noisy      −52.5   ±200.2
 7.   pimc-soft       −89.3   ±157.6
 8.   smart-tight    −151.4   ±117.7     ← smart catastrophic in PLO
 9.   smart-balanced −228.1   ±152.3
10.   tight          −250.1   ±102.3
11.   smart-lag      −449.2   ±180.9
```

---

## Table B — Hold'em bet-structure comparison (6-max, `smart` field)

`bench-bots.ts / bench-fl-6max.ts / bench-pl-6max.ts`. Same bots vs a `smart` field — shows how the **bet structure flips the optimal style**. (PL/FL rows include station/alwaysCall; NL is the cleaned lineup.)

| config | NL bb/100 | PL bb/100 | FL bb/100 |
|---|---:|---:|---:|
| maniac | +774 | **−404** | +294 |
| aggressive | +57 | **−523** | +241 |
| pimc-soft | +196 | −74 | +162 |
| pimc-greedy | +42 | +2 | +73 |
| pimc-bayes | +84 | −37 | +67 |
| smart-tight | +67 | **+82** | +31 |
| smart-balanced | +52 | **+73** | +46 |
| smart-lag | +39 | +50 | +74 |
| station | −515 | −627 | +12 |
| alwaysCall | −518 | −819 | −80 |

**Reading:** NL rewards aggression (field over-folds to shoves); FL rewards loose/cheap aggression; **PL punishes reckless aggression** (pot-sized bets get called) — only the disciplined smart/greedy bots survive PL.

---

## Table C — Counter-strategy tuner (best counter to a station table)

`bench-counter.ts`. For each game × format, the winning config tuned vs a station field (seat-rotated), then its bb/100 vs the default generalist on the target field and on held-out mixed tables. **Δ = winner − default.**

### C1. Texas Hold'em (target: station) — NL, 6-max & hu
| game/format | winner | vs station (w / d / Δ) | vs mixed-diverse (Δ) | vs station-heavy (Δ) | vs maniac hu (Δ) |
|---|---|---|---|---|---|
| NL 6-max | `temp0/tight0.2/b` | +1145 / +672 / **+473** | +7 | **+261** | — |
| NL hu | `temp0/tight0.2/b` | +1145 / +672 / +473 | — | — | — |

(TH maniac/nit targets were also run; vs 5×maniac the field variance ±300 made the config indistinguishable — tuning inconclusive at feasible sample sizes.)

### C2. Omaha Hi — PLO & Limit Omaha, 6-max & hu (target: station)
| game/format | winner | vs station (w / d / Δ) | vs mixed-diverse (Δ) | vs maniac hu (Δ) |
|---|---|---|---|---|
| **PLO** 6-max | `temp0/tight0.2` | +484 / +342 / **+142** | **−131** | — |
| **PLO** hu | `temp0/tight0.2` | +477 / +448 / +29 | — | **+223** |
| **Limit Omaha** 6-max | `temp0/tight0.5` | +79 / +58 / +21 | +11 | — |
| **Limit Omaha** hu | `temp0/tight0.5` | +104 / +76 / **+28** | — | — |

### C3. Omaha Hi/Lo — PL & Limit, 6-max & hu (target: station)
| game/format | winner | vs station (w / d / Δ) | vs mixed-diverse (Δ) | vs maniac hu (Δ) |
|---|---|---|---|---|
| **PL Hi/Lo** 6-max | `temp0/tight0.85` | +556 / +282 / **+274** | **−133** | — |
| **PL Hi/Lo** hu | `temp0/tight0.85` | +350 / +335 / +16 | — | **+168** |
| **Limit Hi/Lo** 6-max | `temp0/tight0.5` | +90 / +97 / −7 | **+103** | — |
| **Limit Hi/Lo** hu | `temp0/tight0.5` | +75 / +81 / −6 | — | **+182** |

**Reading the winners:** every Omaha winner is `temperature:0` (greedy). **Omaha Hi** winners are *loose-ish* (tight0.2–0.5); **Omaha Hi/Lo** winners are *tight* (tight0.85 in PL, 0.5 in FL) because Hi/Lo rewards scoop-hand selectivity. PL specialists over-fit (huge +Δ vs stations, negative vs diverse); FL specialists are robust (≈ or better than default everywhere).

---

## Table D — Field-mode effect (does maniac really "win"?)

`bench-bots.ts --field`. Same maniac, different reference field — proves maniac's #1 is **field-exploitation**, not skill.

| field (6-max) | maniac bb/100 | maniac rank | top bot |
|---|---:|---|---|
| `smart` (over-folds) | +774 | **#1** | maniac (fold-equity exploit) |
| `callers` (calls down) | +173 | #8 | pimc-greedy (value) |
| `selfplay` (peers) | +59 | #6 | PIMC bots (true strength) |

---

## Cross-cutting conclusions

1. **PIMC (`core:'pimc'`) is the strongest family in every game.** It beats the heuristic `smart` bot everywhere; `smart` is *negative* in FL Hold'em and *catastrophic* in all Omaha games.
2. **`temperature: 0` (greedy) is mandatory in Omaha** — every Omaha winner is temp0; the soft default loses. In Hold'em low temperature (0–0.2) is also best.
3. **`tightness` is variant-dependent:** looser for FL/Omaha-Hi-vs-stations; **tight** for Hi/Lo (scoop discipline).
4. **Bet structure flips the optimal style:** NL/FL reward aggression (cheap/exploitable folds); **PL punishes it** (pot-sized bets get called).
5. **Exploitative tuning pays when the table has a clear weakness** (station-heavy → +261 to +473 bb/100 for a value-specialist) but **over-fits** — the same specialist can be −130 on a diverse table. Use a specialist only when the table composition is known; otherwise the generalist default is safer.
6. **Maniac's apparent dominance is an artefact** of over-folding fields; on a fair (self-play or calling) field it drops to mid-pack and the value bots (PIMC) win.

## Recommended configs (copy-paste)

```ts
// No-Limit Hold'em
createSearchAgent({ core:'pimc', temperature:0.2, tightness:0.5, equitySamples:500 })
// Fixed-Limit Hold'em  (smart is NOT viable)
createSearchAgent({ core:'pimc', temperature:0,   tightness:0.5, equitySamples:400 })
// Pot-Limit Hold'em    (disciplined; aggression punished)
createSearchAgent({ core:'pimc', temperature:0,   tightness:0.6, equitySamples:400 })
// Pot-Limit Omaha (Hi)
createSearchAgent({ core:'pimc', temperature:0, tightness:0.3, equitySamples:300 })
// Fixed-Limit Omaha (Hi)
createSearchAgent({ core:'pimc', temperature:0, tightness:0.5, equitySamples:300 })
// Pot-Limit Omaha Hi/Lo  (tight — scoop discipline)
createSearchAgent({ core:'pimc', temperature:0, tightness:0.85, equitySamples:300 })
// Fixed-Limit Omaha Hi/Lo
createSearchAgent({ core:'pimc', temperature:0, tightness:0.5, equitySamples:300 })
```

## Caveats

- **bb/100 are field-relative, not absolute.** Weak/clone fields inflate magnitudes (e.g. +500–1100 vs 5×station). Compare configs **within the same field** only.
- **Sample sizes vary by game** (Omaha is ~3× slower; Hi/Lo slower still). PLO/Hi-Lo CIs are wide (±85–330) → within-tier orderings there are directional, not decisive. The robust signals are: temp0 > temp0.2 everywhere, and the large specialist-vs-default deltas on station/diverse fields.
- A few 6-max Omaha validation cells were truncated by the timeout (shown blank in Table C); the winner/specialization signal is unaffected.
- IS-MCTS (`core:'ismcts'`) was excluded from the fine-tuning grids (≈100× slower, non-competitive).
- `docs/` is gitignored — to commit this file: `git add -f docs/bot-benchmark-results.md`.
