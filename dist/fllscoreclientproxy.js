(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("fllscoreclientproxy", [], factory);
	else if(typeof exports === 'object')
		exports["fllscoreclientproxy"] = factory();
	else
		root["fllscoreclientproxy"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __webpack_require__(2);
const webProxy_1 = __webpack_require__(7);
function createClient(opts) {
    return new client_1.Client(opts);
}
exports.createClient = createClient;
function createWebProxy(opts) {
    return new webProxy_1.WebProxy(opts);
}
exports.createWebProxy = createWebProxy;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __webpack_require__(3);
const FLLScoreClientConstants = __webpack_require__(4);
class Client {
    constructor(opts) {
        this.opts = {
            host: 'localhost',
            name: 'FLLScoreClient',
            port: 25002,
            useWatchdog: true,
        };
        if (opts !== undefined) {
            this.opts = Client.defaults(opts, this.opts);
        }
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
        this.socket = new net_1.Socket();
        this.connTest = undefined;
        this.watchdogInterval = 5;
        this.callbackQueues = new Map();
        this.callbackQueues.set('welcome', []);
        this.callbackQueues.set('echo', []);
        this.callbackQueues.set('lastUpdate', []);
        this.callbackQueues.set('scoreHeader', []);
        this.callbackQueues.set('score', []);
        this.callbackQueues.set('scoreDone', []);
        this.socket.on('close', () => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
        this.messageBuffer = '';
        this.socket.on('data', (data) => {
            let message = data.toString();
            // Check for incomplete message, push that onto the buffer and process the rest (if there are any)
            if (!message.endsWith('\r\n')) {
                const lastLine = message.lastIndexOf('\r\n');
                if (lastLine === -1) {
                    // did not find last line, push entire message and wait for more
                    this.messageBuffer += message;
                    return;
                }
                else {
                    // 1. capture incomplete line,
                    // 2. set message to be the buffer + all complete lines,
                    // 3. set the buffer to the incomplete line.
                    const incompleteLine = message.substring(lastLine + 2);
                    message = this.messageBuffer + message.substring(0, lastLine + 2);
                    this.messageBuffer = incompleteLine;
                }
            }
            else {
                message = this.messageBuffer + message;
            }
            // Nothing to process, return
            if (message.length === 0) {
                return;
            }
            // Split message into valid commands
            const split = message.trim().split('\r\n');
            // Process each command
            const regexMap = new Map([
                ['welcome', FLLScoreClientConstants.WELCOME],
                ['echo', FLLScoreClientConstants.ECHO],
                ['lastUpdate', FLLScoreClientConstants.LAST_UPDATE],
                ['scoreHeader', FLLScoreClientConstants.SCORE_HEADER],
                ['score', FLLScoreClientConstants.SCORE],
                ['scoreDone', FLLScoreClientConstants.SCORE_DONE],
            ]);
            split.forEach((line) => {
                let processed = false;
                regexMap.forEach((val, key) => {
                    if (processed) {
                        return;
                    }
                    if (val.test(line)) {
                        processed = true;
                        const arr = this.callbackQueues.get(key);
                        if (arr !== undefined) {
                            const cb = arr.shift();
                            if (cb !== undefined) {
                                cb(line);
                            }
                        }
                    }
                });
                if (!processed) {
                    // console.log('WARNING: Line: ' + line + ' was not processed');
                }
            });
        });
    }
    static defaults(src, def) {
        const val = def;
        if (src.host !== undefined) {
            val.host = src.host;
        }
        if (src.name !== undefined) {
            val.name = src.name;
        }
        if (src.port !== undefined) {
            val.port = src.port;
        }
        if (src.useWatchdog !== undefined) {
            val.useWatchdog = src.useWatchdog;
        }
        return val;
    }
    connect() {
        this.status = FLLScoreClientConstants.ConnectionStatus.Connecting;
        return new Promise((resolve, reject) => {
            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('welcome', cb);
                this.socket.emit('close', true);
                reject(new Error('timeout'));
            }, 50);
            const cb = (data) => {
                const raw = data.trim();
                this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                this.resetConnectionTest();
                this.socket.removeListener('error', errorListener);
                clearTimeout(to);
                resolve('Connected');
            };
            const errorListener = (err) => {
                this.removeCallback('welcome', cb);
                clearTimeout(to);
                reject(err);
            };
            this.socket.once('error', errorListener);
            this.socket.connect({
                host: this.opts.host,
                port: this.opts.port,
            }, () => {
                this.status = FLLScoreClientConstants.ConnectionStatus.Connected;
                this.pushCallback('welcome', cb);
                this.socket.write('FLLScore:' + this.opts.name + '|Primary\r\n');
            });
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('echo', cb);
                reject(new Error('timeout'));
            }, 50);
            const cb = () => {
                this.socket.removeListener('error', errorListener);
                clearTimeout(to);
                resolve('Echo Received');
            };
            const errorListener = (err) => {
                this.removeCallback('echo', cb);
                clearTimeout(to);
                reject(err);
            };
            this.socket.once('error', errorListener);
            this.pushCallback('echo', cb);
            this.socket.write('Ping:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    sendLastUpdate() {
        return new Promise((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('lastUpdate', cb);
                reject(new Error('timeout'));
            }, 50);
            const cb = (data) => {
                if (FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    const newDate = new Date(response);
                    this.socket.removeListener('error', errorListener);
                    clearTimeout(to);
                    if (this.lastUpdate === undefined || newDate.getTime() > this.lastUpdate.getTime()) {
                        this.lastUpdate = newDate;
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    this.socket.removeListener('error', errorListener);
                    clearTimeout(to);
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            };
            const errorListener = (err) => {
                this.removeCallback('lastUpdate', cb);
                clearTimeout(to);
                reject(err);
            };
            this.socket.once('error', errorListener);
            this.pushCallback('lastUpdate', cb);
            this.socket.write('Send Last Update:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    sendScore() {
        return new Promise((resolve, reject) => {
            let scheduleInfo;
            const teamInfo = [];
            const errorListener = (err) => {
                reject(err);
            };
            const scoreDoneCallback = () => {
                const teamDiff = scheduleInfo.numberOfTeams - teamInfo.length;
                if (teamDiff > 0) {
                    // console.log('WARNING: only received ' +
                    //     teamInfo.length + '/' + scheduleInfo.numberOfTeams + ' teams!');
                    const arr = this.callbackQueues.get('score');
                    if (arr !== undefined) {
                        arr.splice(0, teamDiff);
                    }
                }
                this.scoreInfo = { scheduleInfo, teamInfo };
                this.socket.removeListener('error', errorListener);
                resolve(this.scoreInfo);
            };
            const scoreCallback = (value) => {
                const content = value.substring(value.indexOf(':') + 1).split('|');
                teamInfo.push({
                    highScore: parseInt(content[2], 10),
                    name: content[1],
                    number: parseInt(content[0], 10),
                    scores: [
                        parseInt(content[3], 10),
                        parseInt(content[4], 10),
                        parseInt(content[5], 10),
                    ],
                });
            };
            const scoreHeaderCallback = (value) => {
                const content = value.substring(value.indexOf(':') + 1).split('|');
                scheduleInfo = {
                    lastUpdate: new Date(content[0]),
                    numberOfCompletedMatches: parseInt(content[3], 10),
                    numberOfMatches: parseInt(content[2], 10),
                    numberOfTeams: parseInt(content[1], 10),
                };
                for (let i = 0; i < scheduleInfo.numberOfTeams; i++) {
                    this.pushCallback('score', scoreCallback);
                }
            };
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                this.socket.removeListener('error', errorListener);
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', errorListener);
            this.pushCallback('scoreHeader', scoreHeaderCallback);
            this.pushCallback('scoreDone', scoreDoneCallback);
            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                resolve('Connection Closed');
            }
            const errorListener = (err) => {
                reject(err);
            };
            this.socket.once('error', errorListener);
            this.socket.once('close', (hadError) => {
                if (hadError) {
                    this.socket.removeListener('error', errorListener);
                    reject(new Error('Closed with error'));
                }
                else {
                    this.socket.removeListener('error', errorListener);
                    resolve('Connection Closed');
                }
            });
            this.socket.end();
        });
    }
    pushCallback(key, cb) {
        const arr = this.callbackQueues.get(key);
        if (arr !== undefined) {
            arr.push(cb);
        }
    }
    removeCallback(key, cb) {
        const arr = this.callbackQueues.get(key);
        if (arr !== undefined) {
            const index = arr.indexOf(cb, 0);
            if (index > -1) {
                arr.splice(index, 1);
            }
        }
    }
    resetConnectionTest() {
        if (this.connTest !== undefined) {
            clearInterval(this.connTest);
        }
        if (!this.opts.useWatchdog) {
            return;
        }
        this.connTest = setInterval(() => {
            if (this.status === FLLScoreClientConstants.ConnectionStatus.Connected) {
                this.socket.write('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
exports.Client = Client;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionStatus = __webpack_require__(5);
exports.ConnectionStatus = ConnectionStatus;
__export(__webpack_require__(6));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Disconnected = 0;
exports.Connecting = 1;
exports.Connected = 2;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WELCOME = /^Welcome:[0-9]+(\r\n)*$/;
exports.ECHO = /^Echo:(\r\n)*$/;
exports.SCORE_HEADER = /^Score Header:[a-zA-Z0-9\/: ]+(\|[0-9]+){3}(\r\n)*$/;
exports.SCORE = /^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}(\r\n)*$/;
exports.SCORE_DONE = /^Score Done:(\r\n)*$/;
exports.LAST_UPDATE = /^Last Update:.+(\r\n)*$/;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const io = __webpack_require__(8);
const index_1 = __webpack_require__(0);
class WebProxy {
    constructor(opts) {
        this.opts = {
            infoPollingRate: 30,
            servePort: 25003,
            socketOpts: {
                host: 'localhost',
                name: 'FLLScoreClient',
                port: 25002,
                useWatchdog: true,
            },
        };
        if (opts !== undefined) {
            this.opts = WebProxy.defaults(opts, this.opts);
        }
        this.clients = [];
        this.fllclient = this.opts.socket;
        this.infoPollingRate = this.opts.infoPollingRate;
        this.servePort = this.opts.servePort;
        this.socketOpts = this.opts.socketOpts;
        if (this.fllclient === undefined) {
            this.fllclient = index_1.createClient(this.socketOpts);
        }
        if (this.server === undefined) {
            this.server = io();
        }
    }
    static defaults(src, def) {
        const val = def;
        if (src.infoPollingRate !== undefined) {
            val.infoPollingRate = src.infoPollingRate;
        }
        if (src.socket !== undefined) {
            val.socket = src.socket;
            val.socketOpts = src.socket.opts;
        }
        else if (src.socketOpts !== undefined) {
            const valOpts = def.socketOpts;
            if (src.socketOpts.host !== undefined) {
                valOpts.host = src.socketOpts.host;
            }
            if (src.socketOpts.name !== undefined) {
                valOpts.name = src.socketOpts.name;
            }
            if (src.socketOpts.port !== undefined) {
                valOpts.port = src.socketOpts.port;
            }
            if (src.socketOpts.useWatchdog !== undefined) {
                valOpts.useWatchdog = src.socketOpts.useWatchdog;
            }
            val.socketOpts = valOpts;
        }
        if (src.servePort !== undefined) {
            val.servePort = src.servePort;
        }
        if (val.servePort === val.socketOpts.port) {
            val.servePort = val.socketOpts.port + 1;
        }
        if (src.socketIO !== undefined) {
            val.socketIO = src.socketIO;
        }
        return val;
    }
    startProxy() {
        return new Promise((resolve) => {
            this.fllclient.connect().then(() => {
                this.fllclient.socket.on('data', (data) => {
                    console.log('Received:\n\t' + data.toString().trim());
                });
                this.pollTest = setInterval(() => {
                    this.fllclient.sendLastUpdate().then((updated) => {
                        if (updated) {
                            return this.fllclient.sendScore();
                        }
                        else {
                            return Promise.resolve(undefined);
                        }
                    }).then((info) => {
                        if (info !== undefined) {
                            this.server.emit('lastUpdate', this.fllclient.lastUpdate);
                            this.server.emit('scoreInfo', info);
                        }
                    }).catch((err) => {
                        // TODO: Deal with error
                        console.log(err);
                    });
                }, this.infoPollingRate * 1000);
                this.setupClientListener();
                this.server.listen(this.servePort);
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
    stopProxy() {
        if (this.pollTest !== undefined) {
            clearInterval(this.pollTest);
        }
        this.closeConnections();
        return this.fllclient.close();
    }
    closeConnections() {
        this.clients.forEach((client) => {
            client.disconnect(true);
        });
        this.clients = [];
    }
    setupClientListener() {
        this.server.on('connection', (client) => {
            this.clients.push(client);
            if (this.fllclient.lastUpdate !== undefined) {
                client.emit('lastUpdate', this.fllclient.lastUpdate.toISOString());
            }
            if (this.fllclient.scoreInfo !== undefined) {
                client.emit('scoreInfo', this.fllclient.scoreInfo);
            }
            client.on('sendLastUpdate', (m, cb) => {
                if (m === 'please') {
                    if (this.fllclient.lastUpdate !== undefined) {
                        cb(this.fllclient.lastUpdate.toISOString());
                    }
                    else {
                        this.fllclient.sendLastUpdate().then(() => {
                            client.emit('lastUpdate', this.fllclient.lastUpdate.toISOString());
                            cb(this.fllclient.lastUpdate.toISOString());
                        }).catch((err) => {
                            // TODO: Deal with this error
                            console.log(err);
                        });
                    }
                }
                else {
                    cb(new Error('invalid command'));
                }
            });
            client.on('sendScoreInfo', (m, cb) => {
                if (m === 'please') {
                    if (this.fllclient.scoreInfo !== undefined) {
                        cb(this.fllclient.scoreInfo);
                    }
                    else {
                        this.fllclient.sendScore().then((scoreInfo) => {
                            client.emit('scoreInfo', scoreInfo);
                            cb(scoreInfo);
                        }).catch((err) => {
                            // TODO: Deal with this error
                            console.log(err);
                        });
                    }
                }
                else {
                    cb(new Error('invalid command'));
                }
            });
            client.on('close', () => {
                this.clients.splice(this.clients.indexOf(client), 1);
            });
        });
    }
}
exports.WebProxy = WebProxy;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);
});
//# sourceMappingURL=fllscoreclientproxy.js.map