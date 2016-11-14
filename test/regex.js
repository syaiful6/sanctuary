'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('regex', function() {

  it('is a binary function', function() {
    eq(typeof S.regex, 'function');
    eq(S.regex.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.regex('y'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'regex :: ("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim") -> String -> RegExp\n' +
                   '         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  "y" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim")’.\n'));

    throws(function() { S.regex('G'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'regex :: ("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim") -> String -> RegExp\n' +
                   '         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  "G" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim")’.\n'));

    throws(function() { S.regex('ig'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'regex :: ("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim") -> String -> RegExp\n' +
                   '         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  "ig" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim")’.\n'));

    var G = function G() {};
    G.prototype.toString = R.always('g');

    throws(function() { S.regex(new G()); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'regex :: ("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim") -> String -> RegExp\n' +
                   '         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  g :: Object, StrMap ???\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim")’.\n'));

    throws(function() { S.regex('', /(?:)/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'regex :: ("" | "g" | "i" | "m" | "gi" | "gm" | "im" | "gim") -> String -> RegExp\n' +
                   '                                                                ^^^^^^\n' +
                   '                                                                  1\n' +
                   '\n' +
                   '1)  /(?:)/ :: RegExp, NonGlobalRegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns a RegExp', function() {
    eq(S.regex('', '\\d'), /\d/);
    eq(S.regex('g', '\\d'), /\d/g);
    eq(S.regex('i', '\\d'), /\d/i);
    eq(S.regex('m', '\\d'), /\d/m);
    eq(S.regex('gi', '\\d'), /\d/gi);
    eq(S.regex('gm', '\\d'), /\d/gm);
    eq(S.regex('im', '\\d'), /\d/im);
    eq(S.regex('gim', '\\d'), /\d/gim);
  });

});
