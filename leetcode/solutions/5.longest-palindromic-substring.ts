/*
 * @lc app=leetcode id=5 lang=typescript
 *
 * [5] Longest Palindromic Substring
 */

// @lc code=start
function longestPalindrome(s: string): string {
  const len = s.length;

  if (len <= 1) {
    return s;
  }

  let rightStartIndex;
  let maxPalindromicLen = 0;
  let palindromicStartIndex = -1;

  const findPalindrome = (leftIndex: number, rightIndex: number) => {
    while (leftIndex >= 0 && rightIndex < len && s[leftIndex] === s[rightIndex]) {
      leftIndex -= 1;
      rightIndex += 1;
    }
    const palindromicLen = rightIndex - leftIndex - 1;
    if (palindromicLen > maxPalindromicLen) {
      maxPalindromicLen = palindromicLen;
      palindromicStartIndex = leftIndex + 1;
    }
  }

  for (let index = 1; index < s.length; index++) {
    const char = s[index];

    if (char === s[index - 1]) {
      rightStartIndex = index;
      for (; rightStartIndex < s.length; rightStartIndex++) {
        const nextChar = s[rightStartIndex];
        if (nextChar !== char) {
          rightStartIndex -= 1;
          break;
        }
      }
      if (rightStartIndex >= s.length) {
        rightStartIndex = s.length - 1;
      }
      findPalindrome(index - 1, rightStartIndex);
    } else if (char === s[index - 2]) {
      findPalindrome(index - 2, index);
    }
  }


  return maxPalindromicLen > 0 ? s.substr(palindromicStartIndex, maxPalindromicLen) : s[0];
};

// @lc code=end

describe('5.longestPalindrome', () => {
  it('base', () => {
    expect(longestPalindrome("bb")).toBe("bb");
    expect(longestPalindrome("ababababababa")).toBe("ababababababa");
    expect(longestPalindrome('bananas')).toBe('anana');
    expect(longestPalindrome('abcda')).toBe('a');
    expect(longestPalindrome('babad')).toBe('bab');
    expect(longestPalindrome('babadefeda')).toBe('adefeda');
    expect(longestPalindrome('cbbd')).toBe('bb');
    expect(longestPalindrome('acccccd')).toBe('ccccc');
    expect(longestPalindrome('ecbbadabbcd')).toBe('cbbadabbc');
  });
});
