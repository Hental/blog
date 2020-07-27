/*
 * @lc app=leetcode id=1 lang=rust
 *
 * [1] Two Sum
 */

struct Solution {}

// @lc code=start
impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        use std::collections::HashMap;

        let mut map: HashMap<i32, i32> = HashMap::new();

        for i in 0..nums.len() {
            let num = nums[i];
            let rest = target - num;

            match map.get(&rest) {
              None => {
                map.insert(num, i as i32);
              }
              Some(&val) => {
                return vec!(val, i as i32);
              }
            }
        }

        unreachable!();
    }
}

// @lc code=end

fn main() {
  let nums = vec!(2, 7, 11, 15);
  let target: i32 = 9;
  let result = Solution::two_sum(nums, target);
  let expect = vec!(0, 1);
  assert_eq!(result, expect)
}
