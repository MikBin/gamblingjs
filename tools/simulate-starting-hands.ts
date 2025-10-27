import { fullCardsDeckHash_5, rankToFaceSymbol } from '../src/constants.js';
import { handOfSevenEvalIndexed, handOfSevenEvalHiLow8Indexed } from '../src/pokerEvaluator7.js';
import { bfBestOfFiveFromTwoSets, bfBestOfFiveFromTwoSetsHiLow8Indexed } from '../src/pokerEvaluatorTwoSets.js';
import { fastHashesCreators } from '../src/pokerHashes7.js';

// Initialize hash tables for high poker hands
fastHashesCreators.high();
fastHashesCreators.low8();

// Simple PRNG for reproducibility if needed
const rng = () => Math.random();

type GameKey = 'texas-holdem' | 'omaha' | 'omaha-hi-low8' | 'stud' | 'stud-hi-low8';

interface CliOptions {
  runs: number;
  games: GameKey[];
  output?: string | undefined;
}

interface HoldemResultMap {
  [key: string]: {
    averageHi: number;
  };
}

interface OmahaHighResultMap {
  [key: string]: {
    averageHi: number;
  };
}

interface OmahaHiLowResultMap {
  [key: string]: {
    averageHi: number;
    averageLow: number;
  };
}

interface StudResultMap {
  [key: string]: {
    averageHi: number;
  };
}

interface StudHiLowResultMap {
  [key: string]: {
    averageHi: number;
    averageLow: number;
  };
}

interface CombinedResult {
  'texas-holdem'?: HoldemResultMap;
  'omaha'?: OmahaHighResultMap;
  'omaha-hi-low8'?: OmahaHiLowResultMap;
  'stud'?: StudResultMap;
  'stud-hi-low8'?: StudHiLowResultMap;
}

// Utilities
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Map rank index 0..12 -> symbol '2'..'A'
const rankSym = (r: number) => rankToFaceSymbol[r];

// Build a canonical card index given rank (0..12) and suitIndex (0..3)
const idx = (rank: number, suit: number) => suit * 13 + rank;

