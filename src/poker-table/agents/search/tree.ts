// Information-Set Monte-Carlo Tree Search (IS-MCTS / UCB1) decision core.
//
// Non-cheating: opponent hole cards are never read from the real deal. For each
// decision we sample one or more *determinizations* (plausible opponent hands +
// a shuffled future deck, consistent with the public observation), reconstruct a
// resumable engine state, and search the betting tree with UCB1. Rollouts drive
// the real engine (`applyAction` / `advanceToNextDecision` / `settle`) to
// showdown, so no game rules are duplicated.
//
// Safety net: the reconstructed state is validated by checking that
// `computeLegalActions(state)` matches the observation's `legalActions`. If it
// does not (an edge case the reconstruction cannot faithfully reproduce), the
// decision falls back to the PIMC equity core — so IS-MCTS can never produce an
// illegal action or crash.
import type { Action, GameState, Observation, SeatState } from '../../engine/state';
import type { HandConfig } from '../../config/types';
import { applyAction, advanceToNextDecision, cloneState, observe } from '../../engine/transitions';
import { computeLegalActions, bigBlindOf } from '../../engine/actions';
import type { RngSource } from '../../engine/rng';
import { discardAction } from '../discard';
import type { ResolvedSearchBotConfig } from './config';

const FULL_DECK: number[] = Array.from({ length: 52 }, (_, i) => i);
type Fallback = (obs: Observation, p: ResolvedSearchBotConfig, rng: RngSource) => Action;
type Sizer = (a: Action, p: ResolvedSearchBotConfig, rng: RngSource) => Action;

// ---- determinization (non-cheating hidden-info resample) ----

function unseenOf(obs: Observation): number[] {
  const known = new Set<number>(obs.myHole);
  for (const c of obs.community) known.add(c);
  for (const u of obs.up) for (const c of u.cards) known.add(c);
  return FULL_DECK.filter((c) => !known.has(c));
}

function downDealtSoFar(handCfg: HandConfig, streetIndex: number): number {
  let n = 0;
  for (let s = 0; s <= streetIndex; s++) n += handCfg.streets[s]?.deal.holeDown ?? 0;
  return n;
}

interface StreetBook {
  hasActed: boolean[];
  lastRaiseSize: number;
  lastAggressor: number | null;
}

// Re-derive current-street bookkeeping (hasActedThisStreet / lastRaiseSize /
// lastAggressor) from the public action log. Approximate; validated upstream.
function replayStreet(obs: Observation, handCfg: HandConfig): StreetBook {
  const n = obs.players.length;
  const hasActed = new Array<boolean>(n).fill(false);
  const wagered = new Array<number>(n).fill(0);
  const bb = bigBlindOf(handCfg);
  let lastRaiseSize = bb;
  let lastAggressor: number | null = null;
  const maxWagerExcluding = (excl: number): number => {
    let m = 0;
    for (let i = 0; i < n; i++) if (i !== excl && wagered[i]! > m) m = wagered[i]!;
    return m;
  };
  const reopen = (agg: number): void => {
    for (let i = 0; i < n; i++) if (i !== agg) hasActed[i] = false;
  };
  for (const a of obs.actionLog) {
    if (a.streetIndex !== obs.streetIndex || a.type === 'discard') continue;
    if (a.type === 'fold' || a.type === 'check' || a.type === 'call') {
      hasActed[a.seat] = true;
      continue;
    }
    if (a.type === 'bet') {
      const amt = a.amount ?? wagered[a.seat]! ?? 0;
      lastRaiseSize = Math.max(bb, amt - maxWagerExcluding(a.seat));
      wagered[a.seat] = amt;
    } else if (a.type === 'raise') {
      const to = a.to ?? wagered[a.seat]! ?? 0;
      lastRaiseSize = Math.max(bb, to - maxWagerExcluding(-1));
      wagered[a.seat] = to;
    } else if (a.type === 'allin') {
      const amt = a.amount ?? wagered[a.seat]! ?? 0;
      wagered[a.seat] = Math.max(wagered[a.seat]!, amt);
    }
    lastAggressor = a.seat;
    reopen(a.seat);
    hasActed[a.seat] = true;
  }
  return { hasActed, lastRaiseSize, lastAggressor };
}

// Tolerant comparison of two legal-action sets (by type + bounds within 1 chip).
function legalActionsMatch(a: Action[], b: Action[]): boolean {
  const sig = (xs: Action[]): Map<Action['type'], Action> => {
    const m = new Map<Action['type'], Action>();
    for (const x of xs) m.set(x.type, x);
    return m;
  };
  const ma = sig(a);
  const mb = sig(b);
  if (ma.size !== mb.size) return false;
  for (const [t, xa] of ma) {
    const xb = mb.get(t);
    if (!xb) return false;
    if (Math.abs((xa.min ?? 0) - (xb.min ?? 0)) > 1) return false;
    if (Math.abs((xa.max ?? 0) - (xb.max ?? 0)) > 1) return false;
  }
  return true;
}

