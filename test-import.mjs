import * as k from './src/lib/kombinatoricsjs/src/kombinatoricsjs.js';
console.log('Available exports:');
console.log(Object.keys(k));
console.log('multiCombinations:', typeof k.multiCombinations);
console.log('combinations:', typeof k.combinations);
console.log('crossProduct:', typeof k.crossProduct);