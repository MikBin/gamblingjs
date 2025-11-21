import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isDarkMode = ref(true); // Default to dark
  const sidebarOpen = ref(false);

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    // Update HTML attribute
    if (isDarkMode.value) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  return {
    isDarkMode,
    sidebarOpen,
    toggleTheme
  };
});
