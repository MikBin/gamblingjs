import type { Action, Observation } from '../engine/state';
import type { PlayerAgent } from './types';

export const alwaysCallAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const call = obs.legalActions.find((a) => a.type === 'call');
    if (call) return call;
    const check = obs.legalActions.find((a) => a.type === 'check');
    if (check) return check;
    return obs.legalActions[0] ?? { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  },
};

export const alwaysFoldAgent: PlayerAgent = {
  decide(obs: Observation): Action {
    const fold = obs.legalActions.find((a) => a.type === 'fold');
    if (fold) return fold;
    const check = obs.legalActions.find((a) => a.type === 'check');
    if (check) return check;
    return obs.legalActions[0] ?? { type: 'fold', seat: obs.seat, streetIndex: obs.streetIndex };
  },
};
