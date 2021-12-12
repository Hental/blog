/*
 * @lc app=leetcode.cn id=98 lang=typescript
 *
 * [98] 验证二叉搜索树
 */
// @lc code=start
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function isValidBST(root: TreeNode | null): boolean {
  const walk = (node: TreeNode | null, min: number, max: number): boolean => {
    if (!node) {
      return true;
    }

    if (node.val >= max || node.val <= min) {
      return false;
    }

    return walk(node.left, min, node.val) && walk(node.right, node.val, max)
  }

  return walk(root, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
};
// @lc code=end

const testCase = (input: number[], target: boolean) => {
  expect(isValidBST(listToTree(input))).toBe(target);
}

describe('98.valid-search-binary-tree', () => {
  it('case', () => {
    testCase([2, 2,2], false);
  });
});
