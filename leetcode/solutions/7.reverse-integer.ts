/*
 * @lc app=leetcode id=7 lang=typescript
 *
 * [7] Reverse Integer
 */

// @lc code=start
function reverse(x: number): number {
  const MAX_POSITIVE_INT = 0x7fffffff;
  const MIN_NEGATIVE_INTEGER = -0x80000000;

  const absNumber = Math.abs(x);
  const absNumberStr = String(absNumber);

  let reverseString = '';
  let index = absNumberStr.length - 1;

  while (index >= 0 && reverseString.length === 0) {
    let digest = absNumberStr[index];
    if (digest !== '0') {
      reverseString += digest;
    }
    index -= 1;
  }

  for (; index >= 0; index--) {
    const digest = absNumberStr[index];
    reverseString += digest;
  }

  const reverseNumber = Number(reverseString);
  const returnNumber = x < 0 ? -reverseNumber : reverseNumber;
  return returnNumber > MAX_POSITIVE_INT
    ? 0
    : returnNumber < MIN_NEGATIVE_INTEGER
      ? 0
      : returnNumber;
};
// @lc code=end

describe('7.reverse-integer', () => {
  it('revere number', () => {
    expect(reverse(123)).toBe(321);
    expect(reverse(-123)).toBe(-321);
  });

  it('ignore zero', () => {
    expect(reverse(120)).toBe(21);
    expect(reverse(140200)).toBe(2041);
  });

  it('return zero if over max', () => {
    expect(reverse(1534236469)).toBe(0);
  });
});
