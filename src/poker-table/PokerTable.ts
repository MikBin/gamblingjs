// PokerTable class that orchestrates hands, turns, rotation, and integrates with a pluggable Dealer

import { Dealer } from './deck';
import {
  BlindsStructure,
  CashStructure,
  GameDefinition,
  BlindLevel,
  GameId,
  GameInRotation,
  GameRotation,
  HandStateSnapshot,
  LimitType,
  StreetName,
  TableConfig,
  Player,
} from './types';

// Built-in lightweight definitions sufficient to drive dealing logic
const GAME_DEFINITIONS: Record<string, GameDefinition> = {
  [GameId.TEXAS_HOLDEM]: {
    id: GameId.TEXAS_HOLDEM,
    displayName: 'Texas Hold\'em',
    minPlayers: 2,
    maxPlayers: 10,
    usesBlinds: true,
    holeCardsPerPlayer: 2,
    communityCardStages: [
      { street: 'flop', count: 3 },
      { street: 'turn', count: 1 },
      { street: 'river', count: 1 },
    ],
  },
  [GameId.OMAHA]: {
    id: GameId.OMAHA,
    displayName: 'Omaha',
    minPlayers: 2,
    maxPlayers: 10,
    usesBlinds: true,
    holeCardsPerPlayer: 4,
    communityCardStages: [
      { street: 'flop', count: 3 },
      { street: 'turn', count: 1 },
      { street: 'river', count: 1 },
    ],
  },
  [GameId.OMAHA_HI_LO]: {
    id: GameId.OMAHA_HI_LO,
    displayName: 'Omaha Hi/Lo',
    minPlayers: 2,
    maxPlayers: 10,
    usesBlinds: true,
    holeCardsPerPlayer: 4,
    communityCardStages: [
      { street: 'flop', count: 3 },
      { street: 'turn', count: 1 },
      { street: 'river', count: 1 },
    ],
  },
  [GameId.FIVE_CARD_DRAW]: {
    id: GameId.FIVE_CARD_DRAW,
    displayName: '5-Card Draw',
    minPlayers: 2,
    maxPlayers: 6,
    usesBlinds: true,
    holeCardsPerPlayer: 5,
    drawRounds: [
      { street: 'draw-1', maxDraw: 5 },
    ],
  },
  [GameId.DEUCE_TO_SEVEN_TRIPLE_DRAW]: {
    id: GameId.DEUCE_TO_SEVEN_TRIPLE_DRAW,
    displayName: '2-7 Triple Draw',
    minPlayers: 2,
    maxPlayers: 6,
    usesBlinds: true,
    holeCardsPerPlayer: 5,
    drawRounds: [
      { street: 'draw-1', maxDraw: 3 },
      { street: 'draw-2', maxDraw: 3 },
      { street: 'draw-3', maxDraw: 3 },
    ],
  },
  [GameId.RAZZ]: {
    id: GameId.RAZZ,
    displayName: 'Razz',
    minPlayers: 2,
    maxPlayers: 8,
    usesBlinds: false,
    holeCardsPerPlayer: 2, // 2 down + 1 up to start; subsequent streets are dealt up
    studStreets: [
      'third-street', 'fourth-street', 'fifth-street', 'sixth-street', 'seventh-street',
    ],
  },
  [GameId.SEVEN_CARD_STUD]: {
    id: GameId.SEVEN_CARD_STUD,
    displayName: '7-Card Stud',
    minPlayers: 2,
    maxPlayers: 8,
    usesBlinds: false,
    holeCardsPerPlayer: 2,
    studStreets: [
      'third-street', 'fourth-street', 'fifth-street', 'sixth-street', 'seventh-street',
    ],
  },
  [GameId.SEVEN_CARD_STUD_HI_LO]: {
    id: GameId.SEVEN_CARD_STUD_HI_LO,
    displayName: '7-Card Stud Hi/Lo',
    minPlayers: 2,
    maxPlayers: 8,
    usesBlinds: false,
    holeCardsPerPlayer: 2,
    studStreets: [
      'third-street', 'fourth-street', 'fifth-street', 'sixth-street', 'seventh-street',
    ],
  },
};

export interface TableStateOptions {
  // When true, table won\'t shuffle/deal; external actor (e.g., server) drives it
  passiveDealing?: boolean;
}

export class PokerTable {
  readonly config: TableConfig;
  readonly rotation: GameRotation;
  private readonly dealer: Dealer;

  private seats: Array<Player | null>;
  private buttonSeat: number;
  private currentRotationIndex = 0;
  private handsPlayedInCurrentGame = 0;
  private handNumber = 0;

  private pot = 0;
  private communityCards: number[] = [];
  private street: StreetName | null = null;

  private options: TableStateOptions;

