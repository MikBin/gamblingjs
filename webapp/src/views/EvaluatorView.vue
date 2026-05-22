<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Left Column: Controls & Input -->
      <div class="flex-1 space-y-6">
        <!-- Hand Display -->
        <HandDisplay
          :pocket-cards="pokerStore.pocketCards"
          :community-cards="pokerStore.communityCards"
          @remove-pocket="pokerStore.removePocketCard"
          @remove-community="pokerStore.removeCommunityCard"
        />

        <!-- Card Selector -->
        <CardSelector
          :selected-cards="pokerStore.allCards"
          :disabled-cards="[]"
          @select="handleCardSelect"
          @clear="pokerStore.resetHand"
        />
      </div>

      <!-- Right Column: Analysis -->
      <div class="w-full lg:w-96 space-y-6">
         <!-- Game Variant Selection -->
         <div class="bg-base-200 p-4 rounded-xl shadow-lg border border-base-300">
             <label class="label"><span class="label-text font-bold">Game Variant</span></label>
             <select v-model="pokerStore.gameVariant" class="select select-bordered w-full">
                <option value="texas-holdem">Texas Hold'em (High)</option>
                <option value="low-a-to-5">Low A-to-5</option>
                <option value="low-8-or-better">Low 8-or-Better</option>
                <option value="low-9-or-better">Low 9-or-Better</option>
             </select>
         </div>

         <!-- Evaluation Result -->
         <HandRankingDisplay
           :hand-rank="pokerStore.currentHandRank"
           :strength="pokerStore.handStrength"
           :hand-cards="evaluatorHandCards"
           :winning-cards="winningCards"
           :hand-rank-name="handRankName as any"
         />

         <!-- Monte Carlo -->
         <MonteCarloSimulator
           :can-run="canRunSim"
           :is-simulating="monteCarlo.isSimulating.value"
           :results="monteCarlo.simulationResult.value"
           :error="monteCarlo.simulationError.value || undefined"
           @run="handleRunSim"
         />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePokerStore } from '@/stores/poker';
import { usePokerEvaluator } from '@/composables/usePokerEvaluator';
import { useMonteCarlo } from '@/composables/useMonteCarlo';
import HandDisplay from '@/components/HandDisplay.vue';
import CardSelector from '@/components/CardSelector.vue';
import HandRankingDisplay from '@/components/HandRankingDisplay.vue';
import MonteCarloSimulator from '@/components/MonteCarloSimulator.vue';

const pokerStore = usePokerStore();
const evaluator = usePokerEvaluator();
const monteCarlo = useMonteCarlo();

// Handle Card Selection Logic (routing to pocket or community)
const handleCardSelect = (cardIndex: number) => {
  if (pokerStore.pocketCards.length < 2) {
    pokerStore.addPocketCard(cardIndex);
  } else if (pokerStore.communityCards.length < 5) {
    pokerStore.addCommunityCard(cardIndex);
  }
};

// Auto-evaluate when cards or variant change
watch(
  () => [pokerStore.allCards, pokerStore.gameVariant],
  async ([newCards, newVariant]) => {
    const cards = newCards as number[];
    const variant = newVariant as string;
    if (cards.length >= 5) {
      try {
        const result = await evaluator.evaluateHand([...cards], variant);
        pokerStore.setEvaluationResult(result as any);
      } catch (e) {
        console.error("Evaluation error:", e);
        pokerStore.setEvaluationResult(null);
      }
    } else {
        pokerStore.setEvaluationResult(null);
    }
  },
  { deep: true }
);

const evaluatorHandCards = computed(() => {
    // If evaluated, show the cards used in evaluation (which is all cards for 7 card eval)
    // Or just the best 5?
    // Usually we want to show all cards involved.
    return pokerStore.allCards;
});

const winningCards = computed(() => {
    const res = pokerStore.evaluationResult;
    if (res && res.winningCards && Array.isArray(res.winningCards)) {
        return res.winningCards;
    }
    return [];
});

const handRankName = computed(() => {
    const res = pokerStore.evaluationResult;
    if (!res) return '';
    const name = res.handRankDescription || res.handGroup || res.handCategory;
    return (name || '') as string;
});

// Simulation Logic
const canRunSim = computed(() => {
    // Need at least 2 cards (pocket) to simulate?
    return pokerStore.pocketCards.length === 2;
});

const handleRunSim = async (runs: number) => {
    if (!canRunSim.value) return;

    // We simulate using the pocket cards + current community cards (partial hand)
    // The monte carlo function usually takes the known cards.
    const knownCards = [...pokerStore.pocketCards, ...pokerStore.communityCards];
    await monteCarlo.runSimulation(knownCards, runs);
};
</script>
