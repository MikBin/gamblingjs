interface SimulationResults {
    winProbability: number;
    tieProbability: number;
    lossProbability: number;
    handStrength: number;
    expectedValue: number;
    outs?: number;
    potOdds?: number;
}
interface Props {
    pocketCards: number[];
    communityCards: number[];
    disabled?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    progress: (progress: number) => any;
    complete: (results: SimulationResults) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onProgress?: ((progress: number) => any) | undefined;
    onComplete?: ((results: SimulationResults) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
