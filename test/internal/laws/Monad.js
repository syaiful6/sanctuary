'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var leftIdentity = function(a, f, x) {
  var lhs = Z.chain(f, Z.of(a.constructor, x));
  var rhs = f(x);
  return Z.equals(lhs, rhs);
};

var rightIdentity = function(a, x) {
  var lhs = Z.chain(function(x) { return Z.of(a.constructor, x); }, a);
  var rhs = a;
  return Z.equals(lhs, rhs);
};

exports.leftIdentity = function(a, f, x) {
  it('Monad left identity', function() {
    jsc.assert(jsc.forall(a, f, x, leftIdentity));
  });
};

exports.rightIdentity = function(a, x) {
  it('Monad right identity', function() {
    jsc.assert(jsc.forall(a, x, rightIdentity));
  });
};
