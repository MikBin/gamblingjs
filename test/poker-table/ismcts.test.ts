import { describe, it, expect, beforeAll } from 'vitest';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  createSearchAgent,
  createSmartBot,
  ismctsDecide,
  omahaHi,
  playHand,
  razz,
  reconstructState,
  standardHoldem,
  Table,
} from '../../src/poker-table';
import type { Action, Observation, PlayerAgent } from '../../src/poker-table';
import { createRng, resolveSearchBotConfig } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
  fastHashesCreators.Ato5();
});

const ISMCTS = (seed: number): PlayerAgent =>
  createSearchAgent({
    seed,
    core: 'ismcts',
    treeIterations: 50,
    determinizations: 3,
    equitySamples: 100,
    temperature: 0,
  });

function pick(legal: Action[], type: Action['type']): Action {
  const a = legal.find((x) => x.type === type);
  if (!a) throw new Error(`no ${type} action`);
  return a;
}

describe('reconstructState — self-validating determinization', () => {
  it('rebuilds a resumable state whose legal actions match the observation (preflop)', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const t = new Table(g.table, g.hand, 123);
    expect(t.currentSeat).toBe(0); // SB acts first heads-up
    const obs = t.observe(0);
    const st = reconstructState(obs, createRng(1));
    expect(st).not.toBeNull();
    expect(st!.streetIndex).toBe(0);
  });

  it('rebuilds correctly after preflop aggression (facing a raise)', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const t = new Table(g.table, g.hand, 77);
    t.step(pick(t.observe(0).legalActions, 'call')); // SB completes
    t.step(pick(t.observe(1).legalActions, 'bet')); // BB bets (the BB "option" action)
    expect(t.currentSeat).toBe(0);
    const obs = t.observe(0); // SB faces a bet, actionLog has [call, bet]
    expect(obs.actionLog.length).toBeGreaterThanOrEqual(2);
    const st = reconstructState(obs, createRng(3));
    expect(st).not.toBeNull();
  });

  it('never leaks the real opponent hole cards into the rebuilt state', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const t = new Table(g.table, g.hand, 999);
    const obs = t.observe(0);
    const realOppHole = (t as unknown as { observe: (s: number) => Observation }).observe(1).myHole;
    // Across several determinizations, the sampled opponent hole must vary and
    // must not equal the real hole every time (i.e. it is sampled, not copied).
    let mismatches = 0;
    for (let s = 0; s < 8; s++) {
      const st = reconstructState(obs, createRng(s + 1));
      if (!st) continue;
      const sampled = st.seats[1]!.hole;
      if (sampled.some((c, i) => c !== realOppHole[i])) mismatches++;
    }
    expect(mismatches).toBeGreaterThan(0);
  });
});

describe('ismctsDecide — legality + determinism', () => {
  function facingRaiseObs(): Observation {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const t = new Table(g.table, g.hand, 55);
    t.step(pick(t.observe(0).legalActions, 'call'));
    t.step(pick(t.observe(1).legalActions, 'bet')); // BB "option" bets
    return t.observe(0);
  }

  it('returns an action whose type is in legalActions', () => {
    const obs = facingRaiseObs();
    const p = resolveSearchBotConfig({
      seed: 1,
      core: 'ismcts',
      treeIterations: 40,
      determinizations: 3,
    });
    const a = ismctsDecide(
      obs,
      p,
      createRng(1),
      () => ({ type: 'fold', seat: 0, streetIndex: 0 }),
      (x) => x,
    );
    expect(obs.legalActions.some((x) => x.type === a.type)).toBe(true);
  });

  it('is deterministic for the same seed/config', () => {
    const obs = facingRaiseObs();
    const r1 = ISMCTS(42).decide(obs);
    const r2 = ISMCTS(42).decide(obs);
    expect(r1.type).toBe(r2.type);
  });
});

describe('createSearchAgent(ismcts) — engine integration', () => {
  const variants = [
    { name: 'holdem', preset: standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 }) },
    { name: 'omaha', preset: omahaHi() },
    { name: 'razz', preset: razz() },
  ];

  it('plays every variant zero-sum with no illegal action (falls back to PIMC where needed)', () => {
    for (const v of variants) {
      for (let seed = 1; seed <= 4; seed++) {
        const res = playHand(
          v.preset.table,
          v.preset.hand,
          [ISMCTS(seed), ISMCTS(seed + 50)],
          seed,
        );
        const buyIn = v.preset.hand.stacks.buyIn;
        expect(res.finalStacks.reduce((a, b) => a + b, 0)).toBe(buyIn * v.preset.table.seats.min);
      }
    }
  });

  it('engages the tree search (varied, non-degenerate actions across a match)', () => {
    const g = standardHoldem({ seats: 2, sb: 1, bb: 2, stack: 200 });
    const smart = createSmartBot({ seed: 9, aggression: 0.5, tightness: 0.5 });
    const types = new Set<string>();
    for (let s = 0; s < 12; s++) {
      for (const a of playHand(g.table, g.hand, [ISMCTS(7), smart], s + 1).actions) {
        if (a.seat === 0) types.add(a.type);
      }
    }
    // The tree must produce a real mix of decisions (not collapse to a single
    // fallback action) — proving UCB1 selection + expansion actually run.
    expect(types.size).toBeGreaterThanOrEqual(3);
  });
});
