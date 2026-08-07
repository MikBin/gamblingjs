<template>
  <div class="space-y-4">
    <!-- Status bar -->
    <div class="card bg-base-100 shadow">
      <div class="card-body !py-3 px-4">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span class="font-bold">🏇 Sit &amp; Go — 8-max HORSE (turbo)</span>
          <span v-if="current" class="font-semibold">Hand {{ current.handNumber }} / {{ totalHands }}</span>
          <span v-if="current" class="badge badge-primary badge-lg">{{ current.gameLabel }}</span>
          <span v-if="current" class="badge badge-outline">Level {{ current.levelIndex + 1 }} / {{ config.levels.length }}</span>
          <span v-if="current" class="opacity-80">
            blinds <b>{{ current.level.sb }}/{{ current.level.bb }}</b>
            <span v-if="current.level.ante > 0"> · ante <b>{{ current.level.ante }}</b></span>
            <span v-if="current.level.bringIn > 0"> · bring-in <b>{{ current.level.bringIn }}</b></span>
          </span>
          <span class="badge badge-ghost">{{ aliveCount }} alive</span>
          <span v-if="current?.voided" class="text-warning">⚠ voided hand</span>
        </div>
        <progress class="progress progress-primary w-full mt-2" :value="progress" max="100"></progress>
      </div>
    </div>

    <!-- Controls -->
    <div class="card bg-base-200 shadow">
      <div class="card-body !py-2 px-4 flex flex-wrap items-center gap-2">
        <label class="form-control">
          <span class="label-text text-xs">Seed</span>
          <input v-model.number="seedInput" type="number" class="input input-bordered input-sm w-24" />
        </label>
        <label class="form-control flex-1 min-w-40">
          <span class="label-text text-xs">Speed ({{ speed }}ms)</span>
          <input v-model.number="speed" type="range" min="120" max="2500" step="40" class="range range-xs" />
        </label>
        <button v-if="!result" class="btn btn-primary btn-sm" :disabled="simulating" @click="start">
          <span v-if="simulating" class="loading loading-spinner loading-xs"></span>
          {{ simulating ? 'Simulating…' : '▶ Start SNG' }}
        </button>
        <template v-else>
          <button v-if="!finished" class="btn btn-primary btn-sm" @click="playing ? pause() : resume()">
            {{ playing ? '⏸ Pause' : '▶ Play' }}
          </button>
          <button class="btn btn-sm" :disabled="index <= 0" @click="step(-1)">◀ Step</button>
          <button class="btn btn-sm" :disabled="finished" @click="step(1)">Step ▶</button>
          <button class="btn btn-sm" :disabled="finished" @click="jumpToEnd">⏭ Finish</button>
          <button class="btn btn-ghost btn-sm" @click="reset">↺ Reset</button>
        </template>
      </div>
    </div>

    <!-- Circular table felt -->
    <div v-if="result" class="table-wrap">
      <div class="felt"></div>

      <div class="center">
        <div class="flex gap-1 items-center min-h-[2.4rem]">
          <template v-if="liveObs">
            <span
              v-for="(c, i) in liveObs.community"
              :key="c"
              class="card-chip"
              :class="cardColor(c)"
              :style="{ animationDelay: i * 0.06 + 's' }"
            >{{ cardText(c) }}</span>
            <span v-if="liveObs.community.length === 0" class="opacity-40 text-sm">board</span>
          </template>
        </div>
        <div class="pot">
          <span class="opacity-70 text-[10px] uppercase tracking-wide mr-1">Pot</span>
          {{ livePot }}
        </div>
        <div class="turn-text">
          <span class="opacity-70">{{ liveObs?.streetName ?? '—' }}</span>
          ·
          <template v-if="liveShowdown">hand over</template>
          <template v-else-if="liveObs?.isTerminal || (liveObs?.actingSeat ?? 0) < 0">…</template>
          <template v-else>seat {{ liveObs?.actingSeat }} to act</template>
        </div>
      </div>

      <!-- Pot sliding to the winner(s) at showdown -->
      <div
        v-for="(chip, i) in potChips"
        :key="'fly' + i"
        class="fly-chip"
        :style="{ left: '50%', top: '50%', '--tx': chip.tx, '--ty': chip.ty, animationDelay: i * 0.12 + 's' }"
      >+{{ chip.amount }}<span v-if="chip.half" class="opacity-70"> {{ chip.half }}</span></div>

      <!-- Bet chips (in front of each seat) -->
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
          {{ s.name }}
          <span v-if="s.status === 'allin'" class="ai-badge">AI</span>
          <span v-else-if="s.status === 'folded'" class="fold-badge">FOLD</span>
        </div>
        <div class="cards">
          <span v-for="(c, j) in s.doors" :key="'u' + s.seat + '-' + c" class="mini-card mini-door" :class="cardColor(c)" :style="{ animationDelay: j * 0.1 + 's' }">{{ cardText(c) }}</span>
          <template v-for="(hc, j) in s.hole" :key="'h' + s.seat + '-' + j">
            <span class="hole-wrap" :style="{ animationDelay: j * 0.12 + 's' }">
              <span class="mini-hole" :class="{ revealed: hc.revealed }">
                <span class="side back">🂠</span>
                <span class="side face" :class="cardColor(hc.card)">{{ cardText(hc.card) }}</span>
              </span>
            </span>
          </template>
        </div>
        <div class="seat-stack">{{ s.stack }}</div>
      </div>
    </div>

    <!-- Simulating placeholder -->
    <div v-else-if="simulating" class="alert alert-info shadow">
      <span class="loading loading-spinner loading-sm"></span>
      <span>Running the full tournament simulation…</span>
    </div>
    <div v-else class="card bg-base-100 shadow">
      <div class="card-body items-center text-center">
        <span class="text-5xl">🏇</span>
        <p class="opacity-70">Press <b>Start SNG</b> to run a complete 8-handed HORSE Sit &amp; Go from start to finish.</p>
      </div>
    </div>

    <!-- Winner banner -->
    <div v-if="finished && winner" class="alert alert-success shadow text-lg">
      <span class="text-2xl">🏆</span>
      <span><b>{{ winner.name }}</b> wins the tournament! Final stack <b>{{ winner.stack }}</b></span>
    </div>

    <!-- Action log + standings -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="card bg-base-100 shadow">
        <div class="card-body !p-4">
          <h3 class="font-bold text-sm mb-1">Action log</h3>
          <div class="font-mono text-xs max-h-48 overflow-auto space-y-0.5">
            <div v-for="(line, i) in liveLog" :key="i">{{ line }}</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body !p-4">
          <details>
            <summary class="font-bold text-sm cursor-pointer">Full tournament log ({{ tournamentLog.length }} lines)</summary>
            <div ref="tournamentLogEl" class="font-mono text-xs max-h-64 overflow-auto space-y-0.5 mt-2">
              <div
                v-for="(line, i) in tournamentLog"
                :key="i"
                :class="{ 'font-semibold opacity-90': line.startsWith('—') }"
              >{{ line }}</div>
            </div>
          </details>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body !p-0 overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>#</th><th>Player</th><th class="text-right">Stack</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="s in standings"
                :key="s.id"
                :class="{ 'opacity-40': !s.alive }"
              >
                <td>
                  <span v-if="s.place" class="badge badge-sm" :class="placeClass(s.place)">{{ s.place }}</span>
                  <span v-else class="opacity-40">—</span>
                </td>
                <td>
                  {{ avatarOf(s.id) }} {{ s.name }}
                  <span v-if="s.id === current?.buttonId" class="badge badge-xs badge-secondary ml-1">D</span>
                </td>
                <td class="text-right font-mono">{{ s.stack }}</td>
                <td>
                  <span v-if="s.alive" class="badge badge-success badge-xs">in</span>
                  <span v-else class="badge badge-error badge-xs">out</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="finished && payouts.length" class="px-4 py-3 border-t">
            <div class="text-sm opacity-70 mb-1">Payouts (prize pool {{ config.startingStack * config.seats }})</div>
            <div v-for="p in payouts" :key="p.id" class="flex justify-between text-sm">
              <span>{{ placeLabel(p.place) }} — {{ nameOf(p.id) }}</span>
              <span class="font-mono">{{ p.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useSitAndGo } from '@composables/useSitAndGo';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['♠', '♦', '♥', '♣']; // encoding B: suit = floor(c/13), 0=spades…3=clubs

const {
  config,
  seedInput,
  speed,
  playing,
  simulating,
  finished,
  index,
  result,
  roster,
  totalHands,
  current,
  standings,
  progress,
  winner,
  payouts,
  aliveCount,
  liveObs,
  liveShowdown,
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
} = useSitAndGo();

interface SeatView {
  seat: number;
  name: string;
  stack: number;
  bet: number;
  status: string;
  doors: number[];
  hole: { card: number; revealed: boolean }[];
  isActor: boolean;
  isButton: boolean;
  folded: boolean;
  pos: { left: string; top: string };
  betPos: { left: string; top: string };
}

interface FlyChip {
  seat: number;
  amount: number;
  tx: string;
  ty: string;
  half?: string;
}

const seatCount = computed(() => current.value?.seatOrder.length ?? 0);
const seatOrder = computed(() => current.value?.seatOrder ?? []);
const showBets = computed(() => !liveShowdown.value);

// Place seats evenly around an ellipse; seat 0 (the button) sits at the bottom.
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
  const obs = liveObs.value;
  return Array.from({ length: n }, (_, seat) => {
    const [pos, betPos] = geometry(seat, n);
    const player = obs?.players.find((p) => p.seat === seat);
    const status = player?.status ?? '';
    const id = seatOrder.value[seat];
    return {
      seat,
      name: id !== undefined ? nameOf(id) : `seat ${seat}`,
      stack: player?.stack ?? 0,
      bet: player?.bet ?? 0,
      status,
      doors: obs?.up.find((u) => u.seat === seat)?.cards ?? [],
      hole: holeCardsOf(seat),
      isActor: obs?.actingSeat === seat && !obs.isTerminal,
      isButton: obs?.buttonSeat === seat,
      folded: status === 'folded',
      pos,
      betPos,
    };
  });
});

