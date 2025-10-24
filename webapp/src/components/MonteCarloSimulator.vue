<template>
  <div class="monte-carlo-simulator">
    <div class="card bg-base-200 rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Monte Carlo Simulation</h3>

      <!-- Simulation Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Number of Simulations</span>
            <span class="label-text-alt">({{ simulationCount.toLocaleString() }})</span>
          </label>
          <input
            v-model.number="simulationCount"
            type="range"
            min="100"
            max="10000"
            step="100"
            class="range"
          />
          <div class="flex justify-between text-xs text-base-content/70 mt-1">
            <span>100</span>
            <span>10,000</span>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Opponents</span>
            <span class="label-text-alt">({{ opponentCount }})</span>
          </label>
          <input
            v-model.number="opponentCount"
            type="range"
            min="1"
            max="9"
            step="1"
            class="range"
          />
          <div class="flex justify-between text-xs text-base-content/70 mt-1">
            <span>1</span>
            <span>9</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mb-6">
        <button
          @click="runSimulation"
          class="btn btn-primary"
          :disabled="isRunning || !canRun"
        >
          <span v-if="!isRunning">Run Simulation</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
        <button
          @click="stopSimulation"
          class="btn btn-outline"
          :disabled="!isRunning"
        >
          Stop
        </button>
        <button
          @click="resetResults"
          class="btn btn-ghost"
          :disabled="isRunning"
        >
          Reset
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="isRunning" class="mb-6">
        <div class="w-full bg-base-300 rounded-full h-2.5">
          <div
            class="bg-primary h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="text-center text-sm text-base-content/70 mt-1">
          {{ progress.toFixed(1) }}% Complete ({{ currentSimulation }}/{{ simulationCount }})
        </div>
      </div>

      <!-- Results -->
      <div v-if="results && !isRunning" class="space-y-4">
        <h4 class="text-md font-medium">Simulation Results</h4>

        <!-- Win Probability -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Win Probability</div>
            <div class="stat-value">{{ (results.winProbability * 100).toFixed(2) }}%</div>
            <div class="stat-bar">
              <div
                class="stat-bar-fill bg-success"
                :style="{ width: `${results.winProbability * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Tie Probability</div>
            <div class="stat-value">{{ (results.tieProbability * 100).toFixed(2) }}%</div>
            <div class="stat-bar">
              <div
                class="stat-bar-fill bg-warning"
                :style="{ width: `${results.tieProbability * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Loss Probability</div>
            <div class="stat-value">{{ (results.lossProbability * 100).toFixed(2) }}%</div>
            <div class="stat-bar">
              <div
                class="stat-bar-fill bg-error"
                :style="{ width: `${results.lossProbability * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Hand Strength -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Hand Strength</div>
            <div class="stat-value">{{ results.handStrength }}</div>
            <div class="stat-desc">{{ getHandStrengthDescription(results.handStrength) }}</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Expected Value</div>
            <div class="stat-value">{{ results.expectedValue.toFixed(3) }}</div>
            <div class="stat-desc">Per simulation</div>
          </div>
        </div>

        <!-- Outs and Odds -->
        <div v-if="results.outs" class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Outs</div>
            <div class="stat-value">{{ results.outs }}</div>
            <div class="stat-desc">Cards to improve hand</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Pot Odds</div>
            <div class="stat-value">{{ results?.potOdds?.toFixed(2) }}:1</div>
            <div class="stat-desc">Break-even ratio</div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-error mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m6 4a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SimulationResults {
  winProbability: number;
  tieProbability: number;
  lossProbability: number;
  handStrength: number;
  expectedValue: number;
  outs?: number;
  potOdds?: number;
}

interface Props {
  pocketCards: number[];
  communityCards: number[];
  disabled?: boolean;
}

interface Emits {
  (e: 'complete', results: SimulationResults): void;
  (e: 'progress', progress: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State
const simulationCount = ref(1000);
const opponentCount = ref(2);
const isRunning = ref(false);
const progress = ref(0);
const currentSimulation = ref(0);
const results = ref<SimulationResults | null>(null);
const error = ref('');

// Computed
const canRun = computed(() => {
  return props.pocketCards.length >= 2 && props.communityCards.length >= 3;
});

// Methods
const runSimulation = async () => {
  if (!canRun.value) return;

  isRunning.value = true;
  progress.value = 0;
  currentSimulation.value = 0;
  error.value = '';

  try {
    // Simulate Monte Carlo in chunks for UI responsiveness
    const chunkSize = 100;
    let wins = 0;
    let ties = 0;
    let losses = 0;

    for (let i = 0; i < simulationCount.value; i += chunkSize) {
      const currentChunkSize = Math.min(chunkSize, simulationCount.value - i);

      // Simulate this chunk
      for (let j = 0; j < currentChunkSize; j++) {
        const result = simulateSingleGame();
        if (result === 'win') wins++;
        else if (result === 'tie') ties++;
        else losses++;
      }

      currentSimulation.value = i + currentChunkSize;
      progress.value = (currentSimulation.value / simulationCount.value) * 100;

      // Allow UI to update
      if (i % (chunkSize * 5) === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // Calculate results
    const total = wins + ties + losses;
    results.value = {
      winProbability: wins / total,
      tieProbability: ties / total,
      lossProbability: losses / total,
      handStrength: calculateHandStrength(),
      expectedValue: calculateExpectedValue(wins, ties, losses),
      outs: calculateOuts(),
      potOdds: calculatePotOdds()
    };

    emit('complete', results.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isRunning.value = false;
  }
};

const stopSimulation = () => {
  isRunning.value = false;
};

const resetResults = () => {
  results.value = null;
  error.value = '';
  progress.value = 0;
  currentSimulation.value = 0;
};

// Helper methods (simplified for demo)
const simulateSingleGame = (): 'win' | 'tie' | 'loss' => {
  // This would integrate with the actual gamblingjs library
  // For now, return random results for demonstration
  const random = Math.random();
  if (random < 0.4) return 'win';
  if (random < 0.6) return 'tie';
  return 'loss';
};

const calculateHandStrength = (): number => {
  // Simplified calculation - would use gamblingjs library
  return Math.random() * 100;
};

const calculateExpectedValue = (wins: number, ties: number, losses: number): number => {
  // Simplified EV calculation
  return (wins - losses) / (wins + ties + losses);
};

const calculateOuts = (): number => {
  // Simplified outs calculation
  return Math.floor(Math.random() * 15);
};

const calculatePotOdds = (): number => {
  // Simplified pot odds
  return Math.random() * 5 + 1;
};

const getHandStrengthDescription = (strength: number): string => {
  if (strength >= 90) return 'Monster';
  if (strength >= 75) return 'Very Strong';
  if (strength >= 60) return 'Strong';
  if (strength >= 45) return 'Above Average';
  if (strength >= 30) return 'Average';
  if (strength >= 15) return 'Below Average';
  return 'Very Weak';
};
</script>

<style scoped>
.monte-carlo-simulator {
  @apply p-4;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.stat-card {
  @apply bg-base-100 p-4 rounded-lg shadow;
}

.stat-title {
  @apply text-sm font-medium text-base-content/70 mb-1;
}

.stat-value {
  @apply text-2xl font-bold text-primary mb-2;
}

.stat-bar {
  @apply w-full bg-base-300 rounded-full h-2;
}

.stat-bar-fill {
  @apply h-2 rounded-full transition-all duration-500;
}

.stat-desc {
  @apply text-xs text-base-content/60;
}
</style>
