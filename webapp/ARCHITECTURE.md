# Vue.js Poker Hand Evaluator - System Architecture

## Overview

This document outlines the system architecture for the Vue.js Poker Hand Evaluator web application, including component hierarchy, data flow, and integration with the gamblingjs library.

## Component Architecture

```
App.vue (Root Component)
├── NavigationHeader
├── RouterView
│   ├── HomeView
│   ├── EvaluatorView
│   │   ├── GameVariantSelector
│   │   ├── CardSelector
│   │   ├── HandDisplay
│   │   │   ├── PocketCardsSection
│   │   │   └── CommunityCardsSection
│   │   ├── MonteCarloSimulator
│   │   └── HandRankingDisplay
│   └── DocumentationView
└── AppFooter
```

## State Management Architecture

### Pinia Stores

#### Poker Store (`src/stores/poker.ts`)
```typescript
interface PokerState {
  // Game state
  gameVariant: GameVariant;
  pocketCards: number[];
  communityCards: number[];
  selectedCards: number[];
  
  // Evaluation results
  currentHandRank: number;
  handStrength: number;
  winProbability: number;
  
  // Monte Carlo simulation
  simulationResults: SimulationResult[];
  isSimulating: boolean;
  simulationProgress: number;
  
  // History
  evaluationHistory: EvaluationRecord[];
}
```

#### UI Store (`src/stores/ui.ts`)
```typescript
interface UIState {
  // Theme
  isDarkMode: boolean;
  theme: 'light' | 'dark' | 'auto';
  
  // Layout
  sidebarOpen: boolean;
  activeView: string;
  
  // Preferences
  animationsEnabled: boolean;
  showCardImages: boolean;
  simulationSpeed: number;
}
```

## Data Flow Architecture

### Card Selection Flow
```
User Click → CardSelector → useCardSelection → Poker Store → HandDisplay → Evaluator
```

### Hand Evaluation Flow
```
Card Selection → usePokerEvaluator → gamblingjs Library → Results → HandRankingDisplay
```

### Monte Carlo Simulation Flow
```
Simulation Request → useMonteCarlo → Web Worker → Results → MonteCarloSimulator Component
```

## Integration with gamblingjs Library

### Core Integration Points

1. **PokerEvaluator Class**
   - Static methods for 5-card and 7-card evaluation
   - Support for multiple game variants
   - Verbose evaluation with detailed hand information

2. **Monte Carlo Simulation**
   - Integration with `pokerMontecarloSym.ts`
   - Probability calculations for partial hands
   - Win percentage against random opponents

3. **Game Variants**
   - Texas Hold'em evaluation
   - Omaha support
   - High/Low variants

### Composable Functions

#### usePokerEvaluator (`src/composables/usePokerEvaluator.ts`)
```typescript
export function usePokerEvaluator() {
  const pokerStore = usePokerStore();
  
  const evaluateHand = (cards: number[], variant: GameVariant) => {
    // Integration with PokerEvaluator.evaluate7Cards()
  };
  
  const evaluateTexasHoldem = (holeCards: number[], communityCards: number[]) => {
    // Integration with PokerEvaluator.evaluateTexasHoldem()
  };
  
  const getHandDescription = (rank: number) => {
    // Convert rank to human-readable description
  };
  
  return {
    evaluateHand,
    evaluateTexasHoldem,
    getHandDescription
  };
}
```

#### useMonteCarlo (`src/composables/useMonteCarlo.ts`)
```typescript
export function useMonteCarlo() {
  const pokerStore = usePokerStore();
  
  const runSimulation = async (
    partialHand: number[],
    numRuns: number = 10000
  ) => {
    // Integration with getPartialHandStatsIndexed_7()
    // Web Worker implementation for performance
  };
  
  const calculateWinProbability = (
    heroHand: number[],
    opponentHands: number[][],
    communityCards: number[]
  ) => {
    // Multi-player win probability calculation
  };
  
  return {
    runSimulation,
    calculateWinProbability
  };
}
```

#### useCardSelection (`src/composables/useCardSelection.ts`)
```typescript
export function useCardSelection() {
  const pokerStore = usePokerStore();
  
  const selectCard = (cardIndex: number) => {
    // Add card to selection with validation
  };
  
  const removeCard = (cardIndex: number) => {
    // Remove card from selection
  };
  
  const clearSelection = () => {
    // Clear all selected cards
  };
  
  const getAvailableCards = () => {
    // Return array of unselected card indices
  };
  
  return {
    selectCard,
    removeCard,
    clearSelection,
    getAvailableCards
  };
}
```

## Performance Architecture

### Code Splitting Strategy
```
src/
├── components/           # Eager loaded for core functionality
├── views/               # Lazy loaded by Vue Router
├── composables/         # Eager loaded
├── stores/              # Eager loaded
└── utils/               # Eager loaded
```

### Web Workers for Heavy Computations
- Monte Carlo simulations run in separate Web Workers
- Background processing prevents UI blocking
- Progress reporting for long-running simulations

### Caching Strategy
- Evaluation results cached for identical card combinations
- Monte Carlo results cached with configurable TTL
- Card images preloaded and cached

## Security Architecture

### Input Validation
- All card selections validated before processing
- Monte Carlo parameters sanitized
- XSS prevention in dynamic content rendering

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data:
connect-src 'self'
```

## Testing Architecture

### Unit Testing Structure
```
tests/
├── unit/
│   ├── components/       # Component tests
│   ├── composables/      # Composable function tests
│   ├── stores/          # Store tests
│   └── utils/           # Utility function tests
├── integration/          # Integration tests
└── e2e/                 # End-to-end tests
```

### Test Coverage Requirements
- Components: 90%+ coverage
- Composables: 95%+ coverage
- Stores: 90%+ coverage
- Utils: 95%+ coverage

## Deployment Architecture

### Build Process
```
Source Code → Vite Build → Static Assets → GitHub Pages
```

### CI/CD Pipeline
```
Push to GitHub → GitHub Actions → Tests → Build → Deploy to GitHub Pages
```

### Environment Configuration
- Development: Local development server with hot reload
- Staging: Preview deployments for pull requests
- Production: GitHub Pages with custom domain

## Accessibility Architecture

### WCAG 2.1 AA Compliance
- Semantic HTML5 structure
- ARIA labels and descriptions
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Accessibility Features
- Focus management for card selection
- Keyboard shortcuts for common actions
- Screen reader announcements for evaluation results
- High contrast mode support

## Monitoring and Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Runtime performance metrics
- User interaction analytics

### Error Tracking
- JavaScript error reporting
- User feedback collection
- Performance issue detection

## Future Extensibility

### Plugin Architecture
- Custom game variant support
- Additional evaluation engines
- Third-party integrations

### API Integration
- Real-time poker room data
- Historical hand analysis
- Player statistics tracking

This architecture provides a solid foundation for the poker hand evaluator application, ensuring scalability, maintainability, and excellent user experience while leveraging the powerful gamblingjs library for poker analysis.
