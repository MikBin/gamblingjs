import { computed } from 'vue';
import { getCardFromIndex, getCardImagePath, getCardBackPath, formatCardString } from '../utils/cardUtils';
const props = withDefaults(defineProps(), {
    isSelected: false,
    isFaceDown: false,
    isDisabled: false,
    size: 'medium',
    onClick: () => { }
});
const emit = defineEmits();
const cardClasses = computed(() => {
    const classes = ['card-container'];
    if (props.isSelected) {
        classes.push('card-selected');
    }
    if (!props.isDisabled) {
        classes.push('card-hover');
    }
    if (props.size) {
        classes.push(`card-${props.size}`);
    }
    return classes.join(' ');
});
const card = computed(() => getCardFromIndex(props.cardIndex));
const cardImagePath = computed(() => getCardImagePath(props.cardIndex));
const cardBackPath = computed(() => getCardBackPath('blue'));
const cardAriaLabel = computed(() => formatCardString(props.cardIndex));
const cardDescription = computed(() => `${card.value.rank} of ${card.value.suit}`);
const handleClick = () => {
    if (!props.isDisabled) {
        emit('click', props.cardIndex);
        if (props.onClick) {
            props.onClick(props.cardIndex);
        }
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    isSelected: false,
    isFaceDown: false,
    isDisabled: false,
    size: 'medium',
    onClick: () => { }
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
/** @type {__VLS_StyleScopedClasses['card-container']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ onKeydown: (__VLS_ctx.handleClick) },
    ...{ class: (__VLS_ctx.cardClasses) },
    'aria-label': (__VLS_ctx.cardAriaLabel),
    tabindex: (__VLS_ctx.isDisabled ? -1 : 0),
    ...{ class: "card-container" },
});
// @ts-ignore
[handleClick, handleClick, cardClasses, cardAriaLabel, isDisabled,];
if (!__VLS_ctx.isFaceDown) {
    // @ts-ignore
    [isFaceDown,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.cardImagePath),
        alt: (__VLS_ctx.cardDescription),
        loading: "lazy",
        ...{ class: "w-full h-full object-cover rounded-lg" },
    });
    // @ts-ignore
    [cardImagePath, cardDescription,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.cardBackPath),
        alt: "Card back",
        ...{ class: "w-full h-full object-cover rounded-lg" },
    });
    // @ts-ignore
    [cardBackPath,];
}
/** @type {__VLS_StyleScopedClasses['card-container']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
