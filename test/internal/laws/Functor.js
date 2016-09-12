'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../../..');


var identity = function(a) {
  var lhs = Z.map(S.I, a);
  var rhs = a;
  return Z.equals(lhs, rhs);
};

var composition = function(a, f, g) {
  var lhs = Z.map(S.compose(f, g), a);
  var rhs = Z.map(f, Z.map(g, a));
  return Z.equals(lhs, rhs);
};

exports.identity = function(a) {
  it('Functor identity', function() {
    jsc.assert(jsc.forall(a, identity));
  });
};

exports.composition = function(a, f, g) {
  it('Functor composition', function() {
    jsc.assert(jsc.forall(a, f, g, composition));
  });
};
