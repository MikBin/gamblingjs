<template>
  <div class="space-y-4">
    <!-- Config screen -->
    <div v-if="phase === 'config'" class="max-w-xl mx-auto card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">🎯 8-Game Sit &amp; Go — You vs 7 bots</h2>
        <p class="text-sm opacity-70">
          Play a full 8-Game tournament (2-7 Triple Draw, FL Hold'em, FL Omaha Hi/Lo, Razz, Stud, Stud Hi/Lo,
          NL Hold'em, PLO) hand-by-hand. You're always at the bottom; the button rotates around you.
        </p>
        <div class="grid grid-cols-2 gap-3 mt-2">
          <label class="form-control">
            <span class="label-text text-xs">Bot lineup</span>
            <select v-model="lineup" class="select select-bordered select-sm">
              <option v-for="l in lineups" :key="l.name" :value="l.name">{{ l.name }}</option>
            </select>
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Starting stack</span>
            <input v-model.number="startingStack" type="number" min="500" step="100" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Hands per blind level</span>
            <input v-model.number="handsPerLevel" type="number" min="1" max="30" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Seed</span>
            <input v-model.number="seed" type="number" class="input input-bordered input-sm" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Game rotation</span>
            <select v-model="rotationCadence" class="select select-bordered select-sm">
              <option value="orbit">Per orbit (authentic)</option>
              <option value="level">Per blind level</option>
              <option value="hand">Every hand (fast)</option>
            </select>
          </label>
        </div>
        <label class="form-control mt-1">
          <span class="label-text text-xs">Bot response time: {{ speed }}ms</span>
          <input v-model.number="speed" type="range" min="150" max="2500" step="50" class="range range-xs" />
        </label>
        <template v-if="lineup === 'Smart bots' || lineup === 'Smart + classic mix'">
          <div class="grid grid-cols-2 gap-3 mt-1">
            <label class="form-control">
              <span class="label-text text-xs">Smart aggression: {{ smartCfg.aggression }}</span>
              <input v-model.number="smartCfg.aggression" type="range" min="0" max="1" step="0.05" class="range range-xs" />
            </label>
            <label class="form-control">
              <span class="label-text text-xs">Smart tightness: {{ smartCfg.tightness }}</span>
              <input v-model.number="smartCfg.tightness" type="range" min="0" max="1" step="0.05" class="range range-xs" />
            </label>
            <label class="form-control">
              <span class="label-text text-xs">Bluffiness: {{ smartCfg.bluffiness }}</span>
              <input v-model.number="smartCfg.bluffiness" type="range" min="0" max="0.5" step="0.02" class="range range-xs" />
            </label>
            <label class="form-control">
              <span class="label-text text-xs">Bet sizing (× pot): {{ smartCfg.sizing }}</span>
              <input v-model.number="smartCfg.sizing" type="range" min="0.2" max="1.5" step="0.05" class="range range-xs" />
            </label>
          </div>
        </template>
        <div class="card-actions justify-end mt-2">
          <button class="btn btn-primary" @click="start">▶ Start tournament</button>
        </div>
      </div>
    </div>

    <!-- Play screen -->
    <div v-else>
      <!-- Status bar -->
      <div class="card bg-base-100 shadow"><div class="card-body !py-3 px-4 flex-row flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span class="font-bold">🎯 8-Game SNG</span>
        <span class="badge badge-primary badge-lg">{{ game.label }}</span>
        <span class="badge badge-outline">Level {{ levelIndex + 1 }} · {{ level.sb }}/{{ level.bb }}{{ level.ante ? ` ante ${level.ante}` : '' }}{{ level.bringIn ? ` bi ${level.bringIn}` : '' }}</span>
        <span class="opacity-70">next level in {{ handsToNextLevel }} hand{{ handsToNextLevel === 1 ? '' : 's' }}</span>
        <span class="opacity-70">· Hand {{ handNumber }}</span>
        <span v-if="!humanAlive" class="badge badge-warning">you busted — spectating</span>
        <div class="flex-1"></div>
        <button class="btn btn-ghost btn-sm" @click="reset">↺ New tournament</button>
      </div></div>

      <div class="grid lg:grid-cols-3 gap-4 mt-3">
        <div class="lg:col-span-2">
          <!-- Table -->
          <div class="table-wrap">
            <div class="felt"></div>
            <div class="center">
              <div v-if="obs" class="turn-text">
                <span v-if="obs?.isTerminal">hand over</span>
                <span v-else-if="humanTurn" class="text-yellow-300 font-semibold">your action</span>
                <span v-else>{{ actorName }} thinking…</span>
              </div>
              <div v-if="revealedCommunity.length" class="board">
                <span v-for="(c, i) in revealedCommunity" :key="i" :class="cardColor(c)">{{ cardText(c) }}</span>
              </div>
              <div class="pot">Pot {{ obs?.pot ?? 0 }}</div>
            </div>
            <!-- Seats -->
            <div
              v-for="(sv, i) in seatViews"
              :key="sv.player.id"
              class="seat"
              :class="{ 'is-actor': sv.isActor, 'is-you': sv.player.id === 0, 'is-folded': sv.folded, 'is-out': !sv.player.alive }"
              :style="{ left: sv.pos.left, top: sv.pos.top }"
            >
              <div v-if="sv.isButton" class="dealer">D</div>
              <div class="avatar">{{ sv.player.avatar }}</div>
              <div class="name">{{ sv.player.name }}<span v-if="sv.player.place"> · {{ sv.player.place }}{{ ord(sv.player.place) }}</span></div>
              <div class="stack">{{ sv.player.stack }}</div>
              <div v-if="sv.bet > 0" class="bet-chip" :style="{ left: sv.betPos.left, top: sv.betPos.top }">{{ sv.bet }}</div>
              <div class="cards">
                <span v-for="(c, ci) in sv.hole" :key="'h'+ci" class="card" :class="cardColor(c)">{{ cardText(c) }}</span>
                <span v-for="(c, ci) in sv.doors" :key="'d'+ci" class="card door" :class="cardColor(c)">{{ cardText(c) }}</span>
                <span v-if="sv.player.alive && sv.hole.length === 0 && sv.doors.length === 0" class="card-back">🂠</span>
              </div>
            </div>
          </div>

          <!-- Human action panel -->
          <div v-if="humanTurn" class="card bg-base-200 shadow mt-3">
            <div class="card-body !py-3">
              <div v-if="has('discard')" class="discard-row">
                <span class="text-sm mr-2">Select cards to discard (or stand pat):</span>
                <button
                  v-for="(c, ci) in myHole"
                  :key="ci"
                  class="card-btn"
                  :class="{ selected: selected.has(ci) }"
                  @click="toggleDiscard(ci)"
                >{{ cardText(c) }}</button>
                <button class="btn btn-sm btn-outline ml-2" @click="selected.clear(); doDiscard([])">Stand pat</button>
                <button class="btn btn-sm btn-primary ml-1" :disabled="selected.size === 0" @click="confirmDiscard">Discard {{ selected.size }}</button>
              </div>
              <div v-else class="flex flex-wrap items-center gap-2">
                <button v-if="has('fold')" class="btn btn-error btn-sm" @click="doAction(find('fold')!)">Fold</button>
                <button v-if="has('check')" class="btn btn-sm" @click="doAction(find('check')!)">Check</button>
                <button v-if="has('call')" class="btn btn-sm" @click="doAction(find('call')!)">Call {{ find('call')?.amount }}</button>
                <input v-model.number="betAmt" type="number" class="input input-bordered input-sm w-28" />
                <span class="text-xs opacity-60">{{ rangeLabel }}</span>
                <button v-if="has('bet')" class="btn btn-sm" @click="doBetOrRaise('bet')">Bet</button>
                <button v-if="has('raise')" class="btn btn-primary btn-sm" @click="doBetOrRaise('raise')">Raise to</button>
                <button v-if="has('allin')" class="btn btn-warning btn-sm" @click="doAction(find('allin')!)">All-in</button>
              </div>
            </div>
          </div>

          <!-- Between hands -->
          <div v-if="phase === 'between'" class="card bg-base-200 shadow mt-3">
            <div class="card-body !py-3 flex-row items-center gap-3">
              <span class="font-semibold">Hand {{ handNumber }} complete</span>
              <span class="opacity-70 text-sm">{{ aliveCount }} players remain</span>
              <div class="flex-1"></div>
              <button class="btn btn-primary btn-sm" @click="dealNextHand">▶ Deal next hand</button>
            </div>
          </div>

          <!-- Finished -->
          <div v-if="phase === 'finished'" class="card bg-base-200 shadow mt-3">
            <div class="card-body items-center text-center">
              <span class="text-5xl">🏆</span>
              <p class="text-lg">{{ winner?.name }} wins the tournament!</p>
              <p class="opacity-70 text-sm">{{ winner?.id === 0 ? 'Congratulations!' : 'Better luck next time.' }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar: standings + action log -->
        <div class="space-y-4">
          <div class="card bg-base-100 shadow">
            <div class="card-body !py-3">
              <h3 class="font-bold text-sm">Standings</h3>
              <table class="table table-xs">
                <thead><tr><th>#</th><th>Player</th><th>Stack</th><th>Status</th></tr></thead>
                <tbody>
                  <tr v-for="p in standingsSorted" :key="p.id" :class="{ 'font-semibold': p.id === 0 }">
                    <td>{{ p.place ?? '—' }}</td>
                    <td>{{ p.avatar }} {{ p.name }}</td>
                    <td>{{ p.stack }}</td>
                    <td>{{ p.alive ? 'in' : 'out' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card bg-base-100 shadow">
            <div class="card-body !py-3">
              <h3 class="font-bold text-sm">Action log</h3>
              <div class="font-mono text-xs max-h-64 overflow-auto space-y-0.5">
                <div v-for="(line, i) in [...log].reverse()" :key="i">{{ line }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useInteractiveSitAndGo } from '@/composables/useInteractiveSitAndGo';
import { cardText, cardColor } from '@/lib/cards';
import type { Action } from '@pokertable';

const s = useInteractiveSitAndGo();
const {
  phase, players, level, game, levelIndex, handNumber, handsToNextLevel,
  lineup, speed, smartCfg, handsPerLevel, startingStack, seed, rotationCadence, lineups,
  seatOrder, humanSeat, humanAlive, humanTurn, humanActions,
  obs, log, revealedCommunity, finished, winner,
  start, reset, dealNextHand, humanAct,
} = s;

const betAmt = ref(0);
const selected = reactive(new Set<number>());

function cardColorCls(c: number) { return cardColor(c); }
function txt(c: number) { return cardText(c); }

interface SeatView {
  player: { id: number; name: string; avatar: string; stack: number; alive: boolean; place: number | null };
  isActor: boolean;
  isButton: boolean;
  pos: { left: string; top: string };
  betPos: { left: string; top: string };
  hole: number[];
  doors: number[];
  bet: number;
  folded: boolean;
}
function geometry(i: number, n: number) {
  const rx = 43, ry = 40;
  const ang = ((90 + (i * 360) / n) * Math.PI) / 180;
  const cx = 50 + rx * Math.cos(ang);
  const cy = 50 + ry * Math.sin(ang);
  return { left: `${cx}%`, top: `${cy}%` };
}
const renderedPlayers = computed(() => {
  // Human (id 0) first -> bottom seat; then others in id order.
  const all = [...players.value];
  const human = all.find((p) => p.id === 0)!;
  const rest = all.filter((p) => p.id !== 0);
  return [human, ...rest];
});
const seatViews = computed<SeatView[]>(() => {
  const n = renderedPlayers.value.length;
  return renderedPlayers.value.map((player, i) => {
    const engSeat = seatOrder.value.indexOf(player.id);
    const pp = obs.value?.players[engSeat];
    const up = obs.value?.up.find((u) => u.seat === engSeat)?.cards ?? [];
    const isHuman = player.id === 0;
    let hole: number[] = [];
    if (engSeat >= 0 && pp) {
      if (isHuman && humanAlive.value) hole = obs.value?.myHole ?? [];
      else if (obs.value?.isTerminal) hole = obs.value?.revealedHole?.find((u) => u.seat === engSeat)?.cards ?? [];
    }
    const [pos, betPos] = [geometry(i, n), geometry(i, n)];
    return {
      player: {
        id: player.id, name: player.name, avatar: player.avatar,
        stack: player.alive ? (pp?.stack ?? player.stack) : 0,
        alive: player.alive, place: player.place,
      },
      isActor: engSeat >= 0 && obs.value?.actingSeat === engSeat && !obs.value?.isTerminal,
      isButton: seatOrder.value[0] === player.id && phase.value !== 'config',
      pos, betPos,
      hole,
      doors: up,
      bet: pp?.bet ?? 0,
      folded: pp?.status === 'folded',
    };
  });
});
const actorName = computed(() => {
  const eng = obs.value?.actingSeat ?? -1;
  const pid = seatOrder.value[eng] ?? -1;
  const p = players.value.find((x) => x.id === pid);
  return p ? p.name : '…';
});
const aliveCount = computed(() => players.value.filter((p) => p.alive).length);
const standingsSorted = computed(() =>
  [...players.value].sort((a, b) => (a.place ?? 99) - (b.place ?? 99) || b.stack - a.stack),
);
const myHole = computed(() => (humanAlive.value ? obs.value?.myHole ?? [] : []));

function has(type: Action['type']): boolean { return !!humanActions.value.find((a) => a.type === type); }
function find(type: Action['type']): Action | undefined { return humanActions.value.find((a) => a.type === type); }
function doAction(a: Action): void { humanAct({ ...a }); }
function doBetOrRaise(type: 'bet' | 'raise'): void {
  const a = find(type);
  if (!a) return;
  const v = Math.max(a.min ?? 0, Math.min(betAmt.value, a.max ?? betAmt.value));
  humanAct({ ...a, ...(type === 'bet' ? { amount: v } : { to: v }) });
}
function toggleDiscard(ci: number): void {
  if (selected.has(ci)) selected.delete(ci);
  else selected.add(ci);
}
function doDiscard(indices: number[]): void {
  const d = find('discard');
  if (!d) return;
  humanAct({ type: 'discard', seat: humanSeat.value, streetIndex: d.streetIndex, discardIndices: indices });
  selected.clear();
}
function confirmDiscard(): void { doDiscard([...selected]); }
const rangeLabel = computed(() => {
  const a = find('raise') ?? find('bet');
  return a ? `[${a.min}–${a.max}]` : '';
});
function ord(n: number): string {
  const arr = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return arr[(v - 20) % 10] ?? arr[v] ?? arr[0]!;
}
</script>

<style scoped>
.table-wrap { position: relative; width: 100%; aspect-ratio: 16/10; max-width: 920px; margin-inline: auto; }
.felt { position: absolute; inset: 9% 8%; border-radius: 50%;
  background: radial-gradient(ellipse at center, #1a7a43 0%, #166534 55%, #11452b 100%);
  border: 12px solid #3b2517; box-shadow: inset 0 0 70px rgba(0,0,0,.5), 0 12px 30px rgba(0,0,0,.45); }
.center { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.turn-text { color: #d1fae5; font-size: 11px; opacity: .9; min-height: 14px; }
.board span { display: inline-block; background: #fff; color: #111; border-radius: 4px; padding: 1px 4px; margin: 0 1px; font-weight: 700; font-size: 14px; }
.pot { background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.15); color: #ecfccb; padding: 2px 14px; border-radius: 9999px; font-weight: 800; font-size: 15px; }
.seat { position: absolute; transform: translate(-50%,-50%); text-align: center; width: 92px; }
.seat .avatar { font-size: 26px; }
.seat .name { font-size: 10px; color: #e5e7eb; white-space: nowrap; }
.seat .stack { font-size: 11px; font-weight: 700; color: #fde68a; }
.seat .cards { margin-top: 2px; }
.seat .card { display: inline-block; background: #fff; color: #111; border-radius: 3px; padding: 0 3px; font-size: 12px; font-weight: 700; margin: 0 1px; }
.seat .card.door { outline: 1px solid #94a3b8; }
.seat .card-back { font-size: 14px; }
.bet-chip { position: absolute; transform: translate(-50%,-50%); background: #fde68a; color: #111; border-radius: 9999px; font-size: 10px; font-weight: 700; padding: 1px 7px; }
.dealer { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #fff; color: #111; border-radius: 9999px; font-size: 9px; font-weight: 800; padding: 1px 5px; }
.is-actor .avatar { outline: 3px solid #fde047; border-radius: 50%; }
.is-you .name { color: #fde047; }
.is-folded, .is-out { opacity: .4; }
.discard-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.card-btn { background: #fff; color: #111; border-radius: 5px; padding: 3px 7px; font-weight: 700; font-size: 15px; border: 2px solid transparent; cursor: pointer; }
.card-btn.selected { border-color: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.4); }
.text-red-500 { color: #ef4444; }
.text-base-content { color: #111; }
</style>
