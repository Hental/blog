/*
 * @lc app=leetcode id=2 lang=typescript
 *
 * [2] Add Two Numbers
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function addTwoNumbers(l1: ListNode, l2: ListNode): ListNode {
  const rootNode: ListNode = { next: null, val: 0 };
  let curNode: ListNode | null = rootNode;
  let l1Node: ListNode | null = l1;
  let l2Node: ListNode | null = l2;
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

  return rootNode.next as ListNode;
};
// @lc code=end

// test
describe('2.add-two-numbers', () => {
  it('add number, plus 1 if over 10', () => {
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
    const expectResult = {
      val: 7,
      next: {
        val: 0,
        next: {
          val: 8,
          next: null,
        },
      },
    };
    expect(result).toEqual(expectResult);
  })
})

