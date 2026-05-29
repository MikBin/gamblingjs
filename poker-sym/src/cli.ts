#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import os from 'os';
import { Worker } from 'worker_threads';
import { HighEvaluator } from '../../src/core/HighEvaluator.js';
import { Low8Evaluator } from '../../src/core/LowEvaluator.js';
import { OmahaEvaluator } from '../../src/core/OmahaEvaluator.js';
import { handOfFiveEvalIndexed } from '../../src/pokerEvaluator5.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';
import { rankHoldemStartingHands } from './ranking/ranker.js';
import { rankOmahaStartingHands } from './ranking/omaha-ranker.js';
import { rankStudStartingHands } from './ranking/stud-ranker.js';
import { rankOmahaHiLoStartingHands } from './ranking/omaha-hilo-ranker.js';
import { rankRazzStartingHands } from './ranking/razz-ranker.js';
import { rankStreets } from './ranking/street-ranker.js';
import { rankStudHiLoStartingHands } from './ranking/stud-hilo-ranker.js';
import { SimulationConfig, SimulationResult, HandStrengthResult } from './simulation/types.js';
import { formatTable, formatJSON, formatCSV, formatMarkdown } from './output.js';
import {
  formatStreetTable,
  formatStreetTableDetailed,
  formatStreetJSON,
  formatStreetCSV,
  formatStreetMarkdown,
} from './output-street.js';

const program = new Command();

