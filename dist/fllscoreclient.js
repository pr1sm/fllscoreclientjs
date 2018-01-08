(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("fllscoreclient", [], factory);
	else if(typeof exports === 'object')
		exports["fllscoreclient"] = factory();
	else
		root["fllscoreclient"] = factory();
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
var FLLScoreClient;
(function (FLLScoreClient) {
    let ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Disconnected"] = 0] = "Disconnected";
        ConnectionStatus[ConnectionStatus["Connecting"] = 1] = "Connecting";
        ConnectionStatus[ConnectionStatus["Connected"] = 2] = "Connected";
    })(ConnectionStatus = FLLScoreClient.ConnectionStatus || (FLLScoreClient.ConnectionStatus = {}));
})(FLLScoreClient = exports.FLLScoreClient || (exports.FLLScoreClient = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = __webpack_require__(0);
exports.FLLScoreClient = interface_1.FLLScoreClient;
var createClient_1 = __webpack_require__(3);
exports.createClient = createClient_1.createClient;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const clientImpl_1 = __webpack_require__(4);
function createClient(host, port, name) {
    return new clientImpl_1.ClientImpl(host, port, name);
}
exports.createClient = createClient;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __webpack_require__(5);
const contants_1 = __webpack_require__(6);
const interface_1 = __webpack_require__(0);
class ClientImpl {
    constructor(host = 'localhost', port = 25002, name = 'FLLScoreClient', useWatchdog = true) {
        this.host = 'localhost';
        this.port = 25002;
        this.name = 'FLLScoreClient';
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
        this.socket = new net_1.Socket();
        this.useWatchdog = useWatchdog;
        this.connTest = undefined;
        this.watchdogInterval = 5;
        this.socket.on('close', () => {
            this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.status = interface_1.FLLScoreClient.ConnectionStatus.Connecting;
            this.socket.once('error', err => {
                this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
                reject(err);
            });
            this.socket.once('data', data => {
                if (contants_1.FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    let raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1));
                    this.resetConnectionTest();
                    resolve('Connected');
                }
                else {
                    this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.connect({
                port: this.port,
                host: this.host
            }, () => {
                this.status = interface_1.FLLScoreClient.ConnectionStatus.Connected;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status !== interface_1.FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
                reject(err);
            });
            this.socket.once('data', data => {
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
            if (this.status !== interface_1.FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
                reject(err);
            });
            this.socket.once('data', data => {
                if (contants_1.FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    let raw = data.toString().trim();
                    let response = raw.substring(raw.indexOf(':') + 1);
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
            let teamInfo = [];
            let scheduleInfo;
            let sendScoreDataHandler = (data) => {
                let raw = data.toString();
                if (!raw.endsWith('\r\n')) {
                    intermediateData += raw;
                    return;
                }
                else {
                    raw = intermediateData + raw;
                    intermediateData = '';
                }
                let split = raw.trim().split('\r\n');
                split.forEach(value => {
                    if (contants_1.FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        this.socket.removeListener('data', sendScoreDataHandler);
                        this.scoreInfo = {
                            scheduleInfo: scheduleInfo,
                            teamInfo: teamInfo
                        };
                        resolve(this.scoreInfo);
                    }
                    else if (contants_1.FLLScoreClientConstants.SCORE_HEADER.test(value)) {
                        let content = value.substring(value.indexOf(':') + 1).split('|');
                        scheduleInfo = {
                            lastUpdate: new Date(content[0]),
                            numberOfTeams: parseInt(content[1]),
                            numberOfMatches: parseInt(content[2]),
                            numberOfCompletedMatches: parseInt(content[3])
                        };
                    }
                    else if (contants_1.FLLScoreClientConstants.SCORE.test(value)) {
                        let content = value.substring(value.indexOf(':') + 1).split('|');
                        teamInfo.push({
                            number: parseInt(content[0]),
                            name: content[1],
                            highScore: parseInt(content[2]),
                            scores: [parseInt(content[3]), parseInt(content[4]), parseInt(content[5])]
                        });
                    }
                    else {
                        // TODO: Deal with invalid command
                    }
                });
            };
            if (this.status !== interface_1.FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
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
            if (this.status !== interface_1.FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
                reject(err);
            });
            this.socket.once('close', had_error => {
                if (had_error) {
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
            if (this.status === interface_1.FLLScoreClient.ConnectionStatus.Connected) {
                this.socket.write('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
exports.ClientImpl = ClientImpl;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 6 */
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
})(FLLScoreClientConstants = exports.FLLScoreClientConstants || (exports.FLLScoreClientConstants = {}));


/***/ })
/******/ ]);
});
//# sourceMappingURL=fllscoreclient.js.map