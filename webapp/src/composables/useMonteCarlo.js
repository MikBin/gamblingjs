import { ref, computed, readonly } from 'vue';
import { getPartialHandStatsIndexed_7 } from '../../../src/pokerMontecarloSym';
export const useMonteCarlo = (options = {}) => {
    const { defaultRuns = 10000, maxRuns = 100000, minRuns = 1000 } = options;
    const isRunning = ref(false);
    const currentRuns = ref(0);
    const totalRuns = ref(defaultRuns);
    const progress = ref(0);
    const lastResult = ref(null);
    const error = ref(null);
    const isValidRunCount = (runs) => {
        return runs >= minRuns && runs <= maxRuns;
    };
    const runSimulation = async (partialHand, runs = totalRuns.value) => {
        if (partialHand.length < 2 || partialHand.length > 6) {
            error.value = `Invalid partial hand size: ${partialHand.length} cards. Must be 2-6 cards.`;
            return null;
        }
        if (!isValidRunCount(runs)) {
            error.value = `Invalid run count: ${runs}. Must be between ${minRuns} and ${maxRuns}.`;
            return null;
        }
        isRunning.value = true;
        currentRuns.value = 0;
        progress.value = 0;
        error.value = null;
        totalRuns.value = runs;
        try {
            // Run simulation in chunks to allow UI updates
            const chunkSize = Math.max(100, Math.floor(runs / 100));
            let completedRuns = 0;
            const result = await new Promise((resolve, reject) => {
                const runChunk = () => {
                    try {
                        const remainingRuns = runs - completedRuns;
                        const currentChunkSize = Math.min(chunkSize, remainingRuns);
                        if (currentChunkSize <= 0) {
                            resolve(getPartialHandStatsIndexed_7(partialHand, runs));
                            return;
                        }
                        // For simplicity, we'll run the full simulation at once
                        // In a real implementation, you might want to implement chunked processing
                        const stats = getPartialHandStatsIndexed_7(partialHand, runs);
                        resolve(stats);
                    }
                    catch (err) {
                        reject(err);
                    }
                };
                // Run immediately for now
                runChunk();
            });
            lastResult.value = result;
            progress.value = 100;
            currentRuns.value = runs;
            return result;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Simulation failed';
            error.value = errorMessage;
            console.error('Monte Carlo simulation error:', err);
            return null;
        }
        finally {
            isRunning.value = false;
        }
    };
    const stopSimulation = () => {
        isRunning.value = false;
        error.value = 'Simulation stopped by user';
    };
    const resetSimulation = () => {
        isRunning.value = false;
        currentRuns.value = 0;
        progress.value = 0;
        lastResult.value = null;
        error.value = null;
    };
    const setTotalRuns = (runs) => {
        if (isValidRunCount(runs)) {
            totalRuns.value = runs;
        }
    };
    return {
        // State
        isRunning: readonly(isRunning),
        currentRuns: readonly(currentRuns),
        totalRuns: readonly(totalRuns),
        progress: readonly(progress),
        lastResult: readonly(lastResult),
        error: readonly(error),
        // Computed
        isValidRunCount: computed(() => (runs) => isValidRunCount(runs)),
        // Actions
        runSimulation,
        stopSimulation,
        resetSimulation,
        setTotalRuns
    };
};