/**
 * Sample one determinization and rebuild a resumable GameState from the public
 * observation. Returns null when the rebuilt state's legal actions do not match
 * the observation (reconstruction unreliable for this spot).
 */
export function reconstructState(obs: Observation, rng: RngSource): GameState | null {
  const handCfg = obs.handCfg;
  if (!handCfg) return null;
  const mySeat = obs.seat;

  // Sample each opponent's hidden down cards from the unseen pool.
  const pool = unseenOf(obs);
  rng.shuffleInPlace(pool);
  const downCount = downDealtSoFar(handCfg, obs.streetIndex);
  let cursor = 0;
  const oppHole = new Map<number, number[]>();
  for (const pl of obs.players) {
    if (pl.seat === mySeat || pl.status === 'out') continue;
    const hole = pool.slice(cursor, cursor + downCount);
    cursor += downCount;
    oppHole.set(pl.seat, hole);
  }
  const deck = pool.slice(cursor); // remaining unseen → future streets
  rng.shuffleInPlace(deck);

  const seats: SeatState[] = obs.players.map((pl) => ({
    index: pl.seat,
    stack: pl.stack,
    hole: pl.seat === mySeat ? [...obs.myHole] : [...(oppHole.get(pl.seat) ?? [])],
    up: [...(obs.up.find((u) => u.seat === pl.seat)?.cards ?? [])],
    status: pl.status,
    hasActedThisStreet: false,
    wageredThisStreet: pl.bet,
    wageredTotal: pl.wagered,
  }));

  const bk = replayStreet(obs, handCfg);
  seats.forEach((s) => {
    s.hasActedThisStreet = bk.hasActed[s.index] ?? false;
  });

  const state: GameState = {
    tableCfg: {
      gameId: 'ismcts-sim',
      seats: { min: seats.length, max: seats.length },
      deck: 'standard52',
    },
    handCfg,
    buttonSeat: obs.buttonSeat,
    seats,
    community: [...obs.community],
    streetIndex: obs.streetIndex,
    phase: 'betting',
    actingSeat: obs.actingSeat,
    lastAggressor: bk.lastAggressor,
    lastRaiseSize: bk.lastRaiseSize,
    actions: [],
    deck,
    drawMuck: [],
    drawnThisStreet: seats.map(() => false),
    winners: [],
    pots: [],
    isTerminal: false,
  };

  if (!legalActionsMatch(computeLegalActions(state, handCfg), obs.legalActions)) return null;
  return state;
}

// ---- MCTS ----

interface Node {
  action: Action | null;
  parent: Node | null;
  children: Node[];
  visits: number;
  total: number;
}

const ACTION_SEAT = (a: Action): Action => a; // placeholder kept for readability

function step(state: GameState, action: Action, handCfg: HandConfig): GameState {
  return advanceToNextDecision(applyAction(state, action, handCfg), undefined);
}

function fullyExpanded(node: Node, cur: GameState, handCfg: HandConfig): boolean {
  const childTypes = new Set(node.children.map((c) => c.action!.type));
  for (const a of computeLegalActions(cur, handCfg)) if (!childTypes.has(a.type)) return false;
  return true;
}

