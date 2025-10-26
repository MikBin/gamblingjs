<template>
  <div class="hand-display">
    <!-- Pocket Cards -->
    <div v-if="showPocketCards" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Pocket Cards</h3>
      <div class="flex gap-2 justify-center">
        <div
          v-for="(card, index) in pocketCards"
          :key="`pocket-${index}`"
          class="relative"
        >
          <Card
            :card-index="card"
            :is-face-down="hidePocketCards && index >= revealFrom"
            :size="cardSize"
            :is-disabled="disabled"
          />
          <div v-if="index === 0 && pocketCards.length === 2" class="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {{ handLabel }}
          </div>
        </div>
      </div>
    </div>

    <!-- Community Cards -->
    <div v-if="showCommunityCards && communityCards.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Community Cards</h3>

      <!-- Flop -->
      <div v-if="communityCards.length >= 3" class="mb-4">
        <h4 class="text-md font-medium mb-2">Flop</h4>
        <div class="flex gap-2 justify-center">
          <Card
            v-for="(card, index) in communityCards.slice(0, 3)"
            :key="`flop-${index}`"
            :card-index="card"
            :size="cardSize"
            :is-disabled="disabled"
          />
        </div>
      </div>

      <!-- Turn -->
      <div v-if="communityCards.length >= 4" class="mb-4">
        <h4 class="text-md font-medium mb-2">Turn</h4>
        <div class="flex gap-2 justify-center">
          <Card
            :key="`turn`"
            :card-index="communityCards[3]"
            :size="cardSize"
            :is-disabled="disabled"
          />
        </div>
      </div>

      <!-- River -->
      <div v-if="communityCards.length >= 5" class="mb-4">
        <h4 class="text-md font-medium mb-2">River</h4>
        <div class="flex gap-2 justify-center">
          <Card
            :key="`river`"
            :card-index="communityCards[4]"
            :size="cardSize"
            :is-disabled="disabled"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="showActions" class="flex gap-2 justify-center mt-6">
      <button
        v-if="canReveal"
        class="btn btn-primary"
        @click="revealCards"
      >
        Reveal Cards
      </button>
      <button
        v-if="canClear"
        class="btn btn-outline"
        @click="clearHand"
      >
        Clear Hand
      </button>
      <button
        v-if="canEvaluate"
        class="btn btn-success"
        :disabled="!canEvaluateNow"
        @click="evaluateHand"
      >
        Evaluate Hand
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from './Card.vue';

interface Props {
  pocketCards?: number[];
  communityCards?: number[];
  handLabel?: string;
  cardSize?: 'small' | 'medium' | 'large';
  showPocketCards?: boolean;
  showCommunityCards?: boolean;
  hidePocketCards?: boolean;
  revealFrom?: number;
  disabled?: boolean;
  showActions?: boolean;
}

interface Emits {
  (e: 'reveal'): void;
  (e: 'clear'): void;
  (e: 'evaluate'): void;
}

const props = withDefaults(defineProps<Props>(), {
  pocketCards: () => [],
  communityCards: () => [],
  handLabel: 'Hero',
  cardSize: 'medium',
  showPocketCards: true,
  showCommunityCards: true,
  hidePocketCards: false,
  revealFrom: 0,
  disabled: false,
  showActions: true
});

const emit = defineEmits<Emits>();

// Computed properties for action buttons
const canReveal = computed(() => {
  return props.hidePocketCards && props.pocketCards.length > 0;
});

const canClear = computed(() => {
  return props.pocketCards.length > 0 || props.communityCards.length > 0;
});

const canEvaluate = computed(() => {
  return props.pocketCards.length >= 2 && props.communityCards.length >= 3;
});

const canEvaluateNow = computed(() => {
  return props.pocketCards.length >= 2 && props.communityCards.length >= 5;
});

// Action methods
const revealCards = () => {
  emit('reveal');
};

const clearHand = () => {
  emit('clear');
};

const evaluateHand = () => {
  emit('evaluate');
};
</script>

<style scoped>
.hand-display {
  @apply p-4 bg-base-100 rounded-lg shadow-md;
}
</style>
