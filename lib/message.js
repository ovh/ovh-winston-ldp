"use strict";

const MESSAGE_LEVEL = {
    "silly":   7,
    "debug":   7,
    "verbose": 6,
    "data":    6,
    "prompt":  6,
    "input":   6,
    "info":    6,
    "help":    5,
    "notice":  5,
    "warn":    5,
    "warning": 5,
    "error":   3,
    "crit":    2,
    "alert":   1,
    "emerg":   0
};

class Message {

    constructor(winstonLevel, msg, meta) {
        this.level = Message.getMessageLevel(winstonLevel);
        this.meta = meta;
        this.msg = msg;
    }

    /**
     * Convert string message type in message level
     * @param  {String} winstonLevel Message type
     * @return {Number}
    */
    getMessageLevel(winstonLevel) {
        return Message.getMessageLevel(winstonLevel);
    }

    static getMessageLevel(winstonLevel) {
        if (MESSAGE_LEVEL.hasOwnProperty(winstonLevel)) {
            return MESSAGE_LEVEL[winstonLevel];
        }
        return 6;
    }
}

module.exports = Message;
