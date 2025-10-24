# TypeScript Validation and Testing Strategy for gamblingjs

This comprehensive guide provides a structured approach to validating and testing the TypeScript migration of the gamblingjs project, with special focus on poker evaluation algorithm accuracy and performance.

## Table of Contents

1. [Type Checking Validation Strategies](#type-checking-validation-strategies)
2. [Testing Strategies for TypeScript Migration](#testing-strategies-for-typescript-migration)
3. [Migration Validation Checkpoints](#migration-validation-checkpoints)
4. [Specific gamblingjs Testing Challenges](#specific-gamblingjs-testing-challenges)
5. [Testing Workflow for Migration](#testing-workflow-for-migration)
6. [Quality Assurance Strategies](#quality-assurance-strategies)
7. [Practical Examples](#practical-examples)
8. [Troubleshooting Guides](#troubleshooting-guides)

---

## Type Checking Validation Strategies

### Setting Up Dedicated Type-Checking Commands

Create comprehensive type-checking scripts for different scenarios:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "type-check:strict": "tsc --noEmit --strict",
    "type-check:production": "tsc --project tsconfig.build.json --noEmit",
    "type-check:tests": "tsc --project tsconfig.test.json --noEmit",
    "type-check:webapp": "cd webapp && vue-tsc --noEmit",
    "type-check:all": "npm run type-check && npm run type-check:tests && npm run type-check:webapp"
  }
}
```

### Integrating Type Checking into Development Workflow

#### Pre-commit Type Checking

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run type-check && npm run lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "tsc --noEmit",
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

#### VS Code Integration

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "typescript.tsserver.maxTsServerMemory": 8192,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  }
}
```

### Continuous Type Checking During Development

#### File Watcher Configuration

```json
{
  "scripts": {
    "dev:type-check": "concurrently \"npm run dev\" \"npm run type-check:watch\"",
    "dev:strict": "concurrently \"npm run dev\" \"tsc --noEmit --strict --watch\""
  }
}
```

#### Incremental Type Checking

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

### Type Checking in CI/CD Pipelines

#### GitHub Actions Configuration

```yaml
name: Type Check and Test
on: [push, pull_request]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check main library
        run: npm run type-check
      
      - name: Type check tests
        run: npm run type-check:tests
      
      - name: Type check webapp
        run: npm run type-check:webapp
      
      - name: Strict type check
        run: npm run type-check:strict
```

### Handling Type Errors During Migration

#### Gradual Strictness Approach

1. **Phase 1**: Permissive configuration with `noImplicitAny: false`
2. **Phase 2**: Enable `noImplicitAny` but allow `any` types
3. **Phase 3**: Full strict mode with all checks enabled

#### Type Error Tracking

```typescript
// tools/typeErrorTracker.ts
interface TypeErrorReport {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  migrationPhase: number;
}

export class TypeErrorTracker {
  private errors: TypeErrorReport[] = [];
  
  addError(error: TypeErrorReport) {
    this.errors.push(error);
  }
  
  generateReport() {
    return {
      total: this.errors.length,
      byFile: this.groupByFile(),
      byPhase: this.groupByPhase()
    };
  }
  
  private groupByFile() {
    return this.errors.reduce((acc, error) => {
      acc[error.file] = (acc[error.file] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
  
  private groupByPhase() {
    return this.errors.reduce((acc, error) => {
      acc[error.migrationPhase] = (acc[error.migrationPhase] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }
}
```

---

## Testing Strategies for TypeScript Migration

### Updating Existing Tests for TypeScript Compatibility

#### Test Migration Template

```typescript
// test/migrationTemplate.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { OriginalFunction } from '../src/original';
import { ConvertedFunction } from '../src/converted';

describe('Migration Validation: OriginalFunction', () => {
  const testCases = [
    // Add your test cases here
  ];
  
  testCases.forEach(({ input, expected, description }) => {
    it(`should match original behavior: ${description}`, () => {
      const originalResult = OriginalFunction(input);
      const convertedResult = ConvertedFunction(input);
      
      expect(convertedResult).toEqual(originalResult);
      expect(convertedResult).toEqual(expected);
    });
  });
});
```

### Writing Type-Safe Tests with TypeScript

#### Type-Safe Test Utilities

```typescript
// test/utils/typeSafeTestUtils.ts
import { expect, Describe } from 'vitest';

export interface TypedTestCase<TInput, TOutput> {
  input: TInput;
  expected: TOutput;
  description: string;
}

export function createTypedTests<TInput, TOutput>(
  testName: string,
  testFunction: (input: TInput) => TOutput,
  testCases: TypedTestCase<TInput, TOutput>[]
): Describe {
  return describe(testName, () => {
    testCases.forEach(({ input, expected, description }) => {
      it(`should handle: ${description}`, () => {
        const result = testFunction(input);
        expect(result).toEqual(expected);
      });
    });
  });
}

// Type-safe poker hand testing
export interface PokerHandTestCase {
  cards: number[];
  expectedRank: number;
  expectedHandGroup: string;
  description: string;
}

export function createPokerHandTests(
  evaluator: (cards: number[]) => { rank: number; handGroup: string },
  testCases: PokerHandTestCase[]
) {
  describe('Poker Hand Evaluation', () => {
    testCases.forEach(({ cards, expectedRank, expectedHandGroup, description }) => {
      it(`should evaluate correctly: ${description}`, () => {
        const result = evaluator(cards);
        expect(result.rank).toBe(expectedRank);
        expect(result.handGroup).toBe(expectedHandGroup);
      });
    });
  });
}
```

### Testing Type Definitions and Interfaces

#### Type Definition Tests

```typescript
// test/types/interfaceTests.test.ts
import { describe, it, expect } from 'vitest';
import type { 
  handInfo, 
  verboseHandInfo, 
  hiLowRank,
  singleRankFiveCardHandEvalFn 
} from '../src/interfaces';

describe('Type Definitions', () => {
  describe('handInfo interface', () => {
    it('should accept valid handInfo structure', () => {
      const validHandInfo: handInfo = {
        hand: [1, 2, 3, 4, 5],
        faces: '23456',
        handGroup: 'straight'
      };
      
      expect(validHandInfo.hand).toHaveLength(5);
      expect(typeof validHandInfo.faces).toBe('string');
      expect(typeof validHandInfo.handGroup).toBe('string');
    });
  });
  
  describe('Function type definitions', () => {
    it('should enforce correct function signatures', () => {
      const validEvaluator: singleRankFiveCardHandEvalFn = 
        (c1, c2, c3, c4, c5) => {
          expect(typeof c1).toBe('number');
          expect(typeof c2).toBe('number');
          expect(typeof c3).toBe('number');
          expect(typeof c4).toBe('number');
          expect(typeof c5).toBe('number');
          return 1000; // Mock rank
        };
      
      expect(validEvaluator(1, 2, 3, 4, 5)).toBe(1000);
    });
  });
});
```

### Mocking and Stubbing in TypeScript Tests

#### Type-Safe Mocks

```typescript
// test/mocks/pokerEvaluatorMock.ts
import { vi } from 'vitest';
import type { PokerEvaluator } from '../../src/PokerEvaluator';

export const createMockPokerEvaluator = () => {
  return {
    evaluate: vi.fn(),
    evaluateVerbose: vi.fn(),
    evaluate5Cards: vi.fn(),
    evaluate7Cards: vi.fn(),
  } as unknown as PokerEvaluator;
};

// Usage in tests
import { createMockPokerEvaluator } from '../mocks/pokerEvaluatorMock';

describe('Component using PokerEvaluator', () => {
  it('should use mocked evaluator', () => {
    const mockEvaluator = createMockPokerEvaluator();
    mockEvaluator.evaluate.mockReturnValue(7462); // Royal flush
    
    // Test component with mock
    expect(mockEvaluator.evaluate).toHaveBeenCalled();
  });
});
```

### Testing Untyped Code During Migration

#### Wrapper Approach for Untyped Code

```typescript
// test/wrappers/untypedCodeWrapper.ts
// Wrapper for untyped JavaScript code during migration

export class UntypedCodeWrapper {
  private untypedModule: any;
  
  constructor(modulePath: string) {
    this.untypedModule = require(modulePath);
  }
  
  // Type-safe wrapper methods
  evaluateHand(cards: number[]): number {
    // Runtime validation for type safety
    if (!Array.isArray(cards)) {
      throw new Error('Cards must be an array');
    }
    
    if (cards.some(card => typeof card !== 'number')) {
      throw new Error('All cards must be numbers');
    }
    
    return this.untypedModule.evaluateHand(cards);
  }
  
  getHandInfo(rank: number): any {
    if (typeof rank !== 'number') {
      throw new Error('Rank must be a number');
    }
    
    return this.untypedModule.getHandInfo(rank);
  }
}
```

---

## Migration Validation Checkpoints

### Pre-Migration Validation Steps

#### Baseline Test Suite

```typescript
// test/baseline/baselineValidation.test.ts
import { describe, it, expect } from 'vitest';
import { capturePerformanceMetrics } from '../utils/performanceUtils';

describe('Pre-Migration Baseline Validation', () => {
  it('should establish performance baseline for poker evaluation', () => {
    const testHands = generateTestHands(10000);
    const metrics = capturePerformanceMetrics(() => {
      testHands.forEach(hand => {
        // Original JavaScript evaluation
        evaluateHandOriginal(hand);
      });
    });
    
    // Store baseline for comparison
    expect(metrics.averageTime).toBeLessThan(0.001); // 1ms per evaluation
    expect(metrics.memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
  
  it('should validate algorithm correctness with comprehensive test suite', () => {
    const testCases = loadComprehensiveTestCases();
    
    testCases.forEach(({ cards, expectedRank, description }) => {
      const result = evaluateHandOriginal(cards);
      expect(result).toBe(expectedRank, `Failed for: ${description}`);
    });
  });
});
```

#### Test Data Validation

```typescript
// test/utils/testDataValidator.ts
export interface TestDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    totalCases: number;
    byHandType: Record<string, number>;
    coverage: number;
  };
}

export function validateTestData(testData: any[]): TestDataValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const handTypeCount: Record<string, number> = {};
  
  // Validate structure
  testData.forEach((testCase, index) => {
    if (!testCase.cards || !Array.isArray(testCase.cards)) {
      errors.push(`Test case ${index}: Missing or invalid cards array`);
    }
    
    if (typeof testCase.expectedRank !== 'number') {
      errors.push(`Test case ${index}: Missing or invalid expectedRank`);
    }
    
    if (testCase.handGroup) {
      handTypeCount[testCase.handGroup] = (handTypeCount[testCase.handGroup] || 0) + 1;
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    statistics: {
      totalCases: testData.length,
      byHandType: handTypeCount,
      coverage: Object.keys(handTypeCount).length / 10 // Assuming 10 hand types
    }
  };
}
```

### Validation After Each File Conversion

#### File Conversion Validation Script

```typescript
// tools/fileConversionValidator.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

interface ConversionValidationResult {
  fileName: string;
  typeCheckPassed: boolean;
  testsPassed: boolean;
  performanceImpact: number;
  issues: string[];
}

export class FileConversionValidator {
  validateConversion(filePath: string): ConversionValidationResult {
    const result: ConversionValidationResult = {
      fileName: filePath,
      typeCheckPassed: false,
      testsPassed: false,
      performanceImpact: 0,
      issues: []
    };
    
    try {
      // Type check the converted file
      execSync(`npx tsc --noEmit ${filePath}`, { stdio: 'pipe' });
      result.typeCheckPassed = true;
    } catch (error) {
      result.issues.push(`Type check failed: ${error.message}`);
    }
    
    // Run related tests
    try {
      const testCommand = this.getTestCommandForFile(filePath);
      execSync(testCommand, { stdio: 'pipe' });
      result.testsPassed = true;
    } catch (error) {
      result.issues.push(`Tests failed: ${error.message}`);
    }
    
    return result;
  }
  
  private getTestCommandForFile(filePath: string): string {
    // Map file paths to their corresponding test commands
    const fileTestMap: Record<string, string> = {
      'src/pokerEvaluator5.ts': 'npm test -- pokerEvaluator5.test.ts',
      'src/PokerEvaluator.ts': 'npm test -- pokerEvaluator.test.ts',
      // Add more mappings as needed
    };
    
    return fileTestMap[filePath] || 'npm test';
  }
}
```

### Module-Level Validation Strategies

#### Module Integration Tests

```typescript
// test/integration/moduleValidation.test.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { HighEvaluator } from '../../src/core/HighEvaluator';
import { LowAto5Evaluator } from '../../src/core/LowEvaluator';

describe('Module-Level Validation', () => {
  describe('PokerEvaluator Integration', () => {
    it('should correctly integrate all evaluator modules', () => {
      const evaluator = new PokerEvaluator();
      
      // Test high evaluation
      const highResult = evaluator.evaluate([0, 1, 2, 3, 4], 'high');
      expect(typeof highResult).toBe('number');
      
      // Test low evaluation
      const lowResult = evaluator.evaluate([0, 1, 2, 3, 12], 'low-a-to-5');
      expect(typeof lowResult).toBe('number');
    });
  });
  
  describe('Core Module Compatibility', () => {
    it('should maintain compatibility between core evaluators', () => {
      const highEvaluator = new HighEvaluator();
      const lowEvaluator = new LowAto5Evaluator();
      
      const testHand = [12, 11, 10, 9, 8]; // Royal flush
      
      const highRank = highEvaluator.evaluate(testHand);
      const lowRank = lowEvaluator.evaluate(testHand);
      
      // Validate that both evaluators can process the same hand
      expect(typeof highRank).toBe('number');
      expect(typeof lowRank).toBe('number');
      expect(highRank).toBeGreaterThan(lowRank); // High should rank higher
    });
  });
});
```

### Integration Testing During Migration

#### Cross-Module Integration Tests

```typescript
// test/integration/crossModuleIntegration.test.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { TexasHoldemEvaluator } from '../../src/variants/TexasHoldem';
import { fastHashesCreators } from '../../src/pokerHashes7';

describe('Cross-Module Integration Tests', () => {
  it('should integrate hash creators with evaluators correctly', () => {
    // Initialize hash tables
    fastHashesCreators.high();
    fastHashesCreators.Ato5();
    
    const evaluator = new PokerEvaluator();
    const texasEvaluator = new TexasHoldemEvaluator();
    
    const holeCards = [0, 13]; // A♠, A♥
    const communityCards = [26, 39, 24, 37, 23]; // A♦, K♦, Q♠, J♦, 10♠
    
    // Test both evaluators with same cards
    const pokerResult = evaluator.evaluate7Cards([...holeCards, ...communityCards]);
    const texasResult = texasEvaluator.evaluateHand(holeCards, communityCards);
    
    expect(typeof pokerResult).toBe('number');
    expect(typeof texasResult).toBe('object');
  });
});
```

### End-to-End Testing Validation

#### Complete Workflow Tests

```typescript
// test/e2e/completeWorkflow.test.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { cardIndexToString } from '../../src/utils/CardUtils';

describe('End-to-End Workflow Validation', () => {
  it('should handle complete poker evaluation workflow', () => {
    const evaluator = new PokerEvaluator();
    
    // Test all game variants
    const testHand = [12, 11, 10, 9, 8]; // Royal flush
    
    const variants = [
      'high',
      'low-a-to-5',
      'low-8-or-better',
      'low-9-or-better'
    ] as const;
    
    variants.forEach(variant => {
      const result = evaluator.evaluate(testHand, variant);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
    
    // Test verbose evaluation
    const verboseResult = evaluator.evaluateVerbose([12, 11, 10, 9, 8, 7, 6]);
    expect(verboseResult).toHaveProperty('handRank');
    expect(verboseResult).toHaveProperty('handGroup');
    expect(verboseResult).toHaveProperty('winningCards');
  });
});
```

---

## Specific gamblingjs Testing Challenges

### Testing Poker Evaluation Algorithms with TypeScript

#### Comprehensive Poker Hand Test Suite

```typescript
// test/poker/comprehensiveHandTests.test.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { generateAllPossibleHands } from '../utils/handGenerator';

describe('Comprehensive Poker Hand Evaluation', () => {
  const evaluator = new PokerEvaluator();
  
  // Test all possible 5-card combinations (2,598,960 hands)
  it('should correctly evaluate all possible 5-card hands', () => {
    const testHands = generateAllPossibleHands(5, 1000); // Sample 1000 hands for testing
    
    testHands.forEach(hand => {
      const result = evaluator.evaluate(hand);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(7462);
    });
  });
  
  // Test specific hand categories
  describe('Hand Category Validation', () => {
    const testCases = [
      {
        name: 'Royal Flush',
        hands: [
          [12, 11, 10, 9, 8], // A♠ K♠ Q♠ J♠ T♠
          [25, 24, 23, 22, 21], // A♥ K♥ Q♥ J♥ T♥
        ],
        expectedRankRange: { min: 7462, max: 7462 }
      },
      {
        name: 'Straight Flush',
        hands: [
          [11, 10, 9, 8, 7], // K♠ Q♠ J♠ T♠ 9♠
          [24, 23, 22, 21, 20], // K♥ Q♥ J♥ T♥ 9♥
        ],
        expectedRankRange: { min: 7234, max: 7461 }
      },
      {
        name: 'Four of a Kind',
        hands: [
          [12, 0, 13, 25, 26], // A♠ A♥ A♦ A♣ K♠
          [11, 10, 22, 23, 24], // K♠ K♥ K♦ K♣ Q♠
        ],
        expectedRankRange: { min: 5863, max: 7233 }
      },
      // Add more hand categories...
    ];
    
    testCases.forEach(({ name, hands, expectedRankRange }) => {
      describe(name, () => {
        hands.forEach(hand => {
          it(`should evaluate correctly: ${hand.map(cardIndexToString).join(' ')}`, () => {
            const result = evaluator.evaluate(hand);
            expect(result).toBeGreaterThanOrEqual(expectedRankRange.min);
            expect(result).toBeLessThanOrEqual(expectedRankRange.max);
          });
        });
      });
    });
  });
});
```

#### Performance Testing for Poker Evaluation

```typescript
// test/performance/pokerEvaluationPerformance.test.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { measurePerformance } from '../utils/performanceUtils';

describe('Poker Evaluation Performance Tests', () => {
  const evaluator = new PokerEvaluator();
  
  it('should evaluate 10,000 hands within performance threshold', () => {
    const testHands = generateRandomHands(10000, 5);
    
    const { duration, memoryUsage } = measurePerformance(() => {
      testHands.forEach(hand => {
        evaluator.evaluate(hand);
      });
    });
    
    // Performance thresholds
    expect(duration).toBeLessThan(1000); // 1 second for 10k evaluations
    expect(memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB memory usage
  });
  
  it('should maintain consistent performance across different hand sizes', () => {
    const handSizes = [5, 6, 7];
    const performanceResults: Record<number, number> = {};
    
    handSizes.forEach(size => {
      const testHands = generateRandomHands(1000, size);
      
      const { duration } = measurePerformance(() => {
        testHands.forEach(hand => {
          evaluator.evaluate(hand);
        });
      });
      
      performanceResults[size] = duration / 1000; // Average time per evaluation
    });
    
    // Performance should not degrade significantly with hand size
    expect(performanceResults[7]).toBeLessThan(performanceResults[5] * 2);
  });
});
```

### Typing Test Data and Fixtures

#### Type-Safe Test Data Generators

```typescript
// test/utils/testDataGenerators.ts
import type { Card, Hand, HandRanking } from '../../src/types';

export interface TypedTestData {
  cards: number[];
  expectedRank: number;
  expectedHandGroup: string;
  description: string;
  variant: 'high' | 'low-a-to-5' | 'low-8-or-better' | 'low-9-or-better';
}

export class TypedTestDataGenerator {
  static generateRoyalFlush(): TypedTestData[] {
    const suits = [0, 13, 26, 39]; // Spades, Hearts, Diamonds, Clubs
    
    return suits.map(suitOffset => ({
      cards: [12 + suitOffset, 11 + suitOffset, 10 + suitOffset, 9 + suitOffset, 8 + suitOffset],
      expectedRank: 7462,
      expectedHandGroup: 'straight flush',
      description: `Royal Flush in ${this.getSuitName(suitOffset)}`,
      variant: 'high' as const
    }));
  }
  
  static generateStraightFlushes(): TypedTestData[] {
    const results: TypedTestData[] = [];
    const suits = [0, 13, 26, 39];
    
    suits.forEach(suitOffset => {
      for (let highCard = 12; highCard >= 5; highCard--) {
        results.push({
          cards: [
            highCard + suitOffset,
            (highCard - 1) + suitOffset,
            (highCard - 2) + suitOffset,
            (highCard - 3) + suitOffset,
            (highCard - 4) + suitOffset
          ],
          expectedRank: 7234 + (highCard - 5),
          expectedHandGroup: 'straight flush',
          description: `Straight Flush: ${this.getCardName(highCard)} high`,
          variant: 'high' as const
        });
      }
    });
    
    return results;
  }
  
  static generateLowBallHands(): TypedTestData[] {
    return [
      {
        cards: [12, 0, 1, 2, 3], // A-2-3-4-5 wheel
        expectedRank: 6174,
        expectedHandGroup: 'high card',
        description: 'A-5 wheel (best low hand)',
        variant: 'low-a-to-5' as const
      },
      {
        cards: [4, 2, 0, 1, 3], // 6-4-2-A-3
        expectedRank: 5321,
        expectedHandGroup: 'high card',
        description: '6-4-2-A-3 low',
        variant: 'low-a-to-5' as const
      }
    ];
  }
  
  private static getSuitName(suitOffset: number): string {
    const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
    return suits[suitOffset / 13];
  }
  
  private static getCardName(cardIndex: number): string {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    return ranks[cardIndex % 13];
  }
}
```

### Testing Monte Carlo Simulations with Types

#### Type-Safe Monte Carlo Tests

```typescript
// test/monteCarlo/monteCarloTests.test.ts
import { describe, it, expect } from 'vitest';
import { MonteCarloSimulator } from '../../src/pokerMontecarloSym';
import type { SimulationConfig, SimulationResult } from '../../src/types';

describe('Monte Carlo Simulation Tests', () => {
  const defaultConfig: SimulationConfig = {
    iterations: 1000,
    playerHands: [[0, 13]], // A♠, A♥
    communityCards: [],
    remainingPlayers: 2,
    gameType: 'texas-holdem'
  };
  
  it('should run simulation with type-safe configuration', () => {
    const simulator = new MonteCarloSimulator(defaultConfig);
    const result = simulator.run();
    
    // Type-safe result validation
    expect(result).toHaveProperty('winProbability');
    expect(result).toHaveProperty('tieProbability');
    expect(result).toHaveProperty('loseProbability');
    expect(result).toHaveProperty('expectedValue');
    
    expect(typeof result.winProbability).toBe('number');
    expect(typeof result.tieProbability).toBe('number');
    expect(typeof result.loseProbability).toBe('number');
    expect(typeof result.expectedValue).toBe('number');
    
    // Probability validation
    expect(result.winProbability + result.tieProbability + result.loseProbability).toBeCloseTo(1, 2);
  });
  
  it('should handle different game types with proper typing', () => {
    const gameTypes = ['texas-holdem', 'omaha', 'seven-card-stud'] as const;
    
    gameTypes.forEach(gameType => {
      const config: SimulationConfig = {
        ...defaultConfig,
        gameType
      };
      
      const simulator = new MonteCarloSimulator(config);
      const result = simulator.run();
      
      expect(result).toBeDefined();
      expect(typeof result.winProbability).toBe('number');
    });
  });
  
  it('should validate performance with large simulations', () => {
    const largeConfig: SimulationConfig = {
      ...defaultConfig,
      iterations: 10000
    };
    
    const startTime = performance.now();
    const simulator = new MonteCarloSimulator(largeConfig);
    const result = simulator.run();
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    
    expect(result).toBeDefined();
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });
});
```

### Vue Component Testing with TypeScript

#### Type-Safe Vue Component Tests

```typescript
// webapp/tests/components/PokerEvaluator.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import PokerHandDisplay from '@/components/HandDisplay.vue';
import type { Card, HandEvaluation } from '@/types/poker';

describe('PokerHandDisplay Component', () => {
  it('should display hand evaluation with proper typing', () => {
    const mockEvaluation: HandEvaluation = {
      handRank: 7462,
      handGroup: 'straight flush',
      winningCards: [12, 11, 10, 9, 8],
      description: 'Royal Flush'
    };
    
    const wrapper = mount(PokerHandDisplay, {
      props: {
        evaluation: mockEvaluation,
        cards: [12, 11, 10, 9, 8]
      }
    });
    
    expect(wrapper.find('.hand-rank').text()).toBe('7462');
    expect(wrapper.find('.hand-group').text()).toBe('straight flush');
    expect(wrapper.find('.hand-description').text()).toBe('Royal Flush');
  });
  
  it('should handle empty evaluation state', () => {
    const wrapper = mount(PokerHandDisplay, {
      props: {
        evaluation: null,
        cards: []
      }
    });
    
    expect(wrapper.find('.no-evaluation').exists()).toBe(true);
  });
});
```

### Testing Utility Functions and Helpers

#### Type-Safe Utility Tests

```typescript
// test/utils/cardUtils.test.ts
import { describe, it, expect } from 'vitest';
import { 
  getCardFromIndex, 
  getCardImagePath, 
  formatCardString,
  validateCardSelection,
  getAvailableCards
} from '../../src/utils/CardUtils';
import type { Card } from '../../src/types';

describe('CardUtils Type-Safe Tests', () => {
  describe('getCardFromIndex', () => {
    it('should return properly typed Card object', () => {
      const card: Card = getCardFromIndex(0);
      
      expect(card).toHaveProperty('index');
      expect(card).toHaveProperty('rank');
      expect(card).toHaveProperty('suit');
      expect(card).toHaveProperty('color');
      
      expect(typeof card.index).toBe('number');
      expect(typeof card.rank).toBe('string');
      expect(typeof card.suit).toBe('string');
      expect(typeof card.color).toBe('string');
      
      expect(card.index).toBe(0);
      expect(card.rank).toBe('A');
      expect(card.suit).toBe('♠');
      expect(card.color).toBe('black');
    });
  });
  
  describe('validateCardSelection', () => {
    it('should validate card selection with proper typing', () => {
      const validSelection = [0, 1, 2, 3, 4];
      const result = validateCardSelection(validSelection);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
    
    it('should reject invalid selections with typed errors', () => {
      const invalidSelection = [0, 0, 1]; // Duplicate cards
      const result = validateCardSelection(invalidSelection);
      
      expect(result.isValid).toBe(false);
      expect(typeof result.error).toBe('string');
      expect(result.error).toContain('Duplicate');
    });
  });
});
```

---

## Testing Workflow for Migration

### Step-by-Step Testing Process During Conversion

#### Migration Testing Pipeline

```typescript
// tools/migrationTestingPipeline.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

interface MigrationStep {
  name: string;
  files: string[];
  tests: string[];
  typeCheck: boolean;
  performance: boolean;
}

export class MigrationTestingPipeline {
  private steps: MigrationStep[] = [
    {
      name: 'Core Interfaces',
      files: ['src/interfaces.ts'],
      tests: ['test/types/interfaceTests.test.ts'],
      typeCheck: true,
      performance: false
    },
    {
      name: 'Core Evaluators',
      files: ['src/core/HighEvaluator.ts', 'src/core/LowEvaluator.ts'],
      tests: ['test/core/evaluatorTests.test.ts'],
      typeCheck: true,
      performance: true
    },
    {
      name: 'Poker Evaluator',
      files: ['src/PokerEvaluator.ts'],
      tests: ['test/pokerEvaluator.test.ts'],
      typeCheck: true,
      performance: true
    },
    {
      name: 'Hash Tables',
      files: ['src/pokerHashes5.ts', 'src/pokerHashes7.ts'],
      tests: ['test/hashes/hashesTests.test.ts'],
      typeCheck: true,
      performance: false
    },
    {
      name: 'Monte Carlo',
      files: ['src/pokerMontecarloSym.ts'],
      tests: ['test/monteCarlo/monteCarloTests.test.ts'],
      typeCheck: true,
      performance: true
    }
  ];
  
  async runMigrationTests(): Promise<boolean> {
    for (const step of this.steps) {
      console.log(`\n🔄 Testing step: ${step.name}`);
      
      if (!await this.runStep(step)) {
        console.error(`❌ Step failed: ${step.name}`);
        return false;
      }
      
      console.log(`✅ Step completed: ${step.name}`);
    }
    
    return true;
  }
  
  private async runStep(step: MigrationStep): Promise<boolean> {
    try {
      // Type check
      if (step.typeCheck) {
        console.log('  📝 Running type checks...');
        for (const file of step.files) {
          execSync(`npx tsc --noEmit ${file}`, { stdio: 'pipe' });
        }
      }
      
      // Run tests
      console.log('  🧪 Running tests...');
      for (const test of step.tests) {
        execSync(`npm test -- ${test}`, { stdio: 'pipe' });
      }
      
      // Performance tests
      if (step.performance) {
        console.log('  ⚡ Running performance tests...');
        await this.runPerformanceTests(step.files);
      }
      
      return true;
    } catch (error) {
      console.error(`Error in step ${step.name}:`, error.message);
      return false;
    }
  }
  
  private async runPerformanceTests(files: string[]): Promise<void> {
    // Implement performance testing logic
    const performanceThresholds = {
      maxEvaluationTime: 0.001, // 1ms per evaluation
      maxMemoryUsage: 50 * 1024 * 1024 // 50MB
    };
    
    // Run performance tests against thresholds
    console.log(`  📊 Performance thresholds: ${JSON.stringify(performanceThresholds)}`);
  }
}
```

### Regression Testing Strategies

#### Automated Regression Test Suite

```typescript
// test/regression/regressionTestSuite.ts
import { describe, it, expect } from 'vitest';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { loadRegressionTestData } from '../utils/regressionDataLoader';

describe('Regression Test Suite', () => {
  const evaluator = new PokerEvaluator();
  const regressionData = loadRegressionTestData();
  
  it('should maintain identical results for all known test cases', () => {
    regressionData.forEach(({ id, input, expectedOutput, description }) => {
      const result = evaluator.evaluate(input.cards, input.variant);
      
      expect(result).toBe(expectedOutput.rank, 
        `Regression detected in test case ${id}: ${description}`
      );
    });
  });
  
  it('should maintain performance characteristics', () => {
    const performanceBaseline = regressionData.performanceBaseline;
    const currentPerformance = measureCurrentPerformance();
    
    expect(currentPerformance.averageTime).toBeLessThanOrEqual(
      performanceBaseline.averageTime * 1.1 // Allow 10% degradation
    );
    
    expect(currentPerformance.memoryUsage).toBeLessThanOrEqual(
      performanceBaseline.memoryUsage * 1.1
    );
  });
});

function measureCurrentPerformance() {
  const testHands = generateTestHands(10000);
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;
  
  testHands.forEach(hand => {
    evaluator.evaluate(hand);
  });
  
  const endTime = performance.now();
  const endMemory = process.memoryUsage().heapUsed;
  
  return {
    averageTime: (endTime - startTime) / testHands.length,
    memoryUsage: endMemory - startMemory
  };
}
```

### Performance Testing Considerations

#### Comprehensive Performance Testing Framework

```typescript
// test/performance/performanceFramework.ts
import { performance } from 'perf_hooks';
import { writeFileSync } from 'fs';

interface PerformanceMetrics {
  testName: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  memoryUsage: number;
  timestamp: string;
}

export class PerformanceTestFramework {
  private metrics: PerformanceMetrics[] = [];
  
  async runPerformanceTest(
    testName: string,
    testFunction: () => void,
    iterations: number = 1000
  ): Promise<PerformanceMetrics> {
    // Warm up
    for (let i = 0; i < 100; i++) {
      testFunction();
    }
    
    const startMemory = process.memoryUsage().heapUsed;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      testFunction();
      const end = performance.now();
      times.push(end - start);
    }
    
    const endMemory = process.memoryUsage().heapUsed;
    
    const metrics: PerformanceMetrics = {
      testName,
      iterations,
      totalTime: times.reduce((sum, time) => sum + time, 0),
      averageTime: times.reduce((sum, time) => sum + time, 0) / iterations,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      memoryUsage: endMemory - startMemory,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.push(metrics);
    return metrics;
  }
  
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      tests: this.metrics,
      summary: {
        totalTests: this.metrics.length,
        averagePerformance: this.metrics.reduce((sum, m) => sum + m.averageTime, 0) / this.metrics.length,
        totalMemoryUsage: this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0)
      }
    };
    
    return JSON.stringify(report, null, 2);
  }
  
  saveReport(filePath: string): void {
    writeFileSync(filePath, this.generateReport());
  }
  
  compareWithBaseline(baseline: PerformanceMetrics[]): PerformanceComparison[] {
    return this.metrics.map(current => {
      const baselineMetric = baseline.find(b => b.testName === current.testName);
      
      if (!baselineMetric) {
        return {
          testName: current.testName,
          status: 'no-baseline',
          performanceChange: 0,
          memoryChange: 0
        };
      }
      
      const performanceChange = 
        ((current.averageTime - baselineMetric.averageTime) / baselineMetric.averageTime) * 100;
      const memoryChange = 
        ((current.memoryUsage - baselineMetric.memoryUsage) / baselineMetric.memoryUsage) * 100;
      
      return {
        testName: current.testName,
        status: Math.abs(performanceChange) > 10 ? 'regression' : 'passed',
        performanceChange,
        memoryChange
      };
    });
  }
}

interface PerformanceComparison {
  testName: string;
  status: 'passed' | 'regression' | 'no-baseline';
  performanceChange: number;
  memoryChange: number;
}
```

### Browser Testing with TypeScript Builds

#### Browser Compatibility Testing

```typescript
// test/browser/browserCompatibility.test.ts
import { describe, it, expect } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';

describe('Browser Compatibility Tests', () => {
  await setup({
    rootDir: './webapp',
    server: true
  });
  
  it('should load and evaluate poker hands in browser', async () => {
    const testHand = [12, 11, 10, 9, 8]; // Royal flush
    
    const result = await $fetch('/api/evaluate', {
      method: 'POST',
      body: { cards: testHand }
    });
    
    expect(result.rank).toBe(7462);
    expect(result.handGroup).toBe('straight flush');
  });
  
  it('should handle Monte Carlo simulation in browser', async () => {
    const simulationConfig = {
      iterations: 1000,
      playerHands: [[0, 13]],
      communityCards: [],
      remainingPlayers: 2
    };
    
    const result = await $fetch('/api/simulate', {
      method: 'POST',
      body: simulationConfig
    });
    
    expect(result).toHaveProperty('winProbability');
    expect(result).toHaveProperty('tieProbability');
    expect(result).toHaveProperty('loseProbability');
  });
});
```

---

## Quality Assurance Strategies

### Code Coverage with TypeScript

#### Comprehensive Coverage Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        'tools/',
        'coverage/'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 95,
          lines: 95,
          statements: 95
        },
        // Specific thresholds for critical modules
        'src/core/**/*.ts': {
          branches: 95,
          functions: 98,
          lines: 98,
          statements: 98
        },
        'src/PokerEvaluator.ts': {
          branches: 95,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
  }
});
```

#### Type Coverage Analysis

```typescript
// tools/typeCoverageAnalyzer.ts
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { parse } from '@typescript-eslint/parser';

interface TypeCoverageReport {
  totalFiles: number;
  analyzedFiles: number;
  totalLines: number;
  typedLines: number;
  coveragePercentage: number;
  fileReports: FileCoverageReport[];
}

interface FileCoverageReport {
  filePath: string;
  totalLines: number;
  typedLines: number;
  coveragePercentage: number;
  untypedLines: number[];
}

export class TypeCoverageAnalyzer {
  analyzeTypeCoverage(): TypeCoverageReport {
    const files = this.getTypescriptFiles();
    const fileReports: FileCoverageReport[] = [];
    
    let totalLines = 0;
    let typedLines = 0;
    
    files.forEach(filePath => {
      const report = this.analyzeFile(filePath);
      fileReports.push(report);
      totalLines += report.totalLines;
      typedLines += report.typedLines;
    });
    
    return {
      totalFiles: files.length,
      analyzedFiles: fileReports.length,
      totalLines,
      typedLines,
      coveragePercentage: (typedLines / totalLines) * 100,
      fileReports
    };
  }
  
  private analyzeFile(filePath: string): FileCoverageReport {
    const content = readFileSync(filePath, 'utf8');
    const ast = parse(content, {
      sourceType: 'module',
      ecmaVersion: 2020
    });
    
    const lines = content.split('\n');
    const untypedLines: number[] = [];
    
    // Analyze each line for type annotations
    lines.forEach((line, index) => {
      if (this.isLineUntyped(line)) {
        untypedLines.push(index + 1);
      }
    });
    
    return {
      filePath,
      totalLines: lines.length,
      typedLines: lines.length - untypedLines.length,
      coveragePercentage: ((lines.length - untypedLines.length) / lines.length) * 100,
      untypedLines
    };
  }
  
  private isLineUntyped(line: string): boolean {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) {
      return false;
    }
    
    // Check for type annotations
    const hasTypeAnnotation = 
      trimmed.includes(':') && 
      !trimmed.includes(':') && 
      !trimmed.includes('://') &&
      !trimmed.includes('?:');
    
    // Check for explicit 'any' usage
    const hasExplicitAny = trimmed.includes(': any') || trimmed.includes('any[');
    
    // Check for untyped function parameters
    const hasUntypedParams = 
      /function\s+\w+\([^)]*\)/.test(trimmed) && 
      !trimmed.includes(':');
    
    return !hasTypeAnnotation || hasExplicitAny || hasUntypedParams;
  }
  
  private getTypescriptFiles(): string[] {
    const result = execSync('find src -name "*.ts" -not -path "*/node_modules/*"', {
      encoding: 'utf8'
    });
    
    return result.trim().split('\n').filter(Boolean);
  }
}
```

### Type Coverage Metrics

#### Type Coverage Tracking

```typescript
// test/metrics/typeCoverage.test.ts
import { describe, it, expect } from 'vitest';
import { TypeCoverageAnalyzer } from '../../tools/typeCoverageAnalyzer';

describe('Type Coverage Metrics', () => {
  const analyzer = new TypeCoverageAnalyzer();
  
  it('should maintain minimum type coverage threshold', () => {
    const report = analyzer.analyzeTypeCoverage();
    
    expect(report.coveragePercentage).toBeGreaterThanOrEqual(85);
    
    // Critical files should have higher coverage
    const criticalFiles = [
      'src/PokerEvaluator.ts',
      'src/core/HighEvaluator.ts',
      'src/core/LowEvaluator.ts'
    ];
    
    criticalFiles.forEach(filePath => {
      const fileReport = report.fileReports.find(r => r.filePath === filePath);
      expect(fileReport?.coveragePercentage).toBeGreaterThanOrEqual(95);
    });
  });
  
  it('should not have untyped critical functions', () => {
    const report = analyzer.analyzeTypeCoverage();
    
    report.fileReports.forEach(fileReport => {
      if (fileReport.filePath.includes('core') || fileReport.filePath.includes('PokerEvaluator')) {
        expect(fileReport.untypedLines).toHaveLength(0);
      }
    });
  });
});
```

### Linting and Formatting Validation

#### TypeScript-Specific ESLint Rules

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    // Type safety rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    
    // Function typing rules
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    
    // Performance-related rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
    
    // Code quality rules
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T']
      }
    ]
  }
};
```

### Bundle Size Validation

#### Bundle Size Analysis

```typescript
// tools/bundleSizeAnalyzer.ts
import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';

interface BundleSizeReport {
  totalSize: number;
  gzippedSize: number;
  modules: ModuleSizeReport[];
  comparison?: BundleSizeComparison;
}

interface ModuleSizeReport {
  name: string;
  size: number;
  gzippedSize: number;
  percentage: number;
}

interface BundleSizeComparison {
  previousSize: number;
  currentSize: number;
  changePercentage: number;
  status: 'increased' | 'decreased' | 'stable';
}

export class BundleSizeAnalyzer {
  analyzeBundleSize(bundlePath: string): BundleSizeReport {
    const bundleStats = statSync(bundlePath);
    const bundleContent = readFileSync(bundlePath, 'utf8');
    
    // Calculate gzipped size
    const gzip = require('gzip-size');
    const gzippedSize = gzip.sync(bundleContent);
    
    return {
      totalSize: bundleStats.size,
      gzippedSize,
      modules: this.analyzeModules(bundleContent),
    };
  }
  
  private analyzeModules(bundleContent: string): ModuleSizeReport[] {
    // Parse bundle to extract module information
    // This is a simplified implementation
    const modules: ModuleSizeReport[] = [];
    
    // Extract module sizes from bundle
    const moduleRegex = /\/\*\* (.+?) \*\//g;
    let match;
    let totalSize = bundleContent.length;
    
    while ((match = moduleRegex.exec(bundleContent)) !== null) {
      const moduleName = match[1];
      const moduleStart = match.index;
      const nextModuleIndex = bundleContent.indexOf('/**', moduleStart + 1);
      const moduleEnd = nextModuleIndex !== -1 ? nextModuleIndex : bundleContent.length;
      const moduleContent = bundleContent.substring(moduleStart, moduleEnd);
      
      modules.push({
        name: moduleName,
        size: moduleContent.length,
        gzippedSize: require('gzip-size').sync(moduleContent),
        percentage: (moduleContent.length / totalSize) * 100
      });
    }
    
    return modules.sort((a, b) => b.size - a.size);
  }
  
  compareWithBaseline(current: BundleSizeReport, baseline: BundleSizeReport): BundleSizeComparison {
    const changePercentage = ((current.totalSize - baseline.totalSize) / baseline.totalSize) * 100;
    
    return {
      previousSize: baseline.totalSize,
      currentSize: current.totalSize,
      changePercentage,
      status: Math.abs(changePercentage) > 5 ? 
        (changePercentage > 0 ? 'increased' : 'decreased') : 'stable'
    };
  }
}
```

### Performance Benchmarking

#### Comprehensive Performance Benchmarks

```typescript
// test/performance/benchmarks.test.ts
import { describe, it, expect } from 'vitest';
import { PerformanceTestFramework } from '../performance/performanceFramework';
import { PokerEvaluator } from '../../src/PokerEvaluator';
import { generateRandomHands } from '../utils/handGenerator';

describe('Performance Benchmarks', () => {
  const framework = new PerformanceTestFramework();
  const evaluator = new PokerEvaluator();
  
  it('should meet 5-card evaluation performance benchmark', async () => {
    const hands5 = generateRandomHands(10000, 5);
    
    const metrics = await framework.runPerformanceTest(
      '5-card-evaluation',
      () => {
        hands5.forEach(hand => evaluator.evaluate(hand));
      },
      100
    );
    
    expect(metrics.averageTime).toBeLessThan(0.001); // 1ms per evaluation
    expect(metrics.maxTime).toBeLessThan(0.005); // 5ms max
  });
  
  it('should meet 7-card evaluation performance benchmark', async () => {
    const hands7 = generateRandomHands(10000, 7);
    
    const metrics = await framework.runPerformanceTest(
      '7-card-evaluation',
      () => {
        hands7.forEach(hand => evaluator.evaluate(hand));
      },
      100
    );
    
    expect(metrics.averageTime).toBeLessThan(0.002); // 2ms per evaluation
    expect(metrics.maxTime).toBeLessThan(0.010); // 10ms max
  });
  
  it('should meet Monte Carlo simulation performance benchmark', async () => {
    const metrics = await framework.runPerformanceTest(
      'monte-carlo-simulation',
      () => {
        // Run a small Monte Carlo simulation
        const simulator = new MonteCarloSimulator({
          iterations: 1000,
          playerHands: [[0, 13]],
          communityCards: [],
          remainingPlayers: 2
        });
        simulator.run();
      },
      10
    );
    
    expect(metrics.averageTime).toBeLessThan(100); // 100ms per simulation
  });
  
  afterAll(() => {
    framework.saveReport('./test-results/performance-report.json');
  });
});
```

---

## Practical Examples

### TypeScript Test File Examples

#### Complete Test Example for Poker Evaluator

```typescript
// test/pokerEvaluator.complete.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PokerEvaluator, GameVariant } from '../src/PokerEvaluator';
import type { HandEvaluation, SimulationConfig } from '../src/types';

describe('PokerEvaluator - Complete Test Suite', () => {
  let evaluator: PokerEvaluator;
  
  beforeEach(() => {
    evaluator = new PokerEvaluator();
  });
  
  describe('Basic Evaluation', () => {
    it('should evaluate royal flush correctly', () => {
      const royalFlush = [12, 11, 10, 9, 8]; // A♠ K♠ Q♠ J♠ T♠
      const result = evaluator.evaluate(royalFlush, GameVariant.HIGH);
      
      expect(result).toBe(7462);
    });
    
    it('should evaluate different game variants', () => {
      const testHand = [12, 0, 1, 2, 3]; // A♠ 2♠ 3♠ 4♠ 5♠
      
      const highResult = evaluator.evaluate(testHand, GameVariant.HIGH);
      const lowResult = evaluator.evaluate(testHand, GameVariant.LOW_A_TO_5);
      
      expect(typeof highResult).toBe('number');
      expect(typeof lowResult).toBe('number');
      expect(highResult).not.toBe(lowResult);
    });
  });
  
  describe('Type Safety', () => {
    it('should enforce type constraints', () => {
      // This should compile without errors
      const validHand: number[] = [0, 1, 2, 3, 4];
      const validVariant: GameVariant = GameVariant.HIGH;
      
      expect(() => evaluator.evaluate(validHand, validVariant)).not.toThrow();
    });
    
    it('should handle type errors gracefully', () => {
      // Test with invalid input types
      expect(() => {
        // @ts-expect-error - Testing runtime type checking
        evaluator.evaluate('invalid', GameVariant.HIGH);
      }).toThrow();
    });
  });
  
  describe('Performance', () => {
    it('should meet performance requirements', () => {
      const testHands = Array.from({ length: 1000 }, (_, i) => [
        (i * 5) % 52,
        (i * 5 + 1) % 52,
        (i * 5 + 2) % 52,
        (i * 5 + 3) % 52,
        (i * 5 + 4) % 52
      ]);
      
      const startTime = performance.now();
      
      testHands.forEach(hand => {
        evaluator.evaluate(hand);
      });
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / testHands.length;
      
      expect(averageTime).toBeLessThan(0.001); // 1ms per evaluation
    });
  });
});
```

### Type Checking Scripts

#### Automated Type Checking Script

```typescript
// tools/typeCheckScript.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

interface TypeCheckResult {
  success: boolean;
  errors: TypeError[];
  warnings: TypeWarning[];
  duration: number;
}

interface TypeError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

interface TypeWarning {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

export class TypeCheckScript {
  async runTypeCheck(configPath?: string): Promise<TypeCheckResult> {
    const startTime = Date.now();
    
    try {
      const command = configPath 
        ? `npx tsc --noEmit --project ${configPath}`
        : 'npx tsc --noEmit';
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      return {
        success: true,
        errors: [],
        warnings: [],
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      const parsed = this.parseTypeScriptOutput(error.stdout || error.message);
      
      return {
        success: false,
        errors: parsed.errors,
        warnings: parsed.warnings,
        duration: Date.now() - startTime
      };
    }
  }
  
  private parseTypeScriptOutput(output: string): { errors: TypeError[], warnings: TypeWarning[] } {
    const lines = output.split('\n');
    const errors: TypeError[] = [];
    const warnings: TypeWarning[] = [];
    
    lines.forEach(line => {
      const match = line.match(/^(.+)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/);
      
      if (match) {
        const [, file, lineNum, colNum, type, code, message] = match;
        
        const issue = {
          file,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          message,
          code
        };
        
        if (type === 'error') {
          errors.push(issue);
        } else {
          warnings.push(issue);
        }
      }
    });
    
    return { errors, warnings };
  }
  
  async runAllConfigurations(): Promise<Record<string, TypeCheckResult>> {
    const configs = [
      'tsconfig.json',
      'tsconfig.build.json',
      'tsconfig.test.json',
      'webapp/tsconfig.json'
    ];
    
    const results: Record<string, TypeCheckResult> = {};
    
    for (const config of configs) {
      try {
        results[config] = await this.runTypeCheck(config);
      } catch (error) {
        results[config] = {
          success: false,
          errors: [{
            file: config,
            line: 0,
            column: 0,
            message: `Failed to run type check: ${error.message}`,
            code: 'RUNTIME_ERROR'
          }],
          warnings: [],
          duration: 0
        };
      }
    }
    
    return results;
  }
}

// CLI usage
if (require.main === module) {
  const checker = new TypeCheckScript();
  
  checker.runAllConfigurations().then(results => {
    console.log('Type Check Results:');
    console.log(JSON.stringify(results, null, 2));
    
    const hasErrors = Object.values(results).some(result => !result.success);
    process.exit(hasErrors ? 1 : 0);
  });
}
```

### CI/CD Testing Workflows

#### GitHub Actions Workflow

```yaml
# .github/workflows/typescript-testing.yml
name: TypeScript Testing and Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check main library
        run: npm run type-check
      
      - name: Type check tests
        run: npm run type-check:tests
      
      - name: Type check webapp
        run: npm run type-check:webapp
      
      - name: Strict type check
        run: npm run type-check:strict

  test:
    runs-on: ubuntu-latest
    needs: type-check
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  performance:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance benchmarks
        run: npm run test:benchmark
      
      - name: Compare with baseline
        run: npm run performance:compare
      
      - name: Upload performance report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: performance-report.json

  bundle-analysis:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build library
        run: npm run build
      
      - name: Analyze bundle size
        run: npm run analyze:bundle-size
      
      - name: Check bundle size limits
        run: npm run check:bundle-size
```

### Test Configuration Updates

#### Updated Vitest Configuration for TypeScript

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      '**/*.d.ts',
      'test/fixtures/**'
    ],
    
    // Test setup files
    setupFiles: ['./test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        'tools/',
        'coverage/'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 95,
          lines: 95,
          statements: 95
        },
        // Critical modules require higher coverage
        'src/core/**/*.ts': {
          branches: 95,
          functions: 98,
          lines: 98,
          statements: 98
        },
        'src/PokerEvaluator.ts': {
          branches: 95,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    },
    
    // Performance testing
    benchmark: {
      include: ['test/**/*.bench.ts'],
      exclude: ['node_modules']
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@utils': resolve(__dirname, './src/utils'),
      '@variants': resolve(__dirname, './src/variants'),
      '@test': resolve(__dirname, './test')
    }
  }
});
```

---

## Troubleshooting Guides

### Common Type Checking Errors and Solutions

#### Error Resolution Guide

```typescript
// tools/troubleshooting/typeErrorResolver.ts
interface TypeErrorSolution {
  errorCode: string;
  pattern: RegExp;
  description: string;
  solution: string;
  example: {
    problem: string;
    solution: string;
  };
}

