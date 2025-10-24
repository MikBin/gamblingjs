# Vue.js Poker Hand Evaluator - Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Vue.js Poker Hand Evaluator application, covering unit tests, integration tests, end-to-end tests, and performance testing.

## Testing Pyramid

```
    E2E Tests (10%)
   ┌─────────────────┐
  │  Integration     │ (20%)
 ┌─────────────────────┐
│    Unit Tests       │ (70%)
└─────────────────────┘
```

## Testing Tools and Frameworks

### Core Testing Stack
- **Unit Testing**: Vitest + Vue Test Utils
- **Component Testing**: Vue Test Utils + @vue/test-utils
- **Integration Testing**: Vitest with test environment setup
- **E2E Testing**: Playwright or Cypress
- **Performance Testing**: Lighthouse CI
- **Visual Testing**: Percy or Chromatic (optional)

### Additional Tools
- **Coverage**: Vitest built-in coverage with v8 provider
- **Mocking**: Vitest built-in mocking capabilities
- **API Testing**: Mock Service Worker (MSW)
- **Accessibility Testing**: axe-core

## Unit Testing Strategy

### 1. Component Testing

#### Card Component Tests (`tests/unit/components/Card.test.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '@/components/Card.vue';

describe('Card Component', () => {
  it('renders card with correct image when face up', () => {
    const wrapper = mount(Card, {
      props: {
        cardIndex: 0, // Ace of Spades
        isFaceDown: false
      }
    });
    
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toContain('/assets/cards/png/AS.png');
    expect(img.attributes('alt')).toBe('Ace of Spades');
  });
  
  it('renders card back when face down', () => {
    const wrapper = mount(Card, {
      props: {
        cardIndex: 0,
        isFaceDown: true
      }
    });
    
    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('/assets/cards/backs/blue.png');
    expect(img.attributes('alt')).toBe('Card back');
  });
  
  it('applies selected class when isSelected is true', () => {
    const wrapper = mount(Card, {
      props: {
        cardIndex: 0,
        isSelected: true
      }
    });
    
    expect(wrapper.classes()).toContain('card-selected');
  });
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(Card, {
      props: {
        cardIndex: 0
      }
    });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')[0]).toEqual([0]);
  });
  
  it('is accessible with proper ARIA labels', () => {
    const wrapper = mount(Card, {
      props: {
        cardIndex: 0
      }
    });
    
    expect(wrapper.attributes('aria-label')).toBe('Ace of Spades');
    expect(wrapper.attributes('tabindex')).toBe('0');
  });
});
```

#### CardSelector Component Tests (`tests/unit/components/CardSelector.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CardSelector from '@/components/CardSelector.vue';
import { useCardSelection } from '@/composables/useCardSelection';

// Mock the composable
vi.mock('@/composables/useCardSelection', () => ({
  useCardSelection: vi.fn()
}));

describe('CardSelector Component', () => {
  let mockCardSelection: any;
  
  beforeEach(() => {
    mockCardSelection = {
      selectedCards: ref([0, 1]),
      availableCards: computed(() => Array.from({ length: 50 }, (_, i) => i + 2)),
      canSelectMore: computed(() => true),
      selectCard: vi.fn(),
      removeCard: vi.fn(),
      clearSelection: vi.fn(),
      getCardString: vi.fn((index) => `Card ${index}`)
    };
    
    (useCardSelection as any).mockReturnValue(mockCardSelection);
  });
  
  it('renders all available cards', () => {
    const wrapper = mount(CardSelector);
    
    const cards = wrapper.findAllComponents({ name: 'Card' });
    expect(cards.length).toBe(50); // 52 total - 2 selected
  });
  
  it('displays selected cards count', () => {
    const wrapper = mount(CardSelector);
    
    expect(wrapper.text()).toContain('Selected Cards (2)');
  });
  
  it('calls clearSelection when clear button is clicked', async () => {
    const wrapper = mount(CardSelector);
    
    const clearButton = wrapper.find('[data-test="clear-selection"]');
    await clearButton.trigger('click');
    
    expect(mockCardSelection.clearSelection).toHaveBeenCalled();
  });
  
  it('filters cards by suit when filter is applied', async () => {
    const wrapper = mount(CardSelector);
    
    const suitFilter = wrapper.find('[data-test="suit-filter"]');
    await suitFilter.setValue('hearts');
    
    // Verify that only hearts are displayed
    const cards = wrapper.findAllComponents({ name: 'Card' });
    // Implementation would depend on filtering logic
  });
});
```

### 2. Composable Testing

#### useCardSelection Tests (`tests/unit/composables/useCardSelection.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useCardSelection } from '@/composables/useCardSelection';

