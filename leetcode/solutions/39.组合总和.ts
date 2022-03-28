/*
 * @lc app=leetcode.cn id=39 lang=typescript
 *
 * [39] 组合总和
 */

// @lc code=start
function combinationSum(candidates: number[], target: number): number[][] {
  candidates.sort();
  return helper(candidates, target);
};

function helper(candidates: number[], target: number): number[][] {
  return candidates
    .map((candidate, _idx) => {
      if (candidate === target) {
        return [[candidate]];
      }

      if (candidate > target) {
        return [];
      }

      if (candidate < target) {
        return helper(candidates.slice(_idx), target - candidate)
          .map(list => ([candidate, ...list]));
      }

      return [];
    })
    .reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);
}
// @lc code=end

console.log(combinationSum([2, 3, 5], 8));

