// Analytics and history recording for PokerTable

import type {
  ActionType,
  AnalyticsOptions,
  HandStateSnapshot,
  HistoryEvent,
  Player,
  PlayerCategory,
  PlayerStats,
  PositionLabel,
  StreetName,
} from './types';

// Welford's online algorithm for mean/std
class OnlineStats {
  private _count = 0;
  private _mean = 0;
  private _m2 = 0;

  add(x: number) {
    this._count += 1;
    const delta = x - this._mean;
    this._mean += delta / this._count;
    const delta2 = x - this._mean;
    this._m2 += delta * delta2;
  }

  toSummary() {
    const variance = this._count > 1 ? this._m2 / (this._count - 1) : 0;
    return { count: this._count, avg: this._mean || 0, std: Math.sqrt(variance) };
  }
}

interface InternalPlayerState {
  stats: PlayerStats;
  vpipMarkedForHand: boolean;
  position: PositionLabel | undefined;
}

export class TableAnalytics {
  private options: AnalyticsOptions;
  private players: Map<string, InternalPlayerState> = new Map();
  private history: HistoryEvent[] = [];
  private betStats: Map<string, OnlineStats> = new Map();
  private currentHandNumber = 0;
  private currentStreet: StreetName | null = null;

  constructor(options?: Partial<AnalyticsOptions>) {
    this.options = { enabled: !!options?.enabled, ...options } as AnalyticsOptions;
  }

  isEnabled(): boolean {
    return !!this.options.enabled;
  }

  onHandStart(snapshot: HandStateSnapshot): void {
    if (!this.isEnabled()) return;
    this.currentHandNumber = snapshot.handNumber;
    this.currentStreet = snapshot.street;

    const idToSeat = new Map<string, number>();
    const activePlayers: Player[] = snapshot.players.map((p) => ({
      id: p.id,
      seat: p.seat,
      chips: p.chips,
      holeCards: p.holeCards.slice(),
    } as Player));
    activePlayers.forEach((p) => idToSeat.set(p.id, p.seat));

    const positionMap = this.computePositions(snapshot.buttonSeat, activePlayers);

    for (const p of activePlayers) {
      const existing = this.players.get(p.id);
      if (!existing) {
        const ps: PlayerStats = {
          playerId: p.id,
          totalHands: 0,
          totalActions: 0,
          raises: 0,
          calls: 0,
          bets: 0,
          folds: 0,
          checks: 0,
          vpipHands: 0,
          byPosition: {},
          betSizes: { count: 0, avg: 0, std: 0 },
        };
        this.players.set(p.id, { stats: ps, vpipMarkedForHand: false, position: positionMap.get(p.id) });
        this.betStats.set(p.id, new OnlineStats());
      }
      const s = this.players.get(p.id)!;
      s.stats.totalHands += 1;
      s.vpipMarkedForHand = false;
      s.position = positionMap.get(p.id);
      if (s.position) {
        const pos = s.stats.byPosition[s.position] ?? { appearances: 0, vpip: 0, raises: 0, calls: 0, bets: 0 };
        pos.appearances += 1;
        s.stats.byPosition[s.position] = pos;
      }
    }

    this.pushHistory({
      ts: Date.now(),
      handNumber: snapshot.handNumber,
      street: snapshot.street,
      action: 'ante',
      note: 'hand-start',
    });
  }

  onStreetChange(street: StreetName | null): void {
    if (!this.isEnabled()) return;
    this.currentStreet = street;
    this.pushHistory({ ts: Date.now(), handNumber: this.currentHandNumber, street, action: 'check', note: 'street-change' });
  }

  recordForced(playerId: string | undefined, seat: number | undefined, kind: Extract<ActionType, 'ante' | 'blind' | 'bring-in'>, amount: number, position?: PositionLabel) {
    if (!this.isEnabled()) return;
    const evt: HistoryEvent = {
      ts: Date.now(),
      handNumber: this.currentHandNumber,
      street: this.currentStreet,
      action: kind,
      amount,
    } as HistoryEvent;
    if (playerId !== undefined) (evt as any).playerId = playerId;
    if (seat !== undefined) (evt as any).seat = seat;
    if (position !== undefined) (evt as any).position = position;
    this.pushHistory(evt);
  }

  recordAction(playerId: string, action: Extract<ActionType, 'fold' | 'check' | 'call' | 'bet' | 'raise'>, amount?: number): void {
    if (!this.isEnabled()) return;
    const p = this.players.get(playerId);
    if (!p) return;
    p.stats.totalActions += 1;

    // VPIP detection on the first betting street ('preflop' | 'deal' | 'third-street')
    if (!p.vpipMarkedForHand && (this.currentStreet === 'preflop' || this.currentStreet === 'deal' || this.currentStreet === 'third-street')) {
      if (action === 'call' || action === 'bet' || action === 'raise') {
        p.vpipMarkedForHand = true;
        p.stats.vpipHands += 1;
        if (p.position) {
          const pos = p.stats.byPosition[p.position] ?? { appearances: 0, vpip: 0, raises: 0, calls: 0, bets: 0 };
          pos.vpip += 1;
          p.stats.byPosition[p.position] = pos;
        }
      }
    }

    switch (action) {
      case 'raise':
        p.stats.raises += 1;
        this.incPos(p.position, 'raises', p.stats);
        if (amount && amount > 0) this.betStats.get(playerId)?.add(amount);
        break;
      case 'bet':
        p.stats.bets += 1;
        this.incPos(p.position, 'bets', p.stats);
        if (amount && amount > 0) this.betStats.get(playerId)?.add(amount);
        break;
      case 'call':
        p.stats.calls += 1;
        this.incPos(p.position, 'calls', p.stats);
        break;
      case 'fold':
        p.stats.folds += 1;
        break;
      case 'check':
        p.stats.checks += 1;
        break;
    }

    // Update bet size summary snapshot
    const bs = this.betStats.get(playerId)!.toSummary();
    p.stats.betSizes = bs;

    const evt: HistoryEvent = {
      ts: Date.now(),
      handNumber: this.currentHandNumber,
      street: this.currentStreet,
      action,
    } as HistoryEvent;
    (evt as any).playerId = playerId;
    if (amount !== undefined) (evt as any).amount = amount;
    if (p.position !== undefined) (evt as any).position = p.position;
    this.pushHistory(evt);
  }

