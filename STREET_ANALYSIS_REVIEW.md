# Street-by-Street Analysis Review Report

## Summary
The Street-by-Street Analysis feature provides a comprehensive and interactive Monte Carlo simulation engine across all 6 supported poker variants. The core evaluation logic, integration with Vue/HTML dashboards, and overarching architecture for handling combinatorics are robust.

However, during this comprehensive review, several notable issues were identified, mostly concerning how partial hands on early streets (3rd and 4th street) are evaluated in 7-Card Stud and Razz. Specifically, padding logic and early street categorization can artificially inflate ranks or completely fail to categorize hands correctly.

### Severity Breakdown
- **Critical:** 0
- **Major:** 2 (Razz and Stud early street padding/categorization logic)
- **Minor:** 1 (Redundant/unused sortable-table.ts methods)
- **Suggestions:** 3 (UI refinements, caching mechanisms)

---

## 1. Texas Hold'em Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-main.ts`
- `poker-sym/dashboard/street.html`
- `poker-sym/src/simulation/street-analysis.ts`
- `poker-sym/src/hands/holdem.ts`

### Data Integrity
- Enumeration successfully generates the canonical 169 starting hands (13 pocket pairs, 78 suited, 78 offsuit).
- Statistical aggregations correctly handle distributions (average rank, standard deviation, P50, categories).
- Expected ranges for 5-card Hold'em hands span properly (0–7462).

### Calculations
- Correctly uses the `HighEvaluator`.
- Evaluates 5 cards on the flop accurately.
- Properly delegates to `bestOfSix()` for the turn, exhaustively testing all 6 combinations of the 6 available cards.
- Accurately passes 7 cards to `eval7()` for the river.

### UI & Visualization
- The summary table headers appropriately toggle sort order (asc/desc) and re-render the table efficiently.
- Expanding a hand displays intricate details: standard deviation, category distributions, and realization metrics (Improvement, Nuts, Hit%).

### Issues Found
- **None found.** The Hold'em implementation is solid and mathematically sound.

---

## 2. Omaha Hi Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-omaha-main.ts`
- `poker-sym/dashboard/street-omaha.html`
- `poker-sym/src/simulation/street-analysis.ts`
- `poker-sym/src/hands/omaha.ts`

### Data Integrity
- Evaluates the proper set of 4-card starting hands based on canonical groupings.

### Calculations
- Strict Omaha hand selection constraints are rigorously applied. The `bestOmahaOfN()` function (lines 387-408 in `street-analysis.ts`) impeccably iterates through C(4,2) = 6 combinations of hole cards against C(3,3)=1, C(4,3)=4, and C(5,3)=10 combinations of community cards.
- The use of exactly 2 hole cards and 3 board cards is computationally verified.

### UI & Visualization
- Progress bar updates correctly in batches to prevent UI blocking, essential for Omaha's heavy combinatorics.

