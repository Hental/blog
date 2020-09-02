/*
 * @lc app=leetcode id=41 lang=typescript
 *
 * [41] First Missing Positive
 */

// @lc code=start
function firstMissingPositive(nums: number[]): number {
  const max = nums.length + 1;
  const min = 1;
  const set = new Set<number>();

  for (let index = 0; index < nums.length; index++) {
    const num = nums[index];
    set.add(num);
  }

  for (let j = min; j < max; j++) {
    if (!set.has(j)) {
      return j
    }
  }

  return max;
};
// @lc code=end

describe('41.First Missing Positive', () => {
  it('solution', () => {
    expect(firstMissingPositive([-1,4,2,1,9,10])).toBe(3);
    expect(firstMissingPositive([1, 2, 0])).toBe(3);
    expect(firstMissingPositive([3, 4, -1, 1])).toBe(2);
    expect(firstMissingPositive([7,8,9,11,12])).toBe(1);
  });
});
