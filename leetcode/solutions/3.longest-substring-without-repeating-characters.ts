/*
 * @lc app=leetcode id=3 lang=typescript
 *
 * [3] Longest Substring Without Repeating Characters
 */

// @lc code=start
function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();

  let maxSize = -1;
  let start = 0;

  for (let i = 0; i < s.length; i += 1) {
    let char = s[i];
    let charPrevIndex = map.get(char);

    if (charPrevIndex !== undefined && charPrevIndex >= start) {
      maxSize = Math.max(maxSize, i - start);
      let idx = map.get(char) as number;
      start = idx + 1;
    }

    map.set(char, i);
  }

  return Math.max(maxSize, s.length - start);
};
// @lc code=end

describe('3.3.longest-substring-without-repeating-characters', () => {
  it('solution', () => {
    expect(lengthOfLongestSubstring('abba')).toBe(2);
    expect(lengthOfLongestSubstring('aab')).toBe(2);
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
    expect(lengthOfLongestSubstring(' ')).toBe(1);
  });
});
