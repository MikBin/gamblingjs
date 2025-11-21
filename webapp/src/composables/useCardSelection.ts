import { ref, computed, readonly } from 'vue';

export function useCardSelection() {
  const selectedCards = ref<number[]>([]);
  const maxSelection = ref(7); // Default max for 7-card games

  const canSelectMore = computed(() => {
    return selectedCards.value.length < maxSelection.value;
  });

  const selectCard = (cardIndex: number) => {
    if (selectedCards.value.includes(cardIndex)) {
      removeCard(cardIndex);
    } else if (canSelectMore.value) {
      selectedCards.value.push(cardIndex);
    }
  };

  const removeCard = (cardIndex: number) => {
    const index = selectedCards.value.indexOf(cardIndex);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    }
  };

  const clearSelection = () => {
    selectedCards.value = [];
  };

  const setMaxSelection = (max: number) => {
    maxSelection.value = max;
    if (selectedCards.value.length > max) {
      selectedCards.value = selectedCards.value.slice(0, max);
    }
  };

  return {
    selectedCards: readonly(selectedCards),
    canSelectMore,
    selectCard,
    removeCard,
    clearSelection,
    setMaxSelection
  };
}
