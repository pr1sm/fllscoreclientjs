import { Socket } from 'net';

export enum ConnectionStatus {
    Unknown,
    Disconnected,
    Connecting,
    Connected
}

export interface IScoreClient {

    connect() : Promise<String>;

    sendPing(): Promise<String>;

    host: string;

    port: number;

    status: ConnectionStatus;

    socket: Socket;
}

export class Client implements IScoreClient {

    host: string = 'localhost';
    port: number = 25002;
    status: ConnectionStatus;
    socket: Socket;

    constructor(host: string = 'localhost', port: number = 25002) {
        this.host = host;
        this.port = port;
        this.status = ConnectionStatus.Disconnected;
        this.socket = new Socket();
    }

    public connect(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            reject(new Error('Not yet implemented'))
        });
    }

    public sendPing(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            if(this.status !== ConnectionStatus.Connected) {
                reject(new Error('Not Connected'))
            }

            reject(new Error('Not yet implemented!'))
        });
    }
}

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