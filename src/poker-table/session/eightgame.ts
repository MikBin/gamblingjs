import type { GamePreset } from '../config/presets';
import { potLimitOmaha, standardHoldem, tripleDraw27 } from '../config/presets';
import type { SitAndGoLevel } from './types';
import { fastHorseLevels, horseGame } from './horse';
import type { HorseLetter } from './horse';
import type { GameBuilder, RotationGame } from './types';

/**
 * One letter of the standard 8-Game mix (WSOP order): 2-7 Triple Draw, Limit
 * Hold'em, Limit Omaha Hi/Lo, Razz, Stud, Stud Hi/Lo, No-Limit Hold'em, Pot-Limit
 * Omaha. The five fixed-limit games reuse the existing HORSE builder; the two
 * big-bet games and the draw game are built directly.
 */
export type EightGameLetter = 'T' | 'H' | 'O' | 'R' | 'S' | 'E' | 'N' | 'P';

/**
 * Build one 8-Game game as a GamePreset at the given level and seat count. The
 * SitAndGoLevel carries sb/bb/ante/bringIn; each game selects the fields it
 * needs (flop/draw games use the blinds, studs use ante+bring-in).
 */
export function eightGameGame(
  letter: EightGameLetter,
  level: SitAndGoLevel,
  seats: number,
): GamePreset {
  const seatRange = { min: seats, max: seats };
  switch (letter) {
    // Fixed-limit games — delegate to the HORSE builder (identical structure).
    case 'H':
      return horseGame('H' as HorseLetter, level, seats);
    case 'O':
      return horseGame('O' as HorseLetter, level, seats);
    case 'R':
      return horseGame('R' as HorseLetter, level, seats);
    case 'S':
      return horseGame('S' as HorseLetter, level, seats);
    case 'E':
      return horseGame('E' as HorseLetter, level, seats);
    case 'T': {
      // Limit 2-7 Triple Draw: blinds, small/big bet from the big blind.
      const g = tripleDraw27({
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
    case 'N': {
      // No-Limit Hold'em.
      const g = standardHoldem({ sb: level.sb, bb: level.bb });
      g.table.seats = seatRange;
      if (level.ante > 0) g.hand.forcedBets = { ...g.hand.forcedBets, ante: level.ante };
      return g;
    }
    case 'P': {
      // Pot-Limit Omaha.
      const g = potLimitOmaha({ sb: level.sb, bb: level.bb });
      g.table.seats = seatRange;
      if (level.ante > 0) g.hand.forcedBets = { ...g.hand.forcedBets, ante: level.ante };
      return g;
    }
  }
}

/** The canonical 8-Game rotation, in WSOP order. */
export function eightGameRotation(): RotationGame[] {
  const labels: Record<EightGameLetter, string> = {
    T: '2-7 Triple Draw (FL)',
    H: "Hold'em (FL)",
    O: 'Omaha Hi/Lo (FL)',
    R: 'Razz (FL)',
    S: 'Stud (FL)',
    E: 'Stud Hi/Lo (FL)',
    N: "Hold'em (NL)",
    P: 'Omaha (PL)',
  };
  const ids: Record<EightGameLetter, string> = {
    T: '2-7-triple-draw',
    H: 'texas-holdem-fl',
    O: 'omaha-hilo-fl',
    R: 'razz-fl',
    S: 'seven-card-stud-fl',
    E: 'seven-card-stud-hilo-fl',
    N: 'texas-holdem',
    P: 'omaha-pl',
  };
  return (['T', 'H', 'O', 'R', 'S', 'E', 'N', 'P'] as EightGameLetter[]).map((letter) => ({
    gameId: ids[letter],
    label: labels[letter],
    build: ((level: SitAndGoLevel, seats: number) =>
      eightGameGame(letter, level, seats)) as GameBuilder,
  }));
}

/**
 * A fast turbo blind schedule for an 8-handed 8-Game Sit-and-Go. Identical
 * structure to the HORSE schedule (it carries every forced-bet knob the eight
 * games need); reused here so a full mix resolves quickly.
 */
export function fastEightGameLevels(): SitAndGoLevel[] {
  return fastHorseLevels();
}
