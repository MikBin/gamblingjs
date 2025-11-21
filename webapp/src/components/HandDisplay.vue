<template>
  <div class="hand-display bg-base-100 p-6 rounded-xl shadow-xl border border-base-300">
    <!-- Pocket Cards -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
        <span class="badge badge-primary">Pocket Cards</span>
        <span class="text-sm opacity-70">(2 Cards)</span>
      </h3>
      <div class="flex flex-wrap gap-4 min-h-[120px] p-4 bg-base-200 rounded-lg justify-center sm:justify-start">
        <div
          v-for="(cardIndex, index) in pocketCards"
          :key="`pocket-${index}`"
          class="relative group"
        >
           <Card
             :card-index="cardIndex"
             size="medium"
             @click="removePocket(index)"
           />
           <button
             class="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
             @click.stop="removePocket(index)"
           >✕</button>
        </div>

        <div
          v-if="pocketCards.length < 2"
          class="w-20 h-28 border-2 border-dashed border-base-content/20 rounded-lg flex items-center justify-center text-base-content/30"
        >
          Empty
        </div>
         <div
          v-if="pocketCards.length < 1"
          class="w-20 h-28 border-2 border-dashed border-base-content/20 rounded-lg flex items-center justify-center text-base-content/30"
        >
          Empty
        </div>
      </div>
    </div>

    <!-- Community Cards -->
    <div>
      <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
        <span class="badge badge-secondary">Community Cards</span>
        <span class="text-sm opacity-70">(3-5 Cards)</span>
      </h3>
      <div class="flex flex-wrap gap-4 min-h-[120px] p-4 bg-base-200 rounded-lg justify-center sm:justify-start">
        <div
          v-for="(cardIndex, index) in communityCards"
          :key="`comm-${index}`"
          class="relative group"
        >
           <Card
             :card-index="cardIndex"
             size="medium"
             @click="removeCommunity(index)"
           />
           <button
             class="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
             @click.stop="removeCommunity(index)"
           >✕</button>
        </div>

        <!-- Placeholders -->
        <div
          v-for="i in (5 - communityCards.length)"
          :key="`empty-${i}`"
          class="w-20 h-28 border-2 border-dashed border-base-content/20 rounded-lg flex items-center justify-center text-base-content/30 text-xs text-center"
        >
          {{ getStageLabel(communityCards.length + i) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from './Card.vue';

const props = defineProps({
  pocketCards: {
    type: Array as () => number[],
    default: () => []
  },
  communityCards: {
    type: Array as () => number[],
    default: () => []
  }
});

const emit = defineEmits(['remove-pocket', 'remove-community']);

const removePocket = (index: number) => emit('remove-pocket', index);
const removeCommunity = (index: number) => emit('remove-community', index);

const getStageLabel = (index: number) => {
  // index is 1-based in loop logic above? No, i starts at 1.
  // communityCards.length + i
  // If 0 cards: 1=Flop1, 2=Flop2, 3=Flop3, 4=Turn, 5=River
  if (index <= 3) return `Flop ${index}`;
  if (index === 4) return 'Turn';
  if (index === 5) return 'River';
  return 'Slot';
};
</script>