const betViews = computed(() => seatViews.value.filter((s) => s.bet > 0));

function seatClass(s: SeatView): Record<string, boolean> {
  return {
    'is-actor': s.isActor,
    'is-folded': s.folded,
  };
}

// Cumulative down cards dealt by the current street (hold'em 2, omaha 4,
// stud 2 + 1 on 7th street). Before showdown every hole card renders as a
// card back; at showdown they flip open one by one.
function holeCardsOf(seat: number): { card: number; revealed: boolean }[] {
  const streets = current.value?.replay?.hand.streets ?? [];
  const si = Math.min(liveObs.value?.streetIndex ?? 0, streets.length - 1);
  let count = 0;
  for (let i = 0; i <= si; i++) {
    count += streets[i]!.deal?.holeDown ?? 0;
  }
  if (liveShowdown.value && liveObs.value?.revealedHole) {
    const revealed = liveObs.value.revealedHole.find((u) => u.seat === seat);
    if (revealed) {
      return revealed.cards.map((c) => ({ card: c, revealed: true }));
    }
  }
  return Array.from({ length: count }, () => ({ card: 0, revealed: false }));
}

// Pot -> winner animation at showdown.
const potChips = ref<FlyChip[]>([]);
let potChipTimer: ReturnType<typeof setTimeout> | null = null;

