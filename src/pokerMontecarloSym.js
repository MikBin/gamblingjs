import { shuffle } from './lib/kombinatoricsjs/src/kombinatoricsjs';
import { fullCardsDeckHash_7, handRankingGroupNames, handsRankingDelimiter_5cards, } from './constants';
import { getDiffDeck7 } from './routines';
import { handOfSevenEval } from './pokerEvaluator7';
const DEFAULT_N_RUNS = 10000;
export const categoryByRankingValue = (rank) => {
    let i = 0;
    while (rank > handsRankingDelimiter_5cards[i])
        i++;
    return handRankingGroupNames[i];
};
/** @TODO compute total runs using combinations formula */
export const getPartialHandStatsIndexed_7 = (partialHand, totalRuns = DEFAULT_N_RUNS) => {
    const stats = {
        'high card': 0,
        'one pair': 0,
        'two pair': 0,
        'three of a kind': 0,
        straight: 0,
        flush: 0,
        'full house': 0,
        'four of a kind': 0,
        'straight flush': 0,
        average: 0,
    };
    const pHand = partialHand.map((c) => fullCardsDeckHash_7[c]);
    const partialDeck = getDiffDeck7(pHand);
    const L = partialDeck.length;
    const missingCardsLength = 7 - partialHand.length;
    const fullHand = pHand.slice();
    fullHand.length = 7;
    let totalHandComputed = 0;
    for (let i = 0; i < totalRuns; i++) {
        shuffle(partialDeck);
        let j = 0, t = 0;
        while (j < L) {
            fullHand[pHand.length + t] = partialDeck[j];
            if (t === missingCardsLength) {
                //@ts-ignore
                const rank = handOfSevenEval(...fullHand);
                stats.average += rank;
                stats[categoryByRankingValue(rank)]++;
                t = 0;
                totalHandComputed++;
            }
            else {
                t++;
            }
            j++;
        }
    }
    for (const p in stats) {
        stats[p] /= totalHandComputed;
    }
    return stats;
};
