"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const welcomeRegEx = new RegExp('^Welcome:[0-9]+\r\n$');
const echoRegEx = new RegExp('^Echo:\r\n$');
const scoreHeaderRegEx = new RegExp('^Score Header:[a-zA-Z0-9\/:]+(\|[0-9]+){3}\r\n$');
const scoreRegEx = new RegExp('^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}\r\n$');
const scoreDoneRegEx = new RegExp('^Score Done:\r\n$');
const lastUpdateRegEx = new RegExp('^Last Update:.+\r\n$');
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Unknown"] = 0] = "Unknown";
    ConnectionStatus[ConnectionStatus["Disconnected"] = 1] = "Disconnected";
    ConnectionStatus[ConnectionStatus["Connecting"] = 2] = "Connecting";
    ConnectionStatus[ConnectionStatus["Connected"] = 3] = "Connected";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
class Client {
    constructor(host = 'localhost', port = 25002, name = 'FLLScoreClient') {
        this.host = 'localhost';
        this.port = 25002;
        this.name = 'FLLScoreClient';
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.status = ConnectionStatus.Disconnected;
        this.socket = new net_1.Socket();
        this.socket.on('data', data => {
            console.log('[INTERNAL]Received: ' + data);
        });
        this.socket.on('close', had_error => {
            this.status = ConnectionStatus.Disconnected;
            if (had_error) {
                console.log('[INTERNAL]Connection Closed due to error: ');
            }
            else {
                console.log('[INTERNAL]Connection Closed');
            }
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.status = ConnectionStatus.Connecting;
            this.socket.once('error', err => {
                this.status = ConnectionStatus.Disconnected;
                reject(err);
            });
            this.socket.once('data', data => {
                if (welcomeRegEx.test(data.toString())) {
                    resolve('Connected');
                }
                else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.connect({
                port: this.port,
                host: this.host
            }, () => {
                this.status = ConnectionStatus.Connected;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status != ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
                console.log('[INTERNAL]Error during send');
                this.close().then(() => {
                    reject(err);
                }).catch(() => {
                    reject(err);
                });
            });
            this.socket.once('data', data => {
                if (echoRegEx.test(data.toString())) {
                    resolve('Echo Received');
                }
                else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.write('Ping:\r\n');
        });
    }
    sendLastUpdate() {
        return new Promise((resolve, reject) => {
            if (this.status != ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            this.socket.once('error', err => {
                reject(err);
            });
            this.socket.once('data', data => {
                if (lastUpdateRegEx.test(data.toString())) {
                    let raw = data.toString().trim();
                    let response = raw.substring(raw.indexOf(':') + 1);
                    console.log('[Internal]Received: ' + response);
                    this.lastUpdate = new Date(response);
                    resolve(this.lastUpdate);
                }
                else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
            this.socket.write('Send Last Update:\r\n');
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.status != ConnectionStatus.Connected) {
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
}
exports.Client = Client;
