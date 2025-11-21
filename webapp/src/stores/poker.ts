import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { verboseHandInfo } from '@gamblingjs';

export const usePokerStore = defineStore('poker', () => {
  // Game state
  const gameVariant = ref('texas-holdem'); // string or enum
  const pocketCards = ref<number[]>([]);
  const communityCards = ref<number[]>([]);
  const gameStage = ref<'preflop' | 'flop' | 'turn' | 'river'>('preflop');

  // Evaluation results
  const currentHandRank = ref<number>(0);
  const handStrength = ref<number>(0);
  const evaluationResult = ref<any | null>(null);

  // History
  const evaluationHistory = ref<any[]>([]);

  // Computed properties
  const allCards = computed(() => [...pocketCards.value, ...communityCards.value]);
  const isHandComplete = computed(() => {
    return pocketCards.value.length === 2 && communityCards.value.length >= 3;
  });

  const canEvaluate = computed(() => {
    // 5 to 7 cards usually
    return allCards.value.length >= 5 && allCards.value.length <= 7;
  });

  // Actions
  const setGameVariant = (variant: string) => {
    gameVariant.value = variant;
    resetHand();
  };

  const setPocketCards = (cards: number[]) => {
    pocketCards.value = [...cards];
  };

  const setCommunityCards = (cards: number[]) => {
    communityCards.value = [...cards];
    updateGameStage();
  };

  const addPocketCard = (cardIndex: number) => {
    if (pocketCards.value.length < 2 && !pocketCards.value.includes(cardIndex) && !communityCards.value.includes(cardIndex)) {
      pocketCards.value.push(cardIndex);
    }
  };

  const addCommunityCard = (cardIndex: number) => {
    if (communityCards.value.length < 5 &&
        !communityCards.value.includes(cardIndex) &&
        !pocketCards.value.includes(cardIndex)) {
      communityCards.value.push(cardIndex);
      updateGameStage();
    }
  };

  const removePocketCard = (index: number) => {
    pocketCards.value.splice(index, 1);
  };

  const removeCommunityCard = (index: number) => {
    communityCards.value.splice(index, 1);
    updateGameStage();
  };

  const resetHand = () => {
    pocketCards.value = [];
    communityCards.value = [];
    gameStage.value = 'preflop';
    evaluationResult.value = null;
    currentHandRank.value = 0;
    handStrength.value = 0;
  };

  const updateGameStage = () => {
    const communityCount = communityCards.value.length;
    if (communityCount === 0) {
      gameStage.value = 'preflop';
    } else if (communityCount === 3) {
      gameStage.value = 'flop';
    } else if (communityCount === 4) {
      gameStage.value = 'turn';
    } else if (communityCount === 5) {
      gameStage.value = 'river';
    }
  };

  const setEvaluationResult = (result: any) => {
    evaluationResult.value = result;
    if (result && typeof result.handRank === 'number') {
        currentHandRank.value = result.handRank;
        handStrength.value = (6185 - result.handRank) / 6185; // Normalize to 0-1
    }
  };

  return {
    gameVariant,
    pocketCards,
    communityCards,
    gameStage,
    currentHandRank,
    handStrength,
    evaluationResult,
    evaluationHistory,
    allCards,
    isHandComplete,
    canEvaluate,
    setGameVariant,
    setPocketCards,
    setCommunityCards,
    addPocketCard,
    addCommunityCard,
    removePocketCard,
    removeCommunityCard,
    resetHand,
    setEvaluationResult
  };
});
