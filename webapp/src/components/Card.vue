<template>
  <div
    class="card relative transition-transform duration-200 cursor-pointer select-none rounded-lg shadow-md border-2 border-base-300 bg-white"
    :class="[
      sizeClasses[size],
      { 'transform -translate-y-2': isSelected && !isDisabled },
      { 'opacity-50 cursor-not-allowed': isDisabled },
      { 'hover:scale-105': !isDisabled && !isSelected }
    ]"
    @click="handleClick"
    role="button"
    :aria-label="cardAriaLabel"
    :tabindex="isDisabled ? -1 : 0"
    @keydown.enter="handleClick"
  >
    <div v-if="!isFaceDown" class="w-full h-full flex flex-col justify-between p-1">
      <div v-if="details" :class="[details.color === 'red' ? 'text-red-500' : 'text-black', 'leading-none font-bold']">
        <div :class="rankClasses[size]">{{ details.rank }}</div>
        <div :class="symbolClasses[size]">{{ details.symbol }}</div>
      </div>
      <div v-if="details && size !== 'small'" :class="[details.color === 'red' ? 'text-red-500' : 'text-black', 'text-center w-full self-center']">
         <span :class="centerSymbolClasses[size]">{{ details.symbol }}</span>
      </div>
    </div>
    <div v-else class="w-full h-full rounded-md bg-blue-700 bg-opacity-80 border-2 border-white flex items-center justify-center">
      <div class="w-full h-full opacity-30" style="background-image: radial-gradient(white 15%, transparent 16%), radial-gradient(white 15%, transparent 16%); background-size: 8px 8px; background-position: 0 0, 4px 4px;"></div>
    </div>

    <!-- Selection Indicator -->
    <div
      v-if="isSelected"
      class="absolute inset-0 ring-4 ring-primary rounded-lg pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCardDetails } from '@/utils/cardUtils';

const props = defineProps({
  cardIndex: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFaceDown: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium'
  }
});

const emit = defineEmits(['click']);

const details = computed(() => getCardDetails(props.cardIndex));

const sizeClasses = {
  small: 'w-12 h-16',
  medium: 'w-20 h-28',
  large: 'w-32 h-44'
};

const rankClasses = {
  small: 'text-sm',
  medium: 'text-xl',
  large: 'text-3xl'
};

const symbolClasses = {
  small: 'text-sm',
  medium: 'text-xl',
  large: 'text-2xl'
};

const centerSymbolClasses = {
  small: '', // hidden on small
  medium: 'text-4xl',
  large: 'text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
};

const cardDescription = computed(() => {
  // Simple description, could be enhanced
  return `Card ${props.cardIndex}`;
});

const cardAriaLabel = computed(() => {
  return props.isFaceDown ? 'Face down card' : cardDescription.value;
});

const handleClick = () => {
  if (!props.isDisabled) {
    emit('click', props.cardIndex);
  }
};
</script>
