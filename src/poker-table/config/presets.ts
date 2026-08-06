import type { HandConfig, TableConfig } from './types';

export interface GamePreset {
  table: TableConfig;
  hand: HandConfig;
}

const noLimit = { type: 'no-limit' as const };
const post = { holeDown: 0, playerUp: 0, community: 0 };

export function standardHoldem(
  opts: {
    seats?: number;
    sb?: number;
    bb?: number;
    stack?: number;
  } = {},
): GamePreset {
  const seats = opts.seats ?? 2;
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  return {
    table: {
      gameId: 'texas-holdem',
      seats: { min: seats, max: seats },
      deck: 'standard52',
    },
    hand: {
      forcedBets: { blinds: { sb, bb }, postRule: seats === 2 ? 'heads-up' : 'standard' },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'preflop',
          deal: { holeDown: 2, playerUp: 0, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'flop',
          deal: { ...post, community: 3 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'turn',
          deal: { ...post, community: 1 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'river',
          deal: { ...post, community: 1 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
      ],
      evaluation: {
        evaluator: 'high',
        ranking: 'high-wins',
        composition: {
          total: 5,
          pools: [
            { pool: 'hole', min: 0, max: 5 },
            { pool: 'community', min: 0, max: 5 },
          ],
        },
      },
    },
  };
}

export function omahaHi(opts: { sb?: number; bb?: number; stack?: number } = {}): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  return {
    table: { gameId: 'omaha-hi', seats: { min: 2, max: 2 }, deck: 'standard52' },
    hand: {
      forcedBets: { blinds: { sb, bb }, postRule: 'heads-up' },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'preflop',
          deal: { holeDown: 4, playerUp: 0, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'flop',
          deal: { ...post, community: 3 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'turn',
          deal: { ...post, community: 1 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'river',
          deal: { ...post, community: 1 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
      ],
      evaluation: {
        evaluator: 'high',
        ranking: 'high-wins',
        composition: {
          total: 5,
          pools: [
            { pool: 'hole', exactly: 2 },
            { pool: 'community', exactly: 3 },
          ],
        },
      },
    },
  };
}

export function sevenStud(opts: { sb?: number; bb?: number; stack?: number } = {}): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  return {
    table: { gameId: 'seven-card-stud', seats: { min: 2, max: 2 }, deck: 'standard52' },
    hand: {
      forcedBets: { blinds: { sb, bb }, postRule: 'heads-up' },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'third',
          deal: { holeDown: 2, playerUp: 1, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'fourth',
          deal: { holeDown: 0, playerUp: 1, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'fifth',
          deal: { holeDown: 0, playerUp: 1, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'sixth',
          deal: { holeDown: 0, playerUp: 1, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'seventh',
          deal: { holeDown: 1, playerUp: 0, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
      ],
      evaluation: {
        evaluator: 'high',
        ranking: 'high-wins',
        composition: { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] },
      },
    },
  };
}
