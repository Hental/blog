declare global {
  interface ListNode<T = any> {
    val: T;
    next: ListNode<T> | null;
  }
}

export { };
