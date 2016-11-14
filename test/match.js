'use strict';

var throws = require('assert').throws;

var jsc = require('jsverify');
var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('match', function() {

  it('is a binary function', function() {
    eq(typeof S.match, 'function');
    eq(S.match.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.match(/[a-z]/g); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'match :: NonGlobalRegExp -> String -> Maybe { groups :: Array (Maybe String), match :: String }\n' +
                   '         ^^^^^^^^^^^^^^^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  /[a-z]/g :: RegExp, GlobalRegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘NonGlobalRegExp’.\n'));

    throws(function() { S.match(/(?:)/, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'match :: NonGlobalRegExp -> String -> Maybe { groups :: Array (Maybe String), match :: String }\n' +
                   '                            ^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns the first match', function() {
    var scheme = '([a-z][a-z0-9+.-]*)';
    var authentication = '(.*?):(.*?)@';
    var hostname = '(.*?)';
    var port = ':([0-9]*)';
    var pattern = S.regex('', scheme + '://(?:' + authentication + ')?' + hostname + '(?:' + port + ')?(?!\\S)');

    eq(S.match(pattern, 'URL: N/A'),
       S.Nothing);

    eq(S.match(pattern, 'URL: http://example.com'),
       S.Just({match: 'http://example.com',
               groups: [S.Just('http'), S.Nothing, S.Nothing, S.Just('example.com'), S.Nothing]}));

    eq(S.match(pattern, 'URL: http://user:pass@example.com:80'),
       S.Just({match: 'http://user:pass@example.com:80',
               groups: [S.Just('http'), S.Just('user'), S.Just('pass'), S.Just('example.com'), S.Just('80')]}));
  });

  it('property: head(matchAll(regex("g", p), s)) = match(regex("", p), s)', function() {
    var p = '([A-Za-z]+)';
    jsc.assert(jsc.forall(jsc.string, function(s) {
      var lhs = S.head(S.matchAll(S.regex('g', p), s));
      var rhs = S.match(S.regex('', p), s);
      return R.equals(lhs, rhs);
    }), {tests: 1000});
  });

});
