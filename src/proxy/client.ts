import {Socket} from 'net';
import * as FLLScoreClientConstants from '../constants';
import {FLLScoreClient} from '../shared/interface';
import Timer = NodeJS.Timer;

type DataCallback = (str: string) => void;

export class Client implements FLLScoreClient.IClient {
    private static defaults(src: FLLScoreClient.IClientOpts,
                            def: FLLScoreClient.IClientOpts): FLLScoreClient.IClientOpts {
        const val = def;
        if (src.host !== undefined) {
            val.host = src.host;
        }
        if (src.name !== undefined) {
            val.name = src.name;
        }
        if (src.port !== undefined) {
            val.port = src.port;
        }
        if (src.useWatchdog !== undefined) {
            val.useWatchdog = src.useWatchdog;
        }

        return val;
    }

    public lastUpdate?: Date;
    public opts: FLLScoreClient.IClientOpts = {
        host: 'localhost',
        name: 'FLLScoreClient',
        port: 25002,
        useWatchdog: true,
    };
    public scoreInfo?: FLLScoreClient.IScoreInfo;
    public status: number;
    public socket: Socket;

    private watchdogInterval: number;
    private connTest?: Timer;
    private callbackQueues: Map<string, DataCallback[]>;
    private messageBuffer: string;

    constructor(opts?: FLLScoreClient.IClientOpts) {
        if (opts !== undefined) {
            this.opts = Client.defaults(opts, this.opts);
        }

        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
        this.socket = new Socket();
        this.connTest = undefined;
        this.watchdogInterval = 5;

        this.callbackQueues = new Map<string, DataCallback[]>();
        this.callbackQueues.set('welcome', []);
        this.callbackQueues.set('echo', []);
        this.callbackQueues.set('lastUpdate', []);
        this.callbackQueues.set('scoreHeader', []);
        this.callbackQueues.set('score', []);
        this.callbackQueues.set('scoreDone', []);

        this.socket.on('close', () => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });

