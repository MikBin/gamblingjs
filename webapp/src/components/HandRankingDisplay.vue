<template>
  <div class="hand-ranking-display">
    <div class="card bg-base-200 rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Hand Evaluation</h3>

      <!-- Hand Ranking -->
      <div v-if="handRanking" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-md font-medium">Hand Ranking</h4>
          <div class="badge" :class="getRankingBadgeClass(handRanking.rank)">
            {{ handRanking.rank }}
          </div>
        </div>
        <div class="text-2xl font-bold mb-2">{{ handRanking.name }}</div>
        <div class="text-sm text-base-content/70 mb-4">{{ handRanking.description }}</div>
      </div>

      <!-- Hand Strength -->
      <div v-if="handStrength" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-md font-medium">Hand Strength</h4>
          <div class="text-lg font-bold">{{ handStrength.percentage }}%</div>
        </div>
        <div class="w-full bg-base-300 rounded-full h-2.5 mb-2">
          <div
            class="h-2.5 rounded-full transition-all duration-500"
            :class="getStrengthBarClass(handStrength.percentage)"
            :style="{ width: `${handStrength.percentage}%` }"
          ></div>
        </div>
        <div class="text-sm text-base-content/70">
          {{ getStrengthDescription(handStrength.percentage) }}
        </div>
      </div>

      <!-- Detailed Stats -->
      <div v-if="detailedStats" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="stat-card">
          <div class="stat-title">High Card</div>
          <div class="stat-value">{{ detailedStats.highCard }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-title">Kickers</div>
          <div class="stat-value">{{ detailedStats.kickers.join(', ') || 'None' }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-title">Possible Outs</div>
          <div class="stat-value">{{ detailedStats.outs }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-title">Draw Probability</div>
          <div class="stat-value">{{ (detailedStats.drawProbability * 100).toFixed(2) }}%</div>
        </div>
      </div>

      <!-- Comparison with Opponents -->
      <div v-if="comparison" class="mt-6">
        <h4 class="text-md font-medium mb-3">Comparison with Opponents</h4>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Player</th>
                <th>Hand</th>
                <th>Ranking</th>
                <th>Win %</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in comparison.players" :key="index">
                <td :class="{ 'font-bold': player.isCurrentPlayer }">
                  {{ player.name }}
                  <span v-if="player.isCurrentPlayer" class="text-xs">(You)</span>
                </td>
                <td>{{ player.hand }}</td>
                <td>
                  <span class="badge" :class="getRankingBadgeClass(player.ranking)">
                    {{ player.ranking }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center">
                    <div class="w-full bg-base-300 rounded-full h-1.5 mr-2">
                      <div
                        class="h-1.5 rounded-full transition-all duration-500"
                        :class="getStrengthBarClass(player.winPercentage)"
                        :style="{ width: `${player.winPercentage}%` }"
                      ></div>
                    </div>
                    <span class="text-sm">{{ player.winPercentage.toFixed(1) }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-6">
        <button
          class="btn btn-outline"
          @click="shareResults"
        >
          Share Results
        </button>
        <button
          class="btn btn-primary"
          @click="saveResults"
        >
          Save Evaluation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface HandRanking {
  rank: number;
  name: string;
  description: string;
}

interface HandStrength {
  percentage: number;
  rank: number;
}

interface DetailedStats {
  highCard: string;
  kickers: string[];
  outs: number;
  drawProbability: number;
}

interface Player {
  name: string;
  hand: string;
  ranking: number;
  winPercentage: number;
  isCurrentPlayer: boolean;
}

interface Comparison {
  players: Player[];
}

interface Props {
  handRanking?: HandRanking | null;
  handStrength?: HandStrength | null;
  detailedStats?: DetailedStats | null;
  comparison?: Comparison | null;
}

interface Emits {
  (_e: 'share'): void;
  (_e: 'save'): void;
}

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

// Helper methods
const getRankingBadgeClass = (rank: number) => {
  if (rank <= 1) return 'badge-success';
  if (rank <= 3) return 'badge-info';
  if (rank <= 6) return 'badge-warning';
  return 'badge-error';
};

const getStrengthBarClass = (percentage: number) => {
  if (percentage >= 90) return 'bg-success';
  if (percentage >= 70) return 'bg-info';
  if (percentage >= 50) return 'bg-warning';
  return 'bg-error';
};

const getStrengthDescription = (percentage: number) => {
  if (percentage >= 95) return 'Near Perfect';
  if (percentage >= 85) return 'Excellent';
  if (percentage >= 75) return 'Very Strong';
  if (percentage >= 60) return 'Strong';
  if (percentage >= 45) return 'Above Average';
  if (percentage >= 30) return 'Average';
  if (percentage >= 15) return 'Below Average';
  return 'Very Weak';
};

// Action methods
const shareResults = () => {
  // In a real app, this would share to social media or copy link
  if (navigator.share) {
    navigator.share({
      title: 'Poker Hand Evaluation',
      text: `My poker hand ranked ${props.handRanking?.name} with ${props.handStrength?.percentage}% strength!`,
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const text = `My poker hand ranked ${props.handRanking?.name} with ${props.handStrength?.percentage}% strength!`;
    navigator.clipboard.writeText(text);
  }

  emit('share');
};

const saveResults = () => {
  // In a real app, this would save to local storage or backend
  const results = {
    handRanking: props.handRanking,
    handStrength: props.handStrength,
    detailedStats: props.detailedStats,
    comparison: props.comparison,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('poker-evaluation-results', JSON.stringify(results));

  emit('save');
};
</script>

<style scoped>
.hand-ranking-display {
  @apply p-4;
}

.badge {
  @apply inline-block px-2 py-1 text-xs font-bold rounded-full;
}

.badge-success {
  @apply bg-success text-success-content;
}

.badge-info {
  @apply bg-info text-info-content;
}

.badge-warning {
  @apply bg-warning text-warning-content;
}

.badge-error {
  @apply bg-error text-error-content;
}

.stat-card {
  @apply bg-base-100 p-3 rounded shadow;
}

.stat-title {
  @apply text-sm font-medium text-base-content/70 mb-1;
}

.stat-value {
  @apply text-lg font-bold;
}
</style>
