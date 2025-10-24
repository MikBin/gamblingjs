/// <reference types="d:/projects/gamblingjs/webapp/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, onMounted } from 'vue';
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};
onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'poker';
    setTheme(savedTheme);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "min-h-screen bg-base-100" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "navbar bg-base-200 shadow-lg" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container mx-auto px-4" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center justify-between h-16" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center space-x-2" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "w-8 h-8 bg-poker-green rounded-lg flex items-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "text-white font-bold text-sm" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "text-xl font-bold text-base-content hover:text-primary" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "text-xl font-bold text-base-content hover:text-primary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({
    ...{ class: "hidden md:flex space-x-6" },
});
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'home' }) },
}));
const __VLS_7 = __VLS_6({
    to: "/",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'home' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
// @ts-ignore
[$route,];
var __VLS_8;
const __VLS_10 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    to: "/evaluator",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'evaluator' }) },
}));
const __VLS_12 = __VLS_11({
    to: "/evaluator",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'evaluator' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_14 } = __VLS_13.slots;
// @ts-ignore
[$route,];
var __VLS_13;
const __VLS_15 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    to: "/documentation",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'documentation' }) },
}));
const __VLS_17 = __VLS_16({
    to: "/documentation",
    ...{ class: "btn btn-ghost btn-sm" },
    ...{ class: ({ 'btn-active': __VLS_ctx.$route.name === 'documentation' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_19 } = __VLS_18.slots;
// @ts-ignore
[$route,];
var __VLS_18;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center space-x-4" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "dropdown dropdown-end" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    tabindex: "0",
    ...{ class: "btn btn-ghost btn-circle" },
});
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    ...{ class: "h-5 w-5" },
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m6.364 6.364l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
});
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    tabindex: "0",
    ...{ class: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52" },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.setTheme('light');
            // @ts-ignore
            [setTheme,];
        } },
    ...{ class: "btn btn-ghost btn-sm w-full justify-start" },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.setTheme('dark');
            // @ts-ignore
            [setTheme,];
        } },
    ...{ class: "btn btn-ghost btn-sm w-full justify-start" },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.setTheme('poker');
            // @ts-ignore
            [setTheme,];
        } },
    ...{ class: "btn btn-ghost btn-sm w-full justify-start" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "md:hidden" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.toggleMobileMenu) },
    ...{ class: "btn btn-ghost btn-circle" },
});
// @ts-ignore
[toggleMobileMenu,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    ...{ class: "h-5 w-5" },
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M4 6h16M4 12h16M4 18h16",
});
if (__VLS_ctx.mobileMenuOpen) {
    // @ts-ignore
    [mobileMenuOpen,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "md:hidden py-4" },
    });
    const __VLS_20 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleMobileMenu) });
    const { default: __VLS_27 } = __VLS_23.slots;
    // @ts-ignore
    [toggleMobileMenu,];
    var __VLS_23;
    const __VLS_28 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        to: "/evaluator",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        to: "/evaluator",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    const __VLS_34 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleMobileMenu) });
    const { default: __VLS_35 } = __VLS_31.slots;
    // @ts-ignore
    [toggleMobileMenu,];
    var __VLS_31;
    const __VLS_36 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        to: "/documentation",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        to: "/documentation",
        ...{ class: "block py-2 text-base-content hover:text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    const __VLS_42 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleMobileMenu) });
    const { default: __VLS_43 } = __VLS_39.slots;
    // @ts-ignore
    [toggleMobileMenu,];
    var __VLS_39;
}
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "container mx-auto px-4 py-8" },
});
const __VLS_44 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)({
    ...{ class: "footer footer-center p-4 bg-base-200 text-base-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container mx-auto" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex flex-col md:flex-row items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "mb-4 md:mb-0" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "text-sm" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "https://vuejs.org/",
    target: "_blank",
    ...{ class: "text-primary hover:underline" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "https://daisyui.com/",
    target: "_blank",
    ...{ class: "text-primary hover:underline" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "https://gamblingjs.org/",
    target: "_blank",
    ...{ class: "text-primary hover:underline" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex space-x-4" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "https://github.com/your-username/poker-hand-evaluator",
    target: "_blank",
    ...{ class: "text-base-content hover:text-primary" },
});
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    ...{ class: "h-5 w-5" },
    fill: "currentColor",
    viewBox: "0 0 24 24",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.1-.348 1.164-.422 1.485-.845.376-.423.653-.86.726-1.333.036-.175.048-.349.076-.523.077-.874 0-.803-.326-1.532-.898-2.114-.563-.583-1.242-.89-2.114-.89-1.714 0-3.113 1.399-3.113 3.113 0 .629.126 1.231.354 1.779.206.548.473.965.8 1.291.326.326.582.684.8 1.291.218.607.473 1.291.8 1.291.326 0 .548-.218.8-.8 1.291-.326-.607-.473-1.291-.8-1.291-.548 0-1.035.219-1.423.657-.388.438-.657.965-.657 1.423 0 .326.088.629.261.9.657.173.028.326-.088.9-.261.657-.173.574-.218.9-.657.657-.218.438-.657.965 0 .548.219 1.035.657 1.423.438.438.657.965.657 1.423 0 .874-.261 1.713-.8 2.114-.563.583-1.242.89-2.114.89-1.714 0-3.113-1.399-3.113-3.113 0-.629.126-1.231.354-1.779.206-.548.473-.965.8-1.291.326-.326.582-.684.8-1.291.218-.607.473-1.291.8-1.291z",
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-100']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-200']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-poker-green']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-6']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-active']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-active']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-active']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-end']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['menu']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-box']} */ ;
/** @type {__VLS_StyleScopedClasses['w-52']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
