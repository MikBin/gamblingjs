interface Props {
    pocketCards?: number[];
    communityCards?: number[];
    handLabel?: string;
    cardSize?: 'small' | 'medium' | 'large';
    showPocketCards?: boolean;
    showCommunityCards?: boolean;
    hidePocketCards?: boolean;
    revealFrom?: number;
    disabled?: boolean;
    showActions?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    clear: () => any;
    reveal: () => any;
    evaluate: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClear?: (() => any) | undefined;
    onReveal?: (() => any) | undefined;
    onEvaluate?: (() => any) | undefined;
}>, {
    pocketCards: number[];
    communityCards: number[];
    cardSize: "small" | "medium" | "large";
    disabled: boolean;
    handLabel: string;
    showPocketCards: boolean;
    showCommunityCards: boolean;
    hidePocketCards: boolean;
    revealFrom: number;
    showActions: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
