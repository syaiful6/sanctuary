'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('trim', function() {

  it('is a unary function', function() {
    eq(typeof S.trim, 'function');
    eq(S.trim.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.trim(/XXX/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'trim :: String -> String\n' +
                   '        ^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  /XXX/ :: RegExp, NonGlobalRegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('strips leading and trailing whitespace characters', function() {
    eq(S.trim(''), '');
    eq(S.trim(' '), '');
    eq(S.trim('x'), 'x');
    eq(S.trim(' x'), 'x');
    eq(S.trim('x '), 'x');
    eq(S.trim(' x '), 'x');
    eq(S.trim('\n\r\t x \n\r\t x \n\r\t'), 'x \n\r\t x');
  });

});