program
  .name('poker-sym')
  .description('Monte Carlo simulation for poker starting hand ranking (Hold\'em, Omaha, Omaha Hi/Lo, 7-Card Stud, Stud Hi/Lo, Razz)')
  .version('0.1.0')
  .option('-g, --game <type>', 'game variant: holdem, omaha, omaha-hi-lo, stud, 7card-stud, stud-hi-lo, razz', 'holdem')
  .option('-n, --runs <number>', 'number of simulation runs per hand', '10000')
  .option('-o, --opponents <number>', 'number of opponents (0 = raw strength)', '0')
  .option('-s, --seed <number>', 'random seed for reproducibility')
  .option('-f, --format <type>', 'output format: table, json, csv, md', 'table')
  .option('-O, --output <file>', 'write output to file instead of stdout')
  .option('--street', 'run street-by-street analysis (flop/turn/river)')
  .option('--detailed', 'show detailed per-hand breakdown (with --street)')
  .action(async (options) => {
    const game = (options.game as string)?.toLowerCase() ?? 'holdem';
    const runsOption = options.runs as string;
    const isDefaultRuns = runsOption === '10000';

    const config: SimulationConfig = {
      runs: ((game === 'omaha' || game === 'omaha-hi-lo' || game === 'stud-hi-lo') && isDefaultRuns) ? 1000 : parseInt(runsOption, 10),
      opponents: parseInt(options.opponents, 10),
      seed: options.seed ? parseInt(options.seed, 10) : undefined,
      useCache: true,
    };

    const format = options.format as string;
    const outputFile = options.output as string | undefined;
    const streetMode = options.street as boolean | undefined;
    const detailed = options.detailed as boolean | undefined;

    // Initialize hash tables (required before evaluation)
    fastHashesCreators.high();
    if (game === 'omaha-hi-lo' || game === 'stud-hi-lo') {
      fastHashesCreators.low8();
    }

    const evaluator = new HighEvaluator();
    const evalFn7 = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

    const startTime = Date.now();

    if (game === 'omaha-hi-lo') {
      if (streetMode) {
        console.error('Street analysis for Omaha Hi/Lo is not yet supported.');
        process.exit(1);
      }

      console.error(
        `Running Omaha Hi/Lo preflop simulation...\n` +
          `  Hands: ~9,854 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}\n` +
          `  Using ${Math.max(1, Math.floor(os.cpus().length / 2))} worker threads`,
      );

      let result: SimulationResult;
      try {
        result = await runOmahaHiLoWorkerPool(config, (completed, total, hand) => {
          if (completed % 10 === 0 || completed === total) {
            const pct = ((completed / total) * 100).toFixed(0);
            process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
          }
        });
      } catch {
        console.error('\n  Worker pool failed, falling back to single-threaded...');
        result = rankOmahaHiLoStartingHands(config, (completed, total, hand) => {
          if (completed % 10 === 0 || completed === total) {
            const pct = ((completed / total) * 100).toFixed(0);
            process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
          }
        });
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);

      let output: string;
      switch (format) {
        case 'json':
          output = formatJSON(result);
          break;
        case 'csv':
          output = formatCSV(result);
          break;
        case 'md':
          output = formatMarkdown(result);
          break;
        default:
          output = formatTable(result);
      }

      if (outputFile) {
        fs.writeFileSync(outputFile, output, 'utf-8');
        console.error(`\nResults written to ${outputFile}`);
      } else {
        console.log(output);
      }
    } else if (game === 'stud-hi-lo') {
      if (streetMode) {
        console.error('Street analysis for Stud Hi/Lo is not supported.');
        process.exit(1);
      }

      console.error(
        `Running Stud Hi/Lo simulation...\n` +
          `  Hands: 1,755 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}`
      );

      const lowEvaluator = new Low8Evaluator();
      const result = rankStudHiLoStartingHands(evaluator, lowEvaluator, config, (completed, total, hand) => {
        if (completed % 10 === 0 || completed === total) {
          const pct = ((completed / total) * 100).toFixed(0);
          process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
        }
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);

      let output: string;
      switch (format) {
        case 'json':
          output = formatJSON(result);
          break;
        case 'csv':
          output = formatCSV(result);
          break;
        case 'md':
          output = formatMarkdown(result);
          break;
        default:
          output = formatTable(result);
      }

      if (outputFile) {
        fs.writeFileSync(outputFile, output, 'utf-8');
        console.error(`\nResults written to ${outputFile}`);
      } else {
        console.log(output);
      }
    } else if (game === 'omaha') {
      if (streetMode) {
        console.error('Street analysis for Omaha is not yet supported.');
        process.exit(1);
      }

      console.error(
        `Running Omaha Hi preflop simulation...\n` +
          `  Hands: ~9,854 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}\n` +
          `  Using ${Math.max(1, Math.floor(os.cpus().length / 2))} worker threads`,
      );

      let result: SimulationResult;
      try {
        result = await runOmahaWorkerPool(config, (completed, total, hand) => {
          if (completed % 10 === 0 || completed === total) {
            const pct = ((completed / total) * 100).toFixed(0);
            process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
          }
        });
      } catch {
        // Fallback to single-threaded
        console.error('\n  Worker pool failed, falling back to single-threaded...');
        const omahaEvaluator = new OmahaEvaluator();
        result = rankOmahaStartingHands(omahaEvaluator, config, (completed, total, hand) => {
          if (completed % 10 === 0 || completed === total) {
            const pct = ((completed / total) * 100).toFixed(0);
            process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
          }
        });
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);

      let output: string;
      switch (format) {
        case 'json':
          output = formatJSON(result);
          break;
        case 'csv':
          output = formatCSV(result);
          break;
        case 'md':
          output = formatMarkdown(result);
          break;
        default:
          output = formatTable(result);
      }

      if (outputFile) {
        fs.writeFileSync(outputFile, output, 'utf-8');
        console.error(`\nResults written to ${outputFile}`);
      } else {
        console.log(output);
      }
    } else if (game === 'razz') {
      if (streetMode) {
        console.error('Street analysis for Razz is not yet supported.');
        process.exit(1);
      }

      console.error(
        `Running Razz preflop simulation...\n` +
          `  Hands: 455 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}`,
      );

      fastHashesCreators.Ato5();

      const result = rankRazzStartingHands(config, (completed, total, hand) => {
        if (completed % 10 === 0 || completed === total) {
          const pct = ((completed / total) * 100).toFixed(0);
          process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
        }
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);

      let output: string;
      switch (format) {
        case 'json':
          output = formatJSON(result);
          break;
        case 'csv':
          output = formatCSV(result);
          break;
        case 'md':
          output = formatMarkdown(result);
          break;
        default:
          output = formatTable(result);
      }

      if (outputFile) {
        fs.writeFileSync(outputFile, output, 'utf-8');
        console.error(`\nResults written to ${outputFile}`);
      } else {
        console.log(output);
      }
    } else if (game === 'stud' || game === '7card-stud') {
      if (config.opponents > 6) {
        console.error('Error: 7-Card Stud supports a maximum of 6 opponents (52 cards total, 7 cards per player + 3 hole cards).');
        process.exit(1);
      }
      if (streetMode) {
        console.error('Street analysis for 7-Card Stud is not yet supported.');
        process.exit(1);
      }

      console.error(
        `Running 7-Card Stud starting hand simulation...\n` +
          `  Hands: 1,755 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}`
      );

      const result = rankStudStartingHands(evalFn7, config, (completed, total, hand) => {
        if (completed % 10 === 0 || completed === total) {
          const pct = ((completed / total) * 100).toFixed(0);
          process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
        }
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);

      let output: string;
      switch (format) {
        case 'json':
          output = formatJSON(result);
          break;
        case 'csv':
          output = formatCSV(result);
          break;
        case 'md':
          output = formatMarkdown(result);
          break;
        default:
          output = formatTable(result);
      }

      if (outputFile) {
        fs.writeFileSync(outputFile, output, 'utf-8');
        console.error(`\nResults written to ${outputFile}`);
      } else {
        console.log(output);
      }
    } else {
      if (streetMode) {
        // Street-by-street analysis mode
        console.error(
          `Running Texas Hold'em street-by-street analysis...\n` +
            `  Hands: 169 | Runs/hand: ${config.runs}`,
        );

        const result = rankStreets(
          handOfFiveEvalIndexed,
          evalFn7,
          config.runs,
          config.seed,
          (completed, total, hand) => {
            if (completed % 10 === 0 || completed === total) {
              const pct = ((completed / total) * 100).toFixed(0);
              process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
            }
          },
        );

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stderr.write(`\n  Completed in ${elapsed}s\n`);

        let output: string;
        switch (format) {
          case 'json':
            output = formatStreetJSON(result);
            break;
          case 'csv':
            output = formatStreetCSV(result);
            break;
          case 'md':
            output = formatStreetMarkdown(result);
            break;
          default:
            output = detailed ? formatStreetTableDetailed(result) : formatStreetTable(result);
        }

        if (outputFile) {
          fs.writeFileSync(outputFile, output, 'utf-8');
          console.error(`\nResults written to ${outputFile}`);
        } else {
          console.log(output);
        }
      } else {
        // Original preflop simulation mode
        console.error(
          `Running Texas Hold'em preflop simulation...\n` +
            `  Hands: 169 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}`,
        );

        const result = rankHoldemStartingHands(evalFn7, config, (completed, total, hand) => {
          if (completed % 10 === 0 || completed === total) {
            const pct = ((completed / total) * 100).toFixed(0);
            process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
          }
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stderr.write(`\n  Completed in ${elapsed}s\n`);

        let output: string;
        switch (format) {
          case 'json':
            output = formatJSON(result);
            break;
          case 'csv':
            output = formatCSV(result);
            break;
          case 'md':
            output = formatMarkdown(result);
            break;
          default:
            output = formatTable(result);
        }

        if (outputFile) {
          fs.writeFileSync(outputFile, output, 'utf-8');
          console.error(`\nResults written to ${outputFile}`);
        } else {
          console.log(output);
        }
      }
    }
  });

/**
 * Run Omaha simulation across a pool of worker threads.
 * Shards the canonical hand list across N/2 CPU workers.
 */
async function runOmahaWorkerPool(
  config: SimulationConfig,
  onProgress: (completed: number, total: number, hand: string) => void,
): Promise<SimulationResult> {
  const { enumerateOmahaStartingHands } = await import('./hands/omaha.js');
  const hands = enumerateOmahaStartingHands();
  const numWorkers = Math.max(1, Math.floor(os.cpus().length / 2));
  const workerPath = new URL('./workers/omaha-cli-worker.ts', import.meta.url).href;

  interface WorkerMsg {
    type: 'progress' | 'done';
    completed?: number;
    total?: number;
    results?: HandStrengthResult[];
  }

  const allResults: HandStrengthResult[] = [];
  let completedHands = 0;
  const totalHands = hands.length;
  const workerLastProgress: number[] = new Array(numWorkers).fill(0);

  const workers: Worker[] = [];
  const promises: Promise<void>[] = [];

  for (let w = 0; w < numWorkers; w++) {
    const start = Math.floor((w / numWorkers) * hands.length);
    const end = Math.floor(((w + 1) / numWorkers) * hands.length);
    const batch = hands.slice(start, end);

    const worker = new Worker(workerPath);
    workers.push(worker);

    const promise = new Promise<void>((resolve, reject) => {
      worker.on('message', (msg: WorkerMsg) => {
        if (msg.type === 'progress' && msg.completed != null) {
          const delta = msg.completed - workerLastProgress[w]!;
          workerLastProgress[w] = msg.completed;
          completedHands += delta;
          const hand = batch[(msg.completed ?? 1) - 1]?.key ?? '';
          onProgress(Math.min(completedHands, totalHands), totalHands, hand);
        } else if (msg.type === 'done' && msg.results) {
          allResults.push(...msg.results);
          resolve();
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
    });

    promises.push(promise);

    worker.postMessage({
      hands: batch,
      config,
      seedOffset: w * 1_000_000,
    });
  }

  await Promise.all(promises);
  workers.forEach((w) => w.terminate());

  // Sort results
  if (config.opponents > 0) {
    allResults.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    allResults.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: 'omaha-hi',
    config,
    hands: allResults,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run Omaha Hi/Lo simulation across a pool of worker threads.
 */
async function runOmahaHiLoWorkerPool(
  config: SimulationConfig,
  onProgress: (completed: number, total: number, hand: string) => void,
): Promise<SimulationResult> {
  const { enumerateOmahaStartingHands } = await import('./hands/omaha.js');
  const hands = enumerateOmahaStartingHands();
  const numWorkers = Math.max(1, Math.floor(os.cpus().length / 2));
  const workerPath = new URL('./workers/omaha-hilo-cli-worker.ts', import.meta.url).href;

  interface WorkerMsg {
    type: 'progress' | 'done';
    completed?: number;
    total?: number;
    results?: HandStrengthResult[];
  }

  const allResults: HandStrengthResult[] = [];
  let completedHands = 0;
  const totalHands = hands.length;
  const workerLastProgress: number[] = new Array(numWorkers).fill(0);

  const workers: Worker[] = [];
  const promises: Promise<void>[] = [];

  for (let w = 0; w < numWorkers; w++) {
    const start = Math.floor((w / numWorkers) * hands.length);
    const end = Math.floor(((w + 1) / numWorkers) * hands.length);
    const batch = hands.slice(start, end);

    const worker = new Worker(workerPath);
    workers.push(worker);

    const promise = new Promise<void>((resolve, reject) => {
      worker.on('message', (msg: WorkerMsg) => {
        if (msg.type === 'progress' && msg.completed != null) {
          const delta = msg.completed - workerLastProgress[w]!;
          workerLastProgress[w] = msg.completed;
          completedHands += delta;
          const hand = batch[(msg.completed ?? 1) - 1]?.key ?? '';
          onProgress(Math.min(completedHands, totalHands), totalHands, hand);
        } else if (msg.type === 'done' && msg.results) {
          allResults.push(...msg.results);
          resolve();
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
    });

    promises.push(promise);

    worker.postMessage({
      hands: batch,
      config,
      seedOffset: w * 1_000_000,
    });
  }

  await Promise.all(promises);
  workers.forEach((w) => w.terminate());

  if (config.opponents > 0) {
    allResults.sort((a, b) => b.winPct - a.winPct || b.averageRank - a.averageRank);
  } else {
    allResults.sort((a, b) => b.averageRank - a.averageRank);
  }

  return {
    gameType: 'omaha-hi-lo',
    config,
    hands: allResults,
    timestamp: new Date().toISOString(),
  };
}

program.parse();