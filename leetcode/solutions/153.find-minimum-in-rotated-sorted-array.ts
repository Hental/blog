/*
 * @lc app=leetcode id=153 lang=typescript
 *
 * [153] Find Minimum in Rotated Sorted Array
 */

// @lc code=start
function findMin(nums: number[]): number {
  return binSearch(nums, 0, nums.length - 1) as number;
};

function isMin(nums: number[], idx: number) {
  if (idx === 0) {
    return false;
  }
  return nums[idx - 1] > nums[idx];
}

function binSearch(nums: number[], left: number, right: number): number | null {
  if (right < left || right >= nums.length || left < 0) {
    return null;
  }

  const middle = Math.floor((left + right) / 2);

  if (isMin(nums, middle)) {
    return nums[middle];
  }

  return binSearch(nums, left, middle - 1) ?? binSearch(nums, middle + 1, right);
}
// @lc code=end

