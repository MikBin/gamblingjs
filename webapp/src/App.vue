<template>
  <div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-100 shadow-md">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost text-xl">🃏 GamblingJS WebApp</router-link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/evaluator">Evaluator</router-link></li>
          <li><router-link to="/table">Live Table</router-link></li>
          <li><router-link to="/sng">Sit &amp; Go</router-link></li>
          <li><router-link to="/docs">Docs</router-link></li>
        </ul>
        <button class="btn btn-ghost btn-circle" @click="uiStore.toggleTheme">
            <span v-if="uiStore.isDarkMode">🌙</span>
            <span v-else>☀️</span>
        </button>
      </div>
    </div>

    <main class="flex-1 p-4">
      <router-view></router-view>
    </main>

    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <p>Copyright © 2025 - All right reserved by GamblingJS Team</p>
      </aside>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui';
const uiStore = useUIStore();
</script>
