# ovh-winston-ldp

A [graylog2][0] TCP/TLS transport for [winston][1] library

[![NPM](https://nodei.co/npm/ovh-winston-ldp.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-winston-ldp/)

```javascript
const winston = require('winston');
winston.add(require('ovh-winston-ldp'), {
    level: 'debug',
    graylogOvhTokenValue: "GRAY_LOG_TOKEN"
});

logger.info("Hello world!");
logger.log('warn', 'Test Log Message', {"anything": 'This is metadata' });
```


## Installation

Winston-graylog works with NodeJS 6.0.0+.

The easiest way to install it is to use [yarn](https://yarnpkg.com/en/)

```bash
$yarn add ovh-winston-ldp
```

## Usage
```javascript
  const winston = require('winston');
  winston.add(require('ovh-winston-ldp'), options);

```

or

```javascript
const OvhWinstonLDP = require('ovh-winston-ldp');
const logger = new(winston.Logger)({
    exitOnError: false,
    transports: [
        new(OvhWinstonLDP)(options)
    ]
});
```

## Options

* __name__:  Transport name
* __level__: Level of messages this transport should log. (default: info)
* __silent__: Boolean flag indicating whether to suppress output. (default: false)
* __autoReconnect__: Boolean flag indicating whether to reconnect on error. (default: false)
* __graylogHost__: your server address (default: localhost)
* __graylogPort__: your server port (default: 12201)
* __graylogFlag__: Required on LDP Alpha
* __graylogOvhTokenKey__: Required on LDP Beta
* __graylogOvhTokenValue__: Required on LDP Beta
* __hostname__: the name of this host (default: os.hostname())
* __facility__: the facility for these log messages (default: "Node.js")


## Log Levels
Supported log levels, are the following

Winston Level | Graylog2 level
---------------|---------------
emerg          | emergency
alert          | alert
crit           | critical
error          | error
warning        | warning
notice         | notice
info           | info
debug          | debug

**All other possibile winston's level, or custom levels, will default to `info`**

[0]: http://www.graylog2.org
[1]: https://github.com/flatiron/winston
