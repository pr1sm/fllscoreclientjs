import {Socket} from 'net';
import * as FLLScoreClientConstants from '../constants';
import {FLLScoreClient} from '../shared/interface';
import Timer = NodeJS.Timer;

export class Client implements FLLScoreClient.IClient {

    public host: string = 'localhost';
    public port: number = 25002;
    public name: string = 'FLLScoreClient';
    public lastUpdate?: Date;
    public scoreInfo?: FLLScoreClient.IScoreInfo;
    public status: number;
    public socket: Socket;

    private useWatchdog: boolean;
    private watchdogInterval: number;
    private connTest?: Timer;

    constructor(host: string = 'localhost', port: number = 25002,
                name: string = 'FLLScoreClient', useWatchdog: boolean = true) {
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
        this.socket = new Socket();
        this.useWatchdog = useWatchdog;
        this.connTest = undefined;
        this.watchdogInterval = 5;

        this.socket.on('close', () => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
            if (this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
        });
    }

    public connect(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.status = FLLScoreClientConstants.ConnectionStatus.Connecting;

            this.socket.once('error', (err) => {
                this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
                reject(err);
            });

            this.socket.once('data', (data) =>  {
                if (FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    const raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':') + 1), 10);
                    this.resetConnectionTest();
                    resolve('Connected');
                } else {
                    this.status = FLLScoreClientConstants.ConnectionStatus.Disconnected;
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });

            this.socket.connect({
                host: this.host,
                port: this.port,
            }, () => {
                this.status = FLLScoreClientConstants.ConnectionStatus.Connected;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }

    public sendPing(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err) => {
                reject(err);
            });

            this.socket.once('data', (data) => {
                if (FLLScoreClientConstants.ECHO.test(data.toString())) {
                    resolve('Echo Received');
                } else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });

            this.socket.write('Ping:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public sendLastUpdate(): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err) => {
                reject(err);
            });

            this.socket.once('data', (data) => {
                if (FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    const raw = data.toString().trim();
                    const response = raw.substring(raw.indexOf(':') + 1);
                    this.lastUpdate = new Date(response);
                    resolve(this.lastUpdate);
                } else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });

            this.socket.write('Send Last Update:\r\n', () => {
                this.resetConnectionTest();
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

            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err) => {
                reject(err);
            });

            this.socket.on('data', sendScoreDataHandler);

            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public close(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.status !== FLLScoreClientConstants.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', (err) => {
                reject(err);
            });

            this.socket.once('close', (hadError) => {
                if (hadError) {
                    reject(new Error('Closed with error'));
                } else {
                    resolve('Connection Closed');
                }
            });

            this.socket.end();
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
            if (this.status === FLLScoreClientConstants.ConnectionStatus.Connected) {
                this.socket.write('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
