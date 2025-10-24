import { ref, computed, readonly } from 'vue';

export interface CardSelectionOptions {
  maxPocketCards?: number;
  maxCommunityCards?: number;
  allowDuplicates?: boolean;
}

export interface Card {
  id: number;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  selected: boolean;
}

export const useCardSelection = (options: CardSelectionOptions = {}) => {
  const {
    maxPocketCards = 2,
    maxCommunityCards = 5
  } = options;

  const selectedPocketCards = ref<number[]>([]);
  const selectedCommunityCards = ref<number[]>([]);
  const hideCards = ref(false);

  // Generate deck of 52 cards (0-51)
  const deck = computed(() => {
    const cards: Card[] = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

    for (let i = 0; i < 52; i++) {
      const suitIndex = Math.floor(i / 13);
      const rankIndex = i % 13;
      cards.push({
        id: i,
        suit: suits[suitIndex] as Card['suit'],
        rank: ranks[rankIndex],
        selected: selectedPocketCards.value.includes(i) || selectedCommunityCards.value.includes(i)
      });
    }
    return cards;
  });

  const allSelectedCards = computed(() =>
    [...selectedPocketCards.value, ...selectedCommunityCards.value]
  );

  const canSelectPocketCard = computed(() =>
    selectedPocketCards.value.length < maxPocketCards
  );

  const canSelectCommunityCard = computed(() =>
    selectedCommunityCards.value.length < maxCommunityCards
  );

  const isCardSelected = (cardId: number): boolean => {
    return allSelectedCards.value.includes(cardId);
  };

  const selectPocketCard = (cardId: number): boolean => {
    if (!canSelectPocketCard.value || isCardSelected(cardId)) {
      return false;
    }

    selectedPocketCards.value.push(cardId);
    return true;
  };

  const selectCommunityCard = (cardId: number): boolean => {
    if (!canSelectCommunityCard.value || isCardSelected(cardId)) {
      return false;
    }

    selectedCommunityCards.value.push(cardId);
    return true;
  };

  const deselectPocketCard = (index: number): boolean => {
    if (index < 0 || index >= selectedPocketCards.value.length) {
      return false;
    }

    selectedPocketCards.value.splice(index, 1);
    return true;
  };

  const deselectCommunityCard = (index: number): boolean => {
    if (index < 0 || index >= selectedCommunityCards.value.length) {
      return false;
    }

    selectedCommunityCards.value.splice(index, 1);
    return true;
  };

  const toggleCardSelection = (cardId: number, isPocket: boolean = true): boolean => {
    if (isCardSelected(cardId)) {
      // Deselect
      const pocketIndex = selectedPocketCards.value.indexOf(cardId);
      if (pocketIndex !== -1) {
        return deselectPocketCard(pocketIndex);
      }

      const communityIndex = selectedCommunityCards.value.indexOf(cardId);
      if (communityIndex !== -1) {
        return deselectCommunityCard(communityIndex);
      }

      return false;
    } else {
      // Select
      if (isPocket && canSelectPocketCard.value) {
        return selectPocketCard(cardId);
      } else if (!isPocket && canSelectCommunityCard.value) {
        return selectCommunityCard(cardId);
      }
      return false;
    }
  };

  const clearPocketCards = () => {
    selectedPocketCards.value = [];
  };

  const clearCommunityCards = () => {
    selectedCommunityCards.value = [];
  };

  const clearAllCards = () => {
    clearPocketCards();
    clearCommunityCards();
  };

  const setPocketCards = (cards: number[]) => {
    selectedPocketCards.value = [...cards.slice(0, maxPocketCards)];
  };

  const setCommunityCards = (cards: number[]) => {
    selectedCommunityCards.value = [...cards.slice(0, maxCommunityCards)];
  };

  const toggleHideCards = () => {
    hideCards.value = !hideCards.value;
  };

  const revealCards = () => {
    hideCards.value = false;
  };

  return {
    // State
    selectedPocketCards: readonly(selectedPocketCards),
    selectedCommunityCards: readonly(selectedCommunityCards),
    hideCards: readonly(hideCards),

    // Computed
    deck,
    allSelectedCards,
    canSelectPocketCard,
    canSelectCommunityCard,

    // Actions
    selectPocketCard,
    selectCommunityCard,
    deselectPocketCard,
    deselectCommunityCard,
    toggleCardSelection,
    clearPocketCards,
    clearCommunityCards,
    clearAllCards,
    setPocketCards,
    setCommunityCards,
    toggleHideCards,
    revealCards,
    isCardSelected
  };
};
