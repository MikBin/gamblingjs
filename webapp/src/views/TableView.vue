<template>
  <div class="space-y-4">
    <!-- Config bar -->
    <div class="card bg-base-200 shadow">
      <div class="card-body grid gap-3 md:grid-cols-6">
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
          <span class="label-text text-xs">Stack (or stacks e.g. 200,60,30)</span>
          <input v-model="stacksText" class="input input-bordered input-sm" placeholder="200" />
        </label>
        <label class="form-control">
          <span class="label-text text-xs">Seed</span>
          <input v-model.number="seed" type="number" class="input input-bordered input-sm" />
        </label>
        <div class="flex items-end gap-2">
          <button class="btn btn-primary btn-sm flex-1" @click="onDeal">Deal hand</button>
        </div>
      </div>
    </div>

    <!-- Table felt -->
    <div class="card bg-green-900 text-green-50 shadow-lg">
      <div class="card-body">
        <!-- Community + pot -->
        <div class="flex items-center justify-between">
          <div class="flex gap-1 items-center min-h-[3rem]">
            <span class="text-xs uppercase opacity-70 mr-2">Board</span>
            <template v-if="obs">
              <span v-for="c in obs.community" :key="c" class="card-chip" :class="cardColor(c)">{{ cardText(c) }}</span>
              <span v-if="obs.community.length === 0" class="opacity-40">—</span>
            </template>
          </div>
          <div class="text-right">
            <div class="text-xs uppercase opacity-70">Pot</div>
            <div class="text-xl font-bold">{{ obs?.pot ?? 0 }}</div>
          </div>
        </div>

        <!-- Seats -->
        <div class="grid gap-2 mt-2" :style="`grid-template-columns: repeat(${seatCount}, minmax(0,1fr))`">
          <div
            v-for="seat in seatsList"
            :key="seat"
            class="rounded-lg p-2 border"
            :class="seatClasses(seat)"
          >
            <div class="flex justify-between text-xs">
              <span class="font-semibold">{{ seat === 0 ? 'You' : `Bot ${seat}` }}</span>
              <span class="opacity-80">{{ statusOf(seat) }}</span>
            </div>
            <div class="text-sm font-mono">stack {{ stackOf(seat) }} · bet {{ betOf(seat) }}</div>
            <div class="flex gap-1 mt-1 min-h-[2rem]">
              <span v-for="c in doorsOf(seat)" :key="'u' + c" class="card-chip card-chip-door" :class="cardColor(c)">{{ cardText(c) }}</span>
            </div>
            <div class="flex gap-1 mt-1 min-h-[2rem]">
              <template v-if="holeOf(seat).length">
                <span v-for="c in holeOf(seat)" :key="'h' + c" class="card-chip" :class="cardColor(c)">{{ cardText(c) }}</span>
              </template>
              <span v-else-if="seat !== 0 && !done" class="card-chip card-chip-back">🂠</span>
            </div>
          </div>
        </div>

        <!-- Street / turn indicator -->
        <div class="text-center text-xs uppercase tracking-wide opacity-80 mt-1">
          {{ obs?.streetName ?? '—' }} ·
          <template v-if="done">hand over</template>
          <template v-else-if="humanTurn">your action</template>
          <template v-else>seat {{ obs?.actingSeat }} to act</template>
        </div>
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
    <div v-if="done" class="card bg-base-200 shadow">
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
const seats = ref(2);
const stacksText = ref('200');
const seed = ref(42);
const betAmt = ref(0);

const { obs, log, winners, pots, finalStacks, done, humanTurn, humanActions, lineup, deal, humanAct } =
  usePokerTable();

const seatCount = computed(() => obs.value?.players.length ?? seats.value);
const seatsList = computed(() => Array.from({ length: seatCount.value }, (_, i) => i));
const stackSum = computed(() => finalStacks.value.reduce((a, b) => a + b, 0));
const rangeLabel = computed(() => {
  const a = find('bet') ?? find('raise');
  if (!a) return '';
  return `[${a.min}–${a.max}]`;
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
function stackOf(seat: number): number {
  return playerOf(seat)?.stack ?? 0;
}
function betOf(seat: number): number {
  return playerOf(seat)?.bet ?? 0;
}
function statusOf(seat: number): string {
  return playerOf(seat)?.status ?? '';
}
function doorsOf(seat: number): number[] {
  return obs.value?.up.find((u) => u.seat === seat)?.cards ?? [];
}
function holeOf(seat: number): number[] {
  if (seat === 0) return obs.value?.myHole ?? [];
  if (done.value) return obs.value?.revealedHole?.find((u) => u.seat === seat)?.cards ?? [];
  return [];
}
function seatClasses(seat: number): string {
  const isActor = obs.value?.actingSeat === seat && !done.value;
  const base = seat === 0 ? 'bg-green-800/60 border-green-300' : 'bg-green-950/50 border-green-700';
  return isActor ? `${base} ring-2 ring-yellow-300` : base;
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
.card-chip {
  @apply inline-flex items-center justify-center bg-white rounded px-1.5 py-0.5 text-sm font-bold shadow;
  min-width: 1.6rem;
  font-family: ui-monospace, monospace;
}
.card-chip-door {
  @apply bg-amber-100;
}
.card-chip-back {
  @apply bg-base-300 text-base-content;
}
</style>
