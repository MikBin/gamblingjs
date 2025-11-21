<template>
  <div class="card-selector p-4 bg-base-200 rounded-xl shadow-lg">
    <div class="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center">
      <h3 class="text-xl font-bold">Select Cards</h3>

      <div class="flex gap-2">
         <select v-model="filterSuit" class="select select-bordered select-sm">
            <option value="">All Suits</option>
            <option value="hearts">Hearts</option>
            <option value="diamonds">Diamonds</option>
            <option value="clubs">Clubs</option>
            <option value="spades">Spades</option>
         </select>
         <button @click="emit('clear')" class="btn btn-sm btn-error">Clear</button>
      </div>
    </div>

    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
      <Card
        v-for="cardIndex in filteredCards"
        :key="cardIndex"
        :card-index="cardIndex"
        :is-selected="selectedCards.includes(cardIndex)"
        :is-disabled="isCardDisabled(cardIndex)"
        size="small"
        @click="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from './Card.vue';

const props = defineProps({
  selectedCards: {
    type: Array as () => number[],
    default: () => []
  },
  disabledCards: {
    type: Array as () => number[],
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: 52
  }
});

const emit = defineEmits(['select', 'clear']);

const filterSuit = ref('');

const allCards = Array.from({ length: 52 }, (_, i) => i);

const filteredCards = computed(() => {
  if (!filterSuit.value) return allCards;

  // 0-12 clubs, 13-25 diamonds, 26-38 hearts, 39-51 spades (Assuming this order based on utils)
  // Let's match the order in cardUtils.ts: ['clubs', 'diamonds', 'hearts', 'spades']
  // clubs: 0, diamonds: 1, hearts: 2, spades: 3

  const suitMap: Record<string, number> = {
    'clubs': 0,
    'diamonds': 1,
    'hearts': 2,
    'spades': 3
  };

  const targetSuitIndex = suitMap[filterSuit.value];
  return allCards.filter(idx => Math.floor(idx / 13) === targetSuitIndex);
});

const isCardDisabled = (cardIndex: number) => {
  // Disabled if already used somewhere else (passed in disabledCards)
  // BUT if it is in selectedCards (this component's selection), it shouldn't be disabled, it should be toggleable (deselected).
  // Unless disabledCards includes selectedCards? Usually disabledCards means "unavailable".

  return props.disabledCards.includes(cardIndex) && !props.selectedCards.includes(cardIndex);
};

const handleCardClick = (cardIndex: number) => {
  if (isCardDisabled(cardIndex)) return;
  emit('select', cardIndex);
};
</script>
