'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var reflexivity = function(a) {
  var lhs = a;
  var rhs = a;
  return Z.equals(lhs, rhs);
};

var symmetry = function(a, b) {
  var lhs = Z.equals(a, b);
  var rhs = Z.equals(b, a);
  return Z.equals(lhs, rhs);
};

var transitivity = function(a, b, c) {
  return !Z.equals(a, b) || !Z.equals(b, c) || Z.equals(a, c);
};

exports.reflexivity = function(a) {
  it('Setoid reflexivity', function() {
    jsc.assert(jsc.forall(a, reflexivity));
  });
};

exports.symmetry = function(a, b) {
  it('Setoid symmetry', function() {
    jsc.assert(jsc.forall(a, b, symmetry));
  });
};

exports.transitivity = function(a, b, c) {
  it('Setoid transitivity', function() {
    jsc.assert(jsc.forall(a, b, c, transitivity));
  });
};
