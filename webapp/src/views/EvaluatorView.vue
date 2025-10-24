<template>
  <div class="evaluator-view">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Card Selection -->
        <div class="lg:col-span-1">
          <CardSelector
            title="Select Your Cards"
            description="Choose your pocket cards and community cards to evaluate your hand strength."
            v-model="selectedCards"
            :max-selection="7"
            @selection-change="handleCardSelection"
            @confirm="handleCardSelectionConfirm"
          />
        </div>

        <!-- Middle Column - Hand Display -->
        <div class="lg:col-span-1">
          <HandDisplay
            :pocket-cards="pocketCards"
            :community-cards="communityCards"
            hand-label="Your Hand"
            :hide-pocket-cards="hideCards"
            :reveal-from="revealFrom"
            @reveal="handleRevealCards"
            @clear="handleClearHand"
            @evaluate="handleEvaluateHand"
          />
        </div>

        <!-- Right Column - Simulation & Results -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Monte Carlo Simulation -->
          <MonteCarloSimulator
            :pocket-cards="pocketCards"
            :community-cards="communityCards"
            @complete="handleSimulationComplete"
            @progress="handleSimulationProgress"
          />

          <!-- Hand Ranking Display -->
          <HandRankingDisplay
            v-if="evaluationResults"
            :hand-ranking="evaluationResults.handRanking"
            :hand-strength="evaluationResults.handStrength"
            :detailed-stats="evaluationResults.detailedStats"
            :comparison="evaluationResults.comparison"
            @share="handleShareResults"
            @save="handleSaveResults"
          />
        </div>
      </div>

      <!-- Game Controls -->
      <div class="mt-8 card bg-base-200 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Game Controls</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Game Variant</span>
            </label>
            <select v-model="gameVariant" class="select select-bordered">
              <option value="texas-holdem">Texas Hold'em</option>
              <option value="omaha">Omaha</option>
              <option value="seven-card-stud">Seven Card Stud</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Number of Players</span>
            </label>
            <select v-model="playerCount" class="select select-bordered">
              <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="resetGame"
            class="btn btn-outline"
          >
            Reset Game
          </button>
          <button
            @click="randomizeHand"
            class="btn btn-ghost"
          >
            Random Hand
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePokerStore } from '../stores/poker';
import CardSelector from '../components/CardSelector.vue';
import HandDisplay from '../components/HandDisplay.vue';
import MonteCarloSimulator from '../components/MonteCarloSimulator.vue';
import HandRankingDisplay from '../components/HandRankingDisplay.vue';
import { getCardFromIndex, formatCardString } from '../utils/cardUtils';

interface EvaluationResults {
  handRanking: {
    rank: number;
    name: string;
    description: string;
  } | null;
  handStrength: {
    percentage: number;
    rank: number;
  } | null;
  detailedStats: {
    highCard: string;
    kickers: string[];
    outs: number;
    drawProbability: number;
  } | null;
  comparison: {
    players: Array<{
      name: string;
      hand: string;
      ranking: number;
      winPercentage: number;
      isCurrentPlayer: boolean;
    }>;
  } | null;
}

// Store
const pokerStore = usePokerStore();

// State
const selectedCards = ref<number[]>([]);
const pocketCards = ref<number[]>([]);
const communityCards = ref<number[]>([]);
const hideCards = ref(true);
const revealFrom = ref(0);
const gameVariant = ref('texas-holdem');
const playerCount = ref(2);
const evaluationResults = ref<EvaluationResults | null>(null);

// Computed
const canEvaluate = computed(() => {
  return pocketCards.value.length >= 2 && communityCards.value.length >= 3;
});

// Methods
const handleCardSelection = (cards: number[]) => {
  selectedCards.value = cards;
};

const handleCardSelectionConfirm = (cards: number[]) => {
  // Split cards into pocket and community based on game variant
  if (gameVariant.value === 'texas-holdem') {
    pocketCards.value = cards.slice(0, 2);
    communityCards.value = cards.slice(2);
  } else if (gameVariant.value === 'omaha') {
    pocketCards.value = cards.slice(0, 4);
    communityCards.value = cards.slice(4);
  } else {
    // Default to Texas Hold'em for other variants
    pocketCards.value = cards.slice(0, 2);
    communityCards.value = cards.slice(2);
  }

  hideCards.value = true;
  evaluationResults.value = null;
};

const handleRevealCards = () => {
  hideCards.value = false;
};

const handleClearHand = () => {
  pocketCards.value = [];
  communityCards.value = [];
  selectedCards.value = [];
  hideCards.value = true;
  evaluationResults.value = null;
};

const handleEvaluateHand = () => {
  if (!canEvaluate.value) return;

  // This would integrate with the actual gamblingjs library
  // For now, create mock evaluation results
  const mockResults: EvaluationResults = {
    handRanking: {
      rank: 3,
      name: 'Two Pair',
      description: 'Two cards of the same rank plus three unrelated cards'
    },
    handStrength: {
      percentage: 65,
      rank: 5
    },
    detailedStats: {
      highCard: 'Ace',
      kickers: ['King', '7'],
      outs: 9,
      drawProbability: 0.18
    },
    comparison: {
      players: [
        {
          name: 'You',
          hand: pocketCards.value.map(c => formatCardString(c)).join(', ') +
                 ' + ' +
                 communityCards.value.map(c => formatCardString(c)).join(', '),
          ranking: 3,
          winPercentage: 42.5,
          isCurrentPlayer: true
        },
        {
          name: 'Player 1',
          hand: 'A♠, K♥',
          ranking: 2,
          winPercentage: 35.2,
          isCurrentPlayer: false
        },
        {
          name: 'Player 2',
          hand: 'Q♦, J♣',
          ranking: 4,
          winPercentage: 22.3,
          isCurrentPlayer: false
        }
      ]
    }
  };

  evaluationResults.value = mockResults;
};

const handleSimulationComplete = (results: any) => {
  // Update evaluation results with simulation data
  if (evaluationResults.value) {
    evaluationResults.value.detailedStats = {
      ...evaluationResults.value.detailedStats,
      ...results
    };
  }
};

const handleSimulationProgress = (progress: number) => {
  // Could update a progress indicator in the UI
  console.log('Simulation progress:', progress);
};

const handleShareResults = () => {
  // Implementation would share results to social media
  console.log('Share results');
};

const handleSaveResults = () => {
  // Implementation would save results to local storage or backend
  console.log('Save results');
};

const resetGame = () => {
  pocketCards.value = [];
  communityCards.value = [];
  selectedCards.value = [];
  hideCards.value = true;
  evaluationResults.value = null;
};

const randomizeHand = () => {
  // Generate random cards for demonstration
  const allCards = Array.from({ length: 52 }, (_, i) => i);
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);

  // Select 7 random cards (2 pocket + 5 community)
  const randomCards = shuffled.slice(0, 7);
  handleCardSelectionConfirm(randomCards);
};

// Watch for changes in selected cards to update pocket/community cards
watch(selectedCards, (newCards) => {
  if (newCards.length >= 2) {
    // Update pocket cards
    pocketCards.value = newCards.slice(0, 2);

    // Update community cards
    communityCards.value = newCards.slice(2);
  }
}, { deep: true });
</script>

<style scoped>
.evaluator-view {
  @apply min-h-screen;
}
</style>
