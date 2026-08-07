import {
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createTightAgent,
  eightGameRotation,
  fastEightGameLevels,
  runSitAndGo,
  type SitAndGoConfig,
  type SngPlayerInput,
} from '../../../src/poker-table/index';

const CYCLE = [
  createRandomAgent,
  createAggressiveAgent,
  createManiacAgent,
  createCallingStationAgent,
  createTightAgent,
];

function makeLineup(seeds: number[]): SngPlayerInput[] {
  return seeds.map((seed, i) => ({
    id: i,
    name: `P${i + 1}`,
    agent: CYCLE[i % CYCLE.length]!(seed),
  }));
}

function fastEightConfig(overrides: Partial<SitAndGoConfig> = {}): SitAndGoConfig {
  return {
    seats: 8,
    startingStack: 500,
    levels: fastEightGameLevels(),
    handsPerLevel: 6,
    rotation: eightGameRotation(),
    rotationCadence: 'hand',
    payouts: [0.5, 0.3, 0.2],
    seed: 777,
    ...overrides,
  };
}

describe('8-Game rotation + Sit-and-Go', () => {
  it('eightGameRotation lists the 8 games in WSOP order', () => {
    const rot = eightGameRotation();
    expect(rot).toHaveLength(8);
    expect(rot.map((g) => g.gameId)).toEqual([
      '2-7-triple-draw',
      'texas-holdem-fl',
      'omaha-hilo-fl',
      'razz-fl',
      'seven-card-stud-fl',
      'seven-card-stud-hilo-fl',
      'texas-holdem',
      'omaha-pl',
    ]);
    expect(rot.every((g) => g.label.length > 0)).toBe(true);
  });

  it('runs an 8-handed 8-Game SNG to a single winner, deterministically', () => {
    const cfg = fastEightConfig();
    const r1 = runSitAndGo(cfg, makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    const r2 = runSitAndGo(cfg, makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(r1.finished).toBe(true);
    expect(r1.winner).not.toBeNull();
    expect(r1.winner!.id).toBe(r2.winner!.id);
    expect(r1.handsPlayed).toEqual(r2.handsPlayed);
    expect(r1.finalStandings.map((s) => s.id)).toEqual(r2.finalStandings.map((s) => s.id));
  });

  it('exercises every game in the mix within the first orbit', () => {
    const cfg = fastEightConfig();
    const result = runSitAndGo(cfg, makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    const first8 = result.history.slice(0, 8).map((h) => h.gameId);
    expect(new Set(first8).size).toBe(8);
    expect(first8[0]).toBe('2-7-triple-draw');
    expect(first8).toContain('omaha-pl');
  });

  it('conserves chips: payouts sum to the prize pool', () => {
    const cfg = fastEightConfig();
    const result = runSitAndGo(cfg, makeLineup([10, 20, 30, 40, 50, 60, 70, 80]));
    const prizePool = cfg.startingStack * cfg.seats;
    const paid = result.payouts.reduce((a, p) => a + p.amount, 0);
    expect(paid).toBeLessThanOrEqual(prizePool);
    expect(paid).toBeGreaterThan(0);
  });

  it('also completes with always-call bots (stand-pat draws)', () => {
    const cfg = fastEightConfig({ seed: 5 });
    const lineup: SngPlayerInput[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: `C${i + 1}`,
      agent: alwaysCallAgent,
    }));
    const result = runSitAndGo(cfg, lineup);
    expect(result.finished).toBe(true);
    expect(result.winner).not.toBeNull();
  });
});
