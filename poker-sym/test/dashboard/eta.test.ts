import {
  formatDuration,
  estimateTotalMs,
  rollingEtaMs,
  formatPreRunEta,
} from '../../dashboard/src/eta.js';
import {
  formatDuration as cliFormatDuration,
  estimateCliTotalMs,
  rollingEtaMs as cliRollingEtaMs,
} from '../../src/workers/cli-eta.js';

describe('dashboard eta', () => {
  it('formatDuration formats seconds and minutes', () => {
    expect(formatDuration(45000)).toBe('45s');
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(3600000)).toBe('1h');
  });

  it('estimateTotalMs scales by runs and opponents', () => {
    const bench = { msPerHand: 10, runs: 1000, opponents: 0 };
    expect(estimateTotalMs(169, 2000, 0, bench)).toBe(169 * 10 * 2);
    expect(estimateTotalMs(169, 1000, 2, bench)).toBeGreaterThan(169 * 10);
  });

  it('rollingEtaMs returns null until enough samples', () => {
    expect(rollingEtaMs(5000, 5, 100)).toBeNull();
    expect(rollingEtaMs(5000, 50, 100)).toBe(5000);
  });

  it('formatPreRunEta handles missing benchmark', () => {
    expect(formatPreRunEta(169, 1000, 0, null)).toContain('unknown');
  });
});

describe('cli eta', () => {
  it('estimateCliTotalMs scales by hand count and runs', () => {
    const ms = estimateCliTotalMs('holdem-preflop', 169, 10000, 0);
    expect(ms).toBeGreaterThan(0);
  });

  it('cli formatDuration formats minutes', () => {
    expect(cliFormatDuration(125000)).toBe('2m 5s');
  });

  it('cli rollingEtaMs matches dashboard rolling ETA', () => {
    expect(cliRollingEtaMs(10000, 50, 100)).toBe(10000);
  });
});
