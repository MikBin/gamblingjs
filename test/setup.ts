import { expect, vi } from 'vitest';

// Custom matchers for poker-specific assertions
expect.extend({
  toBeValidHand(received: any) {
    const pass = Array.isArray(received) && received.length === 2 && received.every(card => typeof card === 'number');
    return {
      pass,
      message: () => pass ? 'Expected hand to be invalid' : 'Expected hand to be valid (array of 2 numbers)'
    };
  },

  toBeValidCard(received: any) {
    const pass = typeof received === 'number' && received >= 0 && received <= 51;
    return {
      pass,
      message: () => pass ? 'Expected card to be invalid' : 'Expected card to be valid (number 0-51)'
    };
  },

  toBeValidHandRank(received: any) {
    const pass = typeof received === 'number' && received >= 0 && received <= 9;
    return {
      pass,
      message: () => pass ? 'Expected hand rank to be invalid' : 'Expected hand rank to be valid (number 0-9)'
    };
  }
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidHand(): T;
      toBeValidCard(): T;
      toBeValidHandRank(): T;
    }
  }
}

// Mock implementations for common dependencies
export const createMockEvaluator = () => ({
  evaluate: vi.fn(),
  evaluateHigh: vi.fn(),
  evaluateLow: vi.fn(),
  compareHands: vi.fn()
});

export const createMockCardUtils = () => ({
  cardToString: vi.fn(),
  stringToCard: vi.fn(),
  isValidCard: vi.fn(),
  getCardSuit: vi.fn(),
  getCardRank: vi.fn()
});

// Test data generators
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
