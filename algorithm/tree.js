class TreeNode {
  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.left = undefined;
    this.right = undefined;

    return new Proxy(this, {
      set(target, prop, value, reciver) {
        if (prop === 'left' || prop === 'right') {
          value.parent = target;
        }

        return Reflect.set(target, prop, value, reciver);
      }
    })
  }

  toString() {
    return this.name;
  }

}

const root = new TreeNode('root');
const nodes = Array.from({ length: 20 }).map((_, index) => new TreeNode(index));

root.left = nodes[0];
root.right = nodes[1];

nodes[0].right = nodes[8];
nodes[0].left = nodes[12];
nodes[8].left = nodes[9];
nodes[9].left = nodes[10];
nodes[9].right = nodes[11];
nodes[12].left = nodes[13];

nodes[1].left = nodes[2];
nodes[1].right = nodes[3];

nodes[2].right = nodes[4];
nodes[3].left = nodes[5];
nodes[3].right = nodes[6];
nodes[6].right = nodes[7];

function depthFirst() {
  const prevs = [];
  const middles = [];
  const nexts = [];

  function r(node) {
    prevs.push(node.name)

    if (node.left) {
      r(node.left);
    }

    middles.push(node.name);

    if (node.right) {
      r(node.right);
    }

    nexts.push(node.name);
  }

  r(root);
  console.log('前序遍历:', prevs);
  console.log('中序遍历:', middles);
  console.log('后序遍历:', nexts);
}

function breadthFirst() {
  const queue = [];
  const records = [];
  let index = 0;

  queue.push(root);

  while (index < queue.length) {
    let node = queue[index];
    records.push(node.name);

    if (node.left) {
      queue.push(node.left);
    }

    if (node.right) {
      queue.push(node.right);
    }

    index++;
  }

  console.log('广度优先:', records);
}

depthFirst();
breadthFirst();
