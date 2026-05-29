import Table from 'cli-table3';
import { SimulationResult } from './simulation/types.js';
import { TieredHand, assignTiers, TIERS } from './ranking/tiers.js';

const toPct = (val?: number) => (val != null ? val.toFixed(2) + '%' : '');
const toFmt = (val?: number) => (val != null ? val.toFixed(4) : '');

/**
 * Format simulation results as a console table.
 */
export const formatTable = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;
  const isHiLo = result.gameType.includes('hi-lo');

  const head = ['Rank', 'Hand', 'Tier'];
  const colWidths = [8, 8, 10];

  if (hasOpponents) {
    if (isHiLo) {
      head.push('Equity%', 'Scoop%', 'High%', 'Low%');
      colWidths.push(10, 10, 10, 10);
    } else {
      head.push('Win%', 'Tie%');
      colWidths.push(10, 10);
    }
  }
  head.push('Avg Rank');
  colWidths.push(12);

  const table = new Table({
    head,
    colWidths,
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (const hand of tiered) {
    const row = [hand.rank, hand.key, hand.tierName];
    if (hasOpponents) {
      if (isHiLo) {
        row.push(toPct(hand.equity), toPct(hand.scoopPct), toPct(hand.highWinPct), toPct(hand.lowWinPct));
      } else {
        row.push(toPct(hand.winPct), toPct(hand.tiePct));
      }
    }
    row.push(hand.averageRank.toFixed(1));
    table.push(row as string[]);
  }

  const gameTitle = result.gameType === 'stud-hi-lo' ? 'Stud Hi/Lo' : result.gameType === 'omaha' ? 'Omaha Hi' : 'Texas Hold\'em';
  let output = `\n${gameTitle} Starting Hand Ranking\n`;
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
  const isHiLo = result.gameType.includes('hi-lo');

  const headers = ['rank', 'hand', 'tier'];
  if (hasOpponents) {
    if (isHiLo) {
      headers.push('equity', 'scoopPct', 'highWinPct', 'lowWinPct');
    } else {
      headers.push('winPct', 'tiePct');
    }
  }
  headers.push('avgRank');

  const rows = tiered.map((h) => {
    const row = [h.rank, h.key, h.tierName];
    if (hasOpponents) {
      if (isHiLo) {
        row.push(toFmt(h.equity), toFmt(h.scoopPct), toFmt(h.highWinPct), toFmt(h.lowWinPct));
      } else {
        row.push(toFmt(h.winPct), toFmt(h.tiePct));
      }
    }
    row.push(h.averageRank.toFixed(4));
    return row;
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

/**
 * Format simulation results as Markdown.
 */
export const formatMarkdown = (result: SimulationResult): string => {
  const tiered = assignTiers(result.hands);
  const hasOpponents = result.config.opponents > 0;
  const isHiLo = result.gameType.includes('hi-lo');

  const gameTitle = result.gameType === 'stud-hi-lo' ? 'Stud Hi/Lo' : result.gameType === 'omaha' ? 'Omaha Hi' : 'Texas Hold\'em';
  let md = `# ${gameTitle} Starting Hand Ranking\n\n`;
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
        md += '| Rank | Hand | Equity% | Scoop% | High% | Low% | Avg Rank |\n';
        md += '|------|------|---------|--------|-------|------|----------|\n';
        for (const h of group.hands) {
          md += `| ${h.rank} | ${h.key} | ${toPct(h.equity)} | ${toPct(h.scoopPct)} | ${toPct(h.highWinPct)} | ${toPct(h.lowWinPct)} | ${h.averageRank.toFixed(1)} |\n`;
        }
      } else {
        md += '| Rank | Hand | Win% | Tie% | Avg Rank |\n';
        md += '|------|------|------|------|----------|\n';
        for (const h of group.hands) {
          md += `| ${h.rank} | ${h.key} | ${toPct(h.winPct)} | ${toPct(h.tiePct)} | ${h.averageRank.toFixed(1)} |\n`;
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
