"use strict";

var assert = require("chai").assert;
var winston = require("winston");
var OvhWinstonLDP = require("../lib/ovh-winston-ldp");
var Message = require("../lib/message.js");

describe("winston-graylog2", function () {
    describe("Creating the transport", function () {

        it("Have default properties when instantiated", function () {
            var OWLDP = new OvhWinstonLDP();
            assert.ok(OWLDP.name === "graylog2");
            assert.ok(OWLDP.level === "info");
            assert.ok(OWLDP.silent === false);
            assert.ok(OWLDP.handleExceptions === false);
        });

        it("should have a log function", function () {
            var OWLDP = new OvhWinstonLDP();
            assert.ok(typeof OWLDP.log === "function");
        });

        it("can be registered as winston transport", function () {
            var logger = new (winston.Logger)({
                exitOnError: false,
                transports: [new OvhWinstonLDP()]
            });

            assert.ok(logger.transports.hasOwnProperty("graylog2"));
        });

        it("can be registered as winston transport using the add() function", function () {
            var logger = new (winston.Logger)({
                exitOnError: false,
                transports: []
            });

            logger.add(OvhWinstonLDP);

            assert.ok(logger.transports.hasOwnProperty("graylog2"));
        });

    });
});

describe("Message content", function () {
    var logger;

    beforeEach(function () {
        logger = new OvhWinstonLDP();
    });

    it("Message should end with 0", function (done) {
        var msg = logger.getStrMessage("hello", {}, "emerg");
        assert.equal(msg[msg.length - 1], "\u0000", "Message should terminate with 0");
        done();
    });

    it("Message should be parsable to JSON", function (done) {
        var msg = logger.getStrMessage(new Message("hello", { hello: "world" }, "emerg"));
        try {
            msg = msg.substr(0, msg.length - 1);
            var parsed = JSON.parse(msg);
            assert.isObject(parsed, "Message should be JSON");
            done();
        } catch (err) {
            done(err);
        }
    });

});
