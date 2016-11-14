'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('matchAll', function() {

  it('is a binary function', function() {
    eq(typeof S.matchAll, 'function');
    eq(S.matchAll.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.matchAll(/[a-z]/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'matchAll :: GlobalRegExp -> String -> Array { groups :: Array (Maybe String), match :: String }\n' +
                   '            ^^^^^^^^^^^^\n' +
                   '                 1\n' +
                   '\n' +
                   '1)  /[a-z]/ :: RegExp, NonGlobalRegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘GlobalRegExp’.\n'));

    throws(function() { S.matchAll(/(?:)/g, /(?:)/g); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'matchAll :: GlobalRegExp -> String -> Array { groups :: Array (Maybe String), match :: String }\n' +
                   '                            ^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  /(?:)/g :: RegExp, GlobalRegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns all matches', function() {
    var pattern = S.regex('g', '<(h[1-6])(?: id="([^"]*)")?>([^<]*)</\\1>');

    eq(S.matchAll(pattern, ''), []);

    eq(S.matchAll(pattern, '<h1>Foo</h1>\n<h2 id="bar">Bar</h2>\n<h2 id="baz">Baz</h2>\n'),
       [{match: '<h1>Foo</h1>', groups: [S.Just('h1'), S.Nothing, S.Just('Foo')]},
        {match: '<h2 id="bar">Bar</h2>', groups: [S.Just('h2'), S.Just('bar'), S.Just('Bar')]},
        {match: '<h2 id="baz">Baz</h2>', groups: [S.Just('h2'), S.Just('baz'), S.Just('Baz')]}]);

    eq(pattern.lastIndex, 0);
  });

});
