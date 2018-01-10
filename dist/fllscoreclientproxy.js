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
const webServer_1 = __webpack_require__(5);
function createClient(host, port, name, useWatchdog) {
    return new client_1.Client(host, port, name, useWatchdog);
}
exports.createClient = createClient;
function createWebServer(host, port, name, useWatchdog) {
    return new webServer_1.WebServer(host, port, name, useWatchdog);
}
exports.createWebServer = createWebServer;


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
const contants_1 = __webpack_require__(4);
class Client {
    constructor(host = 'localhost', port = 25002, name = 'FLLScoreClient', useWatchdog = true) {
        this.host = 'localhost';
        this.port = 25002;
        this.name = 'FLLScoreClient';
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = 0;
        this.socket = new net_1.Socket();
        this.useWatchdog = useWatchdog;
        this.connTest = undefined;
        this.watchdogInterval = 5;
        this.socket.on('close', () => {
            this.status = 0;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.status = 1;
            this.socket.once('error', (err) => {
                this.status = 0;
                reject(err);
            });
            this.socket.once('data', (data) => {
                if (contants_1.FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    const raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                    this.resetConnectionTest();
                    resolve('Connected');
                }
                else {
                    this.status = 0;
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.connect({
                host: this.host,
                port: this.port,
            }, () => {
                this.status = 2;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', (err) => {
                reject(err);
            });
            this.socket.once('data', (data) => {
                if (contants_1.FLLScoreClientConstants.ECHO.test(data.toString())) {
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
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', (err) => {
                reject(err);
            });
            this.socket.once('data', (data) => {
                if (contants_1.FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    this.lastUpdate = new Date(response);
                    resolve(this.lastUpdate);
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
                    if (contants_1.FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        this.socket.removeListener('data', sendScoreDataHandler);
                        this.scoreInfo = { scheduleInfo, teamInfo };
                        resolve(this.scoreInfo);
                    }
                    else if (contants_1.FLLScoreClientConstants.SCORE_HEADER.test(value)) {
                        const content = value.substring(value.indexOf(':') + 1).split('|');
                        scheduleInfo = {
                            lastUpdate: new Date(content[0]),
                            numberOfCompletedMatches: parseInt(content[3], 10),
                            numberOfMatches: parseInt(content[2], 10),
                            numberOfTeams: parseInt(content[1], 10),
                        };
                    }
                    else if (contants_1.FLLScoreClientConstants.SCORE.test(value)) {
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
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', (err) => {
                reject(err);
            });
            this.socket.on('data', sendScoreDataHandler);
            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', (err) => {
                reject(err);
            });
            this.socket.once('close', (hadError) => {
                if (hadError) {
                    reject(new Error('Closed with error'));
                }
                else {
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
            if (this.status === 2) {
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

Object.defineProperty(exports, "__esModule", { value: true });
var FLLScoreClientConstants;
(function (FLLScoreClientConstants) {
    FLLScoreClientConstants.WELCOME = /^Welcome:[0-9]+(\r\n)*$/;
    FLLScoreClientConstants.ECHO = /^Echo:(\r\n)*$/;
    FLLScoreClientConstants.SCORE_HEADER = /^Score Header:[a-zA-Z0-9\/: ]+(\|[0-9]+){3}(\r\n)*$/;
    FLLScoreClientConstants.SCORE = /^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}(\r\n)*$/;
    FLLScoreClientConstants.SCORE_DONE = /^Score Done:(\r\n)*$/;
    FLLScoreClientConstants.LAST_UPDATE = /^Last Update:.+(\r\n)*$/;
    let ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus.Disconnected = 0;
        ConnectionStatus.Connecting = 1;
        ConnectionStatus.Connected = 2;
    })(ConnectionStatus = FLLScoreClientConstants.ConnectionStatus || (FLLScoreClientConstants.ConnectionStatus = {}));
})(FLLScoreClientConstants = exports.FLLScoreClientConstants || (exports.FLLScoreClientConstants = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const io = __webpack_require__(6);
const index_1 = __webpack_require__(0);
class WebServer {
    constructor(host = 'localhost', port = 25002, name = 'FLLScoreClient', useWatchdog = true) {
        this.host = 'localhost';
        this.port = 25002;
        this.name = 'FLLScoreClient';
        this.useWatchdog = true;
        this.host = host;
        this.port = port;
        this.name = name;
        this.useWatchdog = useWatchdog;
        this.fllclient = index_1.createClient(this.host, this.port, this.name, this.useWatchdog);
        this.server = io();
        this.server.on('connection', (client) => {
            this.fllclient.socket.on('data', (data) => {
                console.log('Received:\n\t' + data.toString().trim());
            });
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
                        this.fllclient.sendLastUpdate().then((date) => {
                            client.emit('lastUpdate', date.toISOString());
                            cb(date.toISOString());
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
    startServer() {
        return new Promise((resolve) => {
            this.fllclient.connect().then(() => {
                this.server.listen(this.fllclient.port + 1);
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
}
exports.WebServer = WebServer;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);
});
//# sourceMappingURL=fllscoreclientproxy.js.map