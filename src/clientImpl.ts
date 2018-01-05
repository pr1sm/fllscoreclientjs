import {Socket} from "net";
import {FLLScoreClientConstants} from "./contants";
import {FLLScoreClient} from "./interface";
import Timer = NodeJS.Timer;
import {clearInterval} from "timers";

export class ClientImpl implements FLLScoreClient.Client {

    host: string = 'localhost';
    port: number = 25002;
    name: string = 'FLLScoreClient';
    lastUpdate?: Date;
    scoreInfo?: FLLScoreClient.ScoreInfo;
    status: FLLScoreClient.ConnectionStatus;
    socket: Socket;

    private watchdogInterval:number;
    private connTest?:Timer;

    constructor(host: string = 'localhost', port: number = 25002, name: string = 'FLLScoreClient') {
        this.host = host;
        this.port = port;
        this.name = name;
        this.lastUpdate = undefined;
        this.scoreInfo = undefined;
        this.status = FLLScoreClient.ConnectionStatus.Disconnected;
        this.socket = new Socket();
        this.connTest = undefined;
        this.watchdogInterval = 5;

        this.socket.on('data', data => {
            console.log('[INTERNAL]Received: ' + data.toString().trim());
        });

        this.socket.on('close', had_error => {
            this.status = FLLScoreClient.ConnectionStatus.Disconnected;
            if(this.connTest !== undefined) {
                clearInterval(this.connTest);
            }
            this.connTest = undefined;
            this.watchdogInterval = 5;
            if(had_error) {
                console.log('[INTERNAL]Connection Closed due to error: ');
            } else {
                console.log('[INTERNAL]Connection Closed');
            }
        });
    }

    public connect(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            this.status = FLLScoreClient.ConnectionStatus.Connecting;

            this.socket.once('error', err => {
                this.status = FLLScoreClient.ConnectionStatus.Disconnected;
                reject(err);
            });

            this.socket.once('data', data =>  {
                if(FLLScoreClientConstants.WELCOME.test(data.toString())) {
                    let raw = data.toString().trim();
                    this.watchdogInterval = parseInt(raw.substring(raw.indexOf(':')+1));
                    this.resetConnectionTest();
                    resolve('Connected');
                } else {
                    reject(new Error('Unexpected Message returned: ' + data));
                }
            });

            this.socket.connect({
                port: this.port,
                host: this.host
            }, () => {
                this.status = FLLScoreClient.ConnectionStatus.Connected;
                this.socket.write('FLLScore:' + this.name + '|Primary\r\n');
            });
        });
    }

    public sendPing(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            if(this.status !== FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'))
            }

            this.socket.once('error', err => {
                reject(err);
            });

            this.socket.once('data', data => {
                if(FLLScoreClientConstants.ECHO.test(data.toString())) {
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
            if(this.status !== FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', err => {
                reject(err);
            });

            this.socket.once('data', data => {
                if(FLLScoreClientConstants.LAST_UPDATE.test(data.toString())) {
                    let raw = data.toString().trim();
                    let response = raw.substring(raw.indexOf(':')+1);
                    console.log('[Internal]Received: ' + response);
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

    public sendScore(): Promise<FLLScoreClient.ScoreInfo> {
        return new Promise<FLLScoreClient.ScoreInfo>((resolve, reject) => {

            let intermediateData = '';
            let teamInfo:FLLScoreClient.TeamInfo[] = [];
            let scheduleInfo:FLLScoreClient.ScheduleInfo;
            let sendScoreDataHandler = (data:Buffer|String) => {
                let raw = data.toString();

                if(!raw.endsWith('\r\n')) {
                    intermediateData += raw;
                    return;
                } else {
                    raw = intermediateData + raw;
                    intermediateData = '';
                }

                let split = raw.trim().split('\r\n');

                split.forEach(value => {
                    if(FLLScoreClientConstants.SCORE_DONE.test(value)) {
                        this.socket.removeListener('data', sendScoreDataHandler);
                        this.scoreInfo = {
                            scheduleInfo: scheduleInfo,
                            teamInfo: teamInfo
                        };
                        resolve(this.scoreInfo);
                    } else if(FLLScoreClientConstants.SCORE_HEADER.test(value)) {
                        let content = value.substring(value.indexOf(':') + 1).split('|');
                        scheduleInfo = {
                            lastUpdate: new Date(content[0]),
                            numberOfTeams: parseInt(content[1]),
                            numberOfMatches: parseInt(content[2]),
                            numberOfCompletedMatches: parseInt(content[3])
                        };
                    } else if(FLLScoreClientConstants.SCORE.test(value)) {
                        let content = value.substring(value.indexOf(':') + 1).split('|');
                        teamInfo.push({
                            number: parseInt(content[0]),
                            name: content[1],
                            highScore: parseInt(content[2]),
                            scores: [parseInt(content[3]), parseInt(content[4]), parseInt(content[5])]
                        });
                    } else {
                        console.log('[INTERNAL][SCORE] Unexpected command');
                    }
                });
            };

            if(this.status !== FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', err => {
                reject(err);
            });

            this.socket.on('data', sendScoreDataHandler);

            this.socket.write('Send Score:\r\n', () => {
                this.resetConnectionTest();
            });
        });
    }

    public close(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            if(this.status !== FLLScoreClient.ConnectionStatus.Connected) {
                reject(new Error('Not Connected'));
            }

            this.socket.once('error', err => {
                reject(err);
            });

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

    private resetConnectionTest(): void {
        if(this.connTest !== undefined) {
            clearInterval(this.connTest);
        }

        this.connTest = setInterval(() => {
            if(this.status === FLLScoreClient.ConnectionStatus.Connected) {
                this.socket.write('Ping:\r\n');
            }
        }, this.watchdogInterval * 1000);
    }
}
