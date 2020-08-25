/*
 * @lc app=leetcode id=9 lang=typescript
 *
 * [9] Palindrome Number
 */

// @lc code=start
function isPalindrome(x: number): boolean {
  if (x < 0) {
    return false;
  }
  let reverseNumber = 0;
  let remain = x;

  do {
    reverseNumber = reverseNumber * 10 + remain % 10;
    remain = Math.floor(remain / 10);
  } while (remain > 0)

  return reverseNumber === x;
};
// @lc code=end

describe('9.palindrome number', () => {
  it('is palindrome number', () => {
    expect(isPalindrome(121)).toBeTruthy();
    expect(isPalindrome(-121)).toBeFalsy();
    expect(isPalindrome(10)).toBeFalsy();
  });
});
