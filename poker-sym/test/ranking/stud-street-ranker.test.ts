import { describe, it, expect, beforeAll } from 'vitest';
import { rankStudStreets } from '../../src/ranking/stud-street-ranker.js';
import { rankStudHiLoStreets } from '../../src/ranking/stud-hilo-street-ranker.js';
import { rankRazzStreets } from '../../src/ranking/razz-street-ranker.js';
import { handOfFiveEvalIndexed } from '../../../src/pokerEvaluator5.js';
import { handOfFiveEvalLow_Ato5Indexed } from '../../../src/pokerEvaluator5.js';
import { HighEvaluator } from '../../../src/core/HighEvaluator.js';
import { LowAto5Evaluator } from '../../../src/core/LowEvaluator.js';
import { fastHashesCreators } from '../../../src/pokerHashes7.js';

describe('Stud Street Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
  });

  it('ranks all 1755 stud hands by 7th street average rank', () => {
    const evaluator = new HighEvaluator();
    const evalFn7 = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

    const result = rankStudStreets(handOfFiveEvalIndexed, evalFn7, 1, 42);
    expect(result.gameType).toBe('7card-stud');
    expect(result.hands.length).toBe(1755);
    expect(result.hands[0]!.seventh.averageRank).toBeGreaterThanOrEqual(
      result.hands[result.hands.length - 1]!.seventh.averageRank,
    );
  });
});

describe('Stud Hi/Lo Street Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.high();
    fastHashesCreators.low8();
  });

  it('ranks all 1755 stud hi/lo hands by 7th street equity', () => {
    const result = rankStudHiLoStreets(1, 1, 42);
    expect(result.gameType).toBe('stud-hi-lo');
    expect(result.hands.length).toBe(1755);
    expect(result.hands[0]!.seventh.equity).toBeGreaterThanOrEqual(
      result.hands[result.hands.length - 1]!.seventh.equity,
    );
    expect(result.hands[0]!.seventh.highWinPct).toBeDefined();
  });
});

describe('Razz Street Ranker', () => {
  beforeAll(() => {
    fastHashesCreators.Ato5();
  });

  it('ranks all 1755 razz hands by 7th street average rank', () => {
    const evaluator = new LowAto5Evaluator();
    const evalFn7 = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

    const result = rankRazzStreets(handOfFiveEvalLow_Ato5Indexed, evalFn7, 1, 42);
    expect(result.gameType).toBe('razz');
    expect(result.hands.length).toBe(1755);
    expect(result.hands[0]!.seventh.averageRank).toBeGreaterThanOrEqual(
      result.hands[result.hands.length - 1]!.seventh.averageRank,
    );
  });
});
