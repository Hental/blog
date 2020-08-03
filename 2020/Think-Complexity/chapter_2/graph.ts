export class GraphVertex {
  label: string;

  constructor(label: string) {
    this.label = label;
  }

  [Symbol.toStringTag]() {
    return `Vertex(${this.label})`;
  }
}

export class GraphEdge extends Array {
  constructor(vertex1: GraphVertex, vertex2: GraphVertex) {
    super();
    this.push(vertex1);
    this.push(vertex2);
  }
}

export class Graph extends Map<GraphVertex, Map<GraphVertex, GraphEdge>> {
  constructor() {
    super();
  }

  addVertex(vertex: GraphVertex) {
    if (!this.has(vertex)) {
      this.set(vertex, new Map());
    }
  }

  addEdge(edge: GraphEdge) {
    const [vertex1, vertex2] = edge;

    let vertex1Edges = this.get(vertex1);
    if (!vertex1Edges) {
      vertex1Edges = new Map();
      this.set(vertex1, vertex1Edges);
    }
    vertex1Edges.set(vertex2, edge);

    let vertex2Edges = this.get(vertex2);
    if (!vertex2Edges) {
      vertex2Edges = new Map();
      this.set(vertex2, vertex2Edges);
    }
    vertex2Edges.set(vertex1, edge);
  }

  /**
   * 获得 2 个顶点之间的边
   * @param vertex1
   * @param vertex2
   */
  getEdge(vertex1: GraphVertex, vertex2: GraphVertex): null | GraphEdge {
    const vertex1Edges = this.get(vertex1);
    const edge = vertex1Edges?.get(vertex2);
    return edge || null;
  }

  /**
   * 删除边的所有引用
   * @param edge
   */
  removeEdge(edge: GraphEdge): void {
    const [v1, v2] = edge;
    this.get(v1)?.delete(v2);
    this.get(v2)?.delete(v1);
  }


  /**
   * 返回所有顶点的集合
   */
  vertices(): IterableIterator<GraphVertex> {
    return this.keys();
  }

  /**
   * 所有边的集合
   */
  edges(): IterableIterator<GraphEdge> {
    const edges = new Set<GraphEdge>();
    for (const verticesMap of this.values()) {
      for (const edge of verticesMap.values()) {
        edges.add(edge);
      }
    }
    return edges.values();
  }

  /**
   * 获取一个顶点相邻的节点
   */
  getOutVertices(vertex: GraphVertex): IterableIterator<GraphVertex> {
    const map = this.get(vertex);
    if (!map) {
      throw new Error(`Vertex(${vertex.label}) not exist in graph`);
    }
    return map.keys();
  }

  /**
   * 获取一个顶点的边
   */
  getOutEdges(vertex: GraphVertex): IterableIterator<GraphEdge> {
    const map = this.get(vertex);
    if (!map) {
      throw new Error(`Vertex(${vertex.label}) not exist in graph`);
    }
    return map.values();
  }
}
