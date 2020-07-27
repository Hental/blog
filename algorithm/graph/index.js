class GraphNode {
  /**
   *
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
  }
}

class GraphLine {
  /**
   *
   * @param {GraphNode} from
   * @param {GraphNode} to
   */
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
}

// 简单有向图
class SimpleGraph {
  constructor() {
    /** @type {Map<string, GraphNode>} */
    this.nodes = new Map();
    /** @type {Set<GraphLine>} */
    this.lines = new Set();
    /** @type {Map<GraphNode, GraphLine>} */
    this.inLines = new Map();
    /** @type {Map<GraphNode, GraphLine>} */
    this.outLines = new Map();
  }

  /**
   *
   * @param {GraphNode} node
   */
  addNode(node) {
    this.nodes.set(node.name, node);
    return this;
  }

  /**
   *
   * @param {GraphLine} line
   */
  addLine(line) {
    this.lines.add(line);
    return this;
  }

  /**
   *
   * @param {GraphNode} node
   */
  getOutDegree(node) {
    return [...this.lines.values()]
      .filter(line => line.from === node)
  }

   /**
   *
   * @param {GraphNode} node
   */
  getInDegree(node) {
    return [...this.lines.values()]
      .filter(line => line.to === node)
  }

  get root() {
    return [...this.nodes.values()]
      .find(node => this.getInDegree(node).length === 0);
  }
}

/**
 * 深度优先图遍历
 * @param {SimpleGraph} graph
 * @param {string} target
 */
function DFSGraph(graph, target) {
  /**
   *
   * @param {GraphNode} node
   * @returns {GraphNode}
   */
  const r = (node) => {
    console.log('loop node', node);
    if (node.name === target) {
      return node;
    }
    const outLines = graph.getOutDegree(node);
    for (const outLine of outLines) {
      const result = r(outLine.to);
      if (result) {
        return result;
      }
    }
  }

  return r(graph.root);
}

/**
 * 广度优先图遍历
 * @param {SimpleGraph} graph
 * @param {string} target
 */
function BFSGraph(graph, target) {
  const queue = [graph.root];
  let node;

  do {
    node = queue.shift();

    console.log('loop node', node);

    if (node.name === target) {
      break;
    }

    const outLines = graph.getOutDegree(node);

    for (const outLine of outLines) {
      queue.push(outLine.to);
    }

  } while (true);

  return node;
}


function test() {
  const assert = require('assert');

  const root = new GraphNode('root');
  const node1 = new GraphNode('1');
  const node2 = new GraphNode('2');
  const node3 = new GraphNode('3');
  const node4 = new GraphNode('4');
  const node5 = new GraphNode('5');

  const lines1 = new GraphLine(root, node1);
  const lines2 = new GraphLine(root, node2);
  const lines3 = new GraphLine(node2, node4);
  const lines4 = new GraphLine(node1, node3);
  const lines5 = new GraphLine(node3, node4);
  const lines6 = new GraphLine(node1, node4);
  const lines8 = new GraphLine(node2, node3);
  const lines7 = new GraphLine(node2, node5);


  const graph = new SimpleGraph();

  graph
    .addNode(root)
    .addNode(node1)
    .addNode(node2)
    .addNode(node3)
    .addNode(node4)
    .addNode(node5)
    .addLine(lines1)
    .addLine(lines2)
    .addLine(lines3)
    .addLine(lines4)
    .addLine(lines5)
    .addLine(lines6)
    .addLine(lines7)
    .addLine(lines8);

  const target = '5';

  console.log('\n dfs');
  const result1 = DFSGraph(graph, target);

  console.log('\n bfs');
  const result2 = BFSGraph(graph, target);

  assert(result1 === result2);
}

if (process.argv[1] === __filename) {
  test();
}