export const typeErrorSolutions: TypeErrorSolution[] = [
  {
    errorCode: 'TS2322',
    pattern: /Type '(.+)' is not assignable to type '(.+)'/,
    description: 'Type mismatch error',
    solution: 'Ensure types are compatible or use type assertions',
    example: {
      problem: `const result: string = getValue(); // getValue() returns number`,
      solution: `const result: string = String(getValue()); // or const result = getValue() as string;`
    }
  },
  {
    errorCode: 'TS2532',
    pattern: /Object is possibly 'undefined'/,
    description: 'Possible undefined value',
    solution: 'Add null check or use non-null assertion',
    example: {
      problem: `const value = obj.property; // obj might be undefined`,
      solution: `const value = obj?.property; // or if (obj) { const value = obj.property; }`
    }
  },
  {
    errorCode: 'TS7053',
    pattern: /Element implicitly has an 'any' type/,
    description: 'Implicit any type',
    solution: 'Add explicit type annotation',
    example: {
      problem: `const obj = { key: 'value' }; const value = obj[key];`,
      solution: `const obj: Record<string, string> = { key: 'value' }; const value = obj[key];`
    }
  }
];

export class TypeErrorResolver {
  resolveError(errorMessage: string): TypeErrorSolution | null {
    return typeErrorSolutions.find(solution => 
      solution.pattern.test(errorMessage)
    ) || null;
  }
  
