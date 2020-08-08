/*
 * @lc app=leetcode id=8 lang=typescript
 *
 * [8] String to Integer (atoi)
 */

// @lc code=start
function myAtoi(str: string): number {
  const MAX_POSITIVE_INT = 0x7fffffff;
  const MIN_NEGATIVE_INTEGER = -0x80000000;

  const pattern = /^\s*([+-\d])(\d*)/;
  const result = str.match(pattern);
  if (!result) {
    return 0;
  }
  const [_, sign, num] = result;
  const matchNumber = sign === '-'
    ? -Number(num)
    : sign === '+'
      ? Number(num)
      : Number(sign + num);

  return Math.min(MAX_POSITIVE_INT, Math.max(matchNumber, MIN_NEGATIVE_INTEGER));
};
// @lc code=end

describe('8.atoi', () => {
  it('find numerical', () => {
    expect(myAtoi('  2402')).toBe(2402);
    expect(myAtoi('2402')).toBe(2402);
    expect(myAtoi('2402with some words')).toBe(2402);
    expect(myAtoi('2402  ')).toBe(2402);
  });

  it('return zero if not find numerical', () => {
    expect(myAtoi('words')).toBe(0);
  });

  it('find +/- sign', () => {
    expect(myAtoi('+2402')).toBe(2402);
    expect(myAtoi('-33')).toBe(-33);
  });


  it('value between 32 bit number', () => {
    expect(myAtoi('-91283472332')).toBe(-2147483648);
    expect(myAtoi('2147483648')).toBe(2147483647);
  });
});