  getPlayerStats(playerId: string): PlayerStats | undefined {
    const p = this.players.get(playerId)?.stats;
    return p ? JSON.parse(JSON.stringify(p)) : undefined;
  }

  getPlayerCategory(playerId: string): PlayerCategory {
    const s = this.players.get(playerId)?.stats;
    if (!s || s.totalHands === 0) return 'unknown';

    const cfg = this.options.categorize ?? {};
    const nitMax = cfg.vpipNitMax ?? 0.12;
    const tightMax = cfg.vpipTightMax ?? 0.20;
    const looseMin = cfg.vpipLooseMin ?? 0.32;
    const aggrMin = cfg.aggressionAggressiveMin ?? 0.50;
    const minHands = cfg.minHandsForCategory ?? 50;

    if (s.totalHands < minHands) return 'unknown';

    const vpip = s.vpipHands / s.totalHands;
    const aggDen = s.raises + s.calls;
    const aggression = aggDen > 0 ? s.raises / aggDen : 0;

    const aggressive = aggression >= aggrMin;

    if (vpip < nitMax) return 'nit';

    if (vpip <= tightMax) {
      return aggressive ? 'TAG' : 'tight-passive';
    }

    if (vpip >= looseMin) {
      return aggressive ? 'LAG' : 'loose-passive';
    }

    // Middle VPIP band (between tightMax and looseMin)
    return aggressive ? 'TAG' : 'tight-passive';
  }

  getHistory(): HistoryEvent[] {
    return this.history.slice();
  }

  private incPos(pos: PositionLabel | undefined, field: 'raises' | 'calls' | 'bets', stats: PlayerStats) {
    if (!pos) return;
    const p = stats.byPosition[pos] ?? { appearances: 0, vpip: 0, raises: 0, calls: 0, bets: 0 };
    p[field] += 1;
    stats.byPosition[pos] = p;
  }

  private pushHistory(evt: HistoryEvent) {
    this.history.push(evt);
    // Fire-and-forget persistence if configured
    if (this.options.persistPath) {
      try {
        // Lazy require to avoid bundlers in browser
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs') as typeof import('fs');
        const path = this.options.persistPath;
        const prev: HistoryEvent[] = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf-8') || '[]') : [];
        prev.push(evt);
        fs.writeFileSync(path, JSON.stringify(prev));
      } catch {
        // ignore persistence errors
      }
    }
  }

  private computePositions(buttonSeat: number, players: Player[]): Map<string, PositionLabel> {
    const map = new Map<string, PositionLabel>();
    const orderedSeats = players
      .slice()
      .sort((a, b) => this.distFrom(buttonSeat, a.seat, players.length) - this.distFrom(buttonSeat, b.seat, players.length))
      .map((p) => p.seat);

    // Seat order starting from BTN, then clockwise
    const n = orderedSeats.length;
    const labels = this.positionLabelsForCount(n);
    for (let i = 0; i < n; i++) {
      const seat = orderedSeats[i]!;
      const player = players.find((p) => p.seat === seat)!;
      map.set(player.id, labels[i]!);
    }
    return map;
  }

  private distFrom(button: number, seat: number, n: number): number {
    // Normalize clockwise distance from button (BTN index 0)
    const d = (seat - button + n) % n;
    return d;
  }

  private positionLabelsForCount(n: number): PositionLabel[] {
    // BTN at index 0, then SB, BB, then field: UTG, HJ, CO simplified depending on count
    if (n <= 2) return ['BTN', 'SB'].slice(0, n) as PositionLabel[]; // heads-up: BTN/SB and BB treated as SB label
    if (n === 3) return ['BTN', 'SB', 'BB'];
    if (n === 4) return ['BTN', 'SB', 'BB', 'UTG'];
    if (n === 5) return ['BTN', 'SB', 'BB', 'UTG', 'CO'];
    if (n === 6) return ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
    if (n === 7) return ['BTN', 'SB', 'BB', 'UTG', 'EP', 'HJ', 'CO'];
    if (n === 8) return ['BTN', 'SB', 'BB', 'UTG', 'EP', 'MP', 'HJ', 'CO'];
    // 9+ players
    const base: PositionLabel[] = ['BTN', 'SB', 'BB', 'UTG', 'EP', 'MP', 'HJ', 'CO'];
    while (base.length < n) base.splice(4, 0, 'EP'); // add more EPs
    return base.slice(0, n);
  }
}
