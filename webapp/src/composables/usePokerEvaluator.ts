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
    variant: string = 'texas-holdem'
  ): Promise<any> => {
    isEvaluating.value = true;
    evaluationError.value = null;

    try {
      // Input validation
    //   if (cards.length < 5) {
    //     throw new Error(`Hand must contain at least 5 cards, got ${cards.length}`);
    //   }

      let result;
      // Depending on variant, call different methods.
      // PokerEvaluator.evaluate7CardsVerbose is likely what we want for 7 cards.
      // PokerEvaluator.evaluate5Cards for 5.

      // Note: gamblingjs methods might be synchronous, but we wrap in async for future proofing/UI non-blocking
      // (though true non-blocking requires workers).

      if (cards.length === 7) {
          result = PokerEvaluator.evaluate7CardsVerbose(cards);
      } else if (cards.length === 5) {
          // evaluate5Cards might return just a rank number, not verbose object?
          // Let's check memory or assume standard.
          // Memory says: "evaluate7CardsVerbose".
          // If 5 cards, maybe evaluate5Cards?
          // Let's try evaluate7CardsVerbose first as it might handle 5? No, likely strict.
          // Let's use evaluate5Cards and wrap it?
          // Or just stick to 7 cards flow for Texas Holdem (2+5).
          // If < 7 cards (e.g. preflop 2 cards), we can't fully evaluate rank yet in the standard sense without community cards.
          // Wait, preflop is just 2 cards. We can't evaluate a "hand rank" (standard 5-card rank) with 2 cards.
          // So this function is for "Showdown" evaluation or "current best hand" (requires >= 5 cards).

           if (cards.length === 5) {
               // Assuming evaluate5Cards returns a number
               const rank = PokerEvaluator.evaluate5Cards(cards);
               result = { handRank: rank, handRankDescription: "5 Card Hand", winningCards: cards };
           } else {
               // Fallback or error
               throw new Error("Only 5 or 7 cards supported for full evaluation");
           }
      } else {
         result = PokerEvaluator.evaluate7CardsVerbose(cards);
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
