import Table from 'cli-table3';
import { SimulationResult } from './simulation/types.js';
import { TieredHand, assignTiers, TIERS } from './ranking/tiers.js';

/**
 * Format simulation results as a console table.
 */
export const formatTable = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;
  const isHiLo = result.gameType === 'omaha-hi-lo';

  const table = new Table({
    head: [
      'Rank', 'Hand', 'Tier',
      ...(hasOpponents ? (isHiLo ? ['WinHi%', 'WinLo%', 'Scoop%', 'Tie%'] : ['Win%', 'Tie%']) : []),
      'Avg Rank'
    ],
    colWidths: [
      8, 8, 10,
      ...(hasOpponents ? (isHiLo ? [10, 10, 10, 10] : [10, 10]) : []),
      12
    ],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (const hand of tiered) {
    const row = [
      hand.rank,
      hand.key,
      hand.tierName,
      ...(hasOpponents
        ? (isHiLo
          ? [
              (hand.winHiPct ?? 0).toFixed(2) + '%',
              (hand.winLoPct ?? 0).toFixed(2) + '%',
              (hand.scoopPct ?? 0).toFixed(2) + '%',
              hand.tiePct.toFixed(2) + '%',
            ]
          : [hand.winPct.toFixed(2) + '%', hand.tiePct.toFixed(2) + '%'])
        : []),
      hand.averageRank.toFixed(1),
    ];
    table.push(row as string[]);
  }

  const titleMap: Record<string, string> = {
    'holdem': "Texas Hold'em",
    'omaha-hi': "Omaha Hi",
    'omaha-hi-lo': "Omaha Hi/Lo",
  };
  const title = titleMap[result.gameType] || result.gameType;

  let output = `\n${title} Starting Hand Ranking\n`;
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
  const isHiLo = result.gameType === 'omaha-hi-lo';

  const headers = [
    'rank', 'hand', 'tier',
    ...(hasOpponents ? (isHiLo ? ['winPct', 'winHiPct', 'winLoPct', 'scoopPct', 'tiePct'] : ['winPct', 'tiePct']) : []),
    'avgRank'
  ];

  const rows = tiered.map((h) => [
    h.rank,
    h.key,
    h.tierName,
    ...(hasOpponents
      ? (isHiLo
        ? [
            h.winPct.toFixed(4),
            (h.winHiPct ?? 0).toFixed(4),
            (h.winLoPct ?? 0).toFixed(4),
            (h.scoopPct ?? 0).toFixed(4),
            h.tiePct.toFixed(4),
          ]
        : [h.winPct.toFixed(4), h.tiePct.toFixed(4)])
      : []),
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
  const isHiLo = result.gameType === 'omaha-hi-lo';

  const titleMap: Record<string, string> = {
    'holdem': "Texas Hold'em",
    'omaha-hi': "Omaha Hi",
    'omaha-hi-lo': "Omaha Hi/Lo",
  };
  const title = titleMap[result.gameType] || result.gameType;

  let md = `# ${title} Starting Hand Ranking\n\n`;
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
      if (isHiLo) {
        md += '| Rank | Hand | Equity (Win%) | WinHi% | WinLo% | Scoop% | Tie% | Avg Rank |\n';
        md += '|------|------|---------------|--------|--------|--------|------|----------|\n';
        for (const h of group.hands) {
          md += `| ${h.rank} | ${h.key} | ${h.winPct.toFixed(2)}% | ${(h.winHiPct ?? 0).toFixed(2)}% | ${(h.winLoPct ?? 0).toFixed(2)}% | ${(h.scoopPct ?? 0).toFixed(2)}% | ${h.tiePct.toFixed(2)}% | ${h.averageRank.toFixed(1)} |\n`;
        }
      } else {
        md += '| Rank | Hand | Win% | Tie% | Avg Rank |\n';
        md += '|------|------|------|------|----------|\n';
        for (const h of group.hands) {
          md += `| ${h.rank} | ${h.key} | ${h.winPct.toFixed(2)}% | ${h.tiePct.toFixed(2)}% | ${h.averageRank.toFixed(1)} |\n`;
        }
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