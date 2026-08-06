import type { HandConfig, TableConfig } from './types';

export interface HoldemPreset {
  table: TableConfig;
  hand: HandConfig;
}

export function standardHoldem(
  opts: {
    seats?: number;
    sb?: number;
    bb?: number;
    stack?: number;
  } = {},
): HoldemPreset {
  const seats = opts.seats ?? 2;
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  const nl = { type: 'no-limit' as const };
  const flopToRiver = { holeDown: 0, playerUp: 0, community: 0 };
  return {
    table: {
      gameId: 'texas-holdem',
      seats: { min: seats, max: seats },
      deck: 'standard52',
    },
    hand: {
      forcedBets: {
        blinds: { sb, bb },
        postRule: seats === 2 ? 'heads-up' : 'standard',
      },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'preflop',
          deal: { holeDown: 2, playerUp: 0, community: 0 },
          betting: nl,
          actionOrder: 'left-of-button',
        },
        {
          name: 'flop',
          deal: { ...flopToRiver, community: 3 },
          betting: nl,
          actionOrder: 'left-of-button',
        },
        {
          name: 'turn',
          deal: { ...flopToRiver, community: 1 },
          betting: nl,
          actionOrder: 'left-of-button',
        },
        {
          name: 'river',
          deal: { ...flopToRiver, community: 1 },
          betting: nl,
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
