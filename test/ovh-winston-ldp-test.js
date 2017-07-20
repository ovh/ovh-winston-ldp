"use strict";

const chai = require("chai");
const Message = require("../lib/message.js");
const OvhWinstonLDP = require("../lib/ovh-winston-ldp");
const spies = require("chai-spies");
const winston = require("winston");

chai.use(spies);

const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

describe("winston-graylog2", function () {
    describe("Creating the transport", function () {

        it("Have default properties when instantiated", function () {
            var OWLDP = new OvhWinstonLDP();
            assert.ok(OWLDP.name === "graylog2");
            assert.ok(OWLDP.level === "info");
            assert.ok(OWLDP.silent === false);
            assert.ok(OWLDP.handleExceptions === false);
        });

        it("Should have a log function", function () {
            var OWLDP = new OvhWinstonLDP();
            assert.ok(typeof OWLDP.log === "function");
        });

        it("Can be registered as winston transport", function () {
            var logger = new (winston.Logger)({
                exitOnError: false,
                transports: [new OvhWinstonLDP()]
            });

            assert.ok(logger.transports.hasOwnProperty("graylog2"));
        });

        it("Can be registered as winston transport using the add() function", function () {
            var logger = new (winston.Logger)({
                exitOnError: false,
                transports: []
            });

            logger.add(OvhWinstonLDP);

            assert.ok(logger.transports.hasOwnProperty("graylog2"));
        });
    });

    describe("Validating the transport", function () {
        var ovhWinstonLDP;

        beforeEach(function () {
            ovhWinstonLDP = new OvhWinstonLDP();
        });

        it("Calling close() when existing client, will close that client socket", function () {
            ovhWinstonLDP.client = {
                end : chai.spy()
            };

            ovhWinstonLDP.close();

            expect(ovhWinstonLDP.client.end).to.have.been.called.once();
        });

        it("Calling close() when client was not created, will not raise an exeption", function () {
            should.not.exist(ovhWinstonLDP.client);

            ovhWinstonLDP.close();
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
