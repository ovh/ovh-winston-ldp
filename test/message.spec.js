"use strict";

var assert = require("chai").assert;
var Message = require("../lib/message.js");

describe("Message level", function () {
    var msg;

    beforeEach(function () {
        msg = new Message();
    });

    it("Should get e massage error on known message type", function (done) {
        assert.isNumber(msg.getMessageLevel("emerg"), "getMessageLevel does not return a number");
        assert.equal(msg.getMessageLevel("emerg"), 0, "getMessageLevel does not return the correct number");
        done();
    });

    it("Should get e massage error on unknown message type", function (done) {
        assert.isNumber(msg.getMessageLevel("bill"), "getMessageLevel does not return a number");
        assert.equal(msg.getMessageLevel("bill"), 6, "getMessageLevel does not return the correct number");
        done();
    });

});