import { Graph, GraphEdge } from './graph';

/**
 * 无边图 => 完全图
 * @param graph
 */
export function addAllEdges(graph: Graph): Graph {
  const newGraph = graph.clone();
  const vertices = [...newGraph.vertices()];

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    for (let j = i + 1; j < vertices.length; j++) {
      const anotherVertex = vertices[j];
      newGraph.addEdge(new GraphEdge(vertex, anotherVertex));
    }
  }

  return newGraph;
}
