/*
 * @lc app=leetcode id=2 lang=javascript
 *
 * [2] Add Two Numbers
 */

/** @typedef {{ val: number; next: ListNode | null }} ListNode */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  const rootNode = { next: null, val: 0 };
  let curNode = rootNode;
  let l1Node = l1;
  let l2Node = l2;
  let carry = 0;
  let l1Val = 0;
  let l2Val = 0;
  let val = 0;

  while (l1Node || l2Node) {
    l1Val = (l1Node && l1Node.val) || 0;
    l2Val = (l2Node && l2Node.val) || 0;

    val = l1Val + l2Val + carry;

    carry = val > 9 ? 1 : 0;
    val = val - 10 * carry;

    curNode.next = {
      val,
      next: null,
    };

    curNode = curNode.next;
    l1Node = l1Node ? l1Node.next : null;
    l2Node = l2Node ? l2Node.next : null;
  }

  if (carry) {
    curNode.next = {
      val: carry,
      next: null,
    };
  }

  return rootNode.next;
};
// @lc code=end

// test
if (__filename === process.argv[1]) {
  const assert = require('assert');
  /** @typedef {ListNode} */
  const l1 = {
    val: 2,
    next: {
      val: 4,
      next: {
        val: 3,
        next: null,
      },
    },
  };
  const l2 = {
    val: 5,
    next: {
      val: 6,
      next: {
        val: 4,
        next: null,
      },
    },
  };
  const result = addTwoNumbers(l1, l2);
  const expect = {
    val: 7,
    next: {
      val: 0,
      next: {
        val: 8,
        next: null,
      },
    },
  };
  assert(JSON.stringify(result) == JSON.stringify(expect));
}
