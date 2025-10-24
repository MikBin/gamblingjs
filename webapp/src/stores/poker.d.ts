import { GameVariant, EvaluationRecord, verboseHandInfo } from '../types/poker';
export declare const usePokerStore: import("pinia").StoreDefinition<"poker", Pick<{
    gameVariant: import("vue").Ref<GameVariant, GameVariant>;
    pocketCards: import("vue").Ref<number[], number[]>;
    communityCards: import("vue").Ref<number[], number[]>;
    gameStage: import("vue").Ref<"preflop" | "flop" | "turn" | "river", "preflop" | "flop" | "turn" | "river">;
    currentHandRank: import("vue").Ref<number, number>;
    handStrength: import("vue").Ref<number, number>;
    evaluationResult: import("vue").Ref<{
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null, verboseHandInfo | {
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null>;
    evaluationHistory: import("vue").Ref<{
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[], EvaluationRecord[] | {
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[]>;
    allCards: import("vue").ComputedRef<number[]>;
    isHandComplete: import("vue").ComputedRef<boolean>;
    canEvaluate: import("vue").ComputedRef<boolean>;
    setGameVariant: (variant: GameVariant) => void;
    setPocketCards: (cards: number[]) => void;
    setCommunityCards: (cards: number[]) => void;
    addPocketCard: (cardIndex: number) => void;
    addCommunityCard: (cardIndex: number) => void;
    removePocketCard: (index: number) => void;
    removeCommunityCard: (index: number) => void;
    resetHand: () => void;
    setEvaluationResult: (result: verboseHandInfo) => void;
    saveToHistory: (notes?: string) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}, "gameVariant" | "pocketCards" | "communityCards" | "gameStage" | "currentHandRank" | "handStrength" | "evaluationResult" | "evaluationHistory">, Pick<{
    gameVariant: import("vue").Ref<GameVariant, GameVariant>;
    pocketCards: import("vue").Ref<number[], number[]>;
    communityCards: import("vue").Ref<number[], number[]>;
    gameStage: import("vue").Ref<"preflop" | "flop" | "turn" | "river", "preflop" | "flop" | "turn" | "river">;
    currentHandRank: import("vue").Ref<number, number>;
    handStrength: import("vue").Ref<number, number>;
    evaluationResult: import("vue").Ref<{
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null, verboseHandInfo | {
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null>;
    evaluationHistory: import("vue").Ref<{
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[], EvaluationRecord[] | {
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[]>;
    allCards: import("vue").ComputedRef<number[]>;
    isHandComplete: import("vue").ComputedRef<boolean>;
    canEvaluate: import("vue").ComputedRef<boolean>;
    setGameVariant: (variant: GameVariant) => void;
    setPocketCards: (cards: number[]) => void;
    setCommunityCards: (cards: number[]) => void;
    addPocketCard: (cardIndex: number) => void;
    addCommunityCard: (cardIndex: number) => void;
    removePocketCard: (index: number) => void;
    removeCommunityCard: (index: number) => void;
    resetHand: () => void;
    setEvaluationResult: (result: verboseHandInfo) => void;
    saveToHistory: (notes?: string) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}, "allCards" | "isHandComplete" | "canEvaluate">, Pick<{
    gameVariant: import("vue").Ref<GameVariant, GameVariant>;
    pocketCards: import("vue").Ref<number[], number[]>;
    communityCards: import("vue").Ref<number[], number[]>;
    gameStage: import("vue").Ref<"preflop" | "flop" | "turn" | "river", "preflop" | "flop" | "turn" | "river">;
    currentHandRank: import("vue").Ref<number, number>;
    handStrength: import("vue").Ref<number, number>;
    evaluationResult: import("vue").Ref<{
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null, verboseHandInfo | {
        hand: number[];
        faces: string;
        handGroup: string;
        winningCards: (number | string)[];
        flushSuit: string | number;
        handRank: number;
    } | null>;
    evaluationHistory: import("vue").Ref<{
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[], EvaluationRecord[] | {
        id: string;
        timestamp: Date;
        gameVariant: GameVariant;
        pocketCards: number[];
        communityCards: number[];
        result: {
            hand: number[];
            faces: string;
            handGroup: string;
            winningCards: (number | string)[];
            flushSuit: string | number;
            handRank: number;
        };
        notes?: string | undefined;
    }[]>;
    allCards: import("vue").ComputedRef<number[]>;
    isHandComplete: import("vue").ComputedRef<boolean>;
    canEvaluate: import("vue").ComputedRef<boolean>;
    setGameVariant: (variant: GameVariant) => void;
    setPocketCards: (cards: number[]) => void;
    setCommunityCards: (cards: number[]) => void;
    addPocketCard: (cardIndex: number) => void;
    addCommunityCard: (cardIndex: number) => void;
    removePocketCard: (index: number) => void;
    removeCommunityCard: (index: number) => void;
    resetHand: () => void;
    setEvaluationResult: (result: verboseHandInfo) => void;
    saveToHistory: (notes?: string) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}, "setGameVariant" | "setPocketCards" | "setCommunityCards" | "addPocketCard" | "addCommunityCard" | "removePocketCard" | "removeCommunityCard" | "resetHand" | "setEvaluationResult" | "saveToHistory" | "removeFromHistory" | "clearHistory">>;
