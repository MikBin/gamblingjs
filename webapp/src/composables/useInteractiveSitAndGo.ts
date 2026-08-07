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
  eightGameRotation,
  ensureHighHashes,
  fastHorseLevels,
  type Action,
  type GameEvent,
  type Observation,
  type PlayerAgent,
  type SitAndGoLevel,
  type SmartBotParams,
} from '@pokertable';
import { LINEUPS, SMART_DEFAULT, type BotProfile } from './usePokerTable';

export type Phase = 'config' | 'playing' | 'between' | 'finished';

export interface Player {
  id: number;
  name: string;
  avatar: string;
  profile: BotProfile | 'human';
  stack: number;
  alive: boolean;
  place: number | null;
}

const AVATARS = ['🧑', '🦊', '🐻', '🐺', '🦅', '🐱', '🐼', '🦁'];

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

let warmed = false;

export function useInteractiveSitAndGo() {
  if (!warmed) {
    ensureHighHashes();
    warmed = true;
  }

  // ---- Config (editable until start) ----
  const lineup = ref(LINEUPS[0]!.name);
  const speed = ref(750);
  const smartCfg = ref<Omit<SmartBotParams, 'seed'>>({ ...SMART_DEFAULT });
  const handsPerLevel = ref(6);
  const startingStack = ref(2000);
  const seed = ref(2024);
  const rotationCadence = ref<'hand' | 'level' | 'orbit'>('orbit');

  // ---- Tournament state ----
  const phase = ref<Phase>('config');
  const players = ref<Player[]>([]);
  const buttonId = ref(0);
  const levelIndex = ref(0);
  const gameIndex = ref(0);
  const handsAtLevel = ref(0);
  const orbitCounter = ref(0);
  const handNumber = ref(0);
  const tournamentLog = ref<string[]>([]);

  const levels = fastHorseLevels();
  const rotation = eightGameRotation();

  // ---- Current hand state ----
  const obs = ref<Observation | null>(null);
  const log = ref<string[]>([]);
  const seatOrder = ref<number[]>([]); // engine seat -> player id
  const humanSeat = ref(-1);
  const showdown = ref(false);
  const revealedCount = ref(Infinity);
  let handStreets: { deal?: { community?: number } }[] = [];
  let stepEvents: GameEvent[] = [];
  let instance: Table | null = null;
  const bots = new Map<number, PlayerAgent>(); // player id -> bot
  let preHandStacks: Map<number, number> = new Map();
  let lastDealtCommunity = 0;

  // ---- Timing ----
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

  // ---- Derived ----
  const done = computed(() => !!obs.value?.isTerminal);
  const humanTurn = computed(
    () => !!obs.value && obs.value.actingSeat === humanSeat.value && !done.value,
  );
  const humanActions = computed(() => (humanTurn.value ? obs.value?.legalActions ?? [] : []));
  const humanAlive = computed(() => players.value.find((p) => p.profile === 'human')?.alive ?? false);
  const level = computed<SitAndGoLevel>(() => levels[Math.min(levelIndex.value, levels.length - 1)]!);
  const game = computed(() => rotation[gameIndex.value % rotation.length]!);
  const aliveList = () => players.value.filter((p) => p.alive);
  const finished = computed(() => phase.value === 'finished');
  const winner = computed(() => players.value.find((p) => p.place === 1) ?? null);
  const handsToNextLevel = computed(() =>
    Math.max(0, handsPerLevel.value - handsAtLevel.value),
  );

  function push(line: string): void {
    log.value.push(line);
  }
  function tpush(line: string): void {
    tournamentLog.value.push(line);
  }

  function onEvent(e: GameEvent): void {
    stepEvents.push(e);
    if (e.type === 'dealt') push(`➤ deal ${e.streetIndex !== undefined ? e.streetIndex + 1 : ''}`);
    else if (e.type === 'betting-complete') push('➤ betting complete');
    else if (e.type === 'showdown') push('➤ showdown');
    else if (e.type === 'hand-ended') push('➤ hand complete');
  }

  function describe(a: Action): string {
    const id = seatOrder.value[a.seat] ?? a.seat;
    const who = id === 0 ? 'You' : players.value.find((p) => p.id === id)?.name ?? `Bot ${id}`;
    switch (a.type) {
      case 'fold':
        return `${who} folds`;
      case 'check':
        return `${who} checks`;
      case 'call':
        return `${who} calls ${a.amount}`;
      case 'bet':
        return `${who} bets ${a.amount}`;
      case 'raise':
        return `${who} raises to ${a.to}`;
      case 'allin':
        return `${who} is all-in (${a.amount})`;
      case 'discard':
        return `${who} discards ${a.discardIndices?.length ?? 0}`;
      default:
        return `${who}: ${a.type}`;
    }
  }

  function refresh(): void {
    if (!instance) return;
    const hs = humanSeat.value;
    obs.value = hs >= 0 ? instance.observe(hs) : instance.observe(0);
    if (instance.done) {
      showdown.value = true;
    }
  }

  const revealedCommunity = computed(() => {
    const c = obs.value?.community ?? [];
    const n = revealedCount.value;
    return n >= c.length ? c : c.slice(0, n);
  });

  function doStep(action: Action): { pre: number; dealtStreets: number[] } {
    if (!instance) return { pre: 0, dealtStreets: [] };
    const pre = obs.value?.community.length ?? 0;
    stepEvents = [];
    instance.step(action);
    push(describe(action));
    refresh();
    const dealtStreets = stepEvents.filter((e) => e.type === 'dealt').map((e) => e.streetIndex ?? 0);
    return { pre, dealtStreets };
  }

  async function paceReveal(d: { pre: number; dealtStreets: number[] }, token: number): Promise<void> {
    if (!d.dealtStreets.length) return;
    revealedCount.value = d.pre;
    let idx = d.pre;
    for (const si of d.dealtStreets) {
      await sleep(speed.value, token);
      if (token !== gen) return;
      idx += handStreets[si]?.deal?.community ?? 0;
      revealedCount.value = idx;
    }
  }

  async function applyActionPaced(action: Action, token: number): Promise<void> {
    const d = doStep(action);
    await paceReveal(d, token);
    if (token !== gen) return;
    if (instance?.done) {
      await sleep(speed.value, token);
      if (token !== gen) return;
      showdown.value = true;
    }
  }

  async function runBots(token: number): Promise<void> {
    while (instance && !instance.done && instance.currentSeat !== humanSeat.value) {
      await sleep(speed.value, token);
      if (token !== gen) return;
      if (!instance || instance.done || instance.currentSeat === humanSeat.value) break;
      const seat = instance.currentSeat;
      const pid = seatOrder.value[seat] ?? seat;
      const bot = bots.get(pid) ?? alwaysCallAgent;
      try {
        const action = bot.decide(instance.observe(seat));
        await applyActionPaced(action, token);
      } catch {
        voidHand();
        return;
      }
      if (token !== gen) return;
    }
    refresh();
    if (instance?.done) settleHand();
  }

  function nextAliveAfter(id: number): number {
    const alive = aliveList().map((p) => p.id);
    const i = alive.indexOf(id);
    for (let k = 1; k <= alive.length; k++) {
      const nid = alive[(i + k) % alive.length]!;
      if (nid !== id) return nid;
    }
    return id;
  }

  function dealNextHand(): void {
    if (phase.value === 'finished' || phase.value === 'config') return;
    cancelAll();
    const alive = aliveList();
    if (alive.length <= 1) {
      finish();
      return;
    }
    const lvl = level.value;
    const g = game.value;
    const n = alive.length;
    const aliveIds = alive.map((p) => p.id);
    const bpos = aliveIds.indexOf(buttonId.value);
    const order = bpos <= 0 ? aliveIds : [...aliveIds.slice(bpos), ...aliveIds.slice(0, bpos)];
    seatOrder.value = order;
    humanSeat.value = order.indexOf(0); // -1 if the human has busted
    const seatStacks = order.map((id) => players.value.find((p) => p.id === id)!.stack);
    preHandStacks = new Map(aliveIds.map((id) => [id, players.value.find((p) => p.id === id)!.stack]));
    handNumber.value++;
    const preset = g.build(lvl, n);
    const table = { ...preset.table, seats: { min: n, max: n } };
    handStreets = preset.hand.streets ?? [];
    log.value = [];
    showdown.value = false;
    const seedForHand = seed.value * 1_000_003 + handNumber.value * 997;
    try {
      instance = new Table(table, preset.hand, seedForHand, onEvent, seatStacks);
      lastDealtCommunity = 0;
      refresh();
      revealedCount.value = obs.value?.community.length ?? 0;
      tpush(
        `— Hand ${handNumber.value} · ${g.label} · Level ${levelIndex.value + 1} blinds ${lvl.sb}/${lvl.bb}` +
          `${lvl.ante > 0 ? ` ante ${lvl.ante}` : ''}${lvl.bringIn > 0 ? ` bring-in ${lvl.bringIn}` : ''} —`,
      );
      push(`new hand · ${g.label} · ${n} seats`);
      phase.value = 'playing';
      void runBots(gen);
    } catch {
      voidHand();
    }
  }

  function humanAct(action: Action): void {
    if (!instance || instance.done || !humanTurn.value) return;
    const token = gen;
    void (async () => {
      try {
        await applyActionPaced({ ...action, seat: humanSeat.value }, token);
      } catch {
        voidHand();
        return;
      }
      if (token !== gen) return;
      if (instance?.done) {
        settleHand();
      } else if (instance && instance.currentSeat !== humanSeat.value) {
        void runBots(token);
      }
    })();
  }

  function voidHand(): void {
    // Engine error (e.g. 8-handed Triple Draw drained the deck): revert stacks.
    preHandStacks.forEach((stk, id) => {
      const p = players.value.find((x) => x.id === id);
      if (p) p.stack = stk;
    });
    tpush(`Hand ${handNumber.value} voided (deck exhausted)`);
    instance = null;
    advanceTournament();
  }

  function settleHand(): void {
    if (!instance) return;
    const stacks = instance.stacks();
    seatOrder.value.forEach((pid, seat) => {
      const p = players.value.find((x) => x.id === pid);
      if (p) p.stack = Math.max(0, stacks[seat] ?? 0);
    });
    const elim: number[] = [];
    for (const pid of seatOrder.value) {
      const p = players.value.find((x) => x.id === pid)!;
      if (p.alive && p.stack <= 0) {
        p.alive = false;
        elim.push(pid);
      }
    }
    const aliveAfter = aliveList();
    const placeBase = aliveAfter.length;
    elim.sort((a, b) => a - b);
    elim.forEach((id, idx) => {
      const p = players.value.find((x) => x.id === id)!;
      p.place = placeBase + elim.length - idx;
      tpush(`${p.name} eliminated — ${p.place}${ord(p.place)} place`);
    });
    if (aliveAfter.length === 1) aliveAfter[0]!.place = 1;
    instance = null;
    advanceTournament();
  }

  function advanceTournament(): void {
    const alive = aliveList();
    if (alive.length <= 1) {
      finish();
      return;
    }
    // Button -> next live player.
    buttonId.value = nextAliveAfter(buttonId.value);
    // Blind level.
    handsAtLevel.value++;
    let leveled = false;
    if (handsAtLevel.value >= handsPerLevel.value && levelIndex.value < levels.length - 1) {
      levelIndex.value++;
      handsAtLevel.value = 0;
      leveled = true;
      tpush(`>>> Level ${levelIndex.value + 1}: blinds ${level.value.sb}/${level.value.bb}`);
    }
    // Game rotation per the configured cadence.
    if (rotationCadence.value === 'hand') {
      gameIndex.value = (gameIndex.value + 1) % rotation.length;
    } else if (rotationCadence.value === 'level' && leveled) {
      gameIndex.value = (gameIndex.value + 1) % rotation.length;
    } else {
      // orbit: rotate once the button makes a full lap.
      orbitCounter.value++;
      if (orbitCounter.value >= alive.length) {
        gameIndex.value = (gameIndex.value + 1) % rotation.length;
        orbitCounter.value = 0;
      }
    }
    void leveled;
    phase.value = 'between';
    // If the human has busted, auto-play the rest quickly so the tournament resolves.
    if (!humanAlive.value) {
      setTimeout(() => {
        speed.value = Math.min(speed.value, 220);
        dealNextHand();
      }, 400);
    }
  }

  function finish(): void {
    const alive = aliveList();
    if (alive.length === 1) alive[0]!.place = 1;
    phase.value = 'finished';
    const pp = startingStack.value * 8;
    tpush(`Tournament over. Winner: ${winner.value?.name ?? '—'} (prize pool ${pp})`);
    cancelAll();
  }

  function start(): void {
    cancelAll();
    const lineupOpt = LINEUPS.find((l) => l.name === lineup.value) ?? LINEUPS[0]!;
    players.value = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: i === 0 ? 'You' : `Bot ${i}`,
      avatar: AVATARS[i % AVATARS.length]!,
      profile: i === 0 ? 'human' : lineupOpt.seats(i - 1),
      stack: startingStack.value,
      alive: true,
      place: null,
    }));
    // Seed bots once (deterministic per seed).
    bots.clear();
    for (const p of players.value) {
      if (p.profile !== 'human')
        bots.set(p.id, buildBot(p.profile as BotProfile, seed.value + p.id * 17, smartCfg.value));
    }
    buttonId.value = 0;
    levelIndex.value = 0;
    gameIndex.value = 0;
    handsAtLevel.value = 0;
    orbitCounter.value = 0;
    handNumber.value = 0;
    tournamentLog.value = [];
    obs.value = null;
    log.value = [];
    phase.value = 'playing';
    dealNextHand();
  }

  function reset(): void {
    cancelAll();
    phase.value = 'config';
    players.value = [];
    obs.value = null;
    log.value = [];
    tournamentLog.value = [];
    instance = null;
  }

  return {
    // config
    lineup,
    speed,
    smartCfg,
    handsPerLevel,
    startingStack,
    seed,
    rotationCadence,
    lineups: LINEUPS,
    // state
    phase,
    players,
    level,
    game,
    levelIndex,
    handNumber,
    handsToNextLevel,
    seatOrder,
    humanSeat,
    humanAlive,
    humanTurn,
    humanActions,
    obs,
    log,
    tournamentLog,
    showdown,
    revealedCommunity,
    finished,
    winner,
    // actions
    start,
    reset,
    dealNextHand,
    humanAct,
  };
}

function ord(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? s[0]!;
}
