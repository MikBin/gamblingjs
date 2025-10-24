import { vi, expect } from 'vitest';
import { HiLowVerboseHandInfo, verboseHandInfo } from '../src/interfaces';

// Type-safe mock implementations
export interface MockEvaluator {
  evaluate: ReturnType<typeof vi.fn>;
  evaluateHigh: ReturnType<typeof vi.fn>;
  evaluateLow: ReturnType<typeof vi.fn>;
  compareHands: ReturnType<typeof vi.fn>;
}

export interface MockCardUtils {
  cardToString: ReturnType<typeof vi.fn>;
  stringToCard: ReturnType<typeof vi.fn>;
  isValidCard: ReturnType<typeof vi.fn>;
  getCardSuit: ReturnType<typeof vi.fn>;
  getCardRank: ReturnType<typeof vi.fn>;
}

// Factory functions for creating type-safe mocks
export const createMockEvaluator = (): MockEvaluator => ({
  evaluate: vi.fn(),
  evaluateHigh: vi.fn(),
  evaluateLow: vi.fn(),
  compareHands: vi.fn()
});

export const createMockCardUtils = (): MockCardUtils => ({
  cardToString: vi.fn(),
  stringToCard: vi.fn(),
  isValidCard: vi.fn(),
  getCardSuit: vi.fn(),
  getCardRank: vi.fn()
});

// Type-safe test data generators
export const generateRandomHand = (): number[] => {
  const cards = new Set<number>();
  while (cards.size < 2) {
    cards.add(Math.floor(Math.random() * 52));
  }
  return Array.from(cards);
};

export const generateRandomBoard = (size: number = 5): number[] => {
  const cards = new Set<number>();
  while (cards.size < size) {
    cards.add(Math.floor(Math.random() * 52));
  }
  return Array.from(cards);
};

export const generateRandomSevenCardHand = (): number[] => {
  const cards = new Set<number>();
  while (cards.size < 7) {
    cards.add(Math.floor(Math.random() * 52));
  }
  return Array.from(cards);
};

// Type-safe test data builders
export const createVerboseHandInfo = (
  hand: number[],
  handRank: number,
  faces: string,
  handGroup: string,
  flushSuit: string | number = "no flush",
  winningCards: (number | string)[] = []
): verboseHandInfo => ({
  hand,
  handRank,
  faces,
  handGroup,
  flushSuit,
  winningCards
});

export const createHiLowVerboseHandInfo = (
  hi: verboseHandInfo,
  low: verboseHandInfo
): HiLowVerboseHandInfo => ({
  hi,
  low
});

// Type-safe assertion helpers
export const expectHandToBeValid = (hand: number[]): void => {
  expect(Array.isArray(hand)).toBe(true);
  expect(hand).toHaveLength(2);
  hand.forEach(card => {
    expect(typeof card).toBe('number');
    expect(card).toBeGreaterThanOrEqual(0);
    expect(card).toBeLessThanOrEqual(51);
  });
};

export const expectBoardToBeValid = (board: number[], expectedLength: number = 5): void => {
  expect(Array.isArray(board)).toBe(true);
  expect(board).toHaveLength(expectedLength);
  board.forEach(card => {
    expect(typeof card).toBe('number');
    expect(card).toBeGreaterThanOrEqual(0);
    expect(card).toBeLessThanOrEqual(51);
  });
};

export const expectHandRankToBeValid = (rank: number): void => {
  expect(typeof rank).toBe('number');
  expect(rank).toBeGreaterThanOrEqual(0);
  expect(rank).toBeLessThanOrEqual(9);
};

// Performance testing utilities
export const measureExecutionTime = async <T>(
  fn: () => Promise<T> | T,
  iterations: number = 1000
): Promise<{ result: T; averageTime: number; totalTime: number }> => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    times.push(end - start);

    if (i === 0) {
      var finalResult = result;
    }
  }

  const totalTime = times.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / iterations;

  return {
    result: finalResult!,
    averageTime,
    totalTime
  };
};

// Test data validation helpers
export const validateTestDataStructure = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;

  // Check if it has the expected structure for test data
  if (data.inputs && data.output) {
    return validateTestCase(data);
  }

  // Check if it's a collection of test cases
  return Object.values(data).every((testCases: any) =>
    Array.isArray(testCases) && testCases.every(validateTestCase)
  );
};

const validateTestCase = (testCase: any): boolean => {
  return (
    testCase.inputs &&
    typeof testCase.inputs === 'object' &&
    testCase.output &&
    typeof testCase.output === 'object' &&
    testCase.output.hi &&
    testCase.output.low
  );
};
