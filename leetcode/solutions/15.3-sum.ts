/*
 * @lc app=leetcode id=15 lang=typescript
 *
 * [15] 3Sum
 */

// @lc code=start
function threeSum(nums: number[]): number[][] {
  if (nums.length < 3) {
    return [];
  }

  const results = new Map<string, number[]>();

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const restTwo = 0 - num;

    const map = new Map<number, number>();
    for (let j = i + 1; j < nums.length; j++) {
      const item = nums[j];
      const rest = restTwo - item;

      if (map.has(rest)) {
        const result = [num, rest, item].sort();
        const key = result.join(',');
        results.set(key, result);
      }

      map.set(item, j);
    }
  }

  return Array.from(results.values());
};

// @lc code=end

describe('15.3-sum', () => {
  it('solution', () => {
    expect([-1,0,1,2,-1,-4]).toEqual([[-1,-1,2],[-1,0,1]]);
  });

  it('return empty if no num', () => {
    expect([]).toEqual([]);
    expect([0]).toEqual([]);
  });
});

