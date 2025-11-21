<template>
  <div class="hand-ranking-display bg-base-100 p-6 rounded-xl shadow-xl border border-base-300">
    <div class="flex items-center justify-between mb-4">
       <h3 class="text-xl font-bold">Hand Evaluation</h3>
       <div v-if="handRankName" class="badge badge-lg badge-accent font-bold">
         {{ handRankName }}
       </div>
    </div>

    <div v-if="handCards.length > 0" class="flex flex-col gap-4">
       <!-- Winning Cards Highlight -->
       <div class="flex gap-2 justify-center my-2">
         <div v-for="(card, i) in handCards" :key="i" :class="{ 'ring-4 ring-accent rounded-lg': winningCards.includes(card) }">
            <Card :card-index="card" size="small" :is-selected="winningCards.includes(card)" />
         </div>
       </div>

       <!-- Strength Meter -->
       <div class="w-full bg-base-300 rounded-full h-4 mt-2">
          <div
            class="bg-accent h-4 rounded-full transition-all duration-500"
            :style="{ width: `${strength * 100}%` }"
          ></div>
       </div>
       <div class="text-right text-xs opacity-70">Top {{ (100 - (strength * 100)).toFixed(1) }}%</div>

       <!-- Details -->
       <div class="grid grid-cols-2 gap-2 text-sm mt-2">
          <div class="flex justify-between border-b border-base-content/10 py-1">
             <span>Rank Value:</span>
             <span class="font-mono">{{ handRank }}</span>
          </div>
       </div>
    </div>
    <div v-else class="text-center opacity-50 py-8">
       Select at least 5 cards to see evaluation.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import Card from './Card.vue';

const props = defineProps({
  handRank: {
    type: Number,
    default: 0
  },
  strength: {
    type: Number,
    default: 0
  },
  handCards: {
    type: Array as PropType<number[]>,
    default: () => []
  },
  winningCards: {
    type: Array as PropType<number[]>,
    default: () => []
  },
  handRankName: {
    type: [String, null] as PropType<any>,
    default: ''
  }
});
</script>
