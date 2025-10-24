/// <reference types="d:/projects/gamblingjs/webapp/node_modules/.vue-global-types/vue_3.3_0.d.ts" />
import { ref, computed, watch } from 'vue';
import { usePokerEvaluator } from '../composables/usePokerEvaluator';
import { useCardSelection } from '../composables/useCardSelection';
import CardSelector from '../components/CardSelector.vue';
import HandDisplay from '../components/HandDisplay.vue';
import MonteCarloSimulator from '../components/MonteCarloSimulator.vue';
import HandRankingDisplay from '../components/HandRankingDisplay.vue';
import { formatCardString, getHandDescription, getHandStrengthPercentage } from '../utils/cardUtils';
// Composables
const cardSelection = useCardSelection();
const pokerEvaluator = usePokerEvaluator();
// State
const gameVariant = ref('texas-holdem');
const playerCount = ref(2);
const evaluationResults = ref(null);
// Computed from composables
const selectedCards = computed(() => cardSelection.allSelectedCards.value);
const pocketCards = computed(() => cardSelection.selectedPocketCards.value);
const communityCards = computed(() => cardSelection.selectedCommunityCards.value);
const hideCards = computed(() => cardSelection.hideCards.value);
const revealFrom = ref(0);
// Computed
const canEvaluate = computed(() => {
    return pocketCards.value.length >= 2 && communityCards.value.length >= 3;
});
// Methods
const handleCardSelection = (cards) => {
    // Update card selection through composable
    cardSelection.clearAllCards();
    cards.forEach(card => {
        if (cardSelection.canSelectPocketCard) {
            cardSelection.selectPocketCard(card);
        }
        else {
            cardSelection.selectCommunityCard(card);
        }
    });
};
const handleCardSelectionConfirm = (cards) => {
    // Split cards into pocket and community based on game variant
    cardSelection.clearAllCards();
    if (gameVariant.value === 'texas-holdem') {
        cards.slice(0, 2).forEach(card => cardSelection.selectPocketCard(card));
        cards.slice(2).forEach(card => cardSelection.selectCommunityCard(card));
    }
    else if (gameVariant.value === 'omaha') {
        cards.slice(0, 4).forEach(card => cardSelection.selectPocketCard(card));
        cards.slice(4).forEach(card => cardSelection.selectCommunityCard(card));
    }
    else {
        // Default to Texas Hold'em for other variants
        cards.slice(0, 2).forEach(card => cardSelection.selectPocketCard(card));
        cards.slice(2).forEach(card => cardSelection.selectCommunityCard(card));
    }
    cardSelection.toggleHideCards();
    evaluationResults.value = null;
};
const handleRevealCards = () => {
    cardSelection.revealCards();
};
const handleClearHand = () => {
    cardSelection.clearAllCards();
    evaluationResults.value = null;
};
const handleEvaluateHand = async () => {
    if (!canEvaluate.value)
        return;
    const allCards = [...pocketCards.value, ...communityCards.value];
    // Use the poker evaluator composable
    const evaluation = await pokerEvaluator.evaluateHand(allCards);
    if (evaluation) {
        const handRank = evaluation.handRank;
        const handStrength = getHandStrengthPercentage(handRank);
        const results = {
            handRanking: {
                rank: handRank,
                name: getHandDescription(handRank),
                description: evaluation.handGroup || 'Poker hand'
            },
            handStrength: {
                percentage: handStrength,
                rank: handRank
            },
            detailedStats: {
                highCard: evaluation.faces || 'Unknown',
                kickers: [],
                outs: 0,
                drawProbability: 0
            },
            comparison: {
                players: [
                    {
                        name: 'You',
                        hand: pocketCards.value.map(c => formatCardString(c)).join(', ') +
                            ' + ' +
                            communityCards.value.map(c => formatCardString(c)).join(', '),
                        ranking: handRank,
                        winPercentage: handStrength,
                        isCurrentPlayer: true
                    }
                ]
            }
        };
        evaluationResults.value = results;
    }
    else {
        console.error('Hand evaluation failed:', pokerEvaluator.error.value);
    }
};
const handleSimulationComplete = (results) => {
    // Update evaluation results with simulation data
    if (evaluationResults.value) {
        evaluationResults.value.detailedStats = {
            ...evaluationResults.value.detailedStats,
            ...results
        };
    }
};
const handleSimulationProgress = (progress) => {
    // Could update a progress indicator in the UI
    console.log('Simulation progress:', progress);
};
const handleShareResults = () => {
    // Implementation would share results to social media
    console.log('Share results');
};
const handleSaveResults = () => {
    // Implementation would save results to local storage or backend
    console.log('Save results');
};
const resetGame = () => {
    cardSelection.clearAllCards();
    evaluationResults.value = null;
};
const randomizeHand = () => {
    // Generate random cards for demonstration
    const allCards = Array.from({ length: 52 }, (_, i) => i);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    // Select 7 random cards (2 pocket + 5 community)
    const randomCards = shuffled.slice(0, 7);
    handleCardSelectionConfirm(randomCards);
};
// Watch for changes in selected cards to update pocket/community cards
watch(selectedCards, (newCards) => {
    if (newCards.length >= 2) {
        // Update pocket cards
        cardSelection.setPocketCards(newCards.slice(0, 2));
        // Update community cards
        cardSelection.setCommunityCards(newCards.slice(2));
    }
}, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "evaluator-view" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container mx-auto px-4 py-8" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lg:col-span-1" },
});
/** @type {[typeof CardSelector, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(CardSelector, new CardSelector({
    ...{ 'onSelectionChange': {} },
    ...{ 'onConfirm': {} },
    title: "Select Your Cards",
    description: "Choose your pocket cards and community cards to evaluate your hand strength.",
    modelValue: (__VLS_ctx.selectedCards),
    maxSelection: (7),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onSelectionChange': {} },
    ...{ 'onConfirm': {} },
    title: "Select Your Cards",
    description: "Choose your pocket cards and community cards to evaluate your hand strength.",
    modelValue: (__VLS_ctx.selectedCards),
    maxSelection: (7),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
const __VLS_5 = ({ selectionChange: {} },
    { onSelectionChange: (__VLS_ctx.handleCardSelection) });
const __VLS_6 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.handleCardSelectionConfirm) });
// @ts-ignore
[selectedCards, handleCardSelection, handleCardSelectionConfirm,];
var __VLS_2;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lg:col-span-1" },
});
/** @type {[typeof HandDisplay, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(HandDisplay, new HandDisplay({
    ...{ 'onReveal': {} },
    ...{ 'onClear': {} },
    ...{ 'onEvaluate': {} },
    pocketCards: ([...__VLS_ctx.pocketCards]),
    communityCards: ([...__VLS_ctx.communityCards]),
    handLabel: "Your Hand",
    hidePocketCards: (__VLS_ctx.hideCards),
    revealFrom: (__VLS_ctx.revealFrom),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onReveal': {} },
    ...{ 'onClear': {} },
    ...{ 'onEvaluate': {} },
    pocketCards: ([...__VLS_ctx.pocketCards]),
    communityCards: ([...__VLS_ctx.communityCards]),
    handLabel: "Your Hand",
    hidePocketCards: (__VLS_ctx.hideCards),
    revealFrom: (__VLS_ctx.revealFrom),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
const __VLS_13 = ({ reveal: {} },
    { onReveal: (__VLS_ctx.handleRevealCards) });
const __VLS_14 = ({ clear: {} },
    { onClear: (__VLS_ctx.handleClearHand) });
const __VLS_15 = ({ evaluate: {} },
    { onEvaluate: (__VLS_ctx.handleEvaluateHand) });
// @ts-ignore
[pocketCards, communityCards, hideCards, revealFrom, handleRevealCards, handleClearHand, handleEvaluateHand,];
var __VLS_10;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lg:col-span-1 space-y-6" },
});
/** @type {[typeof MonteCarloSimulator, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(MonteCarloSimulator, new MonteCarloSimulator({
    ...{ 'onComplete': {} },
    ...{ 'onProgress': {} },
    pocketCards: ([...__VLS_ctx.pocketCards]),
    communityCards: ([...__VLS_ctx.communityCards]),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onComplete': {} },
    ...{ 'onProgress': {} },
    pocketCards: ([...__VLS_ctx.pocketCards]),
    communityCards: ([...__VLS_ctx.communityCards]),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
const __VLS_22 = ({ complete: {} },
    { onComplete: (__VLS_ctx.handleSimulationComplete) });
const __VLS_23 = ({ progress: {} },
    { onProgress: (__VLS_ctx.handleSimulationProgress) });
// @ts-ignore
[pocketCards, communityCards, handleSimulationComplete, handleSimulationProgress,];
var __VLS_19;
if (__VLS_ctx.evaluationResults) {
    // @ts-ignore
    [evaluationResults,];
    /** @type {[typeof HandRankingDisplay, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(HandRankingDisplay, new HandRankingDisplay({
        ...{ 'onShare': {} },
        ...{ 'onSave': {} },
        handRanking: (__VLS_ctx.evaluationResults.handRanking),
        handStrength: (__VLS_ctx.evaluationResults.handStrength),
        detailedStats: (__VLS_ctx.evaluationResults.detailedStats),
        comparison: (__VLS_ctx.evaluationResults.comparison),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onShare': {} },
        ...{ 'onSave': {} },
        handRanking: (__VLS_ctx.evaluationResults.handRanking),
        handStrength: (__VLS_ctx.evaluationResults.handStrength),
        detailedStats: (__VLS_ctx.evaluationResults.detailedStats),
        comparison: (__VLS_ctx.evaluationResults.comparison),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    const __VLS_30 = ({ share: {} },
        { onShare: (__VLS_ctx.handleShareResults) });
    const __VLS_31 = ({ save: {} },
        { onSave: (__VLS_ctx.handleSaveResults) });
    // @ts-ignore
    [evaluationResults, evaluationResults, evaluationResults, evaluationResults, handleShareResults, handleSaveResults,];
    var __VLS_27;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "mt-8 card bg-base-200 rounded-lg shadow-md p-6" },
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
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.gameVariant),
    ...{ class: "select select-bordered" },
});
// @ts-ignore
[gameVariant,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "texas-holdem",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "omaha",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "seven-card-stud",
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
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.playerCount),
    ...{ class: "select select-bordered" },
});
// @ts-ignore
[playerCount,];
for (const [n] of __VLS_getVForSourceType((9))) {
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (n),
        value: (n),
    });
    (n);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex gap-2" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.resetGame) },
    ...{ class: "btn btn-outline" },
});
// @ts-ignore
[resetGame,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.randomizeHand) },
    ...{ class: "btn btn-ghost" },
});
// @ts-ignore
[randomizeHand,];
/** @type {__VLS_StyleScopedClasses['evaluator-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
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
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['select-bordered']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text']} */ ;
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['select-bordered']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