describe('useCardSelection', () => {
  beforeEach(() => {
    // Reset state before each test
    const { clearSelection } = useCardSelection();
    clearSelection();
  });
  
  it('starts with empty selection', () => {
    const { selectedCards, availableCards } = useCardSelection();
    
    expect(selectedCards.value).toEqual([]);
    expect(availableCards.value).toHaveLength(52);
  });
  
  it('can select a card', () => {
    const { selectCard, selectedCards, availableCards } = useCardSelection();
    
    selectCard(0);
    
    expect(selectedCards.value).toContain(0);
    expect(availableCards.value).not.toContain(0);
    expect(availableCards.value).toHaveLength(51);
  });
  
  it('can remove a selected card', () => {
    const { selectCard, removeCard, selectedCards, availableCards } = useCardSelection();
    
    selectCard(0);
    removeCard(0);
    
    expect(selectedCards.value).not.toContain(0);
    expect(availableCards.value).toContain(0);
  });
  
  it('prevents duplicate selection', () => {
    const { selectCard, selectedCards } = useCardSelection();
    
    selectCard(0);
    selectCard(0);
    
    expect(selectedCards.value).toEqual([0]);
  });
  
  it('respects max selection limit', () => {
    const { selectCard, selectedCards, setMaxSelection } = useCardSelection();
    
    setMaxSelection(2);
    selectCard(0);
    selectCard(1);
    selectCard(2); // Should be ignored
    
    expect(selectedCards.value).toEqual([0, 1]);
  });
  
  it('provides correct card string representation', () => {
    const { getCardString } = useCardSelection();
    
    expect(getCardString(0)).toBe('A♠'); // Ace of Spades
    expect(getCardString(1)).toBe('2♠'); // 2 of Spades
    expect(getCardString(13)).toBe('A♥'); // Ace of Hearts
  });
  
  it('provides correct card color', () => {
    const { getCardColor } = useCardSelection();
    
    expect(getCardColor(0)).toBe('black'); // Spades
    expect(getCardColor(13)).toBe('red'); // Hearts
    expect(getCardColor(26)).toBe('red'); // Diamonds
    expect(getCardColor(39)).toBe('black'); // Clubs
  });
});
```

#### usePokerEvaluator Tests (`tests/unit/composables/usePokerEvaluator.test.ts`)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePokerEvaluator } from '@/composables/usePokerEvaluator';

// Mock the gamblingjs library
vi.mock('../../../gamblingjs/src/PokerEvaluator', () => ({
  PokerEvaluator: {
    evaluate7CardsVerbose: vi.fn(),
    evaluate5Cards: vi.fn(),
    evaluateTexasHoldem: vi.fn()
  },
  GameVariant: {
    HIGH: 'high',
    TEXAS_HOLDEM: 'texas-holdem'
  }
}));

describe('usePokerEvaluator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('evaluates 7-card hand successfully', async () => {
    const { evaluateHand, isEvaluating, evaluationError } = usePokerEvaluator();
    const mockResult = {
      handRank: 1000,
      handGroup: 'Pair',
      winningCards: [0, 1, 2, 3, 4]
    };
    
    // Mock the implementation
    const mockEvaluate = vi.fn().mockResolvedValue(mockResult);
    (vi.importMock('../../../gamblingjs/src/PokerEvaluator').PokerEvaluator.evaluate7CardsVerbose as any) = mockEvaluate;
    
    const result = await evaluateHand([0, 1, 2, 3, 4, 5, 6]);
    
    expect(isEvaluating.value).toBe(false);
    expect(evaluationError.value).toBe(null);
    expect(result).toEqual(mockResult);
  });
  
  it('handles evaluation errors', async () => {
    const { evaluateHand, isEvaluating, evaluationError } = usePokerEvaluator();
    
    const mockEvaluate = vi.fn().mockRejectedValue(new Error('Invalid hand'));
    (vi.importMock('../../../gamblingjs/src/PokerEvaluator').PokerEvaluator.evaluate7CardsVerbose as any) = mockEvaluate;
    
    await expect(evaluateHand([0, 1, 2])).rejects.toThrow('Invalid hand');
    
    expect(isEvaluating.value).toBe(false);
    expect(evaluationError.value).toBe('Invalid hand');
  });
  
  it('validates hand size before evaluation', async () => {
    const { evaluateHand } = usePokerEvaluator();
    
    await expect(evaluateHand([0, 1, 2, 3, 4, 5])).rejects.toThrow('Hand must contain 5 or 7 cards');
  });
  
  it('provides correct hand description', () => {
    const { getHandDescription } = usePokerEvaluator();
    
    expect(getHandDescription(6185)).toBe('Royal Flush');
    expect(getHandDescription(6000)).toBe('Straight Flush');
    expect(getHandDescription(5900)).toBe('Four of a Kind');
    expect(getHandDescription(1000)).toBe('One Pair');
    expect(getHandDescription(100)).toBe('High Card');
  });
  
  it('calculates hand strength percentage correctly', () => {
    const { getHandStrengthPercentage } = usePokerEvaluator();
    
    expect(getHandStrengthPercentage(6185)).toBe(0); // Worst hand
    expect(getHandStrengthPercentage(0)).toBe(100); // Best hand
    expect(getHandStrengthPercentage(3092)).toBeCloseTo(50); // Average hand
  });
});
```

