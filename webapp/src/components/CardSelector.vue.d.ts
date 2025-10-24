interface Props {
    title?: string;
    description?: string;
    modelValue?: number[];
    disabledCards?: number[];
    maxSelection?: number;
    cardSize?: 'small' | 'medium' | 'large';
    autoValidate?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (cards: number[]) => any;
    "selection-change": (cards: number[]) => any;
    confirm: (cards: number[]) => any;
    clear: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((cards: number[]) => any) | undefined;
    "onSelection-change"?: ((cards: number[]) => any) | undefined;
    onConfirm?: ((cards: number[]) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    title: string;
    description: string;
    modelValue: number[];
    disabledCards: number[];
    maxSelection: number;
    cardSize: "small" | "medium" | "large";
    autoValidate: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
