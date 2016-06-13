'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var leftIdentity = function(a) {
  var lhs = Z.concat(Z.empty(a.constructor), a);
  var rhs = a;
  return Z.equals(lhs, rhs);
};

var rightIdentity = function(a) {
  var lhs = Z.concat(a, Z.empty(a.constructor));
  var rhs = a;
  return Z.equals(lhs, rhs);
};

exports.leftIdentity = function(a) {
  it('Monoid left identity', function() {
    jsc.assert(jsc.forall(a, leftIdentity));
  });
};

exports.rightIdentity = function(a) {
  it('Monoid right identity', function() {
    jsc.assert(jsc.forall(a, rightIdentity));
  });
};
