"use strict";
/**hashes to be created at boot by default!!!! */
Object.defineProperty(exports, "__esModule", { value: true });
var hashesCreator_1 = require("./hashesCreator");
/**HIGH*/
exports.HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
exports.FLUSH_CHECK_FIVE = exports.HASHES_OF_FIVE.FLUSH_CHECK_KEYS;
exports.HASH_RANK_FIVE = exports.HASHES_OF_FIVE.HASHES;
exports.FLUSH_RANK_FIVE = exports.HASHES_OF_FIVE.FLUSH_RANK_HASHES;
/**LOW Ato5*/
exports.HASHES_OF_FIVE_LOW8 = hashesCreator_1.createRankOf5AceToFive_Low8();
exports.HASH_RANK_FIVE_LOW8 = exports.HASHES_OF_FIVE_LOW8.HASHES;
exports.HASHES_OF_FIVE_LOW9 = hashesCreator_1.createRankOf5AceToFive_Low9();
exports.HASH_RANK_FIVE_LOW9 = exports.HASHES_OF_FIVE_LOW9.HASHES;
exports.HASHES_OF_FIVE_LOW_Ato5 = hashesCreator_1.createRankOf5AceToFive_Full();
exports.HASH_RANK_FIVE_LOW_Ato5 = exports.HASHES_OF_FIVE_LOW_Ato5.HASHES;
/**LOW Ato6*/
exports.HASHES_OF_FIVE_Ato6 = hashesCreator_1.createRankOf5AceToSix_Full();
exports.HASH_RANK_FIVE_ATO6 = exports.HASHES_OF_FIVE_Ato6.HASHES;
exports.FLUSH_RANK_FIVE_ATO6 = exports.HASHES_OF_FIVE_Ato6.FLUSH_RANK_HASHES;
//# sourceMappingURL=pokerHashes5.js.map