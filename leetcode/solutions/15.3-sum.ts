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

  nums.sort();

  const results: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    const num = nums[i];

    if (num > 0) {
      break;
    }

    if (i > 0 && num === nums[i - 1]) {
      continue;
    }

    const restTwo = 0 - num;

    const map = new Map<number, number>();
    for (let j = i + 1; j < nums.length; j++) {
      const item = nums[j];
      const rest = restTwo - item;

      if (map.has(rest)) {
        const result = [num, rest, item];
        results.push(result);

        while (j < nums.length && nums[j + 1] === num) {
          j++;
        }
      }

      map.set(item, j);
    }
  }

  return results;
};

// @lc code=end

describe('15.3-sum', () => {

  it('exist twice', () => {
    expect([-2, 0, 0, 2, 2]).toEqual([[-2, 0, 2]]);
  });

  it('solution', () => {
    expect([-1,0,1,2,-1,-4]).toEqual([[-1,-1,2],[-1,0,1]]);
  });

  it('return empty if no num', () => {
    expect([]).toEqual([]);
    expect([0]).toEqual([]);
  });
});

