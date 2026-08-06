import type { Action, DecisionContext } from '../engine/state';
import type { PlayerAgent } from './types';

export const alwaysCallAgent: PlayerAgent = {
  decide(ctx: DecisionContext, legal: Action[]): Action {
    const call = legal.find((a) => a.type === 'call');
    if (call) return call;
    const check = legal.find((a) => a.type === 'check');
    if (check) return check;
    return legal[0] ?? { type: 'fold', seat: ctx.seat, streetIndex: ctx.streetIndex };
  },
};

export const alwaysFoldAgent: PlayerAgent = {
  decide(ctx: DecisionContext, legal: Action[]): Action {
    const fold = legal.find((a) => a.type === 'fold');
    if (fold) return fold;
    const check = legal.find((a) => a.type === 'check');
    if (check) return check;
    return legal[0] ?? { type: 'fold', seat: ctx.seat, streetIndex: ctx.streetIndex };
  },
};
