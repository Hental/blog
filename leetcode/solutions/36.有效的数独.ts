/*
 * @lc app=leetcode.cn id=36 lang=typescript
 *
 * [36] 有效的数独
 */

// @lc code=start

function newEmptyArray(size: number): any[][] {
  return Array(size).fill(undefined).map(() => []);
}

function isValidSudoku(board: string[][]): boolean {
  const size = board.length;
  const rows = newEmptyArray(size);
  const cols = newEmptyArray(size);
  // 3x3 array
  const groups = newEmptyArray(size / 3).map(() => newEmptyArray(size / 3));

  function validValue(array: any[], idx: number) {
    if (array[idx]) {
      throw new Error(`invalid!`);
    }
    array[idx] = 1;
  }

  function assertPoint(row: number, col: number) {
    const val = board[row][col];

    if (val === '.') {
      return;
    }

    const idx = Number(val) - 1;

    const gRow = Math.floor(row / 3);
    const gCol = Math.floor(col / 3);

    validValue(rows[row], idx);
    validValue(cols[col], idx);
    validValue(groups[gRow][gCol], idx);
  }

  for (let row = 0; row < board.length; row++) {
    const rowLine = board[row];

    for (let col = 0; col < rowLine.length; col++) {
      try {
        assertPoint(row, col);
      } catch (e) {
        console.log('fail:', row, col, board[row][col]);
        return false;
      }
    }
  }

  return true;
};
// @lc code=end

const sk = [
  [".", ".", "4", ".", ".", ".", "6", "3", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  ["5", ".", ".", ".", ".", ".", ".", "9", "."],
  [".", ".", ".", "5", "6", ".", ".", ".", "."],
  ["4", ".", "3", ".", ".", ".", ".", ".", "1"],
  [".", ".", ".", "7", ".", ".", ".", ".", "."],
  [".", ".", ".", "5", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."]
];
const r = isValidSudoku(sk);
