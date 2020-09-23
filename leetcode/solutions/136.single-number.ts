/*
 * @lc app=leetcode id=136 lang=typescript
 *
 * [136] Single Number
 */

// @lc code=start
function singleNumber(nums: number[]): number {
  if (nums.length === 1) {
    return nums[0];
  }
  const result = nums.reduce((prev, cur) => {
    return prev ^ cur;
  }, 0);
  return result;
};
// @lc code=end

describe('136.single-number', () => {
  it('solution', () => {
    expect(singleNumber([-2, -2, 2])).toBe(2);
    expect(singleNumber([-1])).toBe(-1);
    expect(singleNumber([1])).toBe(1);
    expect(singleNumber([2, 2, 1])).toBe(1);
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
  });
});
