import { Graph, GraphVertex } from './graph';


export function DFSSearchGraphVertex(graph: Graph, root: GraphVertex, targetLabel: string) {
  const visitedVertex = new Map<GraphVertex, boolean>();
  let result: GraphVertex | null | undefined = null;

  function DFSTraverse(item: GraphVertex) {
    if (visitedVertex.has(item)) {
      return null;
    }

    visitedVertex.set(item, true);

    if (item.label === targetLabel) {
      return item;
    }

    const nextVertices = graph.getOutVertices(item);
    let it = nextVertices.next();
    while (!result && !it.done) {
      result = DFSTraverse(it.value);
    }
  }

  DFSTraverse(root);
  return result;
}

export function BFSSearchGraphVertex(graph: Graph, root: GraphVertex, targetLabel: string) {
  const visitedVertex = new Map<GraphVertex, boolean>();
  let result: GraphVertex | null | undefined = null;

  function DFSTraverse(item: GraphVertex) {
    if (visitedVertex.has(item)) {
      return null;
    }

    visitedVertex.set(item, true);

    if (item.label === targetLabel) {
      return item;
    }

    const nextVertices = graph.getOutVertices(item);
    let it = nextVertices.next();
    while (!result && !it.done) {
      result = DFSTraverse(it.value);
    }
  }

  DFSTraverse(root);
  return result;
}
