import { Graph, GraphEdge, GraphVertex } from './graph';

function createGraph(edges: Array<[string, string]>) {
  const g = new Graph();
  const vertices = new Map<string, GraphVertex>();
  const getVertex = (label: string) => {
    let v = vertices.get(label) || new GraphVertex(label);
    vertices.set(label, v);
    return v;
  }

  for (const edge of edges) {
    g.addEdge(edge.map(getVertex));
  }

  return {
    graph: g,
    getVertex: (label: string) => vertices.get(label),
  };
}

function verticesLabel(vertices: Iterable<GraphVertex>) {
  return [...vertices].map(v => v.label).sort();
}

function edgesLabel(edges: Iterable<GraphEdge>) {
  return [...edges].map(verticesLabel);
}

describe('graph', () => {
  it('add vertex & edge', () => {
    const g = new Graph();
    const vertexA = new GraphVertex('a');
    const vertexB = new GraphVertex('b');
    const edge = new GraphEdge(vertexA, vertexB);
    g.addEdge(edge);
    const edges = [...g.edges()];
    const vertices = [...g.vertices()];
    expect(edges.length).toBe(1);
    expect(vertices.length).toBe(2);
    expect(edges.includes(edge)).toBeTruthy();
    expect(vertices.includes(vertexA)).toBeTruthy();
    expect(vertices.includes(vertexB)).toBeTruthy();
  });

  it('remove edge ref', () => {
    const g = new Graph();
    const vertexA = new GraphVertex('a');
    const vertexB = new GraphVertex('b');
    const edge = new GraphEdge(vertexA, vertexB);
    g.addEdge(edge);
    expect([...g.edges()].length).toBe(1);
    expect([...g.vertices()].length).toBe(2);
    g.removeEdge(edge);
    expect([...g.edges()].length).toBe(0);
    expect([...g.vertices()].length).toBe(2);
  });

  it('"getOutVertices" return vertex neighbor vertices', () => {
    const { graph, getVertex } = createGraph([
      ['a', 'b'],
      ['a', 'c'],
      ['a', 'd'],
      ['b', 'e'],
      ['c', 'f'],
      ['f', 'd'],
    ]);
    const outVertices = graph.getOutVertices(getVertex('a') as GraphVertex);
    expect(verticesLabel(outVertices)).toEqual(['b', 'c', 'd']);
  });

  it('"getOutEdges" return vertex neighbor edges', () => {
    const { graph, getVertex } = createGraph([
      ['a', 'b'],
      ['a', 'c'],
      ['a', 'd'],
      ['b', 'e'],
      ['c', 'f'],
      ['f', 'd'],
    ]);
    const outEdges = graph.getOutEdges(getVertex('d') as GraphVertex);
    expect(edgesLabel(outEdges)).toEqual([['a', 'd'], ['d', 'f']]);
  });

});
