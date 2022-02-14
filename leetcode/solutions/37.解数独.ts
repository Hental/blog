/*
 * @lc app=leetcode.cn id=37 lang=typescript
 *
 * [37] 解数独
 */

// @lc code=start
function findValidNumbers(board: string[][], row: number, col: number) {
  const size = board.length;
  const pool = Array(size).fill(true);

  const valid = (x: number, y: number) => {
    const v = board[x][y];
    const idx = Number(v) - 1;
    pool[idx] = false;
  }

  for (let i = 0; i < size; i++) {
    valid(i, col);
  }

  for (let i = 0; i < size; i++) {
    valid(row, i);
  }

  const gRow = Math.floor(row / 3);
  const gCol = Math.floor(col / 3);

  for (let i = 0; i < 3; i++) {
    const r = gRow * 3 + i;
    for (let j = 0; j < 3; j++) {
      const c = gCol * 3 + j;
      valid(r, c);
    }
  }

  return pool
    .map((v, idx) => v ? idx + 1 : 0)
    .filter(v => v > 0);
}

function createEmptyArray(size: number): boolean[][] {
  return Array(size)
    .fill(undefined)
    .map(() => Array(size).fill(false));
}

/**
 Do not return anything, modify board in-place instead.
 */
function solveSudoku(board: string[][]): void {
  const size = board.length;
  const rows = createEmptyArray(size);
  const cols = createEmptyArray(size);
  // 3x3 array
  const groups = createEmptyArray(size / 3).map(() => createEmptyArray(size / 3));
  const spaces: [number, number][] = [];

  const markPos = (row: number, col: number, val: string | number, existValue = true) => {
    const key = Number(val) - 1;
    const gRow = Math.floor(row / 3);
    const gCol = Math.floor(col / 3);

    rows[row][key] = existValue;
    cols[col][key] = existValue;
    groups[gRow][gCol][key] = existValue;
  }

  const canPutValue = (row: number, col: number, val: string | number) => {
    const key = Number(val) - 1;
    const gRow = Math.floor(row / 3);
    const gCol = Math.floor(col / 3);

    if (rows[row][key] || cols[col][key] || groups[gRow][gCol][key]) {
      return false;
    }

    return true;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const val = board[i][j];
      if (val === '.') {
        spaces.push([i, j]);
      } else {
        markPos(i, j, val);
      }
    }
  }

  let done = false;
  function dfs(idx: number) {
    const pos = spaces[idx];

    if (!pos) {
      done = true;
      return;
    }

    const [row, col] = pos;
    for (let digit = 1; digit < 10 && !done; digit++) {
      if (canPutValue(row, col, digit)) {
        board[row][col] = String(digit);
        // console.log(`${row} ${col} => ${digit}`);
        markPos(row, col, digit);
        dfs(idx + 1);
        // reset
        markPos(row, col, digit, false);
      }
    }
  }

  dfs(0);
};
// @lc code=end

const board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];

solveSudoku(board);
console.log(board);

const expectResult = [
  ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
  ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
  ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
  ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
  ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
  ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
  ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
  ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
  ["3", "4", "5", "2", "8", "6", "1", "7", "9"]
];
