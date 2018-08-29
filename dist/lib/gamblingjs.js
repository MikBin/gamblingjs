"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var hashesCreator_1 = require("./hashesCreator");
var hashesCreator_2 = require("./hashesCreator");
var HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
var HASHES_OF_FIVE_ON_SEVEN = hashesCreator_2.createRankOf5On7Hashes(HASHES_OF_FIVE);
//console.log("MAIN:", HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN);
/*
let count = 0;
for (let h in HASHES_OF_FIVE_ON_SEVEN.HASHES) {
  count++;
  if (isNaN(HASHES_OF_FIVE_ON_SEVEN.HASHES[h])) {
    console.log(h, count);
  }
}
*/
exports.fac = function (n) {
    return kombinatoricsJs.factorial(n);
};
/**@TODO yahtzee ,poker dice,yacht,generala ,cheerio*/
//# sourceMappingURL=gamblingjs.js.map