        this. messageBuffer = '';
        this.socket.on('data', (data) => {
            let message = data.toString();

            // Check for incomplete message, push that onto the buffer and process the rest (if there are any)
            if (!message.endsWith('\r\n')) {
                const lastLine = message.lastIndexOf('\r\n');

                if (lastLine === -1) {
                    // did not find last line, push entire message and wait for more
                    this.messageBuffer += message;
                    return;
                } else {
                    // 1. capture incomplete line,
                    // 2. set message to be the buffer + all complete lines,
                    // 3. set the buffer to the incomplete line.
                    const incompleteLine = message.substring(lastLine + 2);
                    message = this.messageBuffer + message.substring(0, lastLine + 2);
                    this.messageBuffer = incompleteLine;
                }
            } else {
                message = this.messageBuffer + message;
            }

            // Nothing to process, return
            if (message.length === 0) {
                return;
            }

            // Split message into valid commands
            const split = message.trim().split('\r\n');

            // Process each command

            const regexMap: Map<string, RegExp> = new Map<string, RegExp>([
                ['welcome', FLLScoreClientConstants.WELCOME],
                ['echo', FLLScoreClientConstants.ECHO],
                ['lastUpdate', FLLScoreClientConstants.LAST_UPDATE],
                ['scoreHeader', FLLScoreClientConstants.SCORE_HEADER],
                ['score', FLLScoreClientConstants.SCORE],
                ['scoreDone', FLLScoreClientConstants.SCORE_DONE],
            ]);

            split.forEach((line) => {
                let processed = false;
                regexMap.forEach((val, key) => {
                    if (processed) {
                        return;
                    }

                    if (val.test(line)) {
                        processed = true;
                        const arr = this.callbackQueues.get(key);
                        if (arr !== undefined) {
                            const cb = arr.shift();
                            if (cb !== undefined) {
                                cb(line);
                            }
                        }
                    }
                });

                if (!processed) {
                    // console.log('WARNING: Line: ' + line + ' was not processed');
                }
            });
        });
    }

    public connect(): Promise<string> {
        this.status = FLLScoreClientConstants.ConnectionStatus.Connecting;

        return new Promise<string>((resolve, reject) => {

            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('welcome', cb);
                this.socket.emit('close', true);
                reject(new Error('timeout'));
            }, 5000);

            const cb = (data: string) => {
                const raw = data.trim();
                this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                this.resetConnectionTest();
                this.socket.removeListener('error', errorListener);
                clearTimeout(to);
                resolve('Connected');
            };

            const errorListener = (err: Error) => {
                this.removeCallback('welcome', cb);
                clearTimeout(to);
                reject(err);
            };

            this.socket.once('error', errorListener);

            this.socket.connect({
                host: this.opts.host!,
                port: this.opts.port!,
            }, () => {
                this.status = FLLScoreClientConstants.ConnectionStatus.Connected;

                this.pushCallback('welcome', cb);
                this.socket.write('FLLScore:' + this.opts.name + '|Primary\r\n');
            });
        });
    }

    public sendPing(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('echo', cb);
                reject(new Error('timeout'));
            }, 5000);

            const cb = () => {
                this.socket.removeListener('error', errorListener);
                clearTimeout(to);
                resolve('Echo Received');
            };

            const errorListener = (err: Error) => {
                this.removeCallback('echo', cb);
                clearTimeout(to);
                reject(err);
            };

            this.socket.once('error', errorListener);

            this.pushCallback('echo', cb);

            this.socket.write('Ping:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public sendLastUpdate(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            const to = setTimeout(() => {
                this.socket.removeListener('error', errorListener);
                this.removeCallback('lastUpdate', cb);
                reject(new Error('timeout'));
            }, 5000);

            const cb = (data: string) => {
                if (FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    const newDate = new Date(response);
                    this.socket.removeListener('error', errorListener);
                    clearTimeout(to);
                    if (this.lastUpdate === undefined || newDate.getTime() > this.lastUpdate.getTime()) {
                        this.lastUpdate = newDate;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    this.socket.removeListener('error', errorListener);
                    clearTimeout(to);
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            };

            const errorListener = (err: Error) => {
                this.removeCallback('lastUpdate', cb);
                clearTimeout(to);
                reject(err);
            };

            this.socket.once('error', errorListener);

            this.pushCallback('lastUpdate', cb);

            this.socket.write('Send Last Update:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public sendScore(): Promise<FLLScoreClient.IScoreInfo> {
        return new Promise<FLLScoreClient.IScoreInfo>((resolve, reject) => {

            let scheduleInfo: FLLScoreClient.IScheduleInfo;
            const teamInfo: FLLScoreClient.ITeamInfo[] = [];

            const errorListener = (err: Error) => {
                reject(err);
            };

            const scoreDoneCallback = () => {
                const teamDiff = scheduleInfo.numberOfTeams - teamInfo.length;
                if (teamDiff > 0) {
                    // console.log('WARNING: only received ' +
                    //     teamInfo.length + '/' + scheduleInfo.numberOfTeams + ' teams!');
                    const arr = this.callbackQueues.get('score');
                    if (arr !== undefined) {
                        arr.splice(0, teamDiff);
                    }
                }
                this.scoreInfo = { scheduleInfo, teamInfo };
                this.socket.removeListener('error', errorListener);
                resolve(this.scoreInfo);
            };

            const scoreCallback = (value: string) => {
                const content = value.substring(value.indexOf(':') + 1).split('|');
                teamInfo.push({
                    highScore: parseInt(content[2], 10),
                    name: content[1],
                    number: parseInt(content[0], 10),
                    scores: [
                        parseInt(content[3], 10),
                        parseInt(content[4], 10),
                        parseInt(content[5], 10),
                    ],
                });
            };

            const scoreHeaderCallback = (value: string) => {
                const content = value.substring(value.indexOf(':') + 1).split('|');
                scheduleInfo = {
                    lastUpdate: new Date(content[0]),
                    numberOfCompletedMatches: parseInt(content[3], 10),
                    numberOfMatches: parseInt(content[2], 10),
                    numberOfTeams: parseInt(content[1], 10),
                };

                for (let i = 0; i < scheduleInfo.numberOfTeams; i++) {
                    this.pushCallback('score', scoreCallback);
                }
            };

            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                this.socket.removeListener('error', errorListener);
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', errorListener);

            this.pushCallback('scoreHeader', scoreHeaderCallback);
            this.pushCallback('scoreDone', scoreDoneCallback);

            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public close(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                resolve('Connection Closed');
            }

            const errorListener = (err: Error) => {
                reject(err);
            };

            this.socket.once('error', errorListener);

            this.socket.once('close', (hadError) => {
                if (hadError) {
                    this.socket.removeListener('error', errorListener);
                    reject(new Error('Closed with error'));
                } else {
                    this.socket.removeListener('error', errorListener);
                    resolve('Connection Closed');
                }
            });

            this.socket.end();
        });
    }

    private pushCallback(key: string, cb: DataCallback): void {
        const arr = this.callbackQueues.get(key);
        if (arr !== undefined) {
            arr.push(cb);
        }
    }

    private removeCallback(key: string, cb: DataCallback): void {
        const arr = this.callbackQueues.get(key);
        if (arr !== undefined) {
            const index = arr.indexOf(cb, 0);
            if (index > -1) {
                arr.splice(index, 1);
            }
        }
    }

    private resetConnectionTest(): void {
        if (this.connTest !== undefined) {
            clearInterval(this.connTest);
        }

        if (!this.opts.useWatchdog) {
            return;
        }

        this.connTest = setInterval(() => {
            if (this.status === FLLScoreClientConstants.ConnectionStatus.Connected) {
                this.socket.write('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
