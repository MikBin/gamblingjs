<template>
  <div class="space-y-4">
    <!-- Config bar -->
    <div class="card bg-base-200 shadow">
      <div class="card-body grid gap-3 md:grid-cols-7">
        <label class="form-control">
          <span class="label-text text-xs">Game</span>
          <select v-model="presetName" class="select select-bordered select-sm" :disabled="!done && obs !== null">
            <option v-for="p in PRESETS" :key="p.name">{{ p.name }}</option>
          </select>
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Bot lineup</span>
          <select v-model="lineup" class="select select-bordered select-sm">
            <option v-for="l in LINEUPS" :key="l.name">{{ l.name }}</option>
          </select>
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Seats</span>
          <div class="join">
            <input v-model.number="seats" type="number" min="2" max="8" class="input input-bordered input-sm join-item w-20" />
            <button class="btn btn-sm join-item" @click="seats = 6">6-max</button>
          </div>
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Stack (e.g. 200,60,30)</span>
          <input v-model="stacksText" class="input input-bordered input-sm" placeholder="200" />
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Seed</span>
          <input v-model.number="seed" type="number" class="input input-bordered input-sm" />
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Bot delay (ms)</span>
          <input v-model.number="speed" type="range" min="150" max="2500" step="50" class="range range-xs mt-2" />
        </label>
        <template v-if="lineup === 'Smart bots' || lineup === 'Smart + classic mix'">
          <label class="form-control">
            <span class="label-text text-xs">Smart aggression: {{ smartCfg.aggression }}</span>
            <input v-model.number="smartCfg.aggression" type="range" min="0" max="1" step="0.05" class="range range-xs mt-2" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Smart tightness: {{ smartCfg.tightness }}</span>
            <input v-model.number="smartCfg.tightness" type="range" min="0" max="1" step="0.05" class="range range-xs mt-2" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Bluffiness: {{ smartCfg.bluffiness }}</span>
            <input v-model.number="smartCfg.bluffiness" type="range" min="0" max="0.5" step="0.02" class="range range-xs mt-2" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Bet sizing (× pot): {{ smartCfg.sizing }}</span>
            <input v-model.number="smartCfg.sizing" type="range" min="0.2" max="1.5" step="0.05" class="range range-xs mt-2" />
          </label>
        </template>
        <div class="flex items-end gap-2">
          <button class="btn btn-primary btn-sm flex-1" @click="onDeal">Deal hand</button>
        </div>
      </div>
    </div>

    <!-- Circular table felt -->
    <div class="table-wrap">
      <div class="felt"></div>

      <!-- Center: community cards + pot + turn -->
      <div class="center">
        <div class="flex gap-1 items-center min-h-[2.4rem]">
          <template v-if="obs">
            <span
              v-for="(c, i) in revealedCommunity"
              :key="c"
              class="card-chip"
              :class="cardColor(c)"
              :style="{ animationDelay: i * 0.06 + 's' }"
            >{{ cardText(c) }}</span>
            <span v-if="revealedCommunity.length === 0" class="opacity-40 text-sm">board</span>
          </template>
        </div>
        <div class="pot">
          <span class="opacity-70 text-[10px] uppercase tracking-wide mr-1">Pot</span>
          {{ obs?.pot ?? 0 }}
        </div>
        <div class="turn-text">
          <span class="opacity-70">{{ obs?.streetName ?? '—' }}</span>
          ·
          <template v-if="showdown">hand over</template>
          <template v-else-if="done">…</template>
          <template v-else-if="humanTurn"><span class="text-yellow-300 font-semibold">your action</span></template>
          <template v-else>seat {{ obs?.actingSeat }} to act</template>
        </div>
      </div>

      <!-- Pot sliding to the winner(s) at showdown -->
      <div
        v-for="(chip, i) in potChips"
        :key="'fly' + i"
        class="fly-chip"
        :style="{ left: '50%', top: '50%', '--tx': chip.tx, '--ty': chip.ty, animationDelay: i * 0.12 + 's' }"
      >+{{ chip.amount }}<span v-if="chip.half" class="opacity-70"> {{ chip.half }}</span></div>

      <!-- Bet chips (in front of each seat, toward the center) -->
      <template v-if="showBets">
        <div
          v-for="b in betViews"
          :key="'bet' + b.seat"
          class="bet-chip"
          :style="b.betPos"
        >{{ b.bet }}</div>
      </template>

      <!-- Seats around the rail -->
      <div
        v-for="s in seatViews"
        :key="s.seat"
        class="seat"
        :class="seatClass(s)"
        :style="s.pos"
      >
        <span v-if="s.isButton" class="dealer" title="dealer button">D</span>
        <div class="seat-name">
          {{ s.isYou ? 'You' : `Bot ${s.seat}` }}
          <span v-if="s.status === 'allin'" class="ai-badge">AI</span>
          <span v-else-if="s.status === 'folded'" class="fold-badge">FOLD</span>
        </div>
        <div class="cards">
          <span v-for="c in s.doors" :key="'u' + c" class="mini-card mini-door" :class="cardColor(c)">{{ cardText(c) }}</span>
          <template v-if="s.hole.length">
            <span v-for="c in s.hole" :key="'h' + c" class="mini-card" :class="cardColor(c)">{{ cardText(c) }}</span>
          </template>
          <span v-else-if="s.seat !== 0 && !done" class="mini-card mini-back">🂠</span>
        </div>
        <div class="seat-stack">{{ s.stack }}</div>
      </div>
    </div>

    <!-- Human action panel -->
    <div v-if="humanTurn" class="card bg-base-200 shadow">
      <div class="card-body flex-row flex-wrap items-center gap-2">
        <span class="text-sm font-semibold mr-2">Your move (to call {{ obs?.toCall }}):</span>
        <button v-if="has('fold')" class="btn btn-error btn-sm" @click="doAction(find('fold')!)">Fold</button>
        <button v-if="has('check')" class="btn btn-sm" @click="doAction(find('check')!)">Check</button>
        <button v-if="has('call')" class="btn btn-sm" @click="doAction(find('call')!)">Call {{ find('call')?.amount }}</button>
        <template v-if="has('bet') || has('raise')">
          <input v-model.number="betAmt" type="number" class="input input-bordered input-sm w-28" />
          <button v-if="has('bet')" class="btn btn-sm" @click="doBetOrRaise('bet')">Bet</button>
          <button v-if="has('raise')" class="btn btn-primary btn-sm" @click="doBetOrRaise('raise')">Raise to</button>
          <span class="text-xs opacity-70">{{ rangeLabel }}</span>
        </template>
        <button v-if="has('allin')" class="btn btn-warning btn-sm" @click="doAction(find('allin')!)">All-in</button>
      </div>
    </div>

    <!-- Showdown summary -->
    <div v-if="showdown" class="card bg-base-200 shadow">
      <div class="card-body">
        <h3 class="font-bold">Result</h3>
        <div class="flex flex-wrap gap-4 text-sm">
          <div>
            <div class="text-xs uppercase opacity-60">Winners</div>
            <ul class="font-mono">
              <li v-for="(w, i) in winners" :key="i">seat {{ w.seat }}: +{{ w.amount }}<span v-if="w.half"> ({{ w.half }})</span></li>
            </ul>
          </div>
          <div v-if="pots.length > 1">
            <div class="text-xs uppercase opacity-60">Pots</div>
            <ul class="font-mono">
              <li v-for="(p, i) in pots" :key="i">pot {{ i + 1 }}: {{ p.amount }} → seats {{ p.winners.join(',') }}</li>
            </ul>
          </div>
          <div>
            <div class="text-xs uppercase opacity-60">Final stacks</div>
            <div class="font-mono">{{ finalStacks.join(' · ') }} (Σ {{ stackSum }})</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action log -->
    <div class="card bg-base-200 shadow">
      <div class="card-body">
        <h3 class="font-bold text-sm">Action log</h3>
        <div class="font-mono text-xs max-h-48 overflow-auto space-y-0.5">
          <div v-for="(line, i) in log" :key="i">{{ line }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PRESETS, LINEUPS, usePokerTable } from '@/composables/usePokerTable';
