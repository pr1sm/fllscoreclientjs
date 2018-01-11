
# fllscoreclientjs

[![Build Status](https://travis-ci.org/Pr1sM/fllscoreclientjs.svg?branch=master)](https://travis-ci.org/Pr1sM/fllscoreclientjs)
[![Coverage Status](https://coveralls.io/repos/github/Pr1sM/fllscoreclientjs/badge.svg?branch=master)](https://coveralls.io/github/Pr1sM/fllscoreclientjs?branch=master)

An implementation of the FLL Score Client Protocol in Javascript.
> This module is intended to be used with the FLL Scoring Software Only!
> Using this with another system is not supported

## Install
```bash
$ npm install fllscoreclient
```

## Overview

The FLL Scoring Software includes a public API for clients to connect and receive
scoring info. The software communicates with clients through a TCP socket connection.
This package provides the following objects to connect:
1) A local client that can perform all actions of the protocol (requires node.js to run).
2) A Web client on the browser that can receive scoring info as new data is available.*

>*The Web client requires a proxy server to run as raw tcp sockets are not available
> on the browser.

See the [API](#api) section below for more info on each object

## Running In the Browser
(Requires a WebProxy to be running as well, see instructions below)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://unpkg.com/fllscoreclient@latest/dist/fllscoreclient.js"></script>
    <script>
        var client = fllscoreclient.createWebClient('0.0.0.0', 8101);

        // Listen to events and handle updates immediately!
        client.on('lastUpdate', (date) => {
            console.log(date);
        });

        client.on('scoreInfo', (info) => {
            console.log(info);
        });

        // Request data on demand!
        client.getLastUpdate().then((date) => {
            console.log(date);
        }).catch((err) => {
            console.error(err);
        });

        client.getScoreInfo().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.error(err);
        });
    </script>
</head>
<body>

    Check the console...
</body>
</html>
```

## Running The Web Proxy
```js
var fllScoreProxy = require('fllscoreclient/dist/fllscoreclientproxy');

var proxy = fllScoreProxy.createWebProxy({
    servePort: 8101,
    infoPollingRate: 3,
    socketOpts: {
        host: 'localhost',
        port: 8100
    }
});

proxy.startProxy().then((res) => {
    if (res) {
        console.log('Server Started...');
    } else {
        console.log('Server Unable to Start... try again');
    }
});
```

## Running Locally
```js
var fllScoreProxy = require('fllscoreclient/dist/fllscoreclientproxy');

var client = fllScoreProxy.createClient({host: 'localhost', port: 8100});

client.connect().then(function(res) {
    console.log(res);
    return client.sendPing();
}).then(function(res) {
    console.log(res);
    return client.sendLastUpdate();
}).then(function(res) {
    if (res) {
        console.log('Update is necessary');
    } else {
        console.log('No Update Needed');
    }
    console.log(client.lastUpdate.toISOString());
    return new Promise(function (resolve) {
        setTimeout(resolve, 5000);
    });
}).then(function() {
    return client.sendScore();
}).then(function(res) {
    console.log(JSON.stringify(res));
    return client.sendLastUpdate();
}).then(function(res) {
    if (res) {
        console.log('Update is necessary');
    } else {
        console.log('No Update Needed');
    }
    console.log(client.lastUpdate.toISOString());
    return client.close();
}).then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log('Rejected: ' + err.message);
});
```

## Examples
Examples can be run after checkout by running `npm install` and starting the mock server
```bash
$ cd example/

### In one window (mock scoring program)
$ python server.py

### Run local client
$ node test.js

### In another window (start proxy, then open webTest.html)
$ node webProxy.js
```

## API

Incoming...




## Index

### External modules

* ["client/index"](modules/_client_index_.md)
* ["client/webClient"](modules/_client_webclient_.md)
* ["constants/connectionStatus"](modules/_constants_connectionstatus_.md)
* ["constants/regexConstants"](modules/_constants_regexconstants_.md)
* ["proxy/client"](modules/_proxy_client_.md)
* ["proxy/index"](modules/_proxy_index_.md)
* ["proxy/webProxy"](modules/_proxy_webproxy_.md)
* ["shared/interface"](modules/_shared_interface_.md)



---
