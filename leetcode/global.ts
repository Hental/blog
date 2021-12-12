import * as helpers from './helpers';

Object.entries(helpers).forEach(([k, v]) => {
  Reflect.set(global, k, v);
});

declare global {
  interface ListNode<T = any> {
    val: T;
    next: ListNode<T> | null;
  }

  interface TreeNode<T = any> {
    val: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
  }
}

export { };
