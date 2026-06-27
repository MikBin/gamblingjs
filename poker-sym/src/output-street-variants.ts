import Table from 'cli-table3';
import {
  StreetAnalysisResult,
  StreetStats,
  StreetAnalysisResultHiLo,
  StudHiLoStreetAnalysisResult,
  StudHiLoStreetStats,
} from './simulation/types.js';
import {
  formatStreetTable,
  formatStreetJSON,
  formatStreetCSV,
  formatStreetMarkdown,
  formatStreetTableDetailed,
} from './output-street.js';
import {
  StudStreetAnalysisResult,
  StudStreetHandResult,
} from './simulation/stud-street-analysis.js';
import {
  RazzStreetAnalysisResult,
  RazzStreetHandResult,
} from './simulation/razz-street-analysis.js';
import { HAND_CATEGORY_NAMES, HandCategoryName } from './simulation/types.js';

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

const streetSummary = (stats: StreetStats): string => {
  const dom = dominantCategory(stats);
  return `${stats.averageRank.toFixed(0)} | ${dom.name} ${dom.pct.toFixed(0)}% | play ${stats.realization.playabilityScore.toFixed(0)}%`;
};

const hiLoStreetSummary = (stats: {
  winHiPct: number;
  winLoPct: number;
  scoopPct: number;
}): string => {
  return `Hi ${stats.winHiPct.toFixed(1)}% | Lo ${stats.winLoPct.toFixed(1)}% | Sc ${stats.scoopPct.toFixed(1)}%`;
};

const studHiLoStreetSummary = (stats: StudHiLoStreetStats): string => {
  return `Eq ${stats.equity.toFixed(1)}% | Hi ${stats.highWinPct.toFixed(1)}% | Lo ${stats.lowWinPct.toFixed(1)}% | Sc ${stats.scoopPct.toFixed(1)}%`;
};

const formatFiveStreetTable = (
  title: string,
  result: StudStreetAnalysisResult | RazzStreetAnalysisResult,
): string => {
  const table = new Table({
    head: ['Rank', 'Hand', '3RD', '4TH', '5TH', '6TH', '7TH'],
    colWidths: [6, 12, 28, 28, 28, 28, 28],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i] as StudStreetHandResult;
    table.push([
      i + 1,
      h.hand,
      streetSummary(h.third),
      streetSummary(h.fourth),
      streetSummary(h.fifth),
      streetSummary(h.sixth),
      streetSummary(h.seventh),
    ]);
  }

  let output = `\n${title}\n`;
  output += `Runs: ${result.config.runs} | Date: ${result.timestamp}\n`;
  output += table.toString();
  return output;
};

export const formatOmahaStreetTable = (result: StreetAnalysisResult): string => {
  const base = formatStreetTable(result);
  return base.replace("Texas Hold'em Street-by-Street Analysis", 'Omaha Hi Street-by-Street Analysis');
};

export const formatOmahaStreetJSON = formatStreetJSON;
export const formatOmahaStreetCSV = formatStreetCSV;
export const formatOmahaStreetMarkdown = (result: StreetAnalysisResult): string =>
  formatStreetMarkdown(result).replace(
    '# Texas Hold\'em Street-by-Street Analysis',
    '# Omaha Hi Street-by-Street Analysis',
  );

export const formatOmahaHiLoStreetTable = (result: StreetAnalysisResultHiLo): string => {
  const table = new Table({
    head: ['Rank', 'Hand', 'FLOP (Hi|Lo|Sc)', 'TURN (Hi|Lo|Sc)', 'RIVER (Hi|Lo|Sc)'],
    colWidths: [6, 10, 28, 28, 28],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    table.push([
      i + 1,
      h.hand,
      hiLoStreetSummary(h.flop),
      hiLoStreetSummary(h.turn),
      hiLoStreetSummary(h.river),
    ]);
  }

  let output = `\nOmaha Hi/Lo Street-by-Street Analysis\n`;
  output += `Runs: ${result.config.runs} | Opponents: ${result.config.opponents} | Date: ${result.timestamp}\n`;
  output += table.toString();
  return output;
};

export const formatOmahaHiLoStreetJSON = (result: StreetAnalysisResultHiLo): string =>
  JSON.stringify(result, null, 2);

export const formatOmahaHiLoStreetCSV = (result: StreetAnalysisResultHiLo): string => {
  const headers = [
    'rank',
    'hand',
    'flop_winHiPct',
    'flop_winLoPct',
    'flop_scoopPct',
    'turn_winHiPct',
    'turn_winLoPct',
    'turn_scoopPct',
    'river_winHiPct',
    'river_winLoPct',
    'river_scoopPct',
  ];
  const rows = result.hands.map((h, idx) =>
    [
      idx + 1,
      h.hand,
      h.flop.winHiPct.toFixed(2),
      h.flop.winLoPct.toFixed(2),
      h.flop.scoopPct.toFixed(2),
      h.turn.winHiPct.toFixed(2),
      h.turn.winLoPct.toFixed(2),
      h.turn.scoopPct.toFixed(2),
      h.river.winHiPct.toFixed(2),
      h.river.winLoPct.toFixed(2),
      h.river.scoopPct.toFixed(2),
    ].join(','),
  );
  return [headers.join(','), ...rows].join('\n');
};

export const formatOmahaHiLoStreetMarkdown = (result: StreetAnalysisResultHiLo): string => {
  let md = `# Omaha Hi/Lo Street-by-Street Analysis\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Opponents:** ${result.config.opponents}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;
  md += `| Rank | Hand | Flop Scoop% | Turn Scoop% | River Scoop% |\n`;
  md += `|------|------|-------------|-------------|--------------|\n`;
  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    md += `| ${i + 1} | ${h.hand} | ${h.flop.scoopPct.toFixed(1)}% | ${h.turn.scoopPct.toFixed(1)}% | ${h.river.scoopPct.toFixed(1)}% |\n`;
  }
  return md;
};

export const formatStudStreetTable = (result: StudStreetAnalysisResult): string =>
  formatFiveStreetTable('7-Card Stud Street-by-Street Analysis', result);

export const formatStudStreetJSON = (result: StudStreetAnalysisResult): string =>
  JSON.stringify(result, null, 2);

export const formatStudStreetCSV = (result: StudStreetAnalysisResult): string => {
  const headers = ['rank', 'hand', 'third_avg', 'fourth_avg', 'fifth_avg', 'sixth_avg', 'seventh_avg'];
  const rows = result.hands.map((h, idx) =>
    [
      idx + 1,
      h.hand,
      h.third.averageRank.toFixed(2),
      h.fourth.averageRank.toFixed(2),
      h.fifth.averageRank.toFixed(2),
      h.sixth.averageRank.toFixed(2),
      h.seventh.averageRank.toFixed(2),
    ].join(','),
  );
  return [headers.join(','), ...rows].join('\n');
};

export const formatStudStreetMarkdown = (result: StudStreetAnalysisResult): string => {
  let md = `# 7-Card Stud Street-by-Street Analysis\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;
  md += `| Rank | Hand | 7th Avg |\n|------|------|---------|\n`;
  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    md += `| ${i + 1} | ${h.hand} | ${h.seventh.averageRank.toFixed(0)} |\n`;
  }
  return md;
};

