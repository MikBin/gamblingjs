import { describe, it, expect, beforeEach } from 'vitest';
import { useCardSelection } from '../../src/composables/useCardSelection';

describe('useCardSelection', () => {
  let cardSelection: ReturnType<typeof useCardSelection>;

  beforeEach(() => {
    cardSelection = useCardSelection();
  });

  describe('initial state', () => {
    it('should initialize with empty selections', () => {
      expect(cardSelection.selectedPocketCards.value).toEqual([]);
      expect(cardSelection.selectedCommunityCards.value).toEqual([]);
      expect(cardSelection.hideCards.value).toBe(false);
    });

    it('should generate a deck of 52 cards', () => {
      expect(cardSelection.deck.value).toHaveLength(52);
    });
  });

  describe('card selection', () => {
    it('should select pocket cards up to max limit', () => {
      const success1 = cardSelection.selectPocketCard(0);
      const success2 = cardSelection.selectPocketCard(1);

      expect(success1).toBe(true);
      expect(success2).toBe(true);
      expect(cardSelection.selectedPocketCards.value).toEqual([0, 1]);
    });

    it('should not select more pocket cards than max', () => {
      cardSelection.selectPocketCard(0);
      cardSelection.selectPocketCard(1);
      const success3 = cardSelection.selectPocketCard(2);

      expect(success3).toBe(false);
      expect(cardSelection.selectedPocketCards.value).toHaveLength(2);
    });

    it('should select community cards up to max limit', () => {
      const success1 = cardSelection.selectCommunityCard(0);
      const success2 = cardSelection.selectCommunityCard(1);
      const success3 = cardSelection.selectCommunityCard(2);
      const success4 = cardSelection.selectCommunityCard(3);
      const success5 = cardSelection.selectCommunityCard(4);

      expect(success1).toBe(true);
      expect(success2).toBe(true);
      expect(success3).toBe(true);
      expect(success4).toBe(true);
      expect(success5).toBe(true);
      expect(cardSelection.selectedCommunityCards.value).toEqual([0, 1, 2, 3, 4]);
    });

    it('should not allow selecting the same card twice', () => {
      cardSelection.selectPocketCard(0);
      const success = cardSelection.selectCommunityCard(0);

      expect(success).toBe(false);
      expect(cardSelection.allSelectedCards.value).toEqual([0]);
    });
  });

  describe('card deselection', () => {
    it('should deselect pocket cards', () => {
      cardSelection.selectPocketCard(0);
      cardSelection.selectPocketCard(1);

      const success = cardSelection.deselectPocketCard(0);
      expect(success).toBe(true);
      expect(cardSelection.selectedPocketCards.value).toEqual([1]);
    });

    it('should deselect community cards', () => {
      cardSelection.selectCommunityCard(0);
      cardSelection.selectCommunityCard(1);

      const success = cardSelection.deselectCommunityCard(1);
      expect(success).toBe(true);
      expect(cardSelection.selectedCommunityCards.value).toEqual([0]);
    });
  });

  describe('toggle selection', () => {
    it('should toggle card selection', () => {
      const success1 = cardSelection.toggleCardSelection(0, true);
      expect(success1).toBe(true);
      expect(cardSelection.selectedPocketCards.value).toEqual([0]);

      const success2 = cardSelection.toggleCardSelection(0, true);
      expect(success2).toBe(true);
      expect(cardSelection.selectedPocketCards.value).toEqual([]);
    });
  });

  describe('clear functions', () => {
    it('should clear all cards', () => {
      cardSelection.selectPocketCard(0);
      cardSelection.selectCommunityCard(1);

      cardSelection.clearAllCards();
      expect(cardSelection.selectedPocketCards.value).toEqual([]);
      expect(cardSelection.selectedCommunityCards.value).toEqual([]);
    });
  });
});
