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

  it('should format table with Stud Hi/Lo label and Hi/Lo columns', () => {
    const result: SimulationResult = {
      gameType: 'stud-hi-lo',
      config: { runs: 10, opponents: 1, useCache: false },
      hands: [
        {
          key: 'AAA',
          averageRank: 100,
          winPct: 55,
          tiePct: 0,
          runs: 10,
          equity: 55,
          scoopPct: 20,
          highWinPct: 60,
          lowWinPct: 50,
        },
      ],
      timestamp: '2023-01-01',
    };
    const output = formatTable(result);
    expect(output).toContain('Stud Hi/Lo Starting Hand Ranking');
    expect(output).toContain('Equity%');
    expect(output).toContain('Scoop%');
    expect(output).toContain('High%');
    expect(output).toContain('Low%');
  });

  it('should format markdown with Stud Hi/Lo label', () => {
    const result: SimulationResult = {
      gameType: 'stud-hi-lo',
      config: { runs: 10, opponents: 1, useCache: false },
      hands: [
        {
          key: 'AAA',
          averageRank: 100,
          winPct: 55,
          tiePct: 0,
          runs: 10,
          equity: 55,
          scoopPct: 20,
          highWinPct: 60,
          lowWinPct: 50,
        },
      ],
      timestamp: '2023-01-01',
    };
    const output = formatMarkdown(result);
    expect(output).toContain('# Stud Hi/Lo Starting Hand Ranking');
  });
});
