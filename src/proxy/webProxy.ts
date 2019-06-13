import io from 'socket.io';
import * as FLLScoreClient from '../shared/interface';
import {createClient} from './index';

export class WebProxy implements FLLScoreClient.IWebProxy {
    private static defaults(src: FLLScoreClient.IWebProxyOpts,
                            def: FLLScoreClient.IWebProxyOpts): FLLScoreClient.IWebProxyOpts {
        const val = def;
        if (src.infoPollingRate !== undefined) {
            val.infoPollingRate = src.infoPollingRate;
        }
        if (src.socket !== undefined) {
            val.socket = src.socket;
            val.socketOpts = src.socket.opts;
        } else if (src.socketOpts !== undefined) {
            const valOpts = def.socketOpts!;
            if (src.socketOpts.host !== undefined) {
                valOpts.host = src.socketOpts.host;
            }
            if (src.socketOpts.name !== undefined) {
                valOpts.name = src.socketOpts.name;
            }
            if (src.socketOpts.port !== undefined) {
                valOpts.port = src.socketOpts.port;
            }
            if (src.socketOpts.useWatchdog !== undefined) {
                valOpts.useWatchdog = src.socketOpts.useWatchdog;
            }
            val.socketOpts = valOpts;
        }
        if (src.servePort !== undefined) {
            val.servePort = src.servePort;
        }
        if (val.servePort === val.socketOpts!.port) {
            val.servePort = val.socketOpts!.port! + 1;
        }
        if (src.socketIO !== undefined) {
            val.socketIO = src.socketIO;
        }

        return val;
    }

    public createdServer: boolean = false;
    public readonly infoPollingRate: number;
    public readonly servePort: number;
    public readonly socketOpts: FLLScoreClient.IClientOpts;
    public server: SocketIO.Server;

    private clients: SocketIO.Socket[];
    private opts: FLLScoreClient.IWebProxyOpts = {
        infoPollingRate: 30,
        servePort: 25003,
        socketOpts: {
            host: 'localhost',
            name: 'FLLScoreClient',
            port: 25002,
            useWatchdog: true,
        },
    };
    private fllclient: FLLScoreClient.IClient;
    private pollTest?: NodeJS.Timer;

    constructor(opts?: FLLScoreClient.IWebProxyOpts) {
        if (opts !== undefined) {
            this.opts = WebProxy.defaults(opts, this.opts);
        }

        this.clients = [];
        this.fllclient = this.opts!.socket!;
        this.infoPollingRate = this.opts!.infoPollingRate!;
        this.servePort = this.opts!.servePort!;
        this.server = this.opts!.socketIO!;
        this.socketOpts = this.opts!.socketOpts!;

        if (this.fllclient === undefined) {
            this.fllclient = createClient(this.socketOpts);
        }

        if (this.server === undefined) {
            this.createdServer = true;
            this.server = io({
                origins: '*:*',
                pingInterval: 10000,
                pingTimeout: 5000,
                transports: ['polling', 'websocket'],
            });
        }
    }

    public startProxy(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.fllclient.connect().then(() => {
                this.fllclient.socket.on('data', (data) => {
                    console.log('Received:\n\t' + data.toString().trim());
                });

                this.pollTest = setInterval(() => {
                    this.fllclient.sendLastUpdate().then((updated: boolean) => {
                        if (updated) {
                            return this.fllclient.sendScore();
                        } else {
                            return Promise.resolve(undefined);
                        }
                    }).then((info?: FLLScoreClient.IScoreInfo) => {
                        if (info !== undefined) {
                            this.server.emit('lastUpdate', this.fllclient.lastUpdate);
                            this.server.emit('scoreInfo', info);
                        }
                    }).catch((err: Error) => {
                        // TODO: Deal with error
                        console.log(err);
                    });
                }, this.infoPollingRate * 1000);

                this.setupClientListener();

                if (this.createdServer) {
                    this.server.listen(this.servePort);
                    console.log('Listening on port: ' + this.servePort);
                }
                resolve(true);
            }).catch((err) => {
                console.log(err);
                resolve(false);
            });
        });
    }

    public stopProxy(): Promise<string> {
        if (this.pollTest !== undefined) {
            clearInterval(this.pollTest);
        }
        this.closeConnections();
        return this.fllclient.close();
    }

    private closeConnections() {
        this.clients.forEach((client: SocketIO.Socket) => {
            client.disconnect(true);
        });
        this.clients = [];
    }

    private setupClientListener() {
        this.server.on('connection', (client: SocketIO.Socket) => {
            this.clients.push(client);
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
                        this.fllclient.sendLastUpdate().then(() => {
                            client.emit('lastUpdate', this.fllclient.lastUpdate!.toISOString());
                            cb(this.fllclient.lastUpdate!.toISOString());
                        }).catch((err: Error) => {
                            // TODO: Deal with this error
                            console.log(err);
                        });
                    }
                } else {
                    cb(new Error('invalid command'));
                }
            });

            client.on('sendScoreInfo', (m, cb?) => {
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

            client.on('close', () => {
                this.clients.splice(this.clients.indexOf(client), 1);
            });
        });
    }
}
