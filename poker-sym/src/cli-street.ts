import fs from 'fs';
import { handOfFiveEvalIndexed } from '../../src/pokerEvaluator5.js';
import { handOfFiveEvalLow_Ato5Indexed } from '../../src/pokerEvaluator5.js';
import { LowAto5Evaluator } from '../../src/core/LowEvaluator.js';
import { rankStreets } from './ranking/street-ranker.js';
import { rankOmahaStreets } from './ranking/omaha-street-ranker.js';
import { rankOmahaHiLoStreets } from './ranking/omaha-hilo-street-ranker.js';
import { rankStudStreets } from './ranking/stud-street-ranker.js';
import { rankStudHiLoStreets } from './ranking/stud-hilo-street-ranker.js';
import { rankRazzStreets } from './ranking/razz-street-ranker.js';
import {
  formatStreetTable,
  formatStreetJSON,
  formatStreetCSV,
  formatStreetMarkdown,
  formatStreetTableDetailed,
} from './output-street.js';
import {
  formatOmahaStreetTable,
  formatOmahaStreetJSON,
  formatOmahaStreetCSV,
  formatOmahaStreetMarkdown,
  formatOmahaHiLoStreetTable,
  formatOmahaHiLoStreetJSON,
  formatOmahaHiLoStreetCSV,
  formatOmahaHiLoStreetMarkdown,
  formatStudStreetTable,
  formatStudStreetJSON,
  formatStudStreetCSV,
  formatStudStreetMarkdown,
  formatRazzStreetTable,
  formatRazzStreetJSON,
  formatRazzStreetCSV,
  formatRazzStreetMarkdown,
  formatStudHiLoStreetTable,
  formatStudHiLoStreetJSON,
  formatStudHiLoStreetCSV,
  formatStudHiLoStreetMarkdown,
} from './output-street-variants.js';
import { StreetAnalysisResult, StreetHandResult } from './simulation/types.js';
import { enumerateHoldemStartingHands } from './hands/holdem.js';
import { enumerateOmahaStartingHands } from './hands/omaha.js';
import { enumerateStudStartingHands } from './hands/stud.js';
import { StudStreetHandResult, StudStreetAnalysisResult } from './simulation/stud-street-analysis.js';
import { RazzStreetHandResult, RazzStreetAnalysisResult } from './simulation/razz-street-analysis.js';
import { StreetHandResultHiLo, StreetAnalysisResultHiLo } from './simulation/types.js';
import { StudHiLoStreetHandResult } from './simulation/types.js';
import { runCliWorkerPool, formatCliProgressLine } from './workers/cli-worker-pool.js';
import { estimateCliTotalMs, formatDuration } from './workers/cli-eta.js';

export interface StreetCliConfig {
  runs: number;
  opponents: number;
  seed?: number;
}

const writeStreetOutput = (output: string, outputFile: string | undefined): void => {
  if (outputFile) {
    fs.writeFileSync(outputFile, output, 'utf-8');
    console.error(`\nResults written to ${outputFile}`);
  } else {
    console.log(output);
  }
};

const formatStreetOutput = (
  format: string,
  detailed: boolean,
  tableFn: () => string,
  jsonFn: () => string,
  csvFn: () => string,
  mdFn: () => string,
  detailedFn?: () => string,
): string => {
  switch (format) {
    case 'json':
      return jsonFn();
    case 'csv':
      return csvFn();
    case 'md':
      return mdFn();
    default:
      return detailed && detailedFn ? detailedFn() : tableFn();
  }
};

const streetProgress = (pageKey: string, handCount: number, config: StreetCliConfig) => {
  const etaMs = estimateCliTotalMs(pageKey, handCount, config.runs, config.opponents);
  console.error(`  Estimated: ~${formatDuration(etaMs)}`);
  return (completed: number, total: number, hand: string, eta: number | null) => {
    if (completed % 10 === 0 || completed === total) {
      process.stderr.write(formatCliProgressLine(completed, total, hand, eta));
    }
  };
};

const fallbackProgress = (completed: number, total: number, hand: string) => {
  if (completed % 10 === 0 || completed === total) {
    const pct = ((completed / total) * 100).toFixed(0);
    process.stderr.write(`\r  Progress: ${completed}/${total} (${pct}%) — ${hand}    `);
  }
};

