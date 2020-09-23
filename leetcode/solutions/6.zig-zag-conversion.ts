/*
 * @lc app=leetcode id=6 lang=typescript
 *
 * [6] ZigZag Conversion
 */

// @lc code=start
function convert(s: string, numRows: number): string {
  if (numRows === 1) {
    return s;
  }
  const zigzagArr: string[] = new Array(s.length);
  const groupLen = numRows + numRows - 2;
  const groupSize = parseInt(String(s.length / groupLen), 10);

  for (let row = 0; row < numRows; row++) {
    const mayIndexList = row === 0 ? [0] : row === numRows - 1 ? [row] : [row, groupLen - row];
    for (let groupIndex = 0; groupIndex < groupSize + 1; groupIndex++) {
      for (const mayIndex of mayIndexList) {
        const realIndex = groupLen * groupIndex + mayIndex;
        const realChar = s[realIndex];
        if (realChar !== undefined) {
          zigzagArr.push(realChar);
        }
      }
    }
  }

  return zigzagArr.join('');
};
// @lc code=end

describe('6.ZigZag Conversion', () => {
  it('base', () => {
    expect(convert('A', 1)).toBe('A');
    expect(convert('AB', 1)).toBe('AB');
    expect(convert('PAYPALISHIRING', 3)).toBe('PAHNAPLSIIGYIR');
    expect(convert('PAYPALISHIRING', 4)).toBe('PINALSIGYAHRPI');
  });
});
