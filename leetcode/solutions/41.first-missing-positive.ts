/*
 * @lc app=leetcode id=41 lang=typescript
 *
 * [41] First Missing Positive
 */

// @lc code=start
function firstMissingPositive(nums: number[]): number {
  for (let index = 0; index < nums.length; index++) {
    if (nums[index] <= 0) {
      nums[index] = nums.length + 1;
    }
  }

  for (let index = 0; index < nums.length; index++) {
    let val = Math.abs(nums[index]);
    if (val <= nums.length) {
      nums[val - 1] = -Math.abs(nums[val - 1]);
    }
  }

  for (let index = 0; index < nums.length; index++) {
    if (nums[index] > 0) {
      return index + 1;
    }
  }

  return nums.length + 1;
};
// @lc code=end

describe('41.First Missing Positive', () => {
  it('solution', () => {
    expect(firstMissingPositive([1, 2, 0])).toBe(3);
    expect(firstMissingPositive([-1,4,2,1,9,10])).toBe(3);
    expect(firstMissingPositive([3, 4, -1, 1])).toBe(2);
    expect(firstMissingPositive([7,8,9,11,12])).toBe(1);
  });
});
