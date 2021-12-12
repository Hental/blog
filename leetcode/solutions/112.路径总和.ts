/*
 * @lc app=leetcode.cn id=112 lang=typescript
 *
 * [112] 路径总和
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

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;

  const walk = (node: TreeNode | null, sum: number): boolean => {
    if (!node) {
      return false;
    }

    sum += node.val;

    if (!node.left && !node.right) {
      return sum === targetSum;
    }

    return walk(node.left, sum ) || walk(node.right, sum);
  }

  return walk(root, 0);
};
// @lc code=end

test.todo('');
