'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../../..');


var composition = function(a, b, c) {
  var lhs = Z.ap(Z.ap(Z.map(S.compose, a), b), c);
  var rhs = Z.ap(a, Z.ap(b, c));
  return Z.equals(lhs, rhs);
};

exports.composition = function(a, b, c) {
  it('Apply composition', function() {
    jsc.assert(jsc.forall(a, b, c, composition));
  });
};
