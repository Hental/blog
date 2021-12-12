/*
 * @lc app=leetcode.cn id=101 lang=typescript
 *
 * [101] 对称二叉树
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
function isSymmetric(root: TreeNode | null): boolean {
  const walk = (left: TreeNode | null, right: TreeNode | null): boolean => {
    if (!left && !right) return true;

    if (!left || !right) {
      return false;
    }

    if (left === right) {
      return walk(left.left, right.right);
    }

    if (left.val !== right.val) {
      return false;
    }

    return walk(left.left, right.right) && walk(left.right, right.left);
  }

  return walk(root, root);
};
// @lc code=end

test.todo('');