  generateSuggestion(errorMessage: string): string {
    const solution = this.resolveError(errorMessage);
    
    if (!solution) {
      return 'No specific solution found. Check TypeScript documentation.';
    }
    
    return `
Error: ${solution.errorCode} - ${solution.description}
Solution: ${solution.solution}
Example:
  Problem: ${solution.example.problem}
  Solution: ${solution.example.solution}
    `.trim();
  }
}
```

### Testing Issues During Migration

#### Test Migration Troubleshooter

```typescript
// tools/troubleshooting/testMigrationTroubleshooter.ts
interface TestIssue {
  type: 'compilation' | 'runtime' | 'performance' | 'logic';
  description: string;
  commonCauses: string[];
  solutions: string[];
}

export const commonTestIssues: TestIssue[] = [
  {
    type: 'compilation',
    description: 'Test fails to compile after TypeScript migration',
    commonCauses: [
      'Missing type definitions',
      'Incorrect import paths',
      'Type mismatches in test assertions'
    ],
    solutions: [
      'Add proper type imports',
      'Update import statements to use .ts extensions',
      'Use type-safe test assertions',
      'Add type annotations to test data'
    ]
  },
  {
    type: 'runtime',
    description: 'Tests pass type checking but fail at runtime',
    commonCauses: [
      'Type assertions that are incorrect',
      'Missing runtime validation',
      'Differences between development and production builds'
    ],
    solutions: [
      'Add runtime type guards',
      'Validate test data before use',
      'Test against production build',
      'Use proper mocking strategies'
    ]
  },
  {
    type: 'performance',
    description: 'Tests become slow after TypeScript migration',
    commonCauses: [
      'Excessive type checking',
      'Inefficient test setup',
      'Large test data generation'
    ],
    solutions: [
      'Optimize TypeScript configuration',
      'Use test-specific tsconfig',
      'Implement test data caching',
      'Run performance tests separately'
    ]
  },
  {
    type: 'logic',
    description: 'Test logic differs from original JavaScript tests',
    commonCauses: [
      'Type coercion differences',
      'Strict mode behavior changes',
      'Different equality comparisons'
    ],
    solutions: [
      'Review type coercion in tests',
      'Add explicit type conversions',
      'Use strict equality checks',
      'Compare with original test results'
    ]
  }
];

