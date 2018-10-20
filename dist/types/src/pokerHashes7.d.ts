import { gameTypesBool, gameTypesEvalFunction } from './interfaces';
/**make a config file like this:
 *
 * {
 * createOnBoot: {7:{high:true,low8:false....}}
 * }
 *
 * if an HASH is not created on boot clone an empty template
 * during runtime creation use Object.assign(HASH_OF_SEVEN,createRankOf5On7Hashes)
 */
export declare const FAST_HASH_DEFINED: gameTypesBool;
export declare const HASHES_OF_FIVE_ON_SEVEN: any;
export declare const FLUSH_CHECK_SEVEN: any;
export declare const HASH_RANK_SEVEN: any;
export declare const FLUSH_RANK_SEVEN: any;
export declare const HASHES_OF_FIVE_ON_SEVEN_LOWBALL27: any;
export declare const FLUSH_CHECK_SEVEN_LOWBALL27: any;
export declare const HASH_RANK_SEVEN_LOWBALL27: any;
export declare const FLUSH_RANK_SEVEN_LOWBALL27: any;
export declare const HASHES_OF_SEVEN_LOW8: any;
export declare const HASH_RANK_SEVEN_LOW8: any;
export declare const HASHES_OF_SEVEN_LOW9: any;
export declare const HASH_RANK_SEVEN_LOW9: any;
export declare const HASHES_OF_SEVEN_LOW_Ato5: any;
export declare const HASH_RANK_SEVEN_LOW_Ato5: any;
export declare const HASHES_OF_SEVEN_LOW_Ato6: any;
export declare const FLUSH_CHECK_SEVEN_ATO6: any;
export declare const HASH_RANK_SEVEN_ATO6: any;
export declare const FLUSH_RANK_SEVEN_ATO6: any;
export declare const fastHashesCreators: gameTypesEvalFunction;
/**do not export rank of 7 hashes...just export a function wrapper that could return falsy
 * in test files create all hashes
 * function replacement will be in gamblingjs.ts where a big object contains all evaluators (here they can be swapped for the faster one)
 */
