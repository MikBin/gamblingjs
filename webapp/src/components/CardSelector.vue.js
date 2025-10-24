/// <reference types="d:/projects/gamblingjs/webapp/node_modules/.vue-global-types/vue_3.3_0.d.ts" />
import { computed, ref, watch } from 'vue';
import Card from './Card.vue';
import { getAvailableCards, validateCardSelection } from '../utils/cardUtils';
const props = withDefaults(defineProps(), {
    title: 'Select Cards',
    description: '',
    modelValue: () => [],
    disabledCards: () => [],
    maxSelection: 7,
    cardSize: 'medium',
    autoValidate: true
});
const emit = defineEmits();
const selectedCards = ref([...props.modelValue]);
const validationError = ref('');
// Compute available cards (excluding disabled and selected)
const availableCards = computed(() => {
    return getAvailableCards([...props.disabledCards, ...selectedCards.value]);
});
// Validate selection
const isValidSelection = computed(() => {
    if (!props.autoValidate)
        return true;
    const validation = validateCardSelection(selectedCards.value);
    validationError.value = validation.error || '';
    return validation.isValid;
});
// Handle card click
const handleCardClick = (cardIndex) => {
    if (props.disabledCards.includes(cardIndex))
        return;
    const index = selectedCards.value.indexOf(cardIndex);
    if (index > -1) {
        // Remove card if already selected
        selectedCards.value.splice(index, 1);
    }
    else if (selectedCards.value.length < props.maxSelection) {
        // Add card if under max selection
        selectedCards.value.push(cardIndex);
    }
    emitUpdate();
};
// Handle card removal from selected cards
const handleCardRemove = (cardIndex) => {
    const index = selectedCards.value.indexOf(cardIndex);
    if (index > -1) {
        selectedCards.value.splice(index, 1);
        emitUpdate();
    }
};
// Clear selection
const clearSelection = () => {
    selectedCards.value = [];
    validationError.value = '';
    emitUpdate();
    emit('clear');
};
// Confirm selection
const confirmSelection = () => {
    if (isValidSelection.value) {
        emit('confirm', [...selectedCards.value]);
    }
};
// Emit update to parent
const emitUpdate = () => {
    emit('update:modelValue', [...selectedCards.value]);
    emit('selection-change', [...selectedCards.value]);
};
// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
    selectedCards.value = [...newValue];
}, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    title: 'Select Cards',
    description: '',
    modelValue: () => [],
    disabledCards: () => [],
    maxSelection: 7,
    cardSize: 'medium',
    autoValidate: true
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
    ...{ class: "card-selector" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "mb-4" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "text-lg font-semibold mb-2" },
});
(__VLS_ctx.title);
// @ts-ignore
[title,];
if (__VLS_ctx.description) {
    // @ts-ignore
    [description,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-sm text-base-content/70 mb-4" },
    });
    (__VLS_ctx.description);
    // @ts-ignore
    [description,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 mb-6" },
});
for (const [cardIndex] of __VLS_getVForSourceType((__VLS_ctx.availableCards))) {
    // @ts-ignore
    [availableCards,];
    /** @type {[typeof Card, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Card, new Card({
        ...{ 'onClick': {} },
        key: (cardIndex),
        cardIndex: (cardIndex),
        isSelected: (__VLS_ctx.selectedCards.includes(cardIndex)),
        isDisabled: (__VLS_ctx.disabledCards.includes(cardIndex)),
        size: (__VLS_ctx.cardSize),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClick': {} },
        key: (cardIndex),
        cardIndex: (cardIndex),
        isSelected: (__VLS_ctx.selectedCards.includes(cardIndex)),
        isDisabled: (__VLS_ctx.disabledCards.includes(cardIndex)),
        size: (__VLS_ctx.cardSize),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ click: {} },
        { onClick: (__VLS_ctx.handleCardClick) });
    // @ts-ignore
    [selectedCards, disabledCards, cardSize, handleCardClick,];
    var __VLS_2;
}
if (__VLS_ctx.selectedCards.length > 0) {
    // @ts-ignore
    [selectedCards,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
        ...{ class: "text-md font-medium mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    for (const [cardIndex] of __VLS_getVForSourceType((__VLS_ctx.selectedCards))) {
        // @ts-ignore
        [selectedCards,];
        /** @type {[typeof Card, ]} */ ;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(Card, new Card({
            ...{ 'onClick': {} },
            key: (`selected-${cardIndex}`),
            cardIndex: (cardIndex),
            isSelected: (true),
            size: (__VLS_ctx.cardSize),
        }));
        const __VLS_8 = __VLS_7({
            ...{ 'onClick': {} },
            key: (`selected-${cardIndex}`),
            cardIndex: (cardIndex),
            isSelected: (true),
            size: (__VLS_ctx.cardSize),
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        let __VLS_10;
        let __VLS_11;
        const __VLS_12 = ({ click: {} },
            { onClick: (__VLS_ctx.handleCardRemove) });
        // @ts-ignore
        [cardSize, handleCardRemove,];
        var __VLS_9;
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex gap-2 mt-4" },
});
if (__VLS_ctx.selectedCards.length > 0) {
    // @ts-ignore
    [selectedCards,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.clearSelection) },
        ...{ class: "btn btn-outline btn-error" },
    });
    // @ts-ignore
    [clearSelection,];
}
if (__VLS_ctx.selectedCards.length > 0) {
    // @ts-ignore
    [selectedCards,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmSelection) },
        ...{ class: "btn btn-primary" },
        disabled: (!__VLS_ctx.isValidSelection),
    });
    // @ts-ignore
    [confirmSelection, isValidSelection,];
    (__VLS_ctx.selectedCards.length);
    // @ts-ignore
    [selectedCards,];
}
if (__VLS_ctx.validationError) {
    // @ts-ignore
    [validationError,];
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
    (__VLS_ctx.validationError);
    // @ts-ignore
    [validationError,];
}
/** @type {__VLS_StyleScopedClasses['card-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content/70']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-13']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-error']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['stroke-current']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {},
});
export default {};