export class TestMigrationTroubleshooter {
  diagnoseIssue(symptoms: string[]): TestIssue[] {
    return commonTestIssues.filter(issue => 
      symptoms.some(symptom => 
        issue.description.toLowerCase().includes(symptom.toLowerCase())
      )
    );
  }
  
  generateFixPlan(issues: TestIssue[]): string {
    return issues.map(issue => `
Issue: ${issue.description}
Common Causes:
${issue.commonCauses.map(cause => `  - ${cause}`).join('\n')}
Solutions:
${issue.solutions.map(solution => `  - ${solution}`).join('\n')}
    `).join('\n');
  }
}
```

### Performance Problems and Solutions

#### Performance Diagnostic Tool

```typescript
// tools/troubleshooting/performanceDiagnostics.ts
interface PerformanceIssue {
  type: 'memory' | 'cpu' | 'io' | 'algorithm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metrics: {
    threshold: number;
    actual: number;
    unit: string;
  };
  recommendations: string[];
}

export class PerformanceDiagnostics {
  analyzePerformanceMetrics(metrics: {
    memoryUsage: number;
    cpuTime: number;
    evaluationTime: number;
    throughput: number;
  }): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    
    // Memory usage analysis
    if (metrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
      issues.push({
        type: 'memory',
        severity: metrics.memoryUsage > 500 * 1024 * 1024 ? 'critical' : 'high',
        description: 'High memory usage detected',
        metrics: {
          threshold: 100 * 1024 * 1024,
          actual: metrics.memoryUsage,
          unit: 'bytes'
        },
        recommendations: [
          'Check for memory leaks in evaluation functions',
          'Optimize hash table usage',
          'Implement object pooling for frequent allocations',
          'Review large data structures for optimization opportunities'
        ]
      });
    }
    
