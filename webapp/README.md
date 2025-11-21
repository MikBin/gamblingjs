# Vue.js Poker Hand Evaluator

A modern, interactive web application built with Vue.js 3 and DaisyUI to showcase the advanced capabilities of the [gamblingjs](../README.md) poker analysis library.

## Overview

This application provides a visual interface for poker hand evaluation, Monte Carlo simulations, and game variant analysis. It demonstrates how `gamblingjs` can be integrated into a real-world frontend application to perform complex calculations efficiently.

**Note:** This project is currently in the planning/scaffolding phase. The documentation below describes the intended architecture and usage. Please refer to the [Implementation Plan](./IMPLEMENTATION_PLAN.md) for status.

## Features

- **Interactive Card Selector**: Intuitive interface for selecting pocket and community cards.
- **Real-time Evaluation**: Instant feedback on hand strength, ranking, and winning combinations.
- **Monte Carlo Simulations**: Run thousands of simulations to calculate win probabilities and equity.
- **Multi-Variant Support**: Support for Texas Hold'em, Omaha, and other poker variants.
- **Responsive Design**: Fully responsive UI optimized for desktop and mobile devices.
- **Dark/Light Mode**: Themed interface with user preference support.

## Documentation

- [**Architecture**](./ARCHITECTURE.md): System design, data flow, and state management.
- [**Implementation Plan**](./IMPLEMENTATION_PLAN.md): Development roadmap and phases.
- [**Technical Specification**](./TECHNICAL_SPECIFICATION.md): Detailed component and API specs.
- [**Testing Strategy**](./TESTING_STRATEGY.md): Comprehensive testing approach.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Navigate to the webapp directory:
   ```bash
   cd webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the local `gamblingjs` library (if developing locally):
   The project is configured to resolve `@gamblingjs` to the local source in `../src/index.ts`.

## Development

### Start Development Server

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Builds the application to the `dist/` directory.

### Run Tests

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

## Project Structure

The project follows a standard Vue.js application structure:

```
webapp/
├── src/
│   ├── components/     # Vue components (Card, HandDisplay, etc.)
│   ├── composables/    # Composition API logic (Evaluator, MonteCarlo)
│   ├── stores/         # Pinia state management
│   ├── views/          # Page definitions
│   └── main.ts         # Application entry point
├── tests/              # Unit and E2E tests
└── vite.config.ts      # Vite configuration
```

## Integration with GamblingJS

This webapp demonstrates several key features of the `gamblingjs` library:

1.  **Hand Evaluation**: Uses `PokerEvaluator` to calculate hand ranks for 5 and 7 card hands.
2.  **Performance**: Demonstrates the speed of the library by running evaluations in real-time as the user selects cards.
3.  **Simulations**: Utilizes Web Workers to offload heavy Monte Carlo simulations (`pokerMontecarloSym`) without blocking the UI.
4.  **Card Utilities**: Showcases helper functions for card string/index conversion and validation.

For more details on the integration points, see the [Architecture Document](./ARCHITECTURE.md#integration-with-gamblingjs-library).

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