import type { Action } from '@pokertable';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['♠', '♦', '♥', '♣']; // encoding B: suit = floor(c/13), 0=spades…3=clubs

const presetName = ref(PRESETS[0]!.name);
const seats = ref(6);
const stacksText = ref('200');
const seed = ref(42);
const betAmt = ref(0);

const { obs, log, winners, pots, finalStacks, done, humanTurn, humanActions, lineup, smartCfg, speed, revealedCommunity, showdown, deal, humanAct } =
  usePokerTable();

const seatCount = computed(() => obs.value?.players.length ?? seats.value);
const seatsList = computed(() => Array.from({ length: seatCount.value }, (_, i) => i));
const stackSum = computed(() => finalStacks.value.reduce((a, b) => a + b, 0));
const rangeLabel = computed(() => {
  const a = find('bet') ?? find('raise');
  if (!a) return '';
  return `[${a.min}–${a.max}]`;
});

interface SeatView {
  seat: number;
  isYou: boolean;
  stack: number;
  bet: number;
  status: string;
  doors: number[];
  hole: number[];
  isActor: boolean;
  isButton: boolean;
  folded: boolean;
  pos: { left: string; top: string };
  betPos: { left: string; top: string };
}

// Place seats evenly around an ellipse; seat 0 (the human) sits at the bottom.
function geometry(seat: number, n: number): { left: string; top: string }[] {
  const rx = 42;
  const ry = 39;
  const ang = ((90 + (seat * 360) / n) * Math.PI) / 180;
  const cx = (r: number) => 50 + r * Math.cos(ang);
  const cy = (r: number) => 50 + r * Math.sin(ang);
  return [
    { left: `${cx(rx)}%`, top: `${cy(ry)}%` },
    { left: `${cx(rx * 0.5)}%`, top: `${cy(ry * 0.5)}%` },
  ];
}

