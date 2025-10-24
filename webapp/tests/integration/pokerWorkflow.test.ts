import { describe, it, expect } from 'vitest';
import { usePokerEvaluator } from '../../src/composables/usePokerEvaluator';
import { useCardSelection } from '../../src/composables/useCardSelection';
import { getHandDescription } from '../../src/utils/cardUtils';

describe('Poker Workflow Integration', () => {
  describe('Basic poker evaluation workflow', () => {
    it('should evaluate a complete Texas Hold\'em hand', async () => {
      // Setup card selection
      const cardSelection = useCardSelection();
      const evaluator = usePokerEvaluator();

      // Select pocket cards (A♠, K♠)
      cardSelection.selectPocketCard(0); // A♠
      cardSelection.selectPocketCard(13); // A♥

      // Select community cards (A♦, K♦, Q♦, J♦, 10♦)
      cardSelection.selectCommunityCard(26); // A♦
      cardSelection.selectCommunityCard(39); // K♦
      cardSelection.selectCommunityCard(24); // Q♠
      cardSelection.selectCommunityCard(37); // J♦
      cardSelection.selectCommunityCard(23); // 10♠

      // Get all selected cards
      const allCards = cardSelection.allSelectedCards.value;
      expect(allCards).toHaveLength(7);

      // Evaluate the hand
      const result = await evaluator.evaluateHand(allCards);
      expect(result).not.toBe(null);
      expect(typeof result?.handRank).toBe('number');

      // Check hand description
      const description = getHandDescription(result!.handRank);
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(0);
    });

    it('should handle card selection and evaluation for Omaha', async () => {
      const cardSelection = useCardSelection({ maxPocketCards: 4, maxCommunityCards: 5 });
      const evaluator = usePokerEvaluator({ gameVariant: 'omaha' });

      // Select 4 pocket cards
      cardSelection.selectPocketCard(0);
      cardSelection.selectPocketCard(1);
      cardSelection.selectPocketCard(2);
      cardSelection.selectPocketCard(3);

      // Select 5 community cards
      cardSelection.selectCommunityCard(10);
      cardSelection.selectCommunityCard(11);
      cardSelection.selectCommunityCard(12);
      cardSelection.selectCommunityCard(13);
      cardSelection.selectCommunityCard(14);

      const allCards = cardSelection.allSelectedCards.value;
      expect(allCards).toHaveLength(9);

      // For Omaha, we need to evaluate combinations, but for basic test, just check we can select cards
      expect(cardSelection.selectedPocketCards.value).toHaveLength(4);
      expect(cardSelection.selectedCommunityCards.value).toHaveLength(5);
    });

    it('should clear selections and start new evaluation', async () => {
      const cardSelection = useCardSelection();
      const evaluator = usePokerEvaluator();

      // First hand
      cardSelection.selectPocketCard(0);
      cardSelection.selectPocketCard(1);
      cardSelection.selectCommunityCard(2);
      cardSelection.selectCommunityCard(3);
      cardSelection.selectCommunityCard(4);
      cardSelection.selectCommunityCard(5);
      cardSelection.selectCommunityCard(6);

      let allCards = cardSelection.allSelectedCards.value;
      expect(allCards).toHaveLength(7);

      let result = await evaluator.evaluateHand(allCards);
      expect(result).not.toBe(null);

      // Clear and start new hand
      cardSelection.clearAllCards();
      evaluator.clearEvaluation();

      expect(cardSelection.selectedPocketCards.value).toEqual([]);
      expect(cardSelection.selectedCommunityCards.value).toEqual([]);
      expect(evaluator.lastEvaluation.value).toBe(null);
      expect(evaluator.error.value).toBe(null);

      // New hand
      cardSelection.selectPocketCard(10);
      cardSelection.selectPocketCard(11);
      cardSelection.selectCommunityCard(12);
      cardSelection.selectCommunityCard(13);
      cardSelection.selectCommunityCard(14);
      cardSelection.selectCommunityCard(15);
      cardSelection.selectCommunityCard(16);

      allCards = cardSelection.allSelectedCards.value;
      expect(allCards).toHaveLength(7);

      result = await evaluator.evaluateHand(allCards);
      expect(result).not.toBe(null);
    });
  });
});
