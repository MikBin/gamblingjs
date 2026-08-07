import { playHand } from '../table';
import type { HandResult } from '../engine/state';
import type { PlayerAgent } from '../agents/types';
import type {
  HandSummary,
  RotationGame,
  SitAndGoConfig,
  SitAndGoLevel,
  SitAndGoResult,
  SngPlayerInput,
  StandingsRow,
} from './types';

// Per-hand retry count: extremely rare engine errors (e.g. a stud hand where too
// many players reach 7th street and exhaust the 52-card deck) are retried with a
// bumped sub-seed so the tournament always completes. Deterministic given the base seed.
const RETRIES = 4;

interface InternalPlayer {
  id: number;
  name: string;
  agent: PlayerAgent;
  stack: number;
  alive: boolean;
  place: number | null;
}

function snapshot(players: InternalPlayer[], order: number[]): StandingsRow[] {
  return order.map((id) => {
    const p = players[id]!;
    return { id: p.id, name: p.name, stack: p.stack, alive: p.alive, place: p.place };
  });
}

/**
 * Run a complete Sit-and-Go from the first deal until a single player holds every
 * chip. Pure and deterministic: same config + seed → identical result. Does not
 * touch the single-hand engine internals — it orchestrates many `playHand` calls,
 * owning the roster, button, blind levels and game rotation itself.
 */
