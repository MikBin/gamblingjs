<template>
  <div class="hero min-h-screen bg-base-100">
    <div class="hero-content text-center py-20">
      <!-- Hero Section -->
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-bold text-base-content mb-6">
          Poker Evaluator
        </h1>
        <p class="text-lg md:text-xl text-base-content/80 mb-8 max-w-3xl mx-auto">
          A modern, interactive poker hand evaluator built with Vue.js 3 and DaisyUI.
          Analyze poker hands, calculate probabilities, and improve your game with advanced Monte Carlo simulations.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <router-link
            to="/evaluator"
            class="btn btn-primary btn-lg px-8 py-4 text-lg"
          >
            🎯 Start Evaluating
          </router-link>
          <router-link
            to="/documentation"
            class="btn btn-secondary btn-lg px-8 py-4 text-lg"
          >
            📚 View Documentation
          </router-link>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">🃏</div>
              <h3 class="card-title text-lg font-bold">Interactive Card Selection</h3>
              <p class="text-base-content/70">
                Click to select cards from a visual deck with real-time validation and feedback.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">📊</div>
              <h3 class="card-title text-lg font-bold">Real-time Evaluation</h3>
              <p class="text-base-content/70">
                Instant hand strength analysis with detailed rankings and probability calculations.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">🎲</div>
              <h3 class="card-title text-lg font-bold">Monte Carlo Simulations</h3>
              <p class="text-base-content/70">
                Advanced probability analysis with customizable simulation parameters.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">📈</div>
              <h3 class="card-title text-lg font-bold">Multiple Game Variants</h3>
              <p class="text-base-content/70">
                Support for Texas Hold'em, Omaha, and other popular poker variants.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">📱</div>
              <h3 class="card-title text-lg font-bold">Mobile Responsive</h3>
              <p class="text-base-content/70">
                Optimized for all devices with touch-friendly interactions.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="card-title text-lg font-bold">Modern UI/UX</h3>
              <p class="text-base-content/70">
                Beautiful interface built with DaisyUI and Tailwind CSS.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="text-4xl mb-4">⚡</div>
              <h3 class="card-title text-lg font-bold">Lightning Fast</h3>
              <p class="text-base-content/70">
                Optimized performance with instant feedback and smooth animations.
              </p>
            </div>
          </div>
        </div>

        <!-- Technology Stack -->
        <div class="tech-stack bg-base-200 rounded-2xl p-8 mb-12">
          <h2 class="text-2xl font-bold text-center mb-8">Built With Modern Technologies</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div class="tech-item">
              <div class="text-3xl mb-2">🟢</div>
              <h4 class="font-semibold">Vue.js 3</h4>
              <p class="text-sm text-base-content/70">Composition API</p>
            </div>
            <div class="tech-item">
              <div class="text-3xl mb-2">🔷</div>
              <h4 class="font-semibold">TypeScript</h4>
              <p class="text-sm text-base-content/70">Type Safety</p>
            </div>
            <div class="tech-item">
              <div class="text-3xl mb-2">🌸</div>
              <h4 class="font-semibold">DaisyUI</h4>
              <p class="text-sm text-base-content/70">Component Library</p>
            </div>
            <div class="tech-item">
              <div class="text-3xl mb-2">🎯</div>
              <h4 class="font-semibold">gamblingjs</h4>
              <p class="text-sm text-base-content/70">Poker Analysis</p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section text-center py-12">
          <h2 class="text-3xl font-bold mb-4">Ready to Master Poker?</h2>
          <p class="text-lg mb-8 text-base-content/80">
            Start analyzing hands like a professional with our comprehensive poker evaluation tools.
          </p>
          <router-link
            to="/evaluator"
            class="btn btn-primary btn-xl px-12 py-6 text-xl"
          >
            Get Started Now
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view is primarily presentational - no additional logic needed
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--fallback-b1, oklch(0.1 0.01 0.99)), var(--fallback-b2, oklch(0.1 0.01 0.98)));
}

.hero-content {
  min-height: calc(100vh - 200px);
}

.card {
  @apply transition-all duration-300 hover:scale-105;
}

.card:hover {
  @apply shadow-2xl;
}

.card-title {
  @apply text-primary mb-2;
}

.tech-item {
  @apply p-4 rounded-lg bg-base-100 transition-all duration-300 hover:scale-105;
}

.cta-section {
  background: linear-gradient(135deg, var(--fallback-p, oklch(0.5 0.01 0.99)), var(--fallback-s, oklch(0.5 0.01 0.98)));
}
</style>
