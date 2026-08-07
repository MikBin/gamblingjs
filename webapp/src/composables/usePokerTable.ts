import { ref, computed, shallowRef } from 'vue';
import {
  Table,
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createTightAgent,
  ensureHighHashes,
  standardHoldem,
  potLimitHoldem,
  fixedLimitHoldem,
  fixedLimitRazz,
  fixedLimitStud,
  omahaHi,
  omahaHiLo,
  razz,
  deuceSeven,
  studBringIn,
  studHiLo,
  pairTripsGame,
  type Action,
  type GameEvent,
  type GamePreset,
  type Observation,
  type PlayerAgent,
  type PotWinner,
} from '@pokertable';

export interface PresetOption {
  name: string;
  build: (seats: number, stack: number) => GamePreset;
}

const withSeats = (g: GamePreset, seats: number): GamePreset => {
  g.table.seats = { min: seats, max: seats };
  return g;
};

export const PRESETS: PresetOption[] = [
  { name: "NL Hold'em", build: (s, st) => standardHoldem({ seats: s, sb: 1, bb: 2, stack: st }) },
  { name: "PL Hold'em", build: (s, st) => withSeats(potLimitHoldem({ sb: 1, bb: 2, stack: st }), s) },
  {
    name: "FL Hold'em",
    build: (s, st) =>
      withSeats(fixedLimitHoldem({ smallBet: 2, bigBet: 4, maxRaises: 4, sb: 1, bb: 2, stack: st }), s),
  },
  { name: 'Omaha Hi', build: (s, st) => withSeats(omahaHi({ sb: 1, bb: 2, stack: st }), s) },
  {
    name: 'PL Omaha',
    build: (s, st) => {
      const g = withSeats(omahaHi({ sb: 1, bb: 2, stack: st }), s);
      g.table.gameId = 'omaha-hi-pl';
      g.hand.streets = g.hand.streets.map((str) => ({ ...str, betting: { type: 'pot-limit' } }));
      return g;
    },
  },
  { name: 'Omaha Hi/Lo', build: (s, st) => withSeats(omahaHiLo({ sb: 1, bb: 2, stack: st }), s) },
  {
    name: 'PL Omaha Hi/Lo',
    build: (s, st) => {
      const g = withSeats(omahaHiLo({ sb: 1, bb: 2, stack: st }), s);
      g.table.gameId = 'omaha-hilo-pl';
      g.hand.streets = g.hand.streets.map((str) => ({ ...str, betting: { type: 'pot-limit' } }));
      return g;
    },
  },
  { name: 'Razz (A-5 low)', build: (s, st) => withSeats(razz({ ante: 1, bringIn: 1, stack: st }), s) },
  {
    name: 'FL Razz',
    build: (s, st) => withSeats(fixedLimitRazz({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, maxRaises: 4, stack: st }), s),
  },
  { name: '2-7 Lowball', build: (s, st) => withSeats(deuceSeven({ ante: 1, bringIn: 1, stack: st }), s) },
  { name: 'Stud (NL, bring-in)', build: (s, st) => withSeats(studBringIn({ ante: 1, bringIn: 1, stack: st }), s) },
  { name: 'Stud Hi/Lo (NL)', build: (s, st) => withSeats(studHiLo({ ante: 1, bringIn: 1, stack: st }), s) },
  {
    name: 'FL Stud Hi',
    build: (s, st) => withSeats(fixedLimitStud({ ante: 1, bringIn: 1, smallBet: 2, bigBet: 4, maxRaises: 4, stack: st }), s),
  },
  { name: 'Invented (pair+trips)', build: (s, st) => withSeats(pairTripsGame({ sb: 1, bb: 2, stack: st }), s) },
];

let warmed = false;

export type BotProfile = 'random' | 'aggressive' | 'maniac' | 'station' | 'tight' | 'call';

export interface LineupOption {
  name: string;
  seats: (botIndex: number) => BotProfile;
}

// "Random mix" cycles archetypes so a table sees folds, raises, all-ins, etc.
const MIX_CYCLE: BotProfile[] = ['random', 'aggressive', 'maniac', 'station', 'tight'];

export const LINEUPS: LineupOption[] = [
  { name: 'Random mix', seats: (i) => MIX_CYCLE[i % MIX_CYCLE.length]! },
  { name: 'All random', seats: () => 'random' },
  { name: 'Calling stations', seats: () => 'station' },
  { name: 'Maniacs', seats: () => 'maniac' },
  { name: 'Aggressive (LAG)', seats: () => 'aggressive' },
  { name: 'Tight / nits', seats: () => 'tight' },
  { name: 'Always-call', seats: () => 'call' },
];

