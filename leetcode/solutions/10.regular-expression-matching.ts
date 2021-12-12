/*
 * @lc app=leetcode id=10 lang=typescript
 *
 * [10] Regular Expression Matching
 */

// @lc code=start
function isMatch(input: string, pattern: string): boolean {
  const dp: boolean[][] = Array.from({ length: input.length + 1 }).map(() => Array(pattern.length + 1).fill(false));

  dp[0][0] = true;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*' && dp[0][i - 1]) {
      dp[0][i + 1] = true;
    }
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      const p = pattern[j];
      const char = input[i];

      if (p === '.' || p === char) {
        dp[i + 1][j + 1] = dp[i][j];
      }

      // like ".*" or "a*"
      if (p === '*') {
        // match empty
        if (pattern[j - 1] !== '.' && pattern[j - 1] !== char) {
          dp[i + 1][j + 1] = dp[i + 1][j - 1];
        } else {
          dp[i + 1][j + 1] = dp[i + 1][j] || dp[i][j + 1] || dp[i + 1][j - 1];
        }
      }
    }
  }

  return !!dp[input.length][pattern.length];
}

// @lc code=end

describe("10.regular-expression-match", () => {
  it("match by char", () => {
    expect(isMatch("aa", "a")).toBeFalsy();
  });

  it('"*" match zero or more preceding element', () => {
    expect(isMatch("", "a*")).toBeTruthy();
    expect(isMatch("aaaab", "a*b")).toBeTruthy();
    expect(isMatch("aaaab", "a*c")).toBeFalsy();
    expect(isMatch("b", "a*b")).toBeTruthy();
  });

  it('"." match any element', () => {
    expect(isMatch("abc", "a.c")).toBeTruthy();
    expect(isMatch("bc", "..")).toBeTruthy();
    expect(isMatch("bc", ".")).toBeFalsy();
  });

  it('use both "." & "*"', () => {
    expect(isMatch("a", "ab*a")).toBeFalsy();
    expect(isMatch("ab", ".*..c*")).toBeTruthy();
    expect(isMatch("a", ".*..a*")).toBeFalsy();
    expect(isMatch("a", "..a*")).toBeFalsy();
    expect(isMatch("a", ".a*")).toBeTruthy();
    expect(isMatch("abcd", "d*")).toBeFalsy();
    expect(isMatch("aaa", "ab*ac*a")).toBeTruthy();
    expect(isMatch("acdaacd", "a.*cd*.")).toBeTruthy();
    expect(isMatch("aab", "c*a*b")).toBeTruthy();
    expect(isMatch("mississippi", "mis*is*ip*.")).toBeTruthy();
    expect(isMatch("mississippi", "mis*is*p*.")).toBeFalsy();
  });
});
