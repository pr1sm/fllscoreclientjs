import * as io from 'socket.io-client';
import {FLLScoreClientConstants} from '../shared/contants';
import {FLLScoreClient} from '../shared/interface';
import Timer = NodeJS.Timer;
import EventEmitter = NodeJS.EventEmitter;

export class WebClient extends EventEmitter implements FLLScoreClient.IWebClient {
    public host: string = 'localhost';
    public port: number = 25002;
    public name: string = 'FLLScoreClient';
    public lastUpdate?: Date;
    public scoreInfo?: FLLScoreClient.IScoreInfo;
    public status: number;
    public socket: SocketIOClient.Socket;

    private useWatchdog: boolean;
    private watchdogInterval: number;
    private connTest?: Timer;

    constructor(host: string = 'localhost', port: number = 25002,
                name: string = 'FLLScoreClient', useWatchdog: boolean = true) {
        super();
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = 0;
        this.socket = io('ws://' + this.host + ':' + this.port, {autoConnect: false});
        this.useWatchdog = useWatchdog;
        this.connTest = undefined;
        this.watchdogInterval = 5;

        this.socket.on('close', () => {
            this.status = 0;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
    }

    public connect(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.status = 1;

            this.socket.once('connect_error', (err: Error) => {
                this.status = 0;
                reject(err);
            });

            this.socket.once('connect_timeout', (err: Error) => {
                this.status = 0;
                reject(err);
            });

            this.socket.once('message', (data: string) => {
                console.log('received: ' + data);
                if (FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    const raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                    this.resetConnectionTest();
                    resolve('Connected');
                } else {
                    this.status = 0;
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });

            this.socket.on('connect', () => {
                console.log('connected');
                this.status = 2;
                this.socket.send('FLLScore:' + this.name + '|Primary\r\n');
            });

            this.socket.connect();
        });
    }

    public sendPing(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err: Error) => {
                reject(err);
            });

            this.socket.send('Ping:\r\n', (data: string) => {
                this.resetConnectionTest();
                if (FLLScoreClientConstants.ECHO.test(data.toString())) {
                    resolve('Echo Received');
                } else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
        });
    }

    public sendLastUpdate(): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err: Error) => {
                reject(err);
            });

            this.socket.send('Send Last Update:\r\n', (data: string) => {
                this.resetConnectionTest();
                if (FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    this.lastUpdate = new Date(response);
                    resolve(this.lastUpdate);
                } else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });
        });
    }

    public sendScore(): Promise<FLLScoreClient.IScoreInfo> {
        return new Promise<FLLScoreClient.IScoreInfo>((resolve, reject) => {

            let intermediateData = '';
            let scheduleInfo: FLLScoreClient.IScheduleInfo;
            const teamInfo: FLLScoreClient.ITeamInfo[] = [];
            const sendScoreDataHandler = (data: Buffer|string) => {
                let raw = data.toString();

                if (!raw.endsWith('\r\n')) {
                    intermediateData += raw;
                    return;
                } else {
                    raw = intermediateData + raw;
                    intermediateData = '';
                }

                const split = raw.trim().split('\r\n');

                split.forEach((value) => {
                    if (FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        this.socket.removeListener('data', sendScoreDataHandler);
                        this.scoreInfo = { scheduleInfo, teamInfo };
                        resolve(this.scoreInfo);
                    } else if (FLLScoreClientConstants.SCORE_HEADER.test(value)) {
                        const content = value.substring(value.indexOf(':') + 1).split('|');
                        scheduleInfo = {
                            lastUpdate: new Date(content[0]),
                            numberOfCompletedMatches: parseInt(content[3], 10),
                            numberOfMatches: parseInt(content[2], 10),
                            numberOfTeams: parseInt(content[1], 10),
                        };
                    } else if (FLLScoreClientConstants.SCORE.test(value)) {
                        const content = value.substring(value.indexOf(':') + 1).split('|');
                        teamInfo.push({
                            highScore: parseInt(content[2], 10),
                            name: content[1],
                            number: parseInt(content[0], 10),
                            scores: [parseInt(content[3], 10), parseInt(content[4], 10), parseInt(content[5], 10)],
                        });
                    } else {
                        // TODO: Deal with invalid command
                    }
                });
            };

            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err: Error) => {
                reject(err);
            });

            this.socket.on('message', sendScoreDataHandler);

            this.socket.send('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public close(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== 2) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err: Error) => {
                reject(err);
            });

            this.socket.once('disconnect', (reason: any) => {
                if (reason) {
                    reject(new Error('Closed with error'));
                } else {
                    resolve('Connection Closed');
                }
            });

            this.socket.close();
        });
    }

    private resetConnectionTest(): void {
        if (this.connTest !== undefined) {
            clearInterval(this.connTest);
        }

        if (!this.useWatchdog) {
            return;
        }

        this.connTest = setInterval(() => {
            if (this.status === 2) {
                this.socket.send('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