  constructor(config: TableConfig, dealer: Dealer, options: TableStateOptions = {}) {
    if (config.maxSeats < 2) throw new Error('maxSeats must be at least 2');
    if (config.rotation.sequence.length === 0) throw new Error('rotation must contain at least one game');

    this.config = config;
    this.rotation = config.rotation;
    this.dealer = dealer;
    this.seats = new Array(config.maxSeats).fill(null);
    this.buttonSeat = config.dealerButtonSeat ?? 0;
    this.options = options;
  }

  // --- Seat management ---
  addPlayer(p: Omit<Player, 'seat' | 'holeCards'> & { seat?: number }): Player {
    const seat = p.seat ?? this.findFirstOpenSeat();
    if (seat < 0 || seat >= this.seats.length) throw new Error('invalid seat');
    if (this.seats[seat]) throw new Error('seat already taken');
    const player: Player = { id: p.id, seat, chips: p.chips, holeCards: [] };
    if (p.name !== undefined) (player as any).name = p.name;
    this.seats[seat] = player;
    return player;
  }

  removePlayer(seat: number): void {
    if (!this.seats[seat]) return;
    this.seats[seat] = null;
  }

  private findFirstOpenSeat(): number {
    for (let i = 0; i < this.seats.length; i++) if (!this.seats[i]) return i;
    throw new Error('table is full');
  }

  // --- Rotation helpers ---
  private get currentGame(): GameInRotation {
    return this.rotation.sequence[this.currentRotationIndex]!;
  }

  private get currentGameDef(): GameDefinition {
    const id = this.currentGame.game;
    const key = String(id);
    const def = GAME_DEFINITIONS[key];
    if (!def) throw new Error(`Game definition not found for ${key}`);
    return def;
  }

  private advanceRotationIfNeeded(): void {
    const handsTarget = this.currentGame.hands;
    if (handsTarget && this.handsPlayedInCurrentGame >= handsTarget) {
      this.currentRotationIndex += 1;
      if (this.currentRotationIndex >= this.rotation.sequence.length) {
        if (this.rotation.loop) this.currentRotationIndex = 0; else this.currentRotationIndex = this.rotation.sequence.length - 1;
      }
      this.handsPlayedInCurrentGame = 0;
    }
  }

  // --- Hand lifecycle ---
  startHand(): void {
    // rotate if last game finished its hand allotment
    this.advanceRotationIfNeeded();

    this.handNumber += 1;
    this.handsPlayedInCurrentGame += 1;
    this.pot = 0;
    this.communityCards = [];
    this.street = null;

    // Reset per-player state
    for (const p of this.seats) {
      if (!p) continue;
      p.holeCards = [];
      p.folded = false;
      p.allIn = false;
    }

    // Prepare deck
    this.dealer.initDeck();
    if (!this.options.passiveDealing) this.dealer.shuffle();

    // Antes / blinds
    this.collectAntesAndBlinds();

    // Deal opening cards
    this.dealOpeningCards();
  }

  private collectAntesAndBlinds(): void {
    const structure = this.resolveBlinds();
    const { ante } = structure;

    // Collect antes first (if any)
    if (ante && ante > 0) {
      this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => this.chargeChips(p, ante));
    }

