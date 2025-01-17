import _has from 'lodash-es/has'
import _each from 'lodash-es/each'
import Graph from '../graph'
import PriorityQueue from '../data/priority-queue'
export default prim

function prim (g, weightFunc) {
  const result = new Graph()
  const parents = {}
  const pq = new PriorityQueue()
  let v

  function updateNeighbors (edge) {
    const w = edge.v === v ? edge.w : edge.v
    const pri = pq.priority(w)

    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge)

      if (edgeWeight < pri) {
        parents[w] = v
        pq.decrease(w, edgeWeight)
      }
    }
  }

  if (g.nodeCount() === 0) {
    return result
  }

  _each(g.nodes(), function (v) {
    pq.add(v, Number.POSITIVE_INFINITY)
    result.setNode(v)
  }) // Start from an arbitrary node

  pq.decrease(g.nodes()[0], 0)
  var init = false

  while (pq.size() > 0) {
    v = pq.removeMin()

    if (_has(parents, v)) {
      result.setEdge(v, parents[v])
    } else if (init) {
      throw new Error('Input graph is not connected: ' + g)
    } else {
      init = true
    }

    g.nodeEdges(v).forEach(updateNeighbors)
  }

  return result
}
