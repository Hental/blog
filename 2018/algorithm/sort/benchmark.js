const { random } = require('faker');
const { benchmark } = require('../utils');
const sort = require('./sort');

const arr = Array.from({ length: 100 * 100 }).map(v => random.number());
const ascArr = [...arr].sort((a, b) => a - b);
const dscArr = [...arr].sort((a, b) => b - a);

const out = v => String(Number(v).toFixed(4)).padStart(8) + 'ms';

(async function main() {
  for (let [name, fn] of Object.entries(sort)) {
    const time = await benchmark([...arr])(fn);
    const bestTime = await benchmark([...ascArr])(fn);
    const worstTime = await benchmark([...dscArr])(fn);
    console.log(`${name.padEnd(6)} sort time: ${out(time)}, best time: ${out(bestTime)}, worst time: ${out(worstTime)}`);
  }
})();