function buildBot(profile: BotProfile, seed: number): PlayerAgent {
  switch (profile) {
    case 'random':
      return createRandomAgent(seed);
    case 'aggressive':
      return createAggressiveAgent(seed);
    case 'maniac':
      return createManiacAgent(seed);
    case 'station':
      return createCallingStationAgent(seed);
    case 'tight':
      return createTightAgent(seed);
    case 'call':
      return alwaysCallAgent;
  }
}

export function usePokerTable() {
  if (!warmed) {
    ensureHighHashes();
    warmed = true;
  }

  const table = shallowRef<Table | null>(null);
  const obs = ref<Observation | null>(null);
  const log = ref<string[]>([]);
  const winners = ref<PotWinner[]>([]);
  const pots = ref<{ amount: number; eligible: number[]; winners: number[] }[]>([]);
  const finalStacks = ref<number[]>([]);
  const speed = ref(450);
  const lineup = ref(LINEUPS[0]!.name);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let instance: Table | null = null;
  const bots = new Map<number, PlayerAgent>();

  const done = computed(() => !!obs.value?.isTerminal);
  const humanTurn = computed(() => !!obs.value && obs.value.actingSeat === 0 && !done.value);
  const humanActions = computed(() => (humanTurn.value ? obs.value?.legalActions ?? [] : []));

  function push(line: string): void {
    log.value.push(line);
  }

  function onEvent(e: GameEvent): void {
    if (e.type === 'dealt') push(`➤ deal street ${e.streetIndex !== undefined ? e.streetIndex + 1 : ''}`);
    else if (e.type === 'betting-complete') push('➤ betting complete');
    else if (e.type === 'showdown') push('➤ showdown');
    else if (e.type === 'hand-ended') push('➤ hand complete');
  }

  function describe(a: Action): string {
    switch (a.type) {
      case 'fold':
        return `seat ${a.seat} folds`;
      case 'check':
        return `seat ${a.seat} checks`;
      case 'call':
        return `seat ${a.seat} calls ${a.amount}`;
      case 'bet':
        return `seat ${a.seat} bets ${a.amount}`;
      case 'raise':
        return `seat ${a.seat} raises to ${a.to}`;
      case 'allin':
        return `seat ${a.seat} is all-in (${a.amount})`;
      default:
        return `seat ${a.seat}: ${a.type}`;
    }
  }

  function refresh(): void {
    if (!instance) return;
    obs.value = instance.observe(0);
    if (instance.done) {
      winners.value = instance.winners;
      pots.value = instance.pots;
      finalStacks.value = instance.stacks();
    }
  }

  function tickBots(): void {
    if (!instance) return;
    if (instance.done || instance.currentSeat === 0) {
      refresh();
      return;
    }
    const seat = instance.currentSeat;
    const bot = bots.get(seat) ?? alwaysCallAgent;
    const action = bot.decide(instance.observe(seat));
    instance.step(action);
    push(describe(action));
    refresh();
    if (!instance.done && instance.currentSeat !== 0) {
      timer = setTimeout(tickBots, speed.value);
    }
  }

  function deal(preset: GamePreset, seed: number, stacks?: number[]): void {
    if (timer) clearTimeout(timer);
    log.value = [];
    winners.value = [];
    pots.value = [];
    finalStacks.value = [];
    instance = new Table(preset.table, preset.hand, seed, onEvent, stacks);
    table.value = instance;
    // build the bot roster for seats 1..n (seat 0 is the human)
    bots.clear();
    const lineupOpt = LINEUPS.find((l) => l.name === lineup.value) ?? LINEUPS[0]!;
    const n = preset.table.seats.min;
    for (let seat = 1; seat < n; seat++) {
      bots.set(seat, buildBot(lineupOpt.seats(seat - 1), seed * 131 + seat));
    }
    push(`new hand · ${preset.table.gameId} · seed ${seed} · ${n} seats · ${lineupOpt.name}`);
    refresh();
    tickBots();
  }

  function humanAct(action: Action): void {
    if (!instance || instance.done) return;
    instance.step(action);
    push(`seat 0 (you): ${describe(action).replace(/^seat 0 /, '')}`);
    refresh();
    tickBots();
  }

  function stop(): void {
    if (timer) clearTimeout(timer);
  }

  return {
    obs,
    log,
    winners,
    pots,
    finalStacks,
    done,
    humanTurn,
    humanActions,
    speed,
    lineup,
    deal,
    humanAct,
    stop,
  };
}
