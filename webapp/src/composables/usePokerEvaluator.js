import { ref, readonly } from 'vue';
import { FIVE_CARD_POKER_EVAL } from '../../../src/gamblingjs';
export const usePokerEvaluator = (options = {}) => {
    const { evaluationType = 'high' } = options;
    const isEvaluating = ref(false);
    const lastEvaluation = ref(null);
    const error = ref(null);
    // Initialize hash loaders for 7-card evaluations
    const initializeEvaluator = async () => {
        try {
            if (FIVE_CARD_POKER_EVAL.hashLoaders[7][evaluationType]) {
                await FIVE_CARD_POKER_EVAL.hashLoaders[7][evaluationType]();
            }
        }
        catch (err) {
            console.warn('Failed to initialize evaluator:', err);
        }
    };
    const evaluateHand = async (cards) => {
        if (cards.length < 5 || cards.length > 7) {
            error.value = `Invalid hand size: ${cards.length} cards. Must be 5-7 cards.`;
            return null;
        }
        isEvaluating.value = true;
        error.value = null;
        try {
            await initializeEvaluator();
            let evaluator;
            if (cards.length === 5) {
                evaluator = FIVE_CARD_POKER_EVAL.HandRank[5][evaluationType];
            }
            else if (cards.length === 6) {
                evaluator = FIVE_CARD_POKER_EVAL.HandRank[6][evaluationType];
            }
            else {
                evaluator = FIVE_CARD_POKER_EVAL.HandRank[7][evaluationType];
            }
            if (!evaluator) {
                throw new Error(`Evaluator not found for ${cards.length} cards with type ${evaluationType}`);
            }
            const handRank = evaluator(...cards);
            // For verbose evaluation, use the verbose evaluator if available
            let verboseResult = null;
            if (cards.length === 7 && typeof FIVE_CARD_POKER_EVAL.HandRankVerbose[7]?.high === 'function') {
                try {
                    verboseResult = FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high(cards[0], cards[1], cards[2], cards[3], cards[4], cards[5], cards[6]);
                }
                catch (err) {
                    console.warn('Verbose evaluation failed:', err);
                }
            }
            const result = verboseResult || {
                hand: cards,
                faces: '',
                handGroup: '',
                winningCards: [],
                flushSuit: '',
                handRank: typeof handRank === 'number' ? handRank : handRank.hi
            };
            lastEvaluation.value = result;
            return result;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown evaluation error';
            error.value = errorMessage;
            console.error('Poker evaluation error:', err);
            return null;
        }
        finally {
            isEvaluating.value = false;
        }
    };
    const clearEvaluation = () => {
        lastEvaluation.value = null;
        error.value = null;
    };
    return {
        // State
        isEvaluating: readonly(isEvaluating),
        lastEvaluation: readonly(lastEvaluation),
        error: readonly(error),
        // Actions
        evaluateHand,
        clearEvaluation,
        initializeEvaluator
    };
};
