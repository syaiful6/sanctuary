'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var associativity = function(f, g, w) {
  var lhs = Z.extend(f, Z.extend(g, w));
  var rhs = Z.extend(function(_w) { return f(Z.extend(g, _w)); }, w);
  return Z.equals(lhs, rhs);
};

exports.associativity = function(f, g, w) {
  it('Extend associativity', function() {
    jsc.assert(jsc.forall(f, g, w, associativity));
  });
};
