/*
 * @lc app=leetcode id=70 lang=typescript
 *
 * [70] Climbing Stairs
 */

// @lc code=start
function climbStairs(n: number): number {
  const dp: number[] = Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i < dp.length; i++) {
    dp[i] = dp[i - 2] + dp[i- 1];
  }

  return dp[n];
};
// @lc code=end

describe('70.climbing-stars', () => {
  it('base', () => {
    expect(climbStairs(4)).toBe(5);
    expect(climbStairs(3)).toBe(3);
    expect(climbStairs(2)).toBe(2);
  });
});
