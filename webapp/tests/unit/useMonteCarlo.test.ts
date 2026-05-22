import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMonteCarlo } from '../../src/composables/useMonteCarlo';
import * as gamblingjs from '@gamblingjs';

vi.mock('@gamblingjs', () => {
  return {
    getPartialHandStatsIndexed_7: vi.fn(),
  };
});

describe('useMonteCarlo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { isSimulating, simulationResult, simulationError } = useMonteCarlo();
    expect(isSimulating.value).toBe(false);
    expect(simulationResult.value).toBeNull();
    expect(simulationError.value).toBeNull();
  });

  it('runs simulation successfully', async () => {
    const mockStats = { 'high card': 0.5, 'one pair': 0.5 };
    vi.mocked(gamblingjs.getPartialHandStatsIndexed_7).mockReturnValue(mockStats as any);

    const { runSimulation, simulationResult, isSimulating } = useMonteCarlo();

    // Start simulation (it has an await setTimeout)
    const runPromise = runSimulation([0, 1], 100);

    // isSimulating should be true while running
    expect(isSimulating.value).toBe(true);

    const result = await runPromise;

    expect(gamblingjs.getPartialHandStatsIndexed_7).toHaveBeenCalledWith([0, 1], 100);
    expect(result).toStrictEqual(mockStats);
    expect(simulationResult.value).toStrictEqual(mockStats);
    expect(isSimulating.value).toBe(false);
  });
});