const seatViews = computed<SeatView[]>(() => {
  const n = seatCount.value;
  return seatsList.value.map((seat) => {
    const [pos, betPos] = geometry(seat, n);
    const player = playerOf(seat);
    const status = player?.status ?? '';
    return {
      seat,
      isYou: seat === 0,
      stack: player?.stack ?? 0,
      bet: player?.bet ?? 0,
      status,
      doors: doorsOf(seat),
      hole: holeOf(seat),
      isActor: obs.value?.actingSeat === seat && !done.value,
      isButton: obs.value?.buttonSeat === seat,
      folded: status === 'folded',
      pos,
      betPos,
    };
  });
});

const betViews = computed(() => seatViews.value.filter((s) => s.bet > 0));
const showBets = computed(() => !showdown.value);

// Pot -> winner animation: when the finale plays, spawn one flying chip per
// winner that slides from the center to the winner's seat.
interface FlyChip {
  seat: number;
  amount: number;
  tx: string;
  ty: string;
  half?: string;
}
const potChips = ref<FlyChip[]>([]);
let potChipTimer: ReturnType<typeof setTimeout> | null = null;
watch(showdown, (on) => {
  if (potChipTimer) clearTimeout(potChipTimer);
  if (!on) {
    potChips.value = [];
    return;
  }
  const n = seatCount.value;
  potChips.value = winners.value.map((w) => {
    const [pos] = geometry(w.seat, n);
    return { seat: w.seat, amount: w.amount, tx: pos.left, ty: pos.top, half: w.half };
  });
  potChipTimer = setTimeout(() => {
    potChips.value = [];
  }, 1700);
});

watch(humanActions, (acts) => {
  const a = acts.find((x) => x.type === 'raise') ?? acts.find((x) => x.type === 'bet');
  if (a) betAmt.value = a.min ?? 0;
});

function cardText(c: number): string {
  return RANKS[c % 13]! + SUITS[Math.floor(c / 13)]!;
}
function cardColor(c: number): string {
  const s = Math.floor(c / 13);
  return s === 1 || s === 2 ? 'text-red-500' : 'text-base-content';
}

function playerOf(seat: number) {
  return obs.value?.players.find((p) => p.seat === seat);
}
function doorsOf(seat: number): number[] {
  return obs.value?.up.find((u) => u.seat === seat)?.cards ?? [];
}
function holeOf(seat: number): number[] {
  if (seat === 0) return obs.value?.myHole ?? [];
  if (showdown.value) return obs.value?.revealedHole?.find((u) => u.seat === seat)?.cards ?? [];
  return [];
}
function seatClass(s: SeatView): Record<string, boolean> {
  return {
    'is-actor': s.isActor,
    'is-you': s.isYou,
    'is-folded': s.folded,
  };
}

function has(type: Action['type']): boolean {
  return !!humanActions.value.find((a) => a.type === type);
}
function find(type: Action['type']): Action | undefined {
  return humanActions.value.find((a) => a.type === type);
}
function doAction(a: Action): void {
  humanAct({ ...a });
}
function doBetOrRaise(type: 'bet' | 'raise'): void {
  const a = find(type);
  if (!a) return;
  const v = Math.max(a.min ?? 0, Math.min(betAmt.value, a.max ?? betAmt.value));
  humanAct({ ...a, ...(type === 'bet' ? { amount: v } : { to: v }) });
}

