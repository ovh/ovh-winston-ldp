"use strict";

const winston = require("winston");
const tls = require("tls");
const Message = require("./message.js");
const OS = require("os");

/**
 * Constructor
 * @param {Object}   options  Configuration options
 * @param {Function} callback Callback function invoked when ready
 */
class OvhWinstonLDP extends winston.Transport {

    constructor(options = {}) {
        super();

        let extendedOptions = Object.assign({
            level: "info",
            silent: false,
            graylogHost: "discover.logs.ovh.com",
            graylogPort: 12202,
            graylogHostname: OS.hostname(),
            graylogFacility: "NodeJS",
            graylogFlag: "no_flag",
            graylogOvhTokenKey: "X-OVH-TOKEN",
            graylogOvhTokenValue: "no_value",
            handleExceptions: false
        }, options);

        Object.keys(extendedOptions).forEach(key => {
            this[key] = extendedOptions[key];
        });

        this.name = "graylog2";

        // Stack of message to flush when connected
        this.messageStack = [];
    }

    /**
     * Create a new client if not connected and flush the stack of messages
     */
    getSocket(callback) {
        // secure callback function if not defined
        callback = (typeof callback === "function") ? callback : function () {};

        // Already connected or on the way to be connected ?
        if (this.clientReady() || this.connecting) {
            callback();
            return;
        }

        // Perform the connection
        this.connecting = true;
        this.client = tls.connect(this.graylogPort, this.graylogHost, () => {
            delete this.connecting;
            this.messageStack.forEach((message) => {
                this.flushMessage(message);
            });
            this.messageStack = [];
            callback();
        });

        this.client.on("error", (err) => {
            this.client.end();
            console.log("[FATAL LOGGER]", err);
        });

        return;
    }

    /**
     * Close ovh-winston-ldp transport, called within Winston.close()
     */
    close() {
        if (this.client) {
            this.client.end();
        }
    }

    /**
     * Send a message to graylog
     * @param {Message} message Message to send
     */
    flushMessage(message) {
        if (this.clientReady()) {
            this.client.write(this.getStrMessage(message));
        } else {
            console.log(message);
        }
    }

    /**
     * Try to send a message to graylog or stask it
     * @param {Message} message Message to send
     */
    sendMessage(message) {
        if (this.clientReady()) {
            this.flushMessage(message);
        } else {
            this.messageStack.push(message);
        }
    }

    /**
     * Is the TLS client ready ?
     * @return {Bool}
     */
    clientReady() {
        return this.client && this.client.getProtocol && !!this.client.getProtocol() && this.client.authorized;
    }

    /**
     * Convert meta object in winston JSON string
     * @param  {Message} message  Main message
     * @return {String}
     */
    getStrMessage(message) {
        var winstonMessage = {
            version:       "1.1",
            timestamp:     Math.round(new Date() / 1000),
            host:          this.graylogHostname,
            facility:      this.graylogFacility,
            flag:          this.graylogFlag,
            level:         message.level,
            short_message: message.msg
        };

        if (this.graylogOvhTokenKey && this.graylogOvhTokenKey.length) {
            winstonMessage[this.graylogOvhTokenKey] = this.graylogOvhTokenValue;
        }

        if (message.meta) {
            Object.keys(message.meta).forEach(key => {
                if (key !== "id") {
                    winstonMessage[key] = JSON.stringify(message.meta[key]);
                }
            });
            winstonMessage.full_message = JSON.stringify(message.meta);
        }

        return JSON.stringify(winstonMessage) + "\u0000";
    }

    /**
     * Log to winston
     * @param {String}   level    Message type
     * @param {String}   msg      Main message
     * @param {Object}   meta     Metadata to log
     * @param {Function} callback Callback function
     */
     log (level, msg, meta, callback) {
         var message = new Message(level, msg, meta);

         if (this.silent) {
             return (typeof callback === "function") && callback(null, true);
         }

         this.getSocket(() => {
             this.sendMessage(message);
         });


     }
}

exports.OvhWinstonLDP = OvhWinstonLDP;
winston.transports.OvhWinstonLDP = OvhWinstonLDP;
module.exports = OvhWinstonLDP;
