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
        this.host = 'localhost';
        this.port = 25002;
        this.name = 'FLLScoreClient';
        this.useWatchdog = true;
        if (opts !== undefined) {
            this.host = opts.host || this.host;
            this.port = opts.port || this.port;
            this.name = opts.name || this.name;
            this.useWatchdog = opts.useWatchdog !== undefined ? opts.useWatchdog : this.useWatchdog;
        }
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
        this.socket = new net_1.Socket();
        this.connTest = undefined;
        this.watchdogInterval = 5;
        this.socket.on('close', () => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Connecting;
            const to = setTimeout(() => {
                clearTimeout(to);
                this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
                reject(new Error('Timeout'));
            }, 50);
            this.socket.once('data', (data) => {
                if (FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    const raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                    this.resetConnectionTest();
                    resolve('Connected');
                }
                else {
                    this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.connect({
                host: this.host,
                port: this.port,
            }, () => {
                clearTimeout(to);
                this.status = FLLScoreClientConstants.ConnectionStatus.Connected;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            const to = setTimeout(() => {
                clearTimeout(to);
                reject(new Error('Timeout'));
            }, 50);
            this.socket.once('data', (data) => {
                if (FLLScoreClientConstants.ECHO.test(data.toString())) {
                    clearTimeout(to);
                    resolve('Echo Received');
                }
                else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
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
                clearTimeout(to);
                reject(new Error('Timeout'));
            }, 50);
            this.socket.once('data', (data) => {
                if (FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    const newDate = new Date(response);
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
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.write('Send Last Update:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    sendScore() {
        return new Promise((resolve, reject) => {
            let intermediateData = '';
            let scheduleInfo;
            const teamInfo = [];
            const sendScoreDataHandler = (data) => {
                let raw = data.toString();
                if (!raw.endsWith('\r\n')) {
                    intermediateData += raw;
                    return;
                }
                else {
                    raw = intermediateData + raw;
                    intermediateData = '';
                }
                const split = raw.trim().split('\r\n');
                split.forEach((value) => {
                    if (FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        this.socket.removeListener('data', sendScoreDataHandler);
                        this.scoreInfo = { scheduleInfo, teamInfo };
                        clearTimeout(to);
                        resolve(this.scoreInfo);
                    }
                    else if (FLLScoreClientConstants.SCORE_HEADER.test(value)) {
                        const content = value.substring(value.indexOf(':') + 1).split('|');
                        scheduleInfo = {
                            lastUpdate: new Date(content[0]),
                            numberOfCompletedMatches: parseInt(content[3], 10),
                            numberOfMatches: parseInt(content[2], 10),
                            numberOfTeams: parseInt(content[1], 10),
                        };
                    }
                    else if (FLLScoreClientConstants.SCORE.test(value)) {
                        const content = value.substring(value.indexOf(':') + 1).split('|');
                        teamInfo.push({
                            highScore: parseInt(content[2], 10),
                            name: content[1],
                            number: parseInt(content[0], 10),
                            scores: [parseInt(content[3], 10), parseInt(content[4], 10), parseInt(content[5], 10)],
                        });
                    }
                    else {
                        // TODO: Deal with invalid command
                    }
                });
            };
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            const to = setTimeout(() => {
                clearTimeout(to);
                reject(new Error('Timeout'));
            }, 50);
            this.socket.on('data', sendScoreDataHandler);
            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            const to = setTimeout(() => {
                clearTimeout(to);
                reject(new Error('Timeout'));
            }, 50);
            this.socket.once('close', (hadError) => {
                if (hadError) {
                    reject(new Error('Closed with error'));
                }
                else {
                    clearTimeout(to);
                    resolve('Connection Closed');
                }
            });
            this.socket.end();
        });
    }
    resetConnectionTest() {
        if (this.connTest !== undefined) {
            clearInterval(this.connTest);
        }
        if (!this.useWatchdog) {
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
        this.host = 'localhost';
        this.infoPollingRate = 30;
        this.port = 25002;
        this.servePort = 25003;
        this.name = 'FLLScoreClient';
        this.useWatchdog = true;
        if (opts !== undefined) {
            this.host = opts.host || this.host;
            this.infoPollingRate = opts.infoPollingRate || this.infoPollingRate;
            this.port = opts.port || this.port;
            this.servePort = opts.servePort || this.servePort;
            this.name = opts.name || this.name;
            this.useWatchdog = opts.useWatchdog || this.useWatchdog;
        }
        if (this.port === this.servePort) {
            this.servePort = this.port + 1;
        }
        this.fllclient = index_1.createClient({
            host: this.host,
            name: this.name,
            port: this.port,
            useWatchdog: this.useWatchdog,
        });
        this.server = io();
        this.server.on('connection', (client) => {
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
        });
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
                this.server.listen(this.servePort);
                resolve(true);
            }).catch(() => {
                resolve(false);
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