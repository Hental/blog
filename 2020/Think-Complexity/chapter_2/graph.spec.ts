import { Graph, GraphEdge, GraphVertex } from './graph';

describe('graph', () => {
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

  it('remove vertex ref', () => {

  });
});
