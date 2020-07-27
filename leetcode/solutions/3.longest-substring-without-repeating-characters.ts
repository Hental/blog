/*
 * @lc app=leetcode id=3 lang=typescript
 *
 * [3] Longest Substring Without Repeating Characters
 */

// @lc code=start
function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();
  let maxSize = 0;
  let start = 0;
  for (let i = 0; i < s.length; i += 1) {
    let char = s[i];
    if (map.has(char)) {
      maxSize = Math.max(maxSize, map.size);
      let idx = map.get(char) as number;
      for (let j = start; j <= idx; j += 1) {
        map.delete(s[j]);
      }
      start = idx + 1;
    }
    map.set(char, i);
  }
  maxSize = Math.max(maxSize, map.size);
  return maxSize;
};
// @lc code=end

