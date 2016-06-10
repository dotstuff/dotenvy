'use strict';

var chai    = require('chai');
var path    = require('path');
var dotenvy = require('..');
var expect  = chai.expect;
var file    = path.join(__dirname, '.env');

before(function () {
    process.env = {};
    dotenvy(file);
});

it('sets env var', function () {
    expect(process.env).to.have.property('FOO');
    expect(process.env.FOO).to.equal('foo');
});

it('skips comments', function () {
    expect(process.env).to.not.have.property('BAR');
});
