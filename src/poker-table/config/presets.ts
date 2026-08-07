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

// No-limit 7-card Stud Hi/Lo (8-qualify split): ante + bring-in (lowest upcard),
// NL betting, pot split into high and low halves at showdown.
export function studHiLo(
  opts: { ante?: number; bringIn?: number; stack?: number } = {},
): GamePreset {
  const g = studBringIn(opts);
  g.table.gameId = 'seven-card-stud-hilo';
  g.hand.evaluation = {
    evaluator: 'hi-lo',
    ranking: 'high-wins',
    lowQualify: 8,
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

// Invented variant: a pair must come from the hole cards and trips from the
// community board. Defined entirely in config — zero engine branching.
export function pairTripsGame(opts: { sb?: number; bb?: number; stack?: number } = {}): GamePreset {
  const g = standardHoldem(opts);
  g.table.gameId = 'pair-from-hole-trips-from-board';
  g.hand.evaluation = {
    evaluator: 'high',
    ranking: 'high-wins',
    composition: {
      total: 5,
      pools: [
        { pool: 'hole', exactly: 2, pattern: 'pair' },
        { pool: 'community', exactly: 3, pattern: 'trips' },
      ],
    },
  };
  return g;
}

// Fixed-limit 7-card Stud Hi: ante + bring-in (lowest upcard), small bet on
// third/fourth, big bet from fifth street onward, raise cap per street.
export function fixedLimitStud(
  opts: {
    ante?: number;
    bringIn?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
  } = {},
): GamePreset {
  const ante = opts.ante ?? 1;
  const bringIn = opts.bringIn ?? 1;
  const smallBet = opts.smallBet ?? 2;
  const bigBet = opts.bigBet ?? 4;
  const stack = opts.stack ?? 200;
  const g = studBringIn({ ante, bringIn, stack });
  g.table.gameId = 'seven-card-stud-fl';
  const fl = (): BettingConfig => ({
    type: 'fixed-limit',
    smallBet,
    bigBet,
    bigBetFromStreet: 2, // big bets from fifth street (standard 7-stud)
    ...(opts.maxRaises !== undefined ? { maxRaisesPerStreet: opts.maxRaises } : {}),
  });
  g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: fl() }));
  return g;
}

// Fixed-limit Razz: 7-card stud, A-5 lowball (lowest hand wins, ace low), ante
// + bring-in (lowest upcard, ace low), small/big bet structure, raise cap.
export function fixedLimitRazz(
  opts: {
    ante?: number;
    bringIn?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
  } = {},
): GamePreset {
  const ante = opts.ante ?? 1;
  const bringIn = opts.bringIn ?? 1;
  const smallBet = opts.smallBet ?? 2;
  const bigBet = opts.bigBet ?? 4;
  const stack = opts.stack ?? 200;
  const g = razz({ ante, bringIn, stack });
  g.table.gameId = 'razz-fl';
  const fl = (): BettingConfig => ({
    type: 'fixed-limit',
    smallBet,
    bigBet,
    bigBetFromStreet: 2,
    ...(opts.maxRaises !== undefined ? { maxRaisesPerStreet: opts.maxRaises } : {}),
  });
  g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: fl() }));
  return g;
}

// Shared builder for fixed-limit lowball draw games (2-7 Triple Draw and A-5
// Triple Draw). Five hole cards, button + blinds, three draw rounds, small bets
// on the first two betting rounds and big bets on the last two.
function lowDrawGame(
  evalKind: '2-7-low' | 'A5-low',
  gameId: string,
  opts: {
    sb?: number;
    bb?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
    ante?: number;
  } = {},
): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const smallBet = opts.smallBet ?? bb;
  const bigBet = opts.bigBet ?? smallBet * 2;
  const stack = opts.stack ?? 200;
  const fl = (): BettingConfig => ({
    type: 'fixed-limit',
    smallBet,
    bigBet,
    bigBetFromStreet: 2,
    ...(opts.maxRaises !== undefined ? { maxRaisesPerStreet: opts.maxRaises } : {}),
  });
  const draw = { from: 'hole' as const, max: 5 };
  const drawStreet = (name: string): HandConfig['streets'][number] => ({
    name,
    deal: { ...post },
    draw,
    betting: fl(),
    actionOrder: 'left-of-button',
  });
  return {
    table: { gameId, seats: { min: 2, max: 2 }, deck: 'standard52' },
    hand: {
      forcedBets: {
        blinds: { sb, bb },
        ...(opts.ante ? { ante: opts.ante } : {}),
        postRule: 'heads-up',
      },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'predraw',
          deal: { holeDown: 5, playerUp: 0, community: 0 },
          betting: fl(),
          actionOrder: 'left-of-button',
        },
        drawStreet('draw1'),
        drawStreet('draw2'),
        drawStreet('draw3'),
      ],
      evaluation: {
        evaluator: evalKind,
        ranking: 'low-wins',
        composition: { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] },
      },
    },
  };
}

// Fixed-limit 2-7 Triple Draw: lowest 2-7 lowball hand wins (straights/flushes
// count against, aces high). One of the eight games in the standard 8-Game mix.
export function tripleDraw27(
  opts: {
    sb?: number;
    bb?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
    ante?: number;
  } = {},
): GamePreset {
  return lowDrawGame('2-7-low', '2-7-triple-draw', opts);
}

// Fixed-limit A-5 Triple Draw: lowest A-5 lowball hand wins (aces low; straights
// and flushes do NOT count against). Demonstrates the draw engine's generality.
export function aFiveTripleDraw(
  opts: {
    sb?: number;
    bb?: number;
    smallBet?: number;
    bigBet?: number;
    maxRaises?: number;
    stack?: number;
    ante?: number;
  } = {},
): GamePreset {
  return lowDrawGame('A5-low', 'a-5-triple-draw', opts);
}

// No-limit 5-Card Draw: five hole cards, one draw round, high hand wins.
export function fiveCardDraw(
  opts: { sb?: number; bb?: number; stack?: number; ante?: number } = {},
): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  return {
    table: { gameId: 'five-card-draw', seats: { min: 2, max: 2 }, deck: 'standard52' },
    hand: {
      forcedBets: {
        blinds: { sb, bb },
        ...(opts.ante ? { ante: opts.ante } : {}),
        postRule: 'heads-up',
      },
      stacks: { min: 1, max: 1_000_000, buyIn: stack },
      streets: [
        {
          name: 'predraw',
          deal: { holeDown: 5, playerUp: 0, community: 0 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
        {
          name: 'draw',
          deal: { ...post },
          draw: { from: 'hole', max: 5 },
          betting: noLimit,
          actionOrder: 'left-of-button',
        },
      ],
      evaluation: {
        evaluator: 'high',
        ranking: 'high-wins',
        composition: { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] },
      },
    },
  };
}

// Pot-Limit Omaha: four hole cards (use exactly 2) + 5 community (use exactly 3),
// pot-limit betting. One of the eight games in the standard 8-Game mix.
export function potLimitOmaha(
  opts: { sb?: number; bb?: number; stack?: number; minBet?: number; minRaise?: number } = {},
): GamePreset {
  const sb = opts.sb ?? 1;
  const bb = opts.bb ?? 2;
  const stack = opts.stack ?? 200;
  const g = omahaHi({ sb, bb, stack });
  const potLimit: BettingConfig = {
    type: 'pot-limit',
    ...(opts.minBet !== undefined ? { minBet: opts.minBet } : {}),
    ...(opts.minRaise !== undefined ? { minRaise: opts.minRaise } : {}),
  };
  g.table.gameId = 'omaha-pl';
  g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: potLimit }));
  return g;
}
