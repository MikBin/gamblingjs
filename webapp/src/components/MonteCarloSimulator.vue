<template>
  <div class="monte-carlo-simulator bg-base-100 p-6 rounded-xl shadow-xl border border-base-300">
    <h3 class="text-xl font-bold mb-4">Monte Carlo Simulation</h3>

    <div class="flex flex-col gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Number of Simulations</span>
          <span class="label-text-alt font-mono">{{ numRuns }}</span>
        </label>
        <input
          v-model.number="numRuns"
          type="range"
          min="100"
          max="50000"
          step="100"
          class="range range-primary range-sm"
        />
      </div>

      <button
        class="btn btn-primary"
        :class="{ 'loading': isSimulating }"
        :disabled="isSimulating || !canRun"
        @click="run"
      >
        {{ isSimulating ? 'Simulating...' : 'Run Simulation' }}
      </button>

      <div v-if="error" class="alert alert-error text-sm">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="results" class="results mt-4 space-y-4">
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div class="stat">
            <div class="stat-title">Win %</div>
            <div class="stat-value text-success">{{ formatPercent(results.winProbability) }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Tie %</div>
            <div class="stat-value text-warning">{{ formatPercent(results.tieProbability) }}</div>
          </div>
          <div class="stat">
             <div class="stat-title">Equity</div>
             <div class="stat-value">{{ formatPercent(results.equity) }}</div>
          </div>
        </div>

        <!-- Distribution Chart (Simple Bar) -->
        <div v-if="results.handDistribution" class="space-y-2">
            <h4 class="font-semibold text-sm">Hand Distribution</h4>
            <div v-for="(prob, type) in results.handDistribution" :key="type" class="flex items-center text-xs">
                <span class="w-24 shrink-0">{{ type }}</span>
                <div class="flex-1 h-4 bg-base-300 rounded overflow-hidden">
                    <div class="h-full bg-secondary" :style="{ width: `${prob * 100}%` }"></div>
                </div>
                <span class="w-12 text-right shrink-0">{{ formatPercent(prob) }}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  canRun: {
    type: Boolean,
    default: false
  },
  isSimulating: {
    type: Boolean,
    default: false
  },
  results: {
    type: Object, // SimulationResult
    default: null
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['run']);

const numRuns = ref(5000);

const run = () => {
  emit('run', numRuns.value);
};

const formatPercent = (val: number) => {
  if (val === undefined || val === null) return '0%';
  return `${(val * 100).toFixed(1)}%`;
};
</script>