    // CPU time analysis
    if (metrics.cpuTime > 1000) { // 1 second
      issues.push({
        type: 'cpu',
        severity: metrics.cpuTime > 5000 ? 'critical' : 'medium',
        description: 'High CPU usage during evaluation',
        metrics: {
          threshold: 1000,
          actual: metrics.cpuTime,
          unit: 'milliseconds'
        },
        recommendations: [
          'Optimize algorithm complexity',
          'Implement memoization for repeated calculations',
          'Use more efficient data structures',
          'Consider Web Workers for heavy computations'
        ]
      });
    }
    
    // Evaluation time analysis
    if (metrics.evaluationTime > 0.001) { // 1ms per evaluation
      issues.push({
        type: 'algorithm',
        severity: metrics.evaluationTime > 0.01 ? 'high' : 'medium',
        description: 'Slow hand evaluation performance',
        metrics: {
          threshold: 0.001,
          actual: metrics.evaluationTime,
          unit: 'milliseconds per evaluation'
        },
        recommendations: [
          'Optimize hash table lookups',
          'Reduce function call overhead',
          'Use bitwise operations where possible',
          'Consider pre-computing common patterns'
        ]
      });
    }
    
    return issues;
  }
  
  generateOptimizationPlan(issues: PerformanceIssue[]): string {
    const prioritizedIssues = issues.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    return `
Performance Optimization Plan
============================

${prioritizedIssues.map((issue, index) => `
${index + 1}. ${issue.description} (${issue.severity.toUpperCase()})
   Current: ${issue.metrics.actual} ${issue.metrics.unit}
   Target: ${issue.metrics.threshold} ${issue.metrics.unit}
   
   Recommendations:
${issue.recommendations.map(rec => `   - ${rec}`).join('\n')}
`).join('\n')}
    `.trim();
  }
}
```

### Debugging TypeScript in Tests

#### TypeScript Test Debugging Tools

```typescript
// test/utils/debugTools.ts
import { inspect } from 'util';

