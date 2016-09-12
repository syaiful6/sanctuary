'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../sanctuary');

var Compose = require('../Compose');


var naturality = function(F, G, t, u) {
  var lhs = t(Z.traverse(S.of(F), S.I, u));
  var rhs = Z.traverse(S.of(G), t, u);
  return Z.equals(lhs, rhs);
};

var identity = function(F, u) {
  var lhs = Z.traverse(S.of(F), S.of(F), u);
  var rhs = Z.of(F, u);
  return Z.equals(lhs, rhs);
};

var composition = function(F, G, u) {
  var C = Compose(F)(G);
  var lhs = Z.traverse(S.of(C), C, u);
  var rhs = C(Z.map(S.traverse(S.of(G), S.I), Z.traverse(S.of(F), S.I, u)));
  return Z.equals(lhs, rhs);
};

exports.naturality = function(F, G, t, u) {
  it('Traversable naturality', function() {
    jsc.assert(jsc.forall(F, G, t, u, naturality));
  });
};

exports.identity = function(F, u) {
  it('Traversable identity', function() {
    jsc.assert(jsc.forall(F, u, identity));
  });
};

exports.composition = function(F, G, u) {
  it('Traversable composition', function() {
    jsc.assert(jsc.forall(F, G, u, composition));
  });
};
