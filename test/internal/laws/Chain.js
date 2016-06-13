'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var associativity = function(a, f, g) {
  var lhs = Z.chain(g, Z.chain(f, a));
  var rhs = Z.chain(function(x) { return Z.chain(g, f(x)); }, a);
  return Z.equals(lhs, rhs);
};

exports.associativity = function(a, f, g) {
  it('Chain associativity', function() {
    jsc.assert(jsc.forall(a, f, g, associativity));
  });
};