export class TypeScriptTestDebugger {
  static logType<T>(value: T, label?: string): void {
    console.log(`${label || 'Value'}:`, value);
    console.log(`Type: ${typeof value}`);
    console.log(`Constructor: ${value?.constructor?.name}`);
    console.log(`Is Array: ${Array.isArray(value)}`);
    console.log(`Keys: ${Object.keys(value || {})}`);
    console.log('---');
  }
  
  static logFunctionSignature<T extends (...args: any[]) => any>(
    fn: T,
    label?: string
  ): void {
    console.log(`${label || 'Function'}:`);
    console.log(`Name: ${fn.name}`);
    console.log(`Length: ${fn.length} parameters`);
    console.log(`toString: ${fn.toString()}`);
    console.log('---');
  }
  
  static compareTypes<T, U>(value1: T, value2: U, label?: string): void {
    console.log(`${label || 'Type Comparison'}:`);
    console.log(`Value 1 type: ${typeof value1}`);
    console.log(`Value 2 type: ${typeof value2}`);
    console.log(`Value 1 constructor: ${value1?.constructor?.name}`);
    console.log(`Value 2 constructor: ${value2?.constructor?.name}`);
    console.log(`Are same type: ${typeof value1 === typeof value2}`);
    console.log('---');
  }
  
