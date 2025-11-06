<template>
  <div class="evaluator-view">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Card Selection -->
        <div class="lg:col-span-1">
          <CardSelector
            v-model="selectedCards"
            title="Select Your Cards"
            description="Choose your pocket cards and community cards to evaluate your hand strength."
            :max-selection="7"
            @selection-change="handleCardSelection"
            @confirm="handleCardSelectionConfirm"
          />
        </div>

        <!-- Middle Column - Hand Display -->
        <div class="lg:col-span-1">
          <HandDisplay
            :pocket-cards="[...pocketCards]"
            :community-cards="[...communityCards]"
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
            :pocket-cards="[...pocketCards]"
            :community-cards="[...communityCards]"
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
            class="btn btn-outline"
            @click="resetGame"
          >
            Reset Game
          </button>
          <button
            class="btn btn-ghost"
            @click="randomizeHand"
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
import { usePokerEvaluator } from '../composables/usePokerEvaluator';
import { useCardSelection } from '../composables/useCardSelection';
import CardSelector from '../components/CardSelector.vue';
import HandDisplay from '../components/HandDisplay.vue';
import MonteCarloSimulator from '../components/MonteCarloSimulator.vue';
import HandRankingDisplay from '../components/HandRankingDisplay.vue';
import { formatCardString, getHandDescription, getHandStrengthPercentage } from '../utils/cardUtils';

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

// Composables
const cardSelection = useCardSelection();
const pokerEvaluator = usePokerEvaluator();

// State
const gameVariant = ref('texas-holdem');
const playerCount = ref(2);
const evaluationResults = ref<EvaluationResults | null>(null);

// Computed from composables
const selectedCards = computed(() => cardSelection.allSelectedCards.value);
const pocketCards = computed(() => cardSelection.selectedPocketCards.value);
const communityCards = computed(() => cardSelection.selectedCommunityCards.value);
const hideCards = computed(() => cardSelection.hideCards.value);
const revealFrom = ref(0);

// Computed
const canEvaluate = computed(() => {
  return pocketCards.value.length >= 2 && communityCards.value.length >= 3;
});

// Methods
const handleCardSelection = (cards: number[]) => {
  // Update card selection through composable
  cardSelection.clearAllCards();
  cards.forEach(card => {
    if (cardSelection.canSelectPocketCard) {
      cardSelection.selectPocketCard(card);
    } else {
      cardSelection.selectCommunityCard(card);
    }
  });
};

const handleCardSelectionConfirm = (cards: number[]) => {
  // Split cards into pocket and community based on game variant
  cardSelection.clearAllCards();

  if (gameVariant.value === 'texas-holdem') {
    cards.slice(0, 2).forEach(card => cardSelection.selectPocketCard(card));
    cards.slice(2).forEach(card => cardSelection.selectCommunityCard(card));
  } else if (gameVariant.value === 'omaha') {
    cards.slice(0, 4).forEach(card => cardSelection.selectPocketCard(card));
    cards.slice(4).forEach(card => cardSelection.selectCommunityCard(card));
  } else {
    // Default to Texas Hold'em for other variants
    cards.slice(0, 2).forEach(card => cardSelection.selectPocketCard(card));
    cards.slice(2).forEach(card => cardSelection.selectCommunityCard(card));
  }

  cardSelection.toggleHideCards();
  evaluationResults.value = null;
};

const handleRevealCards = () => {
  cardSelection.revealCards();
};

const handleClearHand = () => {
  cardSelection.clearAllCards();
  evaluationResults.value = null;
};

const handleEvaluateHand = async () => {
  if (!canEvaluate.value) return;

  const allCards = [...pocketCards.value, ...communityCards.value];

  // Use the poker evaluator composable
  const evaluation = await pokerEvaluator.evaluateHand(allCards);

  if (evaluation) {
    const handRank = evaluation.handRank;
    const handStrength = getHandStrengthPercentage(handRank);

    const results: EvaluationResults = {
      handRanking: {
        rank: handRank,
        name: getHandDescription(handRank),
        description: evaluation.handGroup || 'Poker hand'
      },
      handStrength: {
        percentage: handStrength,
        rank: handRank
      },
      detailedStats: {
        highCard: evaluation.faces || 'Unknown',
        kickers: [],
        outs: 0,
        drawProbability: 0
      },
      comparison: {
        players: [
          {
            name: 'You',
            hand: pocketCards.value.map(c => formatCardString(c)).join(', ') +
                  ' + ' +
                  communityCards.value.map(c => formatCardString(c)).join(', '),
            ranking: handRank,
            winPercentage: handStrength,
            isCurrentPlayer: true
          }
        ]
      }
    };

    evaluationResults.value = results;
  } else {
    console.error('Hand evaluation failed:', pokerEvaluator.error.value);
  }
};

interface SimulationResults {
  winProbability: number;
  tieProbability: number;
  lossProbability: number;
  handStrength: number;
  expectedValue: number;
  outs?: number;
  potOdds?: number;
}

const handleSimulationComplete = (results: SimulationResults) => {
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
  cardSelection.clearAllCards();
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
    cardSelection.setPocketCards(newCards.slice(0, 2));

    // Update community cards
    cardSelection.setCommunityCards(newCards.slice(2));
  }
}, { deep: true });
</script>

<style scoped>
.evaluator-view {
  @apply min-h-screen;
}
</style>
