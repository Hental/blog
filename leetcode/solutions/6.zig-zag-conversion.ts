/*
 * @lc app=leetcode id=6 lang=typescript
 *
 * [6] ZigZag Conversion
 */

// @lc code=start
function computeColumns(s: string, numRows: number): number {
  // if (s.length <= numRows) {
  //   return 1;
  // }
  if (numRows === 1) {
    return s.length;
  }
  const groupLen = numRows + numRows - 2;
  const base = parseInt(String(s.length / groupLen), 10);
  const mod = s.length % groupLen;
  const exColumn = Math.max(0, mod - numRows);
  const numColumns = base * (numRows - 1) + exColumn + (mod === 0 ? 0 : 1);
  return numColumns;
}

function convert(s: string, numRows: number): string {
  const numColumns = computeColumns(s, numRows);
  const zigzagArr: string[] = [];

  let pos: [number, number] = [0, 0];
  let isUp = false;
  let minRow = -(numRows - 1);

  const moveUp = () => {
    pos[0] += 1
    pos[1] += 1
  }

  const moveDown = () => {
    pos[1] -= 1;
  }

  const nextPos = () => {
    if (isUp) {
      if (pos[1] !== 0) {
        moveUp();
      } else {
        isUp = false;
        moveDown();
      }
    } else {
      if (pos[1] !== minRow) {
        moveDown();
      } else {
        isUp = true;
        moveUp();
      }
    }
  }

  const computeIndex = (): number => {
    const [x, y] = pos;
    return -y * numColumns + x;
  }

  for (const char of s) {
    zigzagArr[computeIndex()] = char;
    nextPos();
  }

  return zigzagArr.filter(Boolean).join('');
};
// @lc code=end

describe('6.ZigZag Conversion', () => {
  it('base', () => {
    expect(convert('A', 1)).toBe('A');
    expect(convert('AB', 1)).toBe('AB');
    expect(convert('PAYPALISHIRING', 3)).toBe('PAHNAPLSIIGYIR');
    expect(convert('PAYPALISHIRING', 4)).toBe('PINALSIGYAHRPI');
  });

  it('compute column', () => {
    const words = (len: number) => Array.from({ length: len }).map(() => 'a').join('');
    expect(computeColumns(words(3), 1)).toBe(3);
    expect(computeColumns(words(1), 4)).toBe(1);
    expect(computeColumns(words(2), 4)).toBe(1);
    expect(computeColumns(words(3), 2)).toBe(2);
    expect(computeColumns(words(6), 4)).toBe(3);
    expect(computeColumns(words(7), 4)).toBe(4);
    expect(computeColumns(words(10), 4)).toBe(4);
    expect(computeColumns(words(11), 4)).toBe(5);
    expect(computeColumns(words(12), 4)).toBe(6);
    expect(computeColumns(words(13), 4)).toBe(7);
  });
});
