'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var associativity = function(a, b, c) {
  var lhs = Z.concat(Z.concat(a, b), c);
  var rhs = Z.concat(a, Z.concat(b, c));
  return Z.equals(lhs, rhs);
};

exports.associativity = function(a, b, c) {
  it('Semigroup associativity', function() {
    jsc.assert(jsc.forall(a, b, c, associativity));
  });
};
