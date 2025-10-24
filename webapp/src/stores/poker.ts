import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import {
  GameVariant,
  EvaluationRecord,
  GameStage,
  verboseHandInfo
} from '../types/poker';

export const usePokerStore = defineStore('poker', () => {
  // Game state
  const gameVariant = ref<GameVariant>(GameVariant.TEXAS_HOLDEM);
  const pocketCards = ref<number[]>([]);
  const communityCards = ref<number[]>([]);
  const gameStage = ref<GameStage['stage']>('preflop');

  // Evaluation results
  const currentHandRank = ref<number>(0);
  const handStrength = ref<number>(0);
  const evaluationResult = ref<verboseHandInfo | null>(null);

  // History
  const evaluationHistory = ref<EvaluationRecord[]>([]);

  // Computed properties
  const allCards = computed(() => [...pocketCards.value, ...communityCards.value]);
  const isHandComplete = computed(() => {
    return pocketCards.value.length === 2 && communityCards.value.length >= 3;
  });
  const canEvaluate = computed(() => {
    const totalCards = allCards.value.length;
    return totalCards >= 5 && totalCards <= 7;
  });

  // Actions
  const setGameVariant = (variant: GameVariant) => {
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
    if (pocketCards.value.length < 2 &&
        !pocketCards.value.includes(cardIndex) &&
        !communityCards.value.includes(cardIndex)) {
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

  const setEvaluationResult = (result: verboseHandInfo) => {
    evaluationResult.value = result;
    currentHandRank.value = result.handRank;
    handStrength.value = ((6185 - result.handRank) / 6185); // Normalize to 0-1
  };

  const saveToHistory = (notes?: string) => {
    if (!evaluationResult.value) return;

    const record: EvaluationRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      gameVariant: gameVariant.value,
      pocketCards: [...pocketCards.value],
      communityCards: [...communityCards.value],
      result: { ...evaluationResult.value },
      notes
    };

    evaluationHistory.value.unshift(record);

    // Limit history to 100 records
    if (evaluationHistory.value.length > 100) {
      evaluationHistory.value = evaluationHistory.value.slice(0, 100);
    }
  };

  const removeFromHistory = (id: string) => {
    const index = evaluationHistory.value.findIndex(record => record.id === id);
    if (index > -1) {
      evaluationHistory.value.splice(index, 1);
    }
  };

  const clearHistory = () => {
    evaluationHistory.value = [];
  };

  return {
    // State
    gameVariant,
    pocketCards,
    communityCards,
    gameStage,
    currentHandRank,
    handStrength,
    evaluationResult,
    evaluationHistory,

    // Computed
    allCards,
    isHandComplete,
    canEvaluate,

    // Actions
    setGameVariant,
    setPocketCards,
    setCommunityCards,
    addPocketCard,
    addCommunityCard,
    removePocketCard,
    removeCommunityCard,
    resetHand,
    setEvaluationResult,
    saveToHistory,
    removeFromHistory,
    clearHistory
  };
});
