#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import { HighEvaluator } from '../../src/core/HighEvaluator.js';
import { OmahaEvaluator } from '../../src/core/OmahaEvaluator.js';
import { handOfSevenEvalHiLow8Indexed } from '../../src/pokerEvaluator7.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';
import { rankHoldemStartingHands } from './ranking/ranker.js';
import { rankOmahaStartingHands } from './ranking/omaha-ranker.js';
import { rankStudStartingHands } from './ranking/stud-ranker.js';
import { rankOmahaHiLoStartingHands } from './ranking/omaha-hilo-ranker.js';
import { rankRazzStartingHands } from './ranking/razz-ranker.js';
import { rankStudHiLoStartingHands } from './ranking/stud-hilo-ranker.js';
import { SimulationConfig, SimulationResult } from './simulation/types.js';
import { formatTable, formatJSON, formatCSV, formatMarkdown } from './output.js';
import { runStreetAnalysisCli } from './cli-street.js';
import {
  enumerateHoldemStartingHands,
  enumerateOmahaStartingHands,
  enumerateStudStartingHands,
  logPreflopStart,
  runPreflopWorkerPool,
} from './cli-preflop-runner.js';
import { getCliWorkerCount } from './workers/cli-worker-pool.js';

const program = new Command();

const writeSimulationOutput = (
  result: SimulationResult,
  format: string,
  outputFile: string | undefined,
): void => {
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
};

const preflopProgress = (completed: number, total: number, hand: string): void => {
  if (completed % 10 === 0 || completed === total) {
    const pct = ((completed / total) * 100).toFixed(0);
    process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
  }
};

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
      runs: ((game === 'omaha' || game === 'omaha-hi-lo') && isDefaultRuns) ? 1000 : parseInt(runsOption, 10),
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

    if (streetMode) {
      if (
        (game === 'stud' || game === '7card-stud' || game === 'stud-hi-lo') &&
        config.opponents > 6
      ) {
        console.error(
          'Error: Stud variants support a maximum of 6 opponents (52 cards total, 7 cards per player + 3 hole cards).',
        );
        process.exit(1);
      }
      if (game === 'razz') {
        fastHashesCreators.Ato5();
      }
      if (game === 'omaha-hi-lo' || game === 'stud-hi-lo') {
        fastHashesCreators.low8();
      }

      const streetGameNames: Record<string, string> = {
        holdem: 'Texas Hold\'em',
        omaha: 'Omaha Hi',
        'omaha-hi-lo': 'Omaha Hi/Lo',
        stud: '7-Card Stud',
        '7card-stud': '7-Card Stud',
        'stud-hi-lo': 'Stud Hi/Lo',
        razz: 'Razz',
      };
      const streetHands: Record<string, string> = {
        holdem: '169',
        omaha: '~9,854',
        'omaha-hi-lo': '~9,854',
        stud: '1,755',
        '7card-stud': '1,755',
        'stud-hi-lo': '1,755',
        razz: '1,755',
      };

      console.error(
        `Running ${streetGameNames[game] ?? game} street-by-street analysis...\n` +
          `  Hands: ${streetHands[game] ?? '?'} | Runs/hand: ${config.runs}` +
          (config.opponents > 0 ? ` | Opponents: ${config.opponents}` : '') +
          `\n  Using ${getCliWorkerCount()} worker threads`,
      );

      await runStreetAnalysisCli(
        game,
        { runs: config.runs, opponents: config.opponents, seed: config.seed },
        format,
        !!detailed,
        outputFile,
        evalFn7,
      );

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stderr.write(`\n  Completed in ${elapsed}s\n`);
      return;
    }

    if (game === 'omaha-hi-lo') {
      logPreflopStart('Omaha Hi/Lo', 9854, config, 'omaha-hilo-preflop');
      const result = await runPreflopWorkerPool(
        'omaha-hilo-preflop',
        'omaha-hi-lo',
        enumerateOmahaStartingHands(),
        new URL('./workers/omaha-hilo-cli-worker.ts', import.meta.url).href,
        config,
        () => rankOmahaHiLoStartingHands(config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    } else if (game === 'stud-hi-lo') {
      if (config.opponents > 6) {
        console.error('Error: Stud Hi/Lo supports a maximum of 6 opponents (52 cards total, 7 cards per player + 3 hole cards).');
        process.exit(1);
      }

      logPreflopStart('Stud Hi/Lo', 1755, config, 'stud-hilo-preflop');
      const result = await runPreflopWorkerPool(
        'stud-hilo-preflop',
        'stud-hi-lo',
        enumerateStudStartingHands(),
        new URL('./workers/stud-hilo-cli-worker.ts', import.meta.url).href,
        config,
        () => rankStudHiLoStartingHands(handOfSevenEvalHiLow8Indexed, config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    } else if (game === 'omaha') {
      logPreflopStart('Omaha Hi', 9854, config, 'omaha-preflop');
      const omahaEvaluator = new OmahaEvaluator();
      const result = await runPreflopWorkerPool(
        'omaha-preflop',
        'omaha-hi',
        enumerateOmahaStartingHands(),
        new URL('./workers/omaha-cli-worker.ts', import.meta.url).href,
        config,
        () => rankOmahaStartingHands(omahaEvaluator, config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    } else if (game === 'razz') {

      fastHashesCreators.Ato5();
      logPreflopStart('Razz', 1755, config, 'razz-preflop');
      const result = await runPreflopWorkerPool(
        'razz-preflop',
        'razz',
        enumerateStudStartingHands(),
        new URL('./workers/razz-cli-worker.ts', import.meta.url).href,
        config,
        () => rankRazzStartingHands(config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    } else if (game === 'stud' || game === '7card-stud') {
      if (config.opponents > 6) {
        console.error('Error: 7-Card Stud supports a maximum of 6 opponents (52 cards total, 7 cards per player + 3 hole cards).');
        process.exit(1);
      }

      logPreflopStart('7-Card Stud', 1755, config, 'stud-preflop');
      const result = await runPreflopWorkerPool(
        'stud-preflop',
        '7card-stud',
        enumerateStudStartingHands(),
        new URL('./workers/stud-cli-worker.ts', import.meta.url).href,
        config,
        () => rankStudStartingHands(evalFn7, config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    } else {
      logPreflopStart('Texas Hold\'em', 169, config, 'holdem-preflop');
      const result = await runPreflopWorkerPool(
        'holdem-preflop',
        'texas-holdem',
        enumerateHoldemStartingHands(),
        new URL('./workers/holdem-cli-worker.ts', import.meta.url).href,
        config,
        () => rankHoldemStartingHands(evalFn7, config, preflopProgress),
      );
      process.stderr.write(`\n  Completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
      writeSimulationOutput(result, format, outputFile);
    }
  });

program.parse();