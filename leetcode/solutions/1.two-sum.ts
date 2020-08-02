/*
 * @lc app=leetcode id=1 lang=typescript
 *
 * [1] Two Sum
 */

// @lc code=start
function twoSum(nums: number[], target: number): number[] {
  let map = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    let num = nums[i];
    let rest = target - num;
    if (map.has(rest)) {
      return [map.get(rest) as number, i];
    }
    map.set(num, i);
  }
  throw new Error("can't find match numbers");
}
// @lc code=end

describe("1.two sum", () => {
  it("find match target value in array", () => {
    const result = twoSum([2, 7, 11, 15], 9);
    const expectResult = [0, 1];
    expect(result).toEqual(expectResult);
  });
});
