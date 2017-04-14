var server = require('./../server/server.js');
var assert = require('assert');
var should = require('chai').should();
var http = require('http');


describe('Api', function () {
    it('should return 200', function (done) {
        http.get('http://localhost:3000', function (res) {
            console.log("RESPONSE", res);
            done();
        });
    });
});