export async function runStreetAnalysisCli(
  game: string,
  config: StreetCliConfig,
  format: string,
  detailed: boolean,
  outputFile: string | undefined,
  evalFn7: (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) => number,
): Promise<void> {
  if (game === 'holdem') {
    const onProgress = streetProgress('holdem-street', 169, config);
    let result;
    try {
      const pool = await runCliWorkerPool<StreetHandResult>({
        workerPath: new URL('./workers/holdem-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateHoldemStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({ hands: batch, runs: config.runs, seed: config.seed, seedOffset });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.river.averageRank - a.river.averageRank);
      result = {
        gameType: 'texas-holdem' as const,
        config: { runs: config.runs, opponents: 0, seed: config.seed },
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      result = rankStreets(handOfFiveEvalIndexed, evalFn7, config.runs, config.seed, fallbackProgress);
    }
    const output = formatStreetOutput(
      format,
      detailed,
      () => formatStreetTable(result),
      () => formatStreetJSON(result),
      () => formatStreetCSV(result),
      () => formatStreetMarkdown(result),
      () => formatStreetTableDetailed(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  if (game === 'omaha') {
    const onProgress = streetProgress('omaha-street', 9854, config);
    let result: StreetAnalysisResult;
    try {
      const pool = await runCliWorkerPool<StreetHandResult>({
        workerPath: new URL('./workers/omaha-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateOmahaStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({ hands: batch, runs: config.runs, seed: config.seed, seedOffset });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.river.averageRank - a.river.averageRank);
      result = {
        gameType: 'omaha-hi',
        config: { runs: config.runs, opponents: 0, seed: config.seed },
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      result = rankOmahaStreets(handOfFiveEvalIndexed, config.runs, config.seed, fallbackProgress);
    }
    const output = formatStreetOutput(
      format,
      false,
      () => formatOmahaStreetTable(result),
      () => formatOmahaStreetJSON(result),
      () => formatOmahaStreetCSV(result),
      () => formatOmahaStreetMarkdown(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  if (game === 'omaha-hi-lo') {
    const onProgress = streetProgress('omaha-hilo-street', 9854, config);
    let result: StreetAnalysisResultHiLo;
    try {
      const pool = await runCliWorkerPool<StreetHandResultHiLo>({
        workerPath: new URL('./workers/omaha-hilo-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateOmahaStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({
            hands: batch,
            runs: config.runs,
            opponents: config.opponents,
            seed: config.seed,
            seedOffset,
          });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.flop.scoopPct - a.flop.scoopPct);
      result = {
        gameType: 'omaha-hi-lo',
        config: { runs: config.runs, opponents: config.opponents, seed: config.seed },
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      result = rankOmahaHiLoStreets(config.runs, config.opponents, config.seed, fallbackProgress);
    }
    const output = formatStreetOutput(
      format,
      false,
      () => formatOmahaHiLoStreetTable(result),
      () => formatOmahaHiLoStreetJSON(result),
      () => formatOmahaHiLoStreetCSV(result),
      () => formatOmahaHiLoStreetMarkdown(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  if (game === 'stud' || game === '7card-stud') {
    const onProgress = streetProgress('stud-street', 1755, config);
    let result: StudStreetAnalysisResult;
    try {
      const pool = await runCliWorkerPool<StudStreetHandResult>({
        workerPath: new URL('./workers/stud-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateStudStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({ hands: batch, runs: config.runs, seed: config.seed, seedOffset });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.seventh.averageRank - a.seventh.averageRank);
      result = {
        gameType: '7card-stud',
        config: { runs: config.runs, opponents: 0, seed: config.seed },
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      result = rankStudStreets(handOfFiveEvalIndexed, evalFn7, config.runs, config.seed, fallbackProgress);
    }
    const output = formatStreetOutput(
      format,
      false,
      () => formatStudStreetTable(result),
      () => formatStudStreetJSON(result),
      () => formatStudStreetCSV(result),
      () => formatStudStreetMarkdown(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  if (game === 'stud-hi-lo') {
    const onProgress = streetProgress('stud-hilo-street', 1755, config);
    let result: { gameType: 'stud-hi-lo'; config: StreetCliConfig; hands: StudHiLoStreetHandResult[]; timestamp: string };
    try {
      const pool = await runCliWorkerPool<StudHiLoStreetHandResult>({
        workerPath: new URL('./workers/stud-hilo-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateStudStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({
            hands: batch,
            runs: config.runs,
            opponents: config.opponents,
            seed: config.seed,
            seedOffset,
          });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.seventh.equity - a.seventh.equity);
      result = {
        gameType: 'stud-hi-lo',
        config,
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      result = rankStudHiLoStreets(config.runs, config.opponents, config.seed, fallbackProgress);
    }
    const output = formatStreetOutput(
      format,
      false,
      () => formatStudHiLoStreetTable(result),
      () => formatStudHiLoStreetJSON(result),
      () => formatStudHiLoStreetCSV(result),
      () => formatStudHiLoStreetMarkdown(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  if (game === 'razz') {
    const onProgress = streetProgress('razz-street', 1755, config);
    let result: RazzStreetAnalysisResult;
    try {
      const pool = await runCliWorkerPool<RazzStreetHandResult>({
        workerPath: new URL('./workers/razz-street-cli-worker.ts', import.meta.url).href,
        hands: enumerateStudStartingHands(),
        postBatch: (worker, batch, _w, seedOffset) => {
          worker.postMessage({ hands: batch, runs: config.runs, seed: config.seed, seedOffset });
        },
        onProgress,
      });
      const sorted = [...pool.results].sort((a, b) => b.seventh.averageRank - a.seventh.averageRank);
      result = {
        gameType: 'razz',
        config: { runs: config.runs, opponents: 0, seed: config.seed },
        hands: sorted,
        timestamp: new Date().toISOString(),
      };
    } catch {
      console.error('\n  Worker pool failed, falling back to single-threaded...');
      const evaluator = new LowAto5Evaluator();
      const evalFn7Razz = (c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number) =>
        evaluator.evaluate([c1, c2, c3, c4, c5, c6, c7]);
      result = rankRazzStreets(
        handOfFiveEvalLow_Ato5Indexed,
        evalFn7Razz,
        config.runs,
        config.seed,
        fallbackProgress,
      );
    }
    const output = formatStreetOutput(
      format,
      false,
      () => formatRazzStreetTable(result),
      () => formatRazzStreetJSON(result),
      () => formatRazzStreetCSV(result),
      () => formatRazzStreetMarkdown(result),
    );
    writeStreetOutput(output, outputFile);
    return;
  }

  console.error(`Street analysis is not supported for game: ${game}`);
  process.exit(1);
}
