import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../../src/views/HomeView.vue';
import EvaluatorView from '../../src/views/EvaluatorView.vue';

// Mock the router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/evaluator', name: 'Evaluator', component: EvaluatorView },
  ],
});

describe('Basic UI Tests', () => {
  it('should render HomeView component', async () => {
    const app = createApp(HomeView);
    app.use(router);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Poker Evaluator'); // Assuming the title is present
  });

  it('should render EvaluatorView component', async () => {
    const app = createApp(EvaluatorView);
    app.use(router);

    const wrapper = mount(EvaluatorView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.exists()).toBe(true);
    // Check for basic elements that should be present
    expect(wrapper.html()).toBeTruthy();
  });

  it('should have navigation between views', async () => {
    const app = createApp(HomeView);
    app.use(router);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    // Check if navigation elements exist (assuming there are links or buttons)
    const links = wrapper.findAll('a, button');
    expect(links.length).toBeGreaterThan(0);
  });
});
