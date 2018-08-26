"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kombinatoricsJs = require("kombinatoricsjs");
var hashesCreator_1 = require("./hashesCreator");
var hashesCreator_2 = require("./hashesCreator");
var HASHES_OF_FIVE = hashesCreator_1.createRankOfFiveHashes();
var HASHES_OF_FIVE_ON_SEVEN = hashesCreator_2.createRankOf5On7Hashes(HASHES_OF_FIVE);
console.log(HASHES_OF_FIVE, HASHES_OF_FIVE_ON_SEVEN);
exports.fac = function (n) {
    return kombinatoricsJs.factorial(n);
};
//# sourceMappingURL=gamblingjs.js.map