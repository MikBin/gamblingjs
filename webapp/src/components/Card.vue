<template>
  <div
    class="card relative transition-transform duration-200 cursor-pointer select-none"
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
    <img
      v-if="!isFaceDown"
      :src="imageSrc"
      :alt="cardDescription"
      class="w-full h-full object-contain rounded-lg shadow-md"
      loading="lazy"
    />
    <img
      v-else
      :src="backImageSrc"
      alt="Card back"
      class="w-full h-full object-contain rounded-lg shadow-md"
    />

    <!-- Selection Indicator -->
    <div
      v-if="isSelected"
      class="absolute inset-0 ring-4 ring-primary rounded-lg pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCardImage, getCardBackImage } from '@/utils/cardUtils';

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

const imageSrc = computed(() => getCardImage(props.cardIndex));
const backImageSrc = computed(() => getCardBackImage());

const sizeClasses = {
  small: 'w-12 h-16',
  medium: 'w-20 h-28',
  large: 'w-32 h-44'
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
