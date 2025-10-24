interface HandRanking {
    rank: number;
    name: string;
    description: string;
}
interface HandStrength {
    percentage: number;
    rank: number;
}
interface DetailedStats {
    highCard: string;
    kickers: string[];
    outs: number;
    drawProbability: number;
}
interface Player {
    name: string;
    hand: string;
    ranking: number;
    winPercentage: number;
    isCurrentPlayer: boolean;
}
interface Comparison {
    players: Player[];
}
interface Props {
    handRanking?: HandRanking | null;
    handStrength?: HandStrength | null;
    detailedStats?: DetailedStats | null;
    comparison?: Comparison | null;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    share: () => any;
    save: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onShare?: (() => any) | undefined;
    onSave?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
