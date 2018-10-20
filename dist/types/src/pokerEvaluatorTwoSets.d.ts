import { hiLowRank } from './interfaces';
/** @function bfBestOfFiveFromTwoSets  @TODO make verbose version
 *
 * @param {Array:Number[]} handSetA array of sizeA cards representing hole cards
 * @param {Array:Number[]} handSetB array of sizeB cards representing board cards
 * @param {Number} nA fixed number of cards to draw from handSetA to make up the final 5 cards hand
 * @param {Number} nB fixed number of cards to draw from handSetB to make up the final 5 cards hand
 * @returns {Number} hand ranking ( the best one on all combinations of input card in group of 5)
 */
export declare const bfBestOfFiveFromTwoSets: (handSetA: number[], handSetB: number[], nA: number, nB: number, evalFn?: Function) => number;
export declare const bfBestOfFiveFromTwoSetsHiLow: (handSetA: number[], handSetB: number[], nA: number, nB: number, evalFn: Function) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow8: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow8Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow9: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow9Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => hiLowRank;
export declare const bfBestOfFiveFromTwoSetsHiLow_Ato5: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLow_Ato6: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLow_Ato6Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsHiLow_Ato5Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLowBall27: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
export declare const bfBestOfFiveFromTwoSetsLowBall27Indexed: (handSetA: number[], handSetB: number[], nA: number, nB: number) => number;