// Fisher-Yates shuffle in-place
function shuffle<T>(a: T[]): void {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

// Sample k distinct cards from deck (array of indices), removing them from deck
function draw(deck: number[], k: number): number[] {
  const res: number[] = [];
  for (let i = 0; i < k; i++) {
    const j = Math.floor(rng() * deck.length);
    res.push(deck[j]!);
    deck.splice(j, 1);
  }
  return res;
}

// Create deck excluding specified cards
function makeDeck(exclude: number[]): number[] {
  const ex = new Set(exclude);
  const d = range(52).filter((c) => !ex.has(c));
  return d;
}

// Canonical key helpers
// Hold'em: "AKs", "AKo", "TT"
function holdemKey(r1: number, r2: number, suited: boolean): string {
  const [a, b] = r1 >= r2 ? [r1, r2] : [r2, r1];
  if (a === b) return `${rankSym(a)}${rankSym(b)}`; // pair
  return `${rankSym(a)}${rankSym(b)}${suited ? 's' : 'o'}`;
}

// Omaha/Stud: key as ranks sorted descending plus suit pattern minimized by canonical assignment
// We ignore actual suit labels and just output ranks joined, e.g. "AAKQ" for Omaha, "AKQ" for Stud
function ranksKey(ranks: number[]): string {
  const sorted = [...ranks].sort((a, b) => b - a);
  return sorted.map(rankSym).join('');
}

// Build concrete card indices for a multiset of ranks with canonical suits (avoid duplicates)
function concreteHandFromRanks(ranks: number[]): number[] {
  // For repeated ranks, assign suits 0,1,2,3; for unique ranks, use suit 0
  const suitUse: Record<number, number> = {}; // rank -> next suit index to use
  return ranks.map((r) => {
    const next = suitUse[r] ?? 0;
    suitUse[r] = next + 1;
    return idx(r, next);
  });
}

// Enumerators
function enumerateHoldemStartingHands(): { key: string; cards: number[] }[] {
  const out: { key: string; cards: number[] }[] = [];
  for (let r1 = 12; r1 >= 0; r1--) {
    // pairs
    const pairCards = [idx(r1, 0), idx(r1, 1)];
    out.push({ key: holdemKey(r1, r1, false), cards: pairCards });
    for (let r2 = r1 - 1; r2 >= 0; r2--) {
      // suited
      out.push({ key: holdemKey(r1, r2, true), cards: [idx(r1, 0), idx(r2, 0)] });
      // offsuit
      out.push({ key: holdemKey(r1, r2, false), cards: [idx(r1, 0), idx(r2, 1)] });
    }
  }
  return out;
}

function enumerateOmahaStartingHands(): { key: string; cards: number[] }[] {
  const out: { key: string; cards: number[] }[] = [];
  // multiset combinations of size 4 from ranks 0..12 (nondecreasing r0<=r1<=r2<=r3)
  for (let a = 0; a <= 12; a++)
    for (let b = a; b <= 12; b++)
      for (let c = b; c <= 12; c++)
        for (let d = c; d <= 12; d++) {
          const ranks = [a, b, c, d];
          const key = ranksKey(ranks);
          const cards = concreteHandFromRanks(ranks);
          out.push({ key, cards });
        }
  return out;
}

function enumerateStudStartingHands(): { key: string; cards: number[] }[] {
  const out: { key: string; cards: number[] }[] = [];
  for (let a = 0; a <= 12; a++)
    for (let b = a; b <= 12; b++)
      for (let c = b; c <= 12; c++) {
        const ranks = [a, b, c];
        const key = ranksKey(ranks);
        const cards = concreteHandFromRanks(ranks);
        out.push({ key, cards });
      }
  return out;
}

// Simulations
function simulateHoldem(runs: number): HoldemResultMap {
  const res: HoldemResultMap = {};
  const hands = enumerateHoldemStartingHands();
  for (const h of hands) {
    let sumHi = 0;
    for (let i = 0; i < runs; i++) {
      const deck = makeDeck(h.cards);
      const board = draw(deck, 5);
      // 7-card high evaluation
      const r = handOfSevenEvalIndexed(h.cards[0]!, h.cards[1]!, board[0]!, board[1]!, board[2]!, board[3]!, board[4]!);
      sumHi += r;
    }
    res[h.key] = { averageHi: sumHi / runs };
  }
  return res;
}

function simulateOmahaHigh(runs: number): OmahaHighResultMap {
  const res: OmahaHighResultMap = {};
  const hands = enumerateOmahaStartingHands();
  for (const h of hands) {
    let sumHi = 0;
    // Precompute hashed hole cards for 5-card evaluator
    const hole5 = h.cards.map((c) => fullCardsDeckHash_5[c]!);
    for (let i = 0; i < runs; i++) {
      const deck = makeDeck(h.cards);
      const board = draw(deck, 5);
      const board5 = board.map((c) => fullCardsDeckHash_5[c]!);
      const r = bfBestOfFiveFromTwoSets(hole5, board5, 2, 3);
      sumHi += r;
    }
    res[h.key] = { averageHi: sumHi / runs };
  }
  return res;
}

function simulateOmahaHiLow8(runs: number): OmahaHiLowResultMap {
  const res: OmahaHiLowResultMap = {};
  const hands = enumerateOmahaStartingHands();
  for (const h of hands) {
    let sumHi = 0;
    let sumLow = 0;
    for (let i = 0; i < runs; i++) {
      const deck = makeDeck(h.cards);
      const board = draw(deck, 5);
      const hl = bfBestOfFiveFromTwoSetsHiLow8Indexed(h.cards, board, 2, 3);
      sumHi += hl.hi;
      sumLow += hl.low;
    }
    res[h.key] = { averageHi: sumHi / runs, averageLow: sumLow / runs };
  }
  return res;
}

function simulateStud(runs: number): StudResultMap {
  const res: StudResultMap = {};
  const hands = enumerateStudStartingHands();
  for (const h of hands) {
    let sumHi = 0;
    for (let i = 0; i < runs; i++) {
      const deck = makeDeck(h.cards);
      const rest = draw(deck, 4);
      const seven = [...h.cards, ...rest];
      const r = handOfSevenEvalIndexed(seven[0]!, seven[1]!, seven[2]!, seven[3]!, seven[4]!, seven[5]!, seven[6]!);
      sumHi += r;
    }
    res[h.key] = { averageHi: sumHi / runs };
  }
  return res;
}

function simulateStudHiLow8(runs: number): StudHiLowResultMap {
  const res: StudHiLowResultMap = {};
  const hands = enumerateStudStartingHands();
  for (const h of hands) {
    let sumHi = 0;
    let sumLow = 0;
    for (let i = 0; i < runs; i++) {
      const deck = makeDeck(h.cards);
      const rest = draw(deck, 4);
      const seven = [...h.cards, ...rest];
      const hl = handOfSevenEvalHiLow8Indexed(
        seven[0]!, seven[1]!, seven[2]!, seven[3]!, seven[4]!, seven[5]!, seven[6]!
      );
      sumHi += hl.hi;
      sumLow += hl.low;
    }
    res[h.key] = { averageHi: sumHi / runs, averageLow: sumLow / runs };
  }
  return res;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  let runs = 100;
  let games: GameKey[] = ['texas-holdem', 'omaha', 'omaha-hi-low8', 'stud', 'stud-hi-low8'];
  let output: string | undefined;
  for (const a of args) {
    if (a.startsWith('--runs=')) runs = parseInt(a.split('=')[1]!, 10);
    else if (a.startsWith('--games=')) {
      const parts = a.split('=')[1]!.split(',').map((s) => s.trim()) as GameKey[];
      games = parts;
    } else if (a.startsWith('--output=')) output = a.split('=')[1]!;
  }
  // With exactOptionalPropertyTypes, avoid setting undefined explicitly
  const base: { runs: number; games: GameKey[] } & Partial<CliOptions> = { runs, games };
  if (output !== undefined) base.output = output;
  return base as CliOptions;
}

async function main() {
  const { runs, games, output } = parseArgs();
  const result: CombinedResult = {};

  if (games.includes('texas-holdem')) {
    result['texas-holdem'] = simulateHoldem(runs);
  }
  if (games.includes('omaha')) {
    // Omaha is heavier; reduce runs automatically if very high
    const omahaRuns = Math.max(500, Math.min(runs, 5000));
    result['omaha'] = simulateOmahaHigh(omahaRuns);
  }
  if (games.includes('omaha-hi-low8')) {
    const omahaHLRuns = Math.max(500, Math.min(runs, 5000));
    result['omaha-hi-low8'] = simulateOmahaHiLow8(omahaHLRuns);
  }
  if (games.includes('stud')) {
    result['stud'] = simulateStud(runs);
  }
  if (games.includes('stud-hi-low8')) {
    result['stud-hi-low8'] = simulateStudHiLow8(runs);
  }

  const json = JSON.stringify(result, null, 2);
  if (output) {
    const fs = await import('fs');
    const path = await import('path');
    const outDir = path.resolve(process.cwd(), output.includes('.json') ? path.dirname(output) : output);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = output.endsWith('.json') ? output : path.join(outDir, 'starting-hands-strength.json');
    fs.writeFileSync(outFile, json, 'utf8');
    // eslint-disable-next-line no-console
    console.log(`Written results to ${outFile}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(json);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});