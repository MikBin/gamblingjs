# Vue.js Poker Hand Evaluator - Technical Specification

## Component Specifications

### 1. Card Component (`src/components/Card.vue`)

#### Props Interface
```typescript
interface CardProps {
  cardIndex: number;        // 0-51 representing standard deck
  isSelected?: boolean;     // Visual selection state
  isFaceDown?: boolean;     // Show card back
  isDisabled?: boolean;     // Disable interaction
  size?: 'small' | 'medium' | 'large'; // Display size
  onClick?: (cardIndex: number) => void; // Click handler
}
```

#### Features
- Card image display using assets from `gamble/dist/gamble/assets`
- Hover effects with CSS transitions
- Selection state visualization
- Card flip animation
- Accessibility support with ARIA labels

#### Implementation Details
```vue
<template>
  <div 
    :class="cardClasses"
    @click="handleClick"
    :aria-label="cardAriaLabel"
    :tabindex="isDisabled ? -1 : 0"
    @keydown.enter="handleClick"
  >
    <img 
      v-if="!isFaceDown" 
      :src="cardImagePath" 
      :alt="cardDescription"
      loading="lazy"
    />
    <img 
      v-else 
      src="/assets/cards/back.png" 
      alt="Card back"
    />
  </div>
</template>
```

### 2. CardSelector Component (`src/components/CardSelector.vue`)

#### State Management
```typescript
interface CardSelectorState {
  availableCards: number[];
  selectedCards: number[];
  filterSuit?: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  filterRank?: string;
  viewMode: 'grid' | 'list';
}
```

#### Features
- Interactive deck visualization with all 52 cards
- Click-to-select with visual feedback
- Filter by suit and rank
- Search functionality
- Keyboard navigation
- Multi-selection support

#### Implementation Details
```vue
<template>
  <div class="card-selector">
    <div class="selector-controls">
      <input v-model="searchQuery" placeholder="Search cards..." />
      <select v-model="filterSuit">
        <option value="">All Suits</option>
        <option value="hearts">Hearts</option>
        <option value="diamonds">Diamonds</option>
        <option value="clubs">Clubs</option>
        <option value="spades">Spades</option>
      </select>
      <button @click="clearSelection">Clear Selection</button>
    </div>
    
    <div class="cards-grid" :class="viewMode">
      <Card
        v-for="cardIndex in filteredCards"
        :key="cardIndex"
        :card-index="cardIndex"
        :is-selected="selectedCards.includes(cardIndex)"
        @click="toggleCardSelection"
      />
    </div>
    
    <div class="selected-cards">
      <h3>Selected Cards ({{ selectedCards.length }})</h3>
      <div class="selected-cards-list">
        <Card
          v-for="cardIndex in selectedCards"
          :key="`selected-${cardIndex}`"
          :card-index="cardIndex"
          :is-selected="true"
          @click="removeCard"
        />
      </div>
    </div>
  </div>
</template>
```

### 3. HandDisplay Component (`src/components/HandDisplay.vue`)

#### Props Interface
```typescript
interface HandDisplayProps {
  pocketCards: number[];
  communityCards: number[];
  gameStage: 'preflop' | 'flop' | 'turn' | 'river';
  showLabels?: boolean;
  interactive?: boolean;
}
```

#### Features
- Separate sections for pocket and community cards
- Game stage indicators
- Card addition animations
- Drag and drop support for card reordering
- Empty slot placeholders

