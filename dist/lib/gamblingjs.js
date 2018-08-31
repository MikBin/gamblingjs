"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hashesCreator_1 = require("./hashesCreator");
var pokerEvaluators_1 = require("./pokerEvaluators");
var HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
var HASHES_OF_FIVE_ON_SEVEN = hashesCreator_1.createRankOf5On7Hashes(HASHES_OF_FIVE);
//console.log("MAIN:", HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN, handOfSevenEvalIndexed(12, 0, 1, 2, 3, 34, 23));
exports.default = pokerEvaluators_1.handOfSevenEvalIndexed;
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio*/
//# sourceMappingURL=gamblingjs.js.map