'use strict';

var FL = require('fantasy-land');

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');


describe('Left', function() {

  it('is a data constructor', function() {
    eq(typeof S.Left, 'function');
    eq(S.Left.length, 1);
    eq(S.Left(42)['@@type'], 'sanctuary/Either');
    eq(S.Left(42).isLeft, true);
    eq(S.Left(42).isRight, false);
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Left(1)[FL.alt].length, 1);
    eq(S.Left(1)[FL.alt](S.Left(2)), S.Left(2));
    eq(S.Left(1)[FL.alt](S.Right(2)), S.Right(2));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Left('abc')[FL.ap].length, 1);
    eq(S.Left('abc')[FL.ap](S.Left('xyz')), S.Left('xyz'));
    eq(S.Left('abc')[FL.ap](S.Right(S.inc)), S.Left('abc'));
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Left('abc')[FL.chain].length, 1);
    eq(S.Left('abc')[FL.chain](squareRoot), S.Left('abc'));
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Left('abc')[FL.concat].length, 1);
    eq(S.Left('abc')[FL.concat](S.Left('def')), S.Left('abcdef'));
    eq(S.Left('abc')[FL.concat](S.Right('xyz')), S.Right('xyz'));
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Left(42)[FL.equals].length, 1);
    eq(S.Left(42)[FL.equals](S.Left(42)), true);
    eq(S.Left(42)[FL.equals](S.Left('42')), false);
    eq(S.Left(42)[FL.equals](S.Right(42)), false);

    // Value-based equality:
    eq(S.Left(0)[FL.equals](S.Left(-0)), false);
    eq(S.Left(-0)[FL.equals](S.Left(0)), false);
    eq(S.Left(NaN)[FL.equals](S.Left(NaN)), true);
    eq(S.Left([1, 2, 3])[FL.equals](S.Left([1, 2, 3])), true);
    eq(S.Left(new Number(42))[FL.equals](S.Left(new Number(42))), true);
  });

  it('provides a "fantasy-land/extend" method', function() {
    eq(S.Left('abc')[FL.extend].length, 1);
    eq(S.Left('abc')[FL.extend](function(x) { return x / 2; }), S.Left('abc'));

    // associativity
    var w = S.Left('abc');
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w[FL.extend](g)[FL.extend](f), w[FL.extend](function(_w) { return f(_w[FL.extend](g)); }));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Left('abc')[FL.map].length, 1);
    eq(S.Left('abc')[FL.map](Math.sqrt), S.Left('abc'));
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Left('abc')[FL.reduce].length, 2);
    eq(S.Left('abc')[FL.reduce](function(x, y) { return x - y; }, 42), 42);
  });

  it('provides a "toString" method', function() {
    eq(S.Left('abc').toString.length, 0);
    eq(S.Left('abc').toString(), 'Left("abc")');
  });

  it('provides an "inspect" method', function() {
    eq(S.Left('abc').inspect.length, 0);
    eq(S.Left('abc').inspect(), 'Left("abc")');
  });

});
