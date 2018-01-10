import {EventEmitter} from 'events';
import * as io from 'socket.io-client';
import {FLLScoreClient} from '../shared/interface';

export class WebClient extends EventEmitter implements FLLScoreClient.IWebClient {
    public host: string = 'localhost';
    public port: number = 25002;
    public socket: SocketIOClient.Socket;

    private lastUpdate?: Date;
    private scoreInfo?: FLLScoreClient.IScoreInfo;

    constructor(host: string = 'localhost', port: number = 25002) {
        super();
        this.host = host;
        this.port = port;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.socket = io('ws://' + this.host + ':' + this.port);

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
    }

    public getLastUpdate(): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            if (this.lastUpdate === undefined) {
                this.socket.emit('sendLastUpdate', 'please', (res: string|Error) => {
                    if (!isNaN(Date.parse(res as string))) {
                        console.log('getLastUpdate: ' + res);
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
}
