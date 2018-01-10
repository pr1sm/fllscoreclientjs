import {Socket} from 'net';
import EventEmitter = NodeJS.EventEmitter;

export declare namespace FLLScoreClient {

    export interface ITeamInfo {
        number: number;
        name: string;
        scores: number[];
        highScore: number;
    }

    export interface IScheduleInfo {
        lastUpdate: Date;
        numberOfTeams: number;
        numberOfMatches: number;
        numberOfCompletedMatches: number;
    }

    export interface IScoreInfo {
        scheduleInfo: IScheduleInfo;
        teamInfo: ITeamInfo[];
    }

    export interface IClient {
        readonly host: string;
        readonly name: string;
        readonly port: number;
        readonly lastUpdate?: Date;
        readonly scoreInfo?: IScoreInfo;
        readonly status: number;
        readonly socket: Socket;

        connect(): Promise<string>;
        sendPing(): Promise<string>;
        sendLastUpdate(): Promise<boolean>;
        sendScore(): Promise<IScoreInfo>;
        close(): Promise<string>;
    }

    export interface IClientOpts {
        host?: string;
        name?: string;
        port?: number;
        useWatchdog?: boolean;
    }

    export interface IWebClient extends EventEmitter {
        readonly socket: SocketIOClient.Socket;

        getLastUpdate(): Promise<Date>
        getScoreInfo(): Promise<IScoreInfo>
    }

    export interface IWebProxyOpts {
        host?: string;
        infoPollingRate?: number;
        name?: string;
        port?: number;
        servePort?: number;
        useWatchdog?: boolean;
    }
}
