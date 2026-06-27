# poker-sym

Monte Carlo simulation tool for evaluating poker starting hand strength. Part of the [gamblingjs](https://github.com/MikBin/gamblingjs) project.

## Overview

`poker-sym` uses Monte Carlo simulation to rank starting hands by their preflop equity. Supports **6 game variants**:

| Variant | Starting Hands | Description |
|---------|---------------|-------------|
| Texas Hold'em | 169 | 2-card starting hands |
| Omaha Hi | 9,854 | 4-card starting hands |
| Omaha Hi/Lo | 9,854 | 4-card hands, split pot (high/low 8) |
| 7-Card Stud | 1,755 | 3-card starting hands (suit-aware) |
| Stud Hi/Lo | 1,755 | 3-card hands, split pot (high/low 8) |
| Razz | 1,755 | 3-card hands, lowball (A-5) |

Each simulation:
1. Enumerates all canonical starting hands
2. For each hand, runs N random board completions
3. Evaluates the resulting best hand using the gamblingjs evaluator
4. Calculates win/tie percentages against opponents
5. Ranks all hands and assigns tier classifications

## Dashboard

The `dashboard/` directory contains an interactive web UI built with Vite + TypeScript. It provides a real-time Monte Carlo simulation dashboard with progress tracking, tier-colored results, and **sortable numeric columns**.

### Features
- Click any numeric column header (`#`, `Win%`, `Tie%`, `Avg Rank`, etc.) to sort ascending/descending
- Sort indicators (↕ ▲ ▼) show current sort state
- Rank column auto-resequences after sorting
- Progress bar with hand-by-hand updates
- Responsive dark-themed UI

### Running the Dashboard

```bash
cd poker-sym/dashboard

# Development
npm install
npx vite

# Production build
npx vite build
# Output in dist/ — serve with any static file server
```

### Pages

**Preflop ranking:**
- `holdem.html` — Texas Hold'em
- `omaha.html` — Omaha Hi (uses Web Workers)
- `omaha-hi-lo.html` — Omaha Hi/Lo (uses Web Workers)
- `stud.html` — 7-Card Stud
- `stud-hi-lo.html` — Stud Hi/Lo
- `razz.html` — Razz

**Street-by-street analysis:**
- `street.html` — Texas Hold'em (flop/turn/river)
- `street-omaha.html` — Omaha Hi
- `street-omaha-hi-lo.html` — Omaha Hi/Lo
- `street-stud.html` — 7-Card Stud (3rd–7th street)
- `street-stud-hi-lo.html` — Stud Hi/Lo (5th–7th street)
- `street-razz.html` — Razz (3rd–7th street)

## CLI

```bash
# From the poker-sym directory (Texas Hold'em by default)
npx tsx src/cli.ts --runs 10000 --opponents 1 --format table

# Omaha Hi simulation
npx tsx src/cli.ts --game omaha --runs 1000 --opponents 1 --format table

# Raw hand strength (no opponents)
npx tsx src/cli.ts --runs 50000 --format md

# Save as JSON
npx tsx src/cli.ts --runs 50000 --opponents 9 --format json --output ranking.json

# Reproducible results with seed
npx tsx src/cli.ts --runs 10000 --seed 42 --format csv

# Street-by-street analysis (all 6 variants)
npx tsx src/cli.ts --street --runs 1000 --format table
npx tsx src/cli.ts --game omaha --street --runs 500 --format table
npx tsx src/cli.ts --game omaha-hi-lo --street --runs 500 --opponents 1 --format table
npx tsx src/cli.ts --game stud --street --runs 1000 --format table
npx tsx src/cli.ts --game stud-hi-lo --street --runs 500 --opponents 1 --format table
npx tsx src/cli.ts --game razz --street --runs 1000 --format table

# Detailed Hold'em street breakdown (top 20 hands)
npx tsx src/cli.ts --street --detailed --runs 1000 --format table
```

## CLI Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--game` | `-g` | holdem | Game variant: `holdem`, `omaha`, `omaha-hi-lo`, `stud`, `stud-hi-lo`, `razz` |
| `--runs` | `-n` | 10000 | Simulation runs per hand |
| `--opponents` | `-o` | 0 | Number of opponents (0 = raw strength) |
| `--seed` | `-s` | random | Random seed for reproducibility |
| `--format` | `-f` | table | Output format: `table`, `json`, `csv`, `md` |
| `--output` | `-O` | stdout | Write output to file |
| `--street` | | off | Run street-by-street analysis instead of preflop ranking |
| `--detailed` | | off | Detailed per-hand breakdown (Hold'em street mode) |

## Output Formats

### Table (default)
Displays a formatted table with Rank, Hand, Tier, Win%, Tie%, and Avg Rank.

### JSON
Structured JSON with full metadata and results array.

### CSV
Comma-separated values for import into spreadsheets.

### Markdown
GitHub-flavored markdown table.

## Tier System

Hands are classified into tiers based on percentile ranking:

| Tier | Percentile | Description |
|------|-----------|-------------|
| Tier 1 | Top 5% | Premium hands |
| Tier 2 | 5–15% | Strong playable hands |
| Tier 3 | 15–30% | Speculative/medium hands |
| Tier 4 | 30–50% | Marginal hands |
| Tier 5 | 50–75% | Weak hands |
| Tier 6 | Bottom 25% | Trash hands |

## Architecture

```
poker-sym/
├── src/
│   ├── cli.ts                    # CLI entry point (commander)
│   ├── core/
│   │   ├── rng.ts                # Seeded PRNG (Mulberry32)
│   │   └── deck.ts               # Fisher-Yates shuffle, card drawing
│   ├── hands/
│   │   ├── canonical.ts          # Canonical hand grouping
│   │   ├── holdem.ts             # 169 Texas Hold'em starting hands
│   │   ├── omaha.ts              # 9,854 Omaha starting hands
│   │   └── stud.ts               # 1,755 Stud/Razz starting hands
│   ├── simulation/
│   │   ├── types.ts              # Shared interfaces
│   │   ├── montecarlo.ts         # Hold'em simulation engine
│   │   ├── street-analysis.ts    # Hold'em/Omaha street analysis
│   │   ├── stud-street-analysis.ts
│   │   ├── stud-hilo-street-analysis.ts
│   │   ├── razz-street-analysis.ts
│   │   ├── street-analysis-omaha-hilo.ts
│   │   ├── omaha-montecarlo.ts   # Omaha Hi simulation engine
│   │   ├── omaha-hilo-montecarlo.ts  # Omaha Hi/Lo simulation
│   │   ├── stud-montecarlo.ts    # 7-Card Stud simulation
│   │   ├── stud-hilo-montecarlo.ts   # Stud Hi/Lo simulation
│   │   └── razz-montecarlo.ts    # Razz simulation
│   ├── ranking/
│   │   ├── ranker.ts             # Preflop rankers
│   │   ├── street-ranker.ts      # Hold'em street ranker
│   │   ├── *-street-ranker.ts    # Street rankers per variant
│   │   └── tiers.ts              # Tier classification
│   ├── cli-street.ts             # Street analysis CLI runner
│   ├── output-street.ts          # Hold'em street formatters
│   └── output-street-variants.ts # Street formatters for all variants
├── dashboard/
│   ├── index.html                # Hold'em dashboard page
│   ├── omaha.html                # Omaha Hi dashboard page
│   ├── omaha-hi-lo.html          # Omaha Hi/Lo dashboard page
│   ├── stud.html                 # 7-Card Stud dashboard page
│   ├── stud-hi-lo.html           # Stud Hi/Lo dashboard page
│   ├── razz.html                 # Razz dashboard page
│   ├── street.html               # Street analysis page
│   └── src/
│       ├── sortable-table.ts     # Reusable table sorting utility
│       ├── main.ts               # Hold'em page logic
│       ├── omaha-main.ts         # Omaha Hi page logic
│       ├── omaha-hi-lo-main.ts   # Omaha Hi/Lo page logic
│       ├── stud-main.ts          # Stud page logic
│       ├── stud-hi-lo-main.ts    # Stud Hi/Lo page logic
│       ├── razz-main.ts          # Razz page logic
│       └── street-main.ts        # Street analysis logic
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Development

```bash
# Run tests
npm test

# Run with specific options
npx tsx src/cli.ts --runs 1000 --opponents 5 --format table

# Type check
npx tsc --noEmit

# Build dashboard for production
cd dashboard && npx vite build
```

## Dependencies

- **gamblingjs** (local parent) — Hand evaluation engine
- **commander** — CLI framework
- **cli-table3** — Table formatting

## License

MIT