import { addRegularEdges } from './add_regular_edges';
import { Graph, GraphVertex } from './graph';

function isRegularGraph(g: Graph, degree: number) {
  return Array.from(g.vertices()).every(v => g.getVertexDegree(v) === degree);
}

describe('add regular edges', () => {
  it('add edge to make graph to regular graph', () => {
    const g = new Graph()
      .addVertex('a')
      .addVertex('b')
      .addVertex('c')
      .addVertex('d')
      .addVertex('e');
    const regularGraph = addRegularEdges(g, 1);
    expect(isRegularGraph(regularGraph, 1)).toBeTruthy();
  });

  it('throw error if over', () => {
    const g = new Graph()
      .addVertex('a')
      .addVertex('b')
      .addVertex('c')
      .addVertex('d')
      .addVertex('e');
    const regularGraph = addRegularEdges(g, 1);
    expect(isRegularGraph(regularGraph, 1)).toBeTruthy();
  });
});

