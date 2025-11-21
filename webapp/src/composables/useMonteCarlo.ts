import { ref, readonly } from 'vue';
import { getPartialHandStatsIndexed_7 } from '@gamblingjs'; // Import from alias

export function useMonteCarlo() {
  const isSimulating = ref(false);
  const simulationResult = ref<any | null>(null); // handCategoryDistribution
  const simulationError = ref<string | null>(null);

  const runSimulation = async (
    partialHand: number[],
    numRuns: number = 1000
  ) => {
    isSimulating.value = true;
    simulationError.value = null;
    simulationResult.value = null;

    try {
        // Since Monte Carlo can be heavy, we should run it in a Worker or just async.
        // For now, we run it directly (blocking UI slightly) or wrap in setTimeout.
        // Ideally: use a Web Worker.
        // Given the constraints, I'll run it directly but wrapped in a promise to allow UI update before start.

        await new Promise(resolve => setTimeout(resolve, 50));

        // Ensure we have enough cards?
        // getPartialHandStatsIndexed_7 expects a partial hand (e.g. 2 cards) and simulates rest?
        // Or 5 cards to 7?
        // Let's assume it takes any number < 7.

        const result = getPartialHandStatsIndexed_7(partialHand, numRuns);
        simulationResult.value = result;
        return result;
    } catch (error: any) {
        simulationError.value = error.message;
        throw error;
    } finally {
        isSimulating.value = false;
    }
  };

  return {
    isSimulating: readonly(isSimulating),
    simulationResult: readonly(simulationResult),
    simulationError: readonly(simulationError),
    runSimulation
  };
}
