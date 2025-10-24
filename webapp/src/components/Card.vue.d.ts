interface Props {
    cardIndex: number;
    isSelected?: boolean;
    isFaceDown?: boolean;
    isDisabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    onClick?: (cardIndex: number) => void;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (cardIndex: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((cardIndex: number) => any) | undefined;
}>, {
    onClick: (cardIndex: number) => void;
    isSelected: boolean;
    isFaceDown: boolean;
    isDisabled: boolean;
    size: "small" | "medium" | "large";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