export const formatRazzStreetTable = (result: RazzStreetAnalysisResult): string =>
  formatFiveStreetTable('Razz Street-by-Street Analysis', result);

export const formatRazzStreetJSON = (result: RazzStreetAnalysisResult): string =>
  JSON.stringify(result, null, 2);

export const formatRazzStreetCSV = (result: RazzStreetAnalysisResult): string =>
  formatStudStreetCSV(result as StudStreetAnalysisResult);

export const formatRazzStreetMarkdown = (result: RazzStreetAnalysisResult): string => {
  let md = `# Razz Street-by-Street Analysis\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;
  md += `| Rank | Hand | 7th Avg |\n|------|------|---------|\n`;
  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i] as RazzStreetHandResult;
    md += `| ${i + 1} | ${h.hand} | ${h.seventh.averageRank.toFixed(0)} |\n`;
  }
  return md;
};

export const formatStudHiLoStreetTable = (result: StudHiLoStreetAnalysisResult): string => {
  const table = new Table({
    head: ['Rank', 'Hand', '5TH (Eq|Hi|Lo|Sc)', '6TH (Eq|Hi|Lo|Sc)', '7TH (Eq|Hi|Lo|Sc)'],
    colWidths: [6, 12, 32, 32, 32],
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    table.push([
      i + 1,
      h.hand,
      studHiLoStreetSummary(h.fifth),
      studHiLoStreetSummary(h.sixth),
      studHiLoStreetSummary(h.seventh),
    ]);
  }

  let output = `\nStud Hi/Lo Street-by-Street Analysis\n`;
  output += `Runs: ${result.config.runs} | Opponents: ${result.config.opponents} | Date: ${result.timestamp}\n`;
  output += table.toString();
  return output;
};

export const formatStudHiLoStreetJSON = (result: StudHiLoStreetAnalysisResult): string =>
  JSON.stringify(result, null, 2);

export const formatStudHiLoStreetCSV = (result: StudHiLoStreetAnalysisResult): string => {
  const headers = [
    'rank',
    'hand',
    'fifth_equity',
    'fifth_highWinPct',
    'fifth_lowWinPct',
    'fifth_scoopPct',
    'sixth_equity',
    'sixth_highWinPct',
    'sixth_lowWinPct',
    'sixth_scoopPct',
    'seventh_equity',
    'seventh_highWinPct',
    'seventh_lowWinPct',
    'seventh_scoopPct',
  ];
  const rows = result.hands.map((h, idx) =>
    [
      idx + 1,
      h.hand,
      h.fifth.equity.toFixed(2),
      h.fifth.highWinPct.toFixed(2),
      h.fifth.lowWinPct.toFixed(2),
      h.fifth.scoopPct.toFixed(2),
      h.sixth.equity.toFixed(2),
      h.sixth.highWinPct.toFixed(2),
      h.sixth.lowWinPct.toFixed(2),
      h.sixth.scoopPct.toFixed(2),
      h.seventh.equity.toFixed(2),
      h.seventh.highWinPct.toFixed(2),
      h.seventh.lowWinPct.toFixed(2),
      h.seventh.scoopPct.toFixed(2),
    ].join(','),
  );
  return [headers.join(','), ...rows].join('\n');
};

export const formatStudHiLoStreetMarkdown = (result: StudHiLoStreetAnalysisResult): string => {
  let md = `# Stud Hi/Lo Street-by-Street Analysis\n\n`;
  md += `- **Runs:** ${result.config.runs}\n`;
  md += `- **Opponents:** ${result.config.opponents}\n`;
  md += `- **Date:** ${result.timestamp}\n\n`;
  md += `| Rank | Hand | 7th Equity% | 7th Scoop% |\n|------|------|-------------|------------|\n`;
  for (let i = 0; i < result.hands.length; i++) {
    const h = result.hands[i]!;
    md += `| ${i + 1} | ${h.hand} | ${h.seventh.equity.toFixed(1)}% | ${h.seventh.scoopPct.toFixed(1)}% |\n`;
  }
  return md;
};

export { formatStreetTableDetailed };
