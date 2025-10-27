<template>
  <div class="min-h-screen bg-base-100">
    <!-- Navigation Header -->
    <header class="navbar bg-base-200 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Title -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-poker-green rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">♠</span>
            </div>
            <router-link to="/" class="text-xl font-bold text-base-content hover:text-primary">
              Poker Hand Evaluator
            </router-link>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-6">
            <router-link
              to="/"
              class="btn btn-ghost btn-sm"
              :class="{ 'btn-active': $route.name === 'home' }"
            >
              Home
            </router-link>
            <router-link
              to="/evaluator"
              class="btn btn-ghost btn-sm"
              :class="{ 'btn-active': $route.name === 'evaluator' }"
            >
              Evaluator
            </router-link>
            <router-link
              to="/documentation"
              class="btn btn-ghost btn-sm"
              :class="{ 'btn-active': $route.name === 'documentation' }"
            >
              Documentation
            </router-link>
          </nav>

          <!-- Theme Toggle -->
          <div class="flex items-center space-x-4">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m6.364 6.364l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button class="btn btn-ghost btn-sm w-full justify-start" @click="setTheme('light')">
                    ☀️ Light
                  </button>
                </li>
                <li>
                  <button class="btn btn-ghost btn-sm w-full justify-start" @click="setTheme('dark')">
                    🌙 Dark
                  </button>
                </li>
                <li>
                  <button class="btn btn-ghost btn-sm w-full justify-start" @click="setTheme('poker')">
                    ♠️ Poker
                  </button>
                </li>
              </ul>
            </div>

            <!-- Mobile Menu Toggle -->
            <div class="md:hidden">
              <button class="btn btn-ghost btn-circle" @click="toggleMobileMenu">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4">
          <router-link
            to="/"
            class="block py-2 text-base-content hover:text-primary"
            @click="toggleMobileMenu"
          >
            Home
          </router-link>
          <router-link
            to="/evaluator"
            class="block py-2 text-base-content hover:text-primary"
            @click="toggleMobileMenu"
          >
            Evaluator
          </router-link>
          <router-link
            to="/documentation"
            class="block py-2 text-base-content hover:text-primary"
            @click="toggleMobileMenu"
          >
            Documentation
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer footer-center p-4 bg-base-200 text-base-content">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-4 md:mb-0">
            <p class="text-sm">
              © 2024 Poker Hand Evaluator. Built with
              <a href="https://vuejs.org/" target="_blank" class="text-primary hover:underline">Vue.js</a>,
              <a href="https://daisyui.com/" target="_blank" class="text-primary hover:underline">DaisyUI</a>, and
              <a href="https://gamblingjs.org/" target="_blank" class="text-primary hover:underline">gamblingjs</a>.
            </p>
          </div>
          <div class="flex space-x-4">
            <a href="https://github.com/your-username/poker-hand-evaluator" target="_blank" class="text-base-content hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.1-.348 1.164-.422 1.485-.845.376-.423.653-.86.726-1.333.036-.175.048-.349.076-.523.077-.874 0-.803-.326-1.532-.898-2.114-.563-.583-1.242-.89-2.114-.89-1.714 0-3.113 1.399-3.113 3.113 0 .629.126 1.231.354 1.779.206.548.473.965.8 1.291.326.326.582.684.8 1.291.218.607.473 1.291.8 1.291.326 0 .548-.218.8-.8 1.291-.326-.607-.473-1.291-.8-1.291-.548 0-1.035.219-1.423.657-.388.438-.657.965-.657 1.423 0 .326.088.629.261.9.657.173.028.326-.088.9-.261.657-.173.574-.218.9-.657.657-.218.438-.657.965 0 .548.219 1.035.657 1.423.438.438.657.965.657 1.423 0 .874-.261 1.713-.8 2.114-.563.583-1.242.89-2.114.89-1.714 0-3.113-1.399-3.113-3.113 0-.629.126-1.231.354-1.779.206-.548.473-.965.8-1.291.326-.326.582-.684.8-1.291.218-.607.473-1.291.8-1.291z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const setTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'poker';
  setTheme(savedTheme);
});
</script>

<style scoped>
.btn-active {
  @apply bg-primary text-primary-content;
}
</style>