### 3. Store Testing

#### Poker Store Tests (`tests/unit/stores/poker.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePokerStore } from '@/stores/poker';
import { GameVariant } from '../../../gamblingjs/src/PokerEvaluator';

describe('Poker Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('initializes with default state', () => {
    const store = usePokerStore();
    
    expect(store.gameVariant).toBe(GameVariant.TEXAS_HOLDEM);
    expect(store.pocketCards).toEqual([]);
    expect(store.communityCards).toEqual([]);
    expect(store.gameStage).toBe('preflop');
  });
  
  it('can set pocket cards', () => {
    const store = usePokerStore();
    
    store.setPocketCards([0, 1]);
    
    expect(store.pocketCards).toEqual([0, 1]);
  });
  
  it('can add pocket cards', () => {
    const store = usePokerStore();
    
    store.addPocketCard(0);
    store.addPocketCard(1);
    
    expect(store.pocketCards).toEqual([0, 1]);
  });
  
  it('prevents duplicate pocket cards', () => {
    const store = usePokerStore();
    
    store.addPocketCard(0);
    store.addPocketCard(0); // Should be ignored
    
    expect(store.pocketCards).toEqual([0]);
  });
  
  it('limits pocket cards to 2', () => {
    const store = usePokerStore();
    
    store.addPocketCard(0);
    store.addPocketCard(1);
    store.addPocketCard(2); // Should be ignored
    
    expect(store.pocketCards).toEqual([0, 1]);
  });
  
  it('updates game stage based on community cards', () => {
    const store = usePokerStore();
    
    store.setCommunityCards([10, 11, 12]); // Flop
    expect(store.gameStage).toBe('flop');
    
    store.addCommunityCard(13); // Turn
    expect(store.gameStage).toBe('turn');
    
    store.addCommunityCard(14); // River
    expect(store.gameStage).toBe('river');
  });
  
  it('can reset hand', () => {
    const store = usePokerStore();
    
    store.setPocketCards([0, 1]);
    store.setCommunityCards([10, 11, 12]);
    store.resetHand();
    
    expect(store.pocketCards).toEqual([]);
    expect(store.communityCards).toEqual([]);
    expect(store.gameStage).toBe('preflop');
  });
  
  it('saves evaluation to history', () => {
    const store = usePokerStore();
    
    store.setPocketCards([0, 1]);
    store.setCommunityCards([10, 11, 12]);
    
    const mockResult = {
      handRank: 1000,
      handGroup: 'Pair',
      winningCards: [0, 1, 10, 11, 12]
    };
    
    store.setEvaluationResult(mockResult);
    store.saveToHistory('Test hand');
    
    expect(store.evaluationHistory).toHaveLength(1);
    expect(store.evaluationHistory[0]).toMatchObject({
      gameVariant: GameVariant.TEXAS_HOLDEM,
      pocketCards: [0, 1],
      communityCards: [10, 11, 12],
      result: mockResult,
      notes: 'Test hand'
    });
  });
});
```

## Integration Testing Strategy

### 1. Component Integration Tests

#### EvaluatorView Integration Tests (`tests/integration/EvaluatorView.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import EvaluatorView from '@/views/EvaluatorView.vue';

