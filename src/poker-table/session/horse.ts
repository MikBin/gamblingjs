import type { BettingConfig } from '../config/types';
import type { GamePreset } from '../config/presets';
import {
  fixedLimitHoldem,
  fixedLimitRazz,
  fixedLimitStud,
  omahaHiLo,
  studHiLo,
} from '../config/presets';
import type { GameBuilder, RotationGame, SitAndGoLevel } from './types';

export type HorseLetter = 'H' | 'O' | 'R' | 'S' | 'E';

// Fixed-limit bet ladder derived from the big blind: small bet = bb, big bet = 2*bb.
// HORSE is universally fixed-limit, so every game shares this structure.
const flBetting = (level: SitAndGoLevel, bigBetFromStreet = 2): BettingConfig => ({
  type: 'fixed-limit',
  smallBet: level.bb,
  bigBet: level.bb * 2,
  bigBetFromStreet,
  maxRaisesPerStreet: 4,
});

/**
 * Build one HORSE game as a fixed-limit GamePreset at the given level and seat
 * count. Reuses the existing preset builders; only the betting structure and the
 * forced bets (blinds vs ante+bring-in) differ between games.
 */
export function horseGame(letter: HorseLetter, level: SitAndGoLevel, seats: number): GamePreset {
  const seatRange = { min: seats, max: seats };
  switch (letter) {
    case 'H': {
      // Limit Hold'em: sb/bb blinds (+ optional ante at higher levels).
      const g = fixedLimitHoldem({
        sb: level.sb,
        bb: level.bb,
        smallBet: level.bb,
        bigBet: level.bb * 2,
        maxRaises: 4,
      });
      g.table.seats = seatRange;
      if (level.ante > 0) g.hand.forcedBets = { ...g.hand.forcedBets, ante: level.ante };
      return g;
    }
    case 'O': {
      // Limit Omaha Hi/Lo 8-or-better.
      const g = omahaHiLo({ sb: level.sb, bb: level.bb });
      g.table.gameId = 'omaha-hilo-fl';
      g.table.seats = seatRange;
      g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: flBetting(level) }));
      if (level.ante > 0) g.hand.forcedBets = { ...g.hand.forcedBets, ante: level.ante };
      return g;
    }
    case 'R': {
      // Limit Razz (A-5 low).
      const g = fixedLimitRazz({
        ante: Math.max(level.ante, 1),
        bringIn: Math.max(level.bringIn, 1),
        smallBet: level.bb,
        bigBet: level.bb * 2,
        maxRaises: 4,
      });
      g.table.seats = seatRange;
      return g;
    }
    case 'S': {
      // Limit 7-Card Stud (high).
      const g = fixedLimitStud({
        ante: Math.max(level.ante, 1),
        bringIn: Math.max(level.bringIn, 1),
        smallBet: level.bb,
        bigBet: level.bb * 2,
        maxRaises: 4,
      });
      g.table.seats = seatRange;
      return g;
    }
    case 'E': {
      // Limit 7-Card Stud Hi/Lo 8-or-better.
      const g = studHiLo({ ante: Math.max(level.ante, 1), bringIn: Math.max(level.bringIn, 1) });
      g.table.gameId = 'seven-card-stud-hilo-fl';
      g.table.seats = seatRange;
      g.hand.streets = g.hand.streets.map((s) => ({ ...s, betting: flBetting(level) }));
      return g;
    }
  }
}

/** The canonical HORSE rotation. */
export function horseRotation(): RotationGame[] {
  const labels: Record<HorseLetter, string> = {
    H: "Hold'em (FL)",
    O: 'Omaha Hi/Lo (FL)',
    R: 'Razz (FL)',
    S: 'Stud (FL)',
    E: 'Stud Hi/Lo (FL)',
  };
  const ids: Record<HorseLetter, string> = {
    H: 'texas-holdem-fl',
    O: 'omaha-hilo-fl',
    R: 'razz-fl',
    S: 'seven-card-stud-fl',
    E: 'seven-card-stud-hilo-fl',
  };
  return (['H', 'O', 'R', 'S', 'E'] as HorseLetter[]).map((letter) => ({
    gameId: ids[letter],
    label: labels[letter],
    build: (level, seats) => horseGame(letter, level, seats),
  }));
}

/**
 * A deliberately fast ("turbo") 8-handed HORSE blind schedule: granular levels
 * that roughly double the big blind each step, so a full Sit-and-Go resolves in a
 * couple of minutes of play rather than the 30-60 minutes a real SNG takes. Used
 * by the test suite and the browser smoke test. With ~3000 starting chips and 5
 * hands per level this yields ~40 hands — enough to exercise every HORSE game and
 * the full deal→bet→showdown→eliminate cycle several times over.
 */
export function fastHorseLevels(): SitAndGoLevel[] {
  return [
    { sb: 5, bb: 10, ante: 0, bringIn: 3 },
    { sb: 10, bb: 20, ante: 2, bringIn: 5 },
    { sb: 15, bb: 30, ante: 3, bringIn: 8 },
    { sb: 20, bb: 40, ante: 5, bringIn: 10 },
    { sb: 30, bb: 60, ante: 8, bringIn: 12 },
    { sb: 50, bb: 100, ante: 12, bringIn: 20 },
    { sb: 75, bb: 150, ante: 20, bringIn: 30 },
    { sb: 120, bb: 240, ante: 30, bringIn: 40 },
    { sb: 200, bb: 400, ante: 50, bringIn: 60 },
    { sb: 300, bb: 600, ante: 80, bringIn: 80 },
    { sb: 500, bb: 1000, ante: 120, bringIn: 120 },
    { sb: 800, bb: 1600, ante: 200, bringIn: 180 },
    { sb: 1500, bb: 3000, ante: 350, bringIn: 300 },
  ];
}
