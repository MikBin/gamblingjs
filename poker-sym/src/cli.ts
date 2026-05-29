#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import { HighEvaluator } from '../../src/core/HighEvaluator.js';
import { fastHashesCreators } from '../../src/pokerHashes7.js';
import { rankHoldemStartingHands } from './ranking/ranker.js';
import { SimulationConfig } from './simulation/types.js';
import { formatTable, formatJSON, formatCSV, formatMarkdown } from './output.js';

const program = new Command();

program
  .name('poker-sym')
  .description('Monte Carlo simulation for poker starting hand ranking')
  .version('0.1.0')
  .option('-n, --runs <number>', 'number of simulation runs per hand', '10000')
  .option('-o, --opponents <number>', 'number of opponents (0 = raw strength)', '0')
  .option('-s, --seed <number>', 'random seed for reproducibility')
  .option('-f, --format <type>', 'output format: table, json, csv, md', 'table')
  .option('-O, --output <file>', 'write output to file instead of stdout')
  .action(async (options) => {
    const config: SimulationConfig = {
      runs: parseInt(options.runs, 10),
      opponents: parseInt(options.opponents, 10),
      seed: options.seed ? parseInt(options.seed, 10) : undefined,
      useCache: true,
    };

    const format = options.format as string;
    const outputFile = options.output as string | undefined;

    console.error(
      `Running Texas Hold'em preflop simulation...\n` +
        `  Hands: 169 | Runs/hand: ${config.runs} | Opponents: ${config.opponents}`,
    );

    // Initialize hash tables (required before evaluation)
    fastHashesCreators.high();

    const evaluator = new HighEvaluator();
    const evalFn = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
      evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);

    const startTime = Date.now();

    const result = rankHoldemStartingHands(evalFn, config, (completed, total, hand) => {
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
  });

program.parse();