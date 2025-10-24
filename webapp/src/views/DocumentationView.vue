<template>
  <div class="documentation-view">
    <div class="container mx-auto px-4 py-8">
      <div class="prose max-w-none">
        <h1 class="text-3xl font-bold mb-6">Poker Hand Evaluator Documentation</h1>

        <div class="card bg-base-100 shadow-md p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
          <p class="mb-4">
            The Poker Hand Evaluator is a comprehensive tool for analyzing poker hands and calculating probabilities.
            This application showcases the advanced capabilities of the gamblingjs library through an intuitive interface.
          </p>

          <h3 class="text-xl font-medium mb-3">Basic Usage</h3>
          <ol class="list-decimal list-inside space-y-2 mb-6">
            <li>Navigate to the <strong>Evaluator</strong> page from the navigation menu.</li>
            <li>Select your pocket cards by clicking on them in the card selector.</li>
            <li>Add community cards (flop, turn, river) as needed.</li>
            <li>Click <strong>Evaluate Hand</strong> to see your hand strength and win probabilities.</li>
            <li>Use the <strong>Monte Carlo Simulation</strong> to run advanced probability calculations.</li>
          </ol>
        </div>

        <div class="card bg-base-100 shadow-md p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Features</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium mb-2">Hand Evaluation</h3>
              <ul class="list-disc space-y-1 text-sm">
                <li>Real-time hand strength calculation</li>
                <li>Hand ranking determination (High Card, Pair, Two Pair, etc.)</li>
                <li>Detailed statistics including outs and pot odds</li>
                <li>Comparison with opponent hands</li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium mb-2">Monte Carlo Simulation</h3>
              <ul class="list-disc space-y-1 text-sm">
                <li>Configurable number of simulations (100-10,000)</li>
                <li>Multiple opponent support (1-9 players)</li>
                <li>Win/tie/loss probability calculations</li>
                <li>Expected value analysis</li>
                <li>Progress tracking with visual indicators</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-md p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Supported Poker Variants</h2>

          <div class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium mb-2">Texas Hold'em</h3>
              <p class="text-sm mb-2">
                The most popular poker variant where each player receives 2 pocket cards and 5 community cards.
                The best 5-card hand is made from any combination of the 7 available cards.
              </p>
              <div class="bg-base-200 p-3 rounded text-sm">
                <strong>Hand Evaluation:</strong> 2 pocket cards + 5 community cards<br>
                <strong>Simulation:</strong> 2 pocket cards + 3-5 community cards
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-medium mb-2">Omaha</h3>
              <p class="text-sm mb-2">
                Similar to Texas Hold'em but players receive 4 pocket cards and must use exactly 2 of them.
                The best 5-card hand is made from any combination of the 9 available cards.
              </p>
              <div class="bg-base-200 p-3 rounded text-sm">
                <strong>Hand Evaluation:</strong> 4 pocket cards + 5 community cards<br>
                <strong>Simulation:</strong> 4 pocket cards + 3-5 community cards
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-medium mb-2">Seven Card Stud</h3>
              <p class="text-sm mb-2">
                Players receive 7 cards with no community cards.
                The best 5-card hand is made from any combination of the 7 available cards.
              </p>
              <div class="bg-base-200 p-3 rounded text-sm">
                <strong>Hand Evaluation:</strong> 7 cards<br>
                <strong>Simulation:</strong> 7 cards
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-md p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Technical Details</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium mb-2">Library Integration</h3>
              <p class="text-sm">
                This application is built on top of the gamblingjs library, which provides fast and accurate
                poker hand evaluation algorithms. The library includes optimized hash tables for
                instant hand ranking and probability calculations.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2">Performance</h3>
              <p class="text-sm">
                The Monte Carlo simulation uses Web Workers for non-blocking calculations, ensuring the UI
                remains responsive even during intensive computations. Results are cached to avoid redundant
                calculations for identical scenarios.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2">Card Assets</h3>
              <p class="text-sm">
                Card images are stored as SVG files for crisp rendering at any size. The application
                automatically falls back to text-based display if images are not available, ensuring
                compatibility across all environments.
              </p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">API Reference</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium mb-2">CardSelector Component</h3>
              <div class="bg-base-200 p-3 rounded text-sm font-mono">
                <pre><CardSelector
  v-model="selectedCards"
  :max-selection="7"
  @selection-change="handleCardSelection"
  @confirm="handleCardSelectionConfirm"
/></pre>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2">HandDisplay Component</h3>
              <div class="bg-base-200 p-3 rounded text-sm font-mono">
                <pre><HandDisplay
  :pocket-cards="pocketCards"
  :community-cards="communityCards"
  :hide-pocket-cards="hideCards"
  @reveal="handleRevealCards"
  @evaluate="handleEvaluateHand"
/></pre>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2">MonteCarloSimulator Component</h3>
              <div class="bg-base-200 p-3 rounded text-sm font-mono">
                <pre><MonteCarloSimulator
  :pocket-cards="pocketCards"
  :community-cards="communityCards"
  :simulation-count="1000"
  :opponent-count="2"
  @complete="handleSimulationComplete"
/></pre>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">Contributing</h2>
          <p class="mb-4">
            This project is open-source and welcomes contributions! Please see the GitHub repository for
            contribution guidelines and issue reporting.
          </p>
          <div class="flex gap-2">
            <a href="https://github.com/your-username/poker-hand-evaluator" target="_blank" class="btn btn-primary">
              View on GitHub
            </a>
            <a href="https://github.com/your-username/poker-hand-evaluator/issues" target="_blank" class="btn btn-outline">
              Report Issues
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Documentation view is primarily static content
// No additional logic needed
</script>

<style scoped>
.documentation-view {
  @apply min-h-screen;
}

.prose {
  @apply max-w-none text-base-content;
}

.prose h1 {
  @apply text-3xl font-bold mb-6 text-base-content;
}

.prose h2 {
  @apply text-2xl font-semibold mb-4 mt-8 text-base-content;
}

.prose h3 {
  @apply text-lg font-medium mb-2 text-base-content;
}

.prose p {
  @apply mb-4 text-base-content/90;
}

.prose ul {
  @apply list-disc space-y-1 text-sm text-base-content/80;
}

.prose pre {
  @apply bg-base-200 p-3 rounded text-sm font-mono overflow-x-auto;
}
</style>
