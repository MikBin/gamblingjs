/// <reference types="d:/projects/gamblingjs/webapp/node_modules/.vue-global-types/vue_3.3_0.d.ts" />
import { computed } from 'vue';
import Card from './Card.vue';
const props = withDefaults(defineProps(), {
    pocketCards: () => [],
    communityCards: () => [],
    handLabel: 'Hero',
    cardSize: 'medium',
    showPocketCards: true,
    showCommunityCards: true,
    hidePocketCards: false,
    revealFrom: 0,
    disabled: false,
    showActions: true
});
const emit = defineEmits();
// Computed properties for action buttons
const canReveal = computed(() => {
    return props.hidePocketCards && props.pocketCards.length > 0;
});
const canClear = computed(() => {
    return props.pocketCards.length > 0 || props.communityCards.length > 0;
});
const canEvaluate = computed(() => {
    return props.pocketCards.length >= 2 && props.communityCards.length >= 3;
});
const canEvaluateNow = computed(() => {
    return props.pocketCards.length >= 2 && props.communityCards.length >= 5;
});
// Action methods
const revealCards = () => {
    emit('reveal');
};
const clearHand = () => {
    emit('clear');
};
const evaluateHand = () => {
    emit('evaluate');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    pocketCards: () => [],
    communityCards: () => [],
    handLabel: 'Hero',
    cardSize: 'medium',
    showPocketCards: true,
    showCommunityCards: true,
    hidePocketCards: false,
    revealFrom: 0,
    disabled: false,
    showActions: true
};
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
    ...{ class: "hand-display" },
});
if (__VLS_ctx.showPocketCards) {
    // @ts-ignore
    [showPocketCards,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "text-lg font-semibold mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex gap-2 justify-center" },
    });
    for (const [card, index] of __VLS_getVForSourceType((__VLS_ctx.pocketCards))) {
        // @ts-ignore
        [pocketCards,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (`pocket-${index}`),
            ...{ class: "relative" },
        });
        /** @type {[typeof Card, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(Card, new Card({
            cardIndex: (card),
            isFaceDown: (__VLS_ctx.hidePocketCards && index >= __VLS_ctx.revealFrom),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }));
        const __VLS_1 = __VLS_0({
            cardIndex: (card),
            isFaceDown: (__VLS_ctx.hidePocketCards && index >= __VLS_ctx.revealFrom),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        // @ts-ignore
        [hidePocketCards, revealFrom, cardSize, disabled,];
        if (index === 0 && __VLS_ctx.pocketCards.length === 2) {
            // @ts-ignore
            [pocketCards,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "absolute -top-2 -right-2 bg-primary text-primary-content rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" },
            });
            (__VLS_ctx.handLabel);
            // @ts-ignore
            [handLabel,];
        }
    }
}
if (__VLS_ctx.showCommunityCards && __VLS_ctx.communityCards.length > 0) {
    // @ts-ignore
    [showCommunityCards, communityCards,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "text-lg font-semibold mb-3" },
    });
    if (__VLS_ctx.communityCards.length >= 3) {
        // @ts-ignore
        [communityCards,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
            ...{ class: "text-md font-medium mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex gap-2 justify-center" },
        });
        for (const [card, index] of __VLS_getVForSourceType((__VLS_ctx.communityCards.slice(0, 3)))) {
            // @ts-ignore
            [communityCards,];
            /** @type {[typeof Card, ]} */ ;
            // @ts-ignore
            const __VLS_4 = __VLS_asFunctionalComponent(Card, new Card({
                key: (`flop-${index}`),
                cardIndex: (card),
                size: (__VLS_ctx.cardSize),
                isDisabled: (__VLS_ctx.disabled),
            }));
            const __VLS_5 = __VLS_4({
                key: (`flop-${index}`),
                cardIndex: (card),
                size: (__VLS_ctx.cardSize),
                isDisabled: (__VLS_ctx.disabled),
            }, ...__VLS_functionalComponentArgsRest(__VLS_4));
            // @ts-ignore
            [cardSize, disabled,];
        }
    }
    if (__VLS_ctx.communityCards.length >= 4) {
        // @ts-ignore
        [communityCards,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
            ...{ class: "text-md font-medium mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex gap-2 justify-center" },
        });
        /** @type {[typeof Card, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(Card, new Card({
            cardIndex: (__VLS_ctx.communityCards[3]),
            key: (`turn`),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }));
        const __VLS_9 = __VLS_8({
            cardIndex: (__VLS_ctx.communityCards[3]),
            key: (`turn`),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        // @ts-ignore
        [cardSize, disabled, communityCards,];
    }
    if (__VLS_ctx.communityCards.length >= 5) {
        // @ts-ignore
        [communityCards,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
            ...{ class: "text-md font-medium mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex gap-2 justify-center" },
        });
        /** @type {[typeof Card, ]} */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(Card, new Card({
            cardIndex: (__VLS_ctx.communityCards[4]),
            key: (`river`),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }));
        const __VLS_13 = __VLS_12({
            cardIndex: (__VLS_ctx.communityCards[4]),
            key: (`river`),
            size: (__VLS_ctx.cardSize),
            isDisabled: (__VLS_ctx.disabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        // @ts-ignore
        [cardSize, disabled, communityCards,];
    }
}
if (__VLS_ctx.showActions) {
    // @ts-ignore
    [showActions,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex gap-2 justify-center mt-6" },
    });
    if (__VLS_ctx.canReveal) {
        // @ts-ignore
        [canReveal,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.revealCards) },
            ...{ class: "btn btn-primary" },
        });
        // @ts-ignore
        [revealCards,];
    }
    if (__VLS_ctx.canClear) {
        // @ts-ignore
        [canClear,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.clearHand) },
            ...{ class: "btn btn-outline" },
        });
        // @ts-ignore
        [clearHand,];
    }
    if (__VLS_ctx.canEvaluate) {
        // @ts-ignore
        [canEvaluate,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.evaluateHand) },
            ...{ class: "btn btn-success" },
            disabled: (!__VLS_ctx.canEvaluateNow),
        });
        // @ts-ignore
        [evaluateHand, canEvaluateNow,];
    }
}
/** @type {__VLS_StyleScopedClasses['hand-display']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-content']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {},
});
export default {};
