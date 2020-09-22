import { Graph, GraphVertex } from './graph';

/**
 * @param graph 无边图
 * @param 最终生成的图的度
 * @returns 正则图
 */
export function addRegularEdges(graph: Graph, degree: number) {
  const regularGraph = graph.clone();
  const maxDegree = graph.vertexSize - 1;

  if (degree > maxDegree) {
    throw new Error(`degree over max(${maxDegree})`);
  }

  if (degree === 1) {
    let prevVertex: null | GraphVertex = null;
    for (const vertex of graph.vertices()) {
      if (!prevVertex) {
        prevVertex = vertex;
        continue;
      }
      graph.addEdge(prevVertex, vertex);
    }
  } else if ((graph.vertexSize * degree) % 2 === 1) {
    throw new Error(`degree ${degree} not allow`);
  } else {
    
  }


  return regularGraph;
}
