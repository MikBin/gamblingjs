import { describe, it, expect } from 'vitest';
import {
  getCardFromIndex,
  getCardImagePath,
  formatCardString,
  validateCardSelection,
  getAvailableCards,
  getHandDescription
} from '../../src/utils/cardUtils';

describe('cardUtils', () => {
  describe('getCardFromIndex', () => {
    it('should return correct card for index 0', () => {
      const card = getCardFromIndex(0);
      expect(card.index).toBe(0);
      expect(card.rank).toBe('A');
      expect(card.suit).toBe('♠');
      expect(card.color).toBe('black');
    });

    it('should return correct card for index 26', () => {
      const card = getCardFromIndex(26);
      expect(card.index).toBe(26);
      expect(card.rank).toBe('A');
      expect(card.suit).toBe('♥');
      expect(card.color).toBe('red');
    });
  });

  describe('getCardImagePath', () => {
    it('should return correct image path for card index', () => {
      const path = getCardImagePath(0);
      expect(path).toBe('/assets/cards/As-min.png');
    });

    it('should return correct image path for 10 card', () => {
      const path = getCardImagePath(9); // 10 of spades
      expect(path).toBe('/assets/cards/Ts-min.png');
    });
  });

  describe('formatCardString', () => {
    it('should format card correctly', () => {
      const formatted = formatCardString(0);
      expect(formatted).toBe('A♠');
    });
  });

  describe('validateCardSelection', () => {
    it('should validate valid selection', () => {
      const result = validateCardSelection([0, 1, 2]);
      expect(result.isValid).toBe(true);
    });

    it('should reject duplicate cards', () => {
      const result = validateCardSelection([0, 0, 1]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Duplicate cards selected');
    });

    it('should reject more than 7 cards', () => {
      const cards = Array.from({ length: 8 }, (_, i) => i);
      const result = validateCardSelection(cards);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Cannot select more than 7 cards');
    });
  });

  describe('getAvailableCards', () => {
    it('should return all cards when none selected', () => {
      const available = getAvailableCards([]);
      expect(available).toHaveLength(52);
      expect(available[0]).toBe(0);
      expect(available[51]).toBe(51);
    });

    it('should exclude selected cards', () => {
      const available = getAvailableCards([0, 1]);
      expect(available).toHaveLength(50);
      expect(available).not.toContain(0);
      expect(available).not.toContain(1);
    });
  });

  describe('getHandDescription', () => {
    it('should return Royal Flush for high rank', () => {
      const description = getHandDescription(6185);
      expect(description).toBe('Royal Flush');
    });

    it('should return High Card for low rank', () => {
      const description = getHandDescription(0);
      expect(description).toBe('High Card');
    });
  });
});
