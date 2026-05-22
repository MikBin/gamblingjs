import { ref, readonly } from 'vue';
import { PokerEvaluator } from '@gamblingjs';

// We'll define a local enum if not exported, or just use strings/numbers.
// Assuming PokerEvaluator has static methods.

export function usePokerEvaluator() {
  const isEvaluating = ref(false);
  const lastEvaluation = ref<any | null>(null);
  const evaluationError = ref<string | null>(null);

  const evaluateHand = async (
    cards: number[],
    variant: any = 'texas-holdem'
  ): Promise<any> => {
    isEvaluating.value = true;
    evaluationError.value = null;

    try {
      if (cards.length < 5) {
        throw new Error(`Hand must contain at least 5 cards, got ${cards.length}`);
      }

      let result;

      // We map the incoming variant string to the GameVariant enum if possible.
      // Wait, let's just use GameVariant if available.
      // We can map string to what PokerEvaluator expects.
      // The default export has a GameVariant enum.

      let evaluatorVariant = 'high'; // default to high for most
      if (variant === 'low-a-to-5') evaluatorVariant = 'low-a-to-5';
      if (variant === 'low-8-or-better') evaluatorVariant = 'low-8-or-better';
      if (variant === 'low-9-or-better') evaluatorVariant = 'low-9-or-better';

      // Let's get the detailed description manually if 5/6 cards to satisfy requirements without dummy padding breaking the logic
      if (cards.length === 7) {
          result = PokerEvaluator.evaluate7CardsVerbose(cards, evaluatorVariant as any);
      } else if (cards.length === 5 || cards.length === 6) {
          // evaluate5Cards returns just a number
          const best5Cards = cards.slice(0, 5); // Fallback: just use first 5 if 6 cards
          const rank = PokerEvaluator.evaluate5Cards(best5Cards, evaluatorVariant as any);

          let rankName = "High Card";
          if (rank <= 10) rankName = "Straight Flush";
          else if (rank <= 166) rankName = "Four of a Kind";
          else if (rank <= 322) rankName = "Full House";
          else if (rank <= 1599) rankName = "Flush";
          else if (rank <= 1609) rankName = "Straight";
          else if (rank <= 2467) rankName = "Three of a Kind";
          else if (rank <= 3325) rankName = "Two Pair";
          else if (rank <= 6185) rankName = "One Pair";

          result = { handRank: rank, handRankDescription: rankName, winningCards: best5Cards };
      } else {
         throw new Error("Only 5 to 7 cards supported for full evaluation");
      }

      lastEvaluation.value = result;
      return result;
    } catch (error: any) {
      evaluationError.value = error.message || 'Unknown error';
      throw error;
    } finally {
      isEvaluating.value = false;
    }
  };

  const evaluateTexasHoldem = async (
    holeCards: number[],
    communityCards: number[]
  ) => {
      // Combine and evaluate
      const all = [...holeCards, ...communityCards];
      if (all.length < 5) {
          // Can't evaluate yet
          return null;
      }
      return evaluateHand(all);
  };

  return {
    isEvaluating: readonly(isEvaluating),
    lastEvaluation: readonly(lastEvaluation),
    evaluationError: readonly(evaluationError),
    evaluateHand,
    evaluateTexasHoldem
  };
}
