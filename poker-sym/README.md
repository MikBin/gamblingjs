# poker-sym

Monte Carlo simulation tool for evaluating poker starting hand strength. Part of the [gamblingjs](https://github.com/MikBin/gamblingjs) project.

## Overview

`poker-sym` uses Monte Carlo simulation to rank starting hands by their preflop equity. Currently supports **Texas Hold'em** with more variants planned.

Each simulation:
1. Enumerates all **169 canonical starting hands** (13 pairs + 78 suited + 78 offsuit)
2. For each hand, runs N random board completions
3. Evaluates the resulting 7-card hand using the gamblingjs evaluator
4. Calculates win/tie percentages against opponents
5. Ranks all hands and assigns tier classifications

## Quick Start

```bash
# From the poker-sym directory
npx tsx src/cli.ts --runs 10000 --opponents 1 --format table

# Raw hand strength (no opponents)
npx tsx src/cli.ts --runs 50000 --format md

# Save as JSON
npx tsx src/cli.ts --runs 50000 --opponents 9 --format json --output ranking.json

# Reproducible results with seed
npx tsx src/cli.ts --runs 10000 --seed 42 --format csv
```

## CLI Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--runs` | `-n` | 10000 | Simulation runs per hand |
| `--opponents` | `-o` | 0 | Number of opponents (0 = raw strength) |
| `--seed` | `-s` | random | Random seed for reproducibility |
| `--format` | `-f` | table | Output format: `table`, `json`, `csv`, `md` |
| `--output` | `-O` | stdout | Write output to file |

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
| Tier 1 | Top 5% | Premium hands (AA, KK, QQ, ...) |
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
│   │   └── holdem.ts             # 169 Texas Hold'em starting hands
│   ├── simulation/
│   │   ├── types.ts              # Shared interfaces
│   │   └── montecarlo.ts         # Simulation engine
│   ├── ranking/
│   │   ├── ranker.ts             # Orchestrator
│   │   └── tiers.ts              # Tier classification
│   └── output.ts                 # Formatters (table/json/csv/md)
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
```

## Dependencies

- **gamblingjs** (local parent) — Hand evaluation engine
- **commander** — CLI framework
- **cli-table3** — Table formatting

## License

MIT