function ucbSelect(node: Node, c: number): Node {
  const ln = Math.log(node.visits || 1);
  let best = node.children[0]!;
  let bestScore = -Infinity;
  for (const child of node.children) {
    const exploit = child.visits > 0 ? child.total / child.visits : 0;
    const explore = child.visits > 0 ? c * Math.sqrt(ln / child.visits) : Infinity;
    const score = exploit + explore;
    if (score > bestScore) {
      bestScore = score;
      best = child;
    }
  }
  return best;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function rewardOf(state: GameState, mySeat: number, rootStack: number, rootPot: number): number {
  const delta = (state.seats[mySeat]?.stack ?? 0) - rootStack;
  return clamp(delta / rootPot, -1, 1);
}

// Equity-guided playout (PIMC default policy, cheap samples) to terminal.
function rollout(
  state: GameState,
  mySeat: number,
  rootStack: number,
  rootPot: number,
  handCfg: HandConfig,
  rng: RngSource,
  fallback: Fallback,
  rolloutP: ResolvedSearchBotConfig,
): number {
  let cur = state;
  let guard = 0;
  while (!cur.isTerminal && guard++ < 300) {
    const legal = computeLegalActions(cur, handCfg);
    if (legal.length === 0) break;
    let a: Action;
    try {
      a = fallback(observe(cur, cur.actingSeat), rolloutP, rng);
    } catch {
      a = legal[rng.nextInt(legal.length)]!;
    }
    try {
      cur = step(cur, a, handCfg);
    } catch {
      try {
        cur = step(cur, legal[0]!, handCfg);
      } catch {
        break;
      }
    }
  }
  return rewardOf(cur, mySeat, rootStack, rootPot);
}

/**
 * IS-MCTS decision. Searches the current betting round with UCB1 across
 * `determinizations` hidden-info resamples; rollouts (engine-driven) evaluate
 * each line. Falls back to `fallback` (PIMC) when no determinization reconstructs
 * cleanly.
 */
export function ismctsDecide(
  obs: Observation,
  p: ResolvedSearchBotConfig,
  rng: RngSource,
  fallback: Fallback,
  sizer: Sizer,
): Action {
  void ACTION_SEAT;
  const disc = discardAction(obs);
  if (disc) return disc;
  const legal = obs.legalActions;
  if (legal.length === 0) return { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  if (legal.length === 1) return sizer(legal[0]!, p, rng);

  const handCfg = obs.handCfg;
  if (!handCfg) return fallback(obs, p, rng);
  const mySeat = obs.seat;

  // Precompute validated determinized root states.
  const roots: GameState[] = [];
  let attempts = 0;
  while (roots.length < p.determinizations && attempts < p.determinizations * 3) {
    attempts++;
    const st = reconstructState(obs, rng);
    if (st) roots.push(st);
  }
  if (roots.length === 0) return fallback(obs, p, rng);

  const rootPot = Math.max(1, obs.pot);
  const rootStack = obs.players[mySeat]?.stack ?? 0;
  const tree: Node = { action: null, parent: null, children: [], visits: 0, total: 0 };

  for (let it = 0; it < p.treeIterations; it++) {
    const root = roots[it % roots.length]!;
    let cur = cloneState(root);
    let node = tree;
    const path: Node[] = [node];

    // Selection within the current betting round.
    while (!cur.isTerminal && cur.streetIndex === obs.streetIndex && node.children.length > 0) {
      if (!fullyExpanded(node, cur, handCfg)) break;
      const child = ucbSelect(node, p.explorationC);
      try {
        cur = step(cur, child.action!, handCfg);
      } catch {
        break;
      }
      node = child;
      path.push(node);
      if (cur.isTerminal || cur.streetIndex !== obs.streetIndex) break;
    }

    // Expansion: add one untried action type at the frontier.
    if (!cur.isTerminal && cur.streetIndex === obs.streetIndex) {
      const childTypes = new Set(node.children.map((c) => c.action!.type));
      const avail = computeLegalActions(cur, handCfg).filter((a) => !childTypes.has(a.type));
      if (avail.length > 0) {
        const a = avail[rng.nextInt(avail.length)]!;
        try {
          cur = step(cur, a, handCfg);
          const child: Node = { action: a, parent: node, children: [], visits: 0, total: 0 };
          node.children.push(child);
          node = child;
          path.push(child);
        } catch {
          /* illegal on this determinization — skip expansion, rollout from cur */
        }
      }
    }

    // Rollout + backprop. The rollout uses the PIMC equity policy (cheap samples)
    // as its default policy — far stronger than random, so the tree refines an
    // already-rational baseline rather than searching from noise.
    const rolloutP: ResolvedSearchBotConfig = {
      ...p,
      equitySamples: Math.min(p.equitySamples, 24),
      temperature: 0,
    };
    const reward = cur.isTerminal
      ? rewardOf(cur, mySeat, rootStack, rootPot)
      : rollout(cur, mySeat, rootStack, rootPot, handCfg, rng, fallback, rolloutP);
    for (const nd of path) {
      nd.visits++;
      nd.total += reward;
    }
  }

  if (tree.children.length === 0) return fallback(obs, p, rng);
  // Select the root action with the best mean reward (equity-rollout-guided, so a
  // shallow search tracks PIMC; deeper search refines it via the UCB1 tree).
  let best = tree.children[0]!;
  let bestMean = best.visits > 0 ? best.total / best.visits : -Infinity;
  for (const c of tree.children) {
    if (c.visits === 0) continue;
    const mean = c.total / c.visits;
    if (mean > bestMean || (mean === bestMean && c.visits > best.visits)) {
      bestMean = mean;
      best = c;
    }
  }
  return sizer(best.action!, p, rng);
}