#### Implementation Details
```vue
<template>
  <div class="hand-display">
    <div class="pocket-cards-section">
      <h3 v-if="showLabels">Pocket Cards</h3>
      <div class="cards-container">
        <div 
          v-for="i in 2" 
          :key="`pocket-${i}`"
          class="card-slot"
          :class="{ empty: !pocketCards[i-1] }"
        >
          <Card
            v-if="pocketCards[i-1] !== undefined"
            :card-index="pocketCards[i-1]"
            :is-selected="true"
            @click="interactive ? removePocketCard(i-1) : null"
          />
          <div v-else class="empty-slot">
            <span>Empty</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="community-cards-section">
      <h3 v-if="showLabels">Community Cards</h3>
      <div class="cards-container">
        <div 
          v-for="i in 5" 
          :key="`community-${i}`"
          class="card-slot"
          :class="{ 
            empty: !communityCards[i-1],
            disabled: i > communityCards.length && 
                     (gameStage === 'preflop' || 
                      (gameStage === 'flop' && i > 3) ||
                      (gameStage === 'turn' && i > 4))
          }"
        >
          <Card
            v-if="communityCards[i-1] !== undefined"
            :card-index="communityCards[i-1]"
            :is-selected="true"
            @click="interactive ? removeCommunityCard(i-1) : null"
          />
          <div v-else class="empty-slot">
            <span>{{ getStageLabel(i) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 4. MonteCarloSimulator Component (`src/components/MonteCarloSimulator.vue`)

#### State Management
```typescript
interface SimulationState {
  isRunning: boolean;
  progress: number;
  results: SimulationResult | null;
  settings: SimulationSettings;
}

interface SimulationSettings {
  numRuns: number;
  numOpponents: number;
  opponentRange: 'random' | 'tight' | 'loose' | 'custom';
  calculateEquity: boolean;
  calculateOuts: boolean;
}

