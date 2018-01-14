import {EventEmitter} from 'events';
import * as io from 'socket.io-client';
import {FLLScoreClient} from '../shared/interface';

export class WebClient extends EventEmitter implements FLLScoreClient.IWebClient {
    public readonly host: string = 'localhost';
    public readonly port: number = 25003;
    public readonly socket: SocketIOClient.Socket;

    private lastUpdate?: Date;
    private scoreInfo?: FLLScoreClient.IScoreInfo;

    constructor(host: string = 'localhost', port: number = 25003) {
        super();
        this.host = host;
        this.port = port;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;

        const lastColon = this.host.lastIndexOf(':');
        const portTest = this.host.substring(lastColon + 1);
        const hostPort = parseInt(portTest, 10);
        if (lastColon !== -1 && !isNaN(hostPort)) {
            this.port = hostPort;
            console.log('connecting to ' + this.host);
            this.socket = io(this.host, {autoConnect: false});
        } else {
            console.log('connecting to ' + this.host + ':' + this.port);
            this.socket = io(this.host + ':' + this.port, {autoConnect: false});
        }

        this.socket.on('lastUpdate', (res: string|Error) => {
            if (!isNaN(Date.parse(res as string))) {
                this.lastUpdate = new Date(Date.parse(res as string));
                this.emit('lastUpdate', this.lastUpdate);
            } else {
                // TODO: Handle this error
                console.error(res);
            }
        });

        this.socket.on('scoreInfo', (res: FLLScoreClient.IScoreInfo|Error) => {
            if ((res as FLLScoreClient.IScoreInfo).scheduleInfo !== undefined &&
                (res as FLLScoreClient.IScoreInfo).teamInfo !== undefined) {
                this.scoreInfo = res as FLLScoreClient.IScoreInfo;
                this.emit('scoreInfo', this.scoreInfo);
            } else {
                // TODO: Handle this error
                console.error(res);
            }
        });

        this.socket.on('connect', () => {
            console.info('Connected');
        });

        this.socket.on('disconnect', () => {
            console.info('Disconnected');
        });

        this.socket.connect();
    }

    public getLastUpdate(): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            if (this.lastUpdate === undefined) {
                this.socket.emit('sendLastUpdate', 'please', (res: string|Error) => {
                    if (!isNaN(Date.parse(res as string))) {
                        this.lastUpdate = new Date(res as string);
                        resolve(this.lastUpdate);
                    } else {
                        console.error('Rejecting...' + res);
                        reject(res);
                    }
                });
            } else {
                resolve(this.lastUpdate);
            }
        });
    }

    public getScoreInfo(): Promise<FLLScoreClient.IScoreInfo> {
        return new Promise<FLLScoreClient.IScoreInfo>((resolve, reject) => {
            if (this.scoreInfo === undefined) {
                this.socket.emit('sendScoreInfo', 'please', (res: FLLScoreClient.IScoreInfo|Error) => {
                    if ((res as FLLScoreClient.IScoreInfo).scheduleInfo !== undefined &&
                        (res as FLLScoreClient.IScoreInfo).teamInfo !== undefined) {
                        resolve(res as FLLScoreClient.IScoreInfo);
                    } else {
                        reject(res as Error);
                    }
                });
            } else {
                resolve(this.scoreInfo);
            }
        });
    }

    public close(): void {
        this.socket.close();
    }
}
