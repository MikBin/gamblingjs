import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
// State
const simulationCount = ref(1000);
const opponentCount = ref(2);
const isRunning = ref(false);
const progress = ref(0);
const currentSimulation = ref(0);
const results = ref(null);
const error = ref('');
// Computed
const canRun = computed(() => {
    return props.pocketCards.length >= 2 && props.communityCards.length >= 3;
});
// Methods
const runSimulation = async () => {
    if (!canRun.value)
        return;
    isRunning.value = true;
    progress.value = 0;
    currentSimulation.value = 0;
    error.value = '';
    try {
        // Simulate Monte Carlo in chunks for UI responsiveness
        const chunkSize = 100;
        let wins = 0;
        let ties = 0;
        let losses = 0;
        for (let i = 0; i < simulationCount.value; i += chunkSize) {
            const currentChunkSize = Math.min(chunkSize, simulationCount.value - i);
            // Simulate this chunk
            for (let j = 0; j < currentChunkSize; j++) {
                const result = simulateSingleGame();
                if (result === 'win')
                    wins++;
                else if (result === 'tie')
                    ties++;
                else
                    losses++;
            }
            currentSimulation.value = i + currentChunkSize;
            progress.value = (currentSimulation.value / simulationCount.value) * 100;
            // Allow UI to update
            if (i % (chunkSize * 5) === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        // Calculate results
        const total = wins + ties + losses;
        results.value = {
            winProbability: wins / total,
            tieProbability: ties / total,
            lossProbability: losses / total,
            handStrength: calculateHandStrength(),
            expectedValue: calculateExpectedValue(wins, ties, losses),
            outs: calculateOuts(),
            potOdds: calculatePotOdds()
        };
        emit('complete', results.value);
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    }
    finally {
        isRunning.value = false;
    }
};
const stopSimulation = () => {
    isRunning.value = false;
};
const resetResults = () => {
    results.value = null;
    error.value = '';
    progress.value = 0;
    currentSimulation.value = 0;
};
// Helper methods (simplified for demo)
const simulateSingleGame = () => {
    // This would integrate with the actual gamblingjs library
    // For now, return random results for demonstration
    const random = Math.random();
    if (random < 0.4)
        return 'win';
    if (random < 0.6)
        return 'tie';
    return 'loss';
};
const calculateHandStrength = () => {
    // Simplified calculation - would use gamblingjs library
    return Math.random() * 100;
};
const calculateExpectedValue = (wins, ties, losses) => {
    // Simplified EV calculation
    return (wins - losses) / (wins + ties + losses);
};
const calculateOuts = () => {
    // Simplified outs calculation
    return Math.floor(Math.random() * 15);
};
const calculatePotOdds = () => {
    // Simplified pot odds
    return Math.random() * 5 + 1;
};
const getHandStrengthDescription = (strength) => {
    if (strength >= 90)
        return 'Monster';
    if (strength >= 75)
        return 'Very Strong';
    if (strength >= 60)
        return 'Strong';
    if (strength >= 45)
        return 'Above Average';
    if (strength >= 30)
        return 'Average';
    if (strength >= 15)
        return 'Below Average';
    return 'Very Weak';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "monte-carlo-simulator" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card bg-base-200 rounded-lg shadow-md p-6" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "text-lg font-semibold mb-4" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-control" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label-text" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label-text-alt" },
});
(__VLS_ctx.simulationCount.toLocaleString());
// @ts-ignore
[simulationCount,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "range",
    min: "100",
    max: "10000",
    step: "100",
    ...{ class: "range" },
});
(__VLS_ctx.simulationCount);
// @ts-ignore
[simulationCount,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex justify-between text-xs text-base-content/70 mt-1" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-control" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label-text" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label-text-alt" },
});
(__VLS_ctx.opponentCount);
// @ts-ignore
[opponentCount,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "range",
    min: "1",
    max: "9",
    step: "1",
    ...{ class: "range" },
});
(__VLS_ctx.opponentCount);
// @ts-ignore
[opponentCount,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex justify-between text-xs text-base-content/70 mt-1" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex gap-2 mb-6" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.runSimulation) },
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.isRunning || !__VLS_ctx.canRun),
});
// @ts-ignore
[runSimulation, isRunning, canRun,];
if (!__VLS_ctx.isRunning) {
    // @ts-ignore
    [isRunning,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "loading loading-spinner" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.stopSimulation) },
    ...{ class: "btn btn-outline" },
    disabled: (!__VLS_ctx.isRunning),
});
// @ts-ignore
[isRunning, stopSimulation,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.resetResults) },
    ...{ class: "btn btn-ghost" },
    disabled: (__VLS_ctx.isRunning),
});
// @ts-ignore
[isRunning, resetResults,];
if (__VLS_ctx.isRunning) {
    // @ts-ignore
    [isRunning,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "w-full bg-base-300 rounded-full h-2.5" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "bg-primary h-2.5 rounded-full transition-all duration-300" },
        ...{ style: ({ width: `${__VLS_ctx.progress}%` }) },
    });
    // @ts-ignore
    [progress,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-center text-sm text-base-content/70 mt-1" },
    });
    (__VLS_ctx.progress.toFixed(1));
    (__VLS_ctx.currentSimulation);
    (__VLS_ctx.simulationCount);
    // @ts-ignore
    [simulationCount, progress, currentSimulation,];
}
if (__VLS_ctx.results && !__VLS_ctx.isRunning) {
    // @ts-ignore
    [isRunning, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
        ...{ class: "text-md font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stats-grid" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-value" },
    });
    ((__VLS_ctx.results.winProbability * 100).toFixed(2));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar-fill bg-success" },
        ...{ style: ({ width: `${__VLS_ctx.results.winProbability * 100}%` }) },
    });
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-value" },
    });
    ((__VLS_ctx.results.tieProbability * 100).toFixed(2));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar-fill bg-warning" },
        ...{ style: ({ width: `${__VLS_ctx.results.tieProbability * 100}%` }) },
    });
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-value" },
    });
    ((__VLS_ctx.results.lossProbability * 100).toFixed(2));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-bar-fill bg-error" },
        ...{ style: ({ width: `${__VLS_ctx.results.lossProbability * 100}%` }) },
    });
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stats-grid" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-value" },
    });
    (__VLS_ctx.results.handStrength);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-desc" },
    });
    (__VLS_ctx.getHandStrengthDescription(__VLS_ctx.results.handStrength));
    // @ts-ignore
    [results, getHandStrengthDescription,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-value" },
    });
    (__VLS_ctx.results.expectedValue.toFixed(3));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "stat-desc" },
    });
    if (__VLS_ctx.results.outs) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stats-grid" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-card" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-value" },
        });
        (__VLS_ctx.results.outs);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-desc" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-card" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-value" },
        });
        (__VLS_ctx.results?.potOdds?.toFixed(2));
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "stat-desc" },
        });
    }
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "alert alert-error mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        ...{ class: "stroke-current shrink-0 h-6 w-6" },
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m6 4a9 9 0 11-18 0 9 9 0 0118 0z",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
/** @type {__VLS_StyleScopedClasses['monte-carlo-simulator']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['range']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content/70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['range']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content/70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content/70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-success']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-error']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['stroke-current']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
