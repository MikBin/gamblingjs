<template>
  <div class="card-selector">
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p v-if="description" class="text-sm text-base-content/70 mb-4">{{ description }}</p>
    </div>

    <!-- Card Grid -->
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 mb-6">
      <PokerCard
        v-for="cardIndex in availableCards"
        :key="cardIndex"
        :card-index="cardIndex"
        :is-selected="selectedCards.includes(cardIndex)"
        :is-disabled="disabledCards.includes(cardIndex)"
        :size="cardSize"
        @click="handleCardClick"
      />
    </div>

    <!-- Selected Cards Display -->
    <div v-if="selectedCards.length > 0" class="mb-4">
      <h4 class="text-md font-medium mb-2">Selected Cards:</h4>
      <div class="flex flex-wrap gap-2">
        <PokerCard
          v-for="cardIndex in selectedCards"
          :key="`selected-${cardIndex}`"
          :card-index="cardIndex"
          :is-selected="true"
          :size="cardSize"
          @click="handleCardRemove"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        v-if="selectedCards.length > 0"
        class="btn btn-outline btn-error"
        @click="clearSelection"
      >
        Clear Selection
      </button>
      <button
        v-if="selectedCards.length > 0"
        class="btn btn-primary"
        :disabled="!isValidSelection"
        @click="confirmSelection"
      >
        Confirm ({{ selectedCards.length }} cards)
      </button>
    </div>

    <!-- Validation Error -->
    <div v-if="validationError" class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m6 4a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ validationError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PokerCard from './PokerCard.vue';
import { getAvailableCards, validateCardSelection } from '../utils/cardUtils';

interface Props {
  title?: string;
  description?: string;
  modelValue?: number[];
  disabledCards?: number[];
  maxSelection?: number;
  cardSize?: 'small' | 'medium' | 'large';
  autoValidate?: boolean;
}

interface Emits {
  (_e: 'update:modelValue', _cards: number[]): void;
  (_e: 'selection-change', _cards: number[]): void;
  (_e: 'confirm', _cards: number[]): void;
  (_e: 'clear'): void;
}

const emit = defineEmits<Emits>();

const props = withDefaults(defineProps<Props>(), {
  title: 'Select Cards',
  description: '',
  modelValue: () => [],
  disabledCards: () => [],
  maxSelection: 7,
  cardSize: 'medium',
  autoValidate: true
});


const selectedCards = ref<number[]>([...props.modelValue]);
const validationError = ref<string>('');

// Compute available cards (excluding disabled and selected)
const availableCards = computed(() => {
  return getAvailableCards([...props.disabledCards, ...selectedCards.value]);
});

// Validate selection
const isValidSelection = computed(() => {
  if (!props.autoValidate) return true;

  const validation = validateCardSelection(selectedCards.value);
  return validation.isValid;
});

watch(selectedCards, (newSelection) => {
  if (props.autoValidate) {
    const validation = validateCardSelection(newSelection);
    validationError.value = validation.error || '';
  }
});

// Handle card click
const handleCardClick = (cardIndex: number) => {
  if (props.disabledCards.includes(cardIndex)) return;

  const index = selectedCards.value.indexOf(cardIndex);
  if (index > -1) {
    // Remove card if already selected
    selectedCards.value.splice(index, 1);
  } else if (selectedCards.value.length < props.maxSelection) {
    // Add card if under max selection
    selectedCards.value.push(cardIndex);
  }

  emitUpdate();
};

// Handle card removal from selected cards
const handleCardRemove = (cardIndex: number) => {
  const index = selectedCards.value.indexOf(cardIndex);
  if (index > -1) {
    selectedCards.value.splice(index, 1);
    emitUpdate();
  }
};

// Clear selection
const clearSelection = () => {
  selectedCards.value = [];
  validationError.value = '';
  emitUpdate();
  emit('clear');
};

// Confirm selection
const confirmSelection = () => {
  if (isValidSelection.value) {
    emit('confirm', [...selectedCards.value]);
  }
};

// Emit update to parent
const emitUpdate = () => {
  emit('update:modelValue', [...selectedCards.value]);
  emit('selection-change', [...selectedCards.value]);
};

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedCards.value = [...newValue];
}, { deep: true });
</script>

<style scoped>
.card-selector {
  @apply p-4 bg-base-200 rounded-lg shadow-md;
}
</style>
