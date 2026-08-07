import {
  createRandomAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createTightAgent,
  alwaysCallAgent,
  fastHorseLevels,
  horseRotation,
  replayHandSteps,
  runSitAndGo,
  type SngPlayerInput,
  type SitAndGoConfig,
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

function fastConfig(overrides: Partial<SitAndGoConfig> = {}): SitAndGoConfig {
  return {
    seats: 8,
    startingStack: 500,
    levels: fastHorseLevels(),
    handsPerLevel: 2,
    rotation: horseRotation(),
    rotationCadence: 'orbit',
    payouts: [0.5, 0.3, 0.2],
    seed: 12345,
    ...overrides,
  };
}

describe('sit-and-go driver', () => {
  it('plays an 8-handed HORSE tournament to a single winner', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([11, 22, 33, 44, 55, 66, 77, 88]));
    expect(result.finished).toBe(true);
    expect(result.winner).not.toBeNull();
    const alive = result.finalStandings.filter((s) => s.alive);
    expect(alive.length).toBe(1);
    expect(result.winner!.id).toBe(alive[0]!.id);
    expect(result.handsPlayed).toBeGreaterThan(0);
  });

  it('is deterministic for a fixed config + lineup + seed', () => {
    const cfg = fastConfig();
    const lineup = makeLineup([1, 2, 3, 4, 5, 6, 7, 8]);
    const a = runSitAndGo(cfg, lineup);
    const b = runSitAndGo(cfg, makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(b.winner!.id).toBe(a.winner!.id);
    expect(b.handsPlayed).toBe(a.handsPlayed);
    expect(JSON.stringify(b.finalStandings)).toBe(JSON.stringify(a.finalStandings));
  });

  it('escalates blind levels over the course of the tournament', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    const first = result.history[0]!.levelIndex;
    const max = result.history.reduce((m, h) => Math.max(m, h.levelIndex), 0);
    expect(max).toBeGreaterThan(first);
    // levels are monotonic non-decreasing
    for (let i = 1; i < result.history.length; i++) {
      expect(result.history[i]!.levelIndex).toBeGreaterThanOrEqual(
        result.history[i - 1]!.levelIndex,
      );
    }
  });

  it('exercises all five HORSE games across the tournament', () => {
    const result = runSitAndGo(
      fastConfig({ rotationCadence: 'hand' }),
      makeLineup([1, 2, 3, 4, 5, 6, 7, 8]),
    );
    const games = new Set(result.history.map((h) => h.gameId));
    expect(games.has('texas-holdem-fl')).toBe(true);
    expect(games.has('omaha-hilo-fl')).toBe(true);
    expect(games.has('razz-fl')).toBe(true);
    expect(games.has('seven-card-stud-fl')).toBe(true);
    expect(games.has('seven-card-stud-hilo-fl')).toBe(true);
  });

  it('assigns every finishing place 1..8 exactly once', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    const places = result.finalStandings.map((s) => s.place).sort((a, b) => (a ?? 0) - (b ?? 0));
    expect(places).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('rotates the button to the next live player each hand', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    // between consecutive hands the button must change (different live player)
    for (let i = 1; i < result.history.length; i++) {
      expect(result.history[i]!.buttonId).not.toBe(result.history[i - 1]!.buttonId);
    }
  });

  it('conserves chips (winner holds ~ the entire starting pool)', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    const total = result.finalStandings.reduce((sum, s) => sum + s.stack, 0);
    const pool = 500 * 8;
    // hi-lo splits drop odd chips on the floor; allow a small per-hand drift
    expect(total).toBeLessThanOrEqual(pool);
    expect(total).toBeGreaterThanOrEqual(pool - result.handsPlayed);
  });

  it('handsPerLevel=1 grows the blinds every hand', () => {
    const result = runSitAndGo(
      fastConfig({ handsPerLevel: 1 }),
      makeLineup([1, 2, 3, 4, 5, 6, 7, 8]),
    );
    expect(result.history[1]!.levelIndex).toBe(1);
  });

  it('computes payouts for the configured finishing places', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(result.payouts.length).toBe(3);
    const pool = 500 * 8;
    const sum = result.payouts.reduce((s, p) => s + p.amount, 0);
    expect(sum).toBe(pool);
    expect(result.payouts.find((p) => p.place === 1)!.amount).toBe(pool * 0.5);
  });

  it('invokes the onHand callback once per hand in order', () => {
    const seen: number[] = [];
    runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]), (h) => seen.push(h.handNumber));
    expect(seen[0]).toBe(1);
    expect(seen[seen.length - 1]).toBe(seen.length);
    for (let i = 0; i < seen.length; i++) expect(seen[i]).toBe(i + 1);
  });

  it('rejects a lineup with the wrong player count', () => {
    expect(() => runSitAndGo(fastConfig(), makeLineup([1, 2, 3]))).toThrow();
  });

  it('completes 8-handed never-fold stud hands (common-card rule, no voids)', () => {
    // 8-handed Razz with always-call bots: nobody folds, so the deck runs short
    // on the late streets. The engine's common-card rule deals one shared card
    // instead of voiding, so the SNG progresses with zero voided hands.
    const razzOnly = fastConfig({
      rotation: [horseRotation()[2]!],
      maxHands: 40,
    });
    const alwaysCall: SngPlayerInput[] = [0, 1, 2, 3, 4, 5, 6, 7].map((id) => ({
      id,
      name: `C${id + 1}`,
      agent: alwaysCallAgent,
    }));
    const result = runSitAndGo(razzOnly, alwaysCall);
    expect(result.history.some((h) => h.voided)).toBe(false);
    expect(result.history.length).toBeGreaterThan(1);
    // every completed hand replayed fine (recorded replay data present)
    for (const h of result.history) {
      expect(h.replay).toBeDefined();
    }
  });

  it('rotates games per level when cadence is "level"', () => {
    const result = runSitAndGo(
      fastConfig({ rotationCadence: 'level', handsPerLevel: 2 }),
      makeLineup([1, 2, 3, 4, 5, 6, 7, 8]),
    );
    // The gameId must change at a level boundary (different from the per-hand cadence).
    const distinct = new Set(result.history.map((h) => h.gameId));
    expect(distinct.size).toBeGreaterThan(1);
  });

  it('records replay data that deterministically reproduces every hand', () => {
    const result = runSitAndGo(fastConfig(), makeLineup([1, 2, 3, 4, 5, 6, 7, 8]));
    for (const h of result.history) {
      expect(h.replay).toBeDefined();
      const r = h.replay!;
      expect(r.seatStacks.length).toBe(h.seatOrder.length);
      expect(r.actions.length).toBeGreaterThan(0);
      // Re-running the hand via the event-capturing replay yields the same
      // action count, the same final stacks as the driver's standings, and a
      // terminal last step with revealed hole cards (what the UI animates).
      const steps = replayHandSteps(r.table, r.hand, r.seed, r.actions, r.seatStacks);
      expect(steps.length).toBeGreaterThan(1);
      const actionCount = steps.reduce(
        (n, s) => n + s.events.filter((e) => e.type === 'action').length,
        0,
      );
      expect(actionCount).toBe(r.actions.length);
      const last = steps[steps.length - 1]!;
      expect(last.obs.isTerminal).toBe(true);
      expect(last.obs.revealedHole).toBeDefined();
      h.seatOrder.forEach((id, i) => {
        const row = h.standings.find((s) => s.id === id)!;
        expect(last.obs.players[i]!.stack).toBe(row.stack);
      });
    }
  });
});
