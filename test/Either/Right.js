'use strict';

var FL = require('fantasy-land');

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');


describe('Right', function() {

  it('is a data constructor', function() {
    eq(typeof S.Right, 'function');
    eq(S.Right.length, 1);
    eq(S.Right(42)['@@type'], 'sanctuary/Either');
    eq(S.Right(42).isLeft, false);
    eq(S.Right(42).isRight, true);
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Right(1)[FL.alt].length, 1);
    eq(S.Right(1)[FL.alt](S.Left(2)), S.Right(1));
    eq(S.Right(1)[FL.alt](S.Right(2)), S.Right(1));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Right(42)[FL.ap].length, 1);
    eq(S.Right(42)[FL.ap](S.Left('abc')), S.Left('abc'));
    eq(S.Right(42)[FL.ap](S.Right(S.inc)), S.Right(43));
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Right(25)[FL.chain].length, 1);
    eq(S.Right(25)[FL.chain](squareRoot), S.Right(5));
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Right('abc')[FL.concat].length, 1);
    eq(S.Right('abc')[FL.concat](S.Left('xyz')), S.Right('abc'));
    eq(S.Right('abc')[FL.concat](S.Right('def')), S.Right('abcdef'));
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Right(42)[FL.equals].length, 1);
    eq(S.Right(42)[FL.equals](S.Right(42)), true);
    eq(S.Right(42)[FL.equals](S.Right('42')), false);
    eq(S.Right(42)[FL.equals](S.Left(42)), false);

    // Value-based equality:
    eq(S.Right(0)[FL.equals](S.Right(-0)), false);
    eq(S.Right(-0)[FL.equals](S.Right(0)), false);
    eq(S.Right(NaN)[FL.equals](S.Right(NaN)), true);
    eq(S.Right([1, 2, 3])[FL.equals](S.Right([1, 2, 3])), true);
    eq(S.Right(new Number(42))[FL.equals](S.Right(new Number(42))), true);
  });

  it('provides a "fantasy-land/extend" method', function() {
    eq(S.Right(42)[FL.extend].length, 1);
    eq(S.Right(42)[FL.extend](function(x) { return x.value / 2; }), S.Right(21));

    // associativity
    var w = S.Right(42);
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w[FL.extend](g)[FL.extend](f), w[FL.extend](function(_w) { return f(_w[FL.extend](g)); }));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Right(9)[FL.map].length, 1);
    eq(S.Right(9)[FL.map](Math.sqrt), S.Right(3));
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Right(5)[FL.reduce].length, 2);
    eq(S.Right(5)[FL.reduce](function(x, y) { return x - y; }, 42), 37);
  });

  it('provides a "toString" method', function() {
    eq(S.Right([1, 2, 3]).toString.length, 0);
    eq(S.Right([1, 2, 3]).toString(), 'Right([1, 2, 3])');
  });

  it('provides an "inspect" method', function() {
    eq(S.Right([1, 2, 3]).inspect.length, 0);
    eq(S.Right([1, 2, 3]).inspect(), 'Right([1, 2, 3])');
  });

});
