'use strict';

var FL = require('fantasy-land');

var S = require('../..');

var eq = require('../internal/eq');


describe('Just', function() {

  it('is a data constructor', function() {
    eq(typeof S.Just, 'function');
    eq(S.Just.length, 1);
    eq(S.Just(42)['@@type'], 'sanctuary/Maybe');
    eq(S.Just(42).isNothing, false);
    eq(S.Just(42).isJust, true);
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Just(1)[FL.alt].length, 1);
    eq(S.Just(1)[FL.alt](S.Nothing), S.Just(1));
    eq(S.Just(1)[FL.alt](S.Just(2)), S.Just(1));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Just(42)[FL.ap].length, 1);
    eq(S.Just(42)[FL.ap](S.Nothing), S.Nothing);
    eq(S.Just(42)[FL.ap](S.Just(S.inc)), S.Just(43));
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Just([1, 2, 3])[FL.chain].length, 1);
    eq(S.Just([1, 2, 3])[FL.chain](S.head), S.Just(1));
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Just('foo')[FL.concat].length, 1);
    eq(S.Just('foo')[FL.concat](S.Nothing), S.Just('foo'));
    eq(S.Just('foo')[FL.concat](S.Just('bar')), S.Just('foobar'));
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Just(42)[FL.equals].length, 1);
    eq(S.Just(42)[FL.equals](S.Just(42)), true);
    eq(S.Just(42)[FL.equals](S.Just(43)), false);
    eq(S.Just(42)[FL.equals](S.Nothing), false);

    // Value-based equality:
    eq(S.Just(0)[FL.equals](S.Just(-0)), false);
    eq(S.Just(-0)[FL.equals](S.Just(0)), false);
    eq(S.Just(NaN)[FL.equals](S.Just(NaN)), true);
    eq(S.Just([1, 2, 3])[FL.equals](S.Just([1, 2, 3])), true);
    eq(S.Just(new Number(42))[FL.equals](S.Just(new Number(42))), true);
  });

  it('provides a "fantasy-land/extend" method', function() {
    eq(S.Just(42)[FL.extend].length, 1);
    eq(S.Just(42)[FL.extend](function(x) { return x.value / 2; }), S.Just(21));

    // associativity
    var w = S.Just(42);
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w[FL.extend](g)[FL.extend](f), w[FL.extend](function(_w) { return f(_w[FL.extend](g)); }));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Just(42)[FL.map].length, 1);
    eq(S.Just(42)[FL.map](function(x) { return x / 2; }), S.Just(21));
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Just(5)[FL.reduce].length, 2);
    eq(S.Just(5)[FL.reduce](function(x, y) { return x - y; }, 42), 37);
  });

  it('provides a "toString" method', function() {
    eq(S.Just([1, 2, 3]).toString.length, 0);
    eq(S.Just([1, 2, 3]).toString(), 'Just([1, 2, 3])');
  });

  it('provides an "inspect" method', function() {
    eq(S.Just([1, 2, 3]).inspect.length, 0);
    eq(S.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

});
