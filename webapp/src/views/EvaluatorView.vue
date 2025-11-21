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
           :error="monteCarlo.simulationError.value"
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

// Auto-evaluate when cards change
watch(
  () => pokerStore.allCards,
  async (newCards) => {
    if (newCards.length >= 5) {
      try {
        const result = await evaluator.evaluateHand([...newCards]); // Copy to avoid mutation issues if any
        pokerStore.setEvaluationResult(result as any);
      } catch (e) {
        console.error("Evaluation error:", e);
      }
    } else {
        // Reset result if cards < 5 (unless we want to keep last valid?)
        // Let's reset for clarity.
        // pokerStore.setEvaluationResult(null); // Need to handle null in store
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
    // If result has winning cards (best hand)
    // Note: gamblingjs verbose result might not explicitly list the card indices of the best 5 in a simple array
    // Let's assume result.winningCards is available or we derive it.
    // For now, if we don't have it, we return empty.
    /*
      interface verboseHandInfo {
         handRank: number;
         handRankDescription: string;
         bestHand: string; // e.g. "Ac Ks..."
         // We might not get indices directly.
      }
    */
   // If the API returns indices, use them. Else empty.
   return [];
});

const handRankName = computed(() => {
    const res = pokerStore.evaluationResult;
    if (!res) return '';
    // Fix: check if res has handRankDescription, else default to empty string.
    // TypeScript complained about string | null not assignable to string | undefined
    const name = res.handRankDescription || res.handCategory;
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
