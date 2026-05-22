import { fileURLToPath } from "url";
import fs from 'fs';
import path from 'path';

// Import creators directly
import { createRankOfFiveHashes, createRankOf5AceToFive_Low8, createRankOf5AceToFive_Low9, createRankOf5AceToFive_Full, createRankOf5AceToSix_Full } from '../src/hashesCreator';
import { rankCards_low, rankCards_low8, rankCards_low9 } from '../src/constants';

import { fastHashesCreators6 } from '../src/pokerHashes6';
import {
  HASHES_OF_FIVE_ON_SIX,
  HASHES_OF_SIX_LOW_Ato5,
  HASHES_OF_SIX_LOW_Ato6,
  HASHES_OF_FIVE_ON_SIX_LOWBALL27,
  HASHES_OF_SIX_LOW8,
  HASHES_OF_SIX_LOW9
} from '../src/pokerHashes6';

import { fastHashesCreators } from '../src/pokerHashes7';
import {
  HASHES_OF_FIVE_ON_SEVEN,
  HASHES_OF_SEVEN_LOW_Ato5,
  HASHES_OF_SEVEN_LOW_Ato6,
  HASHES_OF_FIVE_ON_SEVEN_LOWBALL27,
  HASHES_OF_SEVEN_LOW8,
  HASHES_OF_SEVEN_LOW9
} from '../src/pokerHashes7';

const HASHES_OF_FIVE = createRankOfFiveHashes();
const HASHES_OF_FIVE_LOW8 = createRankOf5AceToFive_Low8();
const HASHES_OF_FIVE_LOW9 = createRankOf5AceToFive_Low9();
const HASHES_OF_FIVE_LOW_Ato5 = createRankOf5AceToFive_Full();
const HASHES_OF_FIVE_Ato6 = createRankOf5AceToSix_Full();

const generateHashes = () => {
  console.log("Generating hashes...");

  fastHashesCreators.high();
  fastHashesCreators.Ato5();
  fastHashesCreators.Ato6();
  fastHashesCreators['2to7']();
  fastHashesCreators.low8();
  fastHashesCreators.low9();

  fastHashesCreators6.high();
  fastHashesCreators6.Ato5();
  fastHashesCreators6.Ato6();
  fastHashesCreators6['2to7']();
  fastHashesCreators6.low8();
  fastHashesCreators6.low9();

  const hashes = {
    7: {
      high: HASHES_OF_FIVE_ON_SEVEN,
      Ato5: HASHES_OF_SEVEN_LOW_Ato5,
      Ato6: HASHES_OF_SEVEN_LOW_Ato6,
      '2to7': HASHES_OF_FIVE_ON_SEVEN_LOWBALL27,
      low8: HASHES_OF_SEVEN_LOW8,
      low9: HASHES_OF_SEVEN_LOW9,
    },
    6: {
      high: HASHES_OF_FIVE_ON_SIX,
      Ato5: HASHES_OF_SIX_LOW_Ato5,
      Ato6: HASHES_OF_SIX_LOW_Ato6,
      '2to7': HASHES_OF_FIVE_ON_SIX_LOWBALL27,
      low8: HASHES_OF_SIX_LOW8,
      low9: HASHES_OF_SIX_LOW9,
    }
  };

  const __dirname = path.dirname(fileURLToPath(import.meta.url)); const outPath = path.resolve(__dirname, "../dist/hashes.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(hashes));
  console.log(`Hashes generated to ${outPath}`);
};

generateHashes();