function onDeal(): void {
  const preset = PRESETS.find((p) => p.name === presetName.value)!;
  const parsed = stacksText.value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
  let stacks: number[] | undefined;
  let n = seats.value;
  if (parsed.length >= 2) {
    stacks = parsed;
    n = parsed.length;
    seats.value = n;
  }
  const built = preset.build(n, parsed.length === 1 ? parsed[0]! : 200);
  deal(built, seed.value, stacks);
}
</script>

<style scoped>
/* ---- Table geometry ---- */
.table-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  max-width: 1080px;
  margin-inline: auto;
}
.felt {
  position: absolute;
  inset: 9% 8%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, #1a7a43 0%, #166534 55%, #11452b 100%);
  border: 12px solid #3b2517;
  box-shadow: inset 0 0 70px rgba(0, 0, 0, 0.5), 0 12px 30px rgba(0, 0, 0, 0.45);
}

/* ---- Center pot + board ---- */
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.pot {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ecfccb;
  padding: 2px 14px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 15px;
}
.turn-text {
  color: #d1fae5;
  font-size: 11px;
  opacity: 0.85;
}

/* ---- Seats ---- */
.seat {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 74px;
  padding: 4px 6px 3px;
  border-radius: 10px;
  background: rgba(6, 46, 23, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #dcfce7;
  text-align: center;
  font-size: 11px;
  line-height: 1.1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
  z-index: 2;
}
.seat-name {
  font-weight: 700;
  white-space: nowrap;
}
.seat-stack {
  font-family: ui-monospace, monospace;
  font-size: 10px;
  opacity: 0.8;
}
.seat.is-you {
  border-color: rgba(253, 224, 71, 0.55);
}
.seat.is-folded {
  opacity: 0.38;
  filter: grayscale(0.6);
}
.seat.is-actor {
  border-color: #fde047;
  transform: translate(-50%, -50%) scale(1.08);
  animation: actor-pulse 1s ease-in-out infinite;
  z-index: 3;
}
@keyframes actor-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2px #fde047, 0 0 14px 3px rgba(253, 224, 71, 0.55);
  }
  50% {
    box-shadow: 0 0 0 2px #fde047, 0 0 26px 9px rgba(253, 224, 71, 0.9);
  }
}

.dealer {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  color: #000;
  font-weight: 800;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.55);
}
.ai-badge,
.fold-badge {
  font-size: 8px;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 4px;
  margin-left: 2px;
  vertical-align: middle;
}
.ai-badge {
  background: #fca5a5;
  color: #7f1d1d;
}
.fold-badge {
  background: #6b7280;
  color: #f9fafb;
}

/* ---- Cards ---- */
.cards {
  display: flex;
  gap: 2px;
  justify-content: center;
  margin: 2px 0;
  min-height: 18px;
}
.mini-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 3px;
  padding: 0 2px;
  min-width: 14px;
  font-size: 11px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  animation: card-in 0.3s ease-out both;
}
.mini-door {
  background: #fef3c7;
}
.mini-back {
  background: #1e3a8a;
  color: #bfdbfe;
}

/* ---- Bet chips ---- */
.bet-chip {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 2px 8px;
  border-radius: 9999px;
  background: linear-gradient(#fde68a, #f59e0b);
  color: #78350f;
  border: 1px solid #b45309;
  font-weight: 800;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  z-index: 1;
}

/* ---- Board community cards ---- */
.card-chip {
  @apply inline-flex items-center justify-center bg-white rounded px-1.5 py-0.5 text-sm font-bold shadow;
  min-width: 1.6rem;
  font-family: ui-monospace, monospace;
  animation: card-in 0.25s ease-out both;
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(-7px) rotate(-10deg) scale(0.7);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ---- Pot -> winner slide ---- */
.fly-chip {
  position: absolute;
  z-index: 6;
  padding: 3px 11px;
  border-radius: 9999px;
  background: linear-gradient(#fde68a, #f59e0b);
  color: #78350f;
  border: 1px solid #b45309;
  font-weight: 800;
  font-size: 13px;
  font-family: ui-monospace, monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: fly-pot 0.95s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
@keyframes fly-pot {
  0% {
    left: 50%;
    top: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  18% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }
  100% {
    left: var(--tx);
    top: var(--ty);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
