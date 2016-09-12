'use strict';

var FL = require('fantasy-land');
var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../internal/sanctuary');

var Identity = require('../internal/Identity');
var add_ = require('../internal/add_');
var eq = require('../internal/eq');
var laws = require('../internal/laws');
var throws = require('../internal/throws');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
var IdentityArb = function(arb) {
  return arb.smap(Identity, function(i) { return i.value; });
};

//  EitherArb :: (Arbitrary a, Arbitrary b) -> Arbitrary (Either a b)
var EitherArb = function(lArb, rArb) {
  var f = function(either) { return either.value; };
  return jsc.oneof(lArb.smap(S.Left, f, Z.toString),
                   rArb.smap(S.Right, f, Z.toString));
};

//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
var MaybeArb = function(arb) {
  var f = function(maybe) { return maybe.value; };
  return jsc.oneof(arb.smap(S.Just, f, Z.toString),
                   jsc.constant(S.Nothing));
};


describe('Maybe', function() {

  it('throws if called', function() {
    throws(function() { S.Maybe(); }, Error, 'Cannot instantiate Maybe');
  });

  it('has a "nullary" data constructor named Nothing', function() {
    eq(S.Nothing['@@type'], 'sanctuary/Maybe');
    eq(S.Nothing.isNothing, true);
    eq(S.Nothing.isJust, false);
  });

  it('has a unary data constructor named Just', function() {
    eq(typeof S.Just, 'function');
    eq(S.Just.length, 1);
    eq(S.Just.toString(), 'Just :: a -> Maybe a');
    eq(S.Just(9)['@@type'], 'sanctuary/Maybe');
    eq(S.Just(9).isNothing, false);
    eq(S.Just(9).isJust, true);
  });

  it('provides a "toString" method', function() {
    eq(S.Nothing.toString.length, 0);
    eq(S.Nothing.toString(), 'Nothing');

    eq(S.Just([1, 2, 3]).toString.length, 0);
    eq(S.Just([1, 2, 3]).toString(), 'Just([1, 2, 3])');
  });

  it('provides an "inspect" method', function() {
    eq(S.Nothing.inspect.length, 0);
    eq(S.Nothing.inspect(), 'Nothing');

    eq(S.Just([1, 2, 3]).inspect.length, 0);
    eq(S.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Nothing[FL.equals].length, 1);
    eq(S.Nothing[FL.equals](S.Nothing), true);
    eq(S.Nothing[FL.equals](S.Just(9)), false);

    eq(S.Just(9)[FL.equals].length, 1);
    eq(S.Just(9)[FL.equals](S.Just(9)), true);
    eq(S.Just(9)[FL.equals](S.Just(0)), false);
    eq(S.Just(9)[FL.equals](S.Nothing), false);

    // Value-based equality:
    eq(S.Just(0)[FL.equals](S.Just(-0)), false);
    eq(S.Just(-0)[FL.equals](S.Just(0)), false);
    eq(S.Just(NaN)[FL.equals](S.Just(NaN)), true);
    eq(S.Just([1, 2, 3])[FL.equals](S.Just([1, 2, 3])), true);
    eq(S.Just(new Number(42))[FL.equals](S.Just(new Number(42))), true);
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Nothing[FL.concat].length, 1);
    eq(S.Nothing[FL.concat](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.concat](S.Just('foo')), S.Just('foo'));

    eq(S.Just('foo')[FL.concat].length, 1);
    eq(S.Just('foo')[FL.concat](S.Nothing), S.Just('foo'));
    eq(S.Just('foo')[FL.concat](S.Just('bar')), S.Just('foobar'));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Nothing[FL.map].length, 1);
    eq(S.Nothing[FL.map](Math.sqrt), S.Nothing);

    eq(S.Just(9)[FL.map].length, 1);
    eq(S.Just(9)[FL.map](Math.sqrt), S.Just(3));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Nothing[FL.ap].length, 1);
    eq(S.Nothing[FL.ap](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.ap](S.Just(S.inc)), S.Nothing);

    eq(S.Just(42)[FL.ap].length, 1);
    eq(S.Just(42)[FL.ap](S.Nothing), S.Nothing);
    eq(S.Just(42)[FL.ap](S.Just(S.inc)), S.Just(43));
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Nothing[FL.chain].length, 1);
    eq(S.Nothing[FL.chain](S.head), S.Nothing);

    eq(S.Just([1, 2, 3])[FL.chain].length, 1);
    eq(S.Just([1, 2, 3])[FL.chain](S.head), S.Just(1));
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Nothing[FL.alt].length, 1);
    eq(S.Nothing[FL.alt](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.alt](S.Just(1)), S.Just(1));

    eq(S.Just(1)[FL.alt].length, 1);
    eq(S.Just(1)[FL.alt](S.Nothing), S.Just(1));
    eq(S.Just(1)[FL.alt](S.Just(2)), S.Just(1));
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Nothing[FL.reduce].length, 2);
    eq(S.Nothing[FL.reduce](add_, 0), 0);

    eq(S.Just(9)[FL.reduce].length, 2);
    eq(S.Just(9)[FL.reduce](add_, 0), 9);
  });

  it('provides a "fantasy-land/traverse" method', function() {
    var duplicate = function(x) { return [x, x]; };

    eq(S.Nothing[FL.traverse].length, 2);
    eq(S.Nothing[FL.traverse](duplicate, S.of(Array)), [S.Nothing]);

    eq(S.Just(9)[FL.traverse].length, 2);
    eq(S.Just(9)[FL.traverse](duplicate, S.of(Array)), [S.Just(9), S.Just(9)]);
  });

  it('provides a "fantasy-land/extend" method', function() {
    var sqrt = function(maybe) { return Math.sqrt(maybe.value); };

    eq(S.Nothing[FL.extend].length, 1);
    eq(S.Nothing[FL.extend](sqrt), S.Nothing);

    eq(S.Just(9)[FL.extend].length, 1);
    eq(S.Just(9)[FL.extend](sqrt), S.Just(3));
  });

  laws.Setoid.reflexivity(
    MaybeArb(jsc.integer)
  );

  laws.Setoid.symmetry(
    MaybeArb(jsc.integer),
    MaybeArb(jsc.integer)
  );

  laws.Setoid.transitivity(
    MaybeArb(jsc.integer(1)),
    MaybeArb(jsc.integer(1)),
    MaybeArb(jsc.integer(1))
  );

  laws.Semigroup.associativity(
    MaybeArb(jsc.string),
    MaybeArb(jsc.string),
    MaybeArb(jsc.string)
  );

  laws.Monoid.leftIdentity(
    MaybeArb(jsc.string)
  );

  laws.Monoid.rightIdentity(
    MaybeArb(jsc.string)
  );

  laws.Functor.identity(
    MaybeArb(jsc.nat)
  );

  laws.Functor.composition(
    MaybeArb(jsc.nat),
    jsc.constant(S.inc),
    jsc.constant(Math.sqrt)
  );

  laws.Apply.composition(
    MaybeArb(jsc.elements([S.dec, S.inc, Math.sqrt])),
    MaybeArb(jsc.elements([S.dec, S.inc, Math.sqrt])),
    MaybeArb(jsc.nat)
  );

  laws.Applicative.identity(
    MaybeArb(jsc.elements([S.dec, S.inc, Math.sqrt]))
  );

  laws.Applicative.homomorphism(
    MaybeArb(jsc.elements([S.dec, S.inc, Math.sqrt])),
    jsc.elements([S.dec, S.inc, Math.sqrt]),
    jsc.nat
  );

  laws.Applicative.interchange(
    MaybeArb(jsc.elements([S.dec, S.inc, Math.sqrt])),
    jsc.elements([S.dec, S.inc, Math.sqrt]),
    jsc.nat
  );

  laws.Chain.associativity(
    MaybeArb(jsc.array(jsc.string)),
    jsc.constant(S.head),
    jsc.constant(S.last)
  );

  laws.Monad.leftIdentity(
    MaybeArb(jsc.nat),
    jsc.constant(S.head),
    jsc.string
  );

  laws.Monad.rightIdentity(
    MaybeArb(jsc.nat),
    jsc.string
  );

  laws.Foldable.associativity(
    jsc.constant(add_),
    MaybeArb(jsc.integer)
  );

  laws.Traversable.naturality(
    jsc.constant(S.Either),
    jsc.constant(S.Maybe),
    jsc.constant(S.eitherToMaybe),
    MaybeArb(EitherArb(jsc.integer, jsc.string))
  );

  laws.Traversable.identity(
    jsc.constant(S.Either),
    MaybeArb(EitherArb(jsc.integer, jsc.string))
  );

  laws.Traversable.composition(
    jsc.constant(S.Maybe),
    jsc.constant(Identity),
    MaybeArb(IdentityArb(MaybeArb(jsc.integer)))
  );

  laws.Extend.associativity(
    jsc.constant(function(maybe) { return (maybe.isJust ? maybe.value : 0) + 1; }),
    jsc.constant(function(maybe) { return (maybe.isJust ? maybe.value : 0) * 2; }),
    MaybeArb(jsc.integer)
  );

});
