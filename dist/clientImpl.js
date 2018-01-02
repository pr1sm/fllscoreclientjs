"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const contants_1 = require("./contants");
const interface_1 = require("./interface");
class ClientImpl {
    constructor(host = 'localhost', port = 25002, name = 'FLLScoreClient') {
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
        this.socket.on('data', data => {
            console.log('[INTERNAL]Received: ' + data);
        });
        this.socket.on('close', had_error => {
            this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
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
            this.status = interface_1.FLLScoreClient.ConnectionStatus.Connecting;
            this.socket.once('error', err => {
                this.status = interface_1.FLLScoreClient.ConnectionStatus.Disconnected;
                reject(err);
            });
            this.socket.once('data', data => {
                if (contants_1.FLLScoreClientConstants.WELCOME.test(data.toString())) {
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
                console.log('[INTERNAL]Error during send');
                this.close().then(() => {
                    reject(err);
                }).catch(() => {
                    reject(err);
                });
            });
            this.socket.once('data', data => {
                if (contants_1.FLLScoreClientConstants.ECHO.test(data.toString())) {
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
                    console.log('[PREVIEW]' + value);
                    if (contants_1.FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        console.log('[INTERNAL][SCORE] Score Done');
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
                        console.log('[INTERNAL][SCORE] Unexpected command');
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
            this.socket.write('Send Score:\r\n');
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
}
exports.ClientImpl = ClientImpl;
//# sourceMappingURL=clientImpl.js.map