describe('EvaluatorView Integration', () => {
  let router: any;
  let pinia: any;
  
  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: EvaluatorView }
      ]
    });
    
    pinia = createPinia();
  });
  
  it('integrates card selector with hand display', async () => {
    const wrapper = mount(EvaluatorView, {
      global: {
        plugins: [router, pinia]
      }
    });
    
    // Select cards from card selector
    const cardSelector = wrapper.findComponent({ name: 'CardSelector' });
    const firstCard = cardSelector.find('[data-test="card-0"]');
    await firstCard.trigger('click');
    
    // Verify card appears in hand display
    const handDisplay = wrapper.findComponent({ name: 'HandDisplay' });
    const pocketCards = handDisplay.findAll('[data-test="pocket-card"]');
    expect(pocketCards).toHaveLength(1);
  });
  
  it('triggers evaluation when hand is complete', async () => {
    const wrapper = mount(EvaluatorView, {
      global: {
        plugins: [router, pinia]
      }
    });
    
    // Select complete hand (2 pocket + 3 community cards)
    const cardSelector = wrapper.findComponent({ name: 'CardSelector' });
    
    // Select pocket cards
    await cardSelector.vm.$emit('card-selected', 0);
    await cardSelector.vm.$emit('card-selected', 1);
    
    // Select community cards
    await cardSelector.vm.$emit('card-selected', 10);
    await cardSelector.vm.$emit('card-selected', 11);
    await cardSelector.vm.$emit('card-selected', 12);
    
    // Wait for evaluation to complete
    await wrapper.vm.$nextTick();
    
    // Verify evaluation results are displayed
    const handRanking = wrapper.findComponent({ name: 'HandRankingDisplay' });
    expect(handRanking.exists()).toBe(true);
  });
});
```

### 2. API Integration Tests

#### Monte Carlo Integration Tests (`tests/integration/MonteCarlo.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useMonteCarlo } from '@/composables/useMonteCarlo';

// Mock Web Worker
class MockWorker {
  onmessage: ((event: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  
  postMessage(data: any) {
    // Simulate worker response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({
          data: {
            type: 'result',
            result: {
              winProbability: 0.65,
              tieProbability: 0.05,
              loseProbability: 0.30,
              equity: 0.65,
              handDistribution: {
                'high card': 0.1,
                'one pair': 0.4,
                'two pair': 0.3,
                'three of a kind': 0.2
              }
            }
          }
        });
      }
    }, 100);
  }
  
  terminate() {
    // Mock termination
  }
}

// Mock Worker constructor
global.Worker = MockWorker as any;

