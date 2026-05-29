import Table from 'cli-table3';
import { SimulationResult } from './simulation/types.js';
import { TieredHand, assignTiers, TIERS } from './ranking/tiers.js';

/**
 * Format simulation results as a console table.
 */
export const formatTable = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;

  const table = new Table({
    head: ['Rank', 'Hand', 'Tier', ...(hasOpponents ? ['Win%', 'Tie%'] : []), 'Avg Rank'],
    colWidths: [8, 8, 10, ...(hasOpponents ? [10, 10] : []), 12],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (const hand of tiered) {
    const row = [
      hand.rank,
      hand.key,
      hand.tierName,
      ...(hasOpponents
        ? [hand.winPct.toFixed(2) + '%', hand.tiePct.toFixed(2) + '%']
        : []),
      hand.averageRank.toFixed(1),
    ];
    table.push(row as string[]);
  }

  let output = `\nTexas Hold'em Starting Hand Ranking\n`;
  output += `Runs: ${result.config.runs} | Opponents: ${result.config.opponents} | Date: ${result.timestamp}\n`;
  output += table.toString();
  return output;
};

/**
 * Format simulation results as JSON.
 */
export const formatJSON = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  return JSON.stringify(
    {
      gameType: result.gameType,
      config: result.config,
      timestamp: result.timestamp,
      tiers: TIERS.map((t, i) => ({
        ...t,
        hands: tiered.filter((h) => h.tier === i),
      })),
      ranking: tiered,
    },
    null,
    2,
  );
};

/**
 * Format simulation results as CSV.
 */
export const formatCSV = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;

  const headers = ['rank', 'hand', 'tier', ...(hasOpponents ? ['winPct', 'tiePct'] : []), 'avgRank'];
  const rows = tiered.map((h) => [
    h.rank,
    h.key,
    h.tierName,
    ...(hasOpponents ? [h.winPct.toFixed(4), h.tiePct.toFixed(4)] : []),
    h.averageRank.toFixed(4),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

/**
 * Format simulation results as Markdown.
 */
export const formatMarkdown = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;

  let md = `# Texas Hold'em Starting Hand Ranking\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Opponents:** ${result.config.opponents}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;

  // Group by tier
  const tierGroups = TIERS.map((t, i) => ({
    ...t,
    hands: tiered.filter((h) => h.tier === i),
  }));

  for (const group of tierGroups) {
    if (group.hands.length === 0) continue;
    md += `## ${group.name} — ${group.description}\n\n`;

    if (hasOpponents) {
      md += '| Rank | Hand | Win% | Tie% | Avg Rank |\n';
      md += '|------|------|------|------|----------|\n';
      for (const h of group.hands) {
        md += `| ${h.rank} | ${h.key} | ${h.winPct.toFixed(2)}% | ${h.tiePct.toFixed(2)}% | ${h.averageRank.toFixed(1)} |\n`;
      }
    } else {
      md += '| Rank | Hand | Avg Rank |\n';
      md += '|------|------|----------|\n';
      for (const h of group.hands) {
        md += `| ${h.rank} | ${h.key} | ${h.averageRank.toFixed(1)} |\n`;
      }
    }
    md += '\n';
  }

  return md;
};