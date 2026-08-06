import type { BettingConfig, HandConfig, TableConfig } from './types';

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
    ante?: number;
  } = {},
): GamePreset {
  const seats = opts.seats ?? 2;
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  const ante = opts.ante;
  return {
    table: {
      gameId: 'texas-holdem',
      seats: { min: seats, max: seats },
      deck: 'standard52',
    },
    hand: {
      forcedBets: {
        blinds: { sb, bb },
        ...(ante ? { ante } : {}),
        postRule: seats === 2 ? 'heads-up' : 'standard',
      },
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

export function potLimitHoldem(
  opts: { sb?: number; bb?: number; stack?: number; minBet?: number; minRaise?: number } = {},
): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  const preset = standardHoldem({ seats: 2, sb, bb, stack });
  const potLimit: BettingConfig = {
    type: 'pot-limit',
    ...(opts.minBet !== undefined ? { minBet: opts.minBet } : {}),
    ...(opts.minRaise !== undefined ? { minRaise: opts.minRaise } : {}),
  };
  preset.table.gameId = 'texas-holdem-pl';
  preset.hand.streets = preset.hand.streets.map((s) => ({ ...s, betting: potLimit }));
  return preset;
}

export function fixedLimitHoldem(
  opts: {
    sb?: number;
    bb?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
  } = {},
): GamePreset {
  const sb = opts.sb ?? 1;
  const smallBet = opts.smallBet ?? 2;
  const bb = opts.bb ?? smallBet;
  const bigBet = opts.bigBet ?? smallBet * 2;
  const stack = opts.stack ?? 200;
  const preset = standardHoldem({ seats: 2, sb, bb, stack });
  const fl = (): BettingConfig => ({
    type: 'fixed-limit',
    smallBet,
    bigBet,
    ...(opts.maxRaises !== undefined ? { maxRaisesPerStreet: opts.maxRaises } : {}),
  });
  preset.table.gameId = 'texas-holdem-fl';
  preset.hand.streets = preset.hand.streets.map((s) => ({ ...s, betting: fl() }));
  return preset;
}

export function studBringIn(
  opts: { ante?: number; bringIn?: number; stack?: number; sb?: number; bb?: number } = {},
): GamePreset {
  const ante = opts.ante ?? 1;
  const bringIn = opts.bringIn ?? 1;
  const stack = opts.stack ?? 200;
  const stud = sevenStud({ stack });
  stud.table.gameId = 'seven-card-stud-bringin';
  stud.hand.forcedBets = { ante, bringIn, postRule: 'stud' };
  stud.hand.streets = stud.hand.streets.map((s, i) => ({
    ...s,
    betting: noLimit,
    actionOrder: i === 0 ? 'low-upcard' : 'left-of-button',
  }));
  return stud;
}

export function razz(opts: { ante?: number; bringIn?: number; stack?: number } = {}): GamePreset {
  const g = studBringIn(opts);
  g.table.gameId = 'razz';
  g.hand.evaluation = {
    evaluator: 'A5-low',
    ranking: 'low-wins',
    composition: { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] },
  };
  return g;
}

export function deuceSeven(
  opts: { ante?: number; bringIn?: number; stack?: number } = {},
): GamePreset {
  const g = studBringIn(opts);
  g.table.gameId = '2-7-lowball';
  g.hand.evaluation = {
    evaluator: '2-7-low',
    ranking: 'low-wins',
    composition: { total: 5, pools: [{ pool: 'hand', min: 0, max: 5 }] },
  };
  return g;
}

export function omahaHiLo(opts: { sb?: number; bb?: number; stack?: number } = {}): GamePreset {
  const g = omahaHi(opts);
  g.table.gameId = 'omaha-hilo';
  g.hand.evaluation = {
    evaluator: 'hi-lo',
    ranking: 'high-wins',
    lowQualify: 8,
    composition: {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 2 },
        { pool: 'community', exactly: 3 },
      ],
    },
  };
  return g;
}
