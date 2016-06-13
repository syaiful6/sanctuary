'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../../..');


var identity = function(a) {
  var lhs = Z.ap(Z.of(a.constructor, S.I), a);
  var rhs = a;
  return Z.equals(lhs, rhs);
};

var homomorphism = function(a, f, x) {
  var lhs = Z.ap(Z.of(a.constructor, f), Z.of(a.constructor, x));
  var rhs = Z.of(a.constructor, f(x));
  return Z.equals(lhs, rhs);
};

var interchange = function(a, f, x) {
  var lhs = Z.ap(Z.of(a.constructor, function(f) { return f(x); }), a);
  var rhs = Z.ap(a, Z.of(a.constructor, x));
  return Z.equals(lhs, rhs);
};

exports.identity = function(a) {
  it('Applicative identity', function() {
    jsc.assert(jsc.forall(a, identity));
  });
};

exports.homomorphism = function(a, f, x) {
  it('Applicative homomorphism', function() {
    jsc.assert(jsc.forall(a, f, x, homomorphism));
  });
};

exports.interchange = function(a, f, x) {
  it('Applicative interchange', function() {
    jsc.assert(jsc.forall(a, f, x, interchange));
  });
};
