import type { Card } from '../types/poker';
export declare const RANKS: string[];
export declare const SUITS: string[];
export declare const SUIT_NAMES: string[];
export declare function getCardFromIndex(index: number): Card;
export declare function getCardImagePath(cardIndex: number, format?: 'png' | 'svg'): string;
export declare function getCardBackPath(color?: 'blue' | 'red' | 'green'): string;
export declare function formatCardString(cardIndex: number): string;
export declare function validateCardSelection(cards: number[]): {
    isValid: boolean;
    error?: string;
};
export declare function getAvailableCards(selectedCards: number[]): number[];
export declare function getHandDescription(rank: number): string;
export declare function getHandStrengthPercentage(rank: number): number;
export declare function getCardColor(cardIndex: number): 'red' | 'black';
export declare function sortCardsByRank(cards: number[]): number[];
export declare function sortCardsBySuit(cards: number[]): number[];