// Keep the full tournament log pinned to the newest line.
const tournamentLogEl = ref<HTMLElement | null>(null);
watch(
  tournamentLog,
  () => {
    void nextTick(() => {
      tournamentLogEl.value?.scrollTo({ top: tournamentLogEl.value.scrollHeight });
    });
  },
  { flush: 'post' },
);
watch(liveShowdown, (on) => {
  if (potChipTimer) clearTimeout(potChipTimer);
  if (!on) {
    potChips.value = [];
    return;
  }
  const n = seatCount.value;
  const order = seatOrder.value;
  potChips.value = (current.value?.winners ?? [])
    .map((w) => {
      const seat = order.indexOf(w.id);
      if (seat < 0) return null;
      const [pos] = geometry(seat, n);
      return { seat, amount: w.amount, tx: pos.left, ty: pos.top, ...(w.half ? { half: w.half } : {}) };
    })
    .filter((c): c is FlyChip => c !== null);
  potChipTimer = setTimeout(() => {
    potChips.value = [];
  }, 1900);
});

function cardText(c: number): string {
  if (c === undefined) return '·';
  return RANKS[c % 13]! + SUITS[Math.floor(c / 13)]!;
}
function cardColor(c: number): string {
  if (c === undefined) return '';
  const s = Math.floor(c / 13);
  return s === 1 || s === 2 ? 'text-red-500' : 'text-base-content';
}

function avatarOf(id: number): string {
  return roster.value.find((r) => r.id === id)?.avatar ?? '·';
}
function placeClass(place: number): string {
  if (place === 1) return 'badge-warning';
  if (place <= 3) return 'badge-success';
  return 'badge-ghost';
}
function placeLabel(place: number): string {
  return `${place}${place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th'}`;
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
  align-items: center;
  margin: 2px 0;
  min-height: 21px;
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

/* Hole cards: card back until showdown, then a slow 3D flip opens them. */
.hole-wrap {
  display: inline-flex;
  animation: card-in 0.3s ease-out both;
}
.mini-hole {
  position: relative;
  width: 16px;
  height: 22px;
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;
}
.mini-hole .side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.mini-hole .side.back {
  background: repeating-linear-gradient(135deg, #1e3a8a 0 3px, #2547b8 3px 6px);
  color: #bfdbfe;
  border: 1px solid #172b6b;
}
.mini-hole .side.face {
  background: #fff;
  transform: rotateY(180deg);
}
.mini-hole.revealed {
  transform: rotateY(180deg);
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
