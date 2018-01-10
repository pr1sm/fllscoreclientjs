import * as io from 'socket.io';
import {FLLScoreClient} from '../shared/interface';
import {createClient} from './index';

export class WebServer {
    public host: string = 'localhost';
    public port: number = 25002;
    public name: string = 'FLLScoreClient';

    private server: SocketIO.Server;
    private fllclient: FLLScoreClient.IClient;
    private useWatchdog: boolean = true;

    constructor(host: string = 'localhost', port: number = 25002,
                name: string = 'FLLScoreClient', useWatchdog: boolean = true) {
        this.host = host;
        this.port = port;
        this.name = name;
        this.useWatchdog = useWatchdog;

        this.fllclient = createClient(this.host, this.port, this.name, this.useWatchdog);

        this.server = io();
        this.server.on('connection', (client: SocketIO.Socket) => {
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
                    } else {
                        this.fllclient.sendLastUpdate().then((date: Date) => {
                            client.emit('lastUpdate', date.toISOString());
                            cb(date.toISOString());
                        }).catch((err: Error) => {
                            // TODO: Deal with this error
                            console.log(err);
                        });
                    }
                } else {
                    cb(new Error('invalid command'));
                }
            });

            client.on('sendScoreInfo', (m, cb) => {
                if (m === 'please') {
                    if (this.fllclient.scoreInfo !== undefined) {
                        cb(this.fllclient.scoreInfo);
                    } else {
                        this.fllclient.sendScore().then((scoreInfo: FLLScoreClient.IScoreInfo) => {
                            client.emit('scoreInfo', scoreInfo);
                            cb(scoreInfo);
                        }).catch((err: Error) => {
                            // TODO: Deal with this error
                            console.log(err);
                        });
                    }
                } else {
                    cb(new Error('invalid command'));
                }
            });
        });
    }

    public startServer(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.fllclient.connect().then(() => {
                this.server.listen(this.fllclient.port + 1);
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
}
