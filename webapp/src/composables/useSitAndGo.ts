import { ref, computed, shallowRef } from 'vue';
import {
  ensureHighHashes,
  runSitAndGo,
  fastHorseLevels,
  eightGameRotation,
  createRandomAgent,
  createAggressiveAgent,
  createManiacAgent,
  createCallingStationAgent,
  createTightAgent,
  replayHandSteps,
  type PlayerAgent,
  type SitAndGoConfig,
  type SitAndGoResult,
  type SngPlayerInput,
  type HandSummary,
  type Observation,
  type Action,
} from '@pokertable';

export interface SngPlayerMeta {
  id: number;
  name: string;
  avatar: string;
}

const CYCLE: ((seed: number) => PlayerAgent)[] = [
  createRandomAgent,
  createAggressiveAgent,
  createManiacAgent,
  createCallingStationAgent,
  createTightAgent,
];

// A deliberately fast 8-handed 8-Game turbo: the full WSOP mix (2-7 Triple Draw,
// FL Hold'em, FL Omaha Hi/Lo, Razz, Stud, Stud Hi/Lo, NL Hold'em, PLO). Blinds
// grow every `handsPerLevel` hands; the game rotates once per orbit.
export function defaultSngConfig(seed = 2024): SitAndGoConfig {
  return {
    seats: 8,
    startingStack: 3000,
    levels: fastHorseLevels(),
    handsPerLevel: 5,
    rotation: eightGameRotation(),
    rotationCadence: 'orbit',
    payouts: [0.5, 0.3, 0.2],
    seed,
  };
}

let warmed = false;

