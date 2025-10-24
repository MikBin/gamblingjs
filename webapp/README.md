# Vue.js Poker Hand Evaluator

A modern, interactive poker hand evaluator application built with Vue.js 3, TypeScript, and DaisyUI. This application showcases the advanced capabilities of the gamblingjs poker analysis library through a sophisticated single-page application.

## 🎯 Features

### Core Functionality
- **Interactive Card Selection**: Click-to-select interface with visual feedback
- **Real-time Hand Evaluation**: Instant poker hand strength analysis
- **Monte Carlo Simulations**: Advanced probability calculations and win percentages
- **Multiple Game Variants**: Support for Texas Hold'em, Omaha, and other poker variants
- **Comprehensive Statistics**: Detailed hand rankings, odds, and equity distributions

### User Experience
- **Modern UI/UX**: Clean, responsive design using DaisyUI components
- **Smooth Animations**: Card dealing, flipping, and transition effects
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Themes**: Multiple theme options for user preference
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation

### Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **Component Architecture**: Modular, reusable Vue.js components
- **State Management**: Pinia for efficient state handling
- **Performance Optimized**: Code splitting and lazy loading
- **Progressive Web App**: Offline capabilities and app-like experience

## 🚀 Live Demo

[https://your-username.github.io/poker-hand-evaluator](https://your-username.github.io/poker-hand-evaluator)

## 📁 Project Structure

```
WebApp/
├── public/
│   ├── assets/
│   │   └── cards/              # Card images
│   └── favicon.ico
├── src/
│   ├── components/             # Vue components
│   │   ├── Card.vue           # Individual card display
│   │   ├── CardSelector.vue   # Interactive card selection
│   │   ├── HandDisplay.vue    # Pocket and community cards
│   │   ├── MonteCarloSimulator.vue # Probability calculations
│   │   └── HandRankingDisplay.vue # Evaluation results
│   ├── composables/           # Reusable composition functions
│   │   ├── usePokerEvaluator.ts
│   │   ├── useMonteCarlo.ts
│   │   └── useCardSelection.ts
│   ├── stores/                # Pinia stores
│   │   ├── poker.ts
│   │   └── ui.ts
│   ├── types/                 # TypeScript definitions
│   │   └── poker.ts
│   ├── utils/                 # Utility functions
│   │   ├── cardUtils.ts
│   │   └── probabilityUtils.ts
│   ├── views/                 # Page components
│   │   ├── HomeView.vue
│   │   ├── EvaluatorView.vue
│   │   └── DocumentationView.vue
│   ├── workers/               # Web Workers
│   │   └── monteCarloWorker.js
│   ├── App.vue               # Root component
│   ├── main.ts               # Application entry point
│   └── style.css             # Global styles
├── tests/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/workflows/         # GitHub Actions
├── docs/                      # Documentation
├── IMPLEMENTATION_PLAN.md     # Detailed implementation plan
├── ARCHITECTURE.md            # System architecture
├── TECHNICAL_SPECIFICATION.md # Technical specifications
├── PROJECT_SETUP.md           # Setup guide
├── TESTING_STRATEGY.md       # Testing strategy
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Vue Router** - Official routing library for Vue.js
- **Pinia** - State management library

### UI/UX
- **DaisyUI** - Component library built on Tailwind CSS
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixer

### Testing
- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Official Vue.js testing utilities
- **Playwright** - End-to-end testing framework
- **MSW** - API mocking for testing

### Development Tools
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for code quality

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/poker-hand-evaluator.git
cd poker-hand-evaluator/WebApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### Run Unit Tests with Coverage

```bash
npm run test:coverage
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Integration Tests

```bash
npm run test:integration
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build application for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:integration` | Run integration tests |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## 🎮 Usage Guide

### Basic Hand Evaluation

1. **Navigate to Evaluator**: Click on "Hand Evaluator" in the navigation
2. **Select Pocket Cards**: Click 2 cards for your hole cards
3. **Add Community Cards**: Click 3-5 cards for community cards (flop, turn, river)
4. **View Results**: See instant hand evaluation and ranking

### Monte Carlo Simulation

1. **Complete a Hand**: Select at least 2 pocket cards and 3 community cards
2. **Configure Simulation**: Set number of runs and opponents
3. **Run Simulation**: Click "Run Simulation" to calculate probabilities
4. **Analyze Results**: View win probability, equity, and hand distribution

### Advanced Features

- **Game Variants**: Switch between Texas Hold'em, Omaha, and other variants
- **History Tracking**: Save and review previous hand evaluations
- **Export Results**: Export hand analysis for further study
- **Custom Settings**: Configure simulation parameters and display options

## 🏗️ Architecture Overview

The application follows a modular architecture with clear separation of concerns:

### Component Layer
- **Presentation Components**: Handle UI rendering and user interactions
- **Container Components**: Manage state and business logic
- **Shared Components**: Reusable UI elements

### Business Logic Layer
- **Composables**: Reusable logic using Vue 3 Composition API
- **Stores**: Centralized state management with Pinia
- **Services**: External API integrations and complex calculations

### Data Layer
- **Types**: TypeScript interfaces for type safety
- **Utils**: Pure functions for data transformation
- **Workers**: Web Workers for heavy computations

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_APP_TITLE=Poker Hand Evaluator
VITE_API_URL=http://localhost:3000/api
```

### Customization

#### Card Assets
Replace card images in `public/assets/cards/` with your own designs:
- PNG format: 100x140 pixels per card
- SVG format: Scalable vector graphics
- Back designs: Place in `public/assets/cards/backs/`

#### Themes
Customize themes in `tailwind.config.js`:
```javascript
daisyui: {
  themes: [
    {
      custom: {
        "primary": "#your-color",
        // ... other theme colors
      }
    }
  ]
}
```

## 🚀 Deployment

### GitHub Pages

The application is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in your repository settings
2. **Configure GitHub Actions** workflow (already included)
3. **Push to main branch** to trigger deployment

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Performance

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques
- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: Compressed card images with proper formats
- **Bundle Analysis**: Regular monitoring of bundle size
- **Caching Strategy**: Service worker for offline functionality

## 🧩 Integration with gamblingjs

This application is built on top of the [gamblingjs](../) poker analysis library:

### Key Integrations
- **Hand Evaluation**: `PokerEvaluator.evaluate7Cards()`
- **Texas Hold'em**: `PokerEvaluator.evaluateTexasHoldem()`
- **Monte Carlo**: `getPartialHandStatsIndexed_7()`
- **Game Variants**: Support for multiple poker variants

### Library Features
- **Fast Evaluation**: Optimized algorithms for hand strength calculation
- **Comprehensive Analysis**: Detailed hand information and rankings
- **Probability Calculations**: Advanced statistical analysis
- **Extensible Design**: Easy to add new game variants

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Vue.js specific rules
- **Prettier**: Consistent code formatting
- **Testing**: 90%+ coverage requirement
- **Documentation**: JSDoc comments for public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **gamblingjs**: Core poker analysis library
- **Vue.js Team**: Excellent framework and documentation
- **DaisyUI**: Beautiful component library
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/poker-hand-evaluator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/poker-hand-evaluator/discussions)
- **Email**: your-email@example.com

## 🔮 Roadmap

### Version 1.0 (Current)
- ✅ Basic hand evaluation
- ✅ Monte Carlo simulations
- ✅ Responsive design
- ✅ TypeScript support

### Version 1.1 (Planned)
- 🔄 Multi-player support
- 🔄 Tournament mode
- 🔄 Advanced statistics
- 🔄 Export functionality

### Version 2.0 (Future)
- 📋 Real-time multiplayer
- 📋 AI opponent integration
- 📋 Mobile app version
- 📋 Cloud synchronization

---

**Built with ❤️ using Vue.js, TypeScript, and DaisyUI**
