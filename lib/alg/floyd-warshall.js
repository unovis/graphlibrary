var _ = require("lodash");

module.exports = floydWarshall;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function floydWarshall(g, weightFunc, edgeFunc) {
  return runFloydWarshall(g,
                          weightFunc || DEFAULT_WEIGHT_FUNC,
                          edgeFunc || function(v) { return g.outEdges(v); });
}

function runFloydWarshall(g, weightFunc, edgeFunc) {
  var results = {},
      nodes = g.nodeIds();

  nodes.forEach(function(v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function(w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFunc(v).forEach(function(edge) {
      var w = edge.v === v ? edge.w : edge.v,
          d = weightFunc(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function(k) {
    var rowK = results[k];
    nodes.forEach(function(i) {
      var rowI = results[i];
      nodes.forEach(function(j) {
        var ik = rowI[k];
        var kj = rowK[j];
        var ij = rowI[j];
        var altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}