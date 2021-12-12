declare global {
  type ListToTreeFn = <T>(list: Array<T | null>) => TreeNode<T> | null;
  const listToTree: ListToTreeFn;
}

const createTreeNode = <T>(val: T | null) => {
  if (!val) return null;

  const node: TreeNode<T> = {
    val,
    left: null,
    right: null
  };

  return node;
}

export const listToTree: ListToTreeFn = <T>(list: Array<T | null>): TreeNode<T> | null => {
  if (!list.length) return null;

  let root = createTreeNode(list.shift() as T);
  let queue = [root];
  let nextQueue: Array<TreeNode<T> | null> = [];
  let node;

  while (list.length) {
    while (node = queue.shift()) {
      node.left = createTreeNode(list.shift() as T | null);
      node.right = createTreeNode(list.shift() as T | null);
      nextQueue.push(node.left);
      nextQueue.push(node.right);
    }
    queue = nextQueue;
    nextQueue = [];
  }

  return root;
}
