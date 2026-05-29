import { describe, it, expect } from 'vitest';
import { formatTable, formatMarkdown } from '../poker-sym/src/output.js';
import { SimulationResult } from '../poker-sym/src/simulation/types.js';

describe('Output Formatter', () => {
  it('should format table with 7-Card Stud label', () => {
    const result: SimulationResult = {
      gameType: '7card-stud',
      config: { runs: 10, opponents: 0, useCache: false },
      hands: [
        { key: 'AAA', averageRank: 100, winPct: 0, tiePct: 0, runs: 10 }
      ],
      timestamp: '2023-01-01',
    };
    const output = formatTable(result);
    expect(output).toContain('7-Card Stud Starting Hand Ranking');
  });

  it('should format markdown with 7-Card Stud label', () => {
    const result: SimulationResult = {
      gameType: '7card-stud',
      config: { runs: 10, opponents: 0, useCache: false },
      hands: [
        { key: 'AAA', averageRank: 100, winPct: 0, tiePct: 0, runs: 10 }
      ],
      timestamp: '2023-01-01',
    };
    const output = formatMarkdown(result);
    expect(output).toContain('# 7-Card Stud Starting Hand Ranking');
  });
});
