/*
 * @lc app=leetcode id=2 lang=rust
 *
 * [2] Add Two Numbers
 */

struct Solution {}

// Definition for singly-linked list.
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}

fn createNode(num: i32) {
  return Option
}

// @lc code=start
// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
//
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode {
//       next: None,
//       val
//     }
//   }
// }
impl Solution {
    pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
      let root = ListNode::new(0);
      let mut carry: i32 = 0;

      return root.next;
    }
}
// @lc code=end

fn main() {
  let l1 = ListNode::new(2);
  let node4 = ListNode::new(4);
  let node3 = ListNode::new(3);

  l1.next = node4;
  node4.next = node3;

  let l2 = ListNode::new(5);
  let node6 = ListNode::new(6);
  let node4 = ListNode::new(4);

  l2.next = node6;
  node6.next = node4;

  let result = Solution::add_two_numbers(l1, l2);
  assert_eq!(result.next.val, 7);
  assert_eq!(result.next.next.val, 0);
  assert_eq!(result.next.next.next.val, 8);
}

