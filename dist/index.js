"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Unknown"] = 0] = "Unknown";
    ConnectionStatus[ConnectionStatus["Disconnected"] = 1] = "Disconnected";
    ConnectionStatus[ConnectionStatus["Connecting"] = 2] = "Connecting";
    ConnectionStatus[ConnectionStatus["Connected"] = 3] = "Connected";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
class Client {
    constructor(host = 'localhost', port = 25002) {
        this.host = 'localhost';
        this.port = 25002;
        this.host = host;
        this.port = port;
        this.status = ConnectionStatus.Disconnected;
        this.socket = new net_1.Socket();
    }
    connect() {
        return new Promise((resolve, reject) => {
            reject(new Error('Not yet implemented'));
        });
    }
    sendPing() {
        return new Promise((resolve, reject) => {
            if (this.status !== ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }
            reject(new Error('Not yet implemented!'));
        });
    }
}
exports.Client = Client;
// export function connect(host:string, port:number) {
//
//     let promise = new Promise((resolve, reject) => {
//
//     });
//
//     let socket = new Socket();
//
//     socket.on('data', data => {
//         console.log('received: ' + data);
//     });
//
//
//
//     socket.connect({
//         port: port,
//         host: host
//     }, () => {
//         console.log('connected');
//         socket.write('FLLScore:Client|Primary');
//     });
// } 
