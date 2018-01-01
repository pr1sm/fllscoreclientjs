import { Socket } from 'net';

const welcomeRegEx = new RegExp('^Welcome:[0-9]+\r\n$');
const echoRegEx = new RegExp('^Echo:\r\n$');
const scoreHeaderRegEx = new RegExp('^Score Header:[a-zA-Z0-9\/:]+(\|[0-9]+){3}\r\n$');
const scoreRegEx = new RegExp('^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}\r\n$');
const scoreDoneRegEx = new RegExp('^Score Done:\r\n$');
const lastUpdateRegEx = new RegExp('^Last Update:.+\r\n$');

export enum ConnectionStatus {
    Unknown,
    Disconnected,
    Connecting,
    Connected
}

export interface IClient {

    connect() : Promise<String>;

    sendPing(): Promise<String>;

    close() : Promise<String>;

    host: string;

    name: string;

    port: number;

    status: ConnectionStatus;

    socket: Socket;
}

export class Client implements IClient {

    host: string = 'localhost';
    port: number = 25002;
    name: string = 'FLLScoreClient';
    status: ConnectionStatus;
    socket: Socket;

    constructor(host: string = 'localhost', port: number = 25002, name: string = 'FLLScoreClient') {
        this.host = host;
        this.port = port;
        this.name = name;
        this.status = ConnectionStatus.Disconnected;
        this.socket = new Socket();

        this.socket.on('data', data => {
            console.log('[INTERNAL]Received: ' + data);
        });

        this.socket.on('close', had_error => {
            this.status = ConnectionStatus.Disconnected;
            if(had_error) {
                console.log('[INTERNAL]Connection Closed due to error: ');
            } else {
                console.log('[INTERNAL]Connection Closed');
            }
        });
    }

    public connect(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            this.status = ConnectionStatus.Connecting;

            this.socket.once('error', err => {
                this.status = ConnectionStatus.Disconnected;
                reject(err);
            });

            this.socket.once('data', data =>  {
                if(welcomeRegEx.test(data.toString())) {
                    resolve('Connected');
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

    public sendPing(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            if(this.status != ConnectionStatus.Connected) {
                reject(new Error('Not Connected'))
            }

            reject(new Error('Not yet implemented!'))
        });
    }

    public close(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            if(this.status != ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('close', had_error => {
               if(had_error) {
                   reject(new Error('Closed with error'));
               } else {
                   resolve('Connection Closed')
               }
            });

            this.socket.end();
        });
    }
}
