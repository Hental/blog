const { random } = require('faker');
const { benchmark } = require('../utils');
const sort = require('./sort');

const arr = Array.from({ length: 100 * 100 }).map(v => random.number());

(async function main() {
  const test1 = [...arr];
  const test2 = [...arr];

  const time1 = await benchmark(test1)(sort.bubble);
  const time2 = await benchmark(test2)(sort.quick);

  console.log('冒泡排序：', time1);
  console.log('快速排序：', time2);
})();