export function useSitAndGo() {
  if (!warmed) {
    ensureHighHashes();
    warmed = true;
  }

  const config = ref(defaultSngConfig());
  const seedInput = ref(2024);
  const speed = ref(2100); // pacing in ms; ~3x slower so each action is watchable
  const playing = ref(false);
  const simulating = ref(false);
  const finished = ref(false);
  const index = ref(0); // current hand being shown
  const result = shallowRef<SitAndGoResult | null>(null);
  const roster = ref<SngPlayerMeta[]>([]);

  // ---- Live hand animation state (driven by replaying the current hand) ----
  const liveObs = shallowRef<Observation | null>(null);
  const liveShowdown = ref(false); // hole cards flip open
  const liveHandOver = ref(false); // current hand's animation completed
  const liveLog = ref<string[]>([]);
  const livePot = computed(() => liveObs.value?.pot ?? 0);
  // Full tournament action log: every hand's actions are kept (with hand/game
  // context), so bet sizes and all-ins can be audited after the fact.
  const tournamentLog = ref<string[]>([]);
  let lastLoggedHand = -1;

  // Cancellable playback loop (token pattern).
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

  const history = computed<HandSummary[]>(() => result.value?.history ?? []);
  const totalHands = computed(() => history.value.length);
  const current = computed<HandSummary | null>(() => history.value[index.value] ?? null);
  const standings = computed(() => current.value?.standings ?? []);
  const progress = computed(() =>
    totalHands.value ? Math.round(((index.value + 1) / totalHands.value) * 100) : 0,
  );
  const winner = computed(() => result.value?.winner ?? null);
  const payouts = computed(() => result.value?.payouts ?? []);
  const aliveCount = computed(() => standings.value.filter((s) => s.alive).length);

  function nameOf(id: number): string {
    return roster.value.find((r) => r.id === id)?.name ?? `#${id}`;
  }

  function formatAction(a: Action, seatOrder: number[]): string {
    const name = nameOf(seatOrder[a.seat] ?? a.seat);
    switch (a.type) {
      case 'fold':
        return `${name} folds`;
      case 'check':
        return `${name} checks`;
      case 'call':
        return `${name} calls${a.amount !== undefined ? ` ${a.amount}` : ''}`;
      case 'bet':
        return `${name} bets ${a.amount}`;
      case 'raise':
        return `${name} raises to ${a.to}`;
      case 'allin':
        return `${name} is all-in${a.amount !== undefined ? ` ${a.amount}` : ''}`;
      case 'discard':
        return `${name} discards ${a.discardIndices?.length ?? 0}`;
      default:
        return `${name} ${a.type}`;
    }
  }

  function buildLineup(cfg: SitAndGoConfig): { players: SngPlayerInput[]; meta: SngPlayerMeta[] } {
    const players: SngPlayerInput[] = [];
    const meta: SngPlayerMeta[] = [];
    const avatars = ['🦊', '🐻', '🐺', '🦅', '🐱', '🐼', '🦁', '🐯'];
    for (let i = 0; i < cfg.seats; i++) {
      const name = `Bot ${i + 1}`;
      players.push({ id: i, name, agent: CYCLE[i % CYCLE.length]!(cfg.seed + i * 7) });
      meta.push({ id: i, name, avatar: avatars[i % avatars.length]! });
    }
    return { players, meta };
  }

  /**
   * Replay one settled hand through the real engine (recorded action log) and
   * animate it step by step: deal events pop cards in, actions stream into the
   * log, and the showdown flips the hole-card backs open. Deterministic — same
   * hand, same animation, every time.
   */
  async function animateHand(h: HandSummary): Promise<boolean> {
    const token = gen;
    liveObs.value = null;
    liveShowdown.value = false;
    liveHandOver.value = false;
    liveLog.value = [];
    const r = h.replay;
    if (!r) return true;

    // Capture the full step list up front (fast), then animate it.
    const steps = replayHandSteps(r.table, r.hand, r.seed, r.actions, r.seatStacks);
    const seatOrder = h.seatOrder;

    // Keep every action in the tournament log (once per hand, even when the
    // hand is re-watched via Step).
    const alreadyLogged = lastLoggedHand === h.handNumber;
    if (!alreadyLogged) {
      lastLoggedHand = h.handNumber;
      tournamentLog.value.push(
        `— Hand ${h.handNumber} · ${h.gameLabel} · Level ${h.levelIndex + 1} blinds ${h.level.sb}/${h.level.bb}` +
          `${h.level.ante > 0 ? ` ante ${h.level.ante}` : ''}` +
          `${h.level.bringIn > 0 ? ` bring-in ${h.level.bringIn}` : ''} —`,
      );
    }

    liveObs.value = steps[0]!.obs;
    if (token !== gen) return false;
    await sleep(Math.max(320, speed.value * 0.6), token); // initial deal pop-in
    if (token !== gen) return false;

    for (let i = 1; i < steps.length; i++) {
      if (token !== gen) return false;
      const { events, obs } = steps[i]!;
      liveObs.value = obs;
      const actionEv = events.find((e) => e.type === 'action');
      if (actionEv && actionEv.type === 'action') {
        const line = formatAction(actionEv.action, seatOrder);
        liveLog.value.push(line);
        if (!alreadyLogged) tournamentLog.value.push(`H${h.handNumber}: ${line}`);
      }
      if (events.some((e) => e.type === 'dealt')) {
        // New street: the freshly dealt cards animate in (staggered).
        await sleep(Math.max(280, speed.value * 0.55), token);
      }
      if (events.some((e) => e.type === 'betting-complete')) {
        await sleep(Math.max(160, speed.value * 0.3), token);
      }
      if (events.some((e) => e.type === 'showdown')) {
        // Flip the hole cards open immediately — the sleep below lets the slow
        // flip + pot-slide animation complete.
        liveShowdown.value = true;
        await sleep(Math.max(1150, speed.value * 1.25), token);
      }
      if (token !== gen) return false;
      await sleep(Math.max(120, speed.value * 0.25), token);
    }

    if (!liveShowdown.value) {
      // Fold-out finish: reveal the survivor's cards briefly anyway.
      liveShowdown.value = true;
      if (token !== gen) return false;
      await sleep(Math.max(700, speed.value * 0.9), token);
    }
    if (token !== gen) return false;
    liveHandOver.value = true;
    return true;
  }

  async function play(): Promise<void> {
    const token = gen;
    playing.value = true;
    while (index.value < totalHands.value - 1) {
      const ok = await animateHand(history.value[index.value]!);
      if (!ok || token !== gen) return;
      await sleep(Math.max(320, speed.value * 0.4), token);
      if (token !== gen) return;
      index.value++;
    }
    const last = history.value[index.value];
    if (last) {
      const ok = await animateHand(last);
      if (!ok || token !== gen) return;
    }
    playing.value = false;
    finished.value = true;
  }

  // Simulate the whole tournament synchronously (fast), then play it back.
  function start(): void {
    cancelAll();
    playing.value = false;
    finished.value = false;
    simulating.value = true;
    result.value = null;
    index.value = 0;
    liveObs.value = null;
    liveLog.value = [];
    tournamentLog.value = [];
    lastLoggedHand = -1;
    const cfg = defaultSngConfig(seedInput.value);
    config.value = cfg;
    // Defer the synchronous sim one tick so the UI can paint "simulating".
    setTimeout(() => {
      const { players, meta } = buildLineup(cfg);
      roster.value = meta;
      result.value = runSitAndGo(cfg, players);
      simulating.value = false;
      index.value = 0;
      void play();
    }, 30);
  }

  function pause(): void {
    cancelAll();
    playing.value = false;
  }

  function resume(): void {
    if (!result.value || finished.value) return;
    void play();
  }

  function step(dir: 1 | -1): void {
    cancelAll();
    playing.value = false;
    const next = index.value + dir;
    if (next < 0 || next >= totalHands.value) return;
    index.value = next;
    finished.value = false;
    void animateHand(history.value[next]!);
  }

  function jumpToEnd(): void {
    cancelAll();
    playing.value = false;
    index.value = totalHands.value - 1;
    void animateHand(history.value[index.value]!).then((ok) => {
      if (ok) finished.value = true;
    });
  }

  function reset(): void {
    cancelAll();
    playing.value = false;
    finished.value = false;
    simulating.value = false;
    result.value = null;
    index.value = 0;
    roster.value = [];
    liveObs.value = null;
    liveShowdown.value = false;
    liveLog.value = [];
    tournamentLog.value = [];
    lastLoggedHand = -1;
  }

  return {
    config,
    seedInput,
    speed,
    playing,
    simulating,
    finished,
    index,
    result,
    roster,
    history,
    totalHands,
    current,
    standings,
    progress,
    winner,
    payouts,
    aliveCount,
    liveObs,
    liveShowdown,
    liveHandOver,
    liveLog,
    livePot,
    tournamentLog,
    nameOf,
    start,
    pause,
    resume,
    step,
    jumpToEnd,
    reset,
  };
}
