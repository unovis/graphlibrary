import _has from 'lodash-es/has'
import _each from 'lodash-es/each'
import _isArray from 'lodash-es/isArray'
export default dfs
/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */

function dfs (g, vs, order) {
  if (!_isArray(vs)) {
    vs = [vs]
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g)
  const acc = []
  const visited = {}

  _each(vs, function (v) {
    if (!g.hasNode(v)) {
      throw new Error('Graph does not have node: ' + v)
    }

    doDfs(g, v, order === 'post', visited, navigation, acc)
  })

  return acc
}

function doDfs (g, v, postorder, visited, navigation, acc) {
  if (!_has(visited, v)) {
    visited[v] = true

    if (!postorder) {
      acc.push(v)
    }

    _each(navigation(v), function (w) {
      doDfs(g, w, postorder, visited, navigation, acc)
    })

    if (postorder) {
      acc.push(v)
    }
  }
}
