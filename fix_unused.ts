import fs from 'fs';

let content = fs.readFileSync('poker-sym/src/simulation/razz-montecarlo.ts', 'utf8');
content = content.replace(/      let isWin = true;\n      let isTie = false;\n/g, '');
fs.writeFileSync('poker-sym/src/simulation/razz-montecarlo.ts', content);
