import type { Action, Observation } from '../../engine/state';
import type { RngSource } from '../../engine/rng';
import { createRng } from '../../engine/rng';
import type { CompositionSelector, HandConfig } from '../../config/types';
import type { PlayerAgent } from '../types';
import { analyzeObservation } from '../smart';
import { discardAction } from '../discard';
import { monteCarloEquity } from './equity';
import { ismctsDecide } from './tree';
import { resolveSearchBotConfig } from './config';
import type { ResolvedSearchBotConfig, SearchBotConfig } from './config';

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const findType = (legal: Action[], type: Action['type']): Action | undefined =>
  legal.find((a) => a.type === type);

interface Geometry {
  privateTotal: number;
  communityTotal: number;
}

function geometryOf(
  handCfg: HandConfig | undefined,
  myPrivate: number[],
  community: number[],
): Geometry {
  if (handCfg) {
    let privateTotal = 0;
    let communityTotal = 0;
    for (const s of handCfg.streets) {
      privateTotal += s.deal.holeDown + s.deal.playerUp;
      communityTotal += s.deal.community;
    }
    return { privateTotal, communityTotal };
  }
  return { privateTotal: myPrivate.length, communityTotal: community.length };
}

// Best-5-of-available fallback selector when no hand config is attached.
function fallbackSelector(obs: Observation): CompositionSelector {
  const nHole = obs.myHole.length;
  if (nHole >= 5) return { total: 5, pools: [{ pool: 'hole', min: 0, max: 5 }] };
  return {
    total: 5,
    pools: [
      { pool: 'hole', min: 0, max: nHole },
      { pool: 'community', min: 0, max: 5 },
    ],
  };
}

function equityOf(obs: Observation, p: ResolvedSearchBotConfig, rng: RngSource): number {
  const myUp = obs.up.find((u) => u.seat === obs.seat)?.cards ?? [];
  const myPrivate = [...obs.myHole, ...myUp];
  const oppSeats = obs.players
    .filter((pl) => pl.seat !== obs.seat && pl.status === 'active')
    .map((pl) => pl.seat);
  const opponentUp = oppSeats.map((seat) => obs.up.find((u) => u.seat === seat)?.cards ?? []);
  if (opponentUp.length === 0) return 1;
  const geo = geometryOf(obs.handCfg, myPrivate, obs.community);
  const selector = obs.handCfg?.evaluation.composition ?? fallbackSelector(obs);
  return monteCarloEquity({
    myPrivate,
    community: obs.community,
    opponentUp,
    selector,
    kind: obs.evaluator,
    lowQualify: obs.handCfg?.evaluation.lowQualify,
    privateTotal: geo.privateTotal,
    communityTotal: geo.communityTotal,
    nSamples: p.equitySamples,
    rng,
  }).equity;
}

interface Scored {
  a: Action;
  u: number;
}

function utility(a: Action, eq: number, potOdds: number, p: ResolvedSearchBotConfig): number {
  // Shared call/raise EV core: positive exactly when calling is +EV vs pot odds.
  const base = (eq - potOdds) * 2.0;
  const investScale = 2.0 + p.aggression * 2.0;
  switch (a.type) {
    case 'fold':
      return 0;
    case 'check':
      return 0;
    case 'call':
      return base;
    case 'bet': {
      const bar = 0.42 - p.aggression * 0.16;
      return Math.max(0, eq - bar) * investScale;
    }
    case 'raise': {
      // Raising builds the pot on top of the call core, so it dominates calling
      // whenever equity clears the raise bar (and only then).
      const bar = clamp01(Math.max(potOdds + 0.08, 0.55 - p.aggression * 0.12));
      return base + Math.max(0, eq - bar) * investScale;
    }
    default:
      return -1;
  }
}

function softmaxPick(scored: Scored[], temperature: number, rng: RngSource): Action {
  if (scored.length === 0) throw new Error('no actions to score');
  if (temperature <= 0) {
    let best = scored[0]!;
    for (const s of scored) if (s.u > best.u) best = s;
    return best.a;
  }
  const mx = Math.max(...scored.map((s) => s.u));
  const weights = scored.map((s) => Math.exp((s.u - mx) / temperature));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = (rng.nextInt(1000) / 1000) * total;
  for (let i = 0; i < scored.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) return scored[i]!.a;
  }
  return scored[scored.length - 1]!.a;
}