    // Cash-style blinds for games that use them
    if (this.currentGameDef.usesBlinds) {
      const { smallBlind, bigBlind } = structure;
      const sbSeat = this.nextOccupiedSeat(this.buttonSeat);
      const bbSeat = this.nextOccupiedSeat(sbSeat);
      const sb = this.seats[sbSeat]!;
      const bb = this.seats[bbSeat]!;
      if (smallBlind) this.chargeChips(sb, smallBlind);
      if (bigBlind) this.chargeChips(bb, bigBlind);
    } else {
      // Stud bring-in, if configured
      const bringIn = (structure as CashStructure['blinds']).bringIn;
      if (bringIn && bringIn > 0) {
        const bringInSeat = this.nextOccupiedSeat(this.buttonSeat + 1);
        this.chargeChips(this.seats[bringInSeat]!, bringIn);
      }
    }
  }

  private resolveBlinds(): { smallBlind?: number; bigBlind?: number; ante?: number; bringIn?: number } {
    const base = this.config.structure;
    const override = this.currentGame.blindsOverride ?? {};

    if (base.kind === 'cash') {
      return { ...base.blinds, ...(override as Partial<CashStructure['blinds']>) };
    }

    // Tournament: pick current level by hands played if configured, else first level
    let level = base.levels[0]!;
    if (base.advanceBy === 'hands' && base.advanceEvery && this.handNumber > 0) {
      const idx = Math.min(Math.floor((this.handNumber - 1) / base.advanceEvery), base.levels.length - 1);
      level = base.levels[idx]!;
    }
    // startingLevelId support
    if (base.startingLevelId) {
      const found = base.levels.find((l) => l.id === base.startingLevelId);
      if (found) level = found;
    }
    return { ...level, ...(override as Partial<BlindLevel>) } as any;
  }

  private chargeChips(player: Player, amount: number): void {
    const toPay = Math.min(player.chips, amount);
    player.chips -= toPay;
    if (player.chips === 0) player.allIn = true;
    this.pot += toPay;
  }

  private dealOpeningCards(): void {
    const def = this.currentGameDef;

    if (def.communityCardStages) {
      // Flop games: deal hole cards round-robin, then set preflop
      const hole = def.holeCardsPerPlayer;
      for (let r = 0; r < hole; r++) {
        this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
          p.holeCards.push(this.dealer.dealCard());
        });
      }
      this.street = 'preflop';
    } else if (def.drawRounds) {
      // Draw games: deal all hole cards
      this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
        p.holeCards.push(...this.dealer.deal(def.holeCardsPerPlayer));
      });
      this.street = 'deal';
    } else if (def.studStreets) {
      // Simplified stud: 2 down + 1 up to start
      this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
        p.holeCards.push(this.dealer.dealCard()); // down
      });
      this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
        p.holeCards.push(this.dealer.dealCard()); // down
      });
      this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
        p.holeCards.push(this.dealer.dealCard()); // up card (tracked in same array)
      });
      this.street = 'third-street';
    } else {
      throw new Error('Unsupported game definition');
    }
  }

  nextStreet(): void {
    const def = this.currentGameDef;

    if (def.communityCardStages) {
      if (this.street === 'preflop') {
        this.dealer.burn(1);
        this.communityCards.push(...this.dealer.deal(3));
        this.street = 'flop';
        return;
      }
      if (this.street === 'flop') {
        this.dealer.burn(1);
        this.communityCards.push(...this.dealer.deal(1));
        this.street = 'turn';
        return;
      }
      if (this.street === 'turn') {
        this.dealer.burn(1);
        this.communityCards.push(...this.dealer.deal(1));
        this.street = 'river';
        return;
      }
      if (this.street === 'river') {
        this.street = 'showdown';
        return;
      }
    } else if (def.drawRounds) {
      // advance through draw rounds sequentially
      const order: StreetName[] = def.drawRounds.map((r) => r.street);
      if (this.street === 'deal') {
        this.street = order[0] ?? 'showdown';
        return;
      }
      const idx = order.indexOf(this.street as StreetName);
      if (idx >= 0 && idx < order.length - 1) {
        this.street = order[idx + 1]!;
        return;
      }
      this.street = 'showdown';
      return;
    } else if (def.studStreets) {
      const idx = def.studStreets.indexOf(this.street as StreetName);
      if (idx < 0) {
        // from initial deal to third street already handled
        this.street = def.studStreets[0] ?? 'showdown';
        return;
      }
      if (idx < def.studStreets.length - 1) {
        // deal one up-card to each active player
        this.forEachActivePlayerFrom(this.buttonSeat + 1, (p) => {
          p.holeCards.push(this.dealer.dealCard());
        });
        this.street = def.studStreets[idx + 1]!;
        return;
      }
      this.street = 'showdown';
      return;
    }

    throw new Error('nextStreet: cannot advance from current state');
  }

  getSnapshot(): HandStateSnapshot {
    return {
      handNumber: this.handNumber,
      game: this.currentGame,
      street: this.street,
      buttonSeat: this.buttonSeat,
      communityCards: this.communityCards.slice(),
      players: this.seats
        .filter((p): p is Player => !!p)
        .map((p) => ({ id: p.id, seat: p.seat, chips: p.chips, folded: !!p.folded, allIn: !!p.allIn, holeCards: p.holeCards.slice() })),
      pot: this.pot,
    };
  }

  moveButton(): void {
    this.buttonSeat = this.nextOccupiedSeat(this.buttonSeat);
  }

  // --- Iteration helpers ---
  private forEachActivePlayerFrom(startSeat: number, fn: (p: Player) => void): void {
    let idx = this.normalizeSeat(startSeat);
    const start = idx;
    for (let iter = 0; iter < this.seats.length; iter++) {
      const p = this.seats[idx];
      if (p && !p.sittingOut && !p.folded) fn(p);
      idx = this.normalizeSeat(idx + 1);
      if (idx === start) break;
    }
  }

  private nextOccupiedSeat(fromSeat: number): number {
    let idx = this.normalizeSeat(fromSeat);
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[idx];
      if (s && !s.sittingOut) return idx;
      idx = this.normalizeSeat(idx + 1);
    }
    throw new Error('no occupied seats');
  }

  private normalizeSeat(seat: number): number {
    const n = this.seats.length;
    return ((seat % n) + n) % n;
  }
}
