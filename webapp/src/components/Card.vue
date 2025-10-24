<template>
  <div
    :class="cardClasses"
    @click="handleClick"
    :aria-label="cardAriaLabel"
    :tabindex="isDisabled ? -1 : 0"
    @keydown.enter="handleClick"
    class="card-container"
  >
    <img
      v-if="!isFaceDown"
      :src="cardImagePath"
      :alt="cardDescription"
      loading="lazy"
      class="w-full h-full object-cover rounded-lg"
    />
    <img
      v-else
      :src="cardBackPath"
      alt="Card back"
      class="w-full h-full object-cover rounded-lg"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCardFromIndex, getCardImagePath, getCardBackPath, formatCardString } from '../utils/cardUtils';

interface Props {
  cardIndex: number;
  isSelected?: boolean;
  isFaceDown?: boolean;
  isDisabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (cardIndex: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isFaceDown: false,
  isDisabled: false,
  size: 'medium',
  onClick: () => {}
});

const emit = defineEmits<{
  click: [cardIndex: number];
}>();

const cardClasses = computed(() => {
  const classes = ['card-container'];

  if (props.isSelected) {
    classes.push('card-selected');
  }

  if (!props.isDisabled) {
    classes.push('card-hover');
  }

  if (props.size) {
    classes.push(`card-${props.size}`);
  }

  return classes.join(' ');
});

const card = computed(() => getCardFromIndex(props.cardIndex));
const cardImagePath = computed(() => getCardImagePath(props.cardIndex));
const cardBackPath = computed(() => getCardBackPath('blue'));
const cardAriaLabel = computed(() => formatCardString(props.cardIndex));
const cardDescription = computed(() => `${card.value.rank} of ${card.value.suit}`);

const handleClick = () => {
  if (!props.isDisabled) {
    emit('click', props.cardIndex);
    if (props.onClick) {
      props.onClick(props.cardIndex);
    }
  }
};
</script>

<style scoped>
.card-container {
  @apply relative inline-block transition-all duration-300 ease-in-out cursor-pointer;
}

.card-selected {
  @apply ring-4 ring-primary ring-offset-2 rounded-lg;
}

.card-hover:hover {
  @apply transform -translate-y-2 shadow-2xl;
}

.card-small {
  @apply w-12 h-16;
}

.card-medium {
  @apply w-16 h-24;
}

.card-large {
  @apply w-20 h-32;
}

.card-container:disabled {
  @apply cursor-not-allowed opacity-50;
}
</style>