function gaussianUnit(rng: RngSource): number {
  const u1 = Math.max(rng.nextInt(1000) / 1000, 1e-9);
  const u2 = rng.nextInt(1000) / 1000;
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sized(a: Action, p: ResolvedSearchBotConfig, rng: RngSource): Action {
  const frac = clamp01(p.sizing.mean + p.sizing.sigma * gaussianUnit(rng));
  if (a.type === 'bet') {
    const min = a.min ?? a.amount ?? 1;
    const max = a.max ?? min;
    return { ...a, amount: Math.round(Math.max(min, Math.min(max, min + (max - min) * frac))) };
  }
  if (a.type === 'raise') {
    const min = a.min ?? a.to ?? 1;
    const max = a.max ?? min;
    return { ...a, to: Math.round(Math.max(min, Math.min(max, min + (max - min) * frac))) };
  }
  return { ...a };
}

/**
 * A training-free, tunable poker agent whose decisions are driven by Monte-Carlo
 * equity (expected pot share vs sampled opponents) rather than a fixed hand-
 * strength heuristic. It adapts to any variant and bet type by routing every
 * sampled hand through the engine's `resolveHand` / `resolveHiLo` resolvers and
 * reading pot odds / position from `analyzeObservation`. Difficulty is a pure
 * function of the config (temperature, aggression, tightness, bluffFrequency)
 * and the seed — the same `(observation, config, seed)` always returns the same
 * action.
 */
export function createSearchAgent(config: SearchBotConfig): PlayerAgent {
  const p = resolveSearchBotConfig(config);
  const rng = createRng(p.seed);
  return {
    decide(obs: Observation): Action {
      if (p.core === 'ismcts') return ismctsDecide(obs, p, rng, pimcDecide, sizeAction);
      return pimcDecide(obs, p, rng);
    },
  };
}

/** Gaussian-sized bet/raise within the action's legal [min, max] range. */
export function sizeAction(a: Action, p: ResolvedSearchBotConfig, rng: RngSource): Action {
  return sized(a, p, rng);
}

/** The 1-ply Monte-Carlo equity decision (the PIMC core; also the IS-MCTS fallback). */
export function pimcDecide(obs: Observation, p: ResolvedSearchBotConfig, rng: RngSource): Action {
  const unit = (): number => rng.nextInt(1000) / 1000;
  const disc = discardAction(obs);
  if (disc) return disc;
  const legal = obs.legalActions;
  if (legal.length === 0) {
    return { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  }

  const ctx = analyzeObservation(obs);
  const potOdds = ctx.potOdds;
  const eq = equityOf(obs, p, rng);

  // Rare, high-leverage all-ins (mirrors the smart-bot guardrails).
  const allin = findType(legal, 'allin');
  if (allin) {
    const desperate = ctx.myStack <= ctx.pot * 0.25 && eq >= 0.25;
    const committed = ctx.facingBet && ctx.toCall >= 0.6 * ctx.myStack && eq >= potOdds * 1.2;
    const nuts = ctx.streetIndex > 0 && eq >= 0.95;
    if (desperate || committed || nuts) return allin;
  }

  const scored: Scored[] = legal
    .filter((a) => a.type !== 'allin')
    .map((a) => ({ a, u: utility(a, eq, potOdds, p) }));
  const pool = scored.length > 0 ? scored : legal.map((a) => ({ a, u: 0 }));
  let chosen = softmaxPick(pool, p.temperature, rng);

  // Bluff injection: occasionally bet/raise a weak hand when free or priced out.
  if (
    (chosen.type === 'fold' || chosen.type === 'check') &&
    eq < 0.34 &&
    unit() < p.bluffFrequency
  ) {
    const aggro = findType(legal, 'bet') ?? findType(legal, 'raise');
    if (aggro) chosen = aggro;
  }

  if (chosen.type === 'bet' || chosen.type === 'raise') return sized(chosen, p, rng);
  return chosen;
}
