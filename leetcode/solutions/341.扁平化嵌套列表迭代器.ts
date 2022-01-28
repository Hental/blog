/*
 * @lc app=leetcode.cn id=341 lang=typescript
 *
 * [341] 扁平化嵌套列表迭代器
 */

class NestedInteger {
  list: NestedInteger[];
  value: number | null;

  constructor(value?: number) {
    this.list = [];
    this.value = value === undefined ? null : value;
  }

  isInteger(): boolean {
    return this.value !== null;
  }

  add(elem: NestedInteger) {
    this.list.push(elem);
  }

  getList(): NestedInteger[] {
    return this.list;
  }

  getInteger(): number | null {
    return this.value;
  }
}

// @lc code=start
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * class NestedInteger {
 *     If value is provided, then it holds a single integer
 *     Otherwise it holds an empty nested list
 *     constructor(value?: number) {
 *         ...
 *     };
 *
 *     Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     isInteger(): boolean {
 *         ...
 *     };
 *
 *     Return the single integer that this NestedInteger holds, if it holds a single integer
 *     Return null if this NestedInteger holds a nested list
 *     getInteger(): number | null {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a single integer equal to value.
 *     setInteger(value: number) {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a nested list and adds a nested integer elem to it.
 *     add(elem: NestedInteger) {
 *         ...
 *     };
 *
 *     Return the nested list that this NestedInteger holds,
 *     or an empty list if this NestedInteger holds a single integer
 *     getList(): NestedInteger[] {
 *         ...
 *     };
 * };
 */



class NestedIterator {
  ptr: number;
  list: NestedInteger[];
  stack: ([NestedInteger[], number, number])[];

  constructor(nestedList: NestedInteger[]) {
    this.ptr = -1;
    this.list = nestedList;
    this.stack = [];
    this.movePtrToNext();
  }

  get level(): number {
    return this.stack.length + 1;
  }

  hasNext(): boolean {
    return this.ptr !== -1;
  }

  next(): number {
    const val = this.list[this.ptr];
    this.movePtrToNext();
    return val.getInteger()!;
  }

  movePtrToNext() {
    let nextPtr = this.ptr + 1;
    let list = this.list;
    let nextVal: NestedInteger;

    while (true) {
      if (nextPtr >= list.length) {
        if (!this.stack.length) {
          list = [];
          nextPtr = -1;
          break;
        }

        [list, nextPtr] = this.stack.pop()!;

        continue;
      }
      nextVal = list[nextPtr];
      if (!nextVal.isInteger()) {
        this.stack.push([list, nextPtr + 1, this.stack.length]);
        list = nextVal.getList();
        nextPtr = 0;
        continue;
      }
      break;
    }

    this.list = list;
    this.ptr = nextPtr;
  }
}

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * var obj = new NestedIterator(nestedList)
 * var a: number[] = []
 * while (obj.hasNext()) a.push(obj.next());
 */
// @lc code=end

const nestedList = [[1, 1], 2, [1, 1]];

const to
const _it = new NestedIterator(nestedList);

while (_it.hasNext()) {
  console.log(`level: ${_it.level}`, _it.next());
}