### Issues Found
- **Minor / Suggestion:** `bestOmahaOfN()` iterates using nested `for` loops. While functional, memoizing early combinations (especially since hole card C(4,2) pairs never change during a hand's simulation) could provide a modest speed-up.

---

## 3. Omaha Hi/Lo Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-omaha-hi-lo-main.ts`
- `poker-sym/dashboard/street-omaha-hi-lo.html`
- `poker-sym/src/simulation/street-analysis-omaha-hilo.ts`

### Data Integrity
- Ensures low hands actually qualify before contributing to low win percentages.
- Handles the duality of Hi/Lo splits and tracks Scoops effectively.

### Calculations
- Evaluates both High and Low components independently.
- Equity calculation accurately handles Scoops: if a player wins the high and no low qualifies (or they also win the low), they get 100% of the pot rather than 50%.
- Simulation correctly generates opponent hands from the remaining deck to compute win shares.

### UI & Visualization
- High, Low, and Scoop Win % are beautifully rendered and color-coded.

### Issues Found
- **None found.** The logic explicitly splitting equities and detecting scoops is mathematically rigorous.

---

## 4. 7-Card Stud Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-stud-main.ts`
- `poker-sym/dashboard/street-stud.html`
- `poker-sym/src/simulation/stud-street-analysis.ts`

### Data Integrity
- Handles the 24 canonical 3-card Stud starting hands.

### Calculations
- **Padding Flaw (3rd/4th Streets):** In `stud-street-analysis.ts`, `padToFive()` adds low cards `[0, 14, 28, 42, 1, 15, 29]` (2c, 3d, 4h, 5s, etc.) to 3- and 4-card hands to appease the 5-card evaluator.
  - The logic checks `!result.includes(padding[i])`, which successfully prevents adding the exact same *index* (e.g., won't add `2c` if `2c` is present).
  - **However**, it completely ignores *ranks*. If the hero holds `2h`, adding `2c` creates a pair of 2s, artificially inflating the hand to "One Pair". This corrupts the "Average Rank" and category distribution for early streets.

### UI & Visualization
- Flop/Turn/River semantics are successfully replaced by 3rd/4th/5th/6th/7th street terminology.

### Issues Found
1. **Major:** `padToFive` (lines 39-49 in `stud-street-analysis.ts`) inflates ranks by accidentally pairing cards. Padding should check for completely distinct *ranks* to prevent accidental pairing or straight/flush draw formations.

---

## 5. Stud Hi/Lo Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-stud-hi-lo-main.ts`
- `poker-sym/dashboard/street-stud-hi-lo.html`

### Data Integrity
- Similar to Omaha Hi/Lo, accurately tracks High, Low, Scoop, and total equity.

### Calculations
- Avoids the padding issue seen in Stud Hi by using `evaluateStreet()` which leverages `handOfFiveEvalHiLow8Indexed`, `handOfSixEvalHiLow8Indexed`, and `handOfSevenEvalHiLow8Indexed`.
- **Note:** Wait, 3rd and 4th streets aren't analyzed here! The dashboard strictly starts at 5th street (s5, s6, s7). By starting at 5 cards, it bypasses the 3- and 4-card evaluation issues entirely.

### UI & Visualization
- Grid properly displays 5th, 6th, and 7th street equities side-by-side.
- The `resultsHTML` generation sorts based on 7th street equity seamlessly.

### Issues Found
- **Suggestion:** While avoiding 3rd and 4th street prevents the padding issue, users expect 3rd/4th street stats for Stud games. Once the evaluator padding is fixed for standard Stud, consider extending Stud Hi/Lo to cover all 5 betting streets.

---

## 6. Razz Street Analysis

### Files Reviewed
- `poker-sym/dashboard/src/street-razz-main.ts`
- `poker-sym/dashboard/street-razz.html`
- `poker-sym/src/simulation/razz-street-analysis.ts`

### Data Integrity
- Correctly iterates through Razz's A-5 lowball hands.
- Categories range correctly from K-low (worst) to Wheel (best).

### Calculations
- **Category Flaw (3rd/4th Streets):** `razzLowCategory()` (line 45 in `razz-street-analysis.ts`) explicitly returns `0` (which maps to "K-low", the worst category) if the hand has fewer than 5 cards.
  - As a result, ALL hands on 3rd and 4th street are categorized as K-low. The category statistics for these streets are essentially broken.
- **Padding Flaw:** Similar to Stud Hi, `padToFive()` injects `2, 3, 4, 5` into 3rd and 4th street hands.
  - In Razz, injecting premium low cards artificially *improves* the hand astronomically. A `K-Q-J` padded with `2-3` becomes `K-Q-J-3-2`, which the evaluator sees as a J-low. This severely skews the "Average Rank" metrics for early streets.

### UI & Visualization
- Reuses the dashboard layout successfully. Displays the bespoke 9 Razz categories accurately (when data is populated on later streets).

### Issues Found
1. **Major:** `razzLowCategory` returning `0` for hands under 5 cards breaks 3rd/4th street categorizations.
2. **Major:** `padToFive` artificially improves early street Razz hands by padding them with premium low cards. Padding should use Kings and Queens instead (e.g., K, Q, J) to ensure they do not artificially improve the low value of the hand.

---

## Cross-Game Consistency

1. **Custom Sorting vs `sortable-table.ts`:**
   - The dashboards dynamically generate HTML strings for tables and implement custom `th.addEventListener('click')` logic to sort their internal arrays and re-render.
   - They do *not* use the `makeSortable` utility provided in `poker-sym/dashboard/src/sortable-table.ts`. While not a bug, it represents dead code/inconsistent architecture across the dashboard layer.

2. **UI Thread Blocking & Chunking:**
   - All engines successfully chunk the execution loop using `setTimeout(processChunk, 0)`, preventing browser UI freezes during intensive Monte Carlo iterations.

## Recommendations

1. **Fix Stud Padding Logic:**
   - Update `padToFive` in `stud-street-analysis.ts`. Inspect the `holeCards` to collect all present ranks. Select padding cards from unused ranks and disparate suits so they can mathematically never pair, straight, or flush.
2. **Fix Razz Padding Logic:**
   - Implement a distinct `razzPadToFive` function in `razz-street-analysis.ts`. Instead of padding with `[2,3,4,5]`, pad with the worst possible Razz cards (e.g., Kings and Queens) ensuring they don't pair. This prevents early street average ranks from artificially inflating.
3. **Fix Razz Early Categorization:**
   - Update `razzLowCategory` to extrapolate a category for 3-card and 4-card hands. For instance, a 3-card hand `7-5-A` implies at best a 7-low draw. It should be categorized based on its highest card, just like 5-card hands, rather than returning a flat `0`.
4. **Remove Unused Utilities:**
   - If `makeSortable` in `sortable-table.ts` is unused across all 6 dashboards, remove it to reduce bundle size and technical debt.