  static traceExecution<T>(
    fn: () => T,
    label?: string
  ): T {
    console.log(`Tracing execution: ${label || 'Function'}`);
    console.log(`Start time: ${Date.now()}`);
    
    try {
      const result = fn();
      console.log(`Execution completed successfully`);
      console.log(`Result:`, result);
      console.log(`Result type: ${typeof result}`);
      return result;
    } catch (error) {
      console.log(`Execution failed with error:`, error);
      console.log(`Error type: ${typeof error}`);
      console.log(`Error constructor: ${error?.constructor?.name}`);
      throw error;
    } finally {
      console.log(`End time: ${Date.now()}`);
      console.log('---');
    }
  }
  
  static deepInspect(value: any, label?: string): void {
    console.log(`${label || 'Deep Inspection'}:`);
    console.log(inspect(value, { 
      showHidden: false, 
      depth: null, 
      colors: true,
      maxArrayLength: null
    }));
    console.log('---');
  }
}

// Usage example in tests
describe('Debugging Example', () => {
  it('should demonstrate debugging tools', () => {
    const evaluator = new PokerEvaluator();
    const hand = [12, 11, 10, 9, 8];
    
    TypeScriptTestDebugger.logType(hand, 'Test Hand');
    TypeScriptTestDebugger.logFunctionSignature(evaluator.evaluate, 'Evaluate Function');
    
    const result = TypeScriptTestDebugger.traceExecution(
      () => evaluator.evaluate(hand),
      'Hand Evaluation'
    );
    
    TypeScriptTestDebugger.deepInspect(result, 'Evaluation Result');
  });
});
```

---

## Conclusion

This comprehensive validation and testing strategy provides a structured approach to ensuring the quality and accuracy of the gamblingjs TypeScript migration, with special focus on poker evaluation algorithm accuracy and performance.

### Key Success Factors

1. **Incremental Validation**: Validate each step of the migration process
2. **Performance Focus**: Maintain or improve performance throughout migration
3. **Type Safety**: Leverage TypeScript's type system for better code quality
4. **Comprehensive Testing**: Cover unit, integration, and end-to-end scenarios
5. **Automation**: Automate as much of the validation process as possible

### Implementation Priority

1. **High Priority**: Core poker evaluation accuracy and performance
2. **Medium Priority**: Type coverage and comprehensive test suites
3. **Low Priority**: Advanced debugging tools and detailed reporting

By following this strategy, you can ensure a successful TypeScript migration while maintaining the high performance and accuracy requirements of the gamblingjs poker evaluation algorithms.
