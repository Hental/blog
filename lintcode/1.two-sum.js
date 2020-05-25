/*
 * @lc app=leetcode id=1 lang=javascript
 *
 * [1] Two Sum
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let map = {};

    for (let i = 0; i < nums.length; i += 1) {
      let num = nums[i];
      let rest = target - num;
      if (rest in map) {
        return [map[rest], i];
      }
      map[num] = i;
    }
};
// @lc code=end

if (__filename === process.argv[1]) {
  const assert = require('assert');
  const result = twoSum([2, 7, 11, 15], 9);
  const expect = [0, 1];
  assert(result[0] === expect[0]);
  assert(result[1] === expect[1]);
}
