'use strict';

var FL = require('fantasy-land');

var S = require('../..');

var eq = require('../internal/eq');


describe('Nothing', function() {

  it('is a member of the "Maybe a" type', function() {
    eq(S.Nothing['@@type'], 'sanctuary/Maybe');
    eq(S.Nothing.isNothing, true);
    eq(S.Nothing.isJust, false);
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Nothing[FL.alt].length, 1);
    eq(S.Nothing[FL.alt](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.alt](S.Just(1)), S.Just(1));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Nothing[FL.ap].length, 1);
    eq(S.Nothing[FL.ap](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.ap](S.Just(S.inc)), S.Nothing);
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Nothing[FL.chain].length, 1);
    eq(S.Nothing[FL.chain](S.head), S.Nothing);
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Nothing[FL.concat].length, 1);
    eq(S.Nothing[FL.concat](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.concat](S.Just('foo')), S.Just('foo'));
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Nothing[FL.equals].length, 1);
    eq(S.Nothing[FL.equals](S.Nothing), true);
    eq(S.Nothing[FL.equals](S.Just(42)), false);
  });

  it('provides a "fantasy-land/extend" method', function() {
    eq(S.Nothing[FL.extend].length, 1);
    eq(S.Nothing[FL.extend](function(x) { return x.value / 2; }), S.Nothing);

    // associativity
    var w = S.Nothing;
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w[FL.extend](g)[FL.extend](f), w[FL.extend](function(_w) { return f(_w[FL.extend](g)); }));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Nothing[FL.map].length, 1);
    eq(S.Nothing[FL.map](function() { return 42; }), S.Nothing);
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Nothing[FL.reduce].length, 2);
    eq(S.Nothing[FL.reduce](function(x, y) { return x - y; }, 42), 42);
  });

  it('provides a "toString" method', function() {
    eq(S.Nothing.toString.length, 0);
    eq(S.Nothing.toString(), 'Nothing');
  });

  it('provides an "inspect" method', function() {
    eq(S.Nothing.inspect.length, 0);
    eq(S.Nothing.inspect(), 'Nothing');
  });

});
