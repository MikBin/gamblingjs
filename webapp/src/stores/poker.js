import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GameVariant } from '../types/poker';
export const usePokerStore = defineStore('poker', () => {
    // Game state
    const gameVariant = ref(GameVariant.TEXAS_HOLDEM);
    const pocketCards = ref([]);
    const communityCards = ref([]);
    const gameStage = ref('preflop');
    // Evaluation results
    const currentHandRank = ref(0);
    const handStrength = ref(0);
    const evaluationResult = ref(null);
    // History
    const evaluationHistory = ref([]);
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
    const setGameVariant = (variant) => {
        gameVariant.value = variant;
        resetHand();
    };
    const setPocketCards = (cards) => {
        pocketCards.value = [...cards];
    };
    const setCommunityCards = (cards) => {
        communityCards.value = [...cards];
        updateGameStage();
    };
    const addPocketCard = (cardIndex) => {
        if (pocketCards.value.length < 2 &&
            !pocketCards.value.includes(cardIndex) &&
            !communityCards.value.includes(cardIndex)) {
            pocketCards.value.push(cardIndex);
        }
    };
    const addCommunityCard = (cardIndex) => {
        if (communityCards.value.length < 5 &&
            !communityCards.value.includes(cardIndex) &&
            !pocketCards.value.includes(cardIndex)) {
            communityCards.value.push(cardIndex);
            updateGameStage();
        }
    };
    const removePocketCard = (index) => {
        pocketCards.value.splice(index, 1);
    };
    const removeCommunityCard = (index) => {
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
        }
        else if (communityCount === 3) {
            gameStage.value = 'flop';
        }
        else if (communityCount === 4) {
            gameStage.value = 'turn';
        }
        else if (communityCount === 5) {
            gameStage.value = 'river';
        }
    };
    const setEvaluationResult = (result) => {
        evaluationResult.value = result;
        currentHandRank.value = result.handRank;
        handStrength.value = ((6185 - result.handRank) / 6185); // Normalize to 0-1
    };
    const saveToHistory = (notes) => {
        if (!evaluationResult.value)
            return;
        const record = {
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
    const removeFromHistory = (id) => {
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
