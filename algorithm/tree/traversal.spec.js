const tranversal = require('./traversal');

function treeNode(name) {
  const node = {
    name,
    parent: void 0,
    left: void 0,
    right: void 0,
    toString: () => name,
  }

  return new Proxy(node, {
    set(target, prop, value, reciver) {
      if (prop === 'left' || prop === 'right') {
        value.parent = target;
      }

      return Reflect.set(target, prop, value, reciver);
    }
  });
};

const root = treeNode('root');
const nodes = Array.from({ length: 20 }).map((_, index) => treeNode(index));

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

describe('tranversal', () => {
  describe('depth first', () => {
    const { depthFirst } = tranversal;

    it('pre order', () => {
      const res = ['root', 0, 12, 13, 8, 9, 10, 11, 1, 2, 4, 3, 5, 6, 7];
      expect(depthFirst('pre')(root)).toEqual(res);
    });

    it('in order', () => {
      const res = [13, 12, 0, 10, 9, 11, 8, 'root', 2, 4, 1, 5, 3, 6, 7];
      expect(depthFirst('in')(root)).toEqual(res);
    });

    it('post order', () => {
      const res = [13, 12, 10, 11, 9, 8, 0, 4, 2, 5, 7, 6, 3, 1, 'root'];
      expect(depthFirst('post')(root)).toEqual(res);
    });
  });


  it('breadth first', () => {
    const res = ['root', 0, 1, 12, 8, 2, 3, 13, 9, 4, 5, 6, 10, 11, 7];
    expect(tranversal.breadthFirst(root)).toEqual(res);
  });
});
