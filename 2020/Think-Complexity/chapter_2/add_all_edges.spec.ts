import { random } from 'faker';
import { addAllEdges } from './add_all_edges';
import { Graph, GraphVertex } from './graph';

function isCompleteGraph(graph: Graph) {
  const vertices = graph.vertices();
  const verticesArray = [...vertices];

  for (let i = 0; i < verticesArray.length; i++) {
    const vertex = verticesArray[i];
    for (let j = i + 1; j < verticesArray.length; j++) {
      const anotherVertex = verticesArray[j];
      if (!graph.getEdge(vertex, anotherVertex)) {
        return false;
      }
    }
  }

  return true;
}


describe('graph/add_all_edges', () => {
  it('complete graph to complete graph', () => {
    const graph = new Graph();
    const labels = Array.from({ length: 10 }).map(item => random.word());
    for (const label of labels) {
      graph.addVertex(new GraphVertex(label));
    }
    const completeGraph = addAllEdges(graph);
    expect(isCompleteGraph(completeGraph)).toBeTruthy();
  });
});