interface SimulationResult {
  winProbability: number;
  tieProbability: number;
  loseProbability: number;
  equity: number;
  handStrength: number;
  outs: OutsResult[];
  handDistribution: HandCategoryDistribution;
}
```

#### Features
- Configurable simulation parameters
- Real-time progress updates
- Detailed probability breakdowns
- Outs calculation for drawing hands
- Equity distribution visualization
- Performance optimization with Web Workers

#### Implementation Details
```vue
<template>
  <div class="monte-carlo-simulator">
    <div class="simulation-controls">
      <h3>Monte Carlo Simulation</h3>
      
      <div class="settings-panel">
        <div class="setting-group">
          <label>Number of Simulations:</label>
          <input 
            v-model.number="settings.numRuns" 
            type="range" 
            min="1000" 
            max="100000" 
            step="1000"
          />
          <span>{{ settings.numRuns.toLocaleString() }}</span>
        </div>
        
        <div class="setting-group">
          <label>Number of Opponents:</label>
          <input 
            v-model.number="settings.numOpponents" 
            type="range" 
            min="1" 
            max="9" 
          />
          <span>{{ settings.numOpponents }}</span>
        </div>
        
        <div class="setting-group">
          <label>Opponent Range:</label>
          <select v-model="settings.opponentRange">
            <option value="random">Random</option>
            <option value="tight">Tight</option>
            <option value="loose">Loose</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      
      <div class="simulation-actions">
        <button 
          @click="runSimulation" 
          :disabled="isRunning || !canRunSimulation"
          class="btn btn-primary"
        >
          <span v-if="!isRunning">Run Simulation</span>
          <span v-else>Running... {{ progress }}%</span>
        </button>
        <button 
          @click="stopSimulation" 
          :disabled="!isRunning"
          class="btn btn-secondary"
        >
          Stop
        </button>
      </div>
    </div>
    
    <div v-if="results" class="simulation-results">
      <div class="probability-breakdown">
        <h4>Win Probability</h4>
        <div class="probability-bar">
          <div 
            class="win-segment" 
            :style="{ width: `${results.winProbability * 100}%` }"
          >
            {{ (results.winProbability * 100).toFixed(1) }}%
          </div>
          <div 
            class="tie-segment" 
            :style="{ width: `${results.tieProbability * 100}%` }"
          >
            {{ (results.tieProbability * 100).toFixed(1) }}%
          </div>
          <div 
            class="lose-segment" 
            :style="{ width: `${results.loseProbability * 100}%` }"
          >
            {{ (results.loseProbability * 100).toFixed(1) }}%
          </div>
        </div>
      </div>
      
      <div class="equity-display">
        <h4>Equity: {{ (results.equity * 100).toFixed(1) }}%</h4>
      </div>
      
      <div v-if="settings.calculateOuts && results.outs.length" class="outs-display">
        <h4>Outs to Improve</h4>
        <div class="outs-list">
          <div 
            v-for="out in results.outs" 
            :key="out.handType"
            class="out-item"
          >
            <span class="hand-type">{{ out.handType }}</span>
            <span class="out-count">{{ out.count }} cards</span>
            <span class="probability">{{ (out.probability * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
      
      <div class="hand-distribution">
        <h4>Hand Distribution</h4>
        <div class="distribution-chart">
          <div 
            v-for="(probability, handType) in results.handDistribution" 
            :key="handType"
            class="distribution-item"
          >
            <span class="hand-type">{{ handType }}</span>
            <div class="probability-bar">
              <div 
                class="probability-fill" 
                :style="{ width: `${probability * 100}%` }"
              ></div>
            </div>
            <span class="probability-value">{{ (probability * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 5. HandRankingDisplay Component (`src/components/HandRankingDisplay.vue`)

#### Props Interface
```typescript
interface HandRankingDisplayProps {
  handRank: number;
  handCards: number[];
  winningCards: number[];
  gameVariant: GameVariant;
  showDetails?: boolean;
  showComparison?: boolean;
}
```

#### Features
- Visual hand ranking display
- Winning cards highlighting
- Hand strength meter
- Comparison with previous hands
- Detailed hand analysis
- Export functionality

#### Implementation Details
```vue
<template>
  <div class="hand-ranking-display">
    <div class="hand-rank-header">
      <h3>Hand Evaluation</h3>
      <div class="rank-badge" :class="rankClass">
        {{ handRankName }}
      </div>
    </div>
    
    <div class="hand-cards-display">
      <Card
        v-for="(cardIndex, i) in handCards"
        :key="`hand-card-${i}`"
        :card-index="cardIndex"
        :is-selected="winningCards.includes(cardIndex)"
        size="large"
      />
    </div>
    
    <div class="hand-strength-meter">
      <div class="strength-label">Hand Strength</div>
      <div class="strength-bar">
        <div 
          class="strength-fill" 
          :style="{ width: `${handStrengthPercentage}%` }"
          :class="strengthClass"
        ></div>
      </div>
      <div class="strength-value">{{ handStrengthPercentage }}%</div>
    </div>
    
    <div v-if="showDetails" class="hand-details">
      <h4>Hand Analysis</h4>
      <div class="analysis-grid">
        <div class="analysis-item">
          <span class="label">Rank Value:</span>
          <span class="value">{{ handRank }}</span>
        </div>
        <div class="analysis-item">
          <span class="label">Percentile:</span>
          <span class="value">{{ handPercentile }}%</span>
        </div>
        <div class="analysis-item">
          <span class="label">Category:</span>
          <span class="value">{{ handCategory }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="showComparison" class="hand-comparison">
      <h4>Historical Comparison</h4>
      <div class="comparison-chart">
        <!-- Chart implementation for comparing with previous hands -->
      </div>
    </div>
    
    <div class="hand-actions">
      <button @click="exportHand" class="btn btn-secondary">
        Export Hand
      </button>
      <button @click="saveToHistory" class="btn btn-primary">
        Save to History
      </button>
    </div>
  </div>
</template>
```

## Composable Functions Specifications

### usePokerEvaluator (`src/composables/usePokerEvaluator.ts`)

```typescript
import { ref, computed } from 'vue';
import { PokerEvaluator, GameVariant } from '../../gamblingjs/src/PokerEvaluator';
import type { verboseHandInfo } from '../../gamblingjs/src/interfaces';

export function usePokerEvaluator() {
  const isEvaluating = ref(false);
  const lastEvaluation = ref<verboseHandInfo | null>(null);
  const evaluationError = ref<string | null>(null);
  
  const evaluateHand = async (
    cards: number[], 
    variant: GameVariant = GameVariant.HIGH
  ): Promise<verboseHandInfo> => {
    isEvaluating.value = true;
    evaluationError.value = null;
    
    try {
      if (cards.length !== 5 && cards.length !== 7) {
        throw new Error(`Hand must contain 5 or 7 cards, got ${cards.length}`);
      }
      
      const result = cards.length === 7 
        ? PokerEvaluator.evaluate7CardsVerbose(cards, variant)
        : PokerEvaluator.evaluate5Cards(cards, variant);
        
      lastEvaluation.value = result;
      return result;
    } catch (error) {
      evaluationError.value = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      isEvaluating.value = false;
    }
  };
  
  const evaluateTexasHoldem = async (
    holeCards: number[],
    communityCards: number[]
  ) => {
    isEvaluating.value = true;
    evaluationError.value = null;
    
    try {
      if (holeCards.length !== 2) {
        throw new Error(`Hole cards must contain exactly 2 cards, got ${holeCards.length}`);
      }
      
      if (communityCards.length < 3 || communityCards.length > 5) {
        throw new Error(`Community cards must contain 3-5 cards, got ${communityCards.length}`);
      }
      
      const result = PokerEvaluator.evaluateTexasHoldem(holeCards, communityCards);
      return result;
    } catch (error) {
      evaluationError.value = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      isEvaluating.value = false;
    }
  };
  
  const getHandDescription = (rank: number): string => {
    // Convert rank to human-readable description
    if (rank >= 6185) return 'Royal Flush';
    if (rank >= 5996) return 'Straight Flush';
    if (rank >= 5863) return 'Four of a Kind';
    if (rank >= 5853) return 'Full House';
    if (rank >= 5822) return 'Flush';
    if (rank >= 5780) return 'Straight';
    if (rank >= 5695) return 'Three of a Kind';
    if (rank >= 5640) return 'Two Pair';
    if (rank >= 5118) return 'One Pair';
    return 'High Card';
  };
  
  const getHandStrengthPercentage = (rank: number): number => {
    // Convert rank to percentage (0-100)
    return Math.max(0, Math.min(100, ((6185 - rank) / 6185) * 100));
  };
  
  return {
    // State
    isEvaluating: readonly(isEvaluating),
    lastEvaluation: readonly(lastEvaluation),
    evaluationError: readonly(evaluationError),
    
    // Methods
    evaluateHand,
    evaluateTexasHoldem,
    getHandDescription,
    getHandStrengthPercentage
  };
}
```

### useMonteCarlo (`src/composables/useMonteCarlo.ts`)

```typescript
import { ref, computed } from 'vue';
import { getPartialHandStatsIndexed_7 } from '../../gamblingjs/src/pokerMontecarloSym';
import type { handCategoryDistribution } from '../../gamblingjs/src/interfaces';

interface SimulationSettings {
  numRuns: number;
  numOpponents: number;
  opponentRange: 'random' | 'tight' | 'loose' | 'custom';
}

interface SimulationResult {
  winProbability: number;
  tieProbability: number;
  loseProbability: number;
  equity: number;
  handDistribution: handCategoryDistribution;
}

export function useMonteCarlo() {
  const isSimulating = ref(false);
  const simulationProgress = ref(0);
  const simulationResult = ref<SimulationResult | null>(null);
  const simulationError = ref<string | null>(null);
  
  const runSimulation = async (
    partialHand: number[],
    settings: SimulationSettings
  ): Promise<SimulationResult> => {
    isSimulating.value = true;
    simulationProgress.value = 0;
    simulationError.value = null;
    
    try {
      // Use Web Worker for heavy computation
      const worker = new Worker('/workers/monteCarloWorker.js');
      
      return new Promise((resolve, reject) => {
        worker.postMessage({
          partialHand,
          settings
        });
        
        worker.onmessage = (event) => {
          const { type, data } = event.data;
          
          if (type === 'progress') {
            simulationProgress.value = data.progress;
          } else if (type === 'result') {
            simulationResult.value = data.result;
            isSimulating.value = false;
            worker.terminate();
            resolve(data.result);
          } else if (type === 'error') {
            simulationError.value = data.error;
            isSimulating.value = false;
            worker.terminate();
            reject(new Error(data.error));
          }
        };
        
        worker.onerror = (error) => {
          simulationError.value = error.message;
          isSimulating.value = false;
          worker.terminate();
          reject(error);
        };
      });
    } catch (error) {
      isSimulating.value = false;
      simulationError.value = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  };
  
  const runSimpleSimulation = (
    partialHand: number[],
    numRuns: number = 10000
  ): handCategoryDistribution => {
    return getPartialHandStatsIndexed_7(partialHand, numRuns);
  };
  
  const calculateWinProbability = (
    heroHand: number[],
    opponentHands: number[][],
    communityCards: number[] = []
  ): number => {
    // Simplified win probability calculation
    // In a real implementation, this would use the gamblingjs library
    // to calculate exact win probabilities against specific opponent hands
    
    let wins = 0;
    const totalSimulations = 1000;
    
    for (let i = 0; i < totalSimulations; i++) {
      // Simulate remaining community cards if needed
      const fullCommunityCards = [...communityCards];
      
      // Evaluate hero hand
      const heroRank = PokerEvaluator.evaluate7Cards([
        ...heroHand,
        ...fullCommunityCards
      ]);
      
      // Evaluate opponent hands
      let heroWins = true;
      for (const opponentHand of opponentHands) {
        const opponentRank = PokerEvaluator.evaluate7Cards([
          ...opponentHand,
          ...fullCommunityCards
        ]);
        
        if (opponentRank >= heroRank) {
          heroWins = false;
          break;
        }
      }
      
      if (heroWins) wins++;
    }
    
    return wins / totalSimulations;
  };
  
  return {
    // State
    isSimulating: readonly(isSimulating),
    simulationProgress: readonly(simulationProgress),
    simulationResult: readonly(simulationResult),
    simulationError: readonly(simulationError),
    
    // Methods
    runSimulation,
    runSimpleSimulation,
    calculateWinProbability
  };
}
```

### useCardSelection (`src/composables/useCardSelection.ts`)

```typescript
import { ref, computed } from 'vue';

export function useCardSelection() {
  const selectedCards = ref<number[]>([]);
  const maxSelection = ref(7); // Default max for 7-card games
  
  const availableCards = computed(() => {
    const allCards = Array.from({ length: 52 }, (_, i) => i);
    return allCards.filter(card => !selectedCards.value.includes(card));
  });
  
  const canSelectMore = computed(() => {
    return selectedCards.value.length < maxSelection.value;
  });
  
  const selectCard = (cardIndex: number) => {
    if (selectedCards.value.includes(cardIndex)) {
      removeCard(cardIndex);
    } else if (canSelectMore.value) {
      selectedCards.value.push(cardIndex);
    }
  };
  
  const removeCard = (cardIndex: number) => {
    const index = selectedCards.value.indexOf(cardIndex);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    }
  };
  
  const clearSelection = () => {
    selectedCards.value = [];
  };
  
  const setMaxSelection = (max: number) => {
    maxSelection.value = max;
    // Remove excess cards if current selection exceeds new max
    if (selectedCards.value.length > max) {
      selectedCards.value = selectedCards.value.slice(0, max);
    }
  };
  
  const getCardString = (cardIndex: number): string => {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♥', '♦', '♣'];
    
    const rank = ranks[cardIndex % 13];
    const suit = suits[Math.floor(cardIndex / 13)];
    
    return `${rank}${suit}`;
  };
  
  const getCardColor = (cardIndex: number): 'red' | 'black' => {
    const suit = Math.floor(cardIndex / 13);
    return suit === 1 || suit === 2 ? 'red' : 'black'; // Hearts and Diamonds are red
  };
  
  return {
    // State
    selectedCards: readonly(selectedCards),
    availableCards,
    canSelectMore,
    
    // Methods
    selectCard,
    removeCard,
    clearSelection,
    setMaxSelection,
    getCardString,
    getCardColor
  };
}
```

## Store Specifications

### Poker Store (`src/stores/poker.ts`)

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GameVariant } from '../../gamblingjs/src/PokerEvaluator';
import type { verboseHandInfo } from '../../gamblingjs/src/interfaces';

interface EvaluationRecord {
  id: string;
  timestamp: Date;
  gameVariant: GameVariant;
  pocketCards: number[];
  communityCards: number[];
  result: verboseHandInfo;
  notes?: string;
}

export const usePokerStore = defineStore('poker', () => {
  // Game state
  const gameVariant = ref<GameVariant>(GameVariant.TEXAS_HOLDEM);
  const pocketCards = ref<number[]>([]);
  const communityCards = ref<number[]>([]);
  const gameStage = ref<'preflop' | 'flop' | 'turn' | 'river'>('preflop');
  
  // Evaluation results
  const currentHandRank = ref<number>(0);
  const handStrength = ref<number>(0);
  const evaluationResult = ref<verboseHandInfo | null>(null);
  
  // History
  const evaluationHistory = ref<EvaluationRecord[]>([]);
  
  // Computed properties
  const allCards = computed(() => [...pocketCards.value, ...communityCards.value]);
  const isHandComplete = computed(() => {
    return pocketCards.value.length === 2 && communityCards.value.length >= 3;
  });
  
  const canEvaluate = computed(() => {
    return allCards.value.length >= 5 && allCards.value.length <= 7;
  });
  
  // Actions
  const setGameVariant = (variant: GameVariant) => {
    gameVariant.value = variant;
    resetHand();
  };
  
  const setPocketCards = (cards: number[]) => {
    pocketCards.value = [...cards];
  };
  
  const setCommunityCards = (cards: number[]) => {
    communityCards.value = [...cards];
    updateGameStage();
  };
  
  const addPocketCard = (cardIndex: number) => {
    if (pocketCards.value.length < 2 && !pocketCards.value.includes(cardIndex)) {
      pocketCards.value.push(cardIndex);
    }
  };
  
  const addCommunityCard = (cardIndex: number) => {
    if (communityCards.value.length < 5 && 
        !communityCards.value.includes(cardIndex) &&
        !pocketCards.value.includes(cardIndex)) {
      communityCards.value.push(cardIndex);
      updateGameStage();
    }
  };
  
  const removePocketCard = (index: number) => {
    pocketCards.value.splice(index, 1);
  };
  
  const removeCommunityCard = (index: number) => {
    communityCards.value.splice(index, 1);
    updateGameStage();
  };
  
  const resetHand = () => {
    pocketCards.value = [];
    communityCards.value = [];
    gameStage.value = 'preflop';
    evaluationResult.value = null;
    currentHandRank.value = 0;
    handStrength.value = 0;
  };
  
  const updateGameStage = () => {
    const communityCount = communityCards.value.length;
    if (communityCount === 0) {
      gameStage.value = 'preflop';
    } else if (communityCount === 3) {
      gameStage.value = 'flop';
    } else if (communityCount === 4) {
      gameStage.value = 'turn';
    } else if (communityCount === 5) {
      gameStage.value = 'river';
    }
  };
  
  const setEvaluationResult = (result: verboseHandInfo) => {
    evaluationResult.value = result;
    currentHandRank.value = result.handRank;
    handStrength.value = (6185 - result.handRank) / 6185; // Normalize to 0-1
  };
  
  const saveToHistory = (notes?: string) => {
    if (!evaluationResult.value) return;
    
    const record: EvaluationRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      gameVariant: gameVariant.value,
      pocketCards: [...pocketCards.value],
      communityCards: [...communityCards.value],
      result: { ...evaluationResult.value },
      notes
    };
    
    evaluationHistory.value.unshift(record);
    
    // Limit history to 100 records
    if (evaluationHistory.value.length > 100) {
      evaluationHistory.value = evaluationHistory.value.slice(0, 100);
    }
  };
  
  const removeFromHistory = (id: string) => {
    const index = evaluationHistory.value.findIndex(record => record.id === id);
    if (index > -1) {
      evaluationHistory.value.splice(index, 1);
    }
  };
  
  const clearHistory = () => {
    evaluationHistory.value = [];
  };
  
  return {
    // State
    gameVariant: readonly(gameVariant),
    pocketCards: readonly(pocketCards),
    communityCards: readonly(communityCards),
    gameStage: readonly(gameStage),
    currentHandRank: readonly(currentHandRank),
    handStrength: readonly(handStrength),
    evaluationResult: readonly(evaluationResult),
    evaluationHistory: readonly(evaluationHistory),
    
    // Computed
    allCards,
    isHandComplete,
    canEvaluate,
    
    // Actions
    setGameVariant,
    setPocketCards,
    setCommunityCards,
    addPocketCard,
    addCommunityCard,
    removePocketCard,
    removeCommunityCard,
    resetHand,
    setEvaluationResult,
    saveToHistory,
    removeFromHistory,
    clearHistory
  };
});
```

This technical specification provides detailed implementation guidance for each component and function in the poker hand evaluator application. The specifications ensure consistency, maintainability, and proper integration with the gamblingjs library.
