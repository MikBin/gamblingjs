import * as kombinatoricsJs from './lib/kombinatoricsjs/src/kombinatoricsjs';
import * as CONSTANTS from './constants';
/** rename in getDeckWithHandCardsRemoved */
export const getDiffDeck5 = (listOfHands) => {
    return CONSTANTS.fullCardsDeckHash_5.slice().filter((c) => !listOfHands.includes(c));
};
export const getDiffDeck7 = (listOfHands) => {
    return CONSTANTS.fullCardsDeckHash_7.slice().filter((c) => !listOfHands.includes(c));
};
export const atLeastFiveEqual = (list) => {
    return list.filter((v) => {
        const l = v.length;
        let c = 0, i = 1;
        while (i < l) {
            if (v[i] == v[i - 1]) {
                c++;
            }
            else {
                c = 0;
            }
            i++;
            if (c == 4)
                break;
        }
        return c >= 4;
    });
};
export const getVectorSum = (v) => {
    const l = v.length;
    let s = 0;
    for (let i = 0; i < l; i++) {
        s += v[i];
    }
    return s;
};
export const getFlushSuit7 = (v) => {
    if (v.length != 7) {
        return -1;
    }
    let t = v[0];
    let c = 0;
    let i = 1;
    while (i < 7) {
        if (t !== v[i]) {
            t = v[i];
            c = 0;
        }
        else {
            c++;
        }
        i++;
        /* istanbul ignore if  */
        if (c === 4)
            break;
    }
    return t;
};
export const checkStraight5on7 = (arr) => {
    if (arr.length != 7) {
        return false;
    }
    let c = 0;
    if (arr[arr.length - 1] === 12 &&
        arr[0] === 0 &&
        arr.includes(1) &&
        arr.includes(2) &&
        arr.includes(3)) {
        return true;
    }
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i - 1] + 1 === arr[i]) {
            c++;
        }
        else {
            c = 0;
        }
        /* istanbul ignore if  */
        if (c === 4)
            break;
    }
    return c >= 4;
};
export const singlePairsList = (startSet) => {
    const toAdd = kombinatoricsJs.multiCombinations(startSet, 3, 1);
    const singlePairs = [];
    for (let i = 0; i < startSet.length; ++i) {
        for (let j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                singlePairs.push([startSet[i], startSet[i], ...toAdd[j]]);
            }
        }
    }
    return singlePairs;
};
export const internalDoublePairsSort = (a, b) => {
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    if (a[1] < b[1])
        return -1;
    if (a[1] > b[1])
        return 1;
    return 0;
};
export const sortedPairsToAdd = (startSet) => {
    const _toAdd = kombinatoricsJs.multiCombinations(startSet, 2, 1);
    _toAdd.forEach((pair) => {
        /* istanbul ignore next */
        if (pair[0] < pair[1]) {
            [pair[0], pair[1]] = [pair[1], pair[0]];
        }
    });
    _toAdd.sort(internalDoublePairsSort);
    return _toAdd;
};
export const doublePairsList = (startSet, isLow = false) => {
    const toAdd = isLow
        ? kombinatoricsJs.multiCombinations(startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    const doublePairs = [];
    for (let j = 0; j < toAdd.length; ++j) {
        for (let i = 0; i < startSet.length; ++i) {
            if (!toAdd[j].includes(startSet[i])) {
                doublePairs.push([toAdd[j][0], toAdd[j][0], toAdd[j][1], toAdd[j][1], startSet[i]]);
            }
        }
    }
    return doublePairs;
};
export const trisList = (startSet, isLow = false) => {
    const toAdd = isLow
        ? kombinatoricsJs.multiCombinations(startSet, 2, 1)
        : sortedPairsToAdd(startSet);
    const tris = [];
    for (let i = 0; i < startSet.length; ++i) {
        for (let j = 0; j < toAdd.length; ++j) {
            if (!toAdd[j].includes(startSet[i])) {
                tris.push([startSet[i], startSet[i], startSet[i], ...toAdd[j]]);
            }
        }
    }
    return tris;
};
export const fullHouseList = (startSet) => {
    const fullHouses = kombinatoricsJs.crossProduct(startSet, 2).filter((p) => p[0] !== p[1]);
    return fullHouses.map((hand, idx) => {
        return [hand[0], hand[0], hand[0], hand[1], hand[1]];
    });
};
export const quadsList = (startSet) => {
    const quads = kombinatoricsJs.crossProduct(startSet, 2).filter((p) => p[0] !== p[1]);
    return quads.map((hand) => {
        return [hand[0], hand[0], hand[0], hand[0], hand[1]];
    });
};
export const checkStraight = (arr) => {
    let cond = true;
    if (arr[4] === 12 && arr[0] === 0) {
        return arr[1] === 1 && arr[2] === 2 && arr[3] === 3;
    }
    if (arr[4] === 12 && arr[0] === 3) {
        return arr[1] === 2 && arr[2] === 1 && arr[3] === 0;
    }
    /* if (arr[4] === 12 && arr[0] === 11) {
       return arr[1] === 10 && arr[2] === 9 && arr[3] === 8;
     }*/
    for (let i = 1; i < arr.length; ++i) {
        cond = cond && Math.abs(arr[i - 1] - arr[i]) === 1;
    }
    return cond;
};
export const checkDoublePair = (hand) => {
    /* istanbul ignore next */
    return ((hand[0] === hand[1] && hand[2] === hand[3] && hand[3] !== hand[4] && hand[1] !== hand[4]) ||
        (hand[0] === hand[1] && hand[3] === hand[4] && hand[3] !== hand[2] && hand[1] !== hand[2]) ||
        (hand[1] === hand[2] && hand[3] === hand[4] && hand[3] !== hand[0] && hand[2] !== hand[0]));
};
export const removeStraights = (list) => {
    return list.filter((hand, idx) => {
        return !checkStraight(hand);
    });
};
export const _rankOfHand = (hand, rankHash) => {
    return rankHash[getVectorSum(hand)];
};
export const _rankOf5onX = (hand, rankHash, INVERTED = false) => {
    const comb = kombinatoricsJs.combinations(hand, 5);
    let max = 0;
    comb.forEach((h) => {
        const s = getVectorSum(h);
        let r = rankHash[s];
        INVERTED ? (r = CONSTANTS.HIGH_MAX_RANK - r) : null;
        max = max < r ? r : max;
    });
    return max;
};
/**
 * @function filterWinningCards
 * @param {Array} fullHand array of indexes in deck of cards 0..51 (more than 5 cards)
 * @param {Array} winningRanks array of 5 cards indexes
 * @return {Array} only cards of winning hand
 * @TODO add flushKey? ... in case a flush filtering is necessary ---> better to do it before this using another filer
 */
export const filterWinningCards = (fullHand, winningRanks) => {
    const winning = {};
    winningRanks.forEach((c) => {
        !winning[c] ? (winning[c] = 1) : winning[c]++;
    });
    const full = [];
    fullHand.forEach((card) => {
        if (winning[card % 13] > 0) {
            winning[card % 13]--;
            full.push(card);
        }
    });
    return full;
};
/**
 * @function getFlushSuitFromIndex
 * @param {number} card index in deck 0...51
 * @return {string} only cards of winning hand
 */
export const getFlushSuitFromIndex = (c) => {
    return CONSTANTS.flushIndexToName[~~(c / 13)];
};
/**
 * @function handToCardsSymbols
 * @param {Array} hand array of indexes in deck of cards 0..51
 * @return {Array} char face symbols representation of the indexed hand
 */
export const handToCardsSymbols = (hand) => {
    return hand.map((c) => CONSTANTS.rankToFaceSymbol[c % 13]).join('');
};
export const handRankToGroup = (rank, groupsRanking = CONSTANTS.handsRankingDelimiter_5cards, groupNameMap = CONSTANTS.handRankingGroupNames) => {
    let i = 0;
    let groupName = groupNameMap[i];
    while (rank > groupsRanking[i]) {
        i++;
        groupName = groupNameMap[i];
    }
    return groupName;
};
export const fillRank5Ato5 = (h, idx, rankingObject) => {
    const hash = getVectorSum(h.map((card) => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, CONSTANTS.handsRankingDelimiter_Ato5_5cards, CONSTANTS.handRankingGroupNames_Ato5),
    };
    return rankingObject;
};
export const fillRank5 = (h, idx, rankingObject, groupsRanking = CONSTANTS.handsRankingDelimiter_5cards, groupNameMap = CONSTANTS.handRankingGroupNames) => {
    const hash = getVectorSum(h.map((card) => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx, groupsRanking, groupNameMap),
    };
    return rankingObject;
};
export const fillRank5_ato5 = (h, idx, rankingObject) => {
    const hash = getVectorSum(h.map((card) => rankingObject.baseRankValues[card]));
    rankingObject.HASHES[hash] = idx;
    rankingObject.rankingInfos[idx] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(idx),
    };
    return rankingObject;
};
export const fillRank5PlusFlushes = (h, idx, rankingObject, offset = CONSTANTS.FLUSHES_BASE_START + CONSTANTS.HIGH_CARDS_5_AMOUNT) => {
    const hash = getVectorSum(h.map((card) => rankingObject.baseRankValues[card]));
    const r = idx + offset;
    rankingObject.HASHES[hash] = r;
    rankingObject.rankingInfos[r] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(r),
    };
    return rankingObject;
};
export const fillRankFlushes = (h, rankingObject) => {
    const hash = getVectorSum(h.map((card) => rankingObject.baseRankValues[card]));
    const rank = rankingObject.HASHES[hash] + CONSTANTS.FLUSHES_BASE_START;
    rankingObject.FLUSH_RANK_HASHES[hash] = rank;
    rankingObject.rankingInfos[rank] = {
        hand: h.slice(),
        faces: handToCardsSymbols(h),
        handGroup: handRankToGroup(rank),
    };
    return rankingObject;
};
export const allTwoCardsHands = () => {
    const allRanksOff = kombinatoricsJs.multiCombinations(CONSTANTS.ranksHashOn7.map((r) => r << 9), 2, 2);
    for (let i = 0; i < allRanksOff.length; i++)
        allRanksOff[i][1]++; //settings different suit for the second rank
    const allRanksSuited = kombinatoricsJs.multiCombinations(CONSTANTS.ranksHashOn7.map((r) => r << 9), 2, 1); //all spades
    console.log('all ranks test', allRanksOff.length, allRanksSuited.length);
};
export const allThreeCardsHands = () => { };
const fourCardSuitsTemplates = {
    '1111': [[0, 13, 26, 39]],
    '211': [
        [13, 26, 0, 0],
        [13, 0, 26, 0],
        [13, 0, 0, 26],
        [0, 13, 26, 0],
        [0, 13, 0, 26],
        [0, 0, 13, 26],
    ],
    '22': [
        [13, 13, 0, 0],
        [13, 0, 13, 0],
        [13, 0, 0, 13],
        [0, 13, 13, 0],
        [0, 13, 0, 13],
        [0, 0, 13, 13],
    ],
    '31': [[13, 0, 0, 0]],
    '4': [[0, 0, 0, 0]],
};
const canApplySuitTemplate = (hand, template) => {
    const l = hand.length;
    for (let i = 1; i < l; i++) {
        if (hand[i] === hand[i - 1] && template[i] === template[i - 1])
            return false;
    }
    return true;
};
const applySuitTemplate = (hand, template) => {
    return hand.map((c, i) => {
        return c + template[i];
    });
};
export const allFourCardsHands = () => {
    const shiftedRanks = new Array(13).fill(0).map((v, i) => i);
    const ALL = kombinatoricsJs
        .multiCombinations(shiftedRanks, 4, 4)
        .map((hand) => hand.sort());
    const noReps = kombinatoricsJs.multiCombinations(shiftedRanks, 4, 1);
    const twoPairs = kombinatoricsJs
        .multiCombinations(shiftedRanks, 2, 1)
        .map((c) => [c[0], c[0], c[1], c[1]]);
    const tempOnePair = kombinatoricsJs.multiCombinations(shiftedRanks, 3, 1);
    const onePair = tempOnePair
        .map((c) => [c[0], c[0], c[1], c[2]])
        .concat(tempOnePair.map((c) => [c[1], c[1], c[0], c[2]]), tempOnePair.map((c) => [c[2], c[2], c[0], c[1]]));
    //pair is always the firs two cards
    const tempTriple = kombinatoricsJs.multiCombinations(shiftedRanks, 2, 1);
    const triple = tempTriple
        .map((c) => [c[0], c[0], c[0], c[1]])
        .concat(tempTriple.map((c) => [c[1], c[1], c[1], c[0]]));
    //apply rainbow to quadruple as is the only one possibile
    console.log('counting 4 card hands', noReps.length, twoPairs.length, onePair.length, triple.length);
    //apply 1111 to all
    //211 to no reps pairs  twopairs and triple
    //22 to noreps pairs and two pairs
    //31 to noreps and pairs
    const rainbowTemplate = [0, 13, 26, 39];
    const quadruple = shiftedRanks
        .map((c) => [c, c, c, c])
        .map((hand) => applySuitTemplate(hand, rainbowTemplate));
    const rainbowsHands = ALL.map((hand) => applySuitTemplate(hand, rainbowTemplate));
    const singleSuited = fourCardSuitsTemplates['211']
        .map((template) => noReps.map((hand) => applySuitTemplate(hand, template)))
        .flat()
        .concat(twoPairs.map((hand) => applySuitTemplate(hand, [13, 0, 0, 26])), [
        [13, 26, 0, 0],
        [13, 0, 26, 0],
        [13, 0, 0, 26],
    ].map((template) => onePair.map((hand) => applySuitTemplate(hand, template)).flat()));
    const doubleSuited = twoPairs
        .map((hand) => applySuitTemplate(hand, [13, 0, 13, 0]))
        .concat(noReps.map((hand) => applySuitTemplate(hand, [13, 0, 13, 0])), noReps.map((hand) => applySuitTemplate(hand, [13, 13, 0, 0])), onePair.map((hand) => applySuitTemplate(hand, [13, 0, 13, 0])));
    /**@TODO return organized by rank as well? */
    console.log(rainbowsHands.length, singleSuited.length, doubleSuited.length);
    return { rainbowsHands, singleSuited, doubleSuited };
    /**@TODO add more info to starting hand:
     * {hand[1,2,3,4],
     * suits[0,1,2,3] or [0,0,1,1]
     * type:'pair'|'dpair'|'nopair'}
     */
    /**@TODO filter for those having at least two cards<9 to get hands suitable for low too
     * and filter for those hands with no low potential
     */
    /**@TOOD why care of quadruple and triple? as are very bad hands?
     * same reasoning for 3 suits and 4 suits....just bad hands....
     */
};
//console.log("permmutation repetition", kombinatoricsJs.permutationsMultiSets([13, 13, 0, 0]));
allTwoCardsHands();
allFourCardsHands();