export function runSitAndGo(
  config: SitAndGoConfig,
  playersIn: SngPlayerInput[],
  onHand?: (hand: HandSummary) => void,
): SitAndGoResult {
  if (playersIn.length !== config.seats) {
    throw new Error(`expected ${config.seats} players, got ${playersIn.length}`);
  }
  const players: InternalPlayer[] = playersIn.map((p) => ({
    id: p.id,
    name: p.name,
    agent: p.agent,
    stack: config.startingStack,
    alive: true,
    place: null,
  }));
  const order = players.map((p) => p.id); // stable original ordering

  const aliveList = (): InternalPlayer[] => players.filter((p) => p.alive);
  const lastLevelIndex = config.levels.length - 1;
  const rotation = config.rotation;
  const maxHands = config.maxHands ?? 10_000;

  let buttonId = order[0]!;
  let handNumber = 0;
  let levelIndex = 0;
  let gameIndex = 0;
  let handsAtLevel = 0;
  let orbitCounter = 0;
  const history: HandSummary[] = [];

  const nextAliveAfter = (id: number): number => {
    const alive = aliveList().map((p) => p.id);
    const i = alive.indexOf(id);
    for (let k = 1; k <= alive.length; k++) {
      const nid = alive[(i + k) % alive.length]!;
      if (nid !== id) return nid;
    }
    return id;
  };

  while (handNumber < maxHands) {
    const alive = aliveList();
    if (alive.length <= 1) break;
    handNumber++;

    const level: SitAndGoLevel = config.levels[Math.min(levelIndex, lastLevelIndex)]!;
    const game: RotationGame = rotation[gameIndex % rotation.length]!;
    const seatsCount = alive.length;

    // Seat order: alive players sorted by id, rotated so the button is seat 0.
    // The engine pins the button to seat 0, so this rotation preserves the
    // button across hands without modifying initHand.
    const aliveIds = alive.map((p) => p.id);
    const bpos = aliveIds.indexOf(buttonId);
    const seatOrder = bpos <= 0 ? aliveIds : [...aliveIds.slice(bpos), ...aliveIds.slice(0, bpos)];
    const seatAgents = seatOrder.map((id) => players[id]!.agent);
    const seatStacks = seatOrder.map((id) => players[id]!.stack);

    const preset = game.build(level, seatsCount);
    const table = { ...preset.table, seats: { min: seatsCount, max: seatsCount } };
    const hand = preset.hand;

    let result: HandResult | null = null;
    let voided = false;
    let usedSeed = config.seed * 1_000_003 + handNumber * 997;
    for (let attempt = 0; attempt < RETRIES; attempt++) {
      const s = config.seed * 1_000_003 + handNumber * 997 + attempt;
      try {
        result = playHand(table, hand, seatAgents, s, seatStacks);
        usedSeed = s;
        break;
      } catch {
        result = null;
      }
    }
    if (!result) voided = true;

    if (result) {
      // Clamp any impossible negative residual (defence-in-depth: the engine
      // should never produce one, but a leak here would silently create chips).
      const cleaned = result.finalStacks.map((s) => Math.max(0, s));
      seatOrder.forEach((id, i) => {
        players[id]!.stack = cleaned[i] ?? 0;
      });
    }

    // Eliminate busted players and assign finishing places. Place = (players
    // still alive after this hand) + offset; the lone survivor (if any) is 1st.
    const eliminated: number[] = [];
    for (const id of seatOrder) {
      const p = players[id]!;
      if (p.alive && p.stack <= 0) {
        p.alive = false;
        eliminated.push(id);
      }
    }
    const aliveAfter = aliveList();
    const placeBase = aliveAfter.length;
    eliminated.sort((a, b) => a - b);
    eliminated.forEach((id, idx) => {
      players[id]!.place = placeBase + eliminated.length - idx;
    });
    if (aliveAfter.length === 1) {
      players[aliveAfter[0]!.id]!.place = 1;
    } else if (aliveAfter.length === 0) {
      // Defensive: should never happen (settle always awards the pot). Recover by
      // crowning the last player to act with the largest residual stack.
      const fallback = [...seatOrder].sort((a, b) => players[b]!.stack - players[a]!.stack)[0]!;
      players[fallback]!.alive = true;
      players[fallback]!.place = 1;
    }

    const winners = result
      ? result.winners.map((w) => {
          const id = seatOrder[w.seat] ?? w.seat;
          return w.half ? { id, amount: w.amount, half: w.half } : { id, amount: w.amount };
        })
      : [];

    const summary: HandSummary = {
      handNumber,
      gameId: game.gameId,
      gameLabel: game.label,
      levelIndex: Math.min(levelIndex, lastLevelIndex),
      level,
      buttonId,
      seatOrder,
      winners,
      eliminated,
      standings: snapshot(players, order),
      ...(voided ? { voided: true } : {}),
      ...(result
        ? {
            replay: {
              table,
              hand,
              seed: usedSeed,
              seatStacks: [...seatStacks],
              actions: result.actions.map((a) => ({ ...a })),
            },
          }
        : {}),
    };
    history.push(summary);
    onHand?.(summary);

    // Advance the button to the next live player.
    buttonId = nextAliveAfter(buttonId);

    // Advance blind level.
    handsAtLevel++;
    let leveledUp = false;
    if (handsAtLevel >= config.handsPerLevel && levelIndex < lastLevelIndex) {
      levelIndex++;
      handsAtLevel = 0;
      leveledUp = true;
    }

    // Advance the game rotation per cadence.
    orbitCounter++;
    if (config.rotationCadence === 'hand') {
      gameIndex = (gameIndex + 1) % rotation.length;
    } else if (config.rotationCadence === 'level' && leveledUp) {
      gameIndex = (gameIndex + 1) % rotation.length;
    } else if (config.rotationCadence === 'orbit' && orbitCounter >= seatsCount) {
      gameIndex = (gameIndex + 1) % rotation.length;
      orbitCounter = 0;
    }
  }

  const aliveNow = aliveList();
  const finished = aliveNow.length === 1;
  if (finished) players[aliveNow[0]!.id]!.place = 1;

  const prizePool = config.startingStack * config.seats;
  const payouts = players
    .filter((p) => p.place !== null && p.place >= 1 && p.place <= config.payouts.length)
    .map((p) => ({
      id: p.id,
      place: p.place!,
      amount: Math.round(prizePool * (config.payouts[p.place! - 1] ?? 0)),
    }));

  const finalStandings = snapshot(players, order).sort((a, b) => {
    const pa = a.place ?? Number.MAX_SAFE_INTEGER;
    const pb = b.place ?? Number.MAX_SAFE_INTEGER;
    return pa - pb;
  });
  const winner = finalStandings.find((s) => s.place === 1) ?? null;

  return { finished, handsPlayed: history.length, winner, finalStandings, payouts, history };
}
