import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fastHashesCreators } from '../../src/pokerHashes7';
import {
  playHand,
  replayHand,
  standardHoldem,
  alwaysCallAgent,
  createRng,
  initHand,
  dealStreet,
  runBettingRound,
  resumeHand,
  serializeState,
  hydrateState,
} from '../../src/poker-table';
import type { GameEvent, PlayerAgent } from '../../src/poker-table';

beforeAll(() => {
  fastHashesCreators.high();
});

const hu = standardHoldem({ sb: 1, bb: 2, stack: 200 });

describe('action-log replay', () => {
  it('reproduces a hand byte-identically from (seed, transcript)', () => {
    const orig = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 4242);
    const replayed = replayHand(hu.table, hu.hand, 4242, orig.actions);
    expect(replayed.actions).toEqual(orig.actions);
    expect(replayed.finalStacks).toEqual(orig.finalStacks);
    expect(replayed.winners).toEqual(orig.winners);
  });

  it('replay diverges if the log is altered (sanity)', () => {
    const orig = playHand(hu.table, hu.hand, [alwaysCallAgent, alwaysCallAgent], 4242);
    const tampered = orig.actions.map((a, i) => (i === 0 ? { ...a, type: 'fold' as const } : a));
    const replayed = replayHand(hu.table, hu.hand, 4242, tampered);
    expect(replayed.finalStacks).not.toEqual(orig.finalStacks);
  });
});

describe('snapshot / resume', () => {
  it('resume from a mid-river snapshot matches a full run', () => {
    const agents: PlayerAgent[] = [alwaysCallAgent, alwaysCallAgent];
    const full = playHand(hu.table, hu.hand, agents, 99);

    const rng = createRng(99);
    let s = initHand(hu.table, hu.hand, rng);
    s = runBettingRound(s, hu.hand, agents);
    s = runBettingRound(dealStreet(s, 1), hu.hand, agents);
    s = runBettingRound(dealStreet(s, 2), hu.hand, agents);
    s = dealStreet(s, 3);

    const snapshot = serializeState(s);
    const resumed = resumeHand(hydrateState(snapshot), hu.hand, agents);

    expect(resumed.seats.map((seat) => seat.stack)).toEqual(full.finalStacks);
    expect(resumed.actions).toEqual(full.actions);
    expect(resumed.isTerminal).toBe(true);
  });

  it('serialize/hydrate is a faithful round-trip', () => {
    const s = initHand(hu.table, hu.hand, createRng(7));
    expect(hydrateState(serializeState(s))).toEqual(s);
  });
});

describe('onEvent ordering', () => {
  it('emits every state change in order (heads-up always-call)', () => {
    const events: GameEvent[] = [];
    const recorder: PlayerAgent = {
      decide: (ctx, legal) => alwaysCallAgent.decide(ctx, legal),
      onEvent: (e) => events.push(e),
    };
    playHand(hu.table, hu.hand, [recorder, alwaysCallAgent], 4242);

    const expected: GameEvent['type'][] = ['hand-started'];
    for (let street = 0; street < 4; street++) {
      if (street > 0) expected.push('dealt');
      expected.push('action', 'action', 'betting-complete');
    }
    expected.push('showdown', 'hand-ended');

    expect(events.map((e) => e.type)).toEqual(expected);
  });
});

describe('randomness isolation', () => {
  it('uses no Math.random anywhere in src/poker-table', () => {
    const listTs = (dir: string): string[] => {
      const out: string[] = [];
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) out.push(...listTs(p));
        else if (name.endsWith('.ts')) out.push(p);
      }
      return out;
    };
    const files = listTs(join(process.cwd(), 'src', 'poker-table'));
    const offenders = files.filter((f) => readFileSync(f, 'utf8').includes('Math.random'));
    expect(offenders).toEqual([]);
  });
});
