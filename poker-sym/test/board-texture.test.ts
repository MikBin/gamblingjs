import { describe, it, expect } from 'vitest';
import { classifyBoardTexture, primaryTexture } from '../src/simulation/board-texture.js';
import { cardIndex } from '../src/utils/deck.js';

describe('classifyBoardTexture', () => {
  it('should return empty array for less than 3 cards', () => {
    expect(classifyBoardTexture([])).toEqual([]);
    expect(classifyBoardTexture([cardIndex(0, 0)])).toEqual([]);
    expect(classifyBoardTexture([cardIndex(0, 0), cardIndex(1, 0)])).toEqual([]);
  });

  it('should classify monotone board (all same suit)', () => {
    // 2s, 5s, 9s — all spades
    const board = [cardIndex(0, 0), cardIndex(3, 0), cardIndex(7, 0)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('monotone');
  });

  it('should classify wet board (flush draw + straight draw)', () => {
    // 5s, 6s, 7d — flush draw (2 spades) + straight draw (span=2)
    const board = [cardIndex(3, 0), cardIndex(4, 0), cardIndex(5, 1)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('wet');
  });

  it('should classify flush-draw board (2+ same suit, no straight draw)', () => {
    // 2s, 5s, Kd — flush draw (2 spades), span=10 (no straight draw)
    const board = [cardIndex(0, 0), cardIndex(3, 0), cardIndex(11, 1)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('flush-draw');
  });

  it('should classify straight-draw board (connected, no flush draw)', () => {
    // 5s, 6d, 7h — straight draw (span=2), all different suits
    const board = [cardIndex(3, 0), cardIndex(4, 1), cardIndex(5, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('straight-draw');
  });

  it('should classify dry board (no draws)', () => {
    // 2s, 7d, Kh — span=9, all different suits
    const board = [cardIndex(0, 0), cardIndex(5, 1), cardIndex(11, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('dry');
  });

  it('should classify paired board', () => {
    // 5s, 5d, Kh — paired fives
    const board = [cardIndex(3, 0), cardIndex(3, 1), cardIndex(11, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('paired');
  });

  it('should classify high board (all T+)', () => {
    // Ts, Jd, Kh — all high cards
    const board = [cardIndex(8, 0), cardIndex(9, 1), cardIndex(11, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('high');
  });

  it('should classify low board (all 8-)', () => {
    // 2s, 3d, 7h — all low cards
    const board = [cardIndex(0, 0), cardIndex(1, 1), cardIndex(5, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('low');
  });

  it('should detect wheel straight draw with Ace', () => {
    // As, 2d, 3h — wheel straight draw
    const board = [cardIndex(12, 0), cardIndex(0, 1), cardIndex(1, 2)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('straight-draw');
  });

  it('should work with 4-card boards (turn)', () => {
    // 5s, 6d, 7h, 8c — straight draw on turn
    const board = [cardIndex(3, 0), cardIndex(4, 1), cardIndex(5, 2), cardIndex(6, 3)];
    const textures = classifyBoardTexture(board);
    expect(textures).toContain('straight-draw');
  });
});

describe('primaryTexture', () => {
  it('should return first texture from classification', () => {
    // 5s, 5d, Kh — paired (primary will be based on the classification)
    const board = [cardIndex(3, 0), cardIndex(3, 1), cardIndex(11, 2)];
    const primary = primaryTexture(board);
    expect(typeof primary).toBe('string');
    expect(primary).toBeTruthy();
  });

  it('should return dry for disconnected rainbow board', () => {
    // 2s, 7d, Kh — dry
    const board = [cardIndex(0, 0), cardIndex(5, 1), cardIndex(11, 2)];
    expect(primaryTexture(board)).toBe('dry');
  });
});