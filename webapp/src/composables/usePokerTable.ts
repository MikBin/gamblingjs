import { ref, computed, shallowRef } from 'vue';
import {
  Table,
  alwaysCallAgent,
  createAggressiveAgent,
  createCallingStationAgent,
  createManiacAgent,
  createRandomAgent,
  createSmartBot,
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
  type SmartBotParams,
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

export type BotProfile =
  | 'random'
  | 'aggressive'
  | 'maniac'
  | 'station'
  | 'tight'
  | 'call'
  | 'smart';

export interface LineupOption {
  name: string;
  seats: (botIndex: number) => BotProfile;
}

// "Random mix" cycles archetypes so a table sees folds, raises, all-ins, etc.
const MIX_CYCLE: BotProfile[] = ['random', 'aggressive', 'maniac', 'station', 'tight'];

/** Default smart-bot personality; tuned live via the table's difficulty sliders. */
export const SMART_DEFAULT: Omit<SmartBotParams, 'seed'> = {
  aggression: 0.6,
  tightness: 0.4,
  bluffiness: 0.08,
  sizing: 0.7,
};

export const LINEUPS: LineupOption[] = [
  { name: 'Random mix', seats: (i) => MIX_CYCLE[i % MIX_CYCLE.length]! },
  { name: 'All random', seats: () => 'random' },
  { name: 'Calling stations', seats: () => 'station' },
  { name: 'Maniacs', seats: () => 'maniac' },
  { name: 'Aggressive (LAG)', seats: () => 'aggressive' },
  { name: 'Tight / nits', seats: () => 'tight' },
  { name: 'Always-call', seats: () => 'call' },
  { name: 'Smart bots', seats: () => 'smart' },
  { name: 'Smart + classic mix', seats: (i) => (i % 2 === 0 ? 'smart' : MIX_CYCLE[i % MIX_CYCLE.length]!) },
];

function buildBot(profile: BotProfile, seed: number, smart: Omit<SmartBotParams, 'seed'>): PlayerAgent {
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
    case 'smart':
      return createSmartBot({ seed, ...smart });
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
  const speed = ref(850);
  const lineup = ref(LINEUPS[0]!.name);
  // Smart-bot personality, tunable live (sliders in the table view).
  const smartCfg = ref<Omit<SmartBotParams, 'seed'>>({ ...SMART_DEFAULT });
  // Animation/pacing state
  const revealedCount = ref(Infinity); // how many community cards are visible
  const showdown = ref(false); // true once the finale (board complete + reveal) plays

  let instance: Table | null = null;
  const bots = new Map<number, PlayerAgent>();
  // Per-street community-card counts, captured at deal() to reconstruct run-outs.
  let handStreets: { deal?: { community?: number } }[] = [];
  // Synchronous events captured during a single Table.step() call.
  let stepEvents: GameEvent[] = [];

  // ---- Cancellable timing (aborted on every new deal) ----
  let gen = 0;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const sleepers = new Set<() => void>();

  function sleep(ms: number, token: number): Promise<void> {
    return new Promise((resolve) => {
      if (token !== gen) return resolve();
      const id = setTimeout(() => {
        timers.delete(id);
        sleepers.delete(resolve);
        resolve();
      }, ms);
      timers.add(id);
      sleepers.add(resolve);
    });
  }

  function cancelAll(): void {
    gen++;
    for (const id of timers) clearTimeout(id);
    timers.clear();
    for (const wake of sleepers) wake();
    sleepers.clear();
  }

  const done = computed(() => !!obs.value?.isTerminal);
  const humanTurn = computed(() => !!obs.value && obs.value.actingSeat === 0 && !done.value);
  const humanActions = computed(() => (humanTurn.value ? obs.value?.legalActions ?? [] : []));

  const revealedCommunity = computed(() => {
    const c = obs.value?.community ?? [];
    const n = revealedCount.value;
    return n >= c.length ? c : c.slice(0, n);
  });

  function push(line: string): void {
    log.value.push(line);
  }

  function onEvent(e: GameEvent): void {
    stepEvents.push(e);
    if (e.type === 'dealt') push(`➤ deal street ${(e.streetIndex ?? 0) + 1}`);
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

  // Apply one action, then (if a new street was dealt inside that step) reveal
  // the board street-by-street so the human can see cards coming — including an
  // all-in run-out, where the engine deals several streets in a single step().
  function doStep(action: Action): { pre: number; dealtStreets: number[] } {
    if (!instance) return { pre: 0, dealtStreets: [] };
    const pre = obs.value?.community.length ?? 0;
    stepEvents = [];
    instance.step(action);
    push(describe(action));
    refresh();
    const dealtStreets = stepEvents
      .filter((e) => e.type === 'dealt')
      .map((e) => e.streetIndex ?? 0);
    return { pre, dealtStreets };
  }

  async function paceReveal(d: { pre: number; dealtStreets: number[] }, token: number): Promise<void> {
    if (!d.dealtStreets.length) return;
    revealedCount.value = d.pre; // hide cards about to be revealed
    let idx = d.pre;
    for (const si of d.dealtStreets) {
      await sleep(speed.value, token);
      if (token !== gen) return;
      idx += handStreets[si]?.deal?.community ?? 0;
      revealedCount.value = idx;
    }
  }

  // Showdown / fold-out finale: pause on the final board, then flip the flag the
  // view uses to reveal hole cards and animate the pot sliding to the winner(s).
  async function finale(token: number): Promise<void> {
    await sleep(speed.value, token);
    if (token !== gen) return;
    showdown.value = true;
  }

  async function applyActionPaced(action: Action, token: number): Promise<void> {
    const d = doStep(action);
    await paceReveal(d, token);
    if (token !== gen) return;
    if (instance?.done) await finale(token);
  }

  async function runBots(): Promise<void> {
    const token = gen;
    while (instance && !instance.done && instance.currentSeat !== 0) {
      await sleep(speed.value, token);
      if (token !== gen) return;
      if (!instance || instance.done || instance.currentSeat === 0) break;
      const seat = instance.currentSeat;
      const bot = bots.get(seat) ?? alwaysCallAgent;
      const action = bot.decide(instance.observe(seat));
      await applyActionPaced(action, token);
      if (token !== gen) return;
    }
    refresh();
  }

  function deal(preset: GamePreset, seed: number, stacks?: number[]): void {
    cancelAll();
    log.value = [];
    winners.value = [];
    pots.value = [];
    finalStacks.value = [];
    showdown.value = false;
    handStreets = preset.hand.streets ?? [];
    instance = new Table(preset.table, preset.hand, seed, onEvent, stacks);
    table.value = instance;
    // build the bot roster for seats 1..n (seat 0 is the human)
    bots.clear();
    const lineupOpt = LINEUPS.find((l) => l.name === lineup.value) ?? LINEUPS[0]!;
    const n = preset.table.seats.min;
    for (let seat = 1; seat < n; seat++) {
      bots.set(seat, buildBot(lineupOpt.seats(seat - 1), seed * 131 + seat, smartCfg.value));
    }
    push(`new hand · ${preset.table.gameId} · seed ${seed} · ${n} seats · ${lineupOpt.name}`);
    refresh();
    revealedCount.value = obs.value?.community.length ?? 0;
    void runBots();
  }

  function humanAct(action: Action): void {
    if (!instance || instance.done) return;
    const token = gen;
    void (async () => {
      await applyActionPaced(action, token);
      if (token !== gen) return;
      if (!instance?.done && instance.currentSeat !== 0) void runBots();
    })();
  }

  function stop(): void {
    cancelAll();
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
    smartCfg,
    revealedCommunity,
    showdown,
    deal,
    humanAct,
    stop,
  };
}
