import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePokerEvaluator } from '../../src/composables/usePokerEvaluator';
import { PokerEvaluator } from '@gamblingjs';

// We mock the gamblingjs PokerEvaluator since we just want to test the composable's logic
vi.mock('@gamblingjs', () => {
  return {
    PokerEvaluator: {
      evaluate7CardsVerbose: vi.fn(),
      evaluate5Cards: vi.fn(),
    }
  };
});

describe('usePokerEvaluator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { isEvaluating, lastEvaluation, evaluationError } = usePokerEvaluator();
    expect(isEvaluating.value).toBe(false);
    expect(lastEvaluation.value).toBeNull();
    expect(evaluationError.value).toBeNull();
  });

  it('rejects hands with less than 5 cards', async () => {
    const { evaluateHand } = usePokerEvaluator();
    await expect(evaluateHand([0, 1, 2, 3])).rejects.toThrow(/least 5 cards/);
  });

  it('calls evaluate5Cards for 5 card hands', async () => {
    const mockResult = 5000;
    vi.mocked(PokerEvaluator.evaluate5Cards).mockReturnValue(mockResult);

    const { evaluateHand, lastEvaluation } = usePokerEvaluator();
    const result = await evaluateHand([0, 1, 2, 3, 4], 'texas-holdem');

    expect(PokerEvaluator.evaluate5Cards).toHaveBeenCalledWith([0, 1, 2, 3, 4], 'high');
    expect(result.handRank).toBe(mockResult);
    expect(lastEvaluation.value).toEqual(result);
  });

  it('calls evaluate7CardsVerbose for 7 card hands', async () => {
    const mockResult = { handRank: 123, handRankDescription: 'Full House' };
    vi.mocked(PokerEvaluator.evaluate7CardsVerbose).mockReturnValue(mockResult as any);

    const { evaluateHand, lastEvaluation } = usePokerEvaluator();
    const result = await evaluateHand([0, 1, 2, 3, 4, 5, 6], 'texas-holdem');

    expect(PokerEvaluator.evaluate7CardsVerbose).toHaveBeenCalledWith([0, 1, 2, 3, 4, 5, 6], 'high');
    expect(result).toStrictEqual(mockResult);
    expect(lastEvaluation.value).toStrictEqual(mockResult);
  });
});
