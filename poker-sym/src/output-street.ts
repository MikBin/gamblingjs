import Table from 'cli-table3';
import { StreetAnalysisResult, StreetHandResult, StreetStats, HandCategoryName } from './simulation/types.js';
import { HAND_CATEGORY_NAMES } from './simulation/types.js';

/**
 * Find the dominant (most frequent) category for a street.
 */
const dominantCategory = (stats: StreetStats): { name: string; pct: number } => {
  let best: HandCategoryName = 'high card';
  let bestPct = 0;
  for (const cat of HAND_CATEGORY_NAMES) {
    const pct = stats.categories[cat];
    if (pct > bestPct) {
      bestPct = pct;
      best = cat;
    }
  }
  return { name: best, pct: bestPct };
};

/**
 * Format a compact street summary (avgRank + top category + playability).
 */
const streetSummary = (stats: StreetStats): string => {
  const dom = dominantCategory(stats);
  return `${stats.averageRank.toFixed(0)} | ${dom.name} ${dom.pct.toFixed(0)}% | play ${stats.realization.playabilityScore.toFixed(0)}%`;
};

// ─── Table Format ────────────────────────────────────────────────────

export const formatStreetTable = (result: StreetAnalysisResult): string => {
  const table = new Table({
    head: ['Rank', 'Hand', 'FLOP (avg|top|play)', 'TURN (avg|top|play)', 'RIVER (avg|top|play)'],
    colWidths: [6, 7, 28, 28, 28],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    table.push([
      i + 1,
      h.hand,
      streetSummary(h.flop),
      streetSummary(h.turn),
      streetSummary(h.river),
    ]);
  }

  let output = `\nTexas Hold'em Street-by-Street Analysis\n`;
  output += `Runs: ${result.config.runs} | Date: ${result.timestamp}\n`;
  output += table.toString();
  return output;
};

// ─── Detailed Table (per hand) ───────────────────────────────────────

/**
 * Format detailed analysis for a single hand.
 */
export const formatHandDetail = (h: StreetHandResult): string => {
  let output = `\n━━━ ${h.hand} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  for (const street of ['flop', 'turn', 'river'] as const) {
    const stats = h[street];
    output += `\n  ${street.toUpperCase()}\n`;
    output += `  Average Rank: ${stats.averageRank.toFixed(1)}\n`;
    output += `  Std Dev: ${stats.distribution.stdDev.toFixed(1)} | Min: ${stats.distribution.min} | Max: ${stats.distribution.max}\n`;
    output += `  Percentiles: P25=${stats.distribution.percentiles.p25.toFixed(0)} P50=${stats.distribution.percentiles.p50.toFixed(0)} P75=${stats.distribution.percentiles.p75.toFixed(0)}\n`;

    output += `  Categories:\n`;
    for (const cat of HAND_CATEGORY_NAMES) {
      const pct = stats.categories[cat];
      if (pct > 0.01) {
        const bar = '█'.repeat(Math.round(pct / 2));
        output += `    ${cat.padEnd(17)} ${pct.toFixed(1).padStart(6)}% ${bar}\n`;
      }
    }

    output += `  Realization:\n`;
    output += `    Improvement: ${stats.realization.improvementRate.toFixed(1)}% | Nuts: ${stats.realization.nutPercentage.toFixed(1)}% | Playability: ${stats.realization.playabilityScore.toFixed(1)}%\n`;
    if (stats.realization.drawConversionRate > 0) {
      output += `    Draw Conversion: ${stats.realization.drawConversionRate.toFixed(1)}%\n`;
    }

    if (stats.textureEquity.length > 0) {
      output += `  Board Textures:\n`;
      for (const tex of stats.textureEquity) {
        output += `    ${tex.texture.padEnd(17)} (${tex.count} runs) avgRank=${tex.averageRank.toFixed(0)}\n`;
      }
    }
  }

  return output;
};

/**
 * Format detailed table showing all hands with full breakdowns.
 */
export const formatStreetTableDetailed = (result: StreetAnalysisResult): string => {
  let output = `\nTexas Hold'em Street-by-Street Analysis (Detailed)\n`;
  output += `Runs: ${result.config.runs} | Date: ${result.timestamp}\n`;

  // Show top 20 hands in detail
  output += `\n═══ TOP 20 HANDS ═════════════════════════════════════════\n`;
  for (let i = 0; i < Math.min(20, result.hands.length); i++) {
    output += formatHandDetail(result.hands[i]!);
  }

  return output;
};

// ─── JSON Format ─────────────────────────────────────────────────────

export const formatStreetJSON = (result: StreetAnalysisResult): string => {
  return JSON.stringify(result, null, 2);
};

// ─── CSV Format ──────────────────────────────────────────────────────

export const formatStreetCSV = (result: StreetAnalysisResult): string => {
  const headers = [
    'rank',
    'hand',
    'flop_avgRank',
    'flop_stdDev',
    'flop_p50',
    'flop_topCategory',
    'flop_improvementRate',
    'flop_nutPct',
    'flop_playability',
    'flop_drawConversion',
    'turn_avgRank',
    'turn_stdDev',
    'turn_p50',
    'turn_topCategory',
    'turn_improvementRate',
    'turn_nutPct',
    'turn_playability',
    'turn_drawConversion',
    'river_avgRank',
    'river_stdDev',
    'river_p50',
    'river_topCategory',
    'river_improvementRate',
    'river_nutPct',
    'river_playability',
  ];

  // Add category columns for each street
  for (const street of ['flop', 'turn', 'river']) {
    for (const cat of HAND_CATEGORY_NAMES) {
      headers.push(`${street}_${cat.replace(/ /g, '_')}`);
    }
  }

  const rows = result.hands.map((h, idx) => {
    const row: (string | number)[] = [
      idx + 1,
      h.hand,
      h.flop.averageRank.toFixed(2),
      h.flop.distribution.stdDev.toFixed(2),
      h.flop.distribution.percentiles.p50.toFixed(2),
      dominantCategory(h.flop).name,
      h.flop.realization.improvementRate.toFixed(2),
      h.flop.realization.nutPercentage.toFixed(2),
      h.flop.realization.playabilityScore.toFixed(2),
      h.flop.realization.drawConversionRate.toFixed(2),
      h.turn.averageRank.toFixed(2),
      h.turn.distribution.stdDev.toFixed(2),
      h.turn.distribution.percentiles.p50.toFixed(2),
      dominantCategory(h.turn).name,
      h.turn.realization.improvementRate.toFixed(2),
      h.turn.realization.nutPercentage.toFixed(2),
      h.turn.realization.playabilityScore.toFixed(2),
      h.turn.realization.drawConversionRate.toFixed(2),
      h.river.averageRank.toFixed(2),
      h.river.distribution.stdDev.toFixed(2),
      h.river.distribution.percentiles.p50.toFixed(2),
      dominantCategory(h.river).name,
      h.river.realization.improvementRate.toFixed(2),
      h.river.realization.nutPercentage.toFixed(2),
      h.river.realization.playabilityScore.toFixed(2),
    ];

    for (const street of [h.flop, h.turn, h.river]) {
      for (const cat of HAND_CATEGORY_NAMES) {
        row.push(street.categories[cat].toFixed(4));
      }
    }

    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

// ─── Markdown Format ─────────────────────────────────────────────────

export const formatStreetMarkdown = (result: StreetAnalysisResult): string => {
  let md = `# Texas Hold'em Street-by-Street Analysis\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;

  // Summary table
  md += `## Summary Ranking\n\n`;
  md += `| Rank | Hand | Flop Avg | Turn Avg | River Avg | Flop Play% | Turn Play% | River Play% |\n`;
  md += `|------|------|----------|----------|-----------|------------|------------|-------------|\n`;

  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    md += `| ${i + 1} | ${h.hand} | ${h.flop.averageRank.toFixed(0)} | ${h.turn.averageRank.toFixed(0)} | ${h.river.averageRank.toFixed(0)} | ${h.flop.realization.playabilityScore.toFixed(0)}% | ${h.turn.realization.playabilityScore.toFixed(0)}% | ${h.river.realization.playabilityScore.toFixed(0)}% |\n`;
  }

  md += '\n';

  // Top 20 detailed
  md += `## Top 20 Hands — Detailed Breakdown\n\n`;

  for (let i = 0; i < Math.min(20, result.hands.length); i++) {
    const h = result.hands[i]!;
    md += `### ${i + 1}. ${h.hand}\n\n`;

    for (const street of ['flop', 'turn', 'river'] as const) {
      const stats = h[street];
      const dom = dominantCategory(stats);
      md += `**${street.charAt(0).toUpperCase() + street.slice(1)}:** `;
      md += `Avg ${stats.averageRank.toFixed(0)} | σ ${stats.distribution.stdDev.toFixed(0)} | `;
      md += `Top: ${dom.name} ${dom.pct.toFixed(1)}% | `;
      md += `Improve ${stats.realization.improvementRate.toFixed(1)}% | `;
      md += `Nuts ${stats.realization.nutPercentage.toFixed(1)}% | `;
      md += `Play ${stats.realization.playabilityScore.toFixed(1)}%`;
      if (stats.realization.drawConversionRate > 0) {
        md += ` | Draw→ ${stats.realization.drawConversionRate.toFixed(1)}%`;
      }
      md += '\n\n';
    }

    md += '\n';
  }

  return md;
};