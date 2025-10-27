// Deck, shuffling and dealing utilities decoupled from the table logic

export interface Dealer {
  initDeck(customDeck?: number[]): void;
  shuffle(): void;
  burn(count?: number): void;
  dealCard(): number;
  deal(count: number): number[];
  remaining(): number;
}

export type RNG = () => number;

export function createStandardDeck(): number[] {
  // 0..51 numeric indices
  const deck: number[] = new Array(52);
  for (let i = 0; i < 52; i++) deck[i] = i;
  return deck;
}

export class LocalDealer implements Dealer {
  private deck: number[] = [];
  private rng: RNG;

  constructor(rng?: RNG) {
    this.rng = rng ?? Math.random;
    this.initDeck();
  }

  initDeck(customDeck?: number[]): void {
    this.deck = (customDeck ? customDeck.slice() : createStandardDeck());
  }

  shuffle(): void {
    // Fisher-Yates
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j]!, this.deck[i]!];
    }
  }

  burn(count: number = 1): void {
    for (let i = 0; i < count; i++) this.dealCard();
  }

  dealCard(): number {
    if (this.deck.length === 0) throw new Error('Deck exhausted');
    const c = this.deck.pop();
    if (c === undefined) throw new Error('Deck pop returned undefined');
    return c;
  }

  deal(count: number): number[] {
    const result: number[] = new Array(count);
    for (let i = 0; i < count; i++) result[i] = this.dealCard();
    return result;
  }

  remaining(): number {
    return this.deck.length;
  }
}

// RemoteDealer is used on clients; the server provides the cards in order.
export class RemoteDealer implements Dealer {
  private queue: number[] = [];

  initDeck(_customDeck?: number[]): void {
    this.queue = [];
  }

  provide(cards: number[]): void {
    // enqueue cards to be dealt in the provided order (front of queue dealt first)
    this.queue.push(...cards);
  }

  shuffle(): void {
    // no-op; server controls order
  }

  burn(count: number = 1): void {
    for (let i = 0; i < count; i++) this.dealCard();
  }

  dealCard(): number {
    if (this.queue.length === 0) throw new Error('RemoteDealer: no cards available');
    const c = this.queue.shift();
    if (c === undefined) throw new Error('RemoteDealer: shift returned undefined');
    return c;
  }

  deal(count: number): number[] {
    const out: number[] = new Array(count);
    for (let i = 0; i < count; i++) out[i] = this.dealCard();
    return out;
  }

  remaining(): number {
    return this.queue.length;
  }
}
