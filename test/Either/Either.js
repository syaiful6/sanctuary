'use strict';

var FL = require('fantasy-land');
var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var S = require('../internal/sanctuary');

var Identity = require('../internal/Identity');
var add_ = require('../internal/add_');
var append_ = require('../internal/append_');
var eq = require('../internal/eq');
var laws = require('../internal/laws');
var parseHex = require('../internal/parseHex');
var squareRoot = require('../internal/squareRoot');
var throws = require('../internal/throws');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
var IdentityArb = function(arb) {
  return arb.smap(Identity, function(i) { return i.value; });
};

//  identityToMaybe :: Identity a -> Maybe a
var identityToMaybe = function(i) {
  return S.Just(i.value);
};

//  EitherArb :: (Arbitrary a, Arbitrary b) -> Arbitrary (Either a b)
var EitherArb = function(lArb, rArb) {
  var f = function(either) { return either.value; };
  return jsc.oneof(lArb.smap(S.Left, f, Z.toString),
                   rArb.smap(S.Right, f, Z.toString));
};


describe('Either', function() {

  it('throws if called', function() {
    throws(function() { S.Either(); }, Error, 'Cannot instantiate Either');
  });

  it('has a unary data constructor named Left', function() {
    eq(typeof S.Left, 'function');
    eq(S.Left.length, 1);
    eq(S.Left.toString(), 'Left :: a -> Either a b');
    eq(S.Left(42)['@@type'], 'sanctuary/Either');
    eq(S.Left(42).isLeft, true);
    eq(S.Left(42).isRight, false);
  });

  it('has a unary data constructor named Right', function() {
    eq(typeof S.Right, 'function');
    eq(S.Right.length, 1);
    eq(S.Right.toString(), 'Right :: b -> Either a b');
    eq(S.Right(42)['@@type'], 'sanctuary/Either');
    eq(S.Right(42).isLeft, false);
    eq(S.Right(42).isRight, true);
  });

  it('provides a "toString" method', function() {
    eq(S.Left('abc').toString.length, 0);
    eq(S.Left('abc').toString(), 'Left("abc")');

    eq(S.Right([1, 2, 3]).toString.length, 0);
    eq(S.Right([1, 2, 3]).toString(), 'Right([1, 2, 3])');
  });

  it('provides an "inspect" method', function() {
    eq(S.Left('abc').inspect.length, 0);
    eq(S.Left('abc').inspect(), 'Left("abc")');

    eq(S.Right([1, 2, 3]).inspect.length, 0);
    eq(S.Right([1, 2, 3]).inspect(), 'Right([1, 2, 3])');
  });

  it('provides a "fantasy-land/equals" method', function() {
    eq(S.Left(42)[FL.equals].length, 1);
    eq(S.Left(42)[FL.equals](S.Left(42)), true);
    eq(S.Left(42)[FL.equals](S.Left('42')), false);
    eq(S.Left(42)[FL.equals](S.Right(42)), false);

    eq(S.Right(42)[FL.equals].length, 1);
    eq(S.Right(42)[FL.equals](S.Right(42)), true);
    eq(S.Right(42)[FL.equals](S.Right('42')), false);
    eq(S.Right(42)[FL.equals](S.Left(42)), false);

    // Value-based equality:
    eq(S.Left(0)[FL.equals](S.Left(-0)), false);
    eq(S.Left(-0)[FL.equals](S.Left(0)), false);
    eq(S.Left(NaN)[FL.equals](S.Left(NaN)), true);
    eq(S.Left([1, 2, 3])[FL.equals](S.Left([1, 2, 3])), true);
    eq(S.Left(new Number(42))[FL.equals](S.Left(new Number(42))), true);

    eq(S.Right(0)[FL.equals](S.Right(-0)), false);
    eq(S.Right(-0)[FL.equals](S.Right(0)), false);
    eq(S.Right(NaN)[FL.equals](S.Right(NaN)), true);
    eq(S.Right([1, 2, 3])[FL.equals](S.Right([1, 2, 3])), true);
    eq(S.Right(new Number(42))[FL.equals](S.Right(new Number(42))), true);
  });

  it('provides a "fantasy-land/concat" method', function() {
    eq(S.Left('abc')[FL.concat].length, 1);
    eq(S.Left('abc')[FL.concat](S.Left('def')), S.Left('abcdef'));
    eq(S.Left('abc')[FL.concat](S.Right('xyz')), S.Right('xyz'));

    eq(S.Right('abc')[FL.concat].length, 1);
    eq(S.Right('abc')[FL.concat](S.Left('xyz')), S.Right('abc'));
    eq(S.Right('abc')[FL.concat](S.Right('def')), S.Right('abcdef'));
  });

  it('provides a "fantasy-land/map" method', function() {
    eq(S.Left('abc')[FL.map].length, 1);
    eq(S.Left('abc')[FL.map](Math.sqrt), S.Left('abc'));

    eq(S.Right(9)[FL.map].length, 1);
    eq(S.Right(9)[FL.map](Math.sqrt), S.Right(3));
  });

  it('provides a "fantasy-land/ap" method', function() {
    eq(S.Left('abc')[FL.ap].length, 1);
    eq(S.Left('abc')[FL.ap](S.Left('xyz')), S.Left('xyz'));
    eq(S.Left('abc')[FL.ap](S.Right(S.inc)), S.Left('abc'));

    eq(S.Right(42)[FL.ap].length, 1);
    eq(S.Right(42)[FL.ap](S.Left('abc')), S.Left('abc'));
    eq(S.Right(42)[FL.ap](S.Right(S.inc)), S.Right(43));
  });

  it('provides a "fantasy-land/chain" method', function() {
    eq(S.Left('abc')[FL.chain].length, 1);
    eq(S.Left('abc')[FL.chain](function(x) { return x < 0 ? S.Left('!') : S.Right(Math.sqrt(x)); }), S.Left('abc'));

    eq(S.Right(25)[FL.chain].length, 1);
    eq(S.Right(25)[FL.chain](function(x) { return x < 0 ? S.Left('!') : S.Right(Math.sqrt(x)); }), S.Right(5));
  });

  it('provides a "fantasy-land/alt" method', function() {
    eq(S.Left(1)[FL.alt].length, 1);
    eq(S.Left(1)[FL.alt](S.Left(2)), S.Left(2));
    eq(S.Left(1)[FL.alt](S.Right(2)), S.Right(2));

    eq(S.Right(1)[FL.alt].length, 1);
    eq(S.Right(1)[FL.alt](S.Left(2)), S.Right(1));
    eq(S.Right(1)[FL.alt](S.Right(2)), S.Right(1));
  });

  it('provides a "fantasy-land/reduce" method', function() {
    eq(S.Left('abc')[FL.reduce].length, 2);
    eq(S.Left('abc')[FL.reduce](append_, [42]), [42]);

    eq(S.Right(5)[FL.reduce].length, 2);
    eq(S.Right(5)[FL.reduce](append_, [42]), [42, 5]);
  });

  it('provides a "fantasy-land/traverse" method', function() {
    eq(S.Left('abc')[FL.traverse].length, 2);
    eq(S.Left('abc')[FL.traverse](S.parseInt(16), S.Just), S.Just(S.Left('abc')));

    eq(S.Right('F')[FL.traverse].length, 2);
    eq(S.Right('F')[FL.traverse](S.parseInt(16), S.Just), S.Just(S.Right(15)));
    eq(S.Right('G')[FL.traverse](S.parseInt(16), S.Just), S.Nothing);
  });

  it('provides a "fantasy-land/extend" method', function() {
    eq(S.Left('abc')[FL.extend].length, 1);
    eq(S.Left('abc')[FL.extend](function(x) { return x.value / 2; }), S.Left('abc'));

    eq(S.Right(42)[FL.extend].length, 1);
    eq(S.Right(42)[FL.extend](function(x) { return x.value / 2; }), S.Right(21));
  });

  laws.Setoid.reflexivity(
    EitherArb(jsc.string, jsc.integer)
  );

  laws.Setoid.symmetry(
    EitherArb(jsc.string, jsc.integer),
    EitherArb(jsc.string, jsc.integer)
  );

  laws.Setoid.transitivity(
    EitherArb(jsc.string, jsc.integer(1)),
    EitherArb(jsc.string, jsc.integer(1)),
    EitherArb(jsc.string, jsc.integer(1))
  );

  laws.Semigroup.associativity(
    EitherArb(jsc.string, jsc.array(jsc.integer)),
    EitherArb(jsc.string, jsc.array(jsc.integer)),
    EitherArb(jsc.string, jsc.array(jsc.integer))
  );

  laws.Functor.identity(
    EitherArb(jsc.string, jsc.nat)
  );

  laws.Functor.composition(
    EitherArb(jsc.string, jsc.nat),
    jsc.constant(S.inc),
    jsc.constant(Math.sqrt)
  );

  laws.Apply.composition(
    EitherArb(jsc.string, jsc.elements([S.dec, S.inc, Math.sqrt])),
    EitherArb(jsc.string, jsc.elements([S.dec, S.inc, Math.sqrt])),
    EitherArb(jsc.string, jsc.nat)
  );

  laws.Applicative.identity(
    EitherArb(jsc.string, jsc.elements([S.dec, S.inc, Math.sqrt]))
  );

  laws.Applicative.homomorphism(
    EitherArb(jsc.string, jsc.elements([S.dec, S.inc, Math.sqrt])),
    jsc.elements([S.dec, S.inc, Math.sqrt]),
    jsc.nat
  );

  laws.Applicative.interchange(
    EitherArb(jsc.string, jsc.elements([S.dec, S.inc, Math.sqrt])),
    jsc.elements([S.dec, S.inc, Math.sqrt]),
    jsc.nat
  );

  laws.Chain.associativity(
    EitherArb(jsc.string, jsc.string),
    jsc.constant(parseHex),
    jsc.constant(squareRoot)
  );

  laws.Monad.leftIdentity(
    EitherArb(jsc.string, jsc.nat),
    jsc.constant(squareRoot),
    jsc.nat
  );

  laws.Monad.rightIdentity(
    EitherArb(jsc.string, jsc.nat),
    jsc.nat
  );

  laws.Foldable.associativity(
    jsc.constant(add_),
    EitherArb(jsc.string, jsc.integer)
  );

  laws.Traversable.naturality(
    jsc.constant(Identity),
    jsc.constant(S.Maybe),
    jsc.constant(identityToMaybe),
    EitherArb(jsc.string, IdentityArb(jsc.integer))
  );

  laws.Traversable.identity(
    jsc.constant(Identity),
    EitherArb(jsc.string, IdentityArb(jsc.integer))
  );

  laws.Traversable.composition(
    jsc.constant(S.Either),
    jsc.constant(Identity),
    EitherArb(jsc.string, IdentityArb(EitherArb(jsc.string, jsc.integer)))
  );

  laws.Extend.associativity(
    jsc.constant(function(either) { return (either.isRight ? either.value : 0) + 1; }),
    jsc.constant(function(either) { return (either.isRight ? either.value : 0) * 2; }),
    EitherArb(jsc.string, jsc.integer)
  );

});