describe('Monte Carlo Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('runs simulation with Web Worker', async () => {
    const { runSimulation, isSimulating, simulationResult } = useMonteCarlo();
    
    const settings = {
      numRuns: 10000,
      numOpponents: 2,
      opponentRange: 'random' as const,
      calculateEquity: true,
      calculateOuts: false
    };
    
    const promise = runSimulation([0, 1, 2], settings);
    
    expect(isSimulating.value).toBe(true);
    
    const result = await promise;
    
    expect(isSimulating.value).toBe(false);
    expect(simulationResult.value).toEqual(result);
    expect(result.winProbability).toBe(0.65);
  });
});
```

## End-to-End Testing Strategy

### 1. User Journey Tests

#### Complete Poker Evaluation Flow (`tests/e2e/poker-evaluation.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Poker Hand Evaluation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('complete poker evaluation workflow', async ({ page }) => {
    // Navigate to evaluator
    await page.click('[data-test="nav-evaluator"]');
    await expect(page).toHaveURL('/evaluator');
    
    // Select pocket cards
    await page.click('[data-test="card-0"]'); // Ace of Spades
    await page.click('[data-test="card-1"]'); // 2 of Spades
    
    // Verify pocket cards are displayed
    await expect(page.locator('[data-test="pocket-cards"] [data-test="card"]')).toHaveCount(2);
    
    // Select community cards (flop)
    await page.click('[data-test="card-10"]'); // Ace of Hearts
    await page.click('[data-test="card-11"]'); // 2 of Hearts
    await page.click('[data-test="card-12"]'); // 3 of Hearts
    
    // Verify community cards are displayed
    await expect(page.locator('[data-test="community-cards"] [data-test="card"]')).toHaveCount(3);
    
    // Wait for evaluation to complete
    await expect(page.locator('[data-test="hand-ranking"]')).toBeVisible();
    
    // Verify evaluation results
    await expect(page.locator('[data-test="hand-rank-name"]')).toBeVisible();
    await expect(page.locator('[data-test="hand-strength-meter"]')).toBeVisible();
    
    // Run Monte Carlo simulation
    await page.click('[data-test="run-simulation"]');
    
    // Wait for simulation to complete
    await expect(page.locator('[data-test="simulation-results"]')).toBeVisible();
    
    // Verify simulation results
    await expect(page.locator('[data-test="win-probability"]')).toBeVisible();
    await expect(page.locator('[data-test="equity-display"]')).toBeVisible();
    
    // Save hand to history
    await page.click('[data-test="save-to-history"]');
    
    // Navigate to history and verify saved hand
    await page.click('[data-test="nav-history"]');
    await expect(page.locator('[data-test="history-item"]')).toHaveCount(1);
  });
  
  test('handles invalid card selections', async ({ page }) => {
    await page.click('[data-test="nav-evaluator"]');
    
    // Try to select the same card twice
    await page.click('[data-test="card-0"]');
    await page.click('[data-test="card-0"]'); // Should be ignored
    
    // Verify only one card is selected
    await expect(page.locator('[data-test="selected-cards"] [data-test="card"]')).toHaveCount(1);
    
    // Try to select more than 7 cards
    for (let i = 0; i < 8; i++) {
      await page.click(`[data-test="card-${i}"]`);
    }
    
    // Verify only 7 cards are selected
    await expect(page.locator('[data-test="selected-cards"] [data-test="card"]')).toHaveCount(7);
  });
  
  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('[data-test="nav-evaluator"]');
    
    // Verify mobile layout
    await expect(page.locator('[data-test="mobile-card-selector"]')).toBeVisible();
    await expect(page.locator('[data-test="mobile-hand-display"]')).toBeVisible();
    
    // Test touch interactions
    await page.tap('[data-test="card-0"]');
    await expect(page.locator('[data-test="selected-cards"] [data-test="card"]')).toHaveCount(1);
  });
});
```

### 2. Accessibility Tests

#### Accessibility Compliance (`tests/e2e/accessibility.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });
  
  test('home page is accessible', async ({ page }) => {
    await checkA11y(page);
  });
  
  test('evaluator page is accessible', async ({ page }) => {
    await page.click('[data-test="nav-evaluator"]');
    await checkA11y(page);
  });
  
  test('card selection is keyboard accessible', async ({ page }) => {
    await page.click('[data-test="nav-evaluator"]');
    
    // Tab to first card
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="card-0"]')).toBeFocused();
    
    // Select card with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-test="selected-cards"] [data-test="card"]')).toHaveCount(1);
    
    // Navigate through cards with arrow keys
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-test="card-1"]')).toBeFocused();
  });
  
  test('screen reader announcements work', async ({ page }) => {
    await page.click('[data-test="nav-evaluator"]');
    
    // Enable screen reader mode
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Select card and verify announcement
    await page.click('[data-test="card-0"]');
    
    const announcement = await page.locator('[data-test="sr-announcement"]');
    await expect(announcement).toContainText('Ace of Spades selected');
  });
});
```

## Performance Testing Strategy

### 1. Load Performance

#### Lighthouse CI Configuration (`.lighthouserc.js`)

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/evaluator'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### 2. Component Performance Tests

#### Card Component Performance (`tests/performance/Card.performance.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '@/components/Card.vue';

describe('Card Component Performance', () => {
  it('renders efficiently with many cards', () => {
    const startTime = performance.now();
    
    const wrappers = [];
    for (let i = 0; i < 52; i++) {
      wrappers.push(mount(Card, {
        props: { cardIndex: i }
      }));
    }
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render all 52 cards in under 100ms
    expect(renderTime).toBeLessThan(100);
    
    // Cleanup
    wrappers.forEach(wrapper => wrapper.unmount());
  });
  
  it('updates efficiently when props change', async () => {
    const wrapper = mount(Card, {
      props: { cardIndex: 0, isSelected: false }
    });
    
    const startTime = performance.now();
    
    // Update props multiple times
    for (let i = 0; i < 100; i++) {
      await wrapper.setProps({ isSelected: i % 2 === 0 });
    }
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Should handle 100 updates in under 50ms
    expect(updateTime).toBeLessThan(50);
    
    wrapper.unmount();
  });
});
```

## Continuous Integration Testing

### GitHub Actions Workflow (`.github/workflows/test.yml`)

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run integration tests
      run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: npm run preview &
    
    - name: Wait for application to start
      run: sleep 10
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun
    
    - name: Upload Lighthouse results
      uses: actions/upload-artifact@v3
      with:
        name: lighthouse-results
        path: .lighthouseci/
```

## Coverage Requirements

### Target Coverage Metrics
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### Coverage Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.ts',
        'src/style.css'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
});
```

This comprehensive testing strategy ensures the Vue.js Poker Hand Evaluator application is thoroughly tested across all levels, from individual components to complete user workflows, with special attention to performance and accessibility requirements.
