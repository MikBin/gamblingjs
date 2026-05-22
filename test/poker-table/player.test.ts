import { describe, it, expect, vi } from 'vitest';
import { createPlayer, BasePlayer, PLAYER_PRESETS } from '../../src/poker-table/player';
import type { HandContext, AllowedAction } from '../../src/poker-table/types';

describe('Player', () => {
  describe('createPlayer', () => {
    it('creates a player from a preset', () => {
      const player = createPlayer('p1', 'NIT');
      expect(player).toBeInstanceOf(BasePlayer);
      expect(player.id).toBe('p1');
      // @ts-ignore - access protected property for testing
      expect(player.profile.looseness).toBe(PLAYER_PRESETS.NIT.looseness);
    });

    it('creates a player from a custom profile', () => {
      const player = createPlayer('p2', { looseness: 0.9, aggressiveness: 0.9 });
      // @ts-ignore
      expect(player.profile.looseness).toBe(0.9);
      // @ts-ignore
      expect(player.profile.bluffFactor).toBe(0.05); // default fallback
    });
  });

  describe('BasePlayer decisions', () => {
    let rng: () => number;

    beforeEach(() => {
      rng = vi.fn(() => 0.5); // Default deterministic RNG for tests
    });

    const createCtx = (
      allowedActions: AllowedAction[],
      toCall: number = 0,
      pot: number = 100,
    ): HandContext => ({
      allowedActions,
      toCall,
      pot,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop',
      activePlayers: 2,
    });

    it('folds when facing a bet and rng < foldProb (tight player)', () => {
      // Very tight player (NIT: L=0.08)
      // Fold threshold when facing a bet:
      // foldProb = (1 - 0.08) * sigmoid(toCall / max(1, pot+toCall))
      // sigmoid(100/200) = sigmoid(0.5) = 1/(1+e^(-6*0)) = 0.5
      // foldProb = 0.92 * 0.5 = 0.46
      // If RNG < 0.46, should fold.

      const rngZero = vi.fn(() => 0.1); // 0.1 < 0.46
      const player = createPlayer('p1', 'NIT', rngZero);

      const ctx = createCtx(['fold', 'call', 'raise'], 100, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('fold');
    });

    it('calls or raises when facing a bet and rng >= foldProb', () => {
      // rng = 0.9 > foldProb (0.46)
      const rngHigh = vi.fn(() => 0.9);
      const player = createPlayer('p1', 'NIT', rngHigh); // A=0.35

      const ctx = createCtx(['fold', 'call', 'raise'], 100, 100);

      // Since it doesn't fold, it goes to "Facing a call" logic
      // raiseProb = A * (0.6 + 0.4 * L) = 0.35 * (0.6 + 0.4 * 0.08) = 0.35 * 0.632 = 0.2212
      // rng (0.9) > raiseProb (0.2212), so it won't raise.
      // Should fall back to call.
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('call');
    });

    it('raises when facing a bet and rng falls in raise probability', () => {
      // Aggressive player (MANIAC: L=0.58, A=0.88, LSF=0.75)
      // foldProb = (1-0.58)*0.5 = 0.21.
      // rng = 0.4 > 0.21 (no fold)
      // raiseProb = 0.88 * (0.6 + 0.4 * 0.58) = 0.88 * 0.832 = 0.732
      // rng (0.4) < 0.732 (will raise)
      const rngRaise = vi.fn(() => 0.4);
      const player = createPlayer('p1', 'MANIAC', rngRaise);

      const ctx = createCtx(['fold', 'call', 'raise'], 100, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('raise');
      // base = Math.max(100+1, Math.floor((100+100)*0.75)) = max(101, 150) = 150
      expect(decision.amount).toBe(150);
    });

    it('bets when facing no bet and rng < aggroProb', () => {
      // Aggro player (BULLY: L=0.35, A=0.85, BF=0.1)
      // aggroProb = A + BF*(1-L) = 0.85 + 0.1*0.65 = 0.915
      const rngAggro = vi.fn(() => 0.5); // 0.5 < 0.915
      const player = createPlayer('p1', 'BULLY', rngAggro);

      const ctx = createCtx(['check', 'bet'], 0, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('bet');
      // base = max(0, Math.floor(100 * 0.9)) = 90
      expect(decision.amount).toBe(90);
    });

    it('checks when facing no bet and rng >= aggroProb', () => {
      // Passive player (ROCK: L=0.06, A=0.25, BF=0.01)
      // aggroProb = 0.25 + 0.01*0.94 = 0.2594
      const rngPassive = vi.fn(() => 0.8); // 0.8 > 0.2594
      const player = createPlayer('p1', 'ROCK', rngPassive);

      const ctx = createCtx(['check', 'bet'], 0, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('check');
    });

    it('forces check fallback when no other options match', () => {
      const rngFallback = vi.fn(() => 0.99); // Will bypass all bet/raise/fold logic
      const player = createPlayer('p1', 'NIT', rngFallback);

      // Give it only check option (e.g. BB preflop facing limps, or checked around)
      const ctx = createCtx(['check'], 0, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('check');
    });

    it('forces fold fallback when nothing else matches', () => {
      const rngFallback = vi.fn(() => 0.99);
      const player = createPlayer('p1', 'NIT', rngFallback);

      // Edge case context where only fold is allowed? Unlikely in real game, but tests fallback
      const ctx = createCtx(['fold'], 100, 100);
      const decision = player.decideAction(ctx);

      expect(decision.action).toBe('fold');
    });

    it('does nothing in onHandStart / onStreetChange', () => {
      const player = createPlayer('p1', 'NIT');
      const ctx = createCtx([], 0, 0);
      expect(() => player.onHandStart(ctx)).not.toThrow();
      expect(() => player.onStreetChange(ctx)).not.toThrow();
    });
  });
});

describe('BasePlayer decisions edge cases', () => {
  it('folds when facing a bet and foldProb is low but RNG is even lower', () => {
    // Loose player (WHALE: L=0.6)
    // foldProb = (1 - 0.6) * sigmoid(10 / max(1, 110)) = 0.4 * sigmoid(10/110) = 0.4 * 0.366 = 0.146
    // If RNG < 0.146 * 0.8 = 0.117, it folds.
    const rngFold = vi.fn(() => 0.01);
    const player = createPlayer('p1', 'WHALE', rngFold);
    const ctx = {
      allowedActions: ['fold', 'call', 'raise'] as AllowedAction[],
      toCall: 10,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };

    const decision = player.decideAction(ctx);
    expect(decision.action).toBe('fold');
  });

  it('bets when facing no call and can bet but cannot raise', () => {
    const rngAggro = vi.fn(() => 0.1); // low enough to trigger aggro
    const player = createPlayer('p1', 'BULLY', rngAggro);

    const ctx = {
      allowedActions: ['check', 'bet'] as AllowedAction[],
      toCall: 0,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };

    const decision = player.decideAction(ctx);
    expect(decision.action).toBe('bet');
  });

  it('raises when facing no call and can raise but cannot bet', () => {
    const rngAggro = vi.fn(() => 0.1); // low enough to trigger aggro
    const player = createPlayer('p1', 'BULLY', rngAggro);

    const ctx = {
      allowedActions: ['check', 'raise'] as AllowedAction[], // e.g. BB preflop facing limpers
      toCall: 0,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };

    const decision = player.decideAction(ctx);
    expect(decision.action).toBe('raise');
  });

  it('bets when facing a call and can bet but cannot raise', () => {
    const rngRaise = vi.fn(() => 0.4); // Low enough to raise but high enough not to fold
    const player = createPlayer('p1', 'MANIAC', rngRaise);

    const ctx = {
      allowedActions: ['fold', 'call', 'bet'] as AllowedAction[],
      toCall: 100,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };
    const decision = player.decideAction(ctx);

    expect(decision.action).toBe('bet');
  });

  it('calls when facing a call, cannot raise/bet', () => {
    const rngRaise = vi.fn(() => 0.99);
    const player = createPlayer('p1', 'MANIAC', rngRaise);

    const ctx = {
      allowedActions: ['fold', 'call'] as AllowedAction[],
      toCall: 100,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };
    const decision = player.decideAction(ctx);

    expect(decision.action).toBe('call');
  });
});
describe('clamp01 and sigmoid', () => {
  it('clamp01 limits values', () => {
    const rngRaise = vi.fn(() => 0.4);
    // We can test this by passing >1 or <0 looseness to custom profile
    const player = createPlayer('p1', { looseness: 1.5, aggressiveness: -0.5 }, rngRaise);

    const ctx = {
      allowedActions: ['fold', 'call', 'raise'] as AllowedAction[],
      toCall: 100,
      pot: 100,
      minRaise: 10,
      maxBet: 1000,
      myHand: [],
      communityCards: [],
      myChips: 1000,
      street: 'preflop' as any,
      activePlayers: 2,
    };
    // It will evaluate with L=1, A=0
    const decision = player.decideAction(ctx);
    // L=1 means no foldProb = 0. A=0 means no raiseProb = 0. Will fall back to call.
    expect(decision.action).toBe('call');
  